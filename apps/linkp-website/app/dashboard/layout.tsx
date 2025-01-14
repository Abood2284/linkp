// app/dashboard/layout.tsx
import { dmSans, newKansas, nunSans } from "@/public/assets/fonts/fonts";
import { auth } from "../auth";
import { Sidebar } from "./components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userID={session?.user?.id!} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
