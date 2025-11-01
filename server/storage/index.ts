import { InsertBattle, InsertPet, InsertUser, Pet, User } from "@shared/schema";
import { PostgresStorage } from "./pg";
import { IStorage, MemStorage } from "./mem";

export class HybridStorage implements IStorage {
  private mem: MemStorage;
  private pg: PostgresStorage;

  constructor(mem: MemStorage, pg: PostgresStorage) {
    this.mem = mem;
    this.pg = pg;
  }

  async getUser(id: string) {
    let user = await this.mem.getUser(id);
    if (!user) user = await this.pg.getUser(id);
    return user;
  }

  async getUserByTelegramId(telegramId: string) {
    let user = await this.mem.getUserByTelegramId(telegramId);
    if (!user) user = await this.pg.getUserByTelegramId(telegramId);
    return user;
  }

  async getUserByUsername(username: string) {
    let user = await this.mem.getUserByUsername(username);
    if (!user) user = await this.pg.getUserByUsername(username);
    return user;
  }

  async createUser(user: InsertUser) {
    const created = await this.pg.createUser(user);
    await this.mem.createUser(created);
    return created;
  }

  async updateUser(id: string, updates: Partial<User>) {
    const updated = await this.pg.updateUser(id, updates);
    if (updated) await this.mem.updateUser(id, updates);
    return updated;
  }

  async getAllUsers() {
    return this.mem.getAllUsers();
  }

  // Pets
  async getPet(id: string) {
    let pet = await this.mem.getPet(id);
    if (!pet) pet = await this.pg.getPet(id);
    return pet;
  }

  async getPetsByUserId(userId: string) {
    let pets = await this.mem.getPetsByUserId(userId);
    if (pets.length === 0) pets = await this.pg.getPetsByUserId(userId);
    return pets;
  }

  async createPet(pet: InsertPet) {
    const created = await this.pg.createPet(pet);
    await this.mem.createPet(created);
    return created;
  }

  async updatePet(id: string, updates: Partial<Pet>) {
    const updated = await this.pg.updatePet(id, updates);
    if (updated) await this.mem.updatePet(id, updates);
    return updated;
  }

  // Battles
  async createBattle(battle: InsertBattle) {
    const created = await this.pg.createBattle(battle);
    await this.mem.createBattle(created);
    return created;
  }

  async getRecentBattles(limit = 20) {
    return this.mem.getRecentBattles(limit);
  }

  async getBattlesByUserId(userId: string, limit = 20) {
    return this.mem.getBattlesByUserId(userId, limit);
  }
}

const memStorage = new MemStorage();
const pgStorage = new PostgresStorage();
export const storage = new HybridStorage(memStorage, pgStorage);