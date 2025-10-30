import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const canteenEntries = pgTable("canteen_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company").notNull(),
  meal: text("meal").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  representative: text("representative").notNull(),
  invoiceShipped: boolean("invoice_shipped").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCanteenEntrySchema = createInsertSchema(canteenEntries).omit({
  id: true,
  createdAt: true,
  invoiceShipped: true,
});

export const updateCanteenEntrySchema = z.object({
  invoiceShipped: z.boolean(),
});

export type InsertCanteenEntry = z.infer<typeof insertCanteenEntrySchema>;
export type UpdateCanteenEntry = z.infer<typeof updateCanteenEntrySchema>;
export type CanteenEntry = typeof canteenEntries.$inferSelect;

// Activity log table
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(), // "moved_to_invoiced" or "moved_to_registrations"
  personName: text("person_name").notNull(),
  company: text("company").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  meal: text("meal").notNull(),
  representative: text("representative").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isApproved: true,
  isAdmin: true,
});

// Schema for creating admin users with explicit approval/admin flags
export const insertAdminUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const updateUserSchema = z.object({
  isApproved: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
