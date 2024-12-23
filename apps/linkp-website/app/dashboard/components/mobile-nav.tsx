"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const routes = [
  {
    href: "/dashboard",
    label: "Links",
    active: (pathname: string) => pathname === "/dashboard",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    active: (pathname: string) => pathname === "/dashboard/analytics",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    active: (pathname: string) => pathname === "/dashboard/settings",
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium",
                route.active(pathname)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
