import dotenv from "dotenv";
import pg, { QueryResultRow } from "pg";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env and set a local PostgreSQL URL.");
}

export const pool = new Pool({ connectionString });

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await pool.query<T>(text, params);
  return result;
}

export async function closeDb() {
  await pool.end();
}
