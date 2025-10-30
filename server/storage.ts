import { db } from "../db";
import { 
  activityLogs, 
  canteenEntries,
  users,
  type ActivityLog, 
  type InsertActivityLog,
  type CanteenEntry,
  type InsertCanteenEntry,
  type UpdateCanteenEntry,
  type User,
  type InsertUser,
  type InsertAdminUser,
  type UpdateUser
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Storage interface
export interface IStorage {
  // Activity logs
  getActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Canteen entries
  getCanteenEntries(): Promise<CanteenEntry[]>;
  createCanteenEntry(entry: InsertCanteenEntry): Promise<CanteenEntry>;
  updateCanteenEntry(id: string, updates: UpdateCanteenEntry): Promise<CanteenEntry | null>;
  
  // Users
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  createAdminUser(user: InsertAdminUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  validatePassword(username: string, password: string): Promise<User | null>;
}

export class DatabaseStorage implements IStorage {
  // Activity logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(insertLog).returning();
    return log;
  }

  // Canteen entries
  async getCanteenEntries(): Promise<CanteenEntry[]> {
    return await db.select().from(canteenEntries).orderBy(desc(canteenEntries.createdAt));
  }

  async createCanteenEntry(insertEntry: InsertCanteenEntry): Promise<CanteenEntry> {
    const [entry] = await db.insert(canteenEntries).values(insertEntry).returning();
    return entry;
  }

  async updateCanteenEntry(id: string, updates: UpdateCanteenEntry): Promise<CanteenEntry | null> {
    const [entry] = await db
      .update(canteenEntries)
      .set(updates)
      .where(eq(canteenEntries.id, id))
      .returning();
    return entry || null;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return user;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async validatePassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}

export const storage = new DatabaseStorage();
