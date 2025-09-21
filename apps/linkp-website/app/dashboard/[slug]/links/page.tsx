// apps/linkp-website/app/dashboard/[slug]/links/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import useWorkspace from "@/lib/swr/use-workspace";
import { ExternalLink, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  CreateLinkButton,
  CreateLinkHandle,
} from "../../components/create-link-dialog";
import { FilterDropdown } from "../../components/filter-dropdown";
import { LinksTable } from "../../components/links-table";
import { Pagination } from "../../components/pagination";
import { SearchBar } from "../../components/search-bar";

type LinksPageProps = { params: Promise<{ slug: string }> };

export default function LinksPage(props: LinksPageProps) {
  const router = useRouter();
  const [isParamsResolved, setIsParamsResolved] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // hotkey refs
  const searchRef = useRef<HTMLInputElement>(null);
  const createRef = useRef<CreateLinkHandle>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        await props.params;
        setIsParamsResolved(true);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };
    resolveParams();
  }, [props.params]);

  const { workspace, isLoading, mutate } = useWorkspace();

  // ⌘/Ctrl+K → open create dialog; "/" → focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.getAttribute("contenteditable") === "true");
      // Open: Meta/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        createRef.current?.open();
        return;
      }
      // Focus search with "/" when not typing
      if (!isTyping && e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handlePreviewClick = () => {
    if (!workspace?.links?.length) {
      toast.error("You need to add a link first");
      return;
    }
    window.open(`/${workspace.slug}`, "_blank");
  };

  if (!isParamsResolved || isLoading) {
    return (
      <div className="p-4">
        <div className="h-10 w-40 rounded-md animate-pulse bg-brand-surface" />
        <div className="mt-4 h-9 w-full rounded-md animate-pulse bg-brand-surface" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-canvas">
      {/* Sticky page header */}
      <div className="sticky top-0 z-20 border-b backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight tracking-[-0.01em] text-brand-ink">
                Links
              </h1>
              <p className="text-xs sm:text-sm mt-0.5 text-black/60">
                Manage destinations, promos, and tracking all in one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewClick}
                className="gap-2"
                disabled={!workspace?.links?.length}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <CreateLinkButton
                ref={createRef}
                workspaceId={workspace?.id ?? ""}
                mutate={mutate}
                isDisabled={!workspace?.id}
              />
            </div>
          </div>

          {/* Search & quick actions */}
          <div className="mt-3 flex items-center gap-2">
            <SearchBar ref={searchRef} />
            <Button
              variant="outline"
              size="icon"
              aria-pressed={showFilters}
              onClick={() => setShowFilters((v) => !v)}
              className={`transition-colors ${showFilters ? "bg-black/[0.06]" : ""}`}
              title="Show filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              <FilterDropdown label="Type" />
              <FilterDropdown label="Status" />
              <FilterDropdown label="Date" />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <LinksTable
            links={workspace?.links ?? []}
            workspaceId={workspace?.id ?? ""}
            mutate={mutate}
          />
        </div>
      </div>

      {/* Footer / pagination */}
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {workspace?.links?.length ?? 0} links
          </div>
          <Pagination />
        </div>
      </div>
    </div>
  );
}
