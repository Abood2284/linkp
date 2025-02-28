"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchWithSession } from "@/lib/utils";
import { BarChart } from "@/components/ui/bar-chart";

interface Analytics {
  totalClicks: number;
  clicksChange: number;
  totalConversions: number;
  conversionsChange: number;
  revenue: number;
  revenueChange: number;
  ctr: number;
  ctrChange: number;
  dailyClicks: {
    date: string;
    clicks: number;
  }[];
}

interface PromotionalAnalyticsProps {
  linkId: string;
}

export function PromotionalAnalytics({ linkId }: PromotionalAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetchWithSession(
          `${API_BASE_URL}/api/business/promotional-links/${linkId}/analytics`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load analytics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [linkId]);

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No analytics data available.</div>;
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
