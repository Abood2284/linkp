// apps/linkp-website/app/(public)/public/templates/[templateID]/page.tsx
import { templateRegistry } from "@/lib/templates/registry";
import { WorkspaceData } from "@/lib/templates/template-types"; // Import WorkspaceData
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TemplateInfo from "./components/templateInfo";
import TemplatePreview from "./components/templatePreview";
import {
  harmonSemiBoldCondensedFont,
  neueHaasDisplay,
  newKansas,
} from "@/public/assets/fonts/fonts";
import { DEMO_DATA } from "../components/demo-data";

async function getTemplateData(templateId: string) {
  // You might want to eventually fetch previewData based on the templateId
  // from an API or a database
  const templateConfig = templateRegistry.getTemplateConfig(templateId);
  if (!templateConfig) return null;

  return {
    template: templateConfig,
    previewData: DEMO_DATA, // Use shared DEMO_DATA
  };
}

export default async function TemplatePage({
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
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8 ${neueHaasDisplay.variable} ${harmonSemiBoldCondensedFont.variable} ${newKansas.variable}`}
      style={{ fontFamily: "var(--neue-haas-display-font)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          style={{ fontFamily: "var(--harmon-semi-bold-condensed-font)" }}
        >
          {template.name}
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Suspense
            fallback={
              <div className="h-[600px] bg-gray-200 rounded-3xl animate-pulse"></div>
            }
          >
            <TemplatePreview
              templateId={templateID}
              previewData={previewData}
            />
          </Suspense>
          <TemplateInfo
            template={template}
            accentFontVar={newKansas.variable}
          />
        </div>
      </div>
    </div>
  );
}
