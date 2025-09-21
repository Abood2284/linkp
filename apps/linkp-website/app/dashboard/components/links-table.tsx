// apps/linkp-website/app/dashboard/components/links-table.tsx
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
import { useMemo, useState } from "react";
import { KeyedMutator } from "swr";
import { UpdateLinkDialog } from "./update-link-dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LinksTableProps {
  links: WorkspaceLink[];
  workspaceId: string;
  mutate: KeyedMutator<WorkspaceResponse>;
}

export function LinksTable({ links, workspaceId, mutate }: LinksTableProps) {
  const [selectedLink, setSelectedLink] = useState<WorkspaceLink | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [toDelete, setToDelete] = useState<WorkspaceLink | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sortedLinks = useMemo(() => {
    const arr = [...links];
    arr.sort((a, b) => {
      if (a.type === "promotional" && b.type !== "promotional") return -1;
      if (a.type !== "promotional" && b.type === "promotional") return 1;
      if (a.type === "promotional" && b.type === "promotional") {
        const rank = (s?: string) =>
          s === "active" ? 0 : s === "pending" ? 1 : 2;
        const ra = rank(a.promotionStatus);
        const rb = rank(b.promotionStatus);
        if (ra !== rb) return ra - rb;
      }
      return (a.order ?? 0) - (b.order ?? 0);
    });
    return arr;
  }, [links]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      // optimistic remove
      await mutate(
        (current) => {
          if (!current?.data) return current;
          return {
            ...current,
            data: {
              ...current.data,
              links: (current.data.links || []).filter(
                (l) => l.id !== toDelete.id
              ),
            },
          };
        },
        { revalidate: false }
      );

      const res = await fetch(`${API_BASE_URL}/api/workspace/links/delete`, {
        method: "POST", // adjust if your API uses DELETE or a different path
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: toDelete.id, workspaceId }),
      });

      if (!res.ok) {
        throw new Error(`Delete failed (${res.status})`);
      }

      toast.success("Link deleted");
      setToDelete(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete link");
      // revert by revalidating
      await mutate();
    } finally {
      setDeleting(false);
    }
  };

  if (!links.length) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <h3 className="font-semibold mb-1 text-brand-ink">
            Create your first link
          </h3>
          <p className="text-muted-foreground text-sm max-w-[22rem] mb-4">
            Add destinations for your content, track clicks, and organize
            promos. Hit “New Link” on the top right.
          </p>
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

      {/* Delete confirm dialog */}
      <AlertDialog
        open={!!toDelete}
        onOpenChange={(open: boolean) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the link from your workspace. You can’t undo this
              action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-2">
        {sortedLinks.map((link) => {
          const isPromo = link.type === "promotional";
          const leftStripe =
            isPromo && link.promotionStatus === "active"
              ? "bg-brand-primary"
              : isPromo && link.promotionStatus === "pending"
                ? "bg-brand-surface"
                : "bg-black/10";

          return (
            <div
              key={link.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-white p-3 sm:p-4 hover:bg-black/[0.02] cursor-pointer relative`}
              onClick={() => {
                setSelectedLink(link);
                setIsDialogOpen(true);
              }}
            >
              {/* left stripe */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${leftStripe}`}
              />

              {/* Left cluster */}
              <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto pl-2">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-brand-surface/60">
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
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium truncate text-brand-ink">
                      {link.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        const shorty = `dub.sh/${link.id.slice(0, 7)}`;
                        navigator.clipboard.writeText(shorty);
                        toast.success("Short link copied");
                      }}
                      title="Copy short link"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center min-w-0 gap-2">
                    <span className="truncate text-muted-foreground text-xs sm:text-sm">
                      {link.url}
                    </span>
                  </div>

                  <div className="sm:hidden mt-1 flex items-center gap-2">
                    {isPromo ? (
                      <Badge variant="secondary" className="text-[11px]">
                        Promo: {link.promotionStatus || "—"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px]">
                        {link.type}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {isPromo
                        ? `${link.promotionMetrics?.clicks || 0} clicks`
                        : "0 clicks"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right cluster */}
              <div className="hidden sm:flex items-center gap-3">
                {isPromo ? (
                  <Badge variant="secondary" className="text-xs">
                    Promo: {link.promotionStatus || "—"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {link.type}
                  </Badge>
                )}

                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isPromo
                      ? `${link.promotionMetrics?.clicks || 0} clicks`
                      : "0 clicks"}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLink(link);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(link.url, "_blank");
                      }}
                    >
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToDelete(link);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
