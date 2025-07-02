// apps/linkp-website/app/dashboard/components/sidebar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaces } from "@/lib/swr/use-workspaces";
import { cn } from "@/lib/utils";
import { WorkspaceType } from "@repo/db/types";
import {
  BarChart2,
  ExternalLink,
  HelpCircle,
  Instagram,
  LinkIcon,
  LogOut,
  Map,
  Settings,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkspaceDropDown } from "./workspace-drop-down";
export function Sidebar() {
  console.log("🎯 Sidebar Render Started");
  const segments = useSelectedLayoutSegments();
  const { workspaces, isLoading, isError } = useWorkspaces();
  const { data: session } = useSession();
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceType | null>(null);

  useEffect(() => {
    console.log("🔄 Sidebar useEffect", {
      workspacesCount: workspaces.length,
      isLoading,
      hasError: !!isError,
    });

    // Initialize selected workspace
    if (!selectedWorkspace && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, isLoading, isError, selectedWorkspace]);

  const workspaceSlug = selectedWorkspace?.slug || workspaces?.[0]?.slug || "";

  // --- Skeleton Components ---
  function SidebarAvatarSkeleton() {
    return (
      <div className="flex items-center ml-auto gap-2 animate-pulse">
        <div className="rounded-full bg-muted w-8 h-8" />
      </div>
    );
  }

  function WorkspaceDropDownSkeleton() {
    return (
      <div className="h-10 w-full bg-muted rounded-md animate-pulse mt-4" />
    );
  }

  // --- Sidebar ---
  console.log("✅ Sidebar Render Success", {
    workspacesAvailable: workspaces.length > 0,
    workspaceIds: workspaces.map((w) => w.id),
  });

  return (
    <div className="w-60 border-r bg-gray-50 flex flex-col h-full shadow-md">
      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="scroll-m-20 text-xl font-nunSans font-semibold tracking-tight">
            Linkp
          </span>
          <div className="flex items-center ml-auto gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            {/* Avatar area: show skeleton if session is loading */}
            {session === undefined ? (
              <SidebarAvatarSkeleton />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        session?.user?.image || "/assets/images/abdul_pfp.jpg"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        {/* Workspace dropdown: show skeleton if workspaces are loading */}
        {isLoading ? (
          <WorkspaceDropDownSkeleton />
        ) : (
          <WorkspaceDropDown
            workspaces={workspaces}
            onWorkspaceChange={setSelectedWorkspace}
          />
        )}
      </div>
      <div className="px-2">
        <Link
          href={`/dashboard/${workspaceSlug}/links`}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md",
            segments.includes("links")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          prefetch={true}
        >
          <LinkIcon className="h-4 w-4" />
          Links
        </Link>
        <Link
          href={`/dashboard/${workspaceSlug}/analytics`}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md",
            segments.includes("analytics")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          prefetch={true}
        >
          <BarChart2 className="h-4 w-4" />
          Analytics
        </Link>
        <Link
          href={`/dashboard/${workspaceSlug}/instagram`}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md",
            segments.includes("instagram")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          prefetch={true}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </Link>
        <Link
          href={`/dashboard/${workspaceSlug}/proposals`}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md",
            segments.includes("proposals")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          prefetch={true}
        >
          <Sparkles className="h-4 w-4" />
          Proposals
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>

      <div className="mt-auto px-4 pb-4 space-y-4">
        {/* Performance Snapshot Card - Fixed width constraints */}
        <div className="mt-auto px-4 pb-4 space-y-4">
          <div className="p-3 pb-2">
            <h3 className="text-xs font-medium text-gray-800">
              Performance Snapshot
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
              Today's activity summary
            </p>
          </div>

          <div className="px-3 pb-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Views</p>
                <div className="flex items-center">
                  <p className="text-sm font-medium">124</p>
                  <span className="text-[10px] text-green-600 ml-1 flex items-center">
                    <TrendingUp className="h-2 w-2 mr-0.5" />
                    12%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Clicks</p>
                <div className="flex items-center">
                  <p className="text-sm font-medium">57</p>
                  <span className="text-[10px] text-green-600 ml-1 flex items-center">
                    <TrendingUp className="h-2 w-2 mr-0.5" />
                    8%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Region Card */}
          <div className="px-3 pb-3">
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 overflow-hidden max-w-full">
              <p className="text-[10px] font-medium flex items-center mb-1">
                <Map className="h-2.5 w-2.5 mr-1" />
                Top Regions
              </p>

              {/* Using flex instead of absolute positioning */}
              <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                <div className="bg-emerald-500 text-white text-[9px] px-1 py-0.5 rounded-sm whitespace-nowrap">
                  US (42)
                </div>
                <div className="bg-emerald-500 text-white text-[9px] px-1 py-0.5 rounded-sm whitespace-nowrap">
                  UK (28)
                </div>
                <div className="bg-emerald-500 text-white text-[9px] px-1 py-0.5 rounded-sm whitespace-nowrap">
                  DE (15)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Page Button */}
        <Button
          className="w-full flex items-center gap-2 justify-center"
          variant="default"
          onClick={() => window.open(`/${workspaceSlug}`, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Visit Your Page
        </Button>
      </div>
    </div>
  );
}
