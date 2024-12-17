"use client";

import { Bell, Search } from "lucide-react";
import { eq } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { users } from "@repo/db/schema";
import { auth } from "@/app/auth";
import { db } from "@/server/db";

export async function Header() {
  const session = await auth();
  const user = session?.user?.id
    ? await db.select().from(users).where(eq(users.id, session.user.id))
    : null;
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold">{user?.[0].name}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[300px] pl-8"
          />
        </div>
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
