import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';
import { createMiddleware } from 'hono/factory';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '@repo/db/schema';
import { HTTPException } from 'hono/http-exception';
import userRoutes from './routes/user';
import workspaceRoutes from './routes/workspace';
import templateRoutes from './routes/template';
import devRoutes from './routes/dev';

export type Env = {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'staging' | 'production';
  CORS_ORIGIN: string;
};

// Extend HonoRequest to include database instance
declare module 'hono' {
  interface HonoRequest {
    db: NeonHttpDatabase<typeof schema>;
  }
}

// Create Hono app instance with typed environment
const app = new Hono<{ Bindings: Env }>();

// Error handling middleware
const errorHandler = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }
    
    console.error('Unhandled error:', error);
    
    return c.json({
      status: 'error',
      message: 'Internal Server Error',
      error: c.env.NODE_ENV === 'development' ? error : undefined
    }, 500);
  }
});

// Database injection middleware
export const injectDB = createMiddleware(async (c, next) => {
  try {
    console.log(`Connecting to database...${c.env.DATABASE_URL}`);
    
    // Create database connection
    const sql = neon(c.env.DATABASE_URL);
    // Initialize Drizzle with the connection
    c.req.db = drizzle(sql);
    await next();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new HTTPException(503, { message: 'Database connection failed' });
  }
});

// Enhanced CORS configuration with origin validation
const configureCORS = (env: Env) => {
  const origins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  
  // Create RegExp for preview deployments
  const previewPattern = /^https:\/\/[a-zA-Z0-9-]+\.linkp-website\.pages\.dev$/;
  
  return cors({
    origin: (origin) => {
      // Always allow configured origins
      if (origins.includes(origin)) {
        return origin;
      }
      
      // Check if it's a preview deployment URL
      if (previewPattern.test(origin)) {
        return origin;
      }
      
      // Default to first allowed origin
      return origins[0];
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
  });
};

// Apply CORS middleware
app.use('*', async (c, next) => {
  const corsMiddleware = configureCORS(c.env);
  return corsMiddleware(c, next);
});

// Apply error handling middleware globally
app.use('/*', errorHandler);

// Routes
app.route('/api/user', userRoutes);
app.route('/api/workspace', workspaceRoutes);
app.route('/api/template', templateRoutes);
app.route('/api/dev', devRoutes);

app.get('/', async (c) => {
  return c.json({ status: 'success', message: 'Healthy All System Working' });
});



export default app;