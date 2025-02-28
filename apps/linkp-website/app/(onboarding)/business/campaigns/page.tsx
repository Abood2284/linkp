"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, DollarSign } from "lucide-react";
import { CampaignCard } from "../components/campaign-card";
import { CampaignStats } from "../components/campaign-stats";

// Sample data
const stats = [
  {
    label: "Active Campaigns",
    value: "12",
    icon: Users,
  },
  {
    label: "Total Budget",
    value: "$24,500",
    icon: DollarSign,
  },
  {
    label: "Avg. Completion",
    value: "85%",
    icon: Calendar,
  },
];

const activeCampaigns = [
  {
    title: "Summer Collection Launch 2024",
    description: "Promote our new summer collection with lifestyle content",
    status: "active" as const,
    budget: {
      current: 8500,
      total: 10000,
    },
    creators: [
      { id: 1, avatar: "https://avatar.iran.liara.run/public/1" },
      { id: 2, avatar: "https://avatar.iran.liara.run/public/2" },
      { id: 3, avatar: "https://avatar.iran.liara.run/public/3" },
      { id: 4, avatar: "https://avatar.iran.liara.run/public/4" },
    ],
    timeline: {
      start: "Jun 1",
      end: "Jul 30",
      daysLeft: 30,
    },
    progress: 65,
  },
  {
    title: "Influencer Takeover Series",
    description: "Weekly Instagram takeovers by fashion influencers",
    status: "active" as const,
    budget: {
      current: 5200,
      total: 8000,
    },
    creators: [
      { id: 5, avatar: "https://avatar.iran.liara.run/public/5" },
      { id: 6, avatar: "https://avatar.iran.liara.run/public/6" },
    ],
    timeline: {
      start: "May 15",
      end: "Aug 15",
      daysLeft: 45,
    },
    progress: 40,
  },
];

const draftCampaigns = [
  {
    title: "Fall Collection Preview",
    description: "Early access content for upcoming fall collection",
    status: "draft" as const,
    budget: {
      total: 15000,
    },
    creators: [],
    timeline: {
      start: "Aug 15",
      end: "Sep 30",
    },
  },
];

const completedCampaigns = [
  {
    title: "Spring Collection 2024",
    description: "Spring collection launch campaign",
    status: "completed" as const,
    budget: {
      total: 12500,
    },
    creators: [
      { id: 7, avatar: "https://avatar.iran.liara.run/public/7" },
      { id: 8, avatar: "https://avatar.iran.liara.run/public/8" },
      { id: 9, avatar: "https://avatar.iran.liara.run/public/9" },
    ],
    timeline: {
      start: "Mar 1",
      end: "Apr 30",
    },
    roi: 245,
  },
];

export default function CampaignsPage() {
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <CampaignStats items={stats} />

      {/* Campaign Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeCampaigns.map((campaign, index) => (
            <CampaignCard key={index} campaign={campaign} />
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {draftCampaigns.map((campaign, index) => (
            <CampaignCard key={index} campaign={campaign} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCampaigns.map((campaign, index) => (
            <CampaignCard key={index} campaign={campaign} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
