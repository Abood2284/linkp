// // apps/linkp-website/lib/analytics/index.ts
// import { db } from "@/server/db";
// import {
//   linkEvents,
//   realtimeMetrics,
//   aggregatedMetrics,
// } from "@repo/db/schema";
// import { sql } from "drizzle-orm";
// import { UAParser } from "ua-parser-js";
// import { getGeoData } from "@/lib/geo"; // You'll need to implement this

// interface PageViewData {
//   workspaceId: string;
//   linkId?: string;
//   userAgent?: string | null;
//   referrer?: string | null;
//   pathname?: string;
// }

// class AnalyticsService {
//   private async parseUserAgent(userAgent: string | null | undefined) {
//     if (!userAgent) return null;
//     const parser = new UAParser(userAgent);
//     return {
//       browser: parser.getBrowser().name,
//       device: parser.getDevice().type || "desktop",
//       os: parser.getOS().name,
//     };
//   }

//   async recordPageView({
//     workspaceId,
//     linkId,
//     userAgent,
//     referrer,
//     pathname,
//   }: PageViewData) {
//     try {
//       const visitorId = this.generateVisitorId(); // Implement based on your visitor tracking strategy
//       const sessionId = this.getOrCreateSessionId(); // Implement based on your session management
//       const geoData = await getGeoData(); // Implement to get visitor's geo data
//       const deviceInfo = await this.parseUserAgent(userAgent);

//       // 1. Record raw event
//       await db.insert(linkEvents).values({
//         workspaceId,
//         linkId,
//         eventType: "pageview",
//         visitorId,
//         sessionId,
//         metadata: {
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
