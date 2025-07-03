// apps/linkp-worker/src/routes/campaigns.ts
import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { and, eq, sql, desc, asc, or, inArray } from "drizzle-orm";
import {
  businesses,
  collaborations,
  creators,
  promotionalLinkProposals,
  workspaces,
} from "@repo/db/schema";
import { withSession } from "../auth/session";

const campaignsRoutes = new Hono<{ Bindings: Env }>();

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes

// Get all campaigns for a business
campaignsRoutes.get("/business", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      // Get business profile
      const [business] = await c.req.db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, session.user.id))
        .limit(1);

      if (!business) {
        throw new HTTPException(404, { message: "Business profile not found" });
      }

      // Fetch all collaborations (campaigns) for this business
      const allCampaigns = await c.req.db
        .select({
          id: collaborations.id,
          title: collaborations.title,
          description: collaborations.description,
          startDate: collaborations.startDate,
          endDate: collaborations.endDate,
          status: collaborations.status,
          metrics: collaborations.metrics,
          createdAt: collaborations.createdAt,
          updatedAt: collaborations.updatedAt,
          creatorId: collaborations.creatorId,
        })
        .from(collaborations)
        .where(eq(collaborations.businessId, business.id))
        .orderBy(desc(collaborations.createdAt));

      // Fetch creator details for all campaigns
      const creatorIds = [...new Set(allCampaigns.map((c) => c.creatorId))];
      
      const creatorsData = creatorIds.length > 0
        ? await c.req.db
            .select({
              id: creators.id,
              userId: creators.userId,
              bio: creators.bio,
              categories: creators.categories,
              socialProof: creators.socialProof,
            })
            .from(creators)
            .where(inArray(creators.id, creatorIds))
        : [];

      // Get workspace info for each creator
      const creatorUserIds = creatorsData.map(creator => creator.userId).filter(Boolean);
      
      const workspacesData = creatorUserIds.length > 0
        ? await c.req.db
            .select({
              id: workspaces.id,
              name: workspaces.name,
              slug: workspaces.slug,
              avatarUrl: workspaces.avatarUrl,
              userId: workspaces.userId,
              creatorId: workspaces.creatorId,
            })
            .from(workspaces)
            .where(inArray(workspaces.creatorId, creatorIds))
        : [];

      // Combine the data
      const campaignsWithDetails = allCampaigns.map(campaign => {
        const creator = creatorsData.find(c => c.id === campaign.creatorId) || null;
        const workspace = creator 
          ? workspacesData.find(w => w.creatorId === creator.id) 
          : null;

        return {
          ...campaign,
          creator: creator ? {
            id: creator.id,
            bio: creator.bio,
            categories: creator.categories,
            socialProof: creator.socialProof,
          } : null,
          workspace: workspace ? {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            avatarUrl: workspace.avatarUrl,
          } : null,
        };
      });

      // Categorize campaigns by status
      const activeCampaigns = campaignsWithDetails.filter(c => c.status === "active");
      const draftCampaigns = campaignsWithDetails.filter(c => c.status === "draft");
      const completedCampaigns = campaignsWithDetails.filter(c => c.status === "completed");

      // Get all pending and rejected proposals
      const proposals = await c.req.db
        .select({
          id: promotionalLinkProposals.id,
          creatorId: promotionalLinkProposals.creatorId,
          workspaceId: promotionalLinkProposals.workspaceId,
          title: promotionalLinkProposals.title,
          url: promotionalLinkProposals.url,
          startDate: promotionalLinkProposals.startDate,
          endDate: promotionalLinkProposals.endDate,
          price: promotionalLinkProposals.price,
          status: promotionalLinkProposals.status,
          createdAt: promotionalLinkProposals.createdAt,
        })
        .from(promotionalLinkProposals)
        .where(
          and(
            eq(promotionalLinkProposals.businessId, business.id),
            or(
              eq(promotionalLinkProposals.status, "pending"),
              eq(promotionalLinkProposals.status, "rejected")
            )
          )
        )
        .orderBy(desc(promotionalLinkProposals.createdAt));

      // Get creator details for proposals
      const proposalCreatorIds = [...new Set(proposals.map(p => p.creatorId))];
      const proposalCreatorsData = proposalCreatorIds.length > 0
        ? await c.req.db
            .select({
              id: creators.id,
              userId: creators.userId,
              bio: creators.bio,
              categories: creators.categories,
              socialProof: creators.socialProof,
            })
            .from(creators)
            .where(inArray(creators.id, proposalCreatorIds))
        : [];

      // Get workspace info for proposals
      const proposalWorkspaceIds = [...new Set(proposals.map(p => p.workspaceId))];
      const proposalWorkspacesData = proposalWorkspaceIds.length > 0
        ? await c.req.db
            .select({
              id: workspaces.id,
              name: workspaces.name,
              slug: workspaces.slug,
              avatarUrl: workspaces.avatarUrl,
              creatorId: workspaces.creatorId,
            })
            .from(workspaces)
            .where(inArray(workspaces.id, proposalWorkspaceIds))
        : [];

      // Combine proposal data
      const proposalsWithDetails = proposals.map(proposal => {
        const creator = proposalCreatorsData.find(c => c.id === proposal.creatorId) || null;
        const workspace = proposalWorkspacesData.find(w => w.id === proposal.workspaceId) || null;

        return {
          ...proposal,
          creator: creator ? {
            id: creator.id,
            bio: creator.bio,
            categories: creator.categories,
            socialProof: creator.socialProof,
          } : null,
          workspace: workspace ? {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            avatarUrl: workspace.avatarUrl,
          } : null,
        };
      });

      // Calculate budget values (in dollars)
      const totalBudget = (business.budget || 0) / 100; // Convert cents to dollars
      const totalSpent = proposals
        .filter(p => p.status === "accepted")
        .reduce((sum, p) => sum + (p.price || 0), 0) / 100; // Convert cents to dollars
      const pendingAllocations = proposals
        .filter(p => p.status === "pending")
        .reduce((sum, p) => sum + (p.price || 0), 0) / 100; // Convert cents to dollars
      
      // Calculate available budget (total - pending - spent)
      const availableBudget = Math.max(0, totalBudget - pendingAllocations - totalSpent);
      
      // Calculate completion percentage for active campaigns
      const avgCompletion = activeCampaigns.length > 0 
        ? Math.round(activeCampaigns.reduce((sum, c) => {
            const now = new Date();
            const start = new Date(c.startDate as Date);
            const end = new Date(c.endDate as Date);
            const totalDuration = end.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();
            const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
            return sum + progress;
          }, 0) / activeCampaigns.length)
        : 0;
      
      // Prepare stats object
      const stats = {
        activeCampaigns: activeCampaigns.length,
        totalBudget,
        availableBudget,
        totalSpent,
        pendingAllocations,
        avgCompletion,
      };

      return c.json({
        status: 200,
        data: {
          stats,
          activeCampaigns,
          draftCampaigns,
          completedCampaigns,
          proposals: proposalsWithDetails,
        },
      });
    } catch (error) {
      console.error("Failed to fetch business campaigns:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to fetch business campaigns" });
    }
  });
  return handler(c);
});

// Create a new campaign
campaignsRoutes.post("/create", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      // Get business profile
      const [business] = await c.req.db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, session.user.id))
        .limit(1);

      if (!business) {
        throw new HTTPException(404, { message: "Business profile not found" });
      }

      // Parse request body
      const body = await c.req.json();
      const { title, description, startDate, endDate, creatorId, status = "draft" } = body;

      // Validate required fields
      if (!title || !creatorId) {
        throw new HTTPException(400, { message: "Missing required fields" });
      }

      // Validate creator exists
      const [creator] = await c.req.db
        .select()
        .from(creators)
        .where(eq(creators.id, creatorId))
        .limit(1);

      if (!creator) {
        throw new HTTPException(404, { message: "Creator not found" });
      }

      // Create the campaign
      const [newCampaign] = await c.req.db
        .insert(collaborations)
        .values({
          businessId: business.id,
          creatorId: creatorId,
          title: title,
          description: description || null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status: status,
          metrics: {},
        })
        .returning();

      return c.json({
        status: 200,
        message: "Campaign created successfully",
        data: newCampaign,
      });
    } catch (error) {
      console.error("Failed to create campaign:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to create campaign" });
    }
  });
  return handler(c);
});

// Update campaign status
campaignsRoutes.patch("/:id/status", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const campaignId = c.req.param("id");

      if (!campaignId) {
        throw new HTTPException(400, { message: "Campaign ID is required" });
      }

      // Get business profile
      const [business] = await c.req.db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, session.user.id))
        .limit(1);

      if (!business) {
        throw new HTTPException(404, { message: "Business profile not found" });
      }

      // Parse request body
      const { status } = await c.req.json();

      if (!status || !["active", "draft", "completed"].includes(status)) {
        throw new HTTPException(400, { message: "Invalid status provided" });
      }

      // Get the campaign
      const [campaign] = await c.req.db
        .select()
        .from(collaborations)
        .where(
          and(
            eq(collaborations.id, campaignId),
            eq(collaborations.businessId, business.id)
          )
        )
        .limit(1);

      if (!campaign) {
        throw new HTTPException(404, { message: "Campaign not found" });
      }

      // Update the campaign status
      const [updatedCampaign] = await c.req.db
        .update(collaborations)
        .set({
          status: status,
          updatedAt: new Date(),
        })
        .where(eq(collaborations.id, campaignId))
        .returning();

      return c.json({
        status: 200,
        message: `Campaign status updated to ${status}`,
        data: updatedCampaign,
      });
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to update campaign status" });
    }
  });
  return handler(c);
});

export default campaignsRoutes;
