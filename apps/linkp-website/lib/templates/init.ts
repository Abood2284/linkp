// // apps/linkp-website/lib/templates/init.ts
// import { templateRegistry } from './registry';
// import { BaseTemplateConfig } from './template-types';
// import fs from 'fs';
// import path from 'path';

// let initialized = false;

// export async function initializeTemplates() {
//   if (initialized) return;

//   templateRegistry.initialize();
//   initialized = true;
  
//   return templateRegistry;

//   try {
//     console.log('=== Template Initialization Debug Info ===');
    
//     // Use the correct path relative to the website root
//     const templatesDir = path.join(process.cwd(), 'components', 'templates');
//     console.log('Templates directory:', templatesDir);

//     // Filter out non-template directories
//     const templateDirs = fs.readdirSync(templatesDir)
//       .filter(file => {
//         const stats = fs.statSync(path.join(templatesDir, file));
//         return stats.isDirectory() && file !== 'components';
//       });

//     console.log('Found template directories:', templateDirs);

//     // Import all template configs
//     for (const templateDir of templateDirs) {
//       try {
//         // Use dynamic import with the correct module path
//         const configModule = await import(
//           `@/components/templates/${templateDir}/template-config`
//         );
        
//         console.log(`Loaded config for ${templateDir}:`, configModule.default);
        
//         if (configModule.default) {
//           templateRegistry.register(configModule.default);
//           console.log(`Registered template: ${configModule.default.id}`);
//         }
//       } catch (importError) {
//         console.error(`Failed to load template ${templateDir}:`, importError);
//       }
//     }

//     initialized = true;
//     console.log('Templates registered:', templateRegistry.getAll());
//   } catch (error) {
//     console.error('Template initialization failed:', error);
//     throw error;
//   }
// }