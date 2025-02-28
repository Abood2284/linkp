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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <Sidebar className={cn("border-r bg-sidebar", className)} {...props}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">LinkBio Business</h2>
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
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
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://avatar.iran.liara.run/public" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-muted-foreground">
              john@example.com
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
