import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  jsonb,
  primaryKey,
  pgEnum,
  index,
  json,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ============================================================================
// ENUMS
// These define the valid values for various categorical fields in our tables
// ============================================================================

export const userTypeEnum = pgEnum("user_type", [
  "regular",
  "creator",
  "business",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "business",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "trial",
]);

export const templateCategoryEnum = pgEnum("template_category", [
  "minimal",
  "creative",
  "professional",
  "animated",
]);

// Enhanced link types for different functionalities
export const linkTypeEnum = pgEnum("link_type", [
  "social", // Social media profiles
  "regular", // Standard web links
  "commerce", // E-commerce/product links
  "booking", // Appointment/event booking
  "newsletter", // Email subscription
  "music", // Music platform links
  "video", // Video content
  "donation", // Fundraising links
  "poll", // Interactive polls
  "file", // Digital downloads
]);

// Time buckets for analytics aggregation
export const timeBucketEnum = pgEnum("time_bucket", [
  "hour",
  "day",
  "week",
  "month",
  "year",
]);

// ============================================================================
// AUTHENTICATION TABLES
// These tables handle user authentication and session management
// ============================================================================

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  userType: userTypeEnum("user_type").default("regular"),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default(
    "trial"
  ),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ============================================================================
// WORKSPACE SYSTEM
// Core tables for managing workspaces and their content
// ============================================================================

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Core workspace fields
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Profile fields (merged from previous workspace_profiles)
    avatarUrl: text("avatar_url"),

    // Template configuration
    templateId: text("template_id").notNull(),
    templateConfig: json("template_config").$type<Record<string, any>>(),

    // Metadata
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (workspace) => ({
    slugIdx: index("workspace_slug_idx").on(workspace.slug),
    userIdx: index("workspace_user_id_idx").on(workspace.userId),
    templateIdx: index("workspace_template_id_idx").on(workspace.templateId),
  })
);

// Unified links table for all link types
export const workspaceLinks = pgTable(
  "workspace_links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Link type and metadata
    type: linkTypeEnum("type").notNull(),
    platform: text("platform"), // For social links (e.g., "instagram", "twitter")

    // Common fields
    title: text("title").notNull(),
    url: text("url").notNull(),
    icon: text("icon"),

    // Styling (can be null for social links that use platform-specific styling)
    backgroundColor: text("background_color"),
    textColor: text("text_color"),

    // Organization
    order: integer("order").notNull(),
    isActive: boolean("is_active").default(true),

    // Advanced features configuration
    config: jsonb("config").$type<{
      // Commerce-specific fields
      price?: number;
      currency?: string;
      inventory?: number;
      variants?: Array<{
        name: string;
        price: number;
        available: boolean;
      }>;

      // Booking-specific fields
      duration?: number;
      availability?: {
        timezone: string;
        slots: Array<{
          start: string;
          end: string;
        }>;
      };

      // Other type-specific configurations
      analyticsEnabled?: boolean;
      customization?: Record<string, any>;
    }>(),

    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (link) => ({
    workspaceIdx: index("workspace_links_workspace_id_idx").on(
      link.workspaceId
    ),
    orderIdx: index("workspace_links_order_idx").on(
      link.workspaceId,
      link.order
    ),
    platformIdx: index("workspace_links_platform_idx").on(link.platform),
  })
);

// ============================================================================
// ANALYTICS SYSTEM
// Tables for tracking and analyzing user engagement
// ============================================================================

// Raw event data collection
export const linkEvents = pgTable(
  "link_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    linkId: text("link_id")
      .notNull()
      .references(() => workspaceLinks.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Event metadata
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .defaultNow(),
    eventType: text("event_type").notNull(), // click, hover, etc.

    // Visitor information
    visitorId: text("visitor_id"), // Hashed identifier
    sessionId: text("session_id"), // Session tracking

    // Geographic and device data
    metadata: jsonb("metadata").$type<{
      country?: string;
      city?: string;
      device?: string;
      browser?: string;
      referrer?: string;
    }>(),
  },
  (event) => ({
    timestampIdx: index("link_events_timestamp_idx").on(event.timestamp),
    workspaceIdx: index("link_events_workspace_idx").on(event.workspaceId),
    linkIdx: index("link_events_link_idx").on(event.linkId),
    visitorIdx: index("link_events_visitor_idx").on(
      event.workspaceId,
      event.visitorId
    ),
  })
);

// Pre-calculated statistics
export const aggregatedMetrics = pgTable(
  "aggregated_metrics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    linkId: text("link_id").references(() => workspaceLinks.id, {
      onDelete: "cascade",
    }),

    // Time period
    timeBucket: timeBucketEnum("time_bucket").notNull(),
    bucketStart: timestamp("bucket_start", { withTimezone: true }).notNull(),
    bucketEnd: timestamp("bucket_end", { withTimezone: true }).notNull(),

    // Aggregated metrics
    metrics: jsonb("metrics").notNull().$type<{
      totalClicks: number;
      uniqueVisitors: number;
      uniqueSessions: number;
      avgTimeOnPage?: number;
      bounceRate?: number;
      topCountries: Array<{ country: string; count: number }>;
      topReferrers: Array<{ referrer: string; count: number }>;
      deviceBreakdown: Record<string, number>;
    }>(),

    lastUpdated: timestamp("last_updated", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (metric) => ({
    timeIdx: index("aggregated_metrics_time_idx").on(
      metric.workspaceId,
      metric.timeBucket,
      metric.bucketStart
    ),
    linkTimeIdx: index("aggregated_metrics_link_time_idx").on(
      metric.linkId,
      metric.timeBucket,
      metric.bucketStart
    ),
  })
);

// Real-time metrics for current activity
export const realtimeMetrics = pgTable("realtime_metrics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  linkId: text("link_id").references(() => workspaceLinks.id, {
    onDelete: "cascade",
  }),

  // Real-time counters
  activeVisitors: integer("active_visitors").notNull().default(0),
  recentClicks: integer("recent_clicks").notNull().default(0),

  lastUpdated: timestamp("last_updated", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// TYPE EXPORTS
// TypeScript type definitions for table schemas
// ============================================================================

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectWorkspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

export type SelectWorkspaceLink = typeof workspaceLinks.$inferSelect;
export type InsertWorkspaceLink = typeof workspaceLinks.$inferInsert;

export type SelectLinkEvent = typeof linkEvents.$inferSelect;
export type InsertLinkEvent = typeof linkEvents.$inferInsert;

export type SelectAggregatedMetric = typeof aggregatedMetrics.$inferSelect;
export type InsertAggregatedMetric = typeof aggregatedMetrics.$inferInsert;

export type SelectRealtimeMetric = typeof realtimeMetrics.$inferSelect;
export type InsertRealtimeMetric = typeof realtimeMetrics.$inferInsert;
