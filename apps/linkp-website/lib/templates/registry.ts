// lib/templates/registry.ts
import darkFitnessTemplate from '@/components/templates/dark-fitness/template-config';
import { BaseTemplateConfig, TemplateId } from './template-types';
import { modernYellowTemplate } from '@/components/templates/modern-yellow/template-config';

// Import all template configs
const templateConfigs = {
  'modern-yellow': modernYellowTemplate,
  'dark-fitness': darkFitnessTemplate,
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
    return Object.values(templateConfigs).filter(template =>
      template.isActive &&
      template.availability.isPublic &&
      template.availability.allowedPlans.includes(plan) &&
      template.availability.allowedUserTypes.includes(userType)
    );
  },

  // Load a template component
  loadTemplate: async (templateId: TemplateId) => {
    const templates: Record<TemplateId, () => Promise<any>> = {
      'modern-yellow': () => import('@/components/templates/modern-yellow'),
      'dark-fitness': () => import('@/components/templates/dark-fitness'),
      // Add more template imports here
    };

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
    const template = templateConfigs[templateId as keyof typeof templateConfigs];
    if (!template || !template.isActive || !template.availability.isPublic) {
      return false;
    }

    return template.availability.allowedPlans.includes(plan) &&
           template.availability.allowedUserTypes.includes(userType);
  },

  // Get all registered template IDs
  getAllTemplateIds: (): TemplateId[] => {
    return Object.keys(templateConfigs);
  },
} as const;

// Export template map type for type safety
export type TemplateMap = typeof templateConfigs;