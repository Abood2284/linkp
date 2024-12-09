/*
! This file is not used in the project
Current Flow:

User visits a workspace (e.g., linkp.co/abood)
WorkspacePage loads and wraps content in AnalyticsWrapper
AnalyticsWrapper uses useEffect to call recordPageView
Analytics service records the visit

Optimization Opportunities:

Missing Important Analytics Data
The current implementation only tracks basic page views. With our new schema, we can track much more valuable information.
Client-Side Only
Currently, we're only tracking after the JavaScript loads, potentially missing some visits.


! Try postHog analytics
*/

// // components/analytics/analytics-wrapper.tsx
// "use client";

// import { usePathname } from "next/navigation";
// import { useEffect } from "react";
// import { analytics } from "@/lib/analytics/analytics-service";

// interface AnalyticsWrapperProps {
//   workspaceId: string;
//   userAgent: string | null;
//   referer: string | null;
//   children: React.ReactNode;
// }

// export function AnalyticsWrapper({
//   workspaceId,
//   userAgent,
//   referer,
//   children,
// }: AnalyticsWrapperProps) {
//   const pathname = usePathname();

//   useEffect(() => {
//     analytics.recordPageView({
//       workspaceId,
//       userAgent,
//       referer,
//       pathname,
//     });
//   }, [workspaceId, pathname, userAgent, referer]);

//   return <>{children}</>;
// }
