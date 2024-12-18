"use client";
// components/template-loader.tsx
import { useState, useEffect } from "react";
import { TemplateId, TemplateProps } from "@/lib/templates/template-types";
import { templateRegistry } from "@/lib/templates/registry";
import { Loader2 } from "lucide-react";

interface TemplateLoaderProps extends TemplateProps {
  templateId: TemplateId;
}

export default function TemplateLoader({
  templateId,
  ...templateProps
}: TemplateLoaderProps) {
  const [Template, setTemplate] =
    useState<React.ComponentType<TemplateProps> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const templateModule = await templateRegistry.loadTemplate(templateId);
        setTemplate(() => templateModule.default);
      } catch (err) {
        console.error("Failed to load template:", err);
        setError("Failed to load template");
      }
    };

    loadTemplate();
  }, [templateId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!Template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <Template {...templateProps} />;
}
