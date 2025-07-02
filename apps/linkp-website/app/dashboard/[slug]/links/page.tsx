// apps/linkp-website/app/dashboard/[slug]/links/page.tsx
// Default page for the Dashboard
"use client";

import { Button } from "@/components/ui/button";
import useWorkspace from "@/lib/swr/use-workspace";
import { ExternalLink, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateLinkButton } from "../../components/create-link-dialog";
import { FilterDropdown } from "../../components/filter-dropdown";
import { LinksTable } from "../../components/links-table";
import { Pagination } from "../../components/pagination";
import { SearchBar } from "../../components/search-bar";

// Type definition compatible with Cloudflare Pages deployment
type LinksPageProps = {
  params: Promise<{ slug: string }>;
};

export default function LinksPage(props: LinksPageProps) {
  const router = useRouter();
  const [isParamsResolved, setIsParamsResolved] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Handle params as a Promise
    const resolveParams = async () => {
      try {
        await props.params; // Just wait for it to resolve, no need to store
        setIsParamsResolved(true);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    resolveParams();
  }, [props.params]);

  // Use the existing hook which reads from useParams internally
  const { workspace, isLoading, mutate } = useWorkspace();

  const handlePreviewClick = () => {
    if (!workspace?.links?.length) {
      toast.error("You need to add a link first");
      return;
    }
    window.open(`/${workspace.slug}`, "_blank");
  };

  // Don't render until params are resolved
  if (!isParamsResolved || isLoading)
    return <div className="p-4">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {/* Page header with title and preview button */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold font-nunSans">
              Links
            </h1>
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
          </div>

          {/* Search and actions bar */}
          <div className="flex items-center gap-2 mb-4">
            <SearchBar />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-accent" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <CreateLinkButton
              workspaceId={workspace?.id ?? ""}
              mutate={mutate}
              isDisabled={!workspace?.id}
            />
          </div>

          {/* Collapsible filters section */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              <FilterDropdown label="Type" />
              <FilterDropdown label="Status" />
              <FilterDropdown label="Date" />
            </div>
          )}

          {/* Links table */}
          <LinksTable
            links={workspace?.links ?? []}
            workspaceId={workspace?.id ?? ""}
            mutate={mutate}
          />
        </div>
      </div>

      {/* Footer with pagination */}
      <div className="border-t p-4 flex items-center justify-between">
        <div className="text-xs sm:text-sm text-muted-foreground">
          {workspace?.links?.length} links
        </div>
        <Pagination />
      </div>
    </div>
  );
}
