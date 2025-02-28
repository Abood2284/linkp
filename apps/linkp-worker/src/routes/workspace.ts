import { Hono } from "hono";
import { Env } from "../index";
import {
  aggregatedMetrics,
  creators,
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

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes

// Debug middleware with rate limiting
workspaceRoutes.use("/*", async (c, next) => {
  const start = Date.now();
  await next();
  console.log(`[DEBUG] ${c.req.method} ${c.req.url} - ${Date.now() - start}ms`);
});

// Health check with connection pooling status
workspaceRoutes.get("/health", async (c) => {
  try {
    const [workspacesCount] = await c.req.db
      .select({ count: sql`count(*)` })
      .from(workspaces)
      .execute();

    return c.json({
      status: 200,
      message: "Database connection healthy",
      count: workspacesCount?.count || 0,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    throw new HTTPException(500, { message: "Database health check failed" });
  }
});

// Optimized slug verification with caching
workspaceRoutes.post("/verify-slug", async (c) => {
  try {
    const { workspaceSlug } = await c.req.json();

    // Check cache first
    const cacheKey = `slug:${workspaceSlug}`;
    const cachedResult = await c.env.KV?.get(cacheKey);
    if (cachedResult) {
      return c.json(JSON.parse(cachedResult));
    }

    const [existingWorkspace] = await c.req.db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, workspaceSlug))
      .limit(1);

    const response: WorkspaceSlugResponse = {
      status: existingWorkspace ? 400 : 200,
      data: !existingWorkspace,
      message: existingWorkspace
        ? "This slug is already taken. Please choose a different one."
        : "",
    };

    // Cache the result
    await c.env.KV?.put(cacheKey, JSON.stringify(response), {
      expirationTtl: CACHE_TTL,
    });

    return c.json(response);
  } catch (error) {
    console.error("Failed to verify workspace slug:", error);
    throw new HTTPException(500, {
      message: "Failed to verify workspace slug",
    });
  }
});

// Optimized workspace creation with transaction
workspaceRoutes.post("/create", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const workspaceData = await c.req.json();
      console.log("➡️ Workspace data:", workspaceData);
      const [workspace] = await c.req.db
        .insert(workspaces)
        .values(workspaceData)
        .onConflictDoNothing()
        .returning();

      console.log("➡️ Workspace:", workspace);

      if (!workspace) {
        throw new HTTPException(409, { message: "Workspace already exists" });
      }
      console.log("➡️ Workspace created successfully");
      return c.json({
        status: 200,
        data: workspace,
      });
    } catch (error) {
      console.error("Failed to create workspace:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to create workspace" });
    }
  });
  return handler(c);
});

// Optimized workspace fetch with parallel queries and caching
workspaceRoutes.get("/:workspaceSlug", async (c) => {
  try {
    const workspaceSlug = c.req.param("workspaceSlug");
    if (!workspaceSlug) {
      throw new HTTPException(400, { message: "workspaceSlug is required" });
    }

    // Get workspace first
    const [workspace] = await c.req.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, workspaceSlug))
      .execute();

    if (!workspace) {
      throw new HTTPException(404, { message: "Workspace not found" });
    }

    // Fetch all related data in parallel
    const [workspace_links, link_events, aggregated_metrics] =
      await Promise.all([
        c.req.db
          .select()
          .from(workspaceLinks)
          .where(eq(workspaceLinks.workspaceId, workspace.id))
          .execute(),
        c.req.db
          .select()
          .from(linkEvents)
          .where(eq(linkEvents.workspaceId, workspace.id))
          .execute(),
        c.req.db
          .select()
          .from(aggregatedMetrics)
          .where(eq(aggregatedMetrics.workspaceId, workspace.id))
          .execute(),
      ]);

    const workspaceData: ExpandedWorkspaceData = {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      userId: workspace.userId,
      avatarUrl: workspace.avatarUrl,
      templateId: workspace.templateId,
      templateConfig: workspace.templateConfig,
      isActive: workspace.isActive ?? true,
      createdAt: workspace.createdAt!,
      updatedAt: workspace.updatedAt!,
      links: workspace_links.map((link) => ({
        ...link,
        platform: link.platform ?? "",
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

    return c.json({
      data: workspaceData,
      status: 200,
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "Failed to fetch workspace" });
  }
});

// Optimized link order query with caching
workspaceRoutes.get("/links/max-order", async (c) => {
  try {
    // Get max order with optimized query
    const [result] = await c.req.db
      .select({
        maxOrder: sql<number>`COALESCE(MAX(${workspaceLinks.order}), 0)`,
      })
      .from(workspaceLinks);

    return c.json({
      status: 200,
      message: "Max order retrieved successfully",
      data: result.maxOrder,
    });
  } catch (error) {
    console.error("Failed to get max order:", error);
    throw new HTTPException(500, { message: "Failed to get max order" });
  }
});

// Optimized link update with validation
workspaceRoutes.patch("/links/update", async (c) => {
  try {
    const data: InsertWorkspaceLink = await c.req.json();

    if (!data.id || !data.workspaceId) {
      throw new HTTPException(400, {
        message: "Link ID and workspace ID are required",
      });
    }

    // Validate workspace ownership (security check)
    const [workspace] = await c.req.db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.id, data.workspaceId))
      .limit(1);

    if (!workspace) {
      throw new HTTPException(404, { message: "Workspace not found" });
    }

    // Update the link
    const [updatedLink] = await c.req.db
      .update(workspaceLinks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workspaceLinks.id, data.id))
      .returning();

    if (!updatedLink) {
      throw new HTTPException(404, { message: "Link not found" });
    }

    return c.json({
      status: 200,
      data: [updatedLink], // Return as array for consistency with frontend
    });
  } catch (error) {
    console.error("Failed to update link:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "Failed to update link" });
  }
});

// Optimized link creation with order management
workspaceRoutes.post("/links/create", async (c) => {
  try {
    const data: InsertWorkspaceLink = await c.req.json();

    if (!data.workspaceId) {
      throw new HTTPException(400, { message: "Workspace ID is required" });
    }

    // Validate workspace ownership (security check)
    const [workspace] = await c.req.db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.id, data.workspaceId))
      .limit(1);

    if (!workspace) {
      throw new HTTPException(404, { message: "Workspace not found" });
    }

    // Get current max order
    const [orderResult] = await c.req.db
      .select({
        maxOrder: sql<number>`COALESCE(MAX(${workspaceLinks.order}), 0)`,
      })
      .from(workspaceLinks)
      .where(eq(workspaceLinks.workspaceId, data.workspaceId));

    // Create the link with next order
    const [newLink] = await c.req.db
      .insert(workspaceLinks)
      .values({
        ...data,
        order: (orderResult.maxOrder || 0) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return c.json({
      status: 200,
      data: [newLink], // Return as array for consistency with frontend
    });
  } catch (error) {
    console.error("Failed to create link:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "Failed to create link" });
  }
});

// Get all workspaces for a user
workspaceRoutes.get("/all-workspaces/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    if (!userId) {
      throw new HTTPException(400, { message: "User ID is required" });
    }

    // Fetch all workspaces for the user with optimized query
    const userWorkspaces = await c.req.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, userId))
      .orderBy(workspaces.createdAt);

    return c.json({
      status: 200,
      data: userWorkspaces,
    });
  } catch (error) {
    console.error("Failed to fetch user workspaces:", error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: "Failed to fetch user workspaces",
    });
  }
});

export default workspaceRoutes;
