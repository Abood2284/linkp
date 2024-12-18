"use client ";

import { eq } from "drizzle-orm";

import { users } from "@repo/db/schema";
import { auth } from "../auth";
import { BioLinkContent } from "./components/bio-link-content";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Page() {
  const session = await auth();
  const user = session?.user?.id
    ? await db.select().from(users).where(eq(users.id, session.user.id))
    : null;

  if (!user?.[0].onboardingCompleted) {
    redirect("/onboarding/welcome");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <BioLinkContent />
      </div>
    </div>
  );
}
