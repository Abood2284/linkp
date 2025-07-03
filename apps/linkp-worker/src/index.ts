// apps//linkp-worker/src/index.ts
// Main entry point for the Linkp worker application
// This file sets up the Hono server, middleware, and routes
import { neon } from "@neondatabase/serverless";
import * as schema from "@repo/db/schema";
import { NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import devRoutes from "./routes/dev";
import templateRoutes from "./routes/template";
import userRoutes from "./routes/user";
import workspaceRoutes from "./routes/workspace";
import onboardingRoutes from "./routes/onboarding";
import analyticsRoutes from "./routes/analytics";
import { KVNamespace } from "@cloudflare/workers-types";
import proposalsRoutes from "./routes/proposals";
import businessRoutes from "./routes/business";
import instagramRoutes from "./routes/instagram";
import campaignsRoutes from "./routes/campaigns";

export interface Env {
  DATABASE_URL: string;
  linkp_instagram_queue_fetching: KVNamespace;
  linkp_default_kv: KVNamespace;
}

// Extend HonoRequest to include database instance
declare module "hono" {
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

    console.error("Unhandled error:", error);

    return c.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: c.env.NODE_ENV === "development" ? error : undefined,
      },
      500
    );
  }
});

// Database injection middleware
export const injectDB = createMiddleware(async (c, next) => {
  try {
    console.log(`Connecting to database...${c.env.DATABASE_URL}`);

    const sql = neon(c.env.DATABASE_URL);

    c.req.db = drizzle({ client: sql, schema });

    await next();
  } catch (error) {
    console.error("Database connection error:", error);
    throw new HTTPException(503, { message: "Database connection failed" });
  }
});

// Enhanced CORS configuration with hardcoded origins
const configureCORS = () => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://linkp-website.pages.dev", // We have abandoned Cloudflare Pages
    "https://linkp.co",
    "https://linkp-website.sayyedabood69.workers.dev",
  ];

  return cors({
    origin: (origin) => {
      // Allow if the origin is in the list of allowed origins
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // Default to the first origin in the list if the origin is null or not specified
      if (!origin) {
        return allowedOrigins[0];
      }

      // Block requests if the origin does not match any of the allowed origins
      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
  });
};

// Apply CORS middleware
app.use("*", async (c, next) => {
  console.log(`[DEBUG] Applying CORS middleware for: ${c.req.url}`);
  const corsMiddleware = configureCORS();
  return corsMiddleware(c, next);
});

// Apply error handling middleware globally
app.use("/*", errorHandler);

// Apply database injection middleware globally
app.use("/api/*", injectDB);

// Routes

/**
 * User Management Routes (/api/user)
 *
 * Responsible for user-related operations including:
 * - User authentication and session management
 * - User profile retrieval (/me endpoint)
 * - User profile updates (name, email, preferences)
 * - Database health checks
 *
 * Key endpoints:
 * - GET /api/user/health: Check database connection health
 * - GET /api/user/me: Retrieve current user's profile information
 * - PATCH /api/user/patch: Update user profile fields
 *
 * Security: Uses session-based authentication via withSession middleware
 */
app.route("/api/user", userRoutes);

/**
 * Workspace Management Routes (/api/workspace)
 *
 * Handles all workspace-related operations including:
 * - Workspace creation, retrieval, and updates
 * - Link management within workspaces (create, update, order)
 * - Slug verification for workspace URLs
 * - Workspace metrics and analytics
 * - Promotional link proposal management
 *
 * Key endpoints:
 * - GET /api/workspace/:workspaceSlug: Retrieve workspace by slug with links and metrics
 * - POST /api/workspace/create: Create a new workspace
 * - POST /api/workspace/verify-slug: Check if a workspace slug is available
 * - GET /api/workspace/all-workspaces/:userId: Get all workspaces for a user
 * - POST /api/workspace/links/create: Create a new link in a workspace
 * - PATCH /api/workspace/links/update: Update an existing workspace link
 * - GET /api/workspace/links/proposal/:linkId: Get promotional proposal data for a link
 *
 * Features optimized caching and parallel queries for performance
 */
app.route("/api/workspace", workspaceRoutes);

/**
 * Template Management Routes (/api/template)
 *
 * Handles template-related operations for workspace customization:
 * - Template retrieval and listing
 * - Template application to workspaces
 * - Template customization and configuration
 *
 * Templates provide pre-designed layouts and styles for user workspaces
 */
app.route("/api/template", templateRoutes);

/**
 * Development and Testing Routes (/api/dev)
 *
 * Provides endpoints for development, testing, and debugging:
 * - Test data generation
 * - Performance testing
 * - Configuration validation
 *
 * These routes are typically disabled in production environments
 */
app.route("/api/dev", devRoutes);

/**
 * User Onboarding Routes (/api/onboarding)
 *
 * Manages the user onboarding flow and experience:
 * - Step tracking and completion
 * - Preference collection
 * - Account setup assistance
 * - Feature introduction
 *
 * Ensures new users are properly guided through initial setup
 */
app.route("/api/onboarding", onboardingRoutes);

/**
 * Business Management Routes (/api/business)
 *
 * Handles business account operations and creator discovery:
 * - Business profile management
 * - Creator discovery and filtering
 * - Detailed creator profile viewing
 * - Business preferences and settings
 * - Collaboration history and metrics
 *
 * Key endpoints:
 * - GET /api/business/creators: Discover and filter creators
 * - GET /api/business/creator/:creatorId: View detailed creator profile
 * - GET /api/business/profile: Retrieve business profile
 * - PATCH /api/business/profile: Update business profile
 *
 * Provides comprehensive creator data including metrics, engagement rates,
 * and previous collaboration history for business decision-making
 */
app.route("/api/business", businessRoutes);

/**
 * Analytics Routes (/api/analytics)
 *
 * Manages collection and retrieval of analytics data:
 * - Link click tracking
 * - Visitor metrics
 * - Conversion tracking
 * - Performance reporting
 * - Aggregated statistics
 *
 * Provides insights into workspace and link performance metrics
 */
app.route("/api/analytics", analyticsRoutes);

/**
 * Promotional Proposal Routes (/api/proposals)
 *
 * Handles the entire promotional collaboration workflow:
 * - Proposal creation by businesses
 * - Proposal listing and filtering
 * - Proposal acceptance/rejection by creators
 * - Automatic promotional link creation upon acceptance
 *
 * Key endpoints:
 * - GET /api/proposals/workspace/:workspaceId: Get proposals for a creator's workspace
 * - GET /api/proposals/business: Get proposals created by a business
 * - GET /api/proposals/:id: Get detailed proposal information
 * - POST /api/proposals/create: Create a new proposal (business only)
 * - PATCH /api/proposals/:id/status: Update proposal status (creator only)
 *
 * Manages the entire lifecycle of business-creator collaborations
 */
app.route("/api/proposals", proposalsRoutes);

/**
 * Instagram Integration Routes (/api/instagram)
 *
 * Handles Instagram account connections and data synchronization:
 * - Account authentication and connection
 * - Profile data retrieval
 * - Metrics synchronization
 * - Media insights
 *
 * Provides Instagram-specific functionality for creator profiles
 */
app.route("/api/instagram", instagramRoutes);

/**
 * Campaign Management Routes (/api/campaigns)
 *
 * Handles business campaign operations:
 * - Campaign creation and management
 * - Campaign status updates
 * - Campaign metrics and performance tracking
 * - Proposal integration
 *
 * Key endpoints:
 * - GET /api/campaigns/business: Get all campaigns for a business
 * - POST /api/campaigns/create: Create a new campaign
 * - PATCH /api/campaigns/:id/status: Update campaign status
 *
 * Provides comprehensive campaign management for business accounts
 */
app.route("/api/campaigns", campaignsRoutes);

app.get("/", async (c) => {
  return c.json({ status: 200, message: "Healthy All System Working" });
});

export default app;
