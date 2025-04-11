// apps/linkp-website/app/(onboarding)/business/components/promotional-links-table.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessService, PromotionalLink } from "@/lib/business/business-service";

interface PromotionalLinksTableProps {
  businessId: string;
}

export function PromotionalLinksTable({
  businessId,
}: PromotionalLinksTableProps) {
  const [links, setLinks] = useState<PromotionalLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        setIsLoading(true);
        const data = await BusinessService.getPromotionalLinks(businessId);
        setLinks(data.links);
      } catch (error) {
        toast("Failed to load promotional links. Please try again.");
        console.error("Links error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLinks();
  }, [businessId]);

  async function handleStatusUpdate(linkId: string, newStatus: string) {
    try {
      await BusinessService.updateLinkStatus(linkId, newStatus);

      // Update local state
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === linkId ? { ...link, promotionStatus: newStatus } : link
        )
      );

      toast(`Link status has been updated to ${newStatus}.`);
    } catch (error) {
      toast("Failed to update status. Please try again.");
      console.error("Status update error:", error);
    }
  }

  if (isLoading) {
    return <LinksLoadingSkeleton />;
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          No promotional links found.
        </p>
        <Button>Create Promotional Link</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div
          key={link.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{link.title}</h3>
            <p className="text-sm text-muted-foreground">{link.url}</p>
            <div className="flex items-center gap-2">
              <Badge>{link.promotionStatus}</Badge>
              <span className="text-sm text-muted-foreground">
                Created {new Date(link.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{link.clicks} clicks</p>
              <p className="text-sm text-muted-foreground">
                ${link.promotionPrice}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(link.id, "active")}
                >
                  Mark as Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(link.id, "paused")}
                >
                  Pause
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(link.id, "completed")}
                >
                  Mark as Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinksLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
