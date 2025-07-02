// app/dashboard/layout.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Open on desktop, closed on mobile initially
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 rounded-full bg-background shadow-md border"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar with overlay for mobile */}
      <div
        className={`
          fixed md:relative z-40 h-full
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        `}
      >
        <Sidebar />
      </div>

      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
