import { useMemo } from "react";
import { useAnalyticsData as useData } from "../contexts/analytics-data-context";
import { useAnalyticsUI } from "../contexts/analytics-ui-context";

export function useAnalyticsData() {
  const { data, loading, error, refresh } = useData();
  const { selectedMetrics } = useAnalyticsUI();

  const filteredTimeSeries = useMemo(() => {
    if (!data?.timeSeries) return [];

    return data.timeSeries.map((point) => ({
      date: point.date,
      values: Object.fromEntries(
        selectedMetrics.map((metric) => [metric, point.values[metric] || 0])
      ),
    }));
  }, [data?.timeSeries, selectedMetrics]);

  const totalMetrics = useMemo(() => {
    if (!data?.metrics) return {};

    return Object.fromEntries(
      selectedMetrics.map((metric) => [metric, data.metrics[metric] || 0])
    );
  }, [data?.metrics, selectedMetrics]);

  return {
    data,
    loading,
    error,
    refresh,
    filteredTimeSeries,
    totalMetrics,
  };
}
