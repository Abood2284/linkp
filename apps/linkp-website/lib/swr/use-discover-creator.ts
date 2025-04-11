import useSWR from "swr";
import { fetcher } from "@/lib/functions/fetcher";

export interface Creator {
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
}

export interface DiscoverCreatorsResponse {
  status: number;
  data: {
    creators: Creator[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface DiscoverCreatorsFilters {
  search?: string;
  category?: string;
  minFollowers?: number;
  maxFollowers?: number;
  location?: string;
  platform?: string;
  page?: number;
  limit?: number;
}

export function useDiscoverCreators(filters: DiscoverCreatorsFilters = {}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {
    search,
    category,
    minFollowers,
    maxFollowers,
    location,
    platform,
    page = 1,
    limit = 9,
  } = filters;

  // Build the query string
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (category) queryParams.append("category", category);
  if (minFollowers !== undefined)
    queryParams.append("minFollowers", minFollowers.toString());
  if (maxFollowers !== undefined)
    queryParams.append("maxFollowers", maxFollowers.toString());
  if (location) queryParams.append("location", location);
  if (platform) queryParams.append("platform", platform);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/business/discover${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<DiscoverCreatorsResponse>(
    url,
    fetcher
  );

  return {
    creators: data?.data.creators || [],
    pagination: data?.data.pagination || { total: 0, page, limit, pages: 0 },
    isLoading,
    isError: error,
    mutate,
  };
}
