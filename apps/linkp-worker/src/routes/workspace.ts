import { Hono } from "hono";
import { Env } from "../index";
import { users, workspaces } from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { eq, sql } from "drizzle-orm";

const workspaceRoutes = new Hono<{ Bindings: Env }>();

// Debug middleware
workspaceRoutes.use("/*", async (c, next) => {
  console.log(`[DEBUG] Workspace route accessed: ${c.req.url}`);
  await next();
});

workspaceRoutes.get("/health", async (c) => {
  try {
    // Test the database connection with a simple query
    const workspacesCount = await c.req.db
      .select({ count: sql`count(*)` })
      .from(users)
      .execute();

    return c.json({
      status: "success",
      message: "Database connection healthy",
      count: workspacesCount[0].count,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

workspaceRoutes.get("/verify-slug", async (c) => {
  try {
    const { workspaceSlug } = await c.req.json();

    const isWorkspaceExist = await c.req.db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, workspaceSlug))
      .limit(1);

    return c.json({
      status: "success",
      data: isWorkspaceExist.length > 0,
    });
  } catch (error) {
    console.error("Failed to verify workspace slug:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: "Failed to verify workspace slug",
    });
  }
});

workspaceRoutes.post("/create", async (c) => {
  try {
    const { data } = await c.req.json();
    console.log("data", data);

    // Execute the insert query
    const result = await c.req.db
      .insert(workspaces)
      .values(data)
      .onConflictDoNothing()
      .returning()
      .execute();

    return c.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Failed to create workspace:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "Failed to create workspace" });
  }
});

export default workspaceRoutes;
