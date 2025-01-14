import { APIResponse } from "@repo/db/types";
import { z } from "zod";

export const WorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters" }),
  workspaceSlug: z
    .string()
    .min(2, { message: "Workspace slug must be at least 2 characters" })
    .max(50, { message: "Workspace slug must be at most 50 characters" })
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Workspace slug can only contain lowercase letters, numbers, and underscores",
    }),
});

export type WorkspaceFormData = z.infer<typeof WorkspaceSchema>;

export async function verifyWorkspaceSlug(slug: string): Promise<{
  isAvailable: boolean;
  message?: string;
}> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/api/workspace/verify-slug`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceSlug: slug }),
    });

    const result: APIResponse = await response.json();
    return {
      isAvailable: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      isAvailable: false,
      message: "Error verifying workspace slug",
    };
  }
}

export function generateWorkspaceSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
