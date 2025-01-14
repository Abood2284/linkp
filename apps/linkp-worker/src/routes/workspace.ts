import { Hono } from "hono";
import { Env } from "../index";
import {
  aggregatedMetrics,
  InsertWorkspaceLink,
  linkEvents,
  users,
  workspaceLinks,
  workspaces,
} from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { eq, sql } from "drizzle-orm";
import {
  APIResponse,
  ExpandedWorkspaceData,
  WorkspaceSlugResponse,
  WorkspaceType,
} from "@repo/db/types";
import { withSession } from "../auth/session";

const workspaceRoutes = new Hono<{ Bindings: Env }>();

// Debug middleware
workspaceRoutes.use("/*", async (c, next) => {
  console.log(`[DEBUG] Workspace route accessed: ${c.req.url}`);
  await next();
});

workspaceRoutes.get("/health", async (c) => {
  try {
    console.log("Environment Variables:", c.env);

    const databaseUrl = c.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new HTTPException(500, { message: "DATABASE_URL is not set" });
    }

    console.log(`DATABASE_URL: ${databaseUrl}`);

    // Test the database connection with a simple query
    const workspacesCount = await c.req.db
      .select({ count: sql`count(*)` })
      .from(users)
      .execute();

    return c.json({
      status: 200,
      message: "Database connection healthy",
      count: workspacesCount[0]?.count || 0,
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

    const response: WorkspaceSlugResponse = {
      status: isWorkspaceExist.length > 0 ? 400 : 200,
      data: isWorkspaceExist.length > 0 ? false : true,
      message:
        isWorkspaceExist.length > 0
          ? "This slug is already taken. Please choose a different one."
          : "",
    };

    return c.json(response);
  } catch (error) {
    console.error("Failed to verify workspace slug:", error);
    const errorResponse = {
      status: 500,
      message: "Failed to verify workspace slug",
    };
    return c.json(errorResponse, 500);
  }
});

workspaceRoutes.post("/create", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const { data } = await c.req.json();

      // Execute the insert query
      const result = await c.req.db
        .insert(workspaces)
        .values(data)
        .onConflictDoNothing()
        .returning()
        .execute();

      //  update the user's onboarding status
      const user = await c.req.db
        .update(users)
        .set({ onboardingCompleted: true, defaultWorkspace: result[0].slug })
        .where(eq(users.id, data.userId))
        .returning();

      // update the user's default workspace if there is no default workspace
      if (session?.user?.defaultWorkspace === null) {
        await c.req.db
          .update(users)
          .set({ defaultWorkspace: result[0].id })
          .where(eq(users.id, data.userId))
          .execute();
      }

      console.log("result", result);
      return c.json({
        status: 200,
        data: result,
      });
    } catch (error) {
      console.error("Failed to create workspace:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to create workspace" });
    }
  });
  return handler(c);
});

workspaceRoutes.get("/links/max-order", async (c) => {
  try {
    const databaseUrl = c.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new HTTPException(500, { message: "DATABASE_URL is not set" });
    }

    const maxOrder = await c.req.db
      .select({ order: workspaceLinks.order })
      .from(workspaceLinks)
      .limit(1);

    console.log("Max order:", maxOrder);
    2;
    return c.json({
      status: 200,
      message: "Database connection healthy",
      data: maxOrder.length,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

workspaceRoutes.patch("/links/update", async (c) => {
  try {
    const data: InsertWorkspaceLink = await c.req.json();
    console.log("Update Workspace Link Data 🚧: ", data);

    const result = await c.req.db
      .update(workspaceLinks)
      .set(data)
      .where(eq(workspaceLinks.id, data.id!))
      .returning();

    console.log("Updated Workspace Link 🚧: ", result);

    return c.json({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Failed to update workspace link:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: "Failed to update workspace link",
    });
  }
});

workspaceRoutes.post("/links/create", async (c) => {
  try {
    const data: InsertWorkspaceLink = await c.req.json();

    console.log("InsertWorkspaceLink Data 🚧: ", data);

    // Execute the insert query
    const result = await c.req.db
      .insert(workspaceLinks)
      .values(data)
      .onConflictDoNothing()
      .returning()
      .execute();

    return c.json({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Failed to create workspace:", error);
    if (error instanceof HTTPException) throw error;
    return c.json({
      status: 500,
      message: "Failed to create workspace",
    });
  }
});

workspaceRoutes.get("/all-workspaces/:userID", async (c) => {
  try {
    const userID = c.req.param("userID");

    if (!userID) {
      throw new HTTPException(400, { message: "User ID is required" });
    }
    const allWorkspaces: WorkspaceType[] = await c.req.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, userID))
      .execute();

    return c.json({
      status: 200,
      data: allWorkspaces,
    });
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to fetch Users" });
  }
});

workspaceRoutes.get("/:workspaceSlug", async (c) => {
  try {
    const workspaceSlug = c.req.param("workspaceSlug");

    if (!workspaceSlug) {
      throw new HTTPException(400, { message: "workspaceSlug is required" });
    }

    //  Get current Workspace from Workspaces
    const workspace = await c.req.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, workspaceSlug))
      .execute();

    //  Get Links for the current Workspace from workspaceLinks
    const workspace_links = await c.req.db
      .select()
      .from(workspaceLinks)
      .where(eq(workspaceLinks.workspaceId, workspace[0].id))
      .execute();

    //  Get Links Event for the current Workspace from link_events
    const link_events = await c.req.db
      .select()
      .from(linkEvents)
      .where(eq(linkEvents.workspaceId, workspace[0].id))
      .execute();

    //  Get Aggregated Metrics for the current Workspace from aggregated_metrics
    const aggregated_metrics = await c.req.db
      .select()
      .from(aggregatedMetrics)
      .where(eq(aggregatedMetrics.workspaceId, workspace[0].id))
      .execute();

    const workspaceData: ExpandedWorkspaceData = {
      id: workspace[0].id,
      name: workspace[0].name,
      slug: workspace[0].slug,
      userId: workspace[0].userId,
      avatarUrl: workspace[0].avatarUrl,
      templateId: workspace[0].templateId,
      templateConfig: workspace[0].templateConfig,
      isActive: workspace[0].isActive ?? true,
      createdAt: workspace[0].createdAt!,
      updatedAt: workspace[0].updatedAt!,
      links: workspace_links.map((link) => ({
        ...link,
        // Provide default values where appropriate
        platform: link.platform ?? "", // Convert null to undefined if you prefer
        icon: link.icon ?? "",
        backgroundColor: link.backgroundColor ?? "",
        textColor: link.textColor ?? "",
        config: link.config ?? {},
        isActive: link.isActive ?? true,
        createdAt: link.createdAt!,
        updatedAt: link.updatedAt!,
      })),
      analytics: {
        realtime: {
          activeVisitors: 0,
          recentClicks: 0,
          lastUpdated: new Date(),
        },
        aggregated: aggregated_metrics,
      },
    };

    console.log("workspaceData", workspaceData);
    return c.json({
      data: workspaceData,
      status: 200,
    });
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to fetch Users" });
  }
});

export default workspaceRoutes;
