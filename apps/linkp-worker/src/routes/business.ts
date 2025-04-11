// apps/linkp-worker/src/routes/business.ts
import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import * as schema from "@repo/db/schema";
import { withSession } from "../auth/session";
import {
  businesses,
  businessPreferences,
  users,
  collaborations,
  creators,
  SelectWorkspaceLink,
} from "@repo/db/schema";

// Type definitions for the creator profile route

// Creator record from database
interface CreatorRecord {
  id: string;
  userId: string;
  bio: string | null;
  categories: string[] | null;
  socialProof: {
    followers?: number;
    engagement?: number;
    platforms?: Record<string, number>;
  } | null;
  promotionRate: number | null;
  monetizationEnabled: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// User information from database
interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

// Instagram connection from database
interface InstagramConnection {
  id: string;
  workspaceId: string;
  instagramUserId: string;
  username: string | null;
  name: string | null;
  accountType: string | null;
  profilePictureUrl: string | null;
  followerCount: number | null;
  followingCount: number | null;
  mediaCount: number | null;
  avgLikes: number | null;
  avgComments: number | null;
  avgSaves: number | null;
  avgShares: number | null;
  engagementRate: number | null;
  audienceDemographics: Record<string, any> | null;
  lastSyncedAt: string | null;
}

// Instagram metrics history from database
interface InstagramMetricsHistory {
  id: string;
  connectionId: string;
  followerCount: number | null;
  followingCount: number | null;
  mediaCount: number | null;
  avgLikes: number | null;
  avgComments: number | null;
  avgSaves: number | null;
  avgShares: number | null;
  engagementRate: number | null;
  linkpClicks: number | null;
  linkpConversions: number | null;
  linkpCtr: number | null;
  recordedAt: string | null;
}

// Workspace from database
interface Workspace {
  id: string;
  userId: string;
  name: string | null;
  slug: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Use the schema's SelectWorkspaceLink type instead of a custom interface
// This ensures we're using the single source of truth from the schema

// Interface for the workspace links query result
// This matches the fields we're actually selecting in our query
interface WorkspaceLinkQueryResult {
  id: string;
  workspaceId: string;
  title: string | null;
  url: string | null;
  type:
    | "social"
    | "regular"
    | "promotional"
    | "commerce"
    | "booking"
    | "newsletter"
    | "music"
    | "video"
    | "donation"
    | "poll"
    | "file";
  isActive: boolean | null;
  platform: string | null;
  icon: string | null;
  backgroundColor: string | null;
  order: number | null;
  config: Record<string, any> | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  // Note: textColor is in the schema but we're not selecting it in our query
}

// Define an interface that matches what's actually being returned from the database queries
// This is based on the fields we're selecting in our queries
interface Collaboration {
  id: string;
  businessId: string;
  businessName?: string | null; // This comes from the join with businesses table
  // Note: title doesn't exist in the collaborations table but exists in promotionalLinkProposals
  title?: string | null;
  // Note: url exists in promotionalLinkProposals but not in collaborations
  url?: string | null;
  // Note: description doesn't exist in either table
  // We'll add it as optional and provide default values
  description?: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status?: string | null;
  // Note: price exists in promotionalLinkProposals but not in collaborations
  price?: number | null;
  // Note: workspaceLinkId exists in promotionalLinkProposals (if accepted) but not in collaborations
  workspaceLinkId?: string | null;
  // Note: metrics exists in collaborations but not in promotionalLinkProposals
  metrics?:
    | {
        clicks?: number;
        conversions?: number;
        revenue?: number;
      }
    | string
    | null;
}

// Formatted collaboration for response
interface FormattedCollaboration {
  businessName: string;
  title: string;
  url: string | null; // URL field from promotionalLinkProposals
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  price: number | null; // Price field from promotionalLinkProposals
  metrics: {
    clicks: number;
    conversions: number;
    revenue: number;
    impressions: number; // From promotionalLinkMetrics table
  };
  brand: string; // For backward compatibility
  date: string; // For backward compatibility
}

// Link with metrics for response
interface LinkWithMetrics {
  id: string;
  title: string | null;
  url: string | null;
  type: string | null;
  clicks: number;
}

// Detailed creator profile for response
interface DetailedCreator {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  categories: string[];
  followerCount: number;
  engagementRate: string;
  averageCost: string;
  createdAt: string | Date | null;
  bio: string;
  location: string;
  availability: {
    status: string;
    percentage: number;
  };
  linkInBio: {
    views: number;
    links: LinkWithMetrics[];
  };
  engagement: {
    rate: number;
    averageComments: number;
    averageLikes: number;
  };
  previousCollaborations: FormattedCollaboration[];
  metrics: InstagramMetricsHistory[];
  workspaces: Workspace[];
}

const businessRoutes = new Hono<{ Bindings: Env }>();

businessRoutes.get("/test", async (c) => {
  return c.json({ message: "Business routes working" });
});

// Complete the business onboarding process
businessRoutes.post("/complete-onboarding", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const session = c.get("session");
      const userId = session.user.id;

      // Get request data
      const data = await c.req.json();
      const { companyProfile, goals, creatorPreferences, subscription } = data;

      // 1. Check if business exists
      const existingBusiness = await c.req.db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, userId))
        .then((res) => res[0]);

      const businessId = existingBusiness?.id;
      let newBusinessId = businessId;

      // 2. Create or update business record
      if (!businessId) {
        // Create new business record
        const [newBusiness] = await c.req.db
          .insert(businesses)
          .values({
            userId,
            companyName: companyProfile.companyName,
            industry: companyProfile.industry,
            website: companyProfile.website,
            budget: goals.monthlyBudget
              ? Math.round(goals.monthlyBudget * 100)
              : 0,
            subscriptionTier: subscription.plan,
            subscriptionStatus: "active",
            billingCycle: subscription.billingCycle || "monthly",
          })
          .returning({ id: businesses.id });

        newBusinessId = newBusiness.id;
      } else {
        // Update existing business record
        await c.req.db
          .update(businesses)
          .set({
            companyName: companyProfile.companyName,
            industry: companyProfile.industry,
            website: companyProfile.website,
            budget: goals.monthlyBudget
              ? Math.round(goals.monthlyBudget * 100)
              : 0,
            subscriptionTier: subscription.plan,
            subscriptionStatus: "active",
            billingCycle: subscription.billingCycle || "monthly",
          })
          .where(eq(businesses.id, businessId));
      }

      // 3. Check if preferences exist
      const existingPreferences = businessId
        ? await c.req.db
            .select()
            .from(businessPreferences)
            .where(eq(businessPreferences.businessId, businessId))
            .then((res) => res[0])
        : null;

      // 4. Create or update preferences
      if (existingPreferences) {
        // Update existing preferences
        await c.req.db
          .update(businessPreferences)
          .set({
            creatorCategories: creatorPreferences.creatorCategories,
            minFollowers: creatorPreferences.minFollowers,
            targetLocations: creatorPreferences.targetLocations || [],
            linkObjectives: goals.linkObjectives || [],
            targetAudienceAges: goals.targetAudience?.ageRange || [],
            targetAudienceInterests: goals.targetAudience?.interests || [],
            linkMetrics: goals.linkMetrics || [],
          })
          .where(eq(businessPreferences.businessId, businessId));
      } else {
        // Create new preferences
        await c.req.db.insert(businessPreferences).values({
          businessId: newBusinessId,
          creatorCategories: creatorPreferences.creatorCategories,
          minFollowers: creatorPreferences.minFollowers,
          targetLocations: creatorPreferences.targetLocations || [],
          linkObjectives: goals.linkObjectives || [],
          targetAudienceAges: goals.targetAudience?.ageRange || [],
          targetAudienceInterests: goals.targetAudience?.interests || [],
          linkMetrics: goals.linkMetrics || [],
        });
      }

      // 5. Update user onboarding status
      await c.req.db
        .update(users)
        .set({
          onboardingCompleted: true,
          userType: "business",
        })
        .where(eq(users.id, userId));

      return c.json({
        status: 200,
        message: "Business onboarding completed successfully",
        data: { success: true },
      });
    } catch (error) {
      console.error("Business onboarding error:", error);
      throw new HTTPException(500, {
        message: "Failed to complete business onboarding",
      });
    }
  });
  return handler(c);
});

// Get business preferences
businessRoutes.get("/preferences", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const session = c.get("session");
      const userId = session.user.id;

      // Get the business ID for the user
      const business = await c.req.db
        .select({ id: businesses.id })
        .from(businesses)
        .where(eq(businesses.userId, userId))
        .then((res) => res[0]);

      if (!business) {
        throw new HTTPException(404, { message: "Business not found" });
      }

      // Get preferences
      const preferences = await c.req.db
        .select()
        .from(businessPreferences)
        .where(eq(businessPreferences.businessId, business.id))
        .then((res) => res[0]);

      return c.json({
        status: 200,
        data: preferences || {},
      });
    } catch (error) {
      console.error("Error fetching business preferences:", error);
      throw new HTTPException(500, {
        message: "Failed to fetch business preferences",
      });
    }
  });
  return handler(c);
});

// The dashboard route remains unchanged
businessRoutes.get("/dashboard", async (c) => {
  const handler = withSession(async (c, session) => {
    try {
      const session = c.get("session");
      const userId = session.user.id;

      // Get the business ID for the user
      const business = await c.req.db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, userId))
        .then((res) => res[0]);

      if (!business) {
        throw new HTTPException(404, { message: "Business not found" });
      }

      // TODO: Fetch actual campaign and analytics data
      // For now, return structured but sample data

      return c.json({
        status: 200,
        data: {
          stats: {
            activeCampaigns: 0, // Start with zero for new businesses
            totalReach: "0",
            conversionRate: "0%",
            roi: "0%",
            activeCampaignsTrend: {
              value: "0% from last month",
              isPositive: true,
            },
            totalReachTrend: { value: "0% from last month", isPositive: true },
            conversionRateTrend: {
              value: "0% from last month",
              isPositive: true,
            },
            roiTrend: { value: "0% from last month", isPositive: true },
          },
          recentActivities: [],
          activeCampaigns: [],
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new HTTPException(500, {
        message: "Failed to fetch dashboard data",
      });
    }
  });
  return handler(c);
});

// GET /api/business/discover
// GET /api/business/discover
businessRoutes.get("/discover", async (c) => {
  try {
    // Get query parameters for filtering
    const query = c.req.query();
    const search = query.search;
    const category = query.category;
    const minFollowersStr = query.minFollowers;
    const maxFollowersStr = query.maxFollowers;
    const location = query.location;
    const platform = query.platform;
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "9"); // Default to 9 for a 3x3 grid
    const offset = (page - 1) * limit;

    // Parse follower ranges
    const minFollowers = minFollowersStr ? parseInt(minFollowersStr) : 0;
    const maxFollowers = maxFollowersStr ? parseInt(maxFollowersStr) : 1000000; // Default max

    // First, get all Instagram connections with their basic data
    const instagramCreators = await c.req.db
      .select({
        id: schema.instagramConnections.id,
        workspaceId: schema.instagramConnections.workspaceId,
        creatorId: schema.workspaces.creatorId,
        userId: schema.creators.userId,
        instagramUserId: schema.instagramConnections.instagramUserId,
        username: schema.instagramConnections.username,
        name: schema.instagramConnections.name,
        accountType: schema.instagramConnections.accountType,
        profilePictureUrl: schema.instagramConnections.profilePictureUrl,
        followerCount: schema.instagramConnections.followerCount,
        followingCount: schema.instagramConnections.followingCount,
        mediaCount: schema.instagramConnections.mediaCount,
        avgLikes: schema.instagramConnections.avgLikes,
        avgComments: schema.instagramConnections.avgComments,
        avgSaves: schema.instagramConnections.avgSaves,
        avgShares: schema.instagramConnections.avgShares,
        engagementRate: schema.instagramConnections.engagementRate,
        audienceDemographics: schema.instagramConnections.audienceDemographics,
        lastSyncedAt: schema.instagramConnections.lastSyncedAt,
        createdAt: schema.instagramConnections.createdAt,
        updatedAt: schema.instagramConnections.updatedAt,
        // Join with users table to get user information
        userImage: schema.users.image,
        userEmail: schema.users.email,
      })
      .from(schema.instagramConnections)
      .leftJoin(
        schema.workspaces,
        eq(schema.instagramConnections.workspaceId, schema.workspaces.id)
      )
      .leftJoin(
        schema.creators,
        eq(schema.workspaces.creatorId, schema.creators.id)
      )
      .leftJoin(
        schema.users,
        eq(schema.creators.userId, schema.users.id)
      )
      // Apply filters
      .where(
        and(
          // Filter by follower count if specified
          gte(schema.instagramConnections.followerCount || 0, minFollowers),
          lte(schema.instagramConnections.followerCount || 0, maxFollowers),
          // Add search filter if provided
          search
            ? or(
                like(schema.instagramConnections.username || "", `%${search}%`),
                like(schema.instagramConnections.name || "", `%${search}%`)
              )
            : undefined
        )
      )
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await c.req.db
      .select({ count: count() })
      .from(schema.instagramConnections)
      .leftJoin(
        schema.workspaces,
        eq(schema.instagramConnections.workspaceId, schema.workspaces.id)
      )
      .leftJoin(
        schema.creators,
        eq(schema.workspaces.creatorId, schema.creators.id)
      )
      .leftJoin(
        schema.users,
        eq(schema.creators.userId, schema.users.id)
      )
      .where(
        and(
          gte(schema.instagramConnections.followerCount || 0, minFollowers),
          lte(schema.instagramConnections.followerCount || 0, maxFollowers),
          search
            ? or(
                like(schema.instagramConnections.username || "", `%${search}%`),
                like(schema.instagramConnections.name || "", `%${search}%`)
              )
            : undefined
        )
      )
      .then((res) => res[0]?.count || 0);

    // For each creator, get their latest metrics history
    const enhancedCreators = await Promise.all(
      instagramCreators.map(async (creator) => {
        // Get the latest metrics history for this connection
        const latestMetrics = await c.req.db
          .select()
          .from(schema.instagramMetricsHistory)
          .where(eq(schema.instagramMetricsHistory.connectionId, creator.id))
          .orderBy(desc(schema.instagramMetricsHistory.recordedAt))
          .limit(1);

        // Determine categories based on account type or other factors
        // This is a placeholder - you might want to implement a more sophisticated categorization
        const categories = creator.accountType
          ? [creator.accountType]
          : ["Lifestyle"];

        // Calculate average cost (placeholder - implement your own pricing logic)
        const followerCount = creator.followerCount || 0;
        let averageCost = "$100";
        if (followerCount > 500000) {
          averageCost = "$1000+";
        } else if (followerCount > 100000) {
          averageCost = "$500";
        } else if (followerCount > 10000) {
          averageCost = "$250";
        }

        return {
          id: creator.userId,
          name: creator.name || "Unknown Creator",
          email: creator.userEmail || "",
          image: creator.profilePictureUrl || creator.userImage || "",
          username: creator.username ? `@${creator.username}` : "@unknown",
          categories: categories,
          followerCount: creator.followerCount || 0,
          engagementRate: creator.engagementRate
            ? `${creator.engagementRate.toFixed(1)}%`
            : "0.0%",
          averageCost: averageCost,
          createdAt: creator.createdAt || "",
          // Additional metrics from history if available
          metrics: latestMetrics[0] || null,
        };
      })
    );

    return c.json({
      status: 200,
      data: {
        creators: enhancedCreators,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    throw new HTTPException(500, {
      message: "Failed to fetch creators",
    });
  }
});

// Get detailed creator profile by ID
businessRoutes.get("/creators/:id", async (c) => {
  try {
    const userId = c.req.param("id");
    console.log("Connecting to database...");

    if (!userId) {
      throw new HTTPException(400, { message: "User ID is required" });
    }

    console.log("Attempting to fetch creator with User ID:", userId);

    // Variable to store the found creator
    let creator;

    // Look up creator by userId instead of id
    const creatorRecord = await c.req.db
      .select({
        id: schema.creators.id,
        userId: schema.creators.userId,
        bio: schema.creators.bio,
        categories: schema.creators.categories,
        socialProof: schema.creators.socialProof,
        promotionRate: schema.creators.promotionRate,
        monetizationEnabled: schema.creators.monetizationEnabled,
        createdAt: schema.creators.createdAt,
        updatedAt: schema.creators.updatedAt,
      })
      .from(schema.creators)
      .where(eq(schema.creators.userId, userId))
      .limit(1);

    console.log("Creator query result by User ID:", creatorRecord);

    if (!creatorRecord || creatorRecord.length === 0) {
      // If not found by userId, try as a fallback to find by creator.id
      console.log("No creator found with User ID, trying as Creator ID:", userId);
      
      const fallbackRecord = await c.req.db
        .select({
          id: schema.creators.id,
          userId: schema.creators.userId,
          bio: schema.creators.bio,
          categories: schema.creators.categories,
          socialProof: schema.creators.socialProof,
          promotionRate: schema.creators.promotionRate,
          monetizationEnabled: schema.creators.monetizationEnabled,
          createdAt: schema.creators.createdAt,
          updatedAt: schema.creators.updatedAt,
        })
        .from(schema.creators)
        .where(eq(schema.creators.id, userId))
        .limit(1);
      
      console.log("Fallback query result by Creator ID:", fallbackRecord);
      
      if (!fallbackRecord || fallbackRecord.length === 0) {
        console.log("No creator found with either User ID or Creator ID:", userId);
        throw new HTTPException(404, { message: "Creator not found" });
      }
      
      // Use the creator found by ID
      creator = fallbackRecord[0];
      console.log("Successfully found creator by Creator ID:", creator.id);
    } else {
      // Continue with the found creator
      creator = creatorRecord[0];
      console.log("Successfully found creator by User ID:", creator.id);
    }

    // Get user information with specific columns
    const userInfo = (await c.req.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        image: schema.users.image,
      })
      .from(schema.users)
      .where(eq(schema.users.id, creator.userId))
      .limit(1)) as UserInfo[];

    const user = userInfo.length > 0 ? userInfo[0] : null;

    // Get Instagram connection for this creator if available with specific columns
    let instagram: InstagramConnection | null = null;
    try {
      const instagramConnection = (await c.req.db
        .select({
          id: schema.instagramConnections.id,
          workspaceId: schema.instagramConnections.workspaceId,
          instagramUserId: schema.instagramConnections.instagramUserId,
          username: schema.instagramConnections.username,
          name: schema.instagramConnections.name,
          accountType: schema.instagramConnections.accountType,
          profilePictureUrl: schema.instagramConnections.profilePictureUrl,
          followerCount: schema.instagramConnections.followerCount,
          followingCount: schema.instagramConnections.followingCount,
          mediaCount: schema.instagramConnections.mediaCount,
          avgLikes: schema.instagramConnections.avgLikes,
          avgComments: schema.instagramConnections.avgComments,
          avgSaves: schema.instagramConnections.avgSaves,
          avgShares: schema.instagramConnections.avgShares,
          engagementRate: schema.instagramConnections.engagementRate,
          audienceDemographics:
            schema.instagramConnections.audienceDemographics,
          lastSyncedAt: schema.instagramConnections.lastSyncedAt,
        })
        .from(schema.instagramConnections)
        .where(and(
          // Find Instagram connections for workspaces owned by this creator
          inArray(
            schema.instagramConnections.workspaceId,
            c.req.db
              .select({ id: schema.workspaces.id })
              .from(schema.workspaces)
              .where(eq(schema.workspaces.creatorId, creator.id))
          )
        ))
        .limit(1)) as InstagramConnection[];

      instagram =
        instagramConnection.length > 0 ? instagramConnection[0] : null;
    } catch (error) {
      console.error("Error fetching Instagram connection:", error);
      // Continue execution, instagram will be null
    }

    // Get metrics history for engagement trends if Instagram is connected
    let metricsHistory: InstagramMetricsHistory[] = [];

    if (instagram) {
      try {
        metricsHistory = (await c.req.db
          .select({
            id: schema.instagramMetricsHistory.id,
            connectionId: schema.instagramMetricsHistory.connectionId,
            followerCount: schema.instagramMetricsHistory.followerCount,
            followingCount: schema.instagramMetricsHistory.followingCount,
            mediaCount: schema.instagramMetricsHistory.mediaCount,
            avgLikes: schema.instagramMetricsHistory.avgLikes,
            avgComments: schema.instagramMetricsHistory.avgComments,
            avgSaves: schema.instagramMetricsHistory.avgSaves,
            avgShares: schema.instagramMetricsHistory.avgShares,
            engagementRate: schema.instagramMetricsHistory.engagementRate,
            linkpClicks: schema.instagramMetricsHistory.linkpClicks,
            linkpConversions: schema.instagramMetricsHistory.linkpConversions,
            linkpCtr: schema.instagramMetricsHistory.linkpCtr,
            recordedAt: schema.instagramMetricsHistory.recordedAt,
          })
          .from(schema.instagramMetricsHistory)
          .where(eq(schema.instagramMetricsHistory.connectionId, instagram.id))
          .orderBy(desc(schema.instagramMetricsHistory.recordedAt))
          .limit(10)) as InstagramMetricsHistory[];
      } catch (error) {
        console.error("Error fetching metrics history:", error);
        // Continue with empty metrics history array
      }
    }

    // Get the creator's workspaces (for link-in-bio data)
    const workspaces = await c.req.db
      .select({
        id: schema.workspaces.id,
        creatorId: schema.workspaces.creatorId,
        name: schema.workspaces.name,
        slug: schema.workspaces.slug,
        createdAt: schema.workspaces.createdAt,
        updatedAt: schema.workspaces.updatedAt,
      })
      .from(schema.workspaces)
      .where(eq(schema.workspaces.creatorId, creator.id));

    // If there are workspaces, get the links for the first workspace
    let workspaceLinks: WorkspaceLinkQueryResult[] = [];
    let linkViewsCount = 0;

    if (workspaces.length > 0) {
      const primaryWorkspace = workspaces[0];

      // Get links for this workspace
      try {
        workspaceLinks = await c.req.db
          .select({
            id: schema.workspaceLinks.id,
            workspaceId: schema.workspaceLinks.workspaceId,
            title: schema.workspaceLinks.title,
            url: schema.workspaceLinks.url,
            type: schema.workspaceLinks.type,
            isActive: schema.workspaceLinks.isActive,
            platform: schema.workspaceLinks.platform,
            icon: schema.workspaceLinks.icon,
            backgroundColor: schema.workspaceLinks.backgroundColor,
            order: schema.workspaceLinks.order,
            config: schema.workspaceLinks.config,
            createdAt: schema.workspaceLinks.createdAt,
            updatedAt: schema.workspaceLinks.updatedAt,
          })
          .from(schema.workspaceLinks)
          .where(eq(schema.workspaceLinks.workspaceId, primaryWorkspace.id));
      } catch (error) {
        console.error("Error fetching workspace links:", error);
        // Continue with empty workspaceLinks array
      }

      // Get aggregated metrics for link views
      try {
        // The aggregatedMetrics table has a 'metrics' JSON field instead of 'count' or 'metricType' fields
        // We need to extract the relevant metrics from the JSON data
        const linkViewsMetrics = await c.req.db
          .select({
            metrics: schema.aggregatedMetrics.metrics,
          })
          .from(schema.aggregatedMetrics)
          .where(eq(schema.aggregatedMetrics.workspaceId, primaryWorkspace.id));

        // Calculate total page views from all metrics records
        let totalViews = 0;
        for (const record of linkViewsMetrics) {
          if (record.metrics && typeof record.metrics === "object") {
            // Extract uniqueVisitors from the metrics JSON data
            const metricsData = record.metrics as {
              totalClicks?: number;
              uniqueVisitors?: number;
            };
            // Use uniqueVisitors as a proxy for page views
            if (typeof metricsData.uniqueVisitors === "number") {
              totalViews += metricsData.uniqueVisitors;
            }
          }
        }

        linkViewsCount = totalViews;
      } catch (error) {
        console.error("Error fetching link views metrics:", error);
        // Continue with default value for linkViewsCount
      }
    }

    // Get link click metrics for each link
    const linksWithMetrics: LinkWithMetrics[] = await Promise.all(
      workspaceLinks.map(async (link) => {
        try {
          // Using the metrics JSON field which contains the actual metrics data
          // The aggregatedMetrics table has a 'metrics' JSON field instead of 'count' or 'metricType' fields
          const clickMetrics = await c.req.db
            .select({
              metrics: schema.aggregatedMetrics.metrics,
            })
            .from(schema.aggregatedMetrics)
            .where(eq(schema.aggregatedMetrics.linkId, link.id));

          // Calculate total clicks from all metrics records
          let totalClicks = 0;
          for (const record of clickMetrics) {
            if (record.metrics && typeof record.metrics === "object") {
              // Extract totalClicks from the metrics JSON data
              const metricsData = record.metrics as { totalClicks?: number };
              if (typeof metricsData.totalClicks === "number") {
                totalClicks += metricsData.totalClicks;
              }
            }
          }

          // Return a properly typed LinkWithMetrics object
          return {
            id: link.id,
            title: link.title,
            url: link.url,
            type: link.type,
            clicks: totalClicks,
          };
        } catch (error) {
          console.error(
            `Error fetching click metrics for link ${link.id}:`,
            error
          );
          // Return default metrics on error with proper typing
          return {
            id: link.id,
            title: link.title,
            url: link.url,
            type: link.type,
            clicks: 0,
          };
        }
      })
    );

    // Check for any active promotional proposals for this creator
    let pendingProposalsCount = 0;
    try {
      const activeProposals = await c.req.db
        .select({
          count: sql`count(*)`,
        })
        .from(schema.promotionalLinkProposals)
        .where(
          and(
            eq(schema.promotionalLinkProposals.creatorId, creator.id),
            eq(schema.promotionalLinkProposals.status, "pending")
          )
        );

      // Calculate availability based on active proposals and other factors
      pendingProposalsCount =
        typeof activeProposals[0]?.count === "number"
          ? activeProposals[0].count
          : 0;
    } catch (error) {
      console.error("Error fetching active proposals:", error);
      // Continue with default value for pendingProposalsCount
    }
    const availabilityStatus =
      pendingProposalsCount > 5
        ? "unavailable"
        : pendingProposalsCount > 2
          ? "limited"
          : "available";

    const availabilityPercentage =
      availabilityStatus === "available"
        ? 100
        : availabilityStatus === "limited"
          ? 50
          : 0;

    // Get previous collaborations from the collaborations table
    let collaborationsData: Collaboration[] = [];

    try {
      // The collaborations table has a metrics JSON field that contains clicks, conversions, and revenue
      // but doesn't have title or description fields according to the schema
      collaborationsData = await c.req.db
        .select({
          id: schema.collaborations.id,
          businessId: schema.collaborations.businessId,
          businessName: schema.businesses.companyName,
          // Note: title and description don't exist in the collaborations table
          // We'll provide default values for these after the query
          startDate: schema.collaborations.startDate,
          endDate: schema.collaborations.endDate,
          status: schema.collaborations.status,
          metrics: schema.collaborations.metrics,
        })
        .from(schema.collaborations)
        .leftJoin(
          schema.businesses,
          eq(schema.collaborations.businessId, schema.businesses.id)
        )
        .where(
          and(
            eq(schema.collaborations.creatorId, creator.id),
            or(
              eq(schema.collaborations.status, "completed"),
              eq(schema.collaborations.status, "active")
            )
          )
        )
        .orderBy(desc(schema.collaborations.endDate))
        .limit(5);
    } catch (error) {
      console.error("Error fetching collaborations data:", error);
      // If there's an error with the new table (e.g., it doesn't exist yet in some environments),
      // we'll fall back to the old method below
      collaborationsData = [];
    }

    // If no collaborations found in the new table, fall back to promotional link proposals
    // This is for backward compatibility during migration
    let previousCollaborations: Collaboration[] = [];

    if (collaborationsData.length === 0) {
      // For backward compatibility, fall back to promotional link proposals
      // The metrics field might be stored differently in this table
      previousCollaborations = await c.req.db
        .select({
          id: schema.promotionalLinkProposals.id,
          businessId: schema.promotionalLinkProposals.businessId,
          businessName: schema.businesses.companyName,
          title: schema.promotionalLinkProposals.title,
          url: schema.promotionalLinkProposals.url, // Include URL field which exists in the schema
          startDate: schema.promotionalLinkProposals.startDate,
          endDate: schema.promotionalLinkProposals.endDate,
          status: schema.promotionalLinkProposals.status,
          price: schema.promotionalLinkProposals.price, // Include price field which exists in the schema
          workspaceLinkId: schema.promotionalLinkProposals.workspaceLinkId, // Include workspaceLinkId to fetch metrics
          // Note: description and metrics fields don't exist in the schema
          // We'll provide default values for these fields after the query
        })
        .from(schema.promotionalLinkProposals)
        .leftJoin(
          schema.businesses,
          eq(schema.promotionalLinkProposals.businessId, schema.businesses.id)
        )
        .where(
          and(
            eq(schema.promotionalLinkProposals.creatorId, creator.id),
            eq(schema.promotionalLinkProposals.status, "accepted")
          )
        )
        .orderBy(desc(schema.promotionalLinkProposals.endDate))
        .limit(5);
    }

    // Use creator categories from the creators table or fallback to Instagram account type
    const categories =
      creator.categories && creator.categories.length > 0
        ? creator.categories
        : instagram?.accountType
          ? [instagram.accountType]
          : ["Lifestyle"];

    // Calculate average cost based on promotion rate or follower count
    const promotionRate = creator.promotionRate || 0;
    const followerCount = instagram?.followerCount || 0;
    let averageCost =
      promotionRate > 0 ? `$${(promotionRate / 100).toFixed(0)}` : "$100";
    if (followerCount > 500000) {
      averageCost = "$1000+";
    } else if (followerCount > 100000) {
      averageCost = "$500";
    } else if (followerCount > 10000) {
      averageCost = "$250";
    }

    // First, extract any workspaceLinkIds from promotional link proposals to fetch metrics
    const workspaceLinkIds = previousCollaborations
      .filter((collab) => collab.workspaceLinkId)
      .map((collab) => collab.workspaceLinkId as string);

    // Create a map to store metrics by workspaceLinkId
    const metricsMap = new Map<
      string,
      {
        clicks: number;
        conversions: number;
        revenue: number;
        impressions: number;
      }
    >();

    // If we have any workspaceLinkIds, fetch their metrics from the promotionalLinkMetrics table
    if (workspaceLinkIds.length > 0) {
      try {
        const promotionalMetrics = await c.req.db
          .select({
            workspaceLinkId: schema.promotionalLinkMetrics.workspaceLinkId,
            clicks: schema.promotionalLinkMetrics.clicks,
            conversions: schema.promotionalLinkMetrics.conversions,
            revenue: schema.promotionalLinkMetrics.revenue,
            impressions: schema.promotionalLinkMetrics.impressions,
          })
          .from(schema.promotionalLinkMetrics)
          .where(
            inArray(
              schema.promotionalLinkMetrics.workspaceLinkId,
              workspaceLinkIds
            )
          );

        // Store metrics in the map for quick lookup
        for (const metric of promotionalMetrics) {
          metricsMap.set(metric.workspaceLinkId, {
            clicks: metric.clicks || 0,
            conversions: metric.conversions || 0,
            revenue: metric.revenue || 0,
            impressions: metric.impressions || 0, // Include impressions from promotionalLinkMetrics
          });
        }
      } catch (e) {
        console.error("Error fetching promotional link metrics:", e);
        // Continue with empty metrics map
      }
    }

    // Format the collaborations with consistent property names for the frontend
    const formattedCollaborations = [
      ...collaborationsData,
      ...previousCollaborations,
    ].map((collab) => {
      // Add default values for missing fields
      // - title doesn't exist in collaborations table
      // - description doesn't exist in either table
      const defaultTitle = "Collaboration";
      const defaultDescription = `Promotional campaign with ${collab.businessName || "a business"}`;

      // Default metrics - these would typically include:
      // - clicks: Number of times the promotional link was clicked
      // - conversions: Number of successful conversions from clicks (e.g., purchases, sign-ups)
      // - revenue: Money generated from the promotion
      // - impressions: Number of times the promotional link was viewed (from promotionalLinkMetrics)
      let metricsData = {
        clicks: 0,
        conversions: 0,
        revenue: 0,
        impressions: 0,
      };

      // First check if we have metrics in the metricsMap for this collaboration
      if (collab.workspaceLinkId && metricsMap.has(collab.workspaceLinkId)) {
        metricsData = metricsMap.get(collab.workspaceLinkId) || metricsData;
      }
      // Otherwise, process metrics if they exist (for collaborations from the collaborations table)
      else if (collab.metrics) {
        try {
          // Handle both string JSON and object formats
          let parsedMetrics: Record<string, any>;

          if (typeof collab.metrics === "string") {
            try {
              parsedMetrics = JSON.parse(collab.metrics);
            } catch (parseError) {
              console.error("Error parsing metrics JSON string:", parseError);
              parsedMetrics = {};
            }
          } else {
            // It's already an object
            parsedMetrics = collab.metrics as Record<string, any>;
          }

          // Safely extract and convert metrics values with fallbacks
          const clicks = parsedMetrics.clicks;
          const conversions = parsedMetrics.conversions;
          const revenue = parsedMetrics.revenue;
          const impressions = parsedMetrics.impressions;

          metricsData = {
            clicks:
              typeof clicks === "number"
                ? clicks
                : typeof clicks === "string"
                  ? parseInt(clicks, 10) || 0
                  : 0,
            conversions:
              typeof conversions === "number"
                ? conversions
                : typeof conversions === "string"
                  ? parseInt(conversions, 10) || 0
                  : 0,
            revenue:
              typeof revenue === "number"
                ? revenue
                : typeof revenue === "string"
                  ? parseInt(revenue, 10) || 0
                  : 0,
            impressions:
              typeof impressions === "number"
                ? impressions
                : typeof impressions === "string"
                  ? parseInt(impressions, 10) || 0
                  : 0,
          };
        } catch (e) {
          console.error("Error processing metrics data:", e);
          // Keep default values in case of error
        }
      }

      return {
        // Properties expected by the frontend
        businessName: collab.businessName || "Unknown Business",
        // Use title if it exists (from promotionalLinkProposals) or default
        title: collab.title || defaultTitle,
        // Include URL if it exists (from promotionalLinkProposals)
        url: collab.url || null,
        // Use description if it exists (neither table has it by default) or generate one
        description: collab.description || defaultDescription,
        startDate: collab.startDate
          ? new Date(collab.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "Unknown date",
        endDate: collab.endDate
          ? new Date(collab.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "Unknown date",
        // Include status information
        status: collab.status || "completed",
        // Include price if it exists (from promotionalLinkProposals)
        price: collab.price || null,
        // Include properly formatted metrics
        metrics: metricsData,
        // For backward compatibility
        brand: collab.businessName || "Unknown Business",
        date: collab.endDate
          ? new Date(collab.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "Unknown date",
      };
    });

    // Build the detailed creator profile
    const detailedCreator = {
      id: creator.id,
      name: instagram?.name || user?.name || "Unknown Creator",
      email: user?.email || "",
      image: instagram?.profilePictureUrl || user?.image || "",
      username: instagram?.username ? `@${instagram.username}` : "@unknown",
      categories: categories,
      followerCount: instagram?.followerCount || 0,
      engagementRate: instagram?.engagementRate
        ? `${instagram.engagementRate.toFixed(1)}%`
        : "0.0%",
      averageCost: averageCost,
      createdAt: creator.createdAt || "",
      bio:
        creator.bio ||
        `${instagram?.name || "This creator"} is a ${categories.join(", ")} content creator with ${formatNumber(instagram?.followerCount || 0)} followers.`,
      location: "Worldwide", // This could be derived from audience demographics if available
      availability: {
        status: availabilityStatus,
        percentage: availabilityPercentage,
      },
      linkInBio: {
        views: linkViewsCount,
        links: linksWithMetrics,
      },
      engagement: {
        rate: instagram?.engagementRate || 0,
        averageComments: instagram?.avgComments || 0,
        averageLikes: instagram?.avgLikes || 0,
      },
      previousCollaborations: formattedCollaborations,
      metrics: metricsHistory,
      workspaces: workspaces.map(workspace => ({
        id: workspace.id,
        name: workspace.name || "Default Workspace",
        slug: workspace.slug || "default",
        createdAt: workspace.createdAt ? new Date(workspace.createdAt).toISOString() : "",
        updatedAt: workspace.updatedAt ? new Date(workspace.updatedAt).toISOString() : ""
      })),
    };

    return c.json({
      status: 200,
      data: {
        creator: detailedCreator,
      },
    });
  } catch (error) {
    console.error("Error fetching creator details:", error);
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, {
      message: "Failed to fetch creator details",
    });
  }
});

export default businessRoutes;

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}
