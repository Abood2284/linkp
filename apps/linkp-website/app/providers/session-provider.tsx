"use client";

import { SessionProvider } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  console.log("🔧 Initializing PostHog...");
  console.log(
    "🔧 PostHog Key:",
    process.env.NEXT_PUBLIC_POSTHOG_KEY ? "Set" : "Missing"
  );
  console.log("🔧 PostHog Host:", process.env.NEXT_PUBLIC_POSTHOG_HOST);

  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      loaded: (posthog) => {
        console.log("✅ PostHog loaded successfully");
      },
      autocapture: false, // Disable autocapture to avoid conflicts
    });
    console.log("✅ PostHog initialization completed");
  } catch (error) {
    console.error("❌ PostHog initialization failed:", error);
  }
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export default function SessionProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
