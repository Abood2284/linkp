import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@repo/db/schema";

console.log("Node ENV:", process.env.NODE_ENV);
console.log("Database URL exists:", !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, logger: true, schema: schema });
