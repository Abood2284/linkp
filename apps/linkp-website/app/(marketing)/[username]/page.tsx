import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { UserProfile } from "./_components/user-profile";
import { users } from "@repo/db/schema";
import { db } from "@/server/db";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const user = await db.query.users.findFirst({
    where: eq(users.username, params.username),
    with: {
      customization: true,
      achievements: true,
      collaborations: true,
      links: true,
    },
  });

  const isPreview = searchParams.preview === "true";
  if (!user || (!user.onboardingCompleted && !isPreview)) notFound();

  return <UserProfile user={user} isPreview={isPreview} />;
}
