// apps/linkp-website/app/(onboarding)/business/layout.tsx
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { BusinessSidebar } from "./components/sidebar";
import { Toaster } from "sonner";

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
      <Toaster />
    </SidebarProvider>
  );
}
