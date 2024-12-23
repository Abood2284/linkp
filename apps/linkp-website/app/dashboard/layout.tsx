import { MobileNav } from "./components/mobile-nav";
import { Sidebar } from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden border-r md:block">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
