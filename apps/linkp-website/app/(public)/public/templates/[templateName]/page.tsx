import { Suspense } from "react";
import { notFound } from "next/navigation";
import { templateRegistry } from "@/lib/templates/registry";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BaseTemplateConfig,
  WorkspaceData,
} from "@/lib/templates/template-types";
import TemplateLoader from "@/components/shared/template-loader";
import { TemplatePreviewData } from "@/lib/types";
import { Sparkles } from "lucide-react";

// Demo data remains the same
const DEMO_DATA: WorkspaceData = {
  profile: {
    image: "/assets/images/abdul_pfp.jpg",
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

function PreviewSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-muted rounded-xl" />
      <div className="space-y-4 max-w-md mx-auto">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}

// getTemplateData function remains the same
async function getTemplateData(templateId: string) {
  if (process.env.NEXT_PUBLIC_WORKER_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORKER_URL}/api/templates/${templateId}/preview`,
        {
          next: { revalidate: 3600 },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data as TemplatePreviewData;
      }
    } catch (error) {
      console.error("Failed to fetch from worker:", error);
    }
  }

  const templateConfig = templateRegistry.getTemplateConfig(templateId);
  if (!templateConfig) return null;

  return {
    template: templateConfig,
    previewData: DEMO_DATA,
  };
}

export default async function TemplatePreviewPage({
  params: { templateName },
}: {
  params: { templateName: string };
}) {
  const templateData = await getTemplateData(templateName);

  if (!templateData) {
    notFound();
  }

  const { template, previewData } = templateData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Banner */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="font-semibold tracking-tight font-paragraph">
                {template.name} Preview
              </h1>
            </div>
            <div className="flex items-center gap-3 font-pargraph">
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
              {template.availability.isPublic && (
                <Badge variant="secondary" className="text-xs">
                  Public
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Template Information */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-background/50 backdrop-blur-sm border-muted">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-heading">
                {template.name}
              </CardTitle>
              <CardDescription className="text-base font-sub-heading">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-xs capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Available for:</span>
                  {template.availability.allowedPlans.map((plan, index) => (
                    <Badge
                      key={plan}
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {plan}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Container */}
        <div className="max-w-md mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-muted transition-transform hover:scale-[1.02] duration-300">
            <Suspense fallback={<PreviewSkeleton />}>
              <TemplateLoader
                templateId={templateName}
                data={previewData}
                config={template.config}
                isPreview={true}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
