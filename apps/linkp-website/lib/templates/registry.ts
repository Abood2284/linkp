// lib/templates/registry.ts
import { get } from 'http';
import { BaseTemplateConfig, TemplateCategory } from './template-types';

class TemplateRegistry {
  private templates: Map<string, BaseTemplateConfig> = new Map();
  private static instance: TemplateRegistry;

  private constructor() {}

  static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  register(template: BaseTemplateConfig) {
    if (this.templates.has(template.id)) {
      console.warn(`Template ${template.id} already registered. Skipping.`);
      return;
    }
    this.templates.set(template.id, template);
  }

  getAll(): BaseTemplateConfig[] {
    return Array.from(this.templates.values());
  }

  getById(id: TemplateId): BaseTemplateConfig | null {
    return this.templates.get(id) || null;
  }

  getAvailable(plan: string, userType: string): BaseTemplateConfig[] {
    return this.getAll().filter((template) => (
      template.isActive &&
      template.availability.isPublic &&
      template.availability.allowedPlans.includes(plan as "free" | "creator" | "business") &&
      template.availability.allowedUserTypes.includes(userType as "regular" | "creator" | "business")
    ));
  }

  getPreviewUrl(templateId: string): string {
    return `/public/templates/${templateId}`;
  }

  getAbsolutePreviewUrl(templateId: string): string {
    return `https://linkp.co/public/templates/${templateId}`;
  }

   getByCategory(category: TemplateCategory): BaseTemplateConfig[] {
    return this.getAll().filter(template => template.category === category);
  }

  getByTags(tags: string[]): BaseTemplateConfig[] {
    return this.getAll().filter(template => 
      tags.some(tag => template.tags.includes(tag))
    );
  }

  // Get available templates by category and plan
  getAvailableByCategory(
    category: TemplateCategory,
    plan: string,
    userType: string
  ): BaseTemplateConfig[] {
    return this.getAvailable(plan, userType)
      .filter(template => template.category === category);
  }

}

export const templateRegistry = TemplateRegistry.getInstance();
export type TemplateId = string;