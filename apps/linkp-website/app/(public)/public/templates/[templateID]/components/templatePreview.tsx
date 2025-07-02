"use client";

import { useState, useEffect } from "react";
import TemplateLoader from "@/components/shared/template-loader";
import { WorkspaceData } from "@/lib/templates/template-types";
import { useRouter } from "next/navigation";

export default function TemplatePreview({
  templateId,
  previewData,
  fullPage = false,
}: {
  templateId: string;
  previewData: WorkspaceData;
  fullPage?: boolean;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handlePreviewClick = () => {
    if (!fullPage) {
      const previewUrl = `/public/templates/${templateId}/preview`;
      router.push(previewUrl);
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${fullPage ? "rounded-none h-screen" : "rounded-3xl h-[600px] shadow-lg transition-all duration-300 hover:shadow-xl"}`}
      onClick={handlePreviewClick}
      style={{ cursor: fullPage ? "default" : "pointer" }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-50 ${fullPage ? "hidden" : ""}`}
      ></div>
      <div
        className={`relative bg-white ${fullPage ? "" : "bg-opacity-80 backdrop-blur-sm p-6"} ${fullPage ? "h-full" : "h-[600px]"} overflow-y-auto`}
      >
        {!fullPage && (
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 z-10 rounded-t-3xl">
            Click to view full-page preview
          </div>
        )}
        <TemplateLoader
          templateId={templateId}
          data={previewData}
          isPreview={true}
        />
      </div>
    </div>
  );
}
