import { db } from "../db";
import { activityLogs, type ActivityLog, type InsertActivityLog } from "@shared/schema";
import { desc } from "drizzle-orm";

// Storage interface for activity logs
export interface IStorage {
  getActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
}

export class DatabaseStorage implements IStorage {
  async getActivityLogs(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(insertLog).returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
