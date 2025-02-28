"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { BusinessSidebar } from "./components/sidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <BusinessSidebar />
      <div className="h-full w-full">{children}</div>
    </SidebarProvider>
  );
}
