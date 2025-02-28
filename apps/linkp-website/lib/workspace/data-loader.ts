// apps/linkp-website/lib/workspace/data-loader.ts
import { eq } from "drizzle-orm";
import { workspaceLinks, workspaces } from "@repo/db/schema";
import { db } from "@/server/db";
import { WorkspaceData } from "../templates/template-types";

export async function getWorkspaceData(
  workspaceId: string
): Promise<WorkspaceData> {
  // Fetch workspace and links in parallel for better performance
  const [workspace, links] = await Promise.all([
    db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    }),
    db.query.workspaceLinks.findMany({
      where: eq(workspaceLinks.workspaceId, workspaceId),
      orderBy: workspaceLinks.order,
    }),
  ]);

  // If no workspace is found, throw an error
  if (!workspace) {
    throw new Error(`Workspace with ID ${workspaceId} not found`);
  }

  // Transform to WorkspaceData format
  return {
    profile: {
      image: workspace.avatarUrl!,
      name: workspace.name,
      bio: workspace.templateConfig?.bio || "", // Assuming bio might be stored in template config
    },
    socials: links
      .filter((link) => link.type === "social")
      .map((social) => ({
        platform: social.platform!,
        url: social.url!,
        order: social.order!,
        icon: social.icon!,
      })),
    links: links
      .filter((link) => link.type !== "social")
      .map((link) => ({
        id: link.id,
        title: link.title!,
        url: link.url!,
        icon: link.icon!,
        backgroundColor: link.backgroundColor!,
        textColor: link.textColor!,
        order: link.order,
        type: link.type, // Added type information
      })),
  };
}
