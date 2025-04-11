// apps/linkp-website/lib/swr/use-creator-profile.ts
import useSWR from "swr";
import { fetcher } from "@/lib/functions/fetcher";

export interface CreatorProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  categories: string[];
  followerCount: number;
  engagementRate: string;
  averageCost: string;
  createdAt: string;
  bio: string;
  location: string;
  availability: {
    status: string;
    percentage: number;
  };
  linkInBio: {
    views: number;
    links: {
      id: string;
      title: string;
      url: string;
      type: string;
      clicks: number;
    }[];
  };
  engagement: {
    rate: number;
    averageComments: number;
    averageLikes: number;
  };
  previousCollaborations: {
    businessName: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    metrics?: {
      clicks?: number;
      conversions?: number;
      revenue?: number;
    };
    // For backward compatibility
    brand?: string;
    date?: string;
  }[];
  metrics?: any[]; // Metrics history
  // Workspace information
  workspaces?: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface CreatorProfileResponse {
  status: number;
  data: {
    creator: CreatorProfile;
  };
}

export function useCreatorProfile(creatorId: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}/api/business/creators/${creatorId}`;

  const { data, error, isLoading, mutate } = useSWR<CreatorProfileResponse>(
    creatorId ? url : null,
    fetcher
  );

  return {
    creator: data?.data.creator,
    isLoading,
    isError: error,
    mutate,
  };
}
