// lib/templates/registry.ts
import vibrantVisionaryTemplate from "@/templates/vibrant-visionary/template-config";
import {
  BaseTemplateConfig,
  TemplateId,
  TemplateProps,
} from "./template-types"; // Import TemplateProps
import { modernYellowTemplate } from "@/templates/modern-yellow/template-config";
import { premiumGlassTemplate } from "@/templates/premium-glass/template-config";

// Import all template configs
const templateConfigs = {
  "modern-yellow": modernYellowTemplate,
  "vibrant-visionary": vibrantVisionaryTemplate,
  "premium-glass": premiumGlassTemplate,
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
    userType: "regular" | "creator" | "business"
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
      "modern-yellow": () => import("@/templates/modern-yellow"),
      "vibrant-visionary": () => import("@/templates/vibrant-visionary"),
      "premium-glass": () => import("@/templates/premium-glass"),
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
    userType: "regular" | "creator" | "business"
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
