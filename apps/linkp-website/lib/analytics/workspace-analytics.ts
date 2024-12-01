// apps/linkp-website/lib/analytics/workspace.ts
import { db } from '@/server/db';
import { workspaceAnalytics } from '@repo/db/schema';
import { sql } from 'drizzle-orm';

export async function incrementWorkspaceVisits(workspaceId: string) {
  try {
    await db
      .insert(workspaceAnalytics)
      .values({
        workspaceId,
        visitCount: 1,
        lastVisitedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [workspaceAnalytics.workspaceId],
        set: {
          visitCount: sql`${workspaceAnalytics.visitCount} + 1`,
          lastVisitedAt: new Date(),
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error('Failed to increment workspace visits:', error);
    // Don't throw - we don't want to break page rendering for analytics
  }
}