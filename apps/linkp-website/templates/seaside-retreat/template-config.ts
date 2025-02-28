import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const seasideRetreatTemplate: BaseTemplateConfig = {
  id: "seaside-retreat",
  name: "Seaside Retreat",
  description:
    "A serene and elegant template inspired by coastal living, featuring a beautiful seaside backdrop with soft, natural colors.",
  category: "creative",
  tags: ["elegant", "nature", "serene", "coastal"],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["regular", "creator", "business"],
  },
  thumbnail: "/assets/images/templates-bg/house_on_edge_LP-4k.jpg",
  isActive: true,
};
