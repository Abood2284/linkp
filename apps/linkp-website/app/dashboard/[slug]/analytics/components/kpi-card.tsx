// apps/linkp-website/app/dashboard/[slug]/analytics/components/kpi-card.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  help?: string;
  className?: string;
};

export function KpiCard({ label, value, icon, help, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white/95 shadow-sm ring-1 ring-black/[0.03]",
        "transition hover:shadow-md",
        className
      )}
    >
      {/* left accent */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-linkp-green/70" />

      <div className="p-4 pl-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-black/60">{label}</span>
          {icon && <div className="text-black/50">{icon}</div>}
        </div>
        <div className="mt-2 text-2xl font-display font-semibold tracking-[-0.01em]">
          {value}
        </div>
        {help && <p className="mt-1 text-xs text-black/50">{help}</p>}
      </div>
    </div>
  );
}
