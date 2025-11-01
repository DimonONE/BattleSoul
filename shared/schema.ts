import { sql } from "drizzle-orm";
import { pgTable, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  username: text("username").notNull(),
  hp: integer("hp").notNull().default(100),
  maxHp: integer("max_hp").notNull().default(100),
  xp: integer("xp").notNull().default(0),
  lvl: integer("lvl").notNull().default(1),
  lastAction: timestamp("last_action"),
  wins: integer("wins").notNull().default(0),
  totalBattles: integer("total_battles").notNull().default(0),
  totalDamage: integer("total_damage").notNull().default(0),
  status: text("status").default("⚔️ Готовий до бою"),
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
