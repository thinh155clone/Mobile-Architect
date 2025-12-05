import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { scans, type Scan, type InsertScan } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  createScan(scan: InsertScan): Promise<Scan>;
  getAllScans(): Promise<Scan[]>;
  getScan(id: string): Promise<Scan | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db.insert(scans).values(insertScan).returning();
    return scan;
  }

  async getAllScans(): Promise<Scan[]> {
    return await db.select().from(scans).orderBy(desc(scans.scannedAt));
  }

  async getScan(id: string): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }
}

export const storage = new DatabaseStorage();
