// apps/linkp-website/app/[workspaceSlug]/page.tsx
import { notFound, usePathname } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { getWorkspaceData } from "@/lib/workspace/data-loader";
import { templateRegistry } from "@/lib/templates/registry";
import {
  workspaceAnalytics,
  workspaceProfiles,
  workspaces,
} from "@repo/db/schema";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { Suspense, useEffect } from "react";
import { analytics } from "@/lib/analytics/analytics-service";

// Add metadata generation
export async function generateMetadata({
  params: { workspaceSlug },
}: {
  params: { workspaceSlug: string };
}) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, workspaceSlug),
  });

  if (!workspace) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const profile = await db.query.workspaceProfiles.findFirst({
    where: eq(workspaceProfiles.workspaceId, workspace.id),
  });

  return {
    title: `${profile?.name || workspace.name} | Linkp`,
    description: profile?.bio || `Check out ${workspace.name}'s links`,
    openGraph: {
      images: [profile?.image || "/default-og-image.png"],
    },
  };
}

// Add analytics wrapper component
 function AnalyticsWrapper({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const referer = headersList.get("referer");

  useEffect(() => {
    analytics.recordPageView({
      workspaceId,
      userAgent,
      referer,
      pathname,
    });
  }, [workspaceId, pathname]);

  return children;
}

export default async function WorkspacePage({
  params: { workspaceSlug },
}: {
  params: { workspaceSlug: string };
}) {
  // First, find the workspace by slug
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, workspaceSlug),
  });

  if (!workspace) {
    notFound();
  }

  // Get the template configuration
  // Parallel data fetching for better performance
  const [template, workspaceData] = await Promise.all([
    templateRegistry.getById(workspace.templateId),
    getWorkspaceData(workspace.id),
  ]);

  if (!template) {
    console.error(
      `Template ${workspace.templateId} not found for workspace ${workspace.id}`
    );
    notFound();
  }

  // Dynamically import the template component
  const TemplateComponent = (
    await import(`@/components/templates/${workspace.templateId}`)
  ).default;

  return (
    <AnalyticsWrapper workspaceId={workspace.id}>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Suspense fallback={<WorkspaceLoadingSkeleton />}> */}
        <TemplateComponent
          data={workspaceData}
          config={{
            ...template.config,
            ...workspace.templateConfig,
          }}
          isPreview={false}
        />
      </Suspense>
    </AnalyticsWrapper>
  );
}

// export async function generateStaticParams() {
//   // Get most visited workspaces by joining with analytics
//   const popularWorkspaces = await db
//     .select({
//       slug: workspaces.slug,
//     })
//     .from(workspaces)
//     .leftJoin(
//       workspaceAnalytics,
//       eq(workspaces.id, workspaceAnalytics.workspaceId)
//     )
//     .orderBy(desc(workspaceAnalytics.visitCount))
//     .limit(100);

//   return popularWorkspaces.map((workspace) => ({
//     workspaceSlug: workspace.slug,
//   }));
// }
