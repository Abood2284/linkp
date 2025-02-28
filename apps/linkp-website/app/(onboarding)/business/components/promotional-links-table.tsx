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
import { useToast } from "@/components/ui/use-toast";
import { fetchWithSession } from "@/lib/utils";

interface WorkspaceLink {
  id: string;
  title: string;
  url: string;
  promotionStatus: string;
  createdAt: string;
  clicks: number;
  promotionPrice: string;
}

interface PromotionalLinksTableProps {
  businessId: string;
}

export function PromotionalLinksTable({
  businessId,
}: PromotionalLinksTableProps) {
  const [links, setLinks] = useState<WorkspaceLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLinks() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetchWithSession(
          `${API_BASE_URL}/api/business/promotional-links?businessId=${businessId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch promotional links");
        }

        const data = await response.json();
        setLinks(data.links);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load promotional links. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchLinks();
  }, [businessId]);

  async function handleStatusUpdate(linkId: string, newStatus: string) {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetchWithSession(
        `${API_BASE_URL}/api/business/promotional-links/${linkId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === linkId ? { ...link, promotionStatus: newStatus } : link
        )
      );

      toast({
        title: "Status updated",
        description: `Link status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div>Loading promotional links...</div>;
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No promotional links found.</p>
        <Button className="mt-4">Create Promotional Link</Button>
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
