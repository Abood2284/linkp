// apps/linkp-worker/src/lib/kv-helper.ts
// ! Created for Testing on Dev environment

import { BaseTemplateConfig } from '../../linkp-website/lib/templates/template-types';

export class TemplateKVManager {
  constructor(private kv: KVNamespace) {}

  // Store template metadata
  async storeTemplate(template: BaseTemplateConfig) {
    try {
      await this.kv.put(
        `template:${template.id}:meta`,
        JSON.stringify(template),
        {
          expirationTtl: 60 * 60 * 24 * 7, // 1 week
        }
      );
      console.log(`Stored template ${template.id} in KV`);
      return true;
    } catch (error) {
      console.error(`Failed to store template ${template.id}:`, error);
      return false;
    }
  }

  // Retrieve template metadata
  async getTemplate(templateId: string): Promise<BaseTemplateConfig | null> {
    try {
      const data = await this.kv.get(`template:${templateId}:meta`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to retrieve template ${templateId}:`, error);
      return null;
    }
  }

  // List all templates
  async listTemplates(): Promise<string[]> {
    try {
      const list = await this.kv.list({ prefix: 'template:' });
      return list.keys.map(k => k.name.split(':')[1]);
    } catch (error) {
      console.error('Failed to list templates:', error);
      return [];
    }
  }
}