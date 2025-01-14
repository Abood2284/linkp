import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TemplatePreview from "./templatePreview";

const previewData = {
  profile: {
    name: "Sarah Anderson",
    bio: "Digital Creator & Content Strategist | Helping brands tell their story through engaging content",
    image: "/preview-assets/profile.jpg", // You'll need to add this image to your public folder
  },
  links: [
    {
      id: "1",
      title: "Latest Blog Post",
      url: "#",
      icon: "book",
      backgroundColor: "#4F46E5",
      textColor: "#FFFFFF",
      order: 1,
    },
    {
      id: "2",
      title: "Digital Marketing Course",
      url: "#",
      icon: "graduation-cap",
      backgroundColor: "#10B981",
      textColor: "#FFFFFF",
      order: 2,
    },
    {
      id: "3",
      title: "Book a Consultation",
      url: "#",
      icon: "calendar",
      backgroundColor: "#6366F1",
      textColor: "#FFFFFF",
      order: 3,
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
    {
      platform: "linkedin",
      url: "#",
      icon: "linkedin",
      order: 3,
    },
  ],
};

export function TemplateCard({
  template,
  onSelect,
}: {
  template: BaseTemplateConfig;
  onSelect: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollControls = useAnimation();

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll animation
  useEffect(() => {
    if (!previewRef.current || !shouldScroll) return;

    const startScroll = async () => {
      const container = previewRef.current;
      if (!container) return;

      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const scrollDistance = scrollHeight - clientHeight;

      if (scrollDistance > 0) {
        await scrollControls.start({
          y: -scrollDistance,
          transition: {
            duration: 8,
            ease: "linear",
          },
        });

        if (shouldScroll) {
          // Reset and repeat
          scrollControls.set({ y: 0 });
          startScroll();
        }
      }
    };

    startScroll();
  }, [shouldScroll, scrollControls]);

  return (
    <motion.div
      className=" rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setShouldScroll(false);
        scrollControls.set({ y: 0 });
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <AspectRatio ratio={3 / 5}>
        {/* Preview Container */}
        <div ref={previewRef} className="h-full w-full overflow-hidden">
          <motion.div animate={scrollControls} className="h-full w-full">
            <TemplatePreview templateId={template.id} data={previewData} />
          </motion.div>
        </div>

        {/* Overlay and Content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-none">
          <Badge
            variant="secondary"
            className="bg-white/90 dark:bg-gray-900/90 text-xs"
          >
            {template.category}
          </Badge>
          {template.availability.allowedPlans.includes("business") && (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white text-xs"
            >
              Premium
            </Badge>
          )}
        </div>

        {/* Template Info */}
        <motion.div
          className="absolute inset-x-3 bottom-3 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        >
          <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-3">
            {template.description}
          </p>
          <motion.button
            className="w-full py-2 px-4 rounded-xl bg-white/90 text-gray-900 text-sm font-medium hover:bg-white"
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
          >
            Choose this design
          </motion.button>
        </motion.div>
      </AspectRatio>
    </motion.div>
  );
}
