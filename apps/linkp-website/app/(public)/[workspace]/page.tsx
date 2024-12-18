// app/(public)/[workspace]/page.tsx
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getWorkspaceData } from "@/lib/workspace/data-loader";
import { templateRegistry } from "@/lib/templates/registry";
import { workspaces } from "@repo/db/schema";
import { db } from "@/server/db";
import { Suspense } from "react";
import { headers } from "next/headers";
// import { AnalyticsWrapper } from "./components/analytics-wrapper";
import TemplateLoader from "@/components/shared/template-loader";

export const runtime = "edge";

export default async function WorkspacePage(props: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const params = await props.params;

  const { workspaceSlug } = params;

  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const referer = headersList.get("referer");

  // Find the workspace by slug
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, workspaceSlug),
  });

  if (!workspace) {
    notFound();
  }

  // Get template configuration - no more dynamic imports needed
  const templateConfig = templateRegistry.getTemplateConfig(
    workspace.templateId
  );

  if (!templateConfig) {
    console.error(
      `Template ${workspace.templateId} not found for workspace ${workspace.id}`
    );
    notFound();
  }

  // Fetch workspace data
  const workspaceData = await getWorkspaceData(workspace.id);

  // Combine template and workspace configs
  const combinedConfig = {
    ...templateConfig.config,
    ...workspace.templateConfig,
  };

  return (
    // <AnalyticsWrapper
    //   workspaceId={workspace.id}
    //   userAgent={userAgent}
    //   referer={referer}
    // >
    // </AnalyticsWrapper>
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateLoader
        templateId={workspace.templateId}
        data={workspaceData}
        config={combinedConfig}
        isPreview={false}
      />
    </Suspense>
  );
}
