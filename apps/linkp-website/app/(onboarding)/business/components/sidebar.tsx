"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarRail,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Search,
  Target,
  BarChart,
  Wallet,
  MessageSquare,
  Settings,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This is our navigation data
const data = {
  mainNav: [
    {
      title: "Main Menu",
      items: [
        {
          title: "Overview",
          href: "/business/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Discover",
          href: "/business/discover",
          icon: Search,
        },
        {
          title: "Campaigns",
          href: "/business/campaigns",
          icon: Target,
        },
        {
          title: "Analytics",
          href: "/business/analytics",
          icon: BarChart,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Payments",
          href: "/business/payments",
          icon: Wallet,
        },
        {
          title: "Messages",
          href: "/business/messages",
          icon: MessageSquare,
        },
        {
          title: "Settings",
          href: "/business/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function BusinessSidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar className={cn("border-r bg-sidebar", className)} {...props}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">LinkBio Business</h2>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={session?.user?.image || "/assets/images/avatar.jpg"}
                    className="object-cover"
                  />
                  <AvatarFallback>{session?.user?.name?.substring(0, 2) || "U"}</AvatarFallback>
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
                  <Link href="/business/settings">
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
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.mainNav.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinkBio
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
