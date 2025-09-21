import { createContext, useContext, ReactNode, useState } from "react";

interface UIContextValue {
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
  chartType: "line" | "bar" | "area";
  setChartType: (type: "line" | "bar" | "area") => void;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function AnalyticsUIProvider({ children }: { children: ReactNode }) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["clicks"]);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const [showLegend, setShowLegend] = useState(true);

  return (
    <UIContext.Provider
      value={{
        selectedMetrics,
        setSelectedMetrics,
        chartType,
        setChartType,
        showLegend,
        setShowLegend,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useAnalyticsUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useAnalyticsUI must be used within AnalyticsUIProvider");
  }
  return context;
}
