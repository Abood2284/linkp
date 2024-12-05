// components/analytics/analytics-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { analytics } from "@/lib/analytics/analytics-service";

interface AnalyticsWrapperProps {
  workspaceId: string;
  userAgent: string | null;
  referer: string | null;
  children: React.ReactNode;
}

export function AnalyticsWrapper({
  workspaceId,
  userAgent,
  referer,
  children,
}: AnalyticsWrapperProps) {
  const pathname = usePathname();

  useEffect(() => {
    analytics.recordPageView({
      workspaceId,
      userAgent,
      referer,
      pathname,
    });
  }, [workspaceId, pathname, userAgent, referer]);

  return <>{children}</>;
}
