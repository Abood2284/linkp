import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AnalyticsFilters } from "../types/analytics";

export function useAnalyticsURL() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = useMemo((): AnalyticsFilters => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const metrics = searchParams.get("metrics")?.split(",") || ["clicks"];
    const dimensions = searchParams.get("dimensions")?.split(",") || [];
    const groupBy = searchParams.get("groupBy") || undefined;

    return {
      dateRange: {
        from: from
          ? new Date(from)
          : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: to ? new Date(to) : new Date(),
      },
      metrics,
      dimensions,
      groupBy,
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<AnalyticsFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update date range
      if (newFilters.dateRange) {
        params.set("from", newFilters.dateRange.from.toISOString());
        params.set("to", newFilters.dateRange.to.toISOString());
      }

      // Update metrics
      if (newFilters.metrics) {
        params.set("metrics", newFilters.metrics.join(","));
      }

      // Update dimensions
      if (newFilters.dimensions) {
        params.set("dimensions", newFilters.dimensions.join(","));
      }

      // Update groupBy
      if (newFilters.groupBy) {
        params.set("groupBy", newFilters.groupBy);
      } else if (newFilters.groupBy === undefined) {
        params.delete("groupBy");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push("", { scroll: false });
  }, [router]);

  return {
    currentFilters,
    updateFilters,
    resetFilters,
  };
}
