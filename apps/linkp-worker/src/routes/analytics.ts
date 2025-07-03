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

// IMPORTANT: Use Environment Variables for sensitive keys!
// Make sure these are set in your Cloudflare Worker environment.
// const POSTHOG_PROJECT_ID = c.env.POSTHOG_PROJECT_ID;
// const POSTHOG_API_KEY = c.env.POSTHOG_API_KEY;
// For now, using hardcoded values for demonstration, but change this!
// Use environment variables for PostHog credentials
const getPosthogCreds = (env: any) => ({
  // POSTHOG_PROJECT_ID: env.POSTHOG_PROJECT_ID,
  // POSTHOG_API_KEY: env.POSTHOG_API_KEY,
  POSTHOG_PROJECT_ID: "125418",
  POSTHOG_API_KEY: "phx_3h5U4v4Me1bBAr4X4eA5HcJQofS0zkJlZ3xl0gX467KZSZi",
});

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
  const apiUrl = `https://us.i.posthog.com/api/projects/${projectId}/query/`;
  console.log(`[queryPostHog] Sending query to PostHog: ${apiUrl}`);
  console.log(`[queryPostHog] Query Payload:`, JSON.stringify(query, null, 2)); // Log the query being sent

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
    });
    console.log(`[queryPostHog] PostHog Response Status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[queryPostHog] PostHog API Error (${response.status}): ${errorBody}`
      );
      throw new HTTPException(response.status as any, {
        message: `PostHog API Error: ${response.statusText} - ${errorBody}`,
      });
    }

    const responseData = await response.json();
    // console.log("[queryPostHog] Successfully received data from PostHog. ");
    // console.log(
    //   `[queryPostHog] Parsed PostHog Response:`,
    //   JSON.stringify(responseData, null, 2)
    // ); // Keep this commented unless needed for deep debugging
    return responseData as PostHogQueryResponse;
  } catch (error) {
    console.error("[queryPostHog] Error fetching data from PostHog:", error);
    if (error instanceof HTTPException) {
      throw error; // Re-throw HTTPException
    }
    throw new HTTPException(500, {
      message: "Failed to fetch data from PostHog due to an unexpected error.",
      cause: error,
    });
  }
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
      throw new HTTPException(400, { message: "workspaceId is required" });
    }

    // Verify workspace exists
    const workspace = await c.req.db.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      throw new HTTPException(404, { message: "Workspace not found" });
    }

    // Use environment variables for PostHog credentials
    const { POSTHOG_PROJECT_ID, POSTHOG_API_KEY } = getPosthogCreds(c.env);
    if (!POSTHOG_PROJECT_ID || !POSTHOG_API_KEY) {
      throw new HTTPException(500, { message: "PostHog configuration error" });
    }

    console.log(
      `[Analytics Route] Fetching insights for workspace: ${workspaceId}`
    );

    // 1. Total and unique views
    const viewsQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_page_view",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
        {
          event: "workspace_page_view",
          math: "dau",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      interval,
      dateRange: { date_from: dateFrom || "-30d", date_to: dateTo },
    };

    // 2. Device breakdown
    const deviceQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_page_view",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      interval,
      dateRange: { date_from: dateFrom || "-30d", date_to: dateTo },
      breakdownFilter: {
        breakdown: "$device_type",
        breakdown_type: "event",
        breakdown_limit: 10,
      },
    };

    // 3. Geography breakdown
    const geoQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_page_view",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      interval,
      dateRange: { date_from: dateFrom || "-30d", date_to: dateTo },
      breakdownFilter: {
        breakdown: "$geoip_country_code",
        breakdown_type: "event", // Changed from "person" to "event" to match how data is stored
        breakdown_limit: 20,      // Increased limit to capture more countries
      },
    };

    // 4. Entry/exit paths
    const entryQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_page_view",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      interval,
      dateRange: { date_from: dateFrom || "-30d", date_to: dateTo },
      breakdownFilter: {
        breakdown: "$initial_referring_domain",
        breakdown_type: "person",
        breakdown_limit: 10,
      },
    };
    const exitQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_page_view",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      interval,
      dateRange: { date_from: dateFrom || "-30d", date_to: dateTo },
      breakdownFilter: {
        breakdown: "$exit_pathname",
        breakdown_type: "person",
        breakdown_limit: 10,
      },
    };

    // 5. Link clicks by ID
    const linkClicksQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_link_click",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      dateRange: {
        date_from: dateFrom,
        date_to: dateTo,
      },
      breakdownFilter: {
        breakdown: "link_id",
        breakdown_type: "event",
        breakdown_limit: 50,
      },
    };

    // 6. Total link clicks (without breakdown)
    const linkClickTotalQuery = {
      kind: "TrendsQuery",
      series: [
        {
          event: "workspace_link_click",
          math: "total",
          properties: [
            {
              key: "workspace_id",
              value: workspaceId,
              operator: "exact",
              type: "event",
            },
          ],
        },
      ],
      dateRange: {
        date_from: dateFrom,
        date_to: dateTo,
      },
    };

    // Fetch all queries in parallel
    console.log("[Analytics Route] Executing PostHog queries...");
    const [views, device, geography, entry, exit, linkClicks, linkClicksTotal] =
      await Promise.all([
        queryPostHog(POSTHOG_PROJECT_ID, viewsQuery, POSTHOG_API_KEY),
        queryPostHog(POSTHOG_PROJECT_ID, deviceQuery, POSTHOG_API_KEY),
        queryPostHog(POSTHOG_PROJECT_ID, geoQuery, POSTHOG_API_KEY),
        queryPostHog(POSTHOG_PROJECT_ID, entryQuery, POSTHOG_API_KEY),
        queryPostHog(POSTHOG_PROJECT_ID, exitQuery, POSTHOG_API_KEY),
        queryPostHog(POSTHOG_PROJECT_ID, linkClicksQuery, POSTHOG_API_KEY),
        queryPostHog(POSTHOG_PROJECT_ID, linkClickTotalQuery, POSTHOG_API_KEY), // New query
      ]);

    console.log("[Analytics Route] PostHog queries executed successfully.");
    console.log("[Analytics Route] Views Data: ", views);
    console.log("[Analytics Route] Device Data: ", device);
    console.log("[Analytics Route] Geography Data: ", geography);
    
    // Add detailed logging for geography data to debug the empty array
    console.log("[Analytics Route] Geography Results Format:", {
      hasResults: !!geography.results,
      resultsLength: geography.results?.length || 0,
      resultsType: typeof geography.results,
      fullResults: JSON.stringify(geography.results || [], null, 2)
    });
    
    // console.log("[Analytics Route] Entry Data: ", entry);
    // console.log("[Analytics Route] Exit Data: ", exit);
    console.log("[Analytics Route] Link Clicks Data: ", linkClicks);

    // Process Views (Time Series)
    const totalViewsSeries = views.results?.[0];
    const uniqueVisitorsSeries = views.results?.[1];
    const viewsByDay = (totalViewsSeries?.data || []).map(
      (count: number, index: number) => ({
        date: totalViewsSeries?.days?.[index] || "", // Use 'days' for ISO date
        totalViews: count,
        uniqueVisitors: uniqueVisitorsSeries?.data?.[index] || 0,
      })
    );

    const totalViews = totalViewsSeries?.count ?? 0;
    const totalUniqueVisitors = uniqueVisitorsSeries?.count ?? 0;

    // Process Device Breakdown (Table - Check 'results' structure)
    console.log("[Analytics Route] Raw device data:", device.results || []);
    
    const deviceBreakdown = (device.results || [])
      .filter(
        (item) => {
          // Filter out PostHog internal values and null values
          const validValue = item.breakdown_value && 
            !item.breakdown_value.toString().startsWith("$$_posthog");
          return validValue;
        }
      )
      .map((item: any) => {
        // Process and normalize device/OS data
        const deviceValue = item.breakdown_value?.toString() || "";
        // Log the original value from PostHog
        console.log(`[Analytics Route] Processing device: ${deviceValue} - ${item.count}`);
        
        return {
          os: deviceValue,
          breakdown_value: deviceValue, // Keep the original for debugging
          count: item.count || 0,
        };
      });
    
    console.log("[Analytics Route] Processed device data:", deviceBreakdown);

    // Process Geography Breakdown (Table - Check 'results' structure)
    console.log("[Analytics Route] Processing raw geography data:", geography.results || []);
    
    // Handle potential missing country codes by providing a fallback
    const geoBreakdown = (geography.results || [])
      .filter(
        (item) => 
          // Filter out PostHog internal values and null values
          item.breakdown_value && 
          !item.breakdown_value.toString().startsWith("$$_posthog")
      )
      .map((item: any) => {
        // Preserve the exact breakdown_value as the country code
        const countryCode = (item.breakdown_value || "unknown").toString();
        console.log(`[Analytics Route] Geography item: ${countryCode} - ${item.count}`);
        
        return {
          // Use the proper breakdown_value as the country code
          country: countryCode,
          // Add breakdown_value explicitly as a property in case it's needed
          breakdown_value: countryCode,
          count: item.count || 0,
        };
      });
      
    console.log("[Analytics Route] Processed geography data:", geoBreakdown);

    // Process Entry Breakdown (Table - Check 'results' structure)
    const entryBreakdown = (entry.results || [])
      .filter(
        (item) => !item.breakdown_value?.toString().startsWith("$$_posthog")
      )
      .map((item: any) => ({
        // Rename path -> domain for clarity if preferred
        path: item.breakdown_value as string,
        count: item.count,
      }));

    // Process Exit Breakdown (Table - Check 'results' structure)
    const exitBreakdown = (exit.results || [])
      .filter(
        (item) => !item.breakdown_value?.toString().startsWith("$$_posthog")
      )
      .map((item: any) => ({
        path: item.breakdown_value as string,
        count: item.count,
      }));

    // Add right before your filter
    console.log(
      "[Analytics Route] Raw link clicks data:",
      linkClicks.results?.map((item) => ({
        value: item.breakdown_value,
        count: item.count,
        isNull: item.breakdown_value === null,
        isUndefined: item.breakdown_value === undefined,
        isPosthogPrefix: item.breakdown_value
          ?.toString()
          .startsWith("$$_posthog"),
      }))
    );
    // Process Link Click Breakdown (Table - Check 'results' structure)
    // Filter out unknown/null breakdown events
    const linkClickBreakdown = (linkClicks.results || [])
      .filter((item: any) => item.breakdown_value !== "$$_posthog_breakdown_null_$$")
      .map((item: any) => ({
        link_id: item.breakdown_value as string,
        count: item.count || 0,
      }));
    
    // Calculate the raw total from the unfiltered query
    const rawTotalLinkClicks = linkClicksTotal.results?.[0]?.count || 0;
    
    // Add debug information
    console.log("[Analytics Route] PostHog reported total link clicks:", rawTotalLinkClicks);

    // Add debug information
    console.log(
      "[Analytics Route] Total link clicks before filtering:",
      linkClicks.results?.length || 0
    );
    console.log(
      "[Analytics Route] Total link clicks after filtering:",
      linkClickBreakdown.length
    );

    // Structure the final response
    // Calculate the filtered total count - sum of all counts in linkClickBreakdown
    const filteredTotalLinkClicks = linkClickBreakdown.reduce((total, item) => total + item.count, 0);
    
    // Log the difference between raw and filtered totals
    console.log("[Analytics Route] Raw total link clicks (including unknown):", rawTotalLinkClicks);
    console.log("[Analytics Route] Filtered total link clicks (excluding unknown):", filteredTotalLinkClicks);
    
    const processedData = {
      views: {
        viewsByDay,
        totalViews,
        totalUniqueVisitors,
        device: deviceBreakdown, // Changed from deviceBreakdown to device to match frontend
        geography: geoBreakdown, // Changed to maintain consistency
        entry: entryBreakdown,   // Changed to maintain consistency
        exit: exitBreakdown,     // Changed to maintain consistency
      },
      linkClicks: {
        items: linkClickBreakdown,
        total: filteredTotalLinkClicks, // Using filtered total that matches our items
      },
    };
    console.log("[Analytics Route] Processed Data: ", processedData);
    return c.json({
      status: 200,
      data: processedData,
    });
  } catch (error) {
    console.error(`[Analytics Route] Error fetching insights:`, error);
    if (error instanceof HTTPException) {
      // If it's an HTTPException (like from queryPostHog), re-throw it
      throw error;
    }
    // For other unexpected errors
    throw new HTTPException(500, {
      message: "Failed to fetch insights due to an unexpected error.",
      cause: error,
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
        throw new HTTPException(400, { message: "workspaceId is required" });
      }

      // Verify workspace exists (re-use existing workspace validation logic)
      const workspace = await c.req.db.query.workspaces.findFirst({
        where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
      });

      if (!workspace) {
        throw new HTTPException(404, { message: "Workspace not found" });
      }

      const eventName = "workspace_link_click"; // Target the link click event

      // Construct PostHog TrendsQuery for link clicks
      const linkClicksQuery = {
        kind: "TrendsQuery",
        series: [
          {
            event: eventName,
            math: "total",
            properties: [
              {
                key: "workspace_id",
                value: workspaceId,
                operator: "exact",
                type: "event",
              },
            ],
          },
        ],
        interval, // Group by day/week/month
        dateRange: { date_from: dateFrom || "-30d", date_to: dateTo },
        breakdownFilter: {
          breakdown: "link_url",
          breakdown_type: "event",
          breakdown_limit: 20,
        },
      };

      try {
        // Use environment variables for PostHog credentials
        const { POSTHOG_PROJECT_ID, POSTHOG_API_KEY } = getPosthogCreds(c.env);
        if (!POSTHOG_PROJECT_ID || !POSTHOG_API_KEY) {
          throw new HTTPException(500, {
            message: "PostHog configuration error",
          });
        }

        console.log(
          `[API /link-clicks] Querying PostHog for workspace ${workspaceId}...`
        );
        const insights = await queryPostHog(
          POSTHOG_PROJECT_ID,
          linkClicksQuery,
          POSTHOG_API_KEY
        );
        console.log(
          `[API /link-clicks] Successfully received insights for workspace ${workspaceId}.`
        );
        return c.json(insights); // Send raw PostHog response
      } catch (error: any) {
        console.error(
          `[API /link-clicks] Error fetching link click insights for workspace ${workspaceId}:`,
          error
        );
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, {
          message: `Failed to fetch link click insights: ${error.message || "Unknown PostHog API error"}`,
        });
      }
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
