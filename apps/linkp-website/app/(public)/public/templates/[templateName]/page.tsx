// apps/linkp-website/app/(public)/public/templates/[templateName]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { templateRegistry } from "@/lib/templates/registry";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplateProps, WorkspaceData } from "@/lib/templates/template-types";
import { TemplateResponse } from "@/lib/types";

// Create demo data that matches our WorkspaceData type
const DEMO_DATA: WorkspaceData = {
  profile: {
    image: "/demo-assets/profile.jpg",
    name: "John Creator",
    bio: "Welcome to my links page! I'm a content creator sharing insights about technology and design.",
  },
  socials: [
    { platform: "twitter", url: "#", order: 0, icon: "twitter" },
    { platform: "instagram", url: "#", order: 1, icon: "instagram" },
    { platform: "youtube", url: "#", order: 2, icon: "youtube" },
  ],
  links: [
    {
      id: "1",
      title: "Check out my latest video",
      url: "#",
      icon: "video",
      backgroundColor: "#FF0000",
      textColor: "#FFFFFF",
      order: 0,
    },
    {
      id: "2",
      title: "Read my blog",
      url: "#",
      icon: "book",
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      order: 1,
    },
    {
      id: "3",
      title: "Join my newsletter",
      url: "#",
      icon: "mail",
      backgroundColor: "#4A90E2",
      textColor: "#FFFFFF",
      order: 2,
    },
  ],
};

// Helper function to fetch template data from our worker
async function getTemplateFromWorker(templateId: string) {
  // Using environment variable for worker URL
  const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;
  const response = await fetch(
    `${workerUrl}/api/templates/${templateId}/preview`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function TemplatePreviewPage({
  params: { templateName },
}: {
  params: { templateName: string };
}) {
  // First, try to get template data from our worker (which uses KV)
  var templateData = (await getTemplateFromWorker(
    templateName
  )) as TemplateResponse | null;

  if (!templateData) {
    // If not found in KV, fall back to registry (development mode)
    const template = templateRegistry.getById(templateName);
    if (!template) {
      notFound();
    }

    templateData = {
      template,
      previewData: DEMO_DATA,
    };
  }

  // Now we know we have template data, we can dynamically import the component
  const TemplateComponent = dynamic<TemplateProps>(
    () => import(`@/components/templates/${templateName}`),
    {
      loading: () => <div>Loading...</div>,
      // loading: () => <PreviewSkeleton />,
      ssr: true,
    }
  );

  return (
    <div className="min-h-screen">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground p-2">
        <div className="container mx-auto flex items-center justify-between">
          <span>Template Preview: {templateData.template.name}</span>
          <div className="flex gap-2">
            <Badge variant="secondary">{templateData.template.category}</Badge>
            {templateData.template.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Template Preview Container */}
      <div className="container mx-auto py-8">
        {/* Template Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{templateData.template.name}</CardTitle>
            <CardDescription>
              {templateData.template.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {templateData.template.tags.map((tag: string) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Preview */}
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
          <Suspense fallback={<div>Loading...</div>}>
            {/* type */}
            {/* <Suspense fallback={<PreviewSkeleton />}> */}
            <TemplateComponent
              data={templateData.previewData}
              config={templateData.template.config}
              isPreview={true}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
