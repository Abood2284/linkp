// apps/linkp-website/app/(public)/[workspace]/page.tsx

import { Suspense } from "react";
import TemplateLoader from "@/components/shared/template-loader";
import { AnalyticsWrapper } from "./components/analytics-wrapper";
import { AnalyticsDebug } from "@/components/shared/analytics-debug";
import { templateRegistry } from "@/lib/templates/registry";

interface WorkspacePageProps {
  params: { workspace: string };
}

interface WorkspaceApiResponse {
  data: any;
}

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: slug } = await params;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // todo: No API calls should be made directly from the frontend.
  // INstead there should be a SWR that fetches the data from the backend API
  //  But when we create such a SWR, which needs to be CLient side.
  // Error occurs: saying client component cannot be called from server
  // So that is why this page is allowed to make API calls.
  // Fetch from your backend API
  const res = await fetch(`${API_BASE_URL}/api/workspace/${slug}`, {
    // Optionally: cache: 'force-cache' for static, or 'no-store' for always fresh
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });

  if (!res.ok) {
    // Optionally log error
    return <div>Workspace not found</div>;
  }

  const json: WorkspaceApiResponse = await res.json();
  const workspace = json.data;

  if (!workspace) return <div>Workspace not found</div>;

  // Fallback to registry if templateConfig is missing
  const templateConfig =
    workspace.templateConfig ||
    templateRegistry.getTemplateConfig(workspace.templateId);
  if (!templateConfig) {
    console.error(
      `Template ${workspace.templateId} not found for workspace ${workspace.id}`
    );
    return <div>Template not found</div>;
  }

  // Map backend data (ExpandedWorkspaceData) to WorkspaceData for TemplateLoader
  const workspaceData = {
    profile: workspace.profile,
    socials: workspace.socials,
    links: workspace.links.map((link: any) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon || "",
      backgroundColor: link.backgroundColor || "",
      textColor: link.textColor || "",
      order: link.order,
    })),
  };

  return (
    <>
      <AnalyticsWrapper
        workspaceId={workspace.id}
        workspaceSlug={workspace.slug}
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
      <AnalyticsDebug />
    </>
  );
}
