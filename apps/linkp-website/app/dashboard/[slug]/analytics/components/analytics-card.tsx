// apps/linkp-website/app/dashboard/[slug]/analytics/components/analytics-cars.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AnalyticsCardProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  dense?: boolean; // tighter padding
  children?: React.ReactNode;
};

export function AnalyticsCard({
  title,
  subtitle,
  action,
  className,
  contentClassName,
  dense,
  children,
}: AnalyticsCardProps) {
  return (
    <Card
      className={cn(
        "rounded-xl border shadow-sm bg-white/90 backdrop-blur",
        "transition-shadow hover:shadow-md",
        "ring-1 ring-black/[0.03]",
        className
      )}
    >
      {(title || action || subtitle) && (
        <CardHeader className={cn("pb-2", dense && "py-3")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              {title && (
                <CardTitle className="font-display tracking-[-0.01em] text-sm text-black/80">
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <p className="text-xs text-black/55 mt-0.5">{subtitle}</p>
              )}
            </div>
            {action}
          </div>
          {/* decorative brand hairline */}
          <div className="mt-2 h-px w-full bg-gradient-to-r from-linkp-green/35 via-transparent to-transparent" />
        </CardHeader>
      )}
      <CardContent className={cn(dense ? "pt-2" : "pt-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
