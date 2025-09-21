import { useMemo } from "react";
import { useAnalyticsFilters as useFilters } from "../contexts/analytics-filters-context";

export function useAnalyticsFilters() {
  const { filters, updateFilters, resetFilters } = useFilters();

  const hasActiveFilters = useMemo(() => {
    return (
      filters.dimensions.length > 0 ||
      filters.metrics.length > 1 ||
      filters.groupBy !== undefined
    );
  }, [filters]);

  const getFilterSummary = useMemo(() => {
    const parts = [];

    if (filters.metrics.length > 1) {
      parts.push(`${filters.metrics.length} metrics`);
    }

    if (filters.dimensions.length > 0) {
      parts.push(`${filters.dimensions.length} dimensions`);
    }

    if (filters.groupBy) {
      parts.push(`grouped by ${filters.groupBy}`);
    }

    return parts.join(", ");
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    getFilterSummary,
  };
}
