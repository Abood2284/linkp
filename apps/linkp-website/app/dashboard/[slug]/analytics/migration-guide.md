# Analytics Migration Guide

## Overview

This guide helps you migrate from the current PostHog-based analytics implementation to the new modular analytics architecture.

## What's Changed

### Old Architecture (PostHog-based)

- Single large analytics page component
- Direct PostHog integration
- SWR hooks for data fetching
- Mixed concerns in components

### New Architecture (Modular)

- Separated concerns with contexts, hooks, and services
- Flexible data layer with caching
- URL synchronization for filters
- Reusable components
- Type-safe interfaces

## Migration Steps

### Step 1: Update Dependencies

The new architecture uses the same dependencies as before:

- `recharts` for charts
- `@radix-ui/react-*` for UI components
- `lucide-react` for icons

### Step 2: Replace the Analytics Page

**Before:**

```tsx
// Old page.tsx (1113 lines)
"use client";
import { useWorkspaceAnalytics } from "@/lib/swr/use-workspace-analytics";
// ... lots of mixed logic
```

**After:**

```tsx
// New page-new.tsx (modular components)
"use client";
import { AnalyticsDashboard, AnalyticsContainer } from "./components/layout";
import { DateRangeFilter, MetricFilter } from "./components/filters";
import { LineChart, MetricCard } from "./components/charts";
// ... clean, focused components
```

### Step 3: Update Data Fetching

**Before:**

```tsx
const { analytics, isLoading, error } = useWorkspaceAnalytics({
  workspaceId: "123",
  interval: "day",
  dateFrom: "2024-02-01",
  dateTo: "2024-02-16",
});
```

**After:**

```tsx
// The service handles data fetching automatically
const { data, loading, error, refresh } = useAnalyticsData();
const { filters, updateFilters } = useAnalyticsFilters();
```

### Step 4: Update Filter Management

**Before:**

```tsx
// Manual URL management and state
const [dateRange, setDateRange] = useState({
  from: new Date(),
  to: new Date(),
});
```

**After:**

```tsx
// Automatic URL synchronization
const { filters, updateFilters } = useAnalyticsFilters();
// URL updates automatically when filters change
```

### Step 5: Update Chart Components

**Before:**

```tsx
// Inline chart logic mixed with data fetching
<AreaChart data={analytics?.views?.viewsByDay}>
  {/* Chart configuration */}
</AreaChart>
```

**After:**

```tsx
// Clean, focused chart component
<LineChart height={400} />
// Chart type and metrics managed by UI context
```

## File Structure Comparison

### Old Structure

```
analytics/
├── page.tsx (1113 lines - everything mixed together)
└── analytics-readme.md
```

### New Structure

```
analytics/
├── types/
│   ├── analytics.ts
│   └── filters.ts
├── services/
│   └── analytics-service.ts
├── contexts/
│   ├── analytics-filters-context.tsx
│   ├── analytics-data-context.tsx
│   └── analytics-ui-context.tsx
├── hooks/
│   ├── use-analytics-url.ts
│   ├── use-analytics-filters.ts
│   └── use-analytics-data.ts
├── components/
│   ├── filters/
│   │   ├── date-range-filter.tsx
│   │   └── metric-filter.tsx
│   ├── charts/
│   │   ├── line-chart.tsx
│   │   └── metric-card.tsx
│   └── layout/
│       ├── analytics-dashboard.tsx
│       └── analytics-container.tsx
├── utils/
│   ├── analytics-helpers.ts
│   └── date-helpers.ts
├── page-new.tsx (clean, modular)
├── index.ts (exports)
└── migration-guide.md
```

## Benefits of the New Architecture

### 1. Separation of Concerns

- **Data Layer**: Handled by `AnalyticsService` and contexts
- **State Management**: Managed by focused contexts
- **UI Components**: Pure, reusable components
- **Business Logic**: Isolated in hooks and utilities

### 2. Reusability

- Components can be used in different contexts
- Hooks provide consistent data access patterns
- Services can be easily mocked for testing

### 3. Maintainability

- Smaller, focused files
- Clear responsibilities
- Easy to test individual components
- Type-safe interfaces

### 4. Flexibility

- Easy to add new chart types
- Simple to extend with new metrics
- URL synchronization for sharing
- Caching for performance

## Testing the Migration

### 1. ⚠️ Migration Status: Working Page Restored

The working analytics page has been restored:

```bash
# ✅ Working page restored as page.tsx (41KB)
# ✅ Old page backed up as page-old.tsx (41KB)
# ⚠️ New modular architecture components are ready but not yet integrated
```

### 2. Test Core Functionality

- [ ] Date range filtering works
- [ ] Metrics display correctly
- [ ] Charts render properly
- [ ] URL synchronization works
- [ ] Data refreshing works

### 3. Test Edge Cases

- [ ] Error states display correctly
- [ ] Loading states work
- [ ] Empty data handling
- [ ] Invalid date ranges

## Rollback Plan

If issues arise, you can quickly rollback:

```bash
# Restore the old page
mv page.tsx page-new.tsx
mv page-old.tsx page.tsx
```

**Note**: The old page is safely backed up as `page-old.tsx` and can be restored at any time.

The new architecture is designed to be non-breaking, so the old implementation will continue to work.

## Next Steps

1. **Test the new page** in development
2. **Compare functionality** with the old implementation
3. **Gradually migrate** other analytics features
4. **Add new features** using the new architecture
5. **Remove old files** once migration is complete

## Support

If you encounter issues during migration:

1. Check the console for errors
2. Verify all imports are correct
3. Ensure the API endpoints are working
4. Test with the rollback plan if needed

The new architecture provides a solid foundation for future analytics features while maintaining the flexibility to evolve as your needs change.
