"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  HelpCircle,
  LinkIcon,
  Loader2,
  Settings,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { WorkspaceDropDown } from "./workspace-drop-down";
import { useWorkspaces } from "@/lib/swr/use-workspaces";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

export function Sidebar() {
  console.log("🎯 Sidebar Render Started");

  const { workspaces, isLoading, isError } = useWorkspaces();
  const { data: session } = useSession();

  useEffect(() => {
    console.log("🔄 Sidebar useEffect", {
      workspacesCount: workspaces.length,
      isLoading,
      hasError: !!isError,
    });
  }, [workspaces, isLoading, isError]);

  if (isLoading) {
    console.log("⌛ Sidebar Loading");
    return (
      <div className="w-60 border-r bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    console.error("❌ Sidebar Error:", isError);
    return (
      <div className="w-60 border-r bg-gray-50 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Error loading workspaces
        </span>
      </div>
    );
  }

  console.log("✅ Sidebar Render Success", {
    workspacesAvailable: workspaces.length > 0,
    workspaceIds: workspaces.map((w) => w.id),
  });

  return (
    <div className="w-60 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="scroll-m-20 text-xl font-nunSans font-semibold tracking-tight">
            Linkp
          </span>
          <div className="flex items-center ml-auto gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="/assets/images/abdul_pfp.jpg"
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
          </div>
        </div>
        <WorkspaceDropDown workspaces={workspaces} />
      </div>

      <div className="px-2">
        <Link
          href="#"
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md bg-accent text-accent-foreground"
        >
          <LinkIcon className="h-4 w-4" />
          Links
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <BarChart2 className="h-4 w-4" />
          Analytics
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
        <div>
          <div className="px-2 mb-2">
            <h3 className="text-sm font-medium">Usage</h3>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm px-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-muted-foreground">Events</span>
              </div>
              <span>0 of 1,000</span>
            </div>
            <div className="flex justify-between text-sm px-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="text-muted-foreground">Links</span>
              </div>
              <span>0 of 25</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 px-2">
            Usage will reset Jan 22, 2025
          </div>
        </div>
        <Button className="w-full" variant="default">
          Get Dub Pro
        </Button>
      </div>
    </div>
  );
}
