import { Hono } from "hono";
import { Env } from "../index";
import { users, workspaces } from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { eq, sql } from "drizzle-orm";
import { APIResponse } from "@repo/db/types";

const workspaceRoutes = new Hono<{ Bindings: Env }>();

// Debug middleware
workspaceRoutes.use("/*", async (c, next) => {
  console.log(`[DEBUG] Workspace route accessed: ${c.req.url}`);
  await next();
});

workspaceRoutes.get("/health", async (c) => {
  try {
    console.log(`DATABASE_URL: ${c.env.DATABASE_URL}`);

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

workspaceRoutes.post("/verify-slug", async (c) => {
  try {
    const { workspaceSlug } = await c.req.json();
    console.log("workspaceSlug", workspaceSlug);

    const isWorkspaceExist = await c.req.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, workspaceSlug))
      .limit(1);

    console.log(
      isWorkspaceExist.length > 0
        ? "This slug is already taken. Please choose a different one."
        : "Slug is available"
    );

    const response: APIResponse = {
      status: "success",
      data: isWorkspaceExist.length > 0,
      message:
        isWorkspaceExist.length > 0
          ? "This slug is already taken. Please choose a different one."
          : "",
    };

    return c.json(response);
  } catch (error) {
    console.error("Failed to verify workspace slug:", error);
    const errorResponse = {
      status: "error",
      message: "Failed to verify workspace slug",
    };
    return c.json(errorResponse, 500);
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
