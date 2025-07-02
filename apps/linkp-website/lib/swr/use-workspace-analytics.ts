// apps/linkp-website/lib/swr/use-workspace-analytics.ts
import useSWR from "swr";
import { fetcher } from "../functions/fetcher";

// Interface for individual breakdown items
interface BreakdownItem {
  breakdown_value: string;
  count: number;
}

// Interface for link click breakdown items (new)
interface LinkClickBreakdownItem {
  link_id: string; // Changed from linkId to match API response
  count: number;
}

// Define the detailed structure returned by the backend /insights endpoint
export interface WorkspaceAnalyticsData {
  views: {
    viewsByDay: { date: string; totalViews: number; uniqueVisitors: number }[];
    totalViews: number;
    totalUniqueVisitors: number;
    device: BreakdownItem[]; // Assumes backend maps device name to breakdown_value
    geography: BreakdownItem[]; // Assumes backend maps country code to breakdown_value
    entry: BreakdownItem[]; // Assumes backend maps entry path to breakdown_value
    exit: BreakdownItem[]; // Assumes backend maps exit path to breakdown_value
  };
  linkClicks: {
    items: LinkClickBreakdownItem[];
    total: number;
  }; // Updated to match the new API response structure
}

interface UseWorkspaceAnalyticsParams {
  workspaceId: string;
  dateFrom?: string;
  dateTo?: string;
  interval?: "day" | "week" | "month";
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
  const { workspaceId, dateFrom, dateTo, interval = "day" } = params;

  // Construct the query string
  const queryParams = new URLSearchParams();
  if (dateFrom) queryParams.set("dateFrom", dateFrom);
  if (dateTo) queryParams.set("dateTo", dateTo);
  if (interval) queryParams.set("interval", interval);

  const endpoint = `/api/analytics/workspace/${workspaceId}/insights`;
  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
  console.log("🐷 useWorkspaceAnalytics : Workspace ID:  ", workspaceId);
  console.log("🐷 useWorkspaceAnalytics : url:  ", url);
  const { data, error, isLoading, mutate } = useSWR<{
    status: number;
    data: WorkspaceAnalyticsData;
  }>(workspaceId ? url : null, fetcher);

  console.log("🐷 useWorkspaceAnalytics : returning Data:  ", {
    data,
    error,
    isLoading,
    mutate,
  });
  return {
    analytics: data?.data,
    isLoading,
    error,
    mutate,
  };
}
