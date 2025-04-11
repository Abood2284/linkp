// apps/linkp-worker/src/routes/instagram.ts
import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { withSession } from "../auth/session";
import { and, eq, sql } from "drizzle-orm";
import {
  instagramConnections,
  instagramMetricsHistory,
  workspaces,
  creators,
} from "@repo/db/schema";

interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface InstagramProfileResponse {
  id: string;
  username: string;
}

interface InstagramWebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: {
        mid: string;
        text: string;
      };
    }>;
  }>;
}

const instagramRoutes = new Hono<{ Bindings: Env }>();

// Configuration constants
const INSTAGRAM_APP_ID = "28798183066492843";
const INSTAGRAM_APP_SECRET = "053045a05514979936be7f30a623843a";
const INSTAGRAM_VERIFY_TOKEN = "ICYrRBabrfbrqyfmzmUYsw4srT1udx1E";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-worker-url.workers.dev";
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

// Webhook verification endpoint (GET)
instagramRoutes.get("/webhook", async (c) => {
  console.log(`🔍 Instagram Webhook Verification Request Received`);
  try {
    const { searchParams } = new URL(c.req.url);
    console.log(`📝 Request URL: ${c.req.url}`);

    // Get the params that Instagram sends
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log(`🔑 Verification Parameters:
      Mode: ${mode}
      Token: ${token}
      Challenge: ${challenge}
    `);

    // Validate verification request
    if (mode === "subscribe" && token === INSTAGRAM_VERIFY_TOKEN && challenge) {
      console.log(`✅ Webhook Verification Successful`);
      // Respond with the challenge to confirm ownership
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.log(`❌ Webhook Verification Failed`);
    // Invalid verification request
    throw new HTTPException(403, { message: "Verification failed" });
  } catch (error) {
    console.error(`💥 Instagram Webhook Verification Error:`, error);
    throw new HTTPException(200, { message: "Webhook verification failed" });
  }
});

// Webhook event handling (POST)
instagramRoutes.post("/webhook", async (c) => {
  console.log(`📨 Instagram Webhook Event Received`);
  try {
    // Get the request body
    const body = (await c.req.json()) as InstagramWebhookEvent;

    // Log the received event
    console.log("Received Instagram webhook event:", JSON.stringify(body));

    // TODO: Validate the webhook signature using X-Hub-Signature header
    // This requires implementing HMAC verification with your app secret
    console.log(`📦 Webhook Event Data:`, JSON.stringify(body, null, 2));

    // Process different event types
    if (body.object === "instagram") {
      console.log(`🎯 Processing Instagram Event`);
      for (const entry of body.entry) {
        console.log(`📝 Processing Entry ID: ${entry.id}`);
        // Store the event in your database for processing
        await c.req.db.execute(sql`
          INSERT INTO instagram_webhook_events (event_data, processed)
          VALUES (${JSON.stringify(body)}, false)
        `);

        // You can process events here or trigger a background task
        console.log(`💾 Stored Webhook Event in Database`);
      }

      console.log(`✅ Successfully Processed Webhook Event`);
      // Acknowledge receipt
      return c.json({ status: 200, message: "Event received" });
    }

    console.log(`⚠️ Unsupported Event Type: ${body.object}`);
    throw new HTTPException(200, { message: "Unsupported event" });
  } catch (error) {
    console.error(`💥 Instagram Webhook Processing Error:`, error);
    throw new HTTPException(200, { message: "Webhook processing failed" });
  }
});

// Helper function to fetch Instagram insights
async function fetchInstagramInsights(
  accessToken: string,
  instagramUserId: string
) {
  try {
    // Fetch basic account information (followers, following, media count)
    console.log(
      `📊 Fetching basic account information for user ID: ${instagramUserId}`
    );
    const basicInfoUrl = `https://graph.instagram.com/v22.0/${instagramUserId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,account_type&access_token=${accessToken}`;
    const basicInfoResponse = await fetch(basicInfoUrl);
    // Define the type for basic account info
    interface InstagramBasicInfo {
      id?: string;
      username?: string;
      name?: string;
      profile_picture_url?: string;
      followers_count?: number;
      follows_count?: number;
      media_count?: number;
      account_type?: string;
    }
    const basicInfoData =
      (await basicInfoResponse.json()) as InstagramBasicInfo;
    console.log(
      `📊 Basic account info response status: ${basicInfoResponse.status}`
    );
    console.log(
      `📊 Basic account info data:`,
      JSON.stringify(basicInfoData, null, 2)
    );

    // Fetch interaction metrics with total_value metric type
    console.log(
      `📊 Fetching interaction metrics for user ID: ${instagramUserId}`
    );
    const interactionMetricsUrl = `https://graph.instagram.com/v22.0/${instagramUserId}/insights?metric=accounts_engaged,reach,total_interactions,profile_links_taps&period=day&metric_type=total_value&access_token=${accessToken}`;
    const interactionMetricsResponse = await fetch(interactionMetricsUrl);
    const interactionMetricsData =
      (await interactionMetricsResponse.json()) as {
        data?: any[];
      };
    console.log(
      `📊 Interaction metrics response status: ${interactionMetricsResponse.status}`
    );
    console.log(
      `📊 Interaction metrics data:`,
      JSON.stringify(interactionMetricsData, null, 2)
    );

    // Fetch reach metrics with media_product_type breakdown
    console.log(
      `📊 Fetching reach breakdown metrics for user ID: ${instagramUserId}`
    );
    const reachBreakdownUrl = `https://graph.instagram.com/v22.0/${instagramUserId}/insights?metric=reach&period=day&breakdown=media_product_type&metric_type=total_value&access_token=${accessToken}`;
    const reachBreakdownResponse = await fetch(reachBreakdownUrl);
    const reachBreakdownData = (await reachBreakdownResponse.json()) as {
      data?: any[];
    };
    console.log(
      `📊 Reach breakdown response status: ${reachBreakdownResponse.status}`
    );
    console.log(
      `📊 Reach breakdown data:`,
      JSON.stringify(reachBreakdownData, null, 2)
    );

    // Fetch views metric (replacement for impressions)
    console.log(`📊 Fetching views metrics for user ID: ${instagramUserId}`);
    const viewsUrl = `https://graph.instagram.com/v22.0/${instagramUserId}/insights?metric=views&period=day&metric_type=total_value&access_token=${accessToken}`;
    const viewsResponse = await fetch(viewsUrl);
    const viewsData = (await viewsResponse.json()) as {
      data?: any[];
    };
    console.log(`📊 Views response status: ${viewsResponse.status}`);
    console.log(`📊 Views data:`, JSON.stringify(viewsData, null, 2));

    // Fetch follower demographics (lifetime period)
    console.log(
      `📊 Fetching follower demographics for user ID: ${instagramUserId}`
    );
    const demographicsUrl = `https://graph.instagram.com/v22.0/${instagramUserId}/insights?metric=follower_demographics&period=lifetime&timeframe=last_30_days&breakdown=country&metric_type=total_value&access_token=${accessToken}`;
    const demographicsResponse = await fetch(demographicsUrl);
    const demographicsData = (await demographicsResponse.json()) as {
      data?: any[];
    };
    console.log(
      `📊 Follower demographics response status: ${demographicsResponse.status}`
    );
    console.log(
      `📊 Follower demographics data:`,
      JSON.stringify(demographicsData, null, 2)
    );

    // Fetch engaged audience demographics
    console.log(
      `📊 Fetching engaged audience demographics for user ID: ${instagramUserId}`
    );
    const engagedDemographicsUrl = `https://graph.instagram.com/v22.0/${instagramUserId}/insights?metric=engaged_audience_demographics&period=lifetime&timeframe=last_30_days&breakdown=country&metric_type=total_value&access_token=${accessToken}`;
    const engagedDemographicsResponse = await fetch(engagedDemographicsUrl);
    const engagedDemographicsData =
      (await engagedDemographicsResponse.json()) as {
        data?: any[];
      };
    console.log(
      `📊 Engaged audience demographics response status: ${engagedDemographicsResponse.status}`
    );
    console.log(
      `📊 Engaged audience demographics data:`,
      JSON.stringify(engagedDemographicsData, null, 2)
    );

    // Fetch content performance metrics
    console.log(
      `📊 Fetching content performance metrics for user ID: ${instagramUserId}`
    );
    const contentUrl = `https://graph.instagram.com/v22.0/${instagramUserId}/media?fields=id,media_type,media_url,permalink,thumbnail_url,timestamp,caption,like_count,comments_count&limit=5&access_token=${accessToken}`;
    const contentResponse = await fetch(contentUrl);
    const contentData = (await contentResponse.json()) as {
      data?: any[];
    };
    console.log(
      `📊 Content performance response status: ${contentResponse.status}`
    );
    console.log(
      `📊 Content performance data:`,
      JSON.stringify(contentData, null, 2)
    );

    return {
      basicInfo: basicInfoData || {},
      interactionMetrics: interactionMetricsData.data || [],
      reachBreakdown: reachBreakdownData.data || [],
      views: viewsData.data || [],
      followerDemographics: demographicsData.data || [],
      engagedDemographics: engagedDemographicsData.data || [],
      content: contentData.data || [],
    };
  } catch (error) {
    console.error("Error fetching Instagram insights:", error);
    return {
      basicInfo: {},
      interactionMetrics: [],
      reachBreakdown: [],
      views: [],
      followerDemographics: [],
      engagedDemographics: [],
      content: [],
    };
  }
}

// Calculate engagement rate
function calculateEngagementRate(
  followerCount: number,
  interactionMetrics: any[]
) {
  try {
    // Find the accounts_engaged metric
    const engagedAccounts = interactionMetrics.find(
      (metric: any) => metric.name === "accounts_engaged"
    );
    if (!engagedAccounts || !followerCount) return 0;

    // Calculate engagement rate as percentage
    const engaged = engagedAccounts.total_value?.value || 0;
    console.log(
      `Engaged accounts: ${((engaged / followerCount) * 100).toFixed(2)}`
    );
    return ((engaged / followerCount) * 100).toFixed(2);
  } catch (error) {
    console.error("Error calculating engagement rate:", error);
    return 0;
  }
}

// New endpoint to fetch Instagram profile data for a workspace
instagramRoutes.get("/profile/:workspaceSlug", async (c) => {
  console.log(`📊 Request received for Instagram profile data`);
  const handler = withSession(async (c, session) => {
    console.log(`🔑 User Session Found: ${session.user.id}`);
    try {
      const { workspaceSlug } = c.req.param();
      console.log(`🔍 Fetching profile for workspace slug: ${workspaceSlug}`);

      if (!workspaceSlug) {
        console.log(`❌ Missing workspaceSlug parameter`);
        throw new HTTPException(400, { message: "workspaceSlug is required" });
      }

      // 1. Find the creator associated with the user
      const creator = await c.req.db.query.creators.findFirst({
        where: eq(creators.userId, session.user.id),
        columns: {
          id: true,
        },
      });

      if (!creator) {
        console.log(`❌ Creator not found for user ${session.user.id}`);
        throw new HTTPException(404, { message: "Creator profile not found" });
      }

      // 2. Find the workspace to ensure it belongs to the creator
      const workspace = await c.req.db.query.workspaces.findFirst({
        where: and(
          eq(workspaces.slug, workspaceSlug),
          eq(workspaces.creatorId, creator.id)
        ),
        columns: {
          id: true,
        },
      });

      if (!workspace) {
        console.log(
          `❌ Workspace not found or creator doesn't own slug ${workspaceSlug}`
        );
        throw new HTTPException(404, {
          message: "Workspace not found or access denied",
        });
      }
      console.log(
        `✅ Workspace found: ${workspace.id} for creator ${creator.id}`
      );

      // 2. Find the Instagram connection for the workspace
      const connection = await c.req.db.query.instagramConnections.findFirst({
        where: eq(instagramConnections.workspaceId, workspace.id),
        columns: {
          instagramUserId: true,
        },
      });

      if (!connection || !connection.instagramUserId) {
        console.log(
          `❌ No Instagram connection found for workspace ${workspace.id}`
        );
        // Return a 200 response with a flag indicating no connection instead of throwing an error
        return c.json({
          success: false,
          connected: false,
          message: "Instagram connection not found",
        });
      }
      console.log(
        `✅ Instagram connection found, Instagram User ID: ${connection.instagramUserId}`
      );

      // Extract total reach from insights
      function extractReach(interactionMetrics: any[]) {
        try {
          const reachMetric = interactionMetrics.find(
            (metric: any) => metric.name === "reach"
          );
          console.log(`Reach metric: ${reachMetric?.total_value?.value}`);
          return reachMetric?.total_value?.value || 0;
        } catch (error) {
          console.error("Error extracting reach:", error);
          return 0;
        }
      }

      // Extract profile views from insights
      function extractProfileViews(interactionMetrics: any[]) {
        try {
          const profileLinksMetric = interactionMetrics.find(
            (metric: any) => metric.name === "profile_links_taps"
          );
          console.log(
            `☕️ Profile views/taps metric: ${profileLinksMetric?.total_value?.value}`
          );
          return profileLinksMetric?.total_value?.value || 0;
        } catch (error) {
          console.error("Error extracting profile views:", error);
          return 0;
        }
      }

      // Extract views (impressions replacement) from insights
      function extractViews(viewsData: any[]) {
        try {
          const viewsMetric = viewsData.find(
            (metric: any) => metric.name === "views"
          );
          console.log(`☕️ Views metric: ${viewsMetric?.total_value?.value}`);
          return viewsMetric?.total_value?.value || 0;
        } catch (error) {
          console.error("Error extracting views:", error);
          return 0;
        }
      }

      // 3. Fetch the Instagram profile using the instagramUserId
      const profile = await c.req.db.query.instagramConnections.findFirst({
        where: eq(
          instagramConnections.instagramUserId,
          connection.instagramUserId
        ),
        columns: {
          username: true,
          instagramUserId: true,
          lastSyncedAt: true,
          accessToken: true,
          followerCount: true, // Add this to schema if not already present
          // Only include fields that exist in the schema
        },
      });

      if (!profile) {
        console.log(
          `❌ Instagram profile not found for Instagram User ID: ${connection.instagramUserId}`
        );
        // This might indicate the initial sync hasn't completed or failed
        throw new HTTPException(404, {
          message: "Instagram profile data not found",
        });
      }
      console.log(
        `✅ Instagram profile found for ${profile.username} (ID: ${profile.instagramUserId})`
      );

      // 4. Fetch additional Instagram insights if we have an access token
      let insights = null;
      let engagementRate = 0;
      let profileViews = 0;
      let reachData = null;
      let impressionsData = null;

      if (profile.accessToken) {
        try {
          console.log(
            `🔍 Fetching additional Instagram insights for ${profile.username}`
          );
          insights = await fetchInstagramInsights(
            profile.accessToken,
            profile.instagramUserId
          );

          // Calculate engagement rate
          engagementRate = calculateEngagementRate(
            profile.followerCount || 0,
            insights.interactionMetrics
          ) as number;
          console.log(`☕️ Engagement rate: ${engagementRate}`);

          // Get profile views/taps
          profileViews = extractProfileViews(insights.interactionMetrics);
          console.log(`☕️ Profile views/taps: ${profileViews}`);

          // Get reach data
          const reachValue = extractReach(insights.interactionMetrics);
          console.log(`☕️ Reach: ${reachValue}`);

          // Get views data (replacement for impressions)
          const viewsValue = extractViews(insights.views);
          console.log(`☕️ Views: ${viewsValue}`);

          console.log(
            `✅ Successfully fetched Instagram insights for ${profile.username}`
          );

          // Store the extracted values for response
          reachData = { total_value: { value: reachValue } };
          impressionsData = { total_value: { value: viewsValue } };
        } catch (error) {
          console.error(`❌ Error fetching Instagram insights:`, error);
          // Continue with basic profile data even if insights fail
        }
      }

      // 5. Return enhanced profile data with basic account information
      return c.json({
        success: true,
        connected: true,
        status: 200,
        data: {
          ...profile,
          // Use the basic account information from the Instagram Graph API
          followerCount:
            insights?.basicInfo?.followers_count || profile.followerCount || 0,
          followingCount: insights?.basicInfo?.follows_count || 0,
          mediaCount: insights?.basicInfo?.media_count || 0,
          accountType: insights?.basicInfo?.account_type || "",
          profilePictureUrl: insights?.basicInfo?.profile_picture_url || "",
          name: insights?.basicInfo?.name || "",
          // Include the engagement metrics
          engagementRate: Number(engagementRate) || 0,
          profileViews,
          reach: reachData?.total_value?.value || 0,
          impressions: impressionsData?.total_value?.value || 0,
          insights: insights
            ? {
                basicInfo: insights.basicInfo,
                interactionMetrics: insights.interactionMetrics,
                reachBreakdown: insights.reachBreakdown,
                views: insights.views,
                followerDemographics: insights.followerDemographics,
                engagedDemographics: insights.engagedDemographics,
                content: insights.content,
              }
            : null,
          // Add estimated earnings and growth data (can be replaced with real data later)
          estimatedEarnings: {
            perPost: profile.followerCount
              ? Math.round(Number(profile.followerCount) * 0.01 * 100) / 100
              : 0,
            monthly: profile.followerCount
              ? Math.round(Number(profile.followerCount) * 0.04 * 100) / 100
              : 0,
          },
          growth: {
            followers: 5.2, // Placeholder percentage growth
            engagement: 3.8, // Placeholder percentage growth
          },
          websiteClicks: 142, // Placeholder data
        },
      });
    } catch (error) {
      console.error(`💥 Error fetching Instagram profile data:`, error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, {
        message: "Failed to fetch Instagram profile data",
      });
    }
  });
  return handler(c);
});

// OAuth callback handler

instagramRoutes.get("/callback", async (c) => {
  console.log(`🔄 Instagram OAuth Callback Received`);
  try {
    const { searchParams } = new URL(c.req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    console.log(`🔑 OAuth Parameters:
      Code: ${code}
      State: ${state}
    `);

    if (!code || !state) {
      console.log(`❌ Missing Required OAuth Parameters`);
      throw new HTTPException(400, { message: "Missing required parameters" });
    }

    // Parse the composite state to extract workspace slug and random state
    const [workspaceSlug, randomState] = state.split(":");
    console.log(`🔍 State Parameter: ${state}`);
    console.log(`🔍 Parsed Workspace Slug: ${workspaceSlug}`);
    console.log(`🔍 Parsed Random State: ${randomState}`);

    // Get the workspace details
    const workspace = await c.req.db.query.workspaces.findFirst({
      where: eq(workspaces.slug, workspaceSlug),
      columns: {
        id: true,
        userId: true,
      },
    });

    if (!workspace) {
      console.log(`❌ No workspace found with slug: ${workspaceSlug}`);
      throw new HTTPException(404, { message: "Workspace not found" });
    }

    console.log(`✅ Found workspace with ID: ${workspace.id}`);

    // Exchange code for short-lived access token
    console.log(`🔄 Exchanging Code for Access Token`);

    const redirectUri =
      "https://b34e-115-98-235-132.ngrok-free.app/api/instagram/callback";

    // Prepare form data
    const formData = new FormData();
    formData.append("client_id", INSTAGRAM_APP_ID);
    formData.append("client_secret", INSTAGRAM_APP_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUri);
    formData.append("code", code);

    console.log(`📤 Sending token request with:
      client_id: ${INSTAGRAM_APP_ID}
      redirect_uri: ${redirectUri}
      code: ${code.substring(0, 10)}...
    `);

    const tokenResponse = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        body: formData,
      }
    );

    const responseText = await tokenResponse.text();
    console.log(`📥 Raw API Response: ${responseText}`);

    let tokenData;
    try {
      tokenData = JSON.parse(responseText) as InstagramTokenResponse;
      console.log(`🔑 Parsed Token Data:`, JSON.stringify(tokenData, null, 2));
    } catch (parseError) {
      console.error(`💥 Failed to parse token response:`, parseError);
      throw new HTTPException(500, {
        message: "Failed to parse token response",
      });
    }

    if (!tokenData || !tokenData.access_token) {
      console.log(`❌ Token Response Missing Access Token`);
      throw new HTTPException(400, {
        message: "Instagram did not return an access token",
      });
    }

    // Exchange short-lived token for long-lived token
    console.log(`🔄 Exchanging for Long-lived Token`);
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`
    );

    const longLivedTokenData =
      (await longLivedTokenResponse.json()) as InstagramLongLivedTokenResponse;
    console.log(
      `🔑 Received Long-lived Token, Expires in: ${longLivedTokenData.expires_in} seconds`
    );

    if (!longLivedTokenData.access_token) {
      console.log(`❌ Failed to Obtain Long-lived Token`);
      throw new HTTPException(500, {
        message: "Failed to obtain long-lived token",
      });
    }

    // Calculate token expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + longLivedTokenData.expires_in
    );
    console.log(`⏰ Token Expires At: ${expiresAt.toISOString()}`);

    // Store token in database using Drizzle ORM
    console.log(`💾 Storing Token in Database`);

    // Check if connection already exists
    const existingConnection =
      await c.req.db.query.instagramConnections.findFirst({
        where: eq(instagramConnections.workspaceId, workspace.id),
      });

    if (existingConnection) {
      // Update existing connection
      console.log(
        `🔄 Updating existing Instagram connection for user: ${workspace.userId}`
      );
      await c.req.db
        .update(instagramConnections)
        .set({
          instagramUserId: tokenData.user_id.toString(),
          accessToken: longLivedTokenData.access_token,
          tokenExpiresAt: expiresAt.toISOString(),
        })
        .where(eq(instagramConnections.workspaceId, workspace.id));
    } else {
      // Insert new connection
      console.log(
        `➕ Creating new Instagram connection for workspace: ${workspace.id}`
      );
      await c.req.db.insert(instagramConnections).values({
        workspaceId: workspace.id,
        instagramUserId: tokenData.user_id.toString(),
        accessToken: longLivedTokenData.access_token,
        tokenExpiresAt: expiresAt.toISOString(),
      });
    }

    console.log(`✅ Token Stored Successfully`);

    // Initiate background process to fetch workspace data
    console.log(`🔄 Initiating Background Data Fetch`);
    await fetchInitialInstagramData(
      c,
      workspace.id,
      longLivedTokenData.access_token
    );

    console.log(`✅ OAuth Process Completed Successfully`);

    // Redirect back to frontend with success parameter
    return c.redirect(
      `${FRONTEND_URL}/dashboard/${workspaceSlug}/instagram?status=connected`
    );
  } catch (error) {
    console.error(`💥 Instagram OAuth Error:`, error);

    // Extract relevant parameters for error reporting
    const { searchParams } = new URL(c.req.url);
    const state = searchParams.get("state");
    const workspaceSlug = state?.split(":")[0] || null;

    // Create error data object
    const additionalData = {
      error: {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: {
        timestamp: new Date().toISOString(),
        workspaceSlug,
      },
    };

    const encodedData = encodeURIComponent(JSON.stringify(additionalData));
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return c.redirect(
      `${FRONTEND_URL}/admin/error?message=${encodeURIComponent(errorMessage)}&source=Instagram%20OAuth&code=401&data=${encodedData}`
    );
  }
});

// Fetch initial workspace data function
async function fetchInitialInstagramData(
  c: { env: Env; req: { db: any } },
  workspaceId: string,
  accessToken: string
) {
  console.log(
    `🔄 Starting Initial Instagram Data Fetch for Workspace: ${workspaceId}`
  );
  try {
    // Fetch basic profile information
    console.log(`📡 Fetching Instagram Profile`);
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`
    );
    const profile = (await response.json()) as InstagramProfileResponse;
    console.log(`👤 Fetched Profile: ${profile.username}`);

    // Store profile data using Drizzle ORM
    console.log(`💾 Storing Profile Data`);

    // Get insights to calculate engagement metrics
    const insights = await fetchInstagramInsights(accessToken, profile.id);

    // Calculate average engagement metrics from recent content
    const recentContent = insights.content || [];
    const avgLikes =
      recentContent.length > 0
        ? Math.floor(
            recentContent.reduce(
              (sum: number, post: any) => sum + (post.like_count || 0),
              0
            ) / recentContent.length
          )
        : 0;
    const avgComments =
      recentContent.length > 0
        ? Math.floor(
            recentContent.reduce(
              (sum: number, post: any) => sum + (post.comments_count || 0),
              0
            ) / recentContent.length
          )
        : 0;

    // Calculate engagement rate
    const followerCount = insights.basicInfo.followers_count || 0;
    const engagementRate = calculateEngagementRate(
      followerCount,
      insights.interactionMetrics
    );

    // Extract audience demographics
    const audienceDemographics = {
      gender:
        insights.followerDemographics?.find(
          (d: any) => d.name === "audience_gender_age"
        )?.values || [],
      geography:
        insights.followerDemographics?.find(
          (d: any) => d.name === "audience_country"
        )?.values || [],
      age:
        insights.followerDemographics?.find(
          (d: any) => d.name === "audience_age"
        )?.values || [],
    };

    // Update the connection with all the new metrics
    await c.req.db
      .update(instagramConnections)
      .set({
        username: profile.username,
        name: insights.basicInfo.name,
        accountType: insights.basicInfo.account_type,
        profilePictureUrl: insights.basicInfo.profile_picture_url,
        followerCount: insights.basicInfo.followers_count,
        followingCount: insights.basicInfo.follows_count,
        mediaCount: insights.basicInfo.media_count,
        avgLikes,
        avgComments,
        engagementRate: parseFloat(engagementRate as string),
        audienceDemographics: audienceDemographics,
        lastSyncedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(instagramConnections.workspaceId, workspaceId));

    // Also store a historical record of these metrics
    await c.req.db.insert(instagramMetricsHistory).values({
      connectionId: (
        await c.req.db
          .select({ id: instagramConnections.id })
          .from(instagramConnections)
          .where(eq(instagramConnections.workspaceId, workspaceId))
          .then((res: any) => res[0])
      ).id,
      followerCount: insights.basicInfo.followers_count,
      followingCount: insights.basicInfo.follows_count,
      mediaCount: insights.basicInfo.media_count,
      avgLikes,
      avgComments,
      engagementRate: parseFloat(engagementRate as string),
      // We'll update these from link analytics in a separate process
      linkpClicks: 0,
      linkpConversions: 0,
      linkpCtr: 0,
      recordedAt: new Date().toISOString(),
    });

    console.log(`✅ Profile Data Stored`);

    // Queue detailed data fetch for async processing
    console.log(`⏳ Queueing Detailed Data Fetch`);
    await c.env.linkp_instagram_queue_fetching.put(
      `instagram_sync:${workspaceId}`,
      "pending",
      {
        expirationTtl: 3600,
      }
    );
    console.log(`✅ Sync Queue Created`);

    console.log(
      `✨ Successfully Completed Initial Instagram Data Fetch for ${profile.username}`
    );
  } catch (error) {
    console.error(`💥 Error Fetching Initial Instagram Data:`, error);
  }
}

// New endpoint to check connection status for a workspace
instagramRoutes.get("/status/:workspaceSlug", async (c) => {
  console.log(`🔍 Instagram Status Check Request Received`);
  const handler = withSession(async (c, session) => {
    try {
      const { workspaceSlug } = c.req.param();
      console.log(`👤 Checking Status for Workspace: ${workspaceSlug}`);

      // Find the creator associated with the user
      const creator = await c.req.db.query.creators.findFirst({
        where: eq(creators.userId, session.user.id),
        columns: {
          id: true,
        },
      });

      if (!creator) {
        console.log(`❌ Creator not found for user ${session.user.id}`);
        throw new HTTPException(404, { message: "Creator profile not found" });
      }

      // Find the workspace
      const workspace = await c.req.db.query.workspaces.findFirst({
        where: and(
          eq(workspaces.slug, workspaceSlug),
          eq(workspaces.creatorId, creator.id)
        ),
      });

      if (!workspace) {
        throw new HTTPException(404, { message: "Workspace not found" });
      }

      // Get connection status from database
      console.log(`📡 Fetching Connection Status from Database`);
      const result = await c.req.db.execute(sql`
      SELECT id, username, instagram_user_id, token_expires_at, last_synced_at, follower_count
      FROM instagram_connections
      WHERE workspace_id = ${workspace.id}
    `);

      const isConnected = result.rows.length > 0;
      console.log(
        `🔌 Connection Status: ${isConnected ? "Connected" : "Not Connected"}`
      );

      return c.json({
        status: 200,
        data: {
          connected: isConnected,
          profile: isConnected ? result.rows[0] : null,
        },
      });
    } catch (error) {
      console.error(`💥 Error Fetching Instagram Status:`, error);
      throw new HTTPException(200, {
        message: "Failed to fetch connection status",
      });
    }
  });
  return handler(c);
});

export default instagramRoutes;
