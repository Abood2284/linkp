// apps/linkp-website/lib/swr/use-proposals.ts

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { fetchWithSession } from "../utils";
import { authFetcher } from "../functions/auth-fetcher";

export type ProposalStatus = "pending" | "accepted" | "rejected" | "expired";

export type Proposal = {
  id: string;
  businessId: string;
  creatorId: string;
  workspaceId: string;
  title: string;
  url: string;
  startDate: string;
  endDate: string;
  price: number;
  status: ProposalStatus;
  workspaceLinkId?: string;
  createdAt: string;
  updatedAt: string;
  business?: {
    id: string;
    companyName: string;
    industry?: string;
  };
  creator?: {
    id: string;
    bio?: string;
    socialProof?: Record<string, any>;
  };
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
};

export type ProposalsResponse = {
  status: number;
  data: Proposal[];
};

export type ProposalResponse = {
  status: number;
  data: Proposal;
};

// Cache key generator for consistent keys
const getProposalsKey = (type: string, id?: string, baseUrl?: string) => {
  if (!baseUrl || !type) return null;

  if (type === "workspace" && id) {
    return `${baseUrl}/api/proposals/workspace/${id}`;
  }

  if (type === "business") {
    return `${baseUrl}/api/proposals/business`;
  }

  if (type === "single" && id) {
    return `${baseUrl}/api/proposals/${id}`;
  }

  return null;
};

// Hook to get proposals for a workspace (for creators)
export function useWorkspaceProposals(workspaceId?: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Session is unauthenticated in useWorkspaceProposals");
    },
  });

  // Only create a key if we have both a session and workspaceId
  const key =
    status === "authenticated" && workspaceId
      ? getProposalsKey("workspace", workspaceId, API_BASE_URL)
      : null;

  console.log(`🚧 [useWorkspaceProposals] key: ${key}`);
  console.log(`🚧 [useWorkspaceProposals] Session Status: ${status}`);
  console.log(`🚧 [useWorkspaceProposals] workspaceId: ${workspaceId}`);

  const { data, error, isLoading, mutate } = useSWR<ProposalsResponse>(
    key,
    authFetcher,
    {
      dedupingInterval: 2000, // Reduce to 2 seconds for more frequent updates
      revalidateOnFocus: true, // Enable revalidation when window regains focus
      revalidateOnMount: true,
      revalidateIfStale: true,
      keepPreviousData: true,
      errorRetryCount: 3,
      loadingTimeout: 5000,
      refreshInterval: 10000, // Poll every 10 seconds to keep data fresh
      onError: (err) => {
        console.error(`SWR Error for workspace proposals ${workspaceId}:`, err);
      },
    }
  );

  return {
    proposals: data?.data || [],
    isLoading: isLoading || status === "loading",
    isError: error,
    mutate,
  };
}

// Hook to get all proposals created by the business
export function useBusinessProposals(shouldFetch: boolean = true) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Session is unauthenticated in useBusinessProposals");
    },
  });

  // Only create a key if we should fetch (user is a business)
  const key = shouldFetch ? getProposalsKey("business", undefined, API_BASE_URL) : null;

  console.log(`🚧 [useBusinessProposals] key: ${key}`);
  console.log(`🚧 [useBusinessProposals] shouldFetch: ${shouldFetch}`);
  console.log(`🚧 [useBusinessProposals] Session Status: ${status}`);
  console.log(`🚧 [useBusinessProposals] User type: ${session?.user?.userType || 'unknown'}`);

  const { data, error, isLoading, mutate } = useSWR<ProposalsResponse>(
    key,
    authFetcher,
    {
      dedupingInterval: 2000, // Reduce to 2 seconds for more frequent updates
      revalidateOnFocus: true, // Enable revalidation when window regains focus
      revalidateOnMount: true,
      revalidateIfStale: true,
      keepPreviousData: true,
      errorRetryCount: 3,
      loadingTimeout: 5000,
      refreshInterval: 10000, // Poll every 10 seconds to keep data fresh
      onError: (err) => {
        console.error("SWR Error for business proposals:", err);
      },
    }
  );

  return {
    proposals: data?.data || [],
    isLoading: isLoading || status === "loading",
    isError: error,
    mutate,
  };
}

// Hook to get a single proposal by ID
export function useProposal(proposalId?: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Session is unauthenticated in useProposal");
    },
  });

  const key = proposalId
    ? getProposalsKey("single", proposalId, API_BASE_URL)
    : null;

  const { data, error, isLoading, mutate } = useSWR<ProposalResponse>(
    key,
    authFetcher,
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: true,
      keepPreviousData: true,
      errorRetryCount: 3,
      loadingTimeout: 5000,
      onError: (err) => {
        console.error(`SWR Error for proposal ${proposalId}:`, err);
      },
    }
  );

  return {
    proposal: data?.data,
    isLoading: isLoading || status === "loading",
    isError: error,
    mutate,
  };
}

// Helper functions for proposal actions
export async function createProposal(proposalData: any) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetchWithSession(
    `${API_BASE_URL}/api/proposals/create`,
    {
      method: "POST",

      body: JSON.stringify(proposalData),
    }
  );

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    throw new Error(error.message || "Failed to create proposal");
  }

  return response.json();
}

export async function updateProposalStatus(
  proposalId: string,
  status: "accepted" | "rejected"
) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetchWithSession(
    `${API_BASE_URL}/api/proposals/${proposalId}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    throw new Error(error.message || "Failed to update proposal status");
  }

  return response.json();
}
