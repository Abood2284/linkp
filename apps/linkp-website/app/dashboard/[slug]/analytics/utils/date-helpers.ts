// apps/linkp-website/app/dashboard/[slug]/analytics/utils/date-helpers.ts
import { DatePreset } from "../types/filters";

export function getDatePresets(): DatePreset[] {
  const now = new Date();

  return [
    {
      id: "24h",
      label: "Last 24 hours",
      range: {
        from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "7d",
      label: "Last 7 days",
      range: {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "30d",
      label: "Last 30 days",
      range: {
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "90d",
      label: "Last 3 months",
      range: {
        from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "ytd",
      label: "Year to date",
      range: {
        from: new Date(now.getFullYear(), 0, 1),
        to: now,
      },
    },
  ];
}

export function formatDateRange(from: Date, to: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const fromStr = from.toLocaleDateString("en-US", formatOptions);
  const toStr = to.toLocaleDateString("en-US", formatOptions);

  return `${fromStr} - ${toStr}`;
}

export function getDaysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}
