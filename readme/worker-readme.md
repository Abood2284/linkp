# Linkp Worker API Documentation

## Overview
The Linkp Worker is a Cloudflare Worker that serves as the backend API for the Linkp application. It's built using Hono.js and provides various endpoints for managing workspaces, users, analytics, and more.

## Project Structure
```
apps/linkp-worker/
├── src/
│   ├── index.ts           # Main application entry point
│   ├── auth/              # Authentication related code
│   └── routes/            # API route handlers
│       ├── analytics.ts   # Analytics endpoints
│       ├── workspace.ts   # Workspace management
│       ├── user.ts        # User management
│       └── ...
```

## Adding a New API Endpoint

### Step 1: Create Route File
1. Create a new file in `src/routes/` named after your feature (e.g., `analytics.ts`)
2. Basic route file structure:
   ```typescript
   import { Hono } from "hono";
   import { Env } from "../index";
   import { HTTPException } from "hono/http-exception";
   
   const featureRoutes = new Hono<{ Bindings: Env }>();
   
   // Add your routes here
   featureRoutes.get("/path", async (c) => {
     try {
       // Your logic here
       return c.json({ status: 200, data: {} });
     } catch (error) {
       console.error("Error:", error);
       throw new HTTPException(500, { message: "Error message" });
     }
   });
   
   export default featureRoutes;
   ```

### Step 2: Register Routes
1. Open `src/index.ts`
2. Import your route file:
   ```typescript
   import featureRoutes from "./routes/feature";
   ```
3. Register the routes with a base path:
   ```typescript
   app.route("/api/feature", featureRoutes);
   ```

### Step 3: Error Handling
- Always wrap your route handlers in try-catch blocks
- Use `HTTPException` for known error cases
- Log errors appropriately

### Step 4: Database Access
- Access the database through `c.req.db`
- Use the schema from `@repo/db/schema`
- Follow the existing patterns for database queries

### Step 5: Authentication
- Use `withSession` middleware for protected routes
- Access user session data via `c.get('session')`

## Best Practices
1. **Type Safety**
   - Use TypeScript interfaces for request/response data
   - Import types from `@repo/db/types`

2. **Error Handling**
   - Provide meaningful error messages
   - Use appropriate HTTP status codes
   - Log errors with context

3. **Performance**
   - Implement caching where appropriate
   - Use database indexes for frequent queries
   - Keep response payloads minimal

4. **Security**
   - Always validate input data
   - Use CORS appropriately
   - Implement rate limiting for public endpoints

5. **Testing**
   - Write unit tests for new endpoints
   - Test error cases
   - Validate response formats

## Example: Adding an Analytics Endpoint
```typescript
// src/routes/analytics.ts
import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { withSession } from "../auth/session";

const analyticsRoutes = new Hono<{ Bindings: Env }>();

analyticsRoutes.get("/workspace/:id/stats", withSession, async (c) => {
  try {
    const workspaceId = c.req.param("id");
    // Implementation here
    return c.json({ status: 200, data: {} });
  } catch (error) {
    console.error("Analytics error:", error);
    throw new HTTPException(500, { message: "Failed to fetch analytics" });
  }
});

export default analyticsRoutes;
```

## Deployment
- The worker is automatically deployed to Cloudflare
- Environment variables are managed through Cloudflare's dashboard
- Staging and production environments use different configurations
