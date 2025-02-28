import { Button } from "@/components/ui/button";
import { APIResponse, WorkspaceLink, WorkspaceResponse } from "@repo/db/types";
import { Globe, Copy, ChevronRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UpdateLinkDialog } from "./update-link-dialog";
import { useState } from "react";
import { KeyedMutator } from "swr";

interface LinksTableProps {
  links: WorkspaceLink[];
  workspaceId: string;
  mutate: KeyedMutator<WorkspaceResponse>;
}

export function LinksTable({ links, workspaceId, mutate }: LinksTableProps) {
  const [selectedLink, setSelectedLink] = useState<WorkspaceLink | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLinkClick = (link: WorkspaceLink) => {
    setSelectedLink(link);
    setIsDialogOpen(true);
  };

  // Sort links: promotional links first (active -> pending -> others), then by order
  const sortedLinks = [...links].sort((a, b) => {
    // Promotional links go first
    if (a.type === "promotional" && b.type !== "promotional") return -1;
    if (a.type !== "promotional" && b.type === "promotional") return 1;

    // For promotional links, sort by status
    if (a.type === "promotional" && b.type === "promotional") {
      // Active links first
      if (a.promotionStatus === "active" && b.promotionStatus !== "active")
        return -1;
      if (a.promotionStatus !== "active" && b.promotionStatus === "active")
        return 1;
      // Then pending links
      if (a.promotionStatus === "pending" && b.promotionStatus !== "pending")
        return -1;
      if (a.promotionStatus !== "pending" && b.promotionStatus === "pending")
        return 1;
    }

    // Finally sort by order
    return a.order - b.order;
  });

  if (!links.length) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <h3 className="font-semibold mb-1">No links found</h3>
          <p className="text-muted-foreground text-sm max-w-[16rem] mb-4">
            Start creating short links for your marketing campaigns, referral
            programs, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm">Create link</Button>
            <Button variant="outline" size="sm">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {selectedLink && (
        <UpdateLinkDialog
          link={selectedLink}
          workspaceId={workspaceId}
          mutate={mutate}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
        />
      )}
      <div className="divide-y">
        {sortedLinks.map((link) => (
          <div
            onClick={() => handleLinkClick(link)}
            key={link.id}
            className={`flex items-center justify-between border rounded-lg my-2 p-4 hover:bg-muted/50 cursor-pointer ${
              link.type === "promotional" ? "bg-muted/10" : ""
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted">
                {link.icon ? (
                  <img src={link.icon} alt="" className="w-4 h-4" />
                ) : (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium truncate">{link.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `dub.sh/${link.id.slice(0, 7)}`
                      )
                    }
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex items-center gap-1 min-w-0">
                  <span className="truncate text-muted-foreground">
                    {link.url}
                  </span>
                  {link.platform && (
                    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-[10px]">@</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {link.type}
                </Badge>
                {link.type === "promotional" && (
                  <Badge
                    variant={
                      link.promotionStatus === "active"
                        ? "default"
                        : link.promotionStatus === "pending"
                          ? "destructive"
                          : link.promotionStatus === "completed"
                            ? "secondary"
                            : "outline"
                    }
                    className="text-xs"
                  >
                    {link.promotionStatus}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {new Date(link.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {link.type === "promotional" ? (
                    <>
                      <span>{link.promotionMetrics?.clicks || 0} clicks</span>
                      <span>•</span>
                      <span>${(link.promotionPrice || 0) / 100}</span>
                    </>
                  ) : (
                    <span>0 clicks</span>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
