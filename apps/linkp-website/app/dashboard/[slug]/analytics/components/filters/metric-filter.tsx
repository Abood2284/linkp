import { useAnalyticsFilters } from "../../contexts/analytics-filters-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricFilterProps {
  availableMetrics: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function MetricFilter({
  availableMetrics,
  className,
}: MetricFilterProps) {
  const { filters, updateFilters } = useAnalyticsFilters();

  const handleMetricToggle = (metricId: string) => {
    const newMetrics = filters.metrics.includes(metricId)
      ? filters.metrics.filter((id) => id !== metricId)
      : [...filters.metrics, metricId];

    updateFilters({ metrics: newMetrics });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableMetrics.map((metric) => (
            <div key={metric.id} className="flex items-start space-x-2">
              <Checkbox
                id={metric.id}
                checked={filters.metrics.includes(metric.id)}
                onCheckedChange={() => handleMetricToggle(metric.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor={metric.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {metric.label}
                </label>
                {metric.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
