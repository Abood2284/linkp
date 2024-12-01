// apps/linkp-worker/src/templates.ts
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { BaseTemplateConfig } from '../../../linkp-website/lib/templates/template-types';
import { TemplateKVManager } from '../kv-helper';

interface Env {
  TEMPLATE_KV: KVNamespace;
}

const templateRoutes = new Hono<{ Bindings: Env }>();

// Cache template metadata in KV
templateRoutes.post('/api/templates/sync', async (c) => {
  const templates = await c.req.json<BaseTemplateConfig[]>();
  
  const batch = templates.map(template => ({
    key: `template:${template.id}:meta`,
    value: JSON.stringify(template),
    expirationTtl: 60 * 60 * 24 * 7, // 1 week
  }));

  await c.env.TEMPLATE_KV.put('template:list', JSON.stringify(templates.map(t => t.id)));
  
  // Put each template metadata individually
  for (const item of batch) {
    await c.env.TEMPLATE_KV.put(item.key, item.value, { expirationTtl: item.expirationTtl });
  }

  return c.json({ success: true });
});

// Get template metadata with caching
templateRoutes.get('/api/templates/:id/meta', cache({
  cacheName: 'template-meta',
  cacheControl: 'public, max-age=3600',
}), async (c) => {
  const id = c.req.param('id');
  const cached = await c.env.TEMPLATE_KV.get(`template:${id}:meta`);
  
  if (!cached) {
    return c.json({ error: 'Template not found' }, 404);
  }

  return c.json(JSON.parse(cached));
});

// Template preview endpoint with caching
templateRoutes.get('/api/templates/:id/preview', 
  cache({
    cacheName: 'template-previews',
    cacheControl: 'public, max-age=3600',
  }), 
  async (c) => {
      const templateId = c.req.param('id');
    const kvManager = new TemplateKVManager(c.env.TEMPLATE_KV);

    // Get template data from KV
    const template = await kvManager.getTemplate(templateId);
    
    if (!template) {
      return c.json({ error: 'Template not found' }, 404);
    }

    // Generate preview data (this could also be cached in KV)
    const previewData = {
      profile: {
        image: '/demo-assets/profile.jpg',
        name: 'John Creator',
        bio: 'Welcome to my links page!',
      },
      socials: [
        { platform: 'twitter', url: '#', order: 0, icon: 'twitter' },
        { platform: 'instagram', url: '#', order: 1, icon: 'instagram' },
        { platform: 'youtube', url: '#', order: 2, icon: 'youtube' },
      ],
      links: [
        {
          id: '1',
          title: 'Check out my latest video',
          url: '#',
          icon: 'video',
          backgroundColor: '#FF0000',
          textColor: '#FFFFFF',
          order: 0,
          },
          {
        id: '2',
        title: '50% oFF',
        url: '#',
        icon: 'video',
        backgroundColor: '#FF0000',
        textColor: '#FFFFFF',
        order: 0,
      },
      {
        id: '3',
        title: 'What are you doing?',
        url: '#',
        icon: 'video',
        backgroundColor: '#FF0000',
        textColor: '#FFFFFF',
        order: 0,
      },
        // Add more demo links...
      ],
    };

    // Return combined data
    return c.json({
      template,
      previewData,
    });
  }
);

// Add template analytics
templateRoutes.post('/api/templates/:id/viewed', async (c) => {
  const templateId = c.req.param('id');
  const kvManager = new TemplateKVManager(c.env.TEMPLATE_KV);

  // Increment view count
  const viewKey = `template:${templateId}:views`;
  const views = await c.env.TEMPLATE_KV.get(viewKey);
  await c.env.TEMPLATE_KV.put(
    viewKey, 
    String(Number(views || 0) + 1)
  );

  return c.json({ success: true });
});



export default templateRoutes;