import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { eq, and } from "drizzle-orm";
import {
  workspaceLinks,
  promotionalLinkProposals,
  promotionalLinkMetrics,
  linkTypeEnum,
} from "@repo/db/schema";
import { APIResponse } from "@repo/db/types";
import { withSession } from "../auth/session";
import { z } from "zod";

const businessRoutes = new Hono<{ Bindings: Env }>();

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes

// Debug middleware with rate limiting
businessRoutes.use("/*", async (c, next) => {
  const start = Date.now();
  await next();
  console.log(`[DEBUG] ${c.req.method} ${c.req.url} - ${Date.now() - start}ms`);
});

// Validation schemas
const proposalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().min(0, "Price must be non-negative"),
  creatorId: z.string().min(1, "Creator ID is required"),
  businessId: z.string().min(1, "Business ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

const statusUpdateSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "expired"]),
});

// Propose a promotional link to a creator
businessRoutes.post("/promotional-links/propose", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const data = await c.req.json();
      const validatedData = proposalSchema.parse(data);

      const [proposal] = await c.req.db
        .insert(promotionalLinkProposals)
        .values({
          title: validatedData.title,
          url: validatedData.url,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          price: Math.round(validatedData.price * 100), // Convert to cents
          businessId: validatedData.businessId,
          creatorId: validatedData.creatorId,
          workspaceId: validatedData.workspaceId,
          status: "pending",
        })
        .returning();

      return c.json<APIResponse>({
        status: 200,
        data: proposal,
      });
    } catch (error) {
      console.error("Failed to create promotional link proposal:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to create promotional link proposal",
      });
    }
  });
  return handler(c);
});

// Update promotional link proposal status
businessRoutes.patch("/promotional-links/:proposalId/status", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const proposalId = c.req.param("proposalId");
      const data = await c.req.json();
      const validatedData = statusUpdateSchema.parse(data);

      // Start a transaction since we might need to create a workspace link
      const result = await c.req.db.transaction(async (tx) => {
        const [proposal] = await tx
          .update(promotionalLinkProposals)
          .set({
            status: validatedData.status,
            updatedAt: new Date(),
          })
          .where(eq(promotionalLinkProposals.id, proposalId))
          .returning();

        if (!proposal) {
          throw new HTTPException(404, { message: "Proposal not found" });
        }

        // If the proposal is accepted, create a workspace link and metrics
        if (validatedData.status === "accepted") {
          const [workspaceLink] = await tx
            .insert(workspaceLinks)
            .values({
              workspaceId: proposal.workspaceId,
              type: "promotional",
              title: proposal.title,
              url: proposal.url,
              order: 0, // You might want to implement proper ordering logic
              isActive: true,
            })
            .returning();

          // Create initial metrics record
          await tx.insert(promotionalLinkMetrics).values({
            workspaceLinkId: workspaceLink.id,
            businessId: proposal.businessId,
          });

          // Update proposal with the workspace link reference
          await tx
            .update(promotionalLinkProposals)
            .set({ workspaceLinkId: workspaceLink.id })
            .where(eq(promotionalLinkProposals.id, proposalId));

          return { ...proposal, workspaceLink };
        }

        return proposal;
      });

      return c.json<APIResponse>({
        status: 200,
        data: result,
      });
    } catch (error) {
      console.error("Failed to update promotional link status:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to update promotional link status",
      });
    }
  });
  return handler(c);
});

// Get all promotional link proposals for a business
businessRoutes.get("/promotional-links/proposals", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const businessId = c.req.query("businessId");
      if (!businessId) {
        throw new HTTPException(400, { message: "businessId is required" });
      }

      const proposals = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.businessId, businessId))
        .execute();

      return c.json<APIResponse>({
        status: 200,
        data: proposals,
      });
    } catch (error) {
      console.error("Failed to fetch promotional link proposals:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to fetch promotional link proposals",
      });
    }
  });
  return handler(c);
});

// Get analytics for a promotional link
businessRoutes.get("/promotional-links/:linkId/analytics", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const linkId = c.req.param("linkId");

      // Get the metrics for the link
      const [metrics] = await c.req.db
        .select()
        .from(promotionalLinkMetrics)
        .where(eq(promotionalLinkMetrics.workspaceLinkId, linkId))
        .execute();

      if (!metrics) {
        throw new HTTPException(404, {
          message: "Promotional link metrics not found",
        });
      }

      // Calculate changes (you might want to implement actual change calculation logic)
      const analyticsData = {
        totalClicks: metrics.clicks ?? 0,
        clicksChange: 0, // Implement change calculation
        totalConversions: metrics.conversions ?? 0,
        conversionsChange: 0, // Implement change calculation
        revenue: metrics.revenue ?? 0,
        revenueChange: 0, // Implement change calculation
        ctr:
          metrics.clicks && metrics.conversions
            ? (metrics.conversions / metrics.clicks) * 100
            : 0,
        ctrChange: 0, // Implement change calculation
        // You might want to implement actual daily clicks fetching from linkEvents table
        dailyClicks: [
          {
            date: new Date().toISOString().split("T")[0],
            clicks: metrics.clicks ?? 0,
          },
        ],
      };

      return c.json<APIResponse>({
        status: 200,
        data: analyticsData,
      });
    } catch (error) {
      console.error("Failed to fetch promotional link analytics:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to fetch promotional link analytics",
      });
    }
  });
  return handler(c);
});

export { businessRoutes };
