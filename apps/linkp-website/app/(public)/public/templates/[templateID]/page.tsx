import { templateRegistry } from "@/lib/templates/registry";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TemplatePreview from "./components/templatePreview";
import TemplateInfo from "./components/templateInfo";
import { WorkspaceData } from "@/lib/templates/template-types"; // Import WorkspaceData

// Demo data (you might want to eventually fetch this from an API)
const DEMO_DATA: WorkspaceData = {
  profile: {
    image: "/assets/images/abdul_pfp.jpg", // Update with a real image path if you have one
    name: "John Creator",
    bio: "Digital creator passionate about tech, design, and storytelling. Join me on this creative journey!",
  },
  socials: [
    { platform: "twitter", url: "#", order: 0, icon: "twitter" },
    { platform: "instagram", url: "#", order: 1, icon: "instagram" },
    { platform: "youtube", url: "#", order: 2, icon: "youtube" },
    { platform: "linkedin", url: "#", order: 3, icon: "linkedin" },
  ],
  links: [
    {
      id: "1",
      title: "Latest YouTube Tutorial",
      url: "#",
      icon: "video",
      backgroundColor: "#FF0000",
      textColor: "#FFFFFF",
      order: 0,
    },
    {
      id: "2",
      title: "Design Resources",
      url: "#",
      icon: "palette",
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      order: 1,
    },
    {
      id: "3",
      title: "Weekly Newsletter",
      url: "#",
      icon: "mail",
      backgroundColor: "#4A90E2",
      textColor: "#FFFFFF",
      order: 2,
    },
    {
      id: "4",
      title: "Book a Consultation",
      url: "#",
      icon: "calendar",
      backgroundColor: "#34D399",
      textColor: "#FFFFFF",
      order: 3,
    },
  ],
};

async function getTemplateData(templateId: string) {
  // You might want to eventually fetch previewData based on the templateId
  // from an API or a database
  const templateConfig = templateRegistry.getTemplateConfig(templateId);
  if (!templateConfig) return null;

  return {
    template: templateConfig,
    previewData: DEMO_DATA, // For now, use the static DEMO_DATA
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
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
          <TemplateInfo template={template} />
        </div>
      </div>
    </div>
  );
}
