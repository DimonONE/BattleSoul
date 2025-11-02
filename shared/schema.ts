import { sql } from "drizzle-orm";
import { pgTable, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),

  // Основные статы
  hp: integer("hp").notNull().default(100),
  maxHp: integer("max_hp").notNull().default(100),
  strength: integer("strength").notNull().default(10),
  defense: integer("defense").notNull().default(5),
  agility: integer("agility").notNull().default(5),
  intelligence: integer("intelligence").notNull().default(5),

  // RPG прогресс
  xp: integer("xp").notNull().default(0),
  lvl: integer("lvl").notNull().default(1),

  // Игровая статистика
  lastAction: timestamp("last_action"),
  wins: integer("wins").notNull().default(0),
  totalBattles: integer("total_battles").notNull().default(0),
  totalDamage: integer("total_damage").notNull().default(0),

  // Баланс и инвентарь
  coins: integer("coins").notNull().default(0),
  inventory: text("inventory").default("[]"), // JSON массив предметов

  status: text("status").default("⚔️ Готовий до бою"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  strength: integer("strength").default(0),
  defense: integer("defense").default(0),
  agility: integer("agility").default(0),
  intelligence: integer("intelligence").default(0),
  price: integer("price").notNull().default(0),
  emoji: text("emoji"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userItems = pgTable("user_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: varchar("item_id").notNull().references(() => items.id),
  quantity: integer("quantity").notNull().default(1),
  equipped: boolean("equipped").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pets = pgTable("pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  level: integer("level").notNull().default(1),
  hp: integer("hp").notNull().default(50),
  maxHp: integer("max_hp").notNull().default(50),
  strength: integer("strength").notNull().default(10),
  evolutionStage: integer("evolution_stage").notNull().default(1),
  maxEvolutionStage: integer("max_evolution_stage").notNull().default(5),
  owned: boolean("owned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attackerId: varchar("attacker_id").notNull().references(() => users.id),
  targetId: varchar("target_id").notNull().references(() => users.id),
  command: text("command").notNull(),
  emoji: text("emoji").notNull(),
  value: integer("value").notNull(),
  type: text("type").notNull(), // damage, heal, curse
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battles.$inferSelect;
