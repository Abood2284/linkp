import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const batcaveTemplateConfig: BaseTemplateConfig = {
  id: "batcave",
  name: "Batcave",
  description:
    "A sleek, dark-themed template inspired by developers and the night. Perfect for showcasing code, projects, and social links.",
  thumbnail: "/templates-bg/batcave-thumb.webp",
  category: "creative",
  tags: ["dark", "developer", "sleek", "modern", "fictional", "batman"],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["creator", "business"],
  },
  isActive: true,
};
