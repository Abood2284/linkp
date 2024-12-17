import { users } from "@repo/db/schema";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@repo/db/schema";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: "development" | "staging" | "production";
  CORS_ORIGIN: string;
};

export type Variables = {
  db: NeonHttpDatabase<typeof schema>;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: Variables;
};
