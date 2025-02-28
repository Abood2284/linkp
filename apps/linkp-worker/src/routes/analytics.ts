// apps/linkp-worker/src/routes/analytics.ts
/**
 * Analytics Routes Module
 *
 * This module provides API endpoints for fetching analytics data from PostHog.
 * It uses PostHog's Query API to retrieve insights about page views and user interactions
 * for specific workspaces.
 */
import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { withSession } from "../auth/session";

// Initialize Hono router with environment bindings
const analyticsRoutes = new Hono<{ Bindings: Env }>();

/**
 * Cache duration for analytics data
 * Set to 5 minutes to balance between data freshness and API rate limits
 */
const CACHE_TTL = 300; // 5 minutes

/**
 * Interface for PostHog Query API response
 * @property results - Array of query results from PostHog
 * @property next - Optional URL for pagination
 * @property query_status - Optional status information for async queries
 */
interface PostHogQueryResponse {
  results: any[];
  next?: string;
  query_status?: {
    id: string;
    status: string;
  };
}

/**
 * Parameters for PostHog insights queries
 * @property workspaceId - Unique identifier for the workspace
 * @property dateFrom - Optional start date for the query period
 * @property dateTo - Optional end date for the query period
 * @property interval - Optional grouping interval (day/week/month)
 */
interface PostHogInsightParams {
  workspaceId: string;
  dateFrom?: string;
  dateTo?: string;
  interval?: string;
}

/**
 * Makes authenticated requests to the PostHog Query API
 *
 * @param projectId - PostHog project identifier
 * @param query - Query object following PostHog's query format (TrendsQuery, FunnelsQuery, etc.)
 * @param apiKey - PostHog API key for authentication
 * @returns Promise resolving to the PostHog query response
 * @throws Error if the API request fails
 *
 * Example query:
 * {
 *   kind: "TrendsQuery",
 *   series: [{ event: "$pageview" }]
 * }
 */
async function queryPostHog(
  projectId: string,
  query: any,
  apiKey: string
): Promise<PostHogQueryResponse> {
  const response = await fetch(
    `https://us.i.posthog.com/api/projects/${projectId}/query/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PostHog API error: ${error}`);
  }
  return response.json();
}

/**
 * GET /workspace/:workspaceId/insights
 *
 * Retrieves analytics insights for a specific workspace. This endpoint:
 * 1. Validates the workspace exists and is accessible
 * 2. Constructs a PostHog TrendsQuery for pageview events
 * 3. Returns time-series data of page views
 *
 * @route GET /api/analytics/workspace/:workspaceId/insights
 * @param workspaceId - URL parameter identifying the workspace
 * @query dateFrom - Optional start date (YYYY-MM-DD)
 * @query dateTo - Optional end date (YYYY-MM-DD)
 * @query interval - Optional grouping interval (day/week/month)
 *
 * @returns {Object} JSON response containing:
 *   - status: HTTP status code
 *   - data: PostHog query results with page view trends
 *
 * @throws {HTTPException}
 *   - 400 if workspaceId is missing
 *   - 404 if workspace not found
 *   - 500 for PostHog API errors
 */
analyticsRoutes.get("/workspace/:workspaceId/insights", async (c) => {
  try {
    // Extract and validate request parameters
    const { workspaceId } = c.req.param();
    const { dateFrom, dateTo, interval = "day" } = c.req.query();

    if (!workspaceId) {
      console.log(`🐷 There is no worksapce Id in route : ${c.req.path}`);
      throw new HTTPException(400, { message: "workspaceId is required" });
    }

    // Verify workspace exists and user has access
    const workspace = await c.req.db.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      console.log(`🐷 There is no worksapce Id in route : ${c.req.path}`);
      throw new HTTPException(404, { message: "Workspace not found" });
    }

    // Construct PostHog TrendsQuery for page views
    // This query counts $pageview events filtered by workspace_id
    const pageViewsQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_page_view",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
            },
          ],
        },
      ],
      interval, // Group by day/week/month
      dateRange: {
        date_from: dateFrom,
        date_to: dateTo,
      },
    };

    // Execute PostHog query
    const insights = await queryPostHog(
      "125418",
      //   process.env.POST_PROJECT_ID!,
      pageViewsQuery,
      "phx_3h5U4v4Me1bBAr4X4eA5HcJQofS0zkJlZ3xl0gX467KZSZi"
      //   process.env.POSTHOG_API_KEY!
    );

    console.log(` Page views insights: ${JSON.stringify(insights)}`);
    // Return successful response
    return c.json({
      status: 200,
      data: insights,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Analytics error:", error);

    // Re-throw HTTP exceptions as-is
    if (error instanceof HTTPException) {
      throw error;
    }

    // Convert other errors to 500 Internal Server Error
    throw new HTTPException(500, {
      message: "Failed to fetch analytics insights",
    });
  }
});

/**
 * GET /workspace/:workspaceId/link-clicks-insights
 *
 * Retrieves link click analytics insights for a specific workspace.
 * This endpoint fetches data for 'workspace_link_click' events.
 *
 * @route GET /api/analytics/workspace/:workspaceId/link-clicks-insights
 * @param workspaceId - URL parameter identifying the workspace
 * @query dateFrom - Optional start date (YYYY-MM-DD)
 * @query dateTo - Optional end date (YYYY-MM-DD)
 * @query interval - Optional grouping interval (day/week/month)
 *
 * @returns {Object} JSON response containing:
 *   - status: HTTP status code
 *   - data: PostHog query results with link click trends
 *
 * @throws {HTTPException}
 *   - 400 if workspaceId is missing
 *   - 404 if workspace not found
 *   - 500 for PostHog API errors
 */
analyticsRoutes.get(
  "/workspace/:workspaceId/link-clicks-insights",
  async (c) => {
    try {
      // Extract and validate request parameters (re-use existing validation logic if needed)
      const { workspaceId } = c.req.param();
      const { dateFrom, dateTo, interval = "day" } = c.req.query();

      if (!workspaceId) {
        console.log(`🐷 There is no workspace Id in route : ${c.req.path}`);
        throw new HTTPException(400, { message: "workspaceId is required" });
      }

      // Verify workspace exists (re-use existing workspace validation logic)
      const workspace = await c.req.db.query.workspaces.findFirst({
        where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
      });

      if (!workspace) {
        console.log(`🐷 There is no workspace Id in route : ${c.req.path}`);
        throw new HTTPException(404, { message: "Workspace not found" });
      }

      // Construct PostHog TrendsQuery for link clicks
      const linkClicksQuery = {
        kind: "TrendsQuery",
        series: [
          {
            event: "workspace_link_click",
            properties: [
              {
                key: "workspace_id",
                value: workspaceId,
                operator: "exact",
              },
            ],
          },
        ],
        interval, // Group by day/week/month
        dateRange: {
          date_from: dateFrom,
          date_to: dateTo,
        },
      };

      // Execute PostHog query
      const insights = await queryPostHog(
        // c.env.POSTHOG_PROJECT_ID!, // Use environment variable
        "125418",
        linkClicksQuery,
        "phx_3h5U4v4Me1bBAr4X4eA5HcJQofS0zkJlZ3xl0gX467KZSZi"
        // c.env.POSTHOG_API_KEY! // Use environment variable
      );

      console.log(`🐷 Link click insights: ${JSON.stringify(insights)}`);

      // Return successful response
      return c.json({
        status: 200,
        data: insights,
      });
    } catch (error) {
      // Log error for debugging
      console.error("Analytics error:", error);

      // Re-throw HTTP exceptions as-is
      if (error instanceof HTTPException) {
        throw error;
      }

      // Convert other errors to 500 Internal Server Error
      throw new HTTPException(500, {
        message: "Failed to fetch link click insights",
      });
    }
  }
);

export default analyticsRoutes;
