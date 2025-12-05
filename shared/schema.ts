import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  profileUrl: text("profile_url").notNull(),
  avatarUrl: text("avatar_url"),
  riskScore: integer("risk_score").notNull(),
  riskLevel: text("risk_level").notNull(),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
  stats: jsonb("stats").notNull().$type<{ posts: number; followers: number; following: number }>(),
  findings: jsonb("findings").notNull().$type<Array<{
    id: string;
    type: string;
    value: string;
    location: string;
    severity: string;
  }>>(),
  recommendations: jsonb("recommendations").notNull().$type<string[]>(),
});

export const insertScanSchema = createInsertSchema(scans).omit({
  id: true,
  scannedAt: true,
});

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;
