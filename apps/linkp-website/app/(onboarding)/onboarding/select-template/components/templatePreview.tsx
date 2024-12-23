import React, { useEffect, useRef, useState } from "react";
import TemplateLoader from "@/components/shared/template-loader";
import { WorkspaceData } from "@/lib/templates/template-types";

type TemplatePreviewProps = {
  templateId: string;
  data: WorkspaceData;
};

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateId,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      // Get the container and content dimensions
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = 390; // Standard mobile width

      // Calculate the scale needed to fit the width
      const newScale = containerWidth / contentWidth;
      setScale(newScale);
    };

    // Calculate initial scale
    calculateScale();

    // Recalculate on window resize
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div
        ref={contentRef}
        style={{
          width: "390px", // Standard mobile width
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          height: "auto",
          minHeight: "100%",
        }}
        className="relative bg-white dark:bg-gray-900"
      >
        <TemplateLoader templateId={templateId} data={data} isPreview={true} />
      </div>
    </div>
  );
};

export default TemplatePreview;
