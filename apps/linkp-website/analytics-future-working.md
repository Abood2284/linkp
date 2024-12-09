Let's optimize the analytics tables. Currently, we have two tables handling analytics:

1. workspace_link_analytics - For individual link clicks
2. workspace_metrics - For overall workspace performance

Let me explain the current challenges and propose optimizations that will make the analytics system more efficient and powerful.

### Current Challenges

1. The workspace_link_analytics table stores every single click as a row, which can quickly grow massive
2. The workspace_metrics table has limited granularity - it's trying to store aggregate metrics without clear time periods
3. We're potentially duplicating some data between the two tables
4. The current schema makes it difficult to analyze trends over time

### Proposed Analytics Schema Optimization

Let's create a more efficient analytics system that uses time-bucketing and efficient aggregation. Here's the improved schema:

Let me explain why this new analytics schema is more efficient and powerful:

### 1. Event Collection Layer (linkEvents)
This table acts as the initial data collection point with several optimizations:
- Stores raw events with minimal processing
- Uses JSONB for flexible metadata storage
- Implements efficient indexing for quick aggregation
- Can be automatically cleaned up after aggregation (e.g., keep only last 30 days of raw data)

### 2. Aggregation Layer (aggregatedMetrics)
This table stores pre-calculated statistics at different time intervals:
- Supports multiple time buckets (hour, day, week, month, year)
- Uses JSONB for flexible metric storage
- Enables efficient trend analysis
- Reduces query complexity for dashboards
- Minimizes storage requirements for historical data

### 3. Real-time Layer (realtimeMetrics)
This table handles current activity monitoring:
- Provides immediate visibility into active visitors
- Enables real-time dashboard updates
- Automatically cleaned up/reset periodically

### Implementation Strategy

Here's how you would implement this system:

1. Event Collection:
```typescript
async function trackLinkEvent(event: LinkEvent) {
  // 1. Insert into raw events
  await db.insert(linkEvents).values({
    linkId: event.linkId,
    workspaceId: event.workspaceId,
    eventType: 'click',
    visitorId: hashVisitorId(event.visitorData),
    sessionId: event.sessionId,
    metadata: {
      country: event.geo?.country,
      city: event.geo?.city,
      device: event.userAgent?.device,
      browser: event.userAgent?.browser,
      referrer: event.referrer
    }
  });

  // 2. Update realtime metrics
  await db
    .insert(realtimeMetrics)
    .values({
      workspaceId: event.workspaceId,
      linkId: event.linkId,
      recentClicks: 1
    })
    .onConflictDoUpdate({
      target: [realtimeMetrics.workspaceId, realtimeMetrics.linkId],
      set: {
        recentClicks: sql`${realtimeMetrics.recentClicks} + 1`,
        lastUpdated: sql`CURRENT_TIMESTAMP`
      }
    });
}
```

2. Aggregation Job (runs periodically):
```typescript
async function aggregateMetrics(timeBucket: TimeBucket) {
  const aggregationQuery = sql`
    INSERT INTO aggregated_metrics (
      workspace_id,
      link_id,
      time_bucket,
      bucket_start,
      bucket_end,
      metrics
    )
    SELECT
      workspace_id,
      link_id,
      ${timeBucket}::time_bucket,
      date_trunc(${timeBucket}, timestamp) as bucket_start,
      date_trunc(${timeBucket}, timestamp) + interval '1 ${timeBucket}' as bucket_end,
      jsonb_build_object(
        'totalClicks', count(*),
        'uniqueVisitors', count(DISTINCT visitor_id),
        'uniqueSessions', count(DISTINCT session_id),
        'topCountries', jsonb_agg(
          distinct jsonb_build_object(
            'country', metadata->>'country',
            'count', count(*)
          )
        )
      ) as metrics
    FROM link_events
    WHERE timestamp >= date_trunc(${timeBucket}, CURRENT_TIMESTAMP - interval '1 ${timeBucket}')
    GROUP BY workspace_id, link_id, date_trunc(${timeBucket}, timestamp)
  `;

  await db.execute(aggregationQuery);
}
```

3. Cleanup Job:
```typescript
async function cleanupOldData() {
  // Keep raw events for 30 days
  await db.delete(linkEvents).where(
    sql`timestamp < CURRENT_TIMESTAMP - interval '30 days'`
  );

  // Reset realtime metrics older than 30 minutes
  await db.delete(realtimeMetrics).where(
    sql`last_updated < CURRENT_TIMESTAMP - interval '30 minutes'`
  );
}
```

This optimized analytics system provides several benefits:
1. Better performance for dashboard queries
2. Reduced storage requirements
3. Real-time capabilities
4. Flexible metric collection
5. Easy extension for new types of analytics

