import { type User, type InsertUser, type Pet, type InsertPet, type Battle, type InsertBattle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Pets
  getPet(id: string): Promise<Pet | undefined>;
  getPetsByUserId(userId: string): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: string, pet: Partial<Pet>): Promise<Pet | undefined>;
  
  // Battles
  createBattle(battle: InsertBattle): Promise<Battle>;
  getRecentBattles(limit?: number): Promise<Battle[]>;
  getBattlesByUserId(userId: string, limit?: number): Promise<Battle[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pets: Map<string, Pet>;
  private battles: Map<string, Battle>;

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.battles = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      avatar: insertUser.avatar ?? "",
      hp: insertUser.hp ?? 100,
      maxHp: insertUser.maxHp ?? 100,
      xp: insertUser.xp ?? 0,
      lvl: insertUser.lvl ?? 1,
      wins: insertUser.wins ?? 0,
      totalBattles: insertUser.totalBattles ?? 0,
      totalDamage: insertUser.totalDamage ?? 0,
      status: insertUser.status ?? "⚔️ Готовий до бою",
      lastAction: insertUser.lastAction ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Pets
  async getPet(id: string): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async getPetsByUserId(userId: string): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(
      (pet) => pet.userId === userId,
    );
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = randomUUID();
    const pet: Pet = {
      ...insertPet,
      id,
      level: insertPet.level ?? 1,
      hp: insertPet.hp ?? 50,
      maxHp: insertPet.maxHp ?? 50,
      strength: insertPet.strength ?? 10,
      evolutionStage: insertPet.evolutionStage ?? 1,
      maxEvolutionStage: insertPet.maxEvolutionStage ?? 5,
      owned: insertPet.owned ?? false,
      createdAt: new Date(),
    };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    if (!pet) return undefined;
    
    const updatedPet = { ...pet, ...updates };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  // Battles
  async createBattle(insertBattle: InsertBattle): Promise<Battle> {
    const id = randomUUID();
    const battle: Battle = {
      ...insertBattle,
      id,
      createdAt: new Date(),
    };
    this.battles.set(id, battle);
    return battle;
  }

  async getRecentBattles(limit: number = 20): Promise<Battle[]> {
    const allBattles = Array.from(this.battles.values());
    return allBattles
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() ?? 0;
        const bTime = b.createdAt?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  async getBattlesByUserId(userId: string, limit: number = 20): Promise<Battle[]> {
    const userBattles = Array.from(this.battles.values()).filter(
      (battle) => battle.attackerId === userId || battle.targetId === userId,
    );
    return userBattles
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() ?? 0;
        const bTime = b.createdAt?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
