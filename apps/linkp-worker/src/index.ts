import { neon } from "@neondatabase/serverless";
import * as schema from "@repo/db/schema";
import { NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import devRoutes from "./routes/dev";
import templateRoutes from "./routes/template";
import userRoutes from "./routes/user";
import workspaceRoutes from "./routes/workspace";

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: "development" | "staging" | "production";
  CORS_ORIGIN: string;
};

// Extend HonoRequest to include database instance
declare module "hono" {
  interface HonoRequest {
    db: NeonHttpDatabase<typeof schema>;
  }
}

// Create Hono app instance with typed environment
const app = new Hono<{ Bindings: Env }>();

// Error handling middleware
const errorHandler = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error("Unhandled error:", error);

    return c.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: c.env.NODE_ENV === "development" ? error : undefined,
      },
      500
    );
  }
});

// Database injection middleware
export const injectDB = createMiddleware(async (c, next) => {
  try {
    console.log(`Connecting to database...${c.env.DATABASE_URL}`);

    const sql = neon(c.env.DATABASE_URL);

    c.req.db = drizzle({ client: sql, schema });

    await next();
  } catch (error) {
    console.error("Database connection error:", error);
    throw new HTTPException(503, { message: "Database connection failed" });
  }
});

// Enhanced CORS configuration with hardcoded origins
const configureCORS = () => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://linkp-website.pages.dev",
    "https://linkp.co",
  ];

  return cors({
    origin: (origin) => {
      // Allow if the origin is in the list of allowed origins
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // Default to the first origin in the list if the origin is null or not specified
      if (!origin) {
        return allowedOrigins[0];
      }

      // Block requests if the origin does not match any of the allowed origins
      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
  });
};

// Apply CORS middleware
app.use("*", async (c, next) => {
  console.log(`[DEBUG] Applying CORS middleware for: ${c.req.url}`);
  const corsMiddleware = configureCORS();
  return corsMiddleware(c, next);
});

// Apply error handling middleware globally
app.use("/*", errorHandler);

// Apply database injection middleware globally
app.use("/api/*", injectDB);

// Routes
app.route("/api/user", userRoutes);
app.route("/api/workspace", workspaceRoutes);
app.route("/api/template", templateRoutes);
app.route("/api/dev", devRoutes);

app.get("/", async (c) => {
  return c.json({ status: 200, message: "Healthy All System Working" });
});

export default app;
