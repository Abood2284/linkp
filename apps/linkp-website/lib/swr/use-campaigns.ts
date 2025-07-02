// apps/linkp-website/lib/swr/use-campaigns.ts

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { fetchWithSession } from "../utils";
import { authFetcher } from "../functions/auth-fetcher";

// Campaign status types
export type CampaignStatus = "active" | "draft" | "completed";

// Creator type for campaigns
export type CampaignCreator = {
  id: string;
  bio?: string | null;
  categories?: string[] | null;
  socialProof?: Record<string, any> | null;
};

// Workspace type for campaigns
export type CampaignWorkspace = {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string | null;
};

// Campaign type definition
export type Campaign = {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  status: CampaignStatus;
  metrics?: {
    clicks?: number;
    conversions?: number;
    revenue?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator?: CampaignCreator | null;
  workspace?: CampaignWorkspace | null;
};

// Proposal type definition
export type Proposal = {
  id: string;
  creatorId: string;
  workspaceId: string;
  title: string;
  url: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "pending" | "accepted" | "rejected" | "expired";
  createdAt: string;
  creator?: CampaignCreator | null;
  workspace?: CampaignWorkspace | null;
};

// Campaign stats type
export type CampaignStats = {
  activeCampaigns: number;
  totalBudget: number;
  availableBudget: number;
  totalSpent: number;
  pendingAllocations: number;
  avgCompletion: number;
};

// Response type for business campaigns
export type BusinessCampaignsResponse = {
  status: number;
  data: {
    stats: CampaignStats;
    activeCampaigns: Campaign[];
    draftCampaigns: Campaign[];
    completedCampaigns: Campaign[];
    proposals: Proposal[];
  };
};

// Cache key generator for consistent keys
const getCampaignsKey = (type: string, baseUrl?: string) => {
  if (!baseUrl) return null;

  if (type === "business") {
    return `${baseUrl}/api/campaigns/business`;
  }

  return null;
};

// Hook to get all campaigns for a business
export function useBusinessCampaigns(shouldFetch: boolean = true) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Session is unauthenticated in useBusinessCampaigns");
    },
  });

  // Only create a key if we should fetch (user is a business)
  const key = shouldFetch ? getCampaignsKey("business", API_BASE_URL) : null;

  console.log(`🚧 [useBusinessCampaigns] key: ${key}`);
  console.log(`🚧 [useBusinessCampaigns] shouldFetch: ${shouldFetch}`);
  console.log(`🚧 [useBusinessCampaigns] Session Status: ${status}`);
  console.log(`🚧 [useBusinessCampaigns] User type: ${session?.user?.userType || 'unknown'}`);

  const { data, error, isLoading, mutate } = useSWR<BusinessCampaignsResponse>(
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
        console.error("SWR Error for business campaigns:", err);
      },
    }
  );

  return {
    campaigns: {
      active: data?.data.activeCampaigns || [],
      draft: data?.data.draftCampaigns || [],
      completed: data?.data.completedCampaigns || [],
    },
    proposals: data?.data.proposals || [],
    stats: data?.data.stats || { activeCampaigns: 0, totalBudget: 0, availableBudget: 0, totalSpent: 0, pendingAllocations: 0, avgCompletion: 0 },
    isLoading: isLoading || status === "loading",
    isError: error,
    mutate,
  };
}

// Helper function to create a new campaign
export async function createCampaign(campaignData: {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  creatorId: string;
  status?: CampaignStatus;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetchWithSession(
    `${API_BASE_URL}/api/campaigns/create`,
    {
      method: "POST",
      body: JSON.stringify(campaignData),
    }
  );

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    throw new Error(error.message || "Failed to create campaign");
  }

  return response.json();
}

// Helper function to update campaign status
export async function updateCampaignStatus(
  campaignId: string,
  status: CampaignStatus
) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetchWithSession(
    `${API_BASE_URL}/api/campaigns/${campaignId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    throw new Error(error.message || "Failed to update campaign status");
  }

  return response.json();
}
