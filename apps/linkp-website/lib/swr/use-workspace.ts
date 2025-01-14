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
import { create } from "domain";

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

  const url = slug ? `${API_BASE_URL}/api/workspace/${slug}` : null; // Return null when we don't have the userId

  const { data, error, isLoading, mutate } = useSWR<WorkspaceResponse>(
    url,
    fetcher,
    {
      dedupingInterval: 2000,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateIfStale: true,
      // Add these options for better debugging
      onSuccess: (data) => console.log(`SWR Success: ${data}`),
      onError: (err) => console.log(`SWR Error: ${err}`),
    }
  );

  return {
    workspaceData: data?.data,
    id: data?.data?.id,
    name: data?.data?.name,
    slug: data?.data?.slug,
    userId: data?.data?.userId,
    avatarUrl: data?.data?.avatarUrl,
    templateId: data?.data?.templateId,
    templateConfig: data?.data?.templateConfig,
    isActive: data?.data?.isActive,
    createdAt: data?.data?.createdAt,
    updatedAt: data?.data?.updatedAt,
    links: data?.data?.links,
    analytics: data?.data?.analytics,
    error,
    isLoading: status === "loading" || isLoading,
    mutate,
  };
}
