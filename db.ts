import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };
export const pool = globalForPg.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
});
if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;
export async function query<T = any>(text: string, params: any[] = []) {
  return pool.query<T>(text, params);
}
