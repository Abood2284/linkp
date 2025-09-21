import {
  AnalyticsFilters,
  AnalyticsData,
  TimeSeriesPoint,
  TopItem,
  WorkspaceAnalyticsData,
} from "../types/analytics";

export class AnalyticsService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async getMetrics(
    filters: AnalyticsFilters
  ): Promise<AnalyticsData["metrics"]> {
    const cacheKey = this.getCacheKey("metrics", filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/analytics/metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as Record<string, number>;
  }

  async getTimeSeries(filters: AnalyticsFilters): Promise<TimeSeriesPoint[]> {
    const cacheKey = this.getCacheKey("timeseries", filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/analytics/timeseries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch time series: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as TimeSeriesPoint[];
  }

  async getTopItems(filters: AnalyticsFilters): Promise<TopItem[]> {
    const cacheKey = this.getCacheKey("top-items", filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/analytics/top-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top items: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as TopItem[];
  }

  // Legacy method for current PostHog integration
  async getWorkspaceAnalytics(
    workspaceId: string,
    dateFrom?: string,
    dateTo?: string,
    interval: "day" | "week" | "month" = "day"
  ): Promise<WorkspaceAnalyticsData> {
    const cacheKey = this.getCacheKey("workspace-analytics", {
      workspaceId,
      dateFrom,
      dateTo,
      interval,
    });
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const queryParams = new URLSearchParams();
    if (dateFrom) queryParams.set("dateFrom", dateFrom);
    if (dateTo) queryParams.set("dateTo", dateTo);
    if (interval) queryParams.set("interval", interval);

    const response = await fetch(
      `${this.baseUrl}/api/analytics/workspace/${workspaceId}/insights?${queryParams.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch workspace analytics: ${response.statusText}`
      );
    }

    const result = (await response.json()) as { data: WorkspaceAnalyticsData };
    const data = result.data;
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearCacheForEndpoint(endpoint: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(endpoint)) {
        this.cache.delete(key);
      }
    }
  }
}
