// apps/linkp-website/app/dashboard/[slug]/proposals/proposals-content.tsx
"use client";


import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useWorkspaces } from "@/lib/swr/use-workspaces";
import {
  useWorkspaceProposals,
  useBusinessProposals,
  updateProposalStatus,
  createProposal,
} from "@/lib/swr/use-proposals";
import { ProposalsDashboard } from "./proposals-dashboard";
import { Loader2 } from "lucide-react";
import useWorkspace from "@/lib/swr/use-workspace";
import { SessionDebug } from "./session-debug";

export default function ProposalsContent({ slug }: { slug: string }) {
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace();
  const { workspaces } = useWorkspaces();
  const [userType, setUserType] = useState<"creator" | "business" | null>(null);

  // Debug logs
  console.log("🧩 Session status:", sessionStatus);
  console.log("🧩 User type:", userType);
  console.log(
    "🧩 Workspace:",
    workspace ? `Loaded (ID: ${workspace.id})` : "Not loaded"
  );
  console.log("🧩 Workspace loading:", isWorkspaceLoading);
  console.log("🧩 Session token available:", !!session?.token);

  // Set user type when session is available
  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user) {
      const type = session.user.userType || "creator";
      console.log("🧩 Setting user type to:", type);
      setUserType(type as "creator" | "business");
    }
  }, [session, sessionStatus]);

  // Now for the proposals - only request when dependencies are ready
  const shouldFetchCreatorProposals =
    userType === "creator" && workspace?.id && !isWorkspaceLoading;
  const shouldFetchBusinessProposals = userType === "business";

  console.log(
    "🧩 Should fetch creator proposals:",
    shouldFetchCreatorProposals
  );
  console.log(
    "🧩 Should fetch business proposals:",
    shouldFetchBusinessProposals
  );

  const {
    proposals: creatorProposals,
    isLoading: isCreatorProposalsLoading,
    isError: creatorError,
    mutate: mutateCreatorProposals,
  } = useWorkspaceProposals(
    shouldFetchCreatorProposals ? workspace?.id : undefined
  );

  const {
    proposals: businessProposals,
    isLoading: isBusinessProposalsLoading,
    isError: businessError,
    mutate: mutateBusinessProposals,
  } = useBusinessProposals(userType === "business");

  // Debug errors
  useEffect(() => {
    if (creatorError) console.error("Creator proposals error:", creatorError);
    if (businessError)
      console.error("Business proposals error:", businessError);
  }, [creatorError, businessError]);

  // Determine which proposals to use
  const proposals =
    userType === "creator" ? creatorProposals : businessProposals;
  const isLoading =
    sessionStatus === "loading" ||
    isWorkspaceLoading ||
    (userType === "creator"
      ? isCreatorProposalsLoading
      : isBusinessProposalsLoading);

  // Handle proposal status update
  const handleUpdateStatus = async (
    proposalId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    try {
      await updateProposalStatus(proposalId, newStatus);
      
      // Refetch data after update - trigger both creator and business proposal revalidation
      // This ensures both sides of the app stay in sync
      mutateCreatorProposals();
      mutateBusinessProposals();
      
      // Also trigger a global revalidation for any other components that might need updating
      // This will help update the business campaigns page when a proposal is accepted
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (API_BASE_URL) {
        // Revalidate business campaigns data
        fetch(`${API_BASE_URL}/api/campaigns/business`, { method: 'GET' })
          .catch(err => console.log('Background revalidation error:', err));
      }
      
      return true;
    } catch (error) {
      console.error("Error updating proposal status:", error);
      return false;
    }
  };

  // Handle creating a new proposal
  const handleCreateProposal = async (proposalData: any) => {
    try {
      await createProposal(proposalData);
      // Refetch data after creation
      mutateBusinessProposals();
      return true;
    } catch (error) {
      console.error("Error creating proposal:", error);
      return false;
    }
  };

  if (isLoading || !userType) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          {sessionStatus === "loading"
            ? "Loading session..."
            : isWorkspaceLoading
              ? "Loading workspace..."
              : "Loading proposals..."}
        </span>
      </div>
    );
  }

  return (
    <>
      <ProposalsDashboard
        userType={userType}
        proposals={proposals}
        workspaceId={workspace?.id || ""}
        workspaces={workspaces}
        onUpdateStatus={handleUpdateStatus}
        onCreateProposal={handleCreateProposal}
      />

      {/* Debug component to help troubleshoot */}
      <SessionDebug />
    </>
  );
}
