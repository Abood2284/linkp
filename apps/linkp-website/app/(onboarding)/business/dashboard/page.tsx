// apps/linkp-website/app/(onboarding)/business/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "../components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchWithSession } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Define type interfaces for dashboard data
interface DashboardStats {
  activeCampaigns: number;
  totalReach: string;
  conversionRate: string;
  roi: string;
  activeCampaignsTrend: { value: string; isPositive: boolean };
  totalReachTrend: { value: string; isPositive: boolean };
  conversionRateTrend: { value: string; isPositive: boolean };
  roiTrend: { value: string; isPositive: boolean };
}

interface RecentActivity {
  name: string;
  message: string;
  time: string;
  avatar: string;
}

interface ActiveCampaign {
  name: string;
  creators: number;
  timeLeft: string;
  progress: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  activeCampaigns: ActiveCampaign[];
}

export default function BusinessDashboard() {
  // Use proper typing for state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetchWithSession(
          `${API_BASE_URL}/api/business/dashboard`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = (await response.json()) as { data: DashboardData };
        setDashboardData(data.data);
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // If loading, show skeleton UI
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Default data when dashboardData is null
  const defaultStats: DashboardStats = {
    activeCampaigns: 0,
    totalReach: "0",
    conversionRate: "0%",
    roi: "0%",
    activeCampaignsTrend: { value: "0% from last month", isPositive: true },
    totalReachTrend: { value: "0% from last month", isPositive: true },
    conversionRateTrend: { value: "0% from last month", isPositive: true },
    roiTrend: { value: "0% from last month", isPositive: true },
  };

  const defaultActivities: RecentActivity[] = [];
  const defaultCampaigns: ActiveCampaign[] = [];

  // Safely access data with defaults
  const stats = dashboardData?.stats || defaultStats;
  const recentActivities = dashboardData?.recentActivities || defaultActivities;
  const activeCampaigns = dashboardData?.activeCampaigns || defaultCampaigns;

  // If no data is available, show a placeholder
  if (!dashboardData && !isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Welcome to your dashboard!
            </h2>
            <p className="text-muted-foreground mb-4">
              You currently don&apos;t have any active campaigns. Start by
              creating your first campaign or discovering creators to work with.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                Create Campaign
              </button>
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md">
                Discover Creators
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            trend={stats.activeCampaignsTrend}
          />
          <StatsCard
            title="Total Reach"
            value={stats.totalReach}
            trend={stats.totalReachTrend}
          />
          <StatsCard
            title="Conversion Rate"
            value={stats.conversionRate}
            trend={stats.conversionRateTrend}
          />
          <StatsCard title="ROI" value={stats.roi} trend={stats.roiTrend} />
        </div>

        {/* Recent Activity & Active Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Activity</CardTitle>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-10 h-10">
                        <Image
                          src={activity.avatar}
                          alt={activity.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.message}
                          <span className="font-medium"> {activity.name}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Active Campaigns</CardTitle>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activeCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                          Active
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                        <span>{campaign.creators} Creators</span>
                        <span>Ends in {campaign.timeLeft}</span>
                      </div>
                      <div className="mt-3 w-full bg-secondary/20 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active campaigns
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Skeleton component remains the same
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="mb-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
