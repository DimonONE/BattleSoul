import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";
import { CommandRegistry } from "./sdk";
import fs from "fs";
import path from "path";

export class RPGBot {
  private bot: TelegramBot;
  private commandRegistry: CommandRegistry;
  private commands: any[];

  constructor(token: string, commandRegistry: CommandRegistry) {
    this.bot = new TelegramBot(token, { polling: true });
    this.commandRegistry = commandRegistry;
    
    // Load commands from JSON
    const commandsPath = path.join(process.cwd(), "commands.json");
    this.commands = JSON.parse(fs.readFileSync(commandsPath, "utf-8"));
    
    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle all text messages
    this.bot.on("message", async (msg) => {
      if (!msg.text || msg.text.startsWith("/")) return;

      const text = msg.text.toLowerCase().trim();
      const sender = msg.from;
      if (!sender) return;

      // Get or create sender
      let senderUser = await storage.getUserByTelegramId(sender.id.toString());
      if (!senderUser) {
        senderUser = await storage.createUser({
          telegramId: sender.id.toString(),
          username: sender.username || sender.first_name || "User",
        });
      }

      // Determine target
      let targetUser = null;
      let targetUsername = "";

      // Check if replying to a message
      if (msg.reply_to_message && msg.reply_to_message.from) {
        const replyTo = msg.reply_to_message.from;
        targetUser = await storage.getUserByTelegramId(replyTo.id.toString());
        if (!targetUser) {
          targetUser = await storage.createUser({
            telegramId: replyTo.id.toString(),
            username: replyTo.username || replyTo.first_name || "User",
          });
        }
        targetUsername = targetUser.username;
      }
      // Check for @username mention
      else if (text.includes("@")) {
        const match = text.match(/@(\w+)/);
        if (match) {
          targetUsername = match[1];
          targetUser = await storage.getUserByUsername(targetUsername);
          if (!targetUser) {
            // Create placeholder user
            targetUser = await storage.createUser({
              telegramId: `temp_${Date.now()}`,
              username: targetUsername,
            });
          }
        }
      }

      if (!targetUser) {
        return; // No valid target
      }

      // Check which command was used
      for (const command of this.commands) {
        if (text.includes(command.name)) {
          await this.executeCommand(
            msg.chat.id,
            command,
            senderUser,
            targetUser
          );
          break;
        }
      }
    });

    console.log("⚔️ BattleSoul RPG Bot is running...");
  }

  private async executeCommand(
    chatId: number,
    command: any,
    sender: any,
    target: any
  ) {
    const handlers = this.commandRegistry.getHandlers(command.name);
    
    let value = 0;
    let responseText = "";

    // Calculate damage/heal
    if (command.damageRange) {
      value = Math.floor(
        Math.random() * (command.damageRange[1] - command.damageRange[0] + 1) +
          command.damageRange[0]
      );
      
      // Apply damage
      const newHp = Math.max(0, target.hp - value);
      await storage.updateUser(target.id, { hp: newHp });
      
      // Update attacker stats
      await storage.updateUser(sender.id, {
        totalDamage: sender.totalDamage + value,
        totalBattles: sender.totalBattles + 1,
        wins: newHp === 0 ? sender.wins + 1 : sender.wins,
      });

      // Update target stats
      await storage.updateUser(target.id, {
        totalBattles: target.totalBattles + 1,
      });

      responseText = `${command.emoji} @${sender.username} атакує @${target.username} — ${value} шкоди! 💥\nHP: ${newHp}/${target.maxHp}`;
      
      // Save battle
      await storage.createBattle({
        attackerId: sender.id,
        targetId: target.id,
        command: command.name,
        emoji: command.emoji,
        value,
        type: command.type,
      });
    } else if (command.healRange) {
      value = Math.floor(
        Math.random() * (command.healRange[1] - command.healRange[0] + 1) +
          command.healRange[0]
      );
      
      // Apply heal
      const newHp = Math.min(target.maxHp, target.hp + value);
      await storage.updateUser(target.id, { hp: newHp });

      responseText = `${command.emoji} @${sender.username} зцілив @${target.username} на ${value} HP! 🌿\nHP: ${newHp}/${target.maxHp}`;
      
      // Save battle
      await storage.createBattle({
        attackerId: sender.id,
        targetId: target.id,
        command: command.name,
        emoji: command.emoji,
        value,
        type: command.type,
      });
    } else if (command.type === "curse") {
      value = Math.floor(Math.random() * 10) + 5;
      responseText = `${command.emoji} @${sender.username} прокляв @${target.username} — сила зменшилась на ${value}%! 🌀`;
      
      // Save battle
      await storage.createBattle({
        attackerId: sender.id,
        targetId: target.id,
        command: command.name,
        emoji: command.emoji,
        value,
        type: command.type,
      });
    } else if (command.type === "defense") {
      responseText = `${command.emoji} @${sender.username} підвищує захист! Наступна атака буде ослаблена! ✨`;
    }

    // Send response
    await this.bot.sendMessage(chatId, responseText);

    // Call SDK handlers
    if (handlers.length > 0) {
      const ctx = {
        sender: sender.username,
        target: target.username,
        damage: value,
        command: command.name,
        emoji: command.emoji,
        reply: (text: string) => this.bot.sendMessage(chatId, text),
      };

      for (const handler of handlers) {
        await handler(ctx);
      }
    }
  }

  getBot() {
    return this.bot;
  }
}
