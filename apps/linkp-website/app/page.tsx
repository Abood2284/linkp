import { Navbar } from "@/components/shared/navbar";
import { eq } from "drizzle-orm";
import { users } from "@repo/db/schema";
import LandingContent from "@/components/shared/landing-content";
import { db } from "@/server/db";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const user = session?.user?.id
    ? await db.select().from(users).where(eq(users.id, session.user.id))
    : null;

  if (!user?.[0].onboardingCompleted) {
    redirect("/onboarding/welcome");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <LandingContent />
    </div>
  );
}
