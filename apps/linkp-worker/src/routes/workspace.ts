// apps/linkp-worker/src/routes/workspace.ts
import { Hono } from "hono";
import { Env } from "../index";
import {
  aggregatedMetrics,
  businesses,
  creators,
  InsertWorkspaceLink,
  linkEvents,
  promotionalLinkProposals,
  proposalStatusEnum,
  workspaceLinks,
  workspaces,
} from "@repo/db/schema";
import { HTTPException } from "hono/http-exception";
import { eq, sql, and } from "drizzle-orm";
import {
  ExpandedWorkspaceData,
  WorkspaceSlugResponse,
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
    const cachedResult = await c.env.linkp_default_kv?.get(cacheKey);
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
    await c.env.linkp_default_kv?.put(cacheKey, JSON.stringify(response), {
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

      // Check if creator_id is missing
      if (!workspaceData.creatorId) {
        console.log(
          "➡️ No creator_id provided, checking for existing creator profile"
        );

        // First, check if the user already has a creator profile
        const [existingCreator] = await c.req.db
          .select()
          .from(creators)
          .where(eq(creators.userId, workspaceData.userId))
          .limit(1);

        if (existingCreator) {
          // Use the existing creator's ID
          workspaceData.creatorId = existingCreator.id;
          console.log(
            "➡️ Using existing creator profile with ID:",
            existingCreator.id
          );
        }
      }

      // Now create the workspace with the creator_id
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

/**
 * Gets promotional proposal data associated with a specific workspace link
 *
 * PURPOSE:
 * This endpoint retrieves the details of a promotional proposal that is linked to a
 * specific workspace link. It provides the necessary data for rendering promotional
 * link information in the UI, particularly in the update link dialog when editing
 * a promotional link.
 *
 * USE CASES:
 * 1. When a creator opens the "Update Link Dialog" for a promotional link
 * 2. When a business views details about their active promotional link campaign
 * 3. When rendering promotional link details in analytics dashboards
 *
 * WORKFLOW:
 * 1. Frontend identifies a link with type="promotional" and requests its proposal data
 * 2. This endpoint fetches the associated proposal from the promotionalLinkProposals table
 * 3. The proposal data (status, dates, price) is returned to the frontend
 * 4. The UI can display these details and enable appropriate actions based on status
 *
 * SECURITY CONSIDERATIONS:
 * - Verifies the requesting user is either the workspace owner (creator) or the business
 *   that created the proposal
 * - Performs multiple database checks to confirm relationships between entities
 * - Returns 403 Forbidden if permission checks fail
 *
 * INPUT:
 * - linkId: The ID of the workspace link (from URL parameter)
 *
 * OUTPUT:
 * - JSON object containing the full proposal details including:
 *   - ID, businessId, creatorId, workspaceId, status
 *   - Title, URL
 *   - Start and end dates
 *   - Price
 *   - Creation and update timestamps
 *
 * ERROR HANDLING:
 * - 400 Bad Request: If linkId is missing
 * - 404 Not Found: If link or associated proposal doesn't exist
 * - 403 Forbidden: If user lacks permission to view the proposal
 * - 500 Internal Server Error: For database or server errors
 *
 * NOTES:
 * - This endpoint is crucial for maintaining separation between workspace links and their
 *   promotional metadata as per the updated schema design
 * - Caching can be implemented for this endpoint if high traffic is expected
 */
workspaceRoutes.get("/links/proposal/:linkId", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const linkId = c.req.param("linkId");

      if (!linkId) {
        throw new HTTPException(400, { message: "Link ID is required" });
      }

      // First, verify the link exists and get its ID
      const [link] = await c.req.db
        .select()
        .from(workspaceLinks)
        .where(eq(workspaceLinks.id, linkId))
        .limit(1);

      if (!link) {
        throw new HTTPException(404, { message: "Link not found" });
      }

      // Get the proposal associated with this link
      const [proposal] = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.workspaceLinkId, linkId))
        .limit(1);

      if (!proposal) {
        throw new HTTPException(404, {
          message: "No proposal found for this link",
        });
      }

      // Now check if the user has permission to access this proposal
      // Either they own the link (creator) or they created the proposal (business)
      const [workspace] = await c.req.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, link.workspaceId))
        .limit(1);

      // If user is the workspace owner, they have permission
      var hasPermission = workspace.userId === session.user.id;

      // If not the workspace owner, check if they're the business that created the proposal
      if (!hasPermission) {
        const [business] = await c.req.db
          .select()
          .from(businesses)
          .where(eq(businesses.userId, session.user.id))
          .limit(1);

        if (business && business.id === proposal.businessId) {
          // User is the business that created the proposal
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        throw new HTTPException(403, {
          message: "You don't have permission to view this proposal",
        });
      }

      return c.json({
        status: 200,
        data: proposal,
      });
    } catch (error) {
      console.error("Failed to fetch proposal for link:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to fetch proposal for link",
      });
    }
  });
  return handler(c);
});

/**
 * Updates the status of a promotional link proposal
 *
 * PURPOSE:
 * This endpoint allows updating the status of a promotional link proposal, enabling
 * the workflow for accepting, rejecting, or expiring promotional link campaigns.
 * It's particularly important for the link management interface where creators review
 * and respond to promotional proposals from businesses.
 *
 * USE CASES:
 * 1. Creator accepting or rejecting a business's promotional link proposal
 * 2. Business canceling their own promotional link proposal before acceptance
 * 3. System automatically changing status to "expired" after end date
 * 4. Admin managing promotional proposals in special cases
 *
 * WORKFLOW:
 * 1. User takes action on a promotional link proposal in the UI (e.g., clicks "Accept")
 * 2. Frontend sends proposal ID and new status to this endpoint
 * 3. Backend validates the request, updates the status in the database
 * 4. UI receives confirmation and updates the proposal display accordingly
 *
 * SECURITY CONSIDERATIONS:
 * - Verifies that only the involved creator or business can update the proposal
 * - Validates that the requested status is one of the allowed enum values
 * - Enforces business logic based on current proposal state (e.g., preventing updates
 *   to already accepted/rejected proposals if implementing such a restriction)
 *
 * INPUT:
 * - id: The unique identifier of the proposal to update
 * - status: The new status value ("pending", "accepted", "rejected", or "expired")
 *
 * OUTPUT:
 * - JSON object containing:
 *   - Status code (200 for success)
 *   - Success message
 *   - Updated proposal data
 *
 * ERROR HANDLING:
 * - 400 Bad Request: If proposal ID or status is missing/invalid
 * - 404 Not Found: If proposal doesn't exist
 * - 403 Forbidden: If user lacks permission to update the proposal
 * - 500 Internal Server Error: For database or server errors
 *
 * BUSINESS LOGIC:
 * - Unlike the standard proposal status update endpoint in proposals.ts, this endpoint:
 *   1. Allows both creators and businesses to update proposal status
 *   2. Does not automatically create workspace links when accepted (separates concerns)
 *   3. Focuses only on status updates, not the full promotional workflow
 *
 * RELATIONSHIPS:
 * - This endpoint complements the existing /proposals/:id/status endpoint but with
 *   different permission and business logic, designed specifically for use in the
 *   link management interface
 */
workspaceRoutes.patch("/links/proposal/update", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const { id, status } = await c.req.json();

      if (!id) {
        throw new HTTPException(400, { message: "Proposal ID is required" });
      }

      if (!status || !proposalStatusEnum.enumValues.includes(status)) {
        throw new HTTPException(400, {
          message: "Valid status is required",
        });
      }

      // Get the proposal
      const [proposal] = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.id, id))
        .limit(1);

      if (!proposal) {
        throw new HTTPException(404, { message: "Proposal not found" });
      }

      // Check permission - user must either be the creator or the business
      let hasPermission = false;

      // Check if user is the creator
      const [workspace] = await c.req.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, proposal.workspaceId))
        .limit(1);

      if (workspace && workspace.userId === session.user.id) {
        hasPermission = true;
      }

      // Check if user is the business
      if (!hasPermission) {
        const [business] = await c.req.db
          .select()
          .from(businesses)
          .where(
            and(
              eq(businesses.userId, session.user.id),
              eq(businesses.id, proposal.businessId)
            )
          )
          .limit(1);

        if (business) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        throw new HTTPException(403, {
          message: "You don't have permission to update this proposal",
        });
      }

      // Update the proposal status
      const [updatedProposal] = await c.req.db
        .update(promotionalLinkProposals)
        .set({
          status: status,
          updatedAt: new Date(),
        })
        .where(eq(promotionalLinkProposals.id, id))
        .returning();

      return c.json({
        status: 200,
        message: "Proposal updated successfully",
        data: updatedProposal,
      });
    } catch (error) {
      console.error("Failed to update proposal:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to update proposal" });
    }
  });
  return handler(c);
});

export default workspaceRoutes;
