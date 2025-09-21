export interface AnalyticsFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  metrics: string[];
  dimensions: string[];
  groupBy?: string;
}

export interface AnalyticsData {
  metrics: Record<string, number>;
  timeSeries: TimeSeriesPoint[];
  topItems: TopItem[];
}

export interface TimeSeriesPoint {
  date: Date;
  values: Record<string, number>;
}

export interface TopItem {
  id: string;
  name: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsState {
  filters: AnalyticsFilters;
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

// Legacy compatibility types for current PostHog integration
export interface WorkspaceAnalyticsData {
  views: {
    viewsByDay: { date: string; totalViews: number; uniqueVisitors: number }[];
    totalViews: number;
    totalUniqueVisitors: number;
    device: BreakdownItem[];
    geography: BreakdownItem[];
    entry: BreakdownItem[];
    exit: BreakdownItem[];
  };
  linkClicks: {
    items: LinkClickBreakdownItem[];
    total: number;
  };
}

interface BreakdownItem {
  breakdown_value: string;
  count: number;
}

interface LinkClickBreakdownItem {
  link_id: string;
  count: number;
}
