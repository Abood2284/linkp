// apps/linkp-website/app/(authenticated)/onboarding/select-template/TemplateGrid.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { TemplateCard } from "./templateCard";
import { BaseTemplateConfig } from "@/lib/templates/template-types";

export function TemplateGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tags = searchParams.get("tags")?.split(",") || [];

  const { templates, isLoading } = useTemplates({ category, tags });

  if (isLoading) {
    // return <TemplateGridSkeleton />;
    return <div>Loading...</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No templates found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template: BaseTemplateConfig) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
