// apps/linkp-website/app/dashboard/[slug]/analytics/utils/analytics-helpers.ts
import { AnalyticsFilters, TimeSeriesPoint } from "../types/analytics";

export function formatMetricValue(value: number, metric: string): string {
  if (metric.includes("percentage") || metric.includes("rate")) {
    return `${(value * 100).toFixed(1)}%`;
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toLocaleString();
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getDateRangeLabel(filters: AnalyticsFilters): string {
  const { from, to } = filters.dateRange;
  const daysDiff = Math.ceil(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 1) return "Last 24 hours";
  if (daysDiff === 7) return "Last 7 days";
  if (daysDiff === 30) return "Last 30 days";
  if (daysDiff === 90) return "Last 3 months";

  return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
}

export function aggregateTimeSeries(
  data: TimeSeriesPoint[],
  aggregation: "sum" | "avg" | "max" | "min"
): Record<string, number> {
  if (!data.length) return {};

  const metrics = Object.keys(data[0].values);
  const result: Record<string, number> = {};

  for (const metric of metrics) {
    const values = data
      .map((point) => point.values[metric])
      .filter((v) => v !== undefined);

    switch (aggregation) {
      case "sum":
        result[metric] = values.reduce((sum, val) => sum + val, 0);
        break;
      case "avg":
        result[metric] =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case "max":
        result[metric] = Math.max(...values);
        break;
      case "min":
        result[metric] = Math.min(...values);
        break;
    }
  }

  return result;
}
