// apps/linkp-website/app/(onboarding)/business/components/stats-card.tsx

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

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
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{value}</span>

            {trend && (
              <div
                className={cn(
                  "flex items-center text-xs rounded-full px-2 py-0.5",
                  trend.isPositive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {trend.value}
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
