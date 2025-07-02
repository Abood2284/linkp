// apps/linkp-website/app/(public)/public/templates/[templateID]/preview/page.tsx
import { templateRegistry } from "@/lib/templates/registry";
import { WorkspaceData } from "@/lib/templates/template-types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TemplatePreview from "../components/templatePreview";
import BackButton from "./back-button";
import { DEMO_DATA } from "../../components/demo-data";

async function getTemplateData(templateId: string) {
  const templateConfig = templateRegistry.getTemplateConfig(templateId);
  if (!templateConfig) return null;

  return {
    template: templateConfig,
    previewData: DEMO_DATA,
  };
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ templateID: string }>;
}) {
  const { templateID } = await params;

  const templateData = await getTemplateData(templateID);

  if (!templateData) {
    notFound();
  }

  const { template, previewData } = templateData;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BackButton templateName={template.name} />
      <Suspense
        fallback={
          <div className="h-screen w-full bg-gray-200 animate-pulse flex items-center justify-center">
            Loading template preview...
          </div>
        }
      >
        <TemplatePreview
          templateId={templateID}
          previewData={previewData}
          fullPage={true}
        />
      </Suspense>
    </div>
  );
}
