import { createContext, useContext, ReactNode, useState } from "react";
import { AnalyticsFilters } from "../types/analytics";

interface FiltersContextValue {
  filters: AnalyticsFilters;
  updateFilters: (newFilters: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function AnalyticsFiltersProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Default filters for now - we'll integrate URL sync in Step 4
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    },
    metrics: ["clicks", "views"],
    dimensions: [],
  });

  const updateFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
      metrics: ["clicks", "views"],
      dimensions: [],
    });
  };

  return (
    <FiltersContext.Provider
      value={{
        filters,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useAnalyticsFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error(
      "useAnalyticsFilters must be used within AnalyticsFiltersProvider"
    );
  }
  return context;
}
