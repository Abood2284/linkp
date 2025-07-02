import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const goldShineTemplateConfig: BaseTemplateConfig = {
  id: "gold-shine",
  name: "Gold Shine",
  description:
    "An elegant, museum-inspired template featuring a curated exhibit style with sophisticated typography and gold accents.",
  thumbnail: "/assets/templates-bg/gold-shine.webp", // Update this with the actual thumbnail path
  category: "professional",
  tags: ["elegant", "museum", "gallery", "premium", "curated"],
  variations: [
    {
      id: "classic-gold",
      name: "Classic Gold",
      description:
        "Elegant museum-inspired template with sophisticated typography and gold accents.",
      thumbnail: "/assets/templates-bg/gold-shine.webp",
      styleConfig: {
        layout: "classic",
        colorScheme: "light",
        style: "minimal",
        backgroundType: "elegant",
      },
    },
  ],
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["creator", "business"],
  },
  isActive: true,
};
