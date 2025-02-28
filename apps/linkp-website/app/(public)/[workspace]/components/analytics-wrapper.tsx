// apps/linkp-website/app/(public)/[workspace]/components/analytics-wrapper.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { usePostHog } from "posthog-js/react";

interface AnalyticsWrapperProps {
  children: ReactNode;
  workspaceId: string;
  workspaceSlug: string;
  templateId: string;
}

export function AnalyticsWrapper({
  children,
  workspaceId,
  workspaceSlug,
  templateId,
}: AnalyticsWrapperProps) {
  const posthog = usePostHog();

  // Track page visit
  useEffect(() => {
    console.log("🥵 Tracking workspace view:", {
      workspaceId,
      url: window.location.href,
    });
    posthog?.capture("workspace_page_view", {
      workspace_id: workspaceId,
      workspace_slug: workspaceSlug,
      template_id: templateId,
      $current_url: window.location.href, // Add URL tracking
      timestamp: new Date().toISOString(),
    });
  }, [posthog, workspaceId, workspaceSlug, templateId]);

  return (
    <div
      onClick={(e) => {
        // Find closest anchor tag
        const link = (e.target as HTMLElement).closest("a");
        if (!link) return;

        // Get link details
        const href = link.getAttribute("href");
        const text = link.textContent;
        const id = link.getAttribute("data-link-id");

        // Track link click
        posthog?.capture("workspace_link_click", {
          workspace_id: workspaceId,
          workspace_slug: workspaceSlug,
          link_id: id,
          link_text: text,
          link_url: href,
          timestamp: new Date().toISOString(),
        });
      }}
    >
      {children}
    </div>
  );
}
