import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const minimaTemplateConfig: BaseTemplateConfig = {
  id: "minima",
  name: "Minima",
  description:
    "A clean, minimalist template with a modern design focusing on simplicity and readability.",
  thumbnail: "/assets/images/templates-bg/minima.webp",
  category: "minimal",
  tags: ["minimal", "clean", "modern", "simple", "elegant"],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["creator", "business"],
  },
  isActive: true,
};
