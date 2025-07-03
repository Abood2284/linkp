// apps/linkp-worker/src/routes/proposals.ts
import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { and, eq, sql } from "drizzle-orm";
import {
  promotionalLinkProposals,
  businesses,
  creators,
  workspaces,
  workspaceLinks,
} from "@repo/db/schema";
import { withSession } from "../auth/session";

const proposalsRoutes = new Hono<{ Bindings: Env }>();

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes

// Get proposals for a workspace (for creators)
proposalsRoutes.get("/workspace/:workspaceId", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const workspaceId = c.req.param("workspaceId");

      if (!workspaceId) {
        throw new HTTPException(400, { message: "Workspace ID is required" });
      }

      // Verify the workspace belongs to the current user
      const [workspace] = await c.req.db
        .select()
        .from(workspaces)
        .where(
          and(
            eq(workspaces.id, workspaceId),
            eq(workspaces.userId, session.user.id)
          )
        )
        .limit(1);

      if (!workspace) {
        throw new HTTPException(403, {
          message: "You don't have access to this workspace",
        });
      }

      // Get creator profile to verify access
      const [creator] = await c.req.db
        .select()
        .from(creators)
        .where(eq(creators.userId, session.user.id))
        .limit(1);

      if (!creator) {
        throw new HTTPException(404, { message: "Creator profile not found" });
      }

      // FIX: Fetch proposals without using the relation feature
      const proposals = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.workspaceId, workspaceId))
        .orderBy(
          promotionalLinkProposals.status,
          promotionalLinkProposals.createdAt
        );

      // FIX: Fetch business details separately
      const businessIds = [...new Set(proposals.map((p) => p.businessId))];
      const businessesData =
        businessIds.length > 0
          ? await c.req.db
              .select({
                id: businesses.id,
                companyName: businesses.companyName,
                industry: businesses.industry,
              })
              .from(businesses)
              .where(sql`${businesses.id} IN (${businessIds.join(",")})`)
          : [];

      // FIX: Combine the data manually
      const proposalsWithBusinesses = proposals.map((proposal) => {
        const business = businessesData.find(
          (b) => b.id === proposal.businessId
        );
        return {
          ...proposal,
          business: business || null,
        };
      });
      console.log(
        "🚀 Proposals with businesses:",
        proposalsWithBusinesses.length
      );
      return c.json({
        status: 200,
        data: proposalsWithBusinesses,
      });
    } catch (error) {
      console.error("Failed to fetch workspace proposals:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to fetch workspace proposals",
      });
    }
  });
  return handler(c);
});

// Get proposals created by a business
// Get proposals created by a business
proposalsRoutes.get("/business", async (c) => {
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

      // FIX: Fetch proposals without using relation
      const proposals = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.businessId, business.id))
        .orderBy(
          promotionalLinkProposals.status,
          promotionalLinkProposals.createdAt
        );

      // FIX: Fetch workspace details separately
      const workspaceIds = [...new Set(proposals.map((p) => p.workspaceId))];
      const workspacesData =
        workspaceIds.length > 0
          ? await c.req.db
              .select({
                id: workspaces.id,
                name: workspaces.name,
                slug: workspaces.slug,
              })
              .from(workspaces)
              .where(sql`${workspaces.id} IN (${workspaceIds.join(",")})`)
          : [];

      // FIX: Fetch creator details separately
      const creatorIds = [...new Set(proposals.map((p) => p.creatorId))];
      const creatorsData =
        creatorIds.length > 0
          ? await c.req.db
              .select({
                id: creators.id,
                bio: creators.bio,
                socialProof: creators.socialProof,
              })
              .from(creators)
              .where(sql`${creators.id} IN (${creatorIds.join(",")})`)
          : [];

      // FIX: Combine the data manually
      const proposalsWithRelations = proposals.map((proposal) => {
        const workspace = workspacesData.find(
          (w) => w.id === proposal.workspaceId
        );
        const creator = creatorsData.find((c) => c.id === proposal.creatorId);
        return {
          ...proposal,
          workspace: workspace || null,
          creator: creator || null,
        };
      });

      return c.json({
        status: 200,
        data: proposalsWithRelations,
      });
    } catch (error) {
      console.error("Failed to fetch business proposals:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to fetch business proposals",
      });
    }
  });
  return handler(c);
});

// Get a single proposal by ID with all related data
proposalsRoutes.get("/:id", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const proposalId = c.req.param("id");

      if (!proposalId) {
        throw new HTTPException(400, { message: "Proposal ID is required" });
      }

      // Get the proposal
      const [proposal] = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.id, proposalId))
        .limit(1);

      if (!proposal) {
        throw new HTTPException(404, { message: "Proposal not found" });
      }

      // Fetch related data separately
      const [business] = proposal.businessId
        ? await c.req.db
            .select({
              id: businesses.id,
              companyName: businesses.companyName,
              industry: businesses.industry,
              website: businesses.website,
            })
            .from(businesses)
            .where(eq(businesses.id, proposal.businessId))
            .limit(1)
        : [null];

      const [workspace] = proposal.workspaceId
        ? await c.req.db
            .select({
              id: workspaces.id,
              name: workspaces.name,
              slug: workspaces.slug,
              avatarUrl: workspaces.avatarUrl,
            })
            .from(workspaces)
            .where(eq(workspaces.id, proposal.workspaceId))
            .limit(1)
        : [null];

      const [creator] = proposal.creatorId
        ? await c.req.db
            .select({
              id: creators.id,
              bio: creators.bio,
              socialProof: creators.socialProof,
              categories: creators.categories,
            })
            .from(creators)
            .where(eq(creators.id, proposal.creatorId))
            .limit(1)
        : [null];

      // Verify access rights based on user type
      const [userBusiness] = await c.req.db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, session.user.id))
        .limit(1);

      const [userCreator] = await c.req.db
        .select()
        .from(creators)
        .where(eq(creators.userId, session.user.id))
        .limit(1);

      if (
        userBusiness &&
        userBusiness.id !== proposal.businessId &&
        userCreator &&
        userCreator.id !== proposal.creatorId
      ) {
        throw new HTTPException(403, {
          message: "You don't have permission to view this proposal",
        });
      }

      // Combine the data
      const proposalWithRelations = {
        ...proposal,
        business,
        workspace,
        creator,
      };

      return c.json({
        status: 200,
        data: proposalWithRelations,
      });
    } catch (error) {
      console.error("Failed to fetch proposal:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to fetch proposal" });
    }
  });
  return handler(c);
});

// Create a new proposal (business only)
proposalsRoutes.post("/create", async (c) => {
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
      const { title, url, startDate, endDate, price, workspaceId } = body;
      // Use let instead of const for creatorId since we might need to update it
      let { creatorId } = body;

      // Validate required fields
      if (
        !title ||
        !url ||
        !startDate ||
        !endDate ||
        price === undefined ||
        !creatorId ||
        !workspaceId
      ) {
        throw new HTTPException(400, { message: "Missing required fields" });
      }

      // Validate creator exists - try to find by ID first, then by userId if not found
      let creator;

      // First attempt: Find by creator ID
      const [creatorById] = await c.req.db
        .select()
        .from(creators)
        .where(eq(creators.id, creatorId))
        .limit(1);

      if (creatorById) {
        creator = creatorById;
      } else {
        // Second attempt: Find by user ID (in case creatorId is actually a userId)
        console.log(
          `Creator not found by ID, trying to find by User ID: ${creatorId}`
        );
        const [creatorByUserId] = await c.req.db
          .select()
          .from(creators)
          .where(eq(creators.userId, creatorId))
          .limit(1);

        if (creatorByUserId) {
          creator = creatorByUserId;
          // Update creatorId to use the actual creator.id for subsequent operations
          creatorId = creator.id;
          console.log(`Found creator by User ID: ${creator.id}`);
        }
      }

      if (!creator) {
        throw new HTTPException(404, { message: "Creator not found" });
      }

      // Validate workspace exists and belongs to creator
      const [workspace] = await c.req.db
        .select()
        .from(workspaces)
        .where(
          and(
            eq(workspaces.id, workspaceId),
            eq(workspaces.userId, creator.userId)
          )
        )
        .limit(1);

      if (!workspace) {
        throw new HTTPException(404, {
          message: "Workspace not found or does not belong to creator",
        });
      }

      // Check if business has enough budget
      const currentBudget = business.budget || 0;
      if (currentBudget < price) {
        throw new HTTPException(400, {
          message:
            "Insufficient budget. Please add more funds to your account or reduce the proposal amount.",
        });
      }

      // Start a transaction to ensure both operations succeed or fail together
      const [newProposal] = await c.req.db.transaction(async (tx) => {
        // Create the proposal
        const [proposal] = await tx
          .insert(promotionalLinkProposals)
          .values({
            businessId: business.id,
            creatorId: creatorId,
            workspaceId: workspaceId,
            title: title,
            url: url,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            price: price, // Assuming price is in cents
            status: "pending",
          })
          .returning();

        // Update business budget
        await tx
          .update(businesses)
          .set({
            budget: (business.budget || 0) - price,
            updatedAt: new Date(),
          })
          .where(eq(businesses.id, business.id));

        return [proposal];
      });

      return c.json({
        status: 200,
        message: "Proposal created successfully",
        data: newProposal,
      });
    } catch (error) {
      console.error("Failed to create proposal:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to create proposal" });
    }
  });
  return handler(c);
});

// Update proposal status (creator only)
proposalsRoutes.patch("/:id/status", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const proposalId = c.req.param("id");

      if (!proposalId) {
        throw new HTTPException(400, { message: "Proposal ID is required" });
      }

      // Parse request body
      const { status } = await c.req.json();

      if (!status || !["accepted", "rejected"].includes(status)) {
        throw new HTTPException(400, { message: "Invalid status provided" });
      }

      // Get creator profile
      const [creator] = await c.req.db
        .select()
        .from(creators)
        .where(eq(creators.userId, session.user.id))
        .limit(1);

      if (!creator) {
        throw new HTTPException(404, { message: "Creator profile not found" });
      }

      // Get the proposal
      const [proposal] = await c.req.db
        .select()
        .from(promotionalLinkProposals)
        .where(eq(promotionalLinkProposals.id, proposalId))
        .limit(1);

      if (!proposal) {
        throw new HTTPException(404, { message: "Proposal not found" });
      }

      // Verify creator has permission to update this proposal
      if (proposal.creatorId !== creator.id) {
        throw new HTTPException(403, {
          message: "You don't have permission to update this proposal",
        });
      }

      // If accepting the proposal, create a workspace link and a campaign
      let workspaceLinkId = null;
      if (status === "accepted") {
        // First, increment the order of all existing links to make room for the promotional link at position 1
        await c.req.db
          .update(workspaceLinks)
          .set({
            order: sql`${workspaceLinks.order} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(workspaceLinks.workspaceId, proposal.workspaceId));

        // Create the promotional link with order=1 (highest priority)
        const [newLink] = await c.req.db
          .insert(workspaceLinks)
          .values({
            workspaceId: proposal.workspaceId,
            type: "promotional",
            title: proposal.title,
            url: proposal.url,
            order: 1, // Always place at the top
            isActive: true,
            // Set appropriate styling and config
            backgroundColor: "#f0f9ff", // Light blue background
            textColor: "#0284c7", // Blue text
            icon: "sparkles", // Default icon
            config: {
              analyticsEnabled: true,
              customization: {
                promotionalDetails: {
                  businessId: proposal.businessId,
                  startDate: proposal.startDate,
                  endDate: proposal.endDate,
                  price: proposal.price,
                  proposalId: proposal.id,
                },
              },
            },
          })
          .returning();

        workspaceLinkId = newLink.id;
        
        // Create a new active campaign in the collaborations table
        console.log("Creating new active campaign from accepted proposal:", proposal.id);
        await c.req.db
          .insert(collaborations)
          .values({
            businessId: proposal.businessId,
            creatorId: proposal.creatorId,
            title: proposal.title,
            description: `Promotional link for ${proposal.url}`,
            startDate: proposal.startDate,
            endDate: proposal.endDate,
            status: "active",
            metrics: {
              clicks: 0,
              conversions: 0,
              revenue: proposal.price, // Initial revenue is the proposal price
            },
          });
      }

      // Update the proposal status
      const [updatedProposal] = await c.req.db
        .update(promotionalLinkProposals)
        .set({
          status: status,
          workspaceLinkId: workspaceLinkId,
          updatedAt: new Date(),
        })
        .where(eq(promotionalLinkProposals.id, proposalId))
        .returning();

      // If proposal is rejected, restore the budget to the business
      if (status === "rejected") {
        // Get the business
        const [business] = await c.req.db
          .select()
          .from(businesses)
          .where(eq(businesses.id, proposal.businessId))
          .limit(1);

        if (business) {
          // Restore the proposal price to the business budget
          await c.req.db
            .update(businesses)
            .set({
              budget: (business.budget || 0) + (proposal.price || 0),
              updatedAt: new Date(),
            })
            .where(eq(businesses.id, business.id));
        }
      }

      return c.json({
        status: 200,
        message: `Proposal ${status} successfully`,
        data: updatedProposal,
      });
    } catch (error) {
      console.error("Failed to update proposal status:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, {
        message: "Failed to update proposal status",
      });
    }
  });
  return handler(c);
});

export default proposalsRoutes;
