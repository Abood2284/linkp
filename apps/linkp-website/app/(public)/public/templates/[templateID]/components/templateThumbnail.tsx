"use client";

import { useState, useEffect } from "react";
import TemplateLoader from "@/components/shared/template-loader";
import { templateRegistry } from "@/lib/templates/registry";
import { WorkspaceData } from "@/lib/templates/template-types";
import { DEMO_DATA } from "../../components/demo-data";

export default function TemplateThumbnail({
  templateId,
}: {
  templateId: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const templateConfig = templateRegistry.getTemplateConfig(templateId);
    setConfig(templateConfig);
  }, [templateId]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <TemplateLoader
        templateId={templateId}
        data={DEMO_DATA}
        isPreview={true}
      />
    </div>
  );
}
