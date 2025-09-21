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

  console.log(
    `[AnalyticsWrapper] Component rendered/updated. Workspace: ${workspaceSlug} (${workspaceId}), Template: ${templateId}`
  );

  // Track page visit
  useEffect(() => {
    if (posthog) {
      // Enhanced: Add $initial_referring_domain and $exit_pathname for analytics breakdowns
      const eventData = {
        workspace_id: workspaceId,
        workspace_slug: workspaceSlug,
        template_id: templateId,
        $current_url:
          typeof window !== "undefined" ? window.location.href : null, // Add URL tracking
        $initial_referring_domain:
          typeof document !== "undefined" ? document.referrer || null : null,
        $exit_pathname:
          typeof window !== "undefined" ? window.location.pathname : null,
        timestamp: new Date().toISOString(),
      };

      console.log(
        `[AnalyticsWrapper] useEffect triggered. Attempting to capture workspace_page_view for ${workspaceSlug}. Data:`,
        eventData
      );
      posthog.capture("workspace_page_view", eventData);
    } else {
      console.warn(
        `[AnalyticsWrapper] useEffect triggered, but PostHog SDK not ready for ${workspaceSlug}.`
      );
    }
    // Ensure dependencies are correct. If any of these change unnecessarily, the effect will re-run.
  }, [posthog, workspaceId, workspaceSlug, templateId]);

  const handleInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(
      `[AnalyticsWrapper] Interaction detected on workspace ${workspaceSlug}. Target:`,
      e.target
    );

    // Find closest anchor tag
    const link = (e.target as HTMLElement).closest("a");
    if (!link) {
      console.log(
        `[AnalyticsWrapper] Interaction was not on or within an anchor tag.`
      );
      return;
    }

    // Get link details
    const href = link.getAttribute("href");
    const text = link.textContent?.trim();
    const id = link.getAttribute("data-link-id"); // IMPORTANT: Ensure your links in the template HAVE this attribute

    if (!href) {
      console.log(
        `[AnalyticsWrapper] Clicked anchor tag has no href. Text: ${text}`
      );
      return; // Don't track clicks on links without href
    }

    if (!id) {
      console.warn(
        `[AnalyticsWrapper] Clicked link is missing 'data-link-id'. Tracking may be incomplete. Href: ${href}, Text: ${text}`
      );
      // Decide if you still want to track clicks without a specific link ID from your DB
    }

    // Enhanced: Add $initial_referring_domain and $exit_pathname for analytics breakdowns
    const eventData = {
      workspace_id: workspaceId,
      workspace_slug: workspaceSlug,
      link_id: id, // Will be null if attribute is missing
      link_text: text,
      link_url: href,
      $initial_referring_domain:
        typeof document !== "undefined" ? document.referrer || null : null,
      $exit_pathname:
        typeof window !== "undefined" ? window.location.pathname : null,
      timestamp: new Date().toISOString(),
    };

    if (posthog) {
      console.log(
        `[AnalyticsWrapper] Attempting to capture workspace_link_click for ${workspaceSlug}. Data:`,
        eventData
      );
      posthog.capture("workspace_link_click", eventData);
    } else {
      console.warn(
        `[AnalyticsWrapper] Link click detected, but PostHog SDK not ready for ${workspaceSlug}.`
      );
    }
  };

  // Use onClick instead of onMouseDown for better reliability
  return <div onClick={handleInteraction}>{children}</div>;
}
