// apps/linkp-website/app/(onboarding)/business/components/campaign-stats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CampaignStatsProps {
  items: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
  }>;
}

export function CampaignStats({ items }: CampaignStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <h2 className="text-2xl font-bold">{item.value}</h2>
              </div>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
