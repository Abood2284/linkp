// apps/linkp-website/app/(onboarding)/business/components/promotional-analytics.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "recharts"; // Corrected import
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsData, BusinessService } from "@/lib/business/business-service";

interface PromotionalAnalyticsProps {
  linkId: string;
}

export function PromotionalAnalytics({ linkId }: PromotionalAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        const data = await BusinessService.getLinkAnalytics(linkId);
        setAnalytics(data);
      } catch (error) {
        toast("Failed to load analytics. Please try again.");
        console.error("Analytics error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [linkId]);

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center py-8 text-muted-foreground">
            No analytics data available for this link.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <span
              className={
                analytics.clicksChange >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {analytics.clicksChange >= 0 ? "+" : ""}
              {analytics.clicksChange}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <span
              className={
                analytics.conversionsChange >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {analytics.conversionsChange >= 0 ? "+" : ""}
              {analytics.conversionsChange}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalConversions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <span
              className={
                analytics.revenueChange >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {analytics.revenueChange >= 0 ? "+" : ""}
              {analytics.revenueChange}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <span
              className={
                analytics.ctrChange >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {analytics.ctrChange >= 0 ? "+" : ""}
              {analytics.ctrChange}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.ctr}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Click Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            width={600}
            height={300}
            data={analytics.dailyClicks.map((item) => ({
              name: new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              value: item.clicks,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
