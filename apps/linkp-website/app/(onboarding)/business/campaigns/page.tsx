// apps/linkp-website/app/(onboarding)/business/campaigns/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, DollarSign, Loader2 } from "lucide-react";
import { CampaignCard } from "../components/campaign-card";
import { useBusinessCampaigns } from "@/lib/swr/use-campaigns";
import { ProposalCard } from "../components/proposal-card";
import { BudgetOverviewCard } from "../components/budget-overview-card";

export default function CampaignsPage() {
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  // For debugging purposes, always fetch campaigns regardless of user type
  // This ensures we're making the API call to test if it works
  const userType = session?.user?.userType || "";
  const isBusinessUser = true; // Force to true for testing

  const { campaigns, proposals, stats, isLoading, isError, mutate } =
    useBusinessCampaigns(isBusinessUser);

  // Prepare stats items for the component
  const statsItems = [
    {
      label: "Available Budget",
      value: `$${stats.availableBudget.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      icon: Users,
    },
    {
      label: "Pending Allocations",
      value: `$${stats.pendingAllocations.toLocaleString()}`,
      icon: Calendar,
    },
    {
      label: "Avg. Completion",
      value: `${stats.avgCompletion}%`,
      icon: Calendar,
    },
  ];

  // Convert API campaign data to the format expected by CampaignCard
  const formatCampaignForCard = (campaign: any) => {
    // Calculate days left if campaign is active
    let daysLeft;
    if (campaign.status === "active" && campaign.endDate) {
      const endDate = new Date(campaign.endDate);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Calculate progress percentage for active campaigns
    let progress;
    if (
      campaign.status === "active" &&
      campaign.startDate &&
      campaign.endDate
    ) {
      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);
      const today = new Date();
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsed = today.getTime() - startDate.getTime();
      progress = Math.min(
        100,
        Math.max(0, Math.round((elapsed / totalDuration) * 100))
      );
    }

    // Format dates for display
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    // Create creator avatar object
    const creator =
      campaign.creator && campaign.workspace
        ? {
            id: campaign.creator.id,
            avatar:
              campaign.workspace.avatarUrl ||
              `/placeholder.svg?height=32&width=32`,
          }
        : null;

    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description || "",
      status: campaign.status,
      budget: {
        // For active campaigns, estimate current budget based on progress
        current:
          campaign.status === "active" && progress
            ? Math.round((progress / 100) * (campaign.metrics?.revenue || 0))
            : undefined,
        total: campaign.metrics?.revenue || 0,
      },
      creators: creator ? [creator] : [],
      timeline: {
        start: formatDate(campaign.startDate),
        end: formatDate(campaign.endDate),
        daysLeft: daysLeft,
      },
      progress: progress,
      roi:
        campaign.status === "completed"
          ? campaign.metrics?.revenue
            ? Math.round(
                (campaign.metrics.revenue / campaign.metrics.clicks) * 100
              )
            : 0
          : undefined,
    };
  };

  // Handle campaign creation - redirect to discover page
  const handleCreateCampaign = () => {
    // Redirect to discover page instead of opening dialog
    router.push("/discover");
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    mutate(); // Refresh data after creating a campaign
  };

  // Log for debugging
  console.log("🔍 API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log("🔍 Session status:", sessionStatus);
  console.log("🔍 User type:", userType);
  console.log("🔍 Is business user:", isBusinessUser);
  console.log("🔍 Is loading:", isLoading);
  console.log("🔍 Is error:", isError);
  console.log("🔍 Proposals count:", proposals?.length || 0);

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="p-6">
        <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
          <h3 className="font-semibold mb-2">Error Loading Campaigns</h3>
          <p className="text-sm">
            There was a problem loading your campaign data. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Manage your influencer marketing campaigns
          </p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Budget Overview */}
      <BudgetOverviewCard
        totalBudget={stats.totalBudget}
        availableBudget={stats.availableBudget}
        totalSpent={stats.totalSpent}
        pendingAllocations={stats.pendingAllocations}
      />

      {/* Campaign Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {campaigns.active.length > 0 ? (
            campaigns.active.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={formatCampaignForCard(campaign)}
              />
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No active campaigns</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleCreateCampaign}
              >
                Create Your First Campaign
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {campaigns.draft.length > 0 ? (
            campaigns.draft.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={formatCampaignForCard(campaign)}
              />
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No draft campaigns</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleCreateCampaign}
              >
                Create a Draft Campaign
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {campaigns.completed.length > 0 ? (
            campaigns.completed.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={formatCampaignForCard(campaign)}
              />
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No completed campaigns yet
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onStatusChange={mutate}
              />
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No pending proposals</p>
              <p className="text-xs text-muted-foreground mt-2">
                When you send proposals to creators, they will appear here until
                accepted or rejected.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
