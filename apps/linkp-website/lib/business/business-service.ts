// apps/linkp-website/lib/business/business-service.ts
import { fetchWithSession } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Define types for API responses
export interface PromotionalLink {
  id: string;
  title: string;
  url: string;
  promotionStatus: string;
  createdAt: string;
  clicks: number;
  promotionPrice: string;
}

export interface PromotionalLinksResponse {
  links: PromotionalLink[];
}

export interface AnalyticsData {
  totalClicks: number;
  clicksChange: number;
  totalConversions: number;
  conversionsChange: number;
  revenue: number;
  revenueChange: number;
  ctr: number;
  ctrChange: number;
  dailyClicks: {
    date: string;
    clicks: number;
  }[];
}

export interface ProposalData {
  title: string;
  url: string;
  promotionStartDate: string;
  promotionEndDate: string;
  promotionPrice: string;
  creatorId: string;
  businessId: string;
}

export const BusinessService = {
  // Company profile and onboarding
  saveCompanyProfile: async (data: any) => {
    const response = await fetchWithSession(
      `${API_BASE_URL}/api/business/profile`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = (await response.json()) as { message?: string };
      throw new Error(error.message || "Failed to save company profile");
    }

    return response.json();
  },

  // Promotional links
  getPromotionalLinks: async (
    businessId: string
  ): Promise<PromotionalLinksResponse> => {
    const response = await fetchWithSession(
      `${API_BASE_URL}/api/business/promotional-links?businessId=${businessId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch promotional links");
    }

    return response.json();
  },

  // Analytics
  getLinkAnalytics: async (linkId: string): Promise<AnalyticsData> => {
    const response = await fetchWithSession(
      `${API_BASE_URL}/api/business/promotional-links/${linkId}/analytics`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    return response.json();
  },

  // Proposals
  sendPromoProposal: async (proposal: ProposalData) => {
    const response = await fetchWithSession(
      `${API_BASE_URL}/api/business/promotional-links/propose`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal),
      }
    );

    if (!response.ok) {
      const error = (await response.json()) as { message?: string };
      throw new Error(error.message || "Failed to submit proposal");
    }

    return response.json();
  },

  // Update link status
  updateLinkStatus: async (linkId: string, status: string) => {
    const response = await fetchWithSession(
      `${API_BASE_URL}/api/business/promotional-links/${linkId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update link status");
    }

    return response.json();
  },
};
