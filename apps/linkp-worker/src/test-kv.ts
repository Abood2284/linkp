// apps/linkp-worker/src/lib/test-kv.ts
// ! Created for Testing on Dev environment

import { BaseTemplateConfig } from '../../linkp-website/lib/templates/template-types';
import { TemplateKVManager } from './kv-helper';

export async function testKVOperations(env: any) {
  const kvManager = new TemplateKVManager(env.TEMPLATE_KV);
  
  // Test template
  const testTemplate : BaseTemplateConfig = {
    id: 'test-template',
    name: 'Test Template',
    description: 'A template for testing KV operations',
    thumbnail: '/test.png',
    category: 'minimal',
    tags: ['test'],
    availability: {
      isPublic: true,
      allowedPlans: ['free'],
      allowedUserTypes: ['regular']
    },
    isActive: true,
    config: {}
  };

  console.log('🧪 Starting KV tests...');

  // Test storing
  console.log('Testing template storage...');
  const stored = await kvManager.storeTemplate(testTemplate);
  console.assert(stored, 'Failed to store template');

  // Test retrieval
  console.log('Testing template retrieval...');
  const retrieved = await kvManager.getTemplate('test-template');
  console.assert(
    retrieved?.id === testTemplate.id,
    'Retrieved template does not match stored template'
  );

  // Test listing
  console.log('Testing template listing...');
  const templates = await kvManager.listTemplates();
  console.assert(
    templates.includes('test-template'),
    'Test template not found in list'
  );

  console.log('✅ KV tests completed');
  return true;
}