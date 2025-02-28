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
import { relations } from "drizzle-orm/relations";
import type { AdapterAccountType } from "next-auth/adapters";

// ============================================================================
// ENUMS
// These define the valid values for various categorical fields in our tables
// ============================================================================

export const userTypeEnum = pgEnum("user_type", ["creator", "business"]);

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
  "promotional", // Promotional links from businesses
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

// Promotional link proposal status
export const proposalStatusEnum = pgEnum("proposal_status", [
  "pending",
  "accepted",
  "rejected",
  "expired",
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
  userType: userTypeEnum("user_type").default("creator"),
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
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
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
    templateConfig: json("template_config").$type<Record<string, any>>(), // we donot store this on the DB, template config are static and unique to each template defined in the codebase, maybe in the future we can store the template config in the DB when we have a way to dynamically generate them or store tempaltes on the DB

    // Metadata
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (workspace) => [
    index("workspace_slug_idx").on(workspace.slug),
    index("workspace_user_id_idx").on(workspace.userId),
    index("workspace_template_id_idx").on(workspace.templateId),
  ]
);

// Promotional link proposals table
export const promotionalLinkProposals = pgTable(
  "promotional_link_proposals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Proposal details
    title: text("title").notNull(),
    url: text("url").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    price: integer("price").notNull(), // Price in cents
    status: proposalStatusEnum("status").default("pending"),

    // If accepted, reference to the created workspace link
    workspaceLinkId: text("workspace_link_id").references(
      () => workspaceLinks.id,
      {
        onDelete: "set null",
      }
    ),

    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (proposal) => [
    index("promotional_proposals_business_idx").on(proposal.businessId),
    index("promotional_proposals_creator_idx").on(proposal.creatorId),
    index("promotional_proposals_workspace_idx").on(proposal.workspaceId),
    index("promotional_proposals_status_idx").on(proposal.status),
  ]
);

// Promotional link metrics table for active promotional links
export const promotionalLinkMetrics = pgTable(
  "promotional_link_metrics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceLinkId: text("workspace_link_id")
      .notNull()
      .references(() => workspaceLinks.id, { onDelete: "cascade" }),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),

    // Metrics
    impressions: integer("impressions").default(0),
    clicks: integer("clicks").default(0),
    conversions: integer("conversions").default(0),
    revenue: integer("revenue").default(0), // Revenue in cents

    // Metadata
    lastUpdated: timestamp("last_updated").defaultNow(),
  },
  (metrics) => [
    index("promotional_metrics_link_idx").on(metrics.workspaceLinkId),
    index("promotional_metrics_business_idx").on(metrics.businessId),
  ]
);

// Clean up workspaceLinks table by removing promotional fields that are now in their own tables
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

    // Styling
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
  (link) => [
    index("workspace_links_workspace_id_idx").on(link.workspaceId),
    index("workspace_links_order_idx").on(link.workspaceId, link.order),
    index("workspace_links_platform_idx").on(link.platform),
  ]
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
  (event) => [
    index("link_events_timestamp_idx").on(event.timestamp),
    index("link_events_workspace_idx").on(event.workspaceId),
    index("link_events_link_idx").on(event.linkId),
    index("link_events_visitor_idx").on(event.workspaceId, event.visitorId),
  ]
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
  (metric) => [
    index("aggregated_metrics_time_idx").on(
      metric.workspaceId,
      metric.timeBucket,
      metric.bucketStart
    ),
    index("aggregated_metrics_link_time_idx").on(
      metric.linkId,
      metric.timeBucket,
      metric.bucketStart
    ),
  ]
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

export type SelectPromotionalLinkProposal =
  typeof promotionalLinkProposals.$inferSelect;
export type InsertPromotionalLinkProposal =
  typeof promotionalLinkProposals.$inferInsert;

export type SelectPromotionalLinkMetrics =
  typeof promotionalLinkMetrics.$inferSelect;
export type InsertPromotionalLinkMetrics =
  typeof promotionalLinkMetrics.$inferInsert;

// New creators table
export const creators = pgTable("creators", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default(
    "trial"
  ),
  defaultWorkspace: text("default_workspace"),
  // Creator-specific fields
  bio: text("bio"),
  categories: text("categories").array(),
  socialProof: jsonb("social_proof").$type<{
    followers?: number;
    engagement?: number;
    platforms?: Record<string, number>;
  }>(),
  monetizationEnabled: boolean("monetization_enabled").default(false),
  promotionRate: integer("promotion_rate"), // Rate per promotion in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New businesses table
export const businesses = pgTable("businesses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default(
    "trial"
  ),
  // Business-specific fields
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  website: text("website"),
  size: text("size"),
  budget: integer("budget"), // Monthly budget in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SelectCreator = typeof creators.$inferSelect;
export type InsertCreator = typeof creators.$inferInsert;

export type SelectBusiness = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;

// Add this to your schema.ts file after all table definitions

// Define table relations
export const promotionalLinkProposalsRelations = relations(
  promotionalLinkProposals,
  ({ one }) => ({
    business: one(businesses, {
      fields: [promotionalLinkProposals.businessId],
      references: [businesses.id],
    }),
    creator: one(creators, {
      fields: [promotionalLinkProposals.creatorId],
      references: [creators.id],
    }),
    workspace: one(workspaces, {
      fields: [promotionalLinkProposals.workspaceId],
      references: [workspaces.id],
    }),
    workspaceLink: one(workspaceLinks, {
      fields: [promotionalLinkProposals.workspaceLinkId],
      references: [workspaceLinks.id],
    }),
  })
);

export const businessesRelations = relations(businesses, ({ many }) => ({
  proposals: many(promotionalLinkProposals),
}));

export const creatorsRelations = relations(creators, ({ many }) => ({
  proposals: many(promotionalLinkProposals),
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  proposals: many(promotionalLinkProposals),
  links: many(workspaceLinks),
}));

export const workspaceLinksRelations = relations(workspaceLinks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceLinks.workspaceId],
    references: [workspaces.id],
  }),
}));
