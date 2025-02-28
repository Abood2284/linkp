// lib/swr/use-workspaces.ts
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { WorkspacesResponse, WorkspaceType } from "@repo/db/types";
import { fetcher } from "../functions/fetcher";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface WorkspacesHook {
  workspaces: WorkspaceType[];
  isLoading: boolean;
  isError: Error | null;
  session: Session | null;
}

// Cache key generator for consistent keys
const getWorkspacesKey = (
  userId: string | undefined,
  baseUrl: string | undefined
) => {
  if (!userId || !baseUrl) return null;
  return `${baseUrl}/api/workspace/all-workspaces/${userId}`;
};

export function useWorkspaces(): WorkspacesHook {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.error("Session is unauthenticated in useWorkspaces");
    },
  });

  const key = getWorkspacesKey(session?.user?.id, API_BASE_URL);

  const {
    data,
    error,
    isLoading: swrLoading,
    mutate: localMutate,
  } = useSWR<WorkspacesResponse>(key, fetcher, {
    dedupingInterval: 5000, // Increased to 5s for better caching
    revalidateOnFocus: false, // Disabled as workspaces rarely change during focus
    revalidateOnMount: true,
    suspense: false,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    keepPreviousData: true, // Keep showing previous data while fetching
    errorRetryCount: 3, // Limit retry attempts
    loadingTimeout: 5000, // 5s timeout
    onError: (err) => console.error("SWR Error:", err),
  });

  const isLoading = status === "loading" || swrLoading;

  return {
    workspaces: data?.data || [],
    isLoading,
    isError: error,
    session,
  };
}

// Global revalidation function
export async function revalidateWorkspaces() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const session = await getSession();
  const key = getWorkspacesKey(session?.user?.id, API_BASE_URL);
  if (key) await mutate(key);
}
