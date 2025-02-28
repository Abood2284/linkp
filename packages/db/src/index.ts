import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@repo/db/schema";

// console.log("Node ENV:", process.env.NODE_ENV);
// console.log("Database URL exists:", !!process.env.DATABASE_URL);

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL environment variable is not set");
// }

const sql = neon(
  "postgresql://neondb_owner:RkB5Xm4QjgET@ep-bitter-resonance-a572y6v7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
);
// const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, logger: false, schema: schema });
