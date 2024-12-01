// apps/linkp-website/lib/templates/init.ts
import { templateRegistry } from './registry';
import { BaseTemplateConfig } from './template-types';
import fs from 'fs';
import path from 'path';

let initialized = false;

export async function initializeTemplates() {
  if (initialized) return;

  try {
    console.log('Initializing templates...');
    const templatesDir = path.resolve(process.cwd(), 'components/templates');
    console.log(`Templates directory: ${templatesDir}`);
    
    const templateFiles = fs.readdirSync(templatesDir);
    console.log(`Found directories: ${templateFiles}`);

    for (const file of templateFiles) {
      const configPath = path.join(templatesDir, file, 'template-config.ts');
      console.log(`Checking path: ${configPath}`);
      
      if (fs.existsSync(configPath)) {
        console.log(`Importing config from ${configPath}`);
        const configModule = await import(configPath);
        const config = configModule.default;
        templateRegistry.register(config);
      } else {
        console.warn(`Config file not found: ${configPath}`);
      }
    }

    // Sync with Cloudflare KV if we're in production
    if (process.env.NODE_ENV === 'production') {
      await fetch('/api/templates/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateRegistry.getAll())
      });
    }

    initialized = true;
    console.log('Template initialization completed successfully');
  } catch (error) {
    console.error('Failed to initialize templates:', error);
    throw error;
  }
}