import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const canteenEntries = pgTable("canteen_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company").notNull(),
  meal: text("meal").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  representative: text("representative").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCanteenEntrySchema = createInsertSchema(canteenEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertCanteenEntry = z.infer<typeof insertCanteenEntrySchema>;
export type CanteenEntry = typeof canteenEntries.$inferSelect;
