// apps/linkp-website/app/(public)/public/templates/components/templateThumbnail.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { templateRegistry } from "@/lib/templates/registry";
import TemplateLoader from "@/components/shared/template-loader";
import { WorkspaceData } from "@/lib/templates/template-types";
import { DEMO_DATA } from "./demo-data";

export default function TemplateThumbnail({
  templateId,
  scale = 1,
}: {
  templateId: string;
  scale?: number;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fallback to showing static thumbnail image if available
  const templateConfig = templateRegistry.getTemplateConfig(templateId);
  const thumbnailUrl = templateConfig?.thumbnail || "/placeholder.svg";

  // If static thumbnail is a real image, show it
  if (
    thumbnailUrl &&
    thumbnailUrl !== "/placeholder.svg" &&
    (!isMounted || !templateId)
  ) {
    return (
      <div className="w-full h-full relative">
        <Image
          src={thumbnailUrl}
          alt={templateConfig?.name || "Template thumbnail"}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse"></div>;
  }

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <div
        className="w-full h-full"
        style={
          scale !== 1
            ? {
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }
            : {}
        }
      >
        <TemplateLoader
          templateId={templateId}
          data={DEMO_DATA}
          isPreview={true}
        />
      </div>
    </div>
  );
}
