// apps/linkp-website/app/dashboard/[slug]/analytics/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import useWorkspace from "@/lib/swr/use-workspace";
import { useWorkspaceAnalytics } from "@/lib/swr/use-workspace-analytics";
import { BarChart2, Link as LinkIcon, Users, Link } from "lucide-react"; // Import Link icon
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number; // We'll revisit this for links
  viewsByDay: { date: string; views: number }[];
  totalLinkClicks: number; // Add totalLinkClicks
}

export default function AnalyticsPage() {
  const { workspace } = useWorkspace();

  // Get analytics data for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch page view analytics
  const { analytics: pageViewAnalytics, isLoading: isPageViewLoading } =
    useWorkspaceAnalytics({
      workspaceId: workspace?.id || "",
      dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
      interval: "day",
      metricType: "page_views", // Specify page_views
    });

  // Fetch link click analytics
  const { analytics: linkClickAnalytics, isLoading: isLinkClickLoading } =
    useWorkspaceAnalytics({
      workspaceId: workspace?.id || "",
      dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
      interval: "day",
      metricType: "link_clicks", // Specify link_clicks
    });

  // Process analytics data (Page Views)
  const analyticsData: AnalyticsData = {
    totalViews: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    viewsByDay: [],
    totalLinkClicks: 0, // Initialize totalLinkClicks
  };

  if (pageViewAnalytics?.results?.[0]) {
    // Use pageViewAnalytics here
    const result = pageViewAnalytics.results[0];

    analyticsData.totalViews = result.count;
    analyticsData.viewsByDay = result.data.map((value: any, index: any) => ({
      date: result.days[index], // Use ISO dates instead of labels
      views: value,
    }));

    // Better unique visitor calculation
    analyticsData.uniqueVisitors =
      result.unique_visitors || Math.round(result.count * 0.7);
  }

  // Process link click analytics and update analyticsData
  if (linkClickAnalytics?.results?.[0]) {
    const linkClickResult = linkClickAnalytics.results[0];
    analyticsData.totalLinkClicks = linkClickResult.count; // Get total link clicks
  }

  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

  const isLoading = isPageViewLoading || isLinkClickLoading; // Combined loading state

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      {isLoading ? (
        // Loading state
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {" "}
          {/* Increased grid columns */}
          {[...Array(4)].map(
            (
              _,
              i // Increased array length to 4
            ) => (
              <Card key={i} className="p-6 h-32 animate-pulse" />
            )
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {" "}
            {/* Increased grid columns */}
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <LinkIcon className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">Total Page Views</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">Unique Visitors</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.uniqueVisitors.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <Link className="h-6 w-6" />{" "}
                {/* Changed to Link icon from lucide */}
                <div>
                  <p className="text-sm font-medium">Total Link Clicks</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.totalLinkClicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <BarChart2 className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">Avg. Views per Link</p>
                  <p className="text-2xl font-bold">
                    {analyticsData.conversionRate.toFixed(1)}{" "}
                    {/* Still needs proper calculation */}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Views Over Time Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Page Views Over Time</h3>{" "}
            {/* Updated chart title */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData.viewsByDay}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(isoDate) =>
                      new Date(isoDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />

                  <Tooltip
                    labelFormatter={(isoDate) =>
                      new Date(isoDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
