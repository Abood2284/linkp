import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";


const sql = neon(process.env.DATABASE_URL!);
console.log("DATABASE_URL", process.env.DATABASE_URL);
export const db = drizzle({ client: sql, logger: true });
