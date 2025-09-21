import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { AnalyticsData, AnalyticsFilters } from "../types/analytics";
import { AnalyticsService } from "../services/analytics-service";
import { useAnalyticsFilters } from "./analytics-filters-context";

interface DataContextValue {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function AnalyticsDataProvider({
  children,
  service,
  workspaceId,
}: {
  children: ReactNode;
  service: AnalyticsService;
  workspaceId: string;
}) {
  const { filters } = useAnalyticsFilters();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    console.log("🔧 AnalyticsDataProvider: Starting fetchData", {
      workspaceId,
      dateFrom: filters.dateRange.from.toISOString().split("T")[0],
      dateTo: filters.dateRange.to.toISOString().split("T")[0],
    });

    try {
      // For now, use the legacy method until new endpoints are implemented
      // TODO: Replace with new endpoints when they're available
      const workspaceData = await service.getWorkspaceAnalytics(
        workspaceId,
        filters.dateRange.from.toISOString().split("T")[0],
        filters.dateRange.to.toISOString().split("T")[0],
        "day"
      );

      // Transform the legacy data to match our new structure
      const transformedData = {
        metrics: {
          views: workspaceData.views?.totalViews || 0,
          clicks: workspaceData.linkClicks?.total || 0,
          uniqueVisitors: workspaceData.views?.totalUniqueVisitors || 0,
        },
        timeSeries:
          workspaceData.views?.viewsByDay?.map((item) => ({
            date: new Date(item.date),
            values: {
              views: item.totalViews,
              clicks: 0, // This would need to be calculated from linkClicks data
            },
          })) || [],
        topItems:
          workspaceData.linkClicks?.items?.map((item) => ({
            id: item.link_id,
            name: item.link_id,
            value: item.count,
          })) || [],
      };

      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const refresh = () => {
    fetchData();
  };

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAnalyticsData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(
      "useAnalyticsData must be used within AnalyticsDataProvider"
    );
  }
  return context;
}
