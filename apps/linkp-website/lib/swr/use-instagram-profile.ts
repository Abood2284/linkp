"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { fetcher } from "../functions/fetcher";
import { authFetcher } from "../functions/auth-fetcher";

// Define the expected response structure for Instagram metrics
interface InstagramProfile {
  username: string;
  instagramUserId: string;
  followerCount: number;
  followingCount: number; // Added for follows_count
  mediaCount: number; // Added for media_count
  accountType: string; // Added for account_type
  profilePictureUrl?: string; // Added for profile_picture_url
  name?: string; // Added for name
  lastSyncedAt: string;
  engagementRate: number;
  profileViews: number;
  reach: number;
  impressions: number;
  insights?: {
    basicInfo: {
      id?: string;
      username?: string;
      name?: string;
      profile_picture_url?: string;
      followers_count?: number;
      follows_count?: number;
      media_count?: number;
      account_type?: string;
    };
    interactionMetrics: any[];
    reachBreakdown: any[];
    views: any[];
    followerDemographics: any[];
    engagedDemographics: any[];
    content: any[];
  };
  estimatedEarnings?: {
    perPost: number;
    monthly: number;
  };
  growth?: {
    followers: number;
    engagement: number;
  };
  websiteClicks?: number;
}

interface InstagramProfileResponse {
  success: boolean;
  data?: InstagramProfile;
  error?: string;
  connected?: boolean;
  message?: string;
  // Add other potential top-level fields
}

const getInstagramProfileKey = (
  slug: string | null,
  baseUrl: string | undefined
) => {
  if (!slug || !baseUrl) return null;
  return `${baseUrl}/api/instagram/profile/${slug}`;
};

export default function useInstagramProfile() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = useParams();
  const slug = params.slug as string | null;

  const key = getInstagramProfileKey(slug, API_BASE_URL);

  const { data, error, isLoading, mutate } = useSWR<InstagramProfileResponse>(
    key,
    authFetcher,
    {
      shouldRetryOnError: false, // Don't retry on 404 etc.
      revalidateOnFocus: false, // Data might not change frequently on focus
    }
  );

  // Log the complete raw data to the console for debugging
  console.log(`🔄 Instagram SWR : URL : ${key}`);
  console.log("📊 RAW INSTAGRAM DATA:", data);
  if (data?.data?.insights) {
    console.log(
      "📊 RAW INTERACTION METRICS:",
      data.data.insights.interactionMetrics
    );
    console.log("📊 RAW REACH BREAKDOWN:", data.data.insights.reachBreakdown);
    console.log("📊 RAW VIEWS DATA:", data.data.insights.views);
    console.log(
      "📊 RAW FOLLOWER DEMOGRAPHICS:",
      data.data.insights.followerDemographics
    );
    console.log(
      "📊 RAW ENGAGED DEMOGRAPHICS:",
      data.data.insights.engagedDemographics
    );
    console.log("📊 RAW CONTENT DATA:", data.data.insights.content);
  }
  // Add more detailed logging for debugging
  console.log("🔄 Instagram connection status for workspace:", {
    workspace: slug,
    dataSuccess: data?.success,
    dataConnected: data?.connected,
    hasData: !!data?.data,
    errorStatus: error?.status,
    isLoading,
  });

  return {
    profile: data?.data, // Return the nested data object
    error,
    isLoading,
    mutate,
    // Add helper booleans based on the main hook's state
    isConnected:
      !isLoading &&
      data?.success === true &&
      data?.connected === true &&
      !!data?.data,
    isConnectionCheckLoading: isLoading,
    isNotConnected:
      !data ||
      data?.success === false ||
      data?.connected === false ||
      error?.status === 404,
    fetchError: error && error.status !== 404, // Any error other than 404
  };
}
