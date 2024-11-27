// src/lib/templates/registry.ts
import { TemplateConfig } from './types';

// Modern Yellow template configuration
export const modernYellowConfig: TemplateConfig = {
  id: "modern-yellow",
  name: "Modern Yellow",
  thumbnail: "/templates/modern-yellow/thumbnail.png",
  description: "A modern, playful template with colorful 3D buttons",
  style: {
    background: "#FFE135",
    buttonStyle: "3d-shadow",
    fontFamily: "Inter",
    socialIconColor: "#000000",
  },
  sections: {
    profile: {
      imageShape: "circle",
      imageSize: "large",
      bioAlignment: "center",
    },
    socials: {
      layout: "horizontal",
      style: "simple-icon",
    },
    links: {
      style: "colorful-3d",
      spacing: "comfortable",
    },
  },
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["regular", "creator", "business"],
  },
};

// Template registry
const templateRegistry: Record<string, TemplateConfig> = {
  "modern-yellow": modernYellowConfig,
  // Add more templates here
};

// Helper functions
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templateRegistry);
}

export function getTemplateById(id: string): TemplateConfig | null {
  return templateRegistry[id] || null;
}

export function getAvailableTemplates(plan: string, userType: string): TemplateConfig[] {
  return getAllTemplates().filter((template) => {
    return (
      template.availability.isPublic &&
      template.availability.allowedPlans.includes(plan as any) &&
    template.availability.allowedUserTypes.includes(userType as any)
    );
  });
}

// Export for type safety
export type TemplateId = keyof typeof templateRegistry;