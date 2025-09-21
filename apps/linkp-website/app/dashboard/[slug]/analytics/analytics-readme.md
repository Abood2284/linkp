# Analytics Architecture Guide

## Overview

This guide provides a comprehensive approach to building maintainable, scalable analytics features. It addresses the common pitfalls of over-engineering while maintaining the benefits of good architecture patterns.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Architecture Structure](#architecture-structure)
3. [Implementation Steps](#implementation-steps)
4. [Component Patterns](#component-patterns)
5. [State Management](#state-management)
6. [Data Layer](#data-layer)
7. [URL Synchronization](#url-synchronization)
8. [Testing Strategy](#testing-strategy)
9. [Common Pitfalls](#common-pitfalls)
10. [Best Practices](#best-practices)

## Core Principles

### 1. Separation of Concerns

- **Data Layer**: Handle data fetching, caching, and transformation
- **State Layer**: Manage application state and URL synchronization
- **UI Layer**: Render components and handle user interactions
- **Business Logic**: Handle analytics-specific calculations and rules

### 2. Composition Over Configuration

- Build small, focused components
- Compose them together rather than passing complex props
- Use render props or children for flexible composition

### 3. Progressive Enhancement

- Start with simple implementations
- Add complexity only when needed
- Maintain backward compatibility

## Architecture Structure

```
analytics/
├── contexts/
│   ├── analytics-filters-context.tsx
│   ├── analytics-data-context.tsx
│   └── analytics-ui-context.tsx
├── hooks/
│   ├── use-analytics-filters.ts
│   ├── use-analytics-data.ts
│   └── use-analytics-url.ts
├── services/
│   ├── analytics-service.ts
│   └── analytics-cache.ts
├── components/
│   ├── filters/
│   │   ├── date-range-filter.tsx
│   │   ├── metric-filter.tsx
│   │   └── dimension-filter.tsx
│   ├── charts/
│   │   ├── line-chart.tsx
│   │   ├── bar-chart.tsx
│   │   └── metric-card.tsx
│   └── layout/
│       ├── analytics-dashboard.tsx
│       └── analytics-container.tsx
├── types/
│   ├── analytics.ts
│   └── filters.ts
└── utils/
    ├── analytics-helpers.ts
    └── date-helpers.ts
```

## Implementation Steps

### Step 1: Define Types and Interfaces

```typescript
// types/analytics.ts
export interface AnalyticsFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  metrics: string[];
  dimensions: string[];
  groupBy?: string;
}

export interface AnalyticsData {
  metrics: Record<string, number>;
  timeSeries: TimeSeriesPoint[];
  topItems: TopItem[];
}

export interface TimeSeriesPoint {
  date: Date;
  values: Record<string, number>;
}

export interface TopItem {
  id: string;
  name: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsState {
  filters: AnalyticsFilters;
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}
```

```typescript
// types/filters.ts
export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}
```

### Step 2: Create the Data Service Layer

```typescript
// services/analytics-service.ts
export class AnalyticsService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async getMetrics(
    filters: AnalyticsFilters
  ): Promise<AnalyticsData["metrics"]> {
    const cacheKey = this.getCacheKey("metrics", filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/analytics/metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  async getTimeSeries(filters: AnalyticsFilters): Promise<TimeSeriesPoint[]> {
    const cacheKey = this.getCacheKey("timeseries", filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/analytics/timeseries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch time series: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  async getTopItems(filters: AnalyticsFilters): Promise<TopItem[]> {
    const cacheKey = this.getCacheKey("top-items", filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/analytics/top-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top items: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearCacheForEndpoint(endpoint: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(endpoint)) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Step 3: Create URL Synchronization Hook

```typescript
// hooks/use-analytics-url.ts
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AnalyticsFilters } from "../types/analytics";

export function useAnalyticsURL() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = useMemo((): AnalyticsFilters => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const metrics = searchParams.get("metrics")?.split(",") || ["clicks"];
    const dimensions = searchParams.get("dimensions")?.split(",") || [];
    const groupBy = searchParams.get("groupBy") || undefined;

    return {
      dateRange: {
        from: from
          ? new Date(from)
          : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: to ? new Date(to) : new Date(),
      },
      metrics,
      dimensions,
      groupBy,
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<AnalyticsFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update date range
      if (newFilters.dateRange) {
        params.set("from", newFilters.dateRange.from.toISOString());
        params.set("to", newFilters.dateRange.to.toISOString());
      }

      // Update metrics
      if (newFilters.metrics) {
        params.set("metrics", newFilters.metrics.join(","));
      }

      // Update dimensions
      if (newFilters.dimensions) {
        params.set("dimensions", newFilters.dimensions.join(","));
      }

      // Update groupBy
      if (newFilters.groupBy) {
        params.set("groupBy", newFilters.groupBy);
      } else if (newFilters.groupBy === undefined) {
        params.delete("groupBy");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push("", { scroll: false });
  }, [router]);

  return {
    currentFilters,
    updateFilters,
    resetFilters,
  };
}
```

### Step 4: Create Focused Contexts

```typescript
// contexts/analytics-filters-context.tsx
import { createContext, useContext, ReactNode } from 'react';
import { AnalyticsFilters } from '../types/analytics';
import { useAnalyticsURL } from '../hooks/use-analytics-url';

interface FiltersContextValue {
  filters: AnalyticsFilters;
  updateFilters: (newFilters: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function AnalyticsFiltersProvider({ children }: { children: ReactNode }) {
  const { currentFilters, updateFilters, resetFilters } = useAnalyticsURL();

  return (
    <FiltersContext.Provider value={{
      filters: currentFilters,
      updateFilters,
      resetFilters,
    }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useAnalyticsFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useAnalyticsFilters must be used within AnalyticsFiltersProvider');
  }
  return context;
}
```

```typescript
// contexts/analytics-data-context.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { AnalyticsData, AnalyticsFilters } from '../types/analytics';
import { AnalyticsService } from '../services/analytics-service';
import { useAnalyticsFilters } from './analytics-filters-context';

interface DataContextValue {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function AnalyticsDataProvider({
  children,
  service
}: {
  children: ReactNode;
  service: AnalyticsService;
}) {
  const { filters } = useAnalyticsFilters();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [metrics, timeSeries, topItems] = await Promise.all([
        service.getMetrics(filters),
        service.getTimeSeries(filters),
        service.getTopItems(filters),
      ]);

      setData({ metrics, timeSeries, topItems });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const refresh = () => {
    fetchData();
  };

  return (
    <DataContext.Provider value={{
      data,
      loading,
      error,
      refresh,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAnalyticsData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useAnalyticsData must be used within AnalyticsDataProvider');
  }
  return context;
}
```

```typescript
// contexts/analytics-ui-context.tsx
import { createContext, useContext, ReactNode, useState } from 'react';

interface UIContextValue {
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
  chartType: 'line' | 'bar' | 'area';
  setChartType: (type: 'line' | 'bar' | 'area') => void;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function AnalyticsUIProvider({ children }: { children: ReactNode }) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['clicks']);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [showLegend, setShowLegend] = useState(true);

  return (
    <UIContext.Provider value={{
      selectedMetrics,
      setSelectedMetrics,
      chartType,
      setChartType,
      showLegend,
      setShowLegend,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useAnalyticsUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useAnalyticsUI must be used within AnalyticsUIProvider');
  }
  return context;
}
```

### Step 5: Create Focused Components

```typescript
// components/filters/date-range-filter.tsx
import { useState } from 'react';
import { DateRange } from '../../types/filters';
import { useAnalyticsFilters } from '../../contexts/analytics-filters-context';

interface DateRangeFilterProps {
  className?: string;
  presets?: Array<{
    id: string;
    label: string;
    range: DateRange;
  }>;
}

export function DateRangeFilter({ className, presets }: DateRangeFilterProps) {
  const { filters, updateFilters } = useAnalyticsFilters();
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: typeof presets[0]) => {
    updateFilters({ dateRange: preset.range });
    setIsOpen(false);
  };

  const handleCustomRange = (range: DateRange) => {
    updateFilters({ dateRange: range });
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border rounded-md"
      >
        <span>
          {filters.dateRange.from.toLocaleDateString()} - {filters.dateRange.to.toLocaleDateString()}
        </span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 p-4 border rounded-md bg-white shadow-lg">
          {/* Preset options */}
          {presets && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Quick Select</h3>
              <div className="space-y-1">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom date picker would go here */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Custom Range</h3>
            {/* Implement custom date picker */}
          </div>
        </div>
      )}
    </div>
  );
}
```

```typescript
// components/filters/metric-filter.tsx
import { useAnalyticsFilters } from '../../contexts/analytics-filters-context';

interface MetricFilterProps {
  availableMetrics: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function MetricFilter({ availableMetrics, className }: MetricFilterProps) {
  const { filters, updateFilters } = useAnalyticsFilters();

  const handleMetricToggle = (metricId: string) => {
    const newMetrics = filters.metrics.includes(metricId)
      ? filters.metrics.filter(id => id !== metricId)
      : [...filters.metrics, metricId];

    updateFilters({ metrics: newMetrics });
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Metrics</h3>
      <div className="space-y-2">
        {availableMetrics.map((metric) => (
          <label key={metric.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.metrics.includes(metric.id)}
              onChange={() => handleMetricToggle(metric.id)}
              className="rounded"
            />
            <div>
              <div className="text-sm font-medium">{metric.label}</div>
              {metric.description && (
                <div className="text-xs text-gray-500">{metric.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
```

```typescript
// components/charts/line-chart.tsx
import { useAnalyticsData } from '../../contexts/analytics-data-context';
import { useAnalyticsUI } from '../../contexts/analytics-ui-context';

interface LineChartProps {
  className?: string;
  height?: number;
}

export function LineChart({ className, height = 300 }: LineChartProps) {
  const { data, loading, error } = useAnalyticsData();
  const { selectedMetrics, chartType } = useAnalyticsUI();

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height }}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data?.timeSeries) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height }}>
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Render chart using your preferred charting library
  return (
    <div className={className} style={{ height }}>
      {/* Chart implementation */}
      <div className="text-sm text-gray-500">
        Chart showing {selectedMetrics.join(', ')} over time
      </div>
    </div>
  );
}
```

```typescript
// components/charts/metric-card.tsx
import { useAnalyticsData } from '../../contexts/analytics-data-context';

interface MetricCardProps {
  metricId: string;
  label: string;
  format?: (value: number) => string;
  className?: string;
}

export function MetricCard({ metricId, label, format, className }: MetricCardProps) {
  const { data, loading, error } = useAnalyticsData();

  const value = data?.metrics?.[metricId];
  const formattedValue = value !== undefined && format ? format(value) : value;

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold">
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        ) : error ? (
          <span className="text-red-500">Error</span>
        ) : (
          formattedValue ?? 'N/A'
        )}
      </div>
    </div>
  );
}
```

### Step 6: Create Layout Components

```typescript
// components/layout/analytics-dashboard.tsx
import { ReactNode } from 'react';
import { AnalyticsFiltersProvider } from '../../contexts/analytics-filters-context';
import { AnalyticsDataProvider } from '../../contexts/analytics-data-context';
import { AnalyticsUIProvider } from '../../contexts/analytics-ui-context';
import { AnalyticsService } from '../../services/analytics-service';

interface AnalyticsDashboardProps {
  children: ReactNode;
  service: AnalyticsService;
}

export function AnalyticsDashboard({ children, service }: AnalyticsDashboardProps) {
  return (
    <AnalyticsFiltersProvider>
      <AnalyticsDataProvider service={service}>
        <AnalyticsUIProvider>
          <div className="p-6 space-y-6">
            {children}
          </div>
        </AnalyticsUIProvider>
      </AnalyticsDataProvider>
    </AnalyticsFiltersProvider>
  );
}
```

```typescript
// components/layout/analytics-container.tsx
import { ReactNode } from 'react';

interface AnalyticsContainerProps {
  children: ReactNode;
  className?: string;
}

export function AnalyticsContainer({ children, className }: AnalyticsContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
```

### Step 7: Create Custom Hooks for Specific Functionality

```typescript
// hooks/use-analytics-filters.ts
import { useMemo } from "react";
import { useAnalyticsFilters as useFilters } from "../contexts/analytics-filters-context";

export function useAnalyticsFilters() {
  const { filters, updateFilters, resetFilters } = useFilters();

  const hasActiveFilters = useMemo(() => {
    return (
      filters.dimensions.length > 0 ||
      filters.metrics.length > 1 ||
      filters.groupBy !== undefined
    );
  }, [filters]);

  const getFilterSummary = useMemo(() => {
    const parts = [];

    if (filters.metrics.length > 1) {
      parts.push(`${filters.metrics.length} metrics`);
    }

    if (filters.dimensions.length > 0) {
      parts.push(`${filters.dimensions.length} dimensions`);
    }

    if (filters.groupBy) {
      parts.push(`grouped by ${filters.groupBy}`);
    }

    return parts.join(", ");
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    getFilterSummary,
  };
}
```

```typescript
// hooks/use-analytics-data.ts
import { useMemo } from "react";
import { useAnalyticsData as useData } from "../contexts/analytics-data-context";
import { useAnalyticsUI } from "../contexts/analytics-ui-context";

export function useAnalyticsData() {
  const { data, loading, error, refresh } = useData();
  const { selectedMetrics } = useAnalyticsUI();

  const filteredTimeSeries = useMemo(() => {
    if (!data?.timeSeries) return [];

    return data.timeSeries.map((point) => ({
      date: point.date,
      values: Object.fromEntries(
        selectedMetrics.map((metric) => [metric, point.values[metric] || 0])
      ),
    }));
  }, [data?.timeSeries, selectedMetrics]);

  const totalMetrics = useMemo(() => {
    if (!data?.metrics) return {};

    return Object.fromEntries(
      selectedMetrics.map((metric) => [metric, data.metrics[metric] || 0])
    );
  }, [data?.metrics, selectedMetrics]);

  return {
    data,
    loading,
    error,
    refresh,
    filteredTimeSeries,
    totalMetrics,
  };
}
```

### Step 8: Create Utility Functions

```typescript
// utils/analytics-helpers.ts
import { AnalyticsFilters, TimeSeriesPoint } from "../types/analytics";

export function formatMetricValue(value: number, metric: string): string {
  if (metric.includes("percentage") || metric.includes("rate")) {
    return `${(value * 100).toFixed(1)}%`;
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toLocaleString();
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getDateRangeLabel(filters: AnalyticsFilters): string {
  const { from, to } = filters.dateRange;
  const daysDiff = Math.ceil(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 1) return "Last 24 hours";
  if (daysDiff === 7) return "Last 7 days";
  if (daysDiff === 30) return "Last 30 days";
  if (daysDiff === 90) return "Last 3 months";

  return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
}

export function aggregateTimeSeries(
  data: TimeSeriesPoint[],
  aggregation: "sum" | "avg" | "max" | "min"
): Record<string, number> {
  if (!data.length) return {};

  const metrics = Object.keys(data[0].values);
  const result: Record<string, number> = {};

  for (const metric of metrics) {
    const values = data
      .map((point) => point.values[metric])
      .filter((v) => v !== undefined);

    switch (aggregation) {
      case "sum":
        result[metric] = values.reduce((sum, val) => sum + val, 0);
        break;
      case "avg":
        result[metric] =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case "max":
        result[metric] = Math.max(...values);
        break;
      case "min":
        result[metric] = Math.min(...values);
        break;
    }
  }

  return result;
}
```

```typescript
// utils/date-helpers.ts
export function getDatePresets() {
  const now = new Date();

  return [
    {
      id: "24h",
      label: "Last 24 hours",
      range: {
        from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "7d",
      label: "Last 7 days",
      range: {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "30d",
      label: "Last 30 days",
      range: {
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "90d",
      label: "Last 3 months",
      range: {
        from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        to: now,
      },
    },
    {
      id: "ytd",
      label: "Year to date",
      range: {
        from: new Date(now.getFullYear(), 0, 1),
        to: now,
      },
    },
  ];
}

export function formatDateRange(from: Date, to: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const fromStr = from.toLocaleDateString("en-US", formatOptions);
  const toStr = to.toLocaleDateString("en-US", formatOptions);

  return `${fromStr} - ${toStr}`;
}
```

### Step 9: Usage Example

```typescript
// pages/analytics.tsx
import { AnalyticsDashboard } from '../components/layout/analytics-dashboard';
import { AnalyticsContainer } from '../components/layout/analytics-container';
import { DateRangeFilter } from '../components/filters/date-range-filter';
import { MetricFilter } from '../components/filters/metric-filter';
import { LineChart } from '../components/charts/line-chart';
import { MetricCard } from '../components/charts/metric-card';
import { AnalyticsService } from '../services/analytics-service';
import { getDatePresets } from '../utils/date-helpers';

const analyticsService = new AnalyticsService('/api');

const availableMetrics = [
  { id: 'clicks', label: 'Clicks', description: 'Total number of clicks' },
  { id: 'impressions', label: 'Impressions', description: 'Total number of impressions' },
  { id: 'conversions', label: 'Conversions', description: 'Total number of conversions' },
  { id: 'revenue', label: 'Revenue', description: 'Total revenue generated' },
];

export default function AnalyticsPage() {
  return (
    <AnalyticsDashboard service={analyticsService}>
      <AnalyticsContainer>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <DateRangeFilter presets={getDatePresets()} />
            <MetricFilter availableMetrics={availableMetrics} />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            metricId="clicks"
            label="Total Clicks"
            format={(value) => value.toLocaleString()}
          />
          <MetricCard
            metricId="impressions"
            label="Total Impressions"
            format={(value) => value.toLocaleString()}
          />
          <MetricCard
            metricId="conversions"
            label="Total Conversions"
            format={(value) => value.toLocaleString()}
          />
          <MetricCard
            metricId="revenue"
            label="Total Revenue"
            format={(value) => `$${value.toLocaleString()}`}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Time Series</h2>
            <LineChart height={300} />
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Top Items</h2>
            {/* Top items component would go here */}
          </div>
        </div>
      </AnalyticsContainer>
    </AnalyticsDashboard>
  );
}
```

## Testing Strategy

### 1. Unit Tests for Services

```typescript
// __tests__/services/analytics-service.test.ts
import { AnalyticsService } from "../../services/analytics-service";

describe("AnalyticsService", () => {
  let service: AnalyticsService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    service = new AnalyticsService("/api");
  });

  describe("getMetrics", () => {
    it("should fetch metrics successfully", async () => {
      const mockData = { clicks: 100, impressions: 1000 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const filters = {
        dateRange: { from: new Date(), to: new Date() },
        metrics: ["clicks"],
        dimensions: [],
      };

      const result = await service.getMetrics(filters);
      expect(result).toEqual(mockData);
    });

    it("should handle errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      const filters = {
        dateRange: { from: new Date(), to: new Date() },
        metrics: ["clicks"],
        dimensions: [],
      };

      await expect(service.getMetrics(filters)).rejects.toThrow(
        "Failed to fetch metrics: Internal Server Error"
      );
    });
  });
});
```

### 2. Component Tests

```typescript
// __tests__/components/filters/date-range-filter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeFilter } from '../../../components/filters/date-range-filter';
import { AnalyticsFiltersProvider } from '../../../contexts/analytics-filters-context';

const mockPresets = [
  {
    id: '24h',
    label: 'Last 24 hours',
    range: { from: new Date(), to: new Date() },
  },
];

describe('DateRangeFilter', () => {
  it('should render with current date range', () => {
    render(
      <AnalyticsFiltersProvider>
        <DateRangeFilter presets={mockPresets} />
      </AnalyticsFiltersProvider>
    );

    expect(screen.getByText(/Last 24 hours/)).toBeInTheDocument();
  });

  it('should open dropdown when clicked', () => {
    render(
      <AnalyticsFiltersProvider>
        <DateRangeFilter presets={mockPresets} />
      </AnalyticsFiltersProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Quick Select')).toBeInTheDocument();
  });
});
```

## Common Pitfalls

### 1. Over-Engineering

**Problem**: Creating complex abstractions before they're needed
**Solution**: Start simple and add complexity gradually

```typescript
// ❌ Don't do this initially
class AnalyticsManager {
  private eventBus: EventBus;
  private cacheManager: CacheManager;
  private dataProcessor: DataProcessor;
  // ... many more abstractions
}

// ✅ Start with this
const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters) => {
    setLoading(true);
    const result = await fetch("/api/analytics", {
      body: JSON.stringify(filters),
    });
    setData(await result.json());
    setLoading(false);
  };

  return { data, loading, fetchData };
};
```

### 2. Tight Coupling

**Problem**: Components depend on specific implementations
**Solution**: Use dependency injection and interfaces

```typescript
// ❌ Tight coupling
function MetricCard() {
  const { data } = useAnalyticsData(); // Depends on specific context
  return <div>{data.metrics.clicks}</div>;
}

// ✅ Loose coupling
interface MetricCardProps {
  value: number;
  label: string;
  format?: (value: number) => string;
}

function MetricCard({ value, label, format }: MetricCardProps) {
  return <div>{format ? format(value) : value}</div>;
}
```

### 3. Mixed Concerns

**Problem**: UI logic mixed with business logic
**Solution**: Separate concerns into different layers

```typescript
// ❌ Mixed concerns
function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchData = async () => {
    // Business logic mixed with UI
    const response = await fetch('/api/analytics', {
      body: JSON.stringify(filters)
    });
    setData(await response.json());
  };

  return (
    <div>
      {/* UI mixed with data fetching */}
      {data && <Chart data={data} />}
    </div>
  );
}

// ✅ Separated concerns
function AnalyticsDashboard() {
  const { data, loading } = useAnalyticsData(); // Data layer
  const { filters, updateFilters } = useAnalyticsFilters(); // State layer

  return (
    <div>
      {/* Pure UI */}
      {loading ? <LoadingSpinner /> : <Chart data={data} />}
    </div>
  );
}
```

## Best Practices

### 1. Progressive Enhancement

- Start with basic functionality
- Add features incrementally
- Maintain backward compatibility

### 2. Performance Optimization

- Use React.memo for expensive components
- Implement proper caching strategies
- Use virtualization for large datasets

### 3. Error Handling

- Provide meaningful error messages
- Implement retry mechanisms
- Graceful degradation

### 4. Accessibility

- Use semantic HTML
- Provide keyboard navigation
- Include ARIA labels

This architecture provides a solid foundation for analytics features while maintaining flexibility and scalability. The key is to start simple and add complexity only when needed.
