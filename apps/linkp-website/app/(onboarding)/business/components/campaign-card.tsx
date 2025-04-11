// apps/linkp-website/app/(onboarding)/business/components/campaign-card.tsx 
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface CampaignCardProps {
  campaign: {
    title: string;
    description: string;
    status: "active" | "draft" | "completed";
    budget: {
      current?: number;
      total: number;
    };
    creators: Array<{
      id: number;
      avatar: string;
    }>;
    timeline: {
      start: string;
      end: string;
      daysLeft?: number;
    };
    progress?: number;
    roi?: number;
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const statusVariants = {
    active: "",
    draft: "secondary",
    completed: "outline",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Left Section: Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-semibold truncate">{campaign.title}</h3>
                <Badge
                  //   variant={statusVariants[campaign.status]}
                  className="capitalize"
                >
                  {campaign.status}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
              {campaign.description}
            </p>

            {/* Timeline and Progress */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Timeline</span>
                  {campaign.timeline.daysLeft && (
                    <span className="text-xs">
                      {campaign.timeline.daysLeft} days left
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium">
                  {campaign.timeline.start} - {campaign.timeline.end}
                </div>
              </div>
              {campaign.progress && (
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-xs">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>
              )}
            </div>

            {/* Budget and Creators */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <div className="font-semibold">
                  {campaign.status === "active" ? (
                    <>
                      ${campaign.budget.current?.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        of ${campaign.budget.total.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    `$${campaign.budget.total.toLocaleString()}`
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Creators</p>
                <div className="flex -space-x-2">
                  {campaign.creators.map((creator) => (
                    <Avatar
                      key={creator.id}
                      className="h-8 w-8 border-2 border-background"
                    >
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>CC</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              {campaign.roi && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ROI</p>
                  <p className="font-semibold text-green-500">
                    {campaign.roi}%
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {campaign.status === "active" && (
                <>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Message Creators
                  </Button>
                </>
              )}
              {campaign.status === "draft" && (
                <>
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit Campaign
                  </Button>
                  <Button size="sm" className="flex-1">
                    Launch Campaign
                  </Button>
                </>
              )}
              {campaign.status === "completed" && (
                <>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Report
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Duplicate Campaign
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
