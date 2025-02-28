# Linkp Analytics Documentation

## Current Implementation

### Overview
Linkp uses PostHog for analytics tracking, providing insights into how users interact with link-in-bio pages. The implementation follows a client-side tracking approach using the PostHog JavaScript SDK.

### Components and Architecture

#### 1. Core Components

##### PostHog Provider (`app/providers/session-provider.tsx`)
```typescript
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only",
  capture_pageview: false, // Manual pageview tracking
})
```

##### TrackedLink Component (`components/shared/trackedLinks.tsx`)
- Client-side component for tracking link clicks
- Handles both analytics and navigation
- Prevents double-clicks and ensures reliable tracking
```typescript
posthog?.capture("workspace_link_click", {
  link_id: linkId,
  link_url: href,
  link_text: text,
  timestamp: new Date().toISOString(),
})
```

##### Analytics Dashboard (`app/dashboard/[slug]/analytics/page.tsx`)
- Real-time analytics visualization
- Shows key metrics and trends
- Uses Recharts for data visualization

### Events Being Tracked

1. **Page Views** (`workspace_page_view`)
   ```typescript
   {
     workspace_id: string    // Workspace identifier
     workspace_slug: string  // URL slug
     template_id: string     // Template being used
     timestamp: string       // ISO timestamp
   }
   ```

2. **Link Clicks** (`workspace_link_click`)
   ```typescript
   {
     workspace_id: string    // Workspace identifier
     link_id: string        // Unique link identifier
     link_text: string      // Link text content
     link_url: string       // Destination URL
     timestamp: string      // ISO timestamp
   }
   ```

### Packages Used
1. `posthog-js`: Core PostHog SDK
2. `recharts`: Data visualization library
3. `@radix-ui/react-*`: UI components
4. `lucide-react`: Icons

### Data Flow
1. User visits a link-in-bio page
2. `AnalyticsWrapper` captures page view
3. User clicks a link
4. `TrackedLink` captures click event
5. Data is sent to PostHog
6. Analytics dashboard queries and displays data

## Implementation Details

### 1. Page View Tracking
```typescript
useEffect(() => {
  posthog?.capture("workspace_page_view", {
    workspace_id: workspaceId,
    workspace_slug: workspaceSlug,
    template_id: templateId,
    timestamp: new Date().toISOString(),
  })
}, [posthog, workspaceId, workspaceSlug, templateId])
```

### 2. Link Click Tracking
```typescript
const handleClick = async (e: React.MouseEvent) => {
  posthog?.capture("workspace_link_click", {
    link_id: linkId,
    link_url: href,
    link_text: text,
    timestamp: new Date().toISOString(),
  })
}
```

### 3. Analytics Dashboard
- Real-time metrics:
  - Total link clicks
  - Unique visitors
  - Conversion rate
- Time-series visualization:
  - Clicks over time (last 30 days)
  - Daily aggregation

## What's Left to Implement

### 1. Enhanced Data Collection
- [ ] Geographic data (visitor locations)
- [ ] Device and browser information
- [ ] Session duration tracking
- [ ] Referrer tracking

### 2. Advanced Analytics
- [ ] Link-specific performance metrics
- [ ] A/B testing capabilities
- [ ] Custom event tracking
- [ ] Funnel analysis

### 3. Data Aggregation
- [ ] Background jobs for data aggregation
- [ ] Real-time metrics caching
- [ ] Historical data storage optimization

### 4. Dashboard Enhancements
- [ ] More visualization options
- [ ] Custom date ranges
- [ ] Export capabilities
- [ ] Link-specific analytics views

### 5. Performance Optimizations
- [ ] Server-side aggregation
- [ ] Data caching strategies
- [ ] Query optimization

## Best Practices

1. **Event Naming**
   - Use consistent prefixes (`workspace_`)
   - Be descriptive but concise
   - Follow `noun_verb` pattern

2. **Property Collection**
   - Include timestamps
   - Use consistent property names
   - Include all relevant context

3. **Error Handling**
   - Graceful fallbacks for failed tracking
   - Error logging and monitoring
   - Retry mechanisms for failed events

4. **Performance**
   - Batch events when possible
   - Debounce high-frequency events
   - Use appropriate sampling rates

## Next Steps

1. Implement geographic tracking
2. Add device and browser detection
3. Set up data aggregation jobs
4. Enhance the analytics dashboard
5. Implement caching strategies

## Resources
- [PostHog Documentation](https://posthog.com/docs)
- [Recharts Documentation](https://recharts.org/)