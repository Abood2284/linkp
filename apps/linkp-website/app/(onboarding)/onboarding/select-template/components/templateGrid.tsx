// components/templates/template-grid.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { templateRegistry } from "@/lib/templates/registry";
import TemplateLoader from "@/components/shared/template-loader";

// Sample data structure we'll show in templates before user data is added
const previewData = {
  profile: {
    name: "John Doe",
    bio: "Digital Creator & Tech Enthusiast",
    image: "/images/placeholder-avatar.png",
  },
  links: [
    {
      id: "1",
      title: "My Portfolio",
      url: "#",
      icon: "briefcase",
      backgroundColor: "#4F46E5",
      textColor: "#FFFFFF",
      order: 1,
    },
    {
      id: "2",
      title: "Latest Blog Post",
      url: "#",
      icon: "book",
      backgroundColor: "#10B981",
      textColor: "#FFFFFF",
      order: 2,
    },
  ],
  socials: [
    {
      platform: "twitter",
      url: "#",
      icon: "twitter",
      order: 1,
    },
    {
      platform: "instagram",
      url: "#",
      icon: "instagram",
      order: 2,
    },
  ],
};

export function TemplateGrid() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Get all available templates for the current user
  // Note: In production, you'd pass the user's plan and type
  const templates = templateRegistry.getAvailableTemplates("free", "regular");

  const handleTemplateSelect = async (templateId: string) => {
    try {
      setSelectedTemplate(templateId);

      // Create workspace with selected template
      const response = await fetch("/api/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          // You might want to collect workspace name from the user
          // or generate a temporary one that they can change later
          name: "My Workspace",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      const workspace = await response.json();

      // Redirect to the new workspace
      // router.push(`/dashboard/${workspace.slug}`);
    } catch (error) {
      console.error("Error selecting template:", error);
      // You should show an error toast here
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="relative overflow-hidden">
          {selectedTemplate === template.id && (
            <div className="absolute top-2 right-2 z-10">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
          )}

          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>

          <CardContent className="h-64 overflow-hidden border rounded-md">
            <div className="transform scale-[0.4] origin-top">
              <TemplateLoader
                templateId={template.id}
                data={previewData}
                config={template.config}
                isPreview={true}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Button
              onClick={() => handleTemplateSelect(template.id)}
              disabled={selectedTemplate !== null}
            >
              Select Template
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
