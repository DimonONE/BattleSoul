import {
  users,
  pets,
  battles,
  type User,
  type InsertUser,
  type Pet,
  type InsertPet,
  type Battle,
  type InsertBattle,
} from "@shared/schema";
import { eq, or, desc } from "drizzle-orm";
import { db } from "./db"; 
import { IStorage } from "./mem";

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    console.log("user", user);
    
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // 🐾 PETS
  async getPet(id: string): Promise<Pet | undefined> {
    const [pet] = await db.select().from(pets).where(eq(pets.id, id));
    return pet;
  }

  async getPetsByUserId(userId: string): Promise<Pet[]> {
    return await db.select().from(pets).where(eq(pets.userId, userId));
  }

  async createPet(pet: InsertPet): Promise<Pet> {
    const [newPet] = await db.insert(pets).values(pet).returning();
    return newPet;
  }

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet | undefined> {
    const [updated] = await db.update(pets).set(updates).where(eq(pets.id, id)).returning();
    return updated;
  }

  // ⚔️ BATTLES
  async createBattle(battle: InsertBattle): Promise<Battle> {
    const [newBattle] = await db.insert(battles).values(battle).returning();
    return newBattle;
  }

  async getRecentBattles(limit: number = 20): Promise<Battle[]> {
    return await db.select().from(battles).orderBy(desc(battles.createdAt)).limit(limit);
  }

  async getBattlesByUserId(userId: string, limit: number = 20): Promise<Battle[]> {
    return await db
      .select()
      .from(battles)
      .where(or(eq(battles.attackerId, userId), eq(battles.targetId, userId)))
      .orderBy(desc(battles.createdAt))
      .limit(limit);
  }
}
