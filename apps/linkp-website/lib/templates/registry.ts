// lib/templates/registry.ts

import { seasideRetreatTemplate } from "@/templates/seaside-retreat/template-config";
import { BaseTemplateConfig, TemplateId } from "./template-types"; // Import TemplateProps

import { goldShineTemplateConfig } from "@/templates/gold-shine/template-config";
import { minimaTemplateConfig } from "@/templates/minima/template-config";
import { batcaveTemplateConfig } from "@/templates/batcave/template-config";

// Import all template configs
const templateConfigs = {
  "seaside-retreat": seasideRetreatTemplate,
  "gold-shine": goldShineTemplateConfig,
  "minima": minimaTemplateConfig,
  "batcave": batcaveTemplateConfig,
  // Add more templates here as they're created
} satisfies Record<TemplateId, BaseTemplateConfig>;

// Type-safe template registry
export const templateRegistry = {
  // Get a template's configuration
  getTemplateConfig: (templateId: TemplateId): BaseTemplateConfig | null => {
    return templateConfigs[templateId as keyof typeof templateConfigs] || null;
  },

  // Get all available templates for a user's plan and type
  getAvailableTemplates: (
    plan: "free" | "creator" | "business",
    userType: "creator" | "business"
  ): BaseTemplateConfig[] => {
    return Object.values(templateConfigs).filter(
      (template) =>
        template.isActive &&
        template.availability.isPublic &&
        template.availability.allowedPlans.includes(plan) &&
        template.availability.allowedUserTypes.includes(userType)
    );
  },

  // Load a template component dynamically
  loadTemplate: async (templateId: TemplateId) => {
    const templates: Record<TemplateId, () => Promise<any>> = {
      "seaside-retreat": () => import("@/templates/seaside-retreat"),
      "gold-shine": () => import("@/templates/gold-shine"),
      "minima": () => import("@/templates/minima"),
      "batcave": () => import("@/templates/batcave"),
      // Add more template imports here
    };

    // const loader = templates[templateId];
    // if (!loader) {
    //   throw new Error(`Template ${templateId} not found`);
    // }

    // const templateModule = await loader();
    // const TemplateComponent = templateModule.default;
    // // Return a function that renders the component with the given props
    // return function (props: TemplateProps) {
    //   return TemplateComponent(props);
    // };
    const loader = templates[templateId];
    if (!loader) {
      throw new Error(`Template ${templateId} not found`);
    }

    return loader();
  },

  // Validate template access
  validateTemplateAccess: (
    templateId: TemplateId,
    plan: "free" | "creator" | "business",
    userType: "creator" | "business"
  ): boolean => {
    const template =
      templateConfigs[templateId as keyof typeof templateConfigs];
    if (!template || !template.isActive || !template.availability.isPublic) {
      return false;
    }

    return (
      template.availability.allowedPlans.includes(plan) &&
      template.availability.allowedUserTypes.includes(userType)
    );
  },

  // Get all registered template IDs
  getAllTemplateIds: (): TemplateId[] => {
    return Object.keys(templateConfigs);
  },
} as const;

// Export template map type for type safety
export type TemplateMap = typeof templateConfigs;
