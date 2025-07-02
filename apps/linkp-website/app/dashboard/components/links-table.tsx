// apps/links-website/app/dashboard/components/links-table.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceLink, WorkspaceResponse } from "@repo/db/types";
import { Copy, ExternalLink, Globe, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { UpdateLinkDialog } from "./update-link-dialog";

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
            Click the button on top right
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
            key={link.id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg my-2 p-3 sm:p-4 hover:bg-muted/50 cursor-pointer ${
              link.type === "promotional" ? "bg-muted/10" : ""
            }`}
          >
            {/* Left side with icon, title and URL - Stack on mobile */}
            <div
              className="flex items-center gap-3 min-w-0 mb-2 sm:mb-0 w-full sm:w-auto"
              onClick={() => handleLinkClick(link)}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted">
                {link.icon ? (
                  <Image
                    src={link.icon}
                    alt=""
                    className="w-4 h-4"
                    width={16}
                    height={16}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1 gap-1">
                {/* Title and copy button */}
                <div className="flex items-center gap-1.5">
                  <span className="font-medium truncate">{link.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(
                        `dub.sh/${link.id.slice(0, 7)}`
                      );
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* URL with truncation */}
                <div className="flex items-center min-w-0">
                  <span className="truncate text-muted-foreground text-xs sm:text-sm">
                    {link.url}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side with badges, clicks, and actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 mt-2 sm:mt-0">
              {/* Type badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {link.type}
                </Badge>

                {/* Clicks indicator */}
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {link.type === "promotional"
                      ? `${link.promotionMetrics?.clicks || 0} clicks`
                      : "0 clicks"}
                  </span>
                </div>
              </div>

              {/* More actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLinkClick(link);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
