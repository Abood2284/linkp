import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const premiumGlassTemplate: BaseTemplateConfig = {
  id: "premium-glass",
  name: "Premium Glass",
  description:
    "A sophisticated, modern design with glass morphism effects and smooth animations",
  thumbnail: "/templates/premium-glass/thumbnail.png",
  category: "professional",
  tags: ["premium", "modern", "glass", "animated"],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["regular", "creator", "business"],
  },
  isActive: true,
};

export default premiumGlassTemplate;
