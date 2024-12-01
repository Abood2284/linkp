// apps/linkp-worker/src/routes/dev.ts
// ! Create for Testing on Dev environment
import { Env, Hono } from 'hono';
import { testKVOperations } from '../test-kv';

const devRoutes = new Hono<{ Bindings: Env }>();

devRoutes.get('/test-kv', async (c) => {
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: 'Not available in production' }, 403);
  }

  try {
    await testKVOperations(c.env);
    return c.json({ success: true, message: 'KV tests completed successfully' });
  } catch (error) {
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

export default devRoutes;