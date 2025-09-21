// apps/linkp-website/app/dashboard/[slug]/analytics/components/charts/line-chart.tsx
import { useAnalyticsData } from "../../contexts/analytics-data-context";
import { useAnalyticsUI } from "../../contexts/analytics-ui-context";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";

interface LineChartProps {
  className?: string;
  height?: number;
}

export function LineChart({ className, height = 300 }: LineChartProps) {
  const { data, loading, error } = useAnalyticsData();
  const { selectedMetrics, chartType } = useAnalyticsUI();

  if (loading) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{ height }}
      >
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{ height }}
      >
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data?.timeSeries) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{ height }}
      >
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const chartData = data.timeSeries.map((point) => ({
    date: point.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    ...point.values,
  }));

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {selectedMetrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length] }}
              />
            ))}
          </RechartsLineChart>
        );
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {selectedMetrics.map((metric, index) => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {selectedMetrics.map((metric, index) => (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
      default:
        return (
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {selectedMetrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length] }}
              />
            ))}
          </RechartsLineChart>
        );
    }
  };

  const chartElement = renderChart();

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {chartElement}
      </ResponsiveContainer>
    </div>
  );
}
