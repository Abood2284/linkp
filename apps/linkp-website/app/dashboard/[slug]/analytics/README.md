# Analytics Architecture

This folder contains the new modular analytics architecture for Linkp. It provides a clean, maintainable, and scalable approach to building analytics features.

## Architecture Overview

The analytics system is built with a clear separation of concerns:

```
analytics/
├── types/           # TypeScript interfaces and types
├── services/        # Data fetching and API communication
├── contexts/        # React contexts for state management
├── hooks/          # Custom hooks for data access
├── components/     # Reusable UI components
├── utils/          # Helper functions and utilities
└── index.ts        # Public API exports
```

## Key Features

### 🎯 Separation of Concerns

- **Data Layer**: Handled by `AnalyticsService` with caching
- **State Management**: Managed by focused React contexts
- **UI Components**: Pure, reusable components
- **Business Logic**: Isolated in custom hooks

### 🔄 URL Synchronization

- Filter state is automatically synchronized with URL parameters
- Shareable analytics views
- Browser back/forward navigation support

### 📊 Flexible Charting

- Multiple chart types (line, bar, area)
- Dynamic metric selection
- Responsive design
- Customizable styling

### ⚡ Performance Optimized

- Intelligent caching with TTL
- Debounced filter updates
- Lazy loading of chart components
- Optimized re-renders

## Quick Start

### Basic Usage

```tsx
import {
  AnalyticsDashboard,
  AnalyticsContainer,
  DateRangeFilter,
  MetricCard,
  LineChart,
} from "./analytics";

function MyAnalyticsPage() {
  const analyticsService = new AnalyticsService("/api");

  return (
    <AnalyticsDashboard service={analyticsService}>
      <AnalyticsContainer>
        <DateRangeFilter />
        <MetricCard metricId="clicks" label="Total Clicks" />
        <LineChart height={400} />
      </AnalyticsContainer>
    </AnalyticsDashboard>
  );
}
```

### Advanced Usage

```tsx
import {
  useAnalyticsFilters,
  useAnalyticsData,
  useAnalyticsUI,
} from "./analytics";

function CustomAnalyticsComponent() {
  const { filters, updateFilters } = useAnalyticsFilters();
  const { data, loading, error } = useAnalyticsData();
  const { chartType, setChartType } = useAnalyticsUI();

  // Custom logic here
  return <div>{/* Your custom analytics UI */}</div>;
}
```

## Components

### Layout Components

- **`AnalyticsDashboard`**: Main wrapper with all providers
- **`AnalyticsContainer`**: Consistent layout container

### Filter Components

- **`DateRangeFilter`**: Date range selection with presets
- **`MetricFilter`**: Multi-select metric filtering

### Chart Components

- **`LineChart`**: Configurable line/bar/area charts
- **`MetricCard`**: Individual metric display with loading states

## Hooks

### Core Hooks

- **`useAnalyticsFilters`**: Access and update filter state
- **`useAnalyticsData`**: Access analytics data with loading states
- **`useAnalyticsUI`**: Manage chart UI state (type, metrics, etc.)

### Utility Hooks

- **`useAnalyticsURL`**: URL synchronization (used internally)
- **`useEnhancedAnalyticsFilters`**: Enhanced filter functionality
- **`useEnhancedAnalyticsData`**: Enhanced data access with filtering

## Services

### AnalyticsService

The main service for data fetching with features:

- **Caching**: Automatic caching with configurable TTL
- **Error Handling**: Graceful error handling and retries
- **Legacy Support**: Backward compatibility with PostHog API
- **Type Safety**: Full TypeScript support

```tsx
const service = new AnalyticsService("/api");

// Fetch metrics
const metrics = await service.getMetrics(filters);

// Fetch time series data
const timeSeries = await service.getTimeSeries(filters);

// Legacy PostHog integration
const workspaceData = await service.getWorkspaceAnalytics(workspaceId);
```

## Types

### Core Types

```tsx
interface AnalyticsFilters {
  dateRange: { from: Date; to: Date };
  metrics: string[];
  dimensions: string[];
  groupBy?: string;
}

interface AnalyticsData {
  metrics: Record<string, number>;
  timeSeries: TimeSeriesPoint[];
  topItems: TopItem[];
}
```

### Filter Types

```tsx
interface DateRange {
  from: Date;
  to: Date;
}

interface FilterOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
}
```

## Utilities

### Analytics Helpers

- **`formatMetricValue`**: Format numbers with K/M suffixes
- **`calculateGrowth`**: Calculate percentage growth
- **`aggregateTimeSeries`**: Aggregate time series data

### Date Helpers

- **`getDatePresets`**: Common date range presets
- **`formatDateRange`**: Format date ranges for display
- **`getDaysBetween`**: Calculate days between dates

## Migration

See [migration-guide.md](./migration-guide.md) for detailed migration instructions from the old PostHog-based implementation.

## Best Practices

### 1. Component Composition

```tsx
// ✅ Good: Compose components
<AnalyticsDashboard service={service}>
  <AnalyticsContainer>
    <DateRangeFilter />
    <MetricCard metricId="clicks" />
  </AnalyticsContainer>
</AnalyticsDashboard>

// ❌ Avoid: Large monolithic components
<BigAnalyticsComponent />
```

### 2. Hook Usage

```tsx
// ✅ Good: Use focused hooks
const { filters } = useAnalyticsFilters();
const { data } = useAnalyticsData();

// ❌ Avoid: Direct service calls in components
const data = await service.getMetrics(filters);
```

### 3. Error Handling

```tsx
// ✅ Good: Handle loading and error states
const { data, loading, error } = useAnalyticsData();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

// ❌ Avoid: Ignoring error states
const { data } = useAnalyticsData();
```

## Testing

### Unit Tests

```tsx
// Test individual components
import { render, screen } from "@testing-library/react";
import { MetricCard } from "./components/charts/metric-card";

test("MetricCard displays loading state", () => {
  render(<MetricCard metricId="clicks" label="Clicks" />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
```

### Integration Tests

```tsx
// Test the full analytics flow
import { AnalyticsDashboard } from "./components/layout/analytics-dashboard";

test("Analytics dashboard loads data", async () => {
  const mockService = { getMetrics: jest.fn() };
  render(
    <AnalyticsDashboard service={mockService}>
      <MetricCard metricId="clicks" />
    </AnalyticsDashboard>
  );

  expect(mockService.getMetrics).toHaveBeenCalled();
});
```

## Performance Considerations

### 1. Caching

- The service automatically caches API responses
- Cache TTL is configurable (default: 5 minutes)
- Manual cache invalidation available

### 2. Re-renders

- Contexts are optimized to prevent unnecessary re-renders
- Use `React.memo` for expensive chart components
- Debounce filter updates

### 3. Bundle Size

- Components are tree-shakeable
- Import only what you need
- Lazy load chart libraries

## Future Enhancements

### Planned Features

- [ ] Real-time data updates
- [ ] Export functionality
- [ ] Custom chart configurations
- [ ] Advanced filtering options
- [ ] A/B testing integration

### Extensibility

The architecture is designed to be easily extensible:

```tsx
// Add new chart types
export function PieChart({ data, ...props }) {
  // Implementation
}

// Add new metrics
const newMetrics = [{ id: "custom_metric", label: "Custom Metric" }];

// Add new filter types
export function CustomFilter({ options, ...props }) {
  // Implementation
}
```

## Support

For questions or issues:

1. Check the [migration guide](./migration-guide.md)
2. Review the [analytics readme](./analytics-readme.md)
3. Look at the [architecture guide](./analytics-readme.md)

The new architecture provides a solid foundation for building scalable analytics features while maintaining code quality and developer experience.
