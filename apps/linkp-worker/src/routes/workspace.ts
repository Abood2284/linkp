import { Hono } from "hono";
import { Env, injectDB } from "../index";
import { InsertWorkspace, users, workspaces } from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { sql } from "drizzle-orm";

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

workspaceRoutes.post("/create", async (c) => {
  try {
    const { templateId, workspace, workspaceSlug, links } = await c.req.json();
    console.log("data", templateId, workspace, workspaceSlug, links);

    const newWorkspace: InsertWorkspace = {
      name: workspace,
      slug: workspaceSlug,
      templateId,
        
    };
    // Execute the insert query
    const result = await c.req.db
      .insert(workspaces)
      .values(data)
      .returning()
      .execute();

    return c.json({
      status: "success",
      // data: result,
    });
  } catch (error) {
    console.error("Failed to create workspace:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "Failed to create workspace" });
  }
});

export default workspaceRoutes;
