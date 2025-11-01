// SDK for BattleSoul RPG Bot
// Provides useCommand hook for easy command registration

export interface CommandContext {
  sender: string;
  target: string;
  damage: number;
  command: string;
  emoji: string;
  reply: (text: string) => Promise<any>;
}

export type CommandHandler = (ctx: CommandContext) => void | Promise<void>;

export class CommandRegistry {
  private handlers: Map<string, CommandHandler[]> = new Map();

  register(commandName: string, handler: CommandHandler) {
    const existing = this.handlers.get(commandName) || [];
    existing.push(handler);
    this.handlers.set(commandName, existing);
  }

  getHandlers(commandName: string): CommandHandler[] {
    return this.handlers.get(commandName) || [];
  }
}

// Global registry instance
export const commandRegistry = new CommandRegistry();

// useCommand hook for easy command registration
export function useCommand(commandName: string, handler: CommandHandler) {
  commandRegistry.register(commandName, handler);
  console.log(`✓ Command registered: ${commandName}`);
}

// Example usage (to be used in application):
// useCommand('атака', (ctx) => {
//   ctx.reply(`⚔️ ${ctx.sender} атакує ${ctx.target} — ${ctx.damage} шкоди!`);
// });
