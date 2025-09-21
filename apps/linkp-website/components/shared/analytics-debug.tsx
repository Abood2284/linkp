"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";

export function AnalyticsDebug() {
  const posthog = usePostHog();
  const [debugInfo, setDebugInfo] = useState({
    posthogReady: false,
    envVars: {
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY ? "Set" : "Missing",
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ? "Set" : "Missing",
    },
    testEventSent: false,
    testEventError: null as string | null,
  });

  useEffect(() => {
    setDebugInfo((prev) => ({ ...prev, posthogReady: !!posthog }));
  }, [posthog]);

  const sendTestEvent = async () => {
    console.log("🔧 Attempting to send test event...");
    console.log("🔧 PostHog instance:", posthog);

    if (!posthog) {
      console.log("❌ PostHog not ready");
      setDebugInfo((prev) => ({
        ...prev,
        testEventError: "PostHog not ready",
      }));
      return;
    }

    try {
      console.log("🔧 Sending test event to PostHog...");
      posthog.capture("test_event", {
        test: true,
        timestamp: new Date().toISOString(),
        message: "Analytics debug test event",
      });

      setDebugInfo((prev) => ({
        ...prev,
        testEventSent: true,
        testEventError: null,
      }));

      console.log("✅ Test event sent successfully");
    } catch (error) {
      console.error("❌ Failed to send test event:", error);
      setDebugInfo((prev) => ({
        ...prev,
        testEventError:
          error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  const sendWorkspacePageView = async () => {
    if (!posthog) {
      setDebugInfo((prev) => ({
        ...prev,
        testEventError: "PostHog not ready",
      }));
      return;
    }

    try {
      posthog.capture("workspace_page_view", {
        workspace_id: "test-workspace-id",
        workspace_slug: "test-workspace",
        template_id: "test-template",
        timestamp: new Date().toISOString(),
      });

      console.log("✅ Workspace page view event sent successfully");
    } catch (error) {
      console.error("❌ Failed to send workspace page view:", error);
    }
  };

  const sendLinkClick = async () => {
    if (!posthog) {
      setDebugInfo((prev) => ({
        ...prev,
        testEventError: "PostHog not ready",
      }));
      return;
    }

    try {
      posthog.capture("workspace_link_click", {
        workspace_id: "test-workspace-id",
        link_id: "test-link-id",
        link_url: "https://example.com",
        link_text: "Test Link",
        timestamp: new Date().toISOString(),
      });

      console.log("✅ Link click event sent successfully");
    } catch (error) {
      console.error("❌ Failed to send link click:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Analytics Debug</h3>

      <div className="space-y-2 text-xs">
        <div>
          <strong>PostHog Ready:</strong> {debugInfo.posthogReady ? "✅" : "❌"}
        </div>

        <div>
          <strong>Environment Variables:</strong>
          <div className="ml-2">
            <div>Key: {debugInfo.envVars.key}</div>
            <div>Host: {debugInfo.envVars.host}</div>
          </div>
        </div>

        <div>
          <strong>Test Event:</strong>{" "}
          {debugInfo.testEventSent ? "✅ Sent" : "❌ Not sent"}
        </div>

        {debugInfo.testEventError && (
          <div className="text-red-500">
            <strong>Error:</strong> {debugInfo.testEventError}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <button
          onClick={sendTestEvent}
          className="w-full bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
        >
          Send Test Event
        </button>

        <button
          onClick={sendWorkspacePageView}
          className="w-full bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
        >
          Send Page View
        </button>

        <button
          onClick={sendLinkClick}
          className="w-full bg-purple-500 text-white text-xs px-2 py-1 rounded hover:bg-purple-600"
        >
          Send Link Click
        </button>
      </div>
    </div>
  );
}
