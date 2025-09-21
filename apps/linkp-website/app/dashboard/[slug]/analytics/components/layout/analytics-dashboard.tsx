import { ReactNode } from "react";
import { AnalyticsFiltersProvider } from "../../contexts/analytics-filters-context";
import { AnalyticsDataProvider } from "../../contexts/analytics-data-context";
import { AnalyticsUIProvider } from "../../contexts/analytics-ui-context";
import { AnalyticsService } from "../../services/analytics-service";

interface AnalyticsDashboardProps {
  children: ReactNode;
  service: AnalyticsService;
  workspaceId: string;
}

export function AnalyticsDashboard({
  children,
  service,
  workspaceId,
}: AnalyticsDashboardProps) {
  return (
    <AnalyticsFiltersProvider>
      <AnalyticsDataProvider service={service} workspaceId={workspaceId}>
        <AnalyticsUIProvider>
          <div className="p-6 space-y-6">{children}</div>
        </AnalyticsUIProvider>
      </AnalyticsDataProvider>
    </AnalyticsFiltersProvider>
  );
}
