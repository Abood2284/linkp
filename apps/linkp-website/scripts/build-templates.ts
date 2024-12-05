// apps/linkp-website/scripts/build-templates.ts
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { templateRegistry } from '../lib/templates/registry';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildTemplateAssets() {
  console.log('\n🏗️  Starting template build process...\n');

  // Get the project root directory
  const projectRoot = join(__dirname, '..');
  console.log('📂 Project root directory:', projectRoot);

  try {
    // Get all template IDs
    const templates = templateRegistry.getAllTemplateIds();
    console.log(`\n📋 Found ${templates.length} templates:`, templates);

    // Create asset map
    console.log('\n🔨 Building template asset map...');
    const assetMap = templates.reduce((acc, templateId) => {
      const config = templateRegistry.getTemplateConfig(templateId);
      if (!config) {
        console.log(`⚠️  Warning: No config found for template ${templateId}`);
        return acc;
      }

      console.log(`✓ Processing template: ${templateId}`);
      console.log(`  - Name: ${config.name}`);
      console.log(`  - Thumbnail: ${config.thumbnail}`);

      acc[templateId] = {
        thumbnail: config.thumbnail,
      };
      
      return acc;
    }, {} as Record<string, { thumbnail: string }>);

    // Ensure the public directory exists
    const publicDir = join(projectRoot, 'public');
    if (!existsSync(publicDir)) {
      console.log(`\n📁 Creating public directory at: ${publicDir}`);
      mkdirSync(publicDir, { recursive: true });
    } else {
      console.log(`\n📁 Found existing public directory at: ${publicDir}`);
    }

    // Write asset map
    const assetMapPath = join(publicDir, 'template-assets.json');
    console.log(`\n💾 Writing template assets to: ${assetMapPath}`);
    writeFileSync(
      assetMapPath,
      JSON.stringify(assetMap, null, 2)
    );
    console.log('✅ Template assets written successfully');
    
    // Build client template data
    console.log('\n🔨 Building template metadata...');
    const clientTemplateData = templates.reduce((acc, templateId) => {
      const config = templateRegistry.getTemplateConfig(templateId);
      if (!config) return acc;

      console.log(`✓ Processing metadata for: ${templateId}`);
      acc[templateId] = {
        name: config.name,
        description: config.description,
        category: config.category,
        tags: config.tags,
      };
      
      return acc;
    }, {} as Record<string, any>);

    // Write template metadata
    const metadataPath = join(publicDir, 'template-metadata.json');
    console.log(`\n💾 Writing template metadata to: ${metadataPath}`);
    writeFileSync(
      metadataPath,
      JSON.stringify(clientTemplateData, null, 2)
    );
    console.log('✅ Template metadata written successfully');

    // Verify files were created
    const assetFileExists = existsSync(assetMapPath);
    const metadataFileExists = existsSync(metadataPath);

    console.log('\n🔍 Verifying created files:');
    console.log(`- Template assets file exists: ${assetFileExists ? '✅' : '❌'}`);
    console.log(`  Path: ${assetMapPath}`);
    console.log(`- Template metadata file exists: ${metadataFileExists ? '✅' : '❌'}`);
    console.log(`  Path: ${metadataPath}`);

    if (!assetFileExists || !metadataFileExists) {
      throw new Error('One or more output files were not created successfully');
    }

    console.log('\n🎉 Template build process completed successfully!\n');

    // Log file contents for verification
    console.log('📄 Generated template-assets.json content:');
    console.log(JSON.stringify(assetMap, null, 2));
    
    console.log('\n📄 Generated template-metadata.json content:');
    console.log(JSON.stringify(clientTemplateData, null, 2));

  } catch (error) {
    console.error('\n❌ Error building template assets:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the build script
console.log('🚀 Starting template build script...');
buildTemplateAssets().catch((error) => {
  console.error('\n💥 Fatal error in build process:', error);
  process.exit(1);
});