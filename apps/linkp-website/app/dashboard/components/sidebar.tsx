"use client";

import { BarChart3, Link2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Links",
    icon: Link2,
    href: "/dashboard",
    active: (pathname: string) => pathname === "/dashboard",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    active: (pathname: string) => pathname === "/dashboard/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    active: (pathname: string) => pathname === "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col gap-4 p-4">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        Link Dashboard
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted",
              route.active(pathname) && "bg-primary text-primary-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
