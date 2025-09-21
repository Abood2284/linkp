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
  const segments = useSelectedLayoutSegments();
  const { workspaces, isLoading, isError } = useWorkspaces();
  const { data: session } = useSession();
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceType | null>(null);

  useEffect(() => {
    if (!selectedWorkspace && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace]);

  const workspaceSlug = selectedWorkspace?.slug || workspaces?.[0]?.slug || "";

  const NavLink = ({
    href,
    label,
    icon: Icon,
    active,
  }: {
    href: string;
    label: string;
    icon: any;
    active: boolean;
  }) => (
    <Link
      href={href}
      prefetch
      className={cn(
        "flex items-center gap-2 px-2.5 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  return (
    <div
      className="w-60 h-full flex flex-col"
      style={{ background: "#382F2B", color: "#FBF8EC" }}
    >
      {/* Header */}
      <div className="p-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">Linkp</span>
          <div className="ml-auto flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-white/70" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={session?.user?.image || "/assets/images/abdul_pfp.jpg"}
                    className="object-cover"
                  />
                  <AvatarFallback>U</AvatarFallback>
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
          </div>
        </div>

        {/* Workspace switcher */}
        <div className="mt-3">
          {isLoading ? (
            <div className="h-10 w-full bg-white/10 rounded-md animate-pulse" />
          ) : (
            <WorkspaceDropDown
              workspaces={workspaces}
              onWorkspaceChange={setSelectedWorkspace}
            />
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-3 space-y-1">
        <NavLink
          href={`/dashboard/${workspaceSlug}/links`}
          label="Links"
          icon={LinkIcon}
          active={segments.includes("links")}
        />
        <NavLink
          href={`/dashboard/${workspaceSlug}/analytics`}
          label="Analytics"
          icon={BarChart2}
          active={segments.includes("analytics")}
        />
        <NavLink
          href={`/dashboard/${workspaceSlug}/instagram`}
          label="Instagram"
          icon={Instagram}
          active={segments.includes("instagram")}
        />
        <NavLink
          href={`/dashboard/${workspaceSlug}/proposals`}
          label="Proposals"
          icon={Sparkles}
          active={segments.includes("proposals")}
        />
        <NavLink href="#" label="Settings" icon={Settings} active={false} />
      </nav>

      {/* Footer card + CTA */}
      <div className="mt-auto p-4 space-y-3 border-t border-white/10">
        <div
          className="rounded-lg p-3"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-xs font-medium text-white">
            Performance Snapshot
          </h3>
          <p className="text-[10px] text-white/70 mt-0.5">Today’s activity</p>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-[10px] text-white/70">Views</p>
              <div className="flex items-center">
                <p className="text-sm font-medium text-white">124</p>
                <span
                  className="text-[10px] ml-1 flex items-center"
                  style={{ color: "#D5DF35" }}
                >
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  12%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/70">Clicks</p>
              <div className="flex items-center">
                <p className="text-sm font-medium text-white">57</p>
                <span
                  className="text-[10px] ml-1 flex items-center"
                  style={{ color: "#D5DF35" }}
                >
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  8%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 bg-white/5 rounded-md p-2">
            <p className="text-[10px] font-medium text-white flex items-center mb-1">
              <Map className="h-2.5 w-2.5 mr-1" />
              Top Regions
            </p>
            <div className="flex flex-wrap gap-1">
              <span
                className="text-[9px] px-1 py-0.5 rounded-sm text-black"
                style={{ background: "#D5DF35" }}
              >
                US (42)
              </span>
              <span
                className="text-[9px] px-1 py-0.5 rounded-sm text-black"
                style={{ background: "#D5DF35" }}
              >
                UK (28)
              </span>
              <span
                className="text-[9px] px-1 py-0.5 rounded-sm text-black"
                style={{ background: "#D5DF35" }}
              >
                DE (15)
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full flex items-center gap-2 justify-center"
          onClick={() => window.open(`/${workspaceSlug}`, "_blank")}
          style={{ background: "#D5DF35", color: "#382F2B" }}
        >
          <ExternalLink className="h-4 w-4" />
          Visit Your Page
        </Button>
      </div>
    </div>
  );
}
