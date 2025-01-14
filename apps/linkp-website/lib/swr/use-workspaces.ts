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

export function useWorkspaces(): WorkspacesHook {
  console.log("🚀 useWorkspaces Hook Started");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("❌ Session is unauthenticated in useWorkspaces");
    },
  });

  console.log("📡 Session State:", {
    status,
    userId: session?.user?.id,
    API_BASE_URL,
  });

  const url = session?.user?.id
    ? `${API_BASE_URL}/api/workspace/all-workspaces/${session.user.id}`
    : null;

  console.log("🔗 SWR URL:", url);

  const {
    data,
    error,
    isLoading: swrLoading,
    mutate: localMutate,
  } = useSWR<WorkspacesResponse>(url, fetcher, {
    dedupingInterval: 1000,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    suspense: false,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    onSuccess: (data) => {
      console.log("✅ SWR Success:", {
        workspaces: data?.data?.map((w) => ({ id: w.id, slug: w.slug })),
        count: data?.data?.length,
        url,
      });
    },
    onError: (err) => console.log("❌ SWR Error:", err),
  });

  const isLoading = status === "loading" || swrLoading;

  console.log("🔄 Hook State:", {
    dataExists: !!data,
    errorExists: !!error,
    isLoading,
    workspacesCount: data?.data?.length,
  });

  return {
    workspaces: data?.data || [],
    isLoading,
    isError: error,
    session,
  };
}

// Utility function to revalidate workspaces list from anywhere
export async function revalidateWorkspaces() {
  console.log("🔄 Starting revalidateWorkspaces");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const session = await getSession();

  console.log("👤 Revalidate Session:", {
    exists: !!session,
    userId: session?.user?.id,
  });

  if (!session?.user?.id) {
    console.error("❌ No session found for revalidation");
    return;
  }

  const key = `${API_BASE_URL}/api/workspace/all-workspaces/${session.user.id}`;
  console.log("🔑 Revalidating with key:", key);

  try {
    await mutate(key, undefined, {
      revalidate: true,
      populateCache: true,
      rollbackOnError: true,
    });
    console.log("✅ Revalidation successful");
  } catch (error) {
    console.error("❌ Revalidation failed:", error);
  }
}
