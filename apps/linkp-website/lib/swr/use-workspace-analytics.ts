// apps/linkp-website/lib/swr/use-workspace-analytics.ts
import useSWR from "swr";
import { fetcher } from "../functions/fetcher";

export interface WorkspaceAnalytics {
  results: any[];
  next?: string;
  query_status?: {
    id: string;
    status: string;
  };
}

interface UseWorkspaceAnalyticsParams {
  workspaceId: string;
  dateFrom?: string;
  dateTo?: string;
  interval?: "day" | "week" | "month";
  metricType?: "page_views" | "link_clicks";
}

/**
 * SWR hook for fetching workspace analytics data
 *
 * @param params - Parameters for analytics query
 * @returns SWR response with workspace analytics data
 *
 * @example
 * ```tsx
 * const { analytics, isLoading, error } = useWorkspaceAnalytics({
 *   workspaceId: "123",
 *   interval: "day",
 *   dateFrom: "2024-02-01",
 *   dateTo: "2024-02-16"
 * });
 * ```
 */
export function useWorkspaceAnalytics(params: UseWorkspaceAnalyticsParams) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {
    workspaceId,
    dateFrom,
    dateTo,
    interval = "day",
    metricType = "page_views",
  } = params;

  // Construct the query string
  const queryParams = new URLSearchParams();
  if (dateFrom) queryParams.set("dateFrom", dateFrom);
  if (dateTo) queryParams.set("dateTo", dateTo);
  if (interval) queryParams.set("interval", interval);

  // Determine the API endpoint based on metricType
  const endpoint =
    metricType === "link_clicks" ? "link-clicks-insights" : "insights";

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/analytics/workspace/${workspaceId}/${endpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  const { data, error, isLoading, mutate } = useSWR<{
    status: number;
    data: WorkspaceAnalytics;
  }>(workspaceId ? url : null, fetcher);

  console.log("🐷 useWorkspaceAnalytics : returning Data:  ", { data });
  return {
    analytics: data?.data,
    isLoading,
    error,
    mutate,
  };
}
