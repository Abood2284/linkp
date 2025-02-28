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
import { AnalyticsWrapper } from "./components/analytics-wrapper";

export const runtime = "edge";

export default async function WorkspacePage({
  params,
}: {
  params: { workspace: string };
}) {
  const { workspace: workspaceSlug } = await params;

  // Find the workspace by slug
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, workspaceSlug),
  });

  if (!workspace) {
    notFound();
  }

  // Get template configuration
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
  console.log(
    `🩵 linkp.co/${workspaceSlug}/page.tsx : Workspace data:`,
    workspaceData
  );

  return (
    <AnalyticsWrapper
      workspaceId={workspace.id}
      workspaceSlug={workspaceSlug}
      templateId={workspace.templateId}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TemplateLoader
          templateId={workspace.templateId}
          data={workspaceData}
          isPreview={false}
        />
      </Suspense>
    </AnalyticsWrapper>
  );
}
