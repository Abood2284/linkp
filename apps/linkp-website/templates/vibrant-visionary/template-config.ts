// components/templates/vibrant-visionary/template-config.ts
import { BaseTemplateConfig } from "@/lib/templates/template-types";

const vibrantVisionaryTemplate: BaseTemplateConfig = {
  id: "vibrant-visionary",
  name: "Vibrant Visionary",
  description:
    "A bold and colorful template showcasing your visual work with dynamic layouts and engaging animations.",
  thumbnail: "/templates/vibrant-visionary/thumbnail.png", // Update with the actual path
  category: "creative",
  tags: ["visual", "portfolio", "animated", "colorful", "modern"],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["regular", "creator", "business"],
  },
  isActive: true,
};

export default vibrantVisionaryTemplate;
