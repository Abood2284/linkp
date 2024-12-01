// apps/linkp-website/lib/workspace/data-loader.ts
import { eq } from 'drizzle-orm';
import { workspaceLinks, workspaceProfiles, workspaceSocialLinks } from '@repo/db/schema';
import { db } from '@/server/db';
import { WorkspaceData } from '../templates/template-types';

export async function getWorkspaceData(workspaceId: string): Promise<WorkspaceData> {
  // Fetch all data in parallel for better performance
  const [profile, socials, links] = await Promise.all([
    db.query.workspaceProfiles.findFirst({
      where: eq(workspaceProfiles.workspaceId, workspaceId),
    }),
    db.query.workspaceSocialLinks.findMany({
      where: eq(workspaceSocialLinks.workspaceId, workspaceId),
      orderBy: workspaceSocialLinks.order,
    }),
    db.query.workspaceLinks.findMany({
      where: eq(workspaceLinks.workspaceId, workspaceId),
      orderBy: workspaceLinks.order,
    }),
  ]);

  // Transform to WorkspaceData format
  return {
    profile: {
      image: profile?.image || '/default-profile.png',
      name: profile?.name || 'Unnamed',
      bio: profile?.bio || '',
    },
    socials: socials.map(social => ({
      platform: social.platform,
      url: social.url,
      order: social.order,
      icon: social.icon,
    })),
    links: links.map(link => ({
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon,
      backgroundColor: link.backgroundColor,
      textColor: link.textColor,
      order: link.order,
    })),
  };
}