import { defineConfig } from "drizzle-kit";

console.log("=== Drizzle Config ===");
// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "../../packages/db/src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // url: "postgresql://neondb_owner:RkB5Xm4QjgET@ep-bitter-resonance-a572y6v7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
});
