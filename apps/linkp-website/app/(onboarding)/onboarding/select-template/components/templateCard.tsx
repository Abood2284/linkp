// apps/linkp-website/app/(authenticated)/onboarding/select-template/TemplateCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { BaseTemplateConfig } from "@/lib/templates/template-types";

export function TemplateCard({ template }: { template: BaseTemplateConfig }) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = async () => {
    setIsSelecting(true);
    try {
      const response = await fetch("/api/workspace/update-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      });

      if (!response.ok) throw new Error("Failed to update template");

      // Navigate to next step or dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error selecting template:", error);
      // Show error toast
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Template Preview Image */}
        <div className="aspect-video relative">
          <img
            src={template.thumbnail}
            alt={template.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Template Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{template.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {template.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              Preview
            </Button>
            <Button onClick={handleSelect} disabled={isSelecting}>
              {isSelecting ? "Selecting..." : "Select Template"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <iframe
          src={`/public/templates/${template.id}`}
          className="w-full h-[80vh]"
        />
      </Dialog>
    </>
  );
}
