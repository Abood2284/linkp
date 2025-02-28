import posthog from "posthog-js";
import { UAParser } from "ua-parser-js";
import { getGeoData } from "@/lib/geo";

interface PageViewData {
  workspaceId: string;
  linkId?: string;
  userAgent?: string | null;
  referrer?: string | null;
  pathname?: string;
}

export class AnalyticsService {
  private async parseUserAgent(userAgent: string | null | undefined) {
    if (!userAgent) return null;
    const parser = new UAParser(userAgent);
    return {
      browser: parser.getBrowser().name,
      device: parser.getDevice().type || "desktop",
      os: parser.getOS().name,
    };
  }

  async recordPageView({
    workspaceId,
    linkId,
    userAgent,
    referrer,
    pathname,
  }: PageViewData) {
    try {
      const deviceInfo = await this.parseUserAgent(userAgent);
      const geoData = await getGeoData();

      posthog.capture("pageview", {
        workspaceId,
        linkId,
        $current_url: pathname,
        $referrer: referrer,
        $browser: deviceInfo?.browser,
        $device_type: deviceInfo?.device,
        $os: deviceInfo?.os,
        $geoip_city_name: geoData?.city,
        $geoip_country_name: geoData?.country,
        $geoip_region_name: geoData?.region,
      });

      console.log(
        `🎥 Recorded page view for workspaceId: ${workspaceId}, linkId: ${linkId}`
      );
    } catch (error) {
      console.error("Failed to record page view:", error);
    }
  }

  async recordLinkClick(
    workspaceId: string,
    linkId: string,
    metadata: Record<string, any> = {}
  ) {
    try {
      posthog.capture("link_click", {
        workspaceId,
        linkId,
        ...metadata,
      });
      console.log(
        `👤 Recorded link click for workspaceId: ${workspaceId}, linkId: ${linkId}`
      );
    } catch (error) {
      console.error("Failed to record link click:", error);
    }
  }

  async identifyUser(userId: string, traits: Record<string, any> = {}) {
    try {
      posthog.identify(userId, traits);
    } catch (error) {
      console.error("Failed to identify user:", error);
    }
  }

  async reset() {
    posthog.reset();
  }

  async recordWorkspaceAction(
    workspaceId: string,
    action: "create" | "update" | "delete" | "share",
    metadata: Record<string, any> = {}
  ) {
    try {
      posthog.capture("workspace_action", {
        workspaceId,
        action,
        ...metadata,
        $set: {
          last_workspace_action: action,
          last_workspace_action_at: new Date().toISOString(),
        },
      });

      console.log(
        `🏢 Recorded workspace ${action} for workspaceId: ${workspaceId}`
      );
    } catch (error) {
      console.error("Failed to record workspace action:", error);
    }
  }

  async recordFeatureUsage(
    feature: string,
    workspaceId: string,
    metadata: Record<string, any> = {}
  ) {
    try {
      posthog.capture("feature_used", {
        feature,
        workspaceId,
        ...metadata,
        $set: {
          [`last_${feature}_usage`]: new Date().toISOString(),
        },
      });

      console.log(
        `⚡ Recorded feature usage: ${feature} for workspaceId: ${workspaceId}`
      );
    } catch (error) {
      console.error("Failed to record feature usage:", error);
    }
  }

  async setUserProperties(userId: string, properties: Record<string, any>) {
    try {
      posthog.people.set(properties);
      console.log(`👤 Updated properties for user: ${userId}`);
    } catch (error) {
      console.error("Failed to set user properties:", error);
    }
  }

  async createGroup(
    groupType: string,
    groupKey: string,
    properties: Record<string, any> = {}
  ) {
    try {
      posthog.group(groupType, groupKey, properties);
      console.log(`👥 Created/updated group ${groupType}:${groupKey}`);
    } catch (error) {
      console.error("Failed to create/update group:", error);
    }
  }
}

//           pathname,
//           referrer,
//           country: geoData?.country,
//           city: geoData?.city,
//           ...deviceInfo,
//         },
//       });

//       // 2. Update realtime metrics
//       await db
//         .insert(realtimeMetrics)
//         .values({
//           workspaceId,
//           linkId,
//           activeVisitors: 1,
//           recentClicks: 1,
//           lastUpdated: new Date(),
//         })
//         .onConflictDoUpdate({
//           target: [realtimeMetrics.workspaceId],
//           set: {
//             activeVisitors: sql`${realtimeMetrics.activeVisitors} + 1`,
//             recentClicks: sql`${realtimeMetrics.recentClicks} + 1`,
//             lastUpdated: new Date(),
//           },
//         });

//       // 3. Queue metric aggregation (implement this based on your job processing system)
//       await this.queueMetricAggregation(workspaceId);
//     } catch (error) {
//       console.error("Failed to record page view:", error);
//       // Don't throw - we don't want analytics to break the app
//     }
//   }

//   private generateVisitorId(): string {
//     // Implement visitor ID generation
//     // Could be based on IP + User Agent hash, fingerprinting, or cookies
//     return crypto.randomUUID();
//   }

//   private getOrCreateSessionId(): string {
//     // Implement session management
//     // Could be stored in cookies or localStorage
//     return crypto.randomUUID();
//   }

//   private async queueMetricAggregation(workspaceId: string) {
//     // Queue a background job to aggregate metrics
//     // This could use Bull, CloudFlare Queues, or similar
//     console.log("Queued metric aggregation for:", workspaceId);
//   }

//   // New method for getting analytics data
//   async getAnalytics(
//     workspaceId: string,
//     period: "hour" | "day" | "week" | "month" = "day"
//   ) {
//     try {
//       const metrics = await db
//         .select()
//         .from(aggregatedMetrics)
//         .where(
//           sql`
//           workspace_id = ${workspaceId}
//           AND time_bucket = ${period}
//           AND bucket_start >= NOW() - INTERVAL '1 ${period}'
//         `
//         )
//         .orderBy(sql`bucket_start DESC`)
//         .limit(1);

//       return metrics[0] || null;
//     } catch (error) {
//       console.error("Failed to get analytics:", error);
//       return null;
//     }
//   }

//   // New method for getting realtime data
//   async getRealtimeMetrics(workspaceId: string) {
//     try {
//       const realtime = await db
//         .select()
//         .from(realtimeMetrics)
//         .where(
//           sql`
//           workspace_id = ${workspaceId}
//           AND last_updated >= NOW() - INTERVAL '5 minutes'
//         `
//         )
//         .limit(1);

//       return realtime[0] || null;
//     } catch (error) {
//       console.error("Failed to get realtime metrics:", error);
//       return null;
//     }
//   }
// }

// // Create and export a single instance
// export const analytics = new AnalyticsService();
