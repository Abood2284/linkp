// app/(public)/public/templates/[templateName]/page.tsx
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

// Enhanced demo data with more realistic content
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

// Loading placeholder component
function PreviewSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-muted rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

async function getTemplateData(templateId: string) {
  // First try to get from Cloudflare Worker if in production
  if (process.env.NEXT_PUBLIC_WORKER_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORKER_URL}/api/templates/${templateId}/preview`,
        {
          next: { revalidate: 3600 }, // Cache for 1 hour
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

  // Fall back to local registry
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
    <div className="min-h-screen">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground p-2">
        <div className="container mx-auto flex items-center justify-between">
          <span className="font-semibold">
            {template.name} Template Preview
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary">{template.category}</Badge>
            {template.availability.isPublic && (
              <Badge variant="outline">Public</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Template Info and Preview */}
      <div className="container mx-auto py-8 px-4">
        {/* Template Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                Available for: {template.availability.allowedPlans.join(", ")}{" "}
                plans
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Container */}
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
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
  );
}
