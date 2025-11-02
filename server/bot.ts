import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";
import { CommandRegistry } from "./sdk";
import fs from "fs";
import path from "path";
import { ioSocket } from "./routes";

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
    this.bot.onText(/\/start/, async (msg) => {
      const sender = msg.from;
      if (!sender) return;

      let senderUser = await storage.getUserByTelegramId(sender.id.toString());
      let senderUserAvatar = await this.getUserAvatar(sender.id);

      if (senderUser) {
        await this.bot.sendMessage(
          msg.chat.id,
          `👋 Вітаю знову, ${senderUser.username}! Готовий продовжувати свої пригоди? ⚔️✨`
        );
        return;
      }

      senderUser = await storage.createUser({
        telegramId: sender.id.toString(),
        username: sender.username || sender.first_name || "Герой",
        avatar: senderUserAvatar,
      });

      await this.bot.sendMessage(
        msg.chat.id,
        `🛡️ Ласкаво просимо, ${senderUser.username}! Твоя епічна пригода в світі BattleSoul починається! ⚔️🔥`
      );
    });

    // Handler messages
    this.bot.on("message", async (msg) => {
      if (!msg.text || msg.text.startsWith("/")) return;

      const text = msg.text.toLowerCase().trim();
      const sender = msg.from;
      if (!sender) return;
       
      // Get or create sender
      let senderUser = await storage.getUserByTelegramId(sender.id.toString());
      let senderUserAvatar =  await this.getUserAvatar(sender.id);
      if (!senderUser) {
        senderUser = await storage.createUser({
          telegramId: sender.id.toString(),
          username: sender.username || sender.first_name || "User",
          avatar: senderUserAvatar,
        });
      }

      // Determine target
      let targetUser = null;
      let targetUsername = "";

      // Check if replying to a message
      if (msg.reply_to_message && msg.reply_to_message.from) {
        const replyTo = msg.reply_to_message.from;
        targetUser = await storage.getUserByTelegramId(replyTo.id.toString());
        if (sender.id === replyTo.id ) return;
        if (!targetUser) {
          targetUser = await storage.createUser({
            telegramId: replyTo.id.toString(),
            username: replyTo.username || replyTo.first_name || "User",
            avatar: senderUserAvatar,
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
              avatar: senderUserAvatar,
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

    // Ensure users exist in storage
    const ensureUser = async (user: any) => {
      let dbUser = await storage.getUser(user.id);
      if (!dbUser) {
        dbUser = await storage.createUser({
          telegramId: user.telegramId.toString(),
          username: user.username,
          avatar: user.avatar,
        });
      }
      return dbUser;
    };

    const senderInDb = await ensureUser(sender);
    const targetInDb = await ensureUser(target);

    if (command.damageRange && targetInDb.hp === 0) {
      await this.bot.sendMessage(
        chatId,
        `❌ @${targetInDb.username} вже повністю побитий! Атака неможлива.`
      );
      return;
    }

    let value = 0;
    let responseText = "";

    const saveBattle = async () => {
      const battle = await storage.createBattle({
        attackerId: senderInDb.id,
        targetId: targetInDb.id,
        command: command.name,
        emoji: command.emoji,
        value,
        type: command.type,
      });
      ioSocket.emit("battle:created", battle);
    };

    const formatResponse = (templates: string[]) => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      return template
        .replace("{sender}", senderInDb.username)
        .replace("{target}", targetInDb.username)
        .replace("{value}", value.toString());
    };

    // Урон
    if (command.damageRange) {
      value = Math.floor(
        Math.random() * (command.damageRange[1] - command.damageRange[0] + 1) +
          command.damageRange[0]
      );

      // Критический удар
      const isCritical = Math.random() < 0.15;
      if (isCritical) {
        const critBonus = Math.floor(value * (0.4 + Math.random() * 0.3));
        value += critBonus;
      }

      const newHp = Math.max(0, targetInDb.hp - value);
      await storage.updateUser(targetInDb.id, { hp: newHp });

      // Update stats
      await storage.updateUser(senderInDb.id, {
        totalDamage: senderInDb.totalDamage + value,
        totalBattles: senderInDb.totalBattles + 1,
        wins: newHp === 0 ? senderInDb.wins + 1 : senderInDb.wins,
      });
      await storage.updateUser(targetInDb.id, {
        totalBattles: targetInDb.totalBattles + 1,
      });

      responseText = formatResponse(command.responses);
      if (isCritical) responseText += " <b>Це був критичний удар!</b>!";
      
      await saveBattle();
    }
    else if (command.healRange) {
      value = Math.floor(
        Math.random() * (command.healRange[1] - command.healRange[0] + 1) +
          command.healRange[0]
      );
      const newHp = Math.min(targetInDb.maxHp, targetInDb.hp + value);
      await storage.updateUser(targetInDb.id, { hp: newHp });

      responseText = formatResponse(command.responses);

      await saveBattle();
    }
    else if (command.type === "curse") {
      value = Math.floor(Math.random() * 10) + 5;
      responseText = formatResponse(command.responses );
      await saveBattle();
    }
    else if (command.type === "defense") {
      responseText = formatResponse(command.responses );
    }

    if (command.image) {
      await this.bot.sendPhoto(chatId, command.image, { caption: responseText} );
    } else {
      await this.bot.sendMessage(chatId, responseText);
    }

    if (handlers.length > 0) {
      const ctx = {
        sender: senderInDb.username,
        target: targetInDb.username,
        damage: value,
        command: command.name,
        emoji: command.emoji,
        reply: (text: string) => this.bot.sendMessage(chatId, text, { parse_mode:"HTML" } ),
      };
      for (const handler of handlers) {
        await handler(ctx);
      }
    }
  }


  private async getUserAvatar(userId: number) {
    try {
      const photos = await this.bot.getUserProfilePhotos(userId, { limit: 1 });
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id; // берем первый вариант размера
        const fileLink = await this.bot.getFileLink(fileId);
        return fileLink; // ссылка на изображение
      }
      return null; // нет фото
    } catch (err) {
      console.error("Ошибка при получении аватара:", err);
      return null;
    }
  }

  getBot() {
    return this.bot;
  }
}
