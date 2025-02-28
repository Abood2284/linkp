"use client";

import { Button } from "@/components/ui/button";
import { Filter, MoreVertical, ExternalLink } from "lucide-react";
import { CreateLinkButton } from "../../components/create-link-dialog";
import { FilterDropdown } from "../../components/filter-dropdown";
import { LinksTable } from "../../components/links-table";
import { Pagination } from "../../components/pagination";
import { SearchBar } from "../../components/search-bar";
import useWorkspace from "@/lib/swr/use-workspace";
import { toast } from "sonner";

export default function LinksPage({ params }: { params: { slug: string } }) {
  const { workspace, isLoading, mutate } = useWorkspace();

  const handlePreviewClick = () => {
    if (!workspace?.links?.length) {
      toast.error("You need to add a link first");
      return;
    }
    window.open(`/${workspace.slug}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold font-nunSans">Links</h1>
          </div>

          {/* Filters and actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Filter dropdowns */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <FilterDropdown
                icon={<Filter className="h-4 w-4" />}
                label="Filter"
              />
              <FilterDropdown label="Display" />
            </div>

            {/* Search and create */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <SearchBar />
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewClick}
                className="gap-2"
                disabled={!workspace?.links?.length}
              >
                <ExternalLink className="h-4 w-4" />
                Preview your page
              </Button>
              <CreateLinkButton
                workspaceId={workspace?.id ?? ""}
                mutate={mutate}
                isDisabled={!workspace?.id}
              />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links table */}
          <LinksTable
            links={workspace?.links ?? []}
            workspaceId={workspace?.id ?? ""}
            mutate={mutate}
          />
        </div>
      </div>

      {/* Footer with pagination and actions */}
      <div className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Viewing {workspace?.links?.length} links
        </div>
        <Pagination />
      </div>
    </div>
  );
}
