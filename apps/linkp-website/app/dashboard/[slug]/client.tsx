// apps/linkp-website/app/dashboard/[slug]/client.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Filter, MoreVertical } from "lucide-react";
import { CreateLinkButton } from "../components/create-link-dialog";
import { FilterDropdown } from "../components/filter-dropdown";
import { LinksTable } from "../components/links-table";
import { Pagination } from "../components/pagination";
import { SearchBar } from "../components/search-bar";
import useWorkspace from "@/lib/swr/use-workspace";

interface DashboardClientProps {
  slug: string;
}

export default function DashboardClient({ slug }: DashboardClientProps) {
  const { workspaceData, error, isLoading, mutate } = useWorkspace();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold font-nunSans">
              Links {workspaceData?.id}
            </h1>
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
              <CreateLinkButton
                workspaceId={workspaceData?.id ?? ""}
                mutate={mutate}
                isDisabled={!workspaceData?.id}
              />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links table */}
          <LinksTable
            links={workspaceData?.links ?? []}
            workspaceId={workspaceData?.id ?? ""}
            mutate={mutate}
          />
        </div>
      </div>

      {/* Footer with pagination and actions */}
      <div className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Viewing {workspaceData?.links.length} links
        </div>
        <Pagination />
      </div>
    </div>
  );
}
