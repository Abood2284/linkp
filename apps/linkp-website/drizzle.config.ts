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
  // url: "postgresql://linkp-db_owner:ECyDGV14vBrf@ep-old-sky-a1nfjuhk.ap-southeast-1.aws.neon.tech/linkp-db?sslmode=require",
});
