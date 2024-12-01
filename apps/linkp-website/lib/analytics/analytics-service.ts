// apps/linkp-website/lib/analytics/index.ts
import { db } from '@/server/db';
import { workspaceAnalytics } from '@repo/db/schema';
import { sql } from 'drizzle-orm';

interface PageViewData {
  workspaceId: string;
  userAgent?: string | null;
  referer?: string | null;
  pathname?: string;
}

class AnalyticsService {
  async recordPageView({
    workspaceId,
    userAgent,
    referer,
    pathname
  }: PageViewData) {
    try {
      // First, try to get existing analytics record
      const existingAnalytics = await db
        .select()
        .from(workspaceAnalytics)
        .where(sql`workspace_id = ${workspaceId}`)
        .limit(1);

      if (existingAnalytics.length > 0) {
        // Update existing record
        await db
          .update(workspaceAnalytics)
          .set({
            visitCount: sql`visit_count + 1`,
            lastVisitedAt: new Date(),
            updatedAt: new Date()
          })
          .where(sql`workspace_id = ${workspaceId}`);
      } else {
        // Create new record
        await db
          .insert(workspaceAnalytics)
          .values({
            workspaceId,
            visitCount: 1,
            lastVisitedAt: new Date()
          });
      }

      // Optionally log detailed visit data for future analysis
      await this.logDetailedVisit({
        workspaceId,
        userAgent,
        referer,
        pathname
      });

    } catch (error) {
      console.error('Failed to record page view:', error);
      // Don't throw - we don't want analytics to break the app
    }
  }

  private async logDetailedVisit(data: PageViewData) {
    // You could implement detailed visit logging here
    // For example, storing in a separate table for granular analytics
    console.log('Detailed visit logged:', data);
  }
}

// Create and export a single instance
export const analytics = new AnalyticsService();