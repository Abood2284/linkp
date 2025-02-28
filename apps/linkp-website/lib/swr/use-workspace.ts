// apps/linkp-website/lib/swr/use-workspace.ts

import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../functions/fetcher";
import {
  APIResponse,
  ExpandedWorkspaceData,
  WorkspaceResponse,
} from "@repo/db/types";
import { useSession } from "next-auth/react";

// Cache key generator for consistent keys
const getWorkspaceKey = (slug: string | null, baseUrl: string | undefined) => {
  if (!slug || !baseUrl) return null;
  return `${baseUrl}/api/workspace/${slug}`;
};

export default function useWorkspace() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  let { slug } = useParams() as { slug: string | null };
  const searchParams = useSearchParams();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Session is unauthenticated in useWorkspace SWR");
    },
  });

  if (!slug) {
    slug =
      searchParams.get("slug") ||
      searchParams.get("workspace") ||
      searchParams.get("workspaceSlug");
  }

  const key = getWorkspaceKey(slug, API_BASE_URL);

  const { data, error, isLoading, mutate } = useSWR<WorkspaceResponse>(
    key,
    fetcher,
    {
      dedupingInterval: 5000, // Increased to 5s for better caching
      revalidateOnFocus: false, // Disabled as workspace data rarely changes during focus
      revalidateOnMount: true,
      revalidateIfStale: true,
      keepPreviousData: true, // Keep showing previous data while fetching
      errorRetryCount: 3, // Limit retry attempts
      loadingTimeout: 5000, // 5s timeout
      onError: (err) => {
        console.error(`SWR Error for workspace ${slug}:`, err);
      },
    }
  );

  return {
    workspace: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
