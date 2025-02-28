// apps/linkp-website/components/templates/shared/TrackedLink.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePostHog } from "posthog-js/react";

interface TrackedLinkProps {
  href: string;
  linkId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TrackedLink({
  href,
  linkId,
  children,
  className,
  style,
}: TrackedLinkProps) {
  const [isClicking, setIsClicking] = useState(false);
  const posthog = usePostHog();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isClicking) return;

    setIsClicking(true);
    try {
      // Track click with PostHog
      posthog?.capture("workspace_link_click", {
        link_id: linkId,
        link_url: href,
        link_text: typeof children === "string" ? children : undefined,
        timestamp: new Date().toISOString(),
      });

      // Navigate to URL
      window.open(href, "_blank", "noopener,noreferrer");
    } finally {
      setIsClicking(false);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      target="_blank"
      rel="noopener noreferrer"
      data-link-id={linkId}
    >
      {children}
    </Link>
  );
}
