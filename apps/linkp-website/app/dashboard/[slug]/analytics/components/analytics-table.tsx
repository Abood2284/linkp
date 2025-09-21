// apps/linkp-website/app/dashboard/[slug]/analytics/components/analytics-table.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AnalyticsTableProps = {
  children: React.ReactNode; // pass your <Table> block here
  maxHeight?: number; // stick header if desired
  className?: string;
};

export function AnalyticsTable({
  children,
  maxHeight = 420,
  className,
}: AnalyticsTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white/95 shadow-sm ring-1 ring-black/[0.03]",
        className
      )}
    >
      <div className="overflow-auto" style={{ maxHeight }}>
        {/* style reset helpers for shadcn Table descendants */}
        <div className="[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-white/95 [&_thead_th]:backdrop-blur [&_thead_th]:text-[11px] [&_thead_th]:uppercase [&_thead_th]:tracking-wide [&_thead_th]:text-black/60 [&_thead_tr]:border-b [&_tbody_tr]:border-b [&_tbody_tr:nth-child(even)]:bg-black/[0.015]">
          {children}
        </div>
      </div>
    </div>
  );
}
