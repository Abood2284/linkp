import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from '@repo/db/schema';  

const sql = neon(process.env.DATABASE_URL!);
console.log("DATABASE_URL", process.env.DATABASE_URL);
export const db = drizzle({ client: sql, logger: true, schema: schema });
