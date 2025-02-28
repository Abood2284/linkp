import { Hono } from "hono";
import { Env } from "../index";
import { creators } from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { sql } from "drizzle-orm";

import { withSession } from "../auth/session";

const creatorRoutes = new Hono<{ Bindings: Env }>();

// Debug middleware
creatorRoutes.use("/*", async (c, next) => {
  console.log(`[DEBUG] Creator route accessed: ${c.req.url}`);
  await next();
});

creatorRoutes.get("/health", async (c) => {
  try {
    console.log("Environment Variables:", c.env);

    const databaseUrl = c.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new HTTPException(500, { message: "DATABASE_URL is not set" });
    }

    console.log(`DATABASE_URL: ${databaseUrl}`);

    // Test the database connection with a simple query
    const creatorsCount = await c.req.db
      .select({ count: sql`count(*)` })
      .from(creators)
      .execute();

    return c.json({
      status: 200,
      message: "Database connection healthy",
      count: creatorsCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

creatorRoutes.post("/create", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const { data } = await c.req.json();

      // Execute the insert query
      const result = await c.req.db
        .insert(creators)
        .values(data)
        .onConflictDoNothing()
        .returning()
        .execute();

      console.log("creators /create result: ", result);
      return c.json({
        status: 200,
        data: result,
      });
    } catch (error) {
      console.error("Failed to Insert creator:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to Insert Creator" });
    }
  });
  return handler(c);
});

export default creatorRoutes;
