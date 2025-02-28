import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-semibold mt-2">{value}</div>
        {trend && (
          <div
            className={cn(
              "text-xs mt-2",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {trend.value}
          </div>
        )}
        {description && (
          <div className="text-xs text-muted-foreground mt-2">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
