import { db } from "../db";
import { 
  activityLogs, 
  canteenEntries,
  type ActivityLog, 
  type InsertActivityLog,
  type CanteenEntry,
  type InsertCanteenEntry,
  type UpdateCanteenEntry
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // Activity logs
  getActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Canteen entries
  getCanteenEntries(): Promise<CanteenEntry[]>;
  createCanteenEntry(entry: InsertCanteenEntry): Promise<CanteenEntry>;
  updateCanteenEntry(id: string, updates: UpdateCanteenEntry): Promise<CanteenEntry | null>;
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
}

export const storage = new DatabaseStorage();
