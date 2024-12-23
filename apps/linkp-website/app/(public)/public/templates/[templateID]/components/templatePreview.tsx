"use client";

import { useState, useEffect } from "react";
import TemplateLoader from "@/components/shared/template-loader";
import { WorkspaceData } from "@/lib/templates/template-types";

export default function TemplatePreview({
  templateId,
  previewData,
}: {
  templateId: string;
  previewData: WorkspaceData;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-50"></div>
      <div className="relative bg-white bg-opacity-80 backdrop-blur-sm p-6 h-[600px] overflow-y-auto">
        <TemplateLoader
          templateId={templateId}
          data={previewData}
          isPreview={true}
        />
      </div>
    </div>
  );
}
