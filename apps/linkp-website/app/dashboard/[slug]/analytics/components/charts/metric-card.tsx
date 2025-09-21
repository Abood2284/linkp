import { useAnalyticsData } from "../../contexts/analytics-data-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  metricId: string;
  label: string;
  format?: (value: number) => string;
  className?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({
  metricId,
  label,
  format,
  className,
  icon,
  trend,
}: MetricCardProps) {
  const { data, loading, error } = useAnalyticsData();

  const value = data?.metrics?.[metricId];
  const formattedValue = value !== undefined && format ? format(value) : value;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            {icon && <Skeleton className="h-8 w-8" />}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-2xl font-semibold text-red-500">Error</p>
            </div>
            {icon && <div className="text-red-500">{icon}</div>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-semibold">{formattedValue ?? "N/A"}</p>
            {trend && (
              <div className="flex items-center mt-1">
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  vs last period
                </span>
              </div>
            )}
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
