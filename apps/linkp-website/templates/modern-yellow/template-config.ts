// components/templates/modern-yellow/template-config.ts
import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const modernYellowTemplate: BaseTemplateConfig = {
  id: "modern-yellow",
  name: "Modern Yellow",
  description: "Clean and minimal design with focus on content",
  thumbnail: "/templates/modern-yellow/thumbnail.png",
  category: "minimal",
  tags: ["clean", "minimal", "professional"],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["creator", "business"],
  },
  isActive: true,
};

// IMPORTANT: This line is crucial
export default modernYellowTemplate;
