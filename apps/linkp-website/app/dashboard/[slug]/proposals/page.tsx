import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  users,
  creators,
  businesses,
  promotionalLinkProposals,
  workspaces,
} from "@repo/db/schema";
import { and, eq } from "drizzle-orm";

import { ProposalsDashboard } from "./proposals-dashboard";
import { db } from "@/server/db";

export default async function ProposalsPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Get the user
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) redirect("/login");

  // Get the workspace based on slug
  const workspace = await db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.slug, params.slug),
      eq(workspaces.userId, user.id)
    ),
  });

  if (!workspace) redirect("/dashboard");

  let userProfile;
  let proposalsData;

  // Load different data based on user type
  if (user.userType === "creator") {
    // Get creator profile
    userProfile = await db.query.creators.findFirst({
      where: eq(creators.userId, user.id),
    });

    if (!userProfile) redirect("/onboarding");

    // Get pending proposals for this creator's workspace
    proposalsData = await db.query.promotionalLinkProposals.findMany({
      where: eq(promotionalLinkProposals.workspaceId, workspace.id),
      orderBy: (proposals) => proposals.createdAt,
      with: {
        business: {
          // Join with the business table to get business info
          // Note: This would need to be implemented in the actual DB setup
          // This is a placeholder for the concept
        },
      },
    });
  } else if (user.userType === "business") {
    // Get business profile
    userProfile = await db.query.businesses.findFirst({
      where: eq(businesses.userId, user.id),
    });

    if (!userProfile) redirect("/onboarding");

    // Get all proposals sent by this business
    proposalsData = await db.query.promotionalLinkProposals.findMany({
      where: eq(promotionalLinkProposals.businessId, userProfile.id),
      orderBy: (proposals) => proposals.createdAt,
      with: {
        creator: {
          // Join with the creator table to get creator info
          // Note: This would need to be implemented in the actual DB setup
        },
        workspace: true,
      },
    });
  } else {
    // Unsupported user type
    redirect("/dashboard");
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="container py-6">
        <ProposalsDashboard
          userType={user.userType}
          proposals={proposalsData || []}
          workspaceId={workspace.id}
          userProfile={userProfile}
        />
      </div>
    </main>
  );
}
