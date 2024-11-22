import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  uuid,
  jsonb,
  primaryKey,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Keep existing auth tables with minor modifications
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // New fields for user categorization and subscription
  userType: text("user_type").$type<"regular" | "creator" | "business">().default("regular"),
  subscriptionTier: text("subscription_tier").$type<"free" | "pro" | "business">().default("free"),
  subscriptionStatus: text("subscription_status").$type<"active" | "inactive" | "trial">().default("trial"),
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
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => {
    return {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    }
  }
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)



// Workspace represents a user's link-in-bio page
export const workspaces = pgTable("workspace", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // URL slug
  displayName: text("display_name").notNull(),
  description: text("description"),
  // Selected template and its configuration
  templateId: text("template_id").notNull(),
  templateConfig: jsonb("template_config").$type<{
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    backgroundColor?: string;
    buttonStyle?: string;
  }>().default({}),
  // SEO and metadata
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  favicon: text("favicon"),
  // Social media links shown at the top
  socialLinks: jsonb("social_links").$type<Array<{
    platform: string;
    url: string;
    icon?: string;
    enabled: boolean;
  }>>().default([]),
  // Analytics and visibility settings
  isPublic: boolean("is_public").default(true),
  allowIndexing: boolean("allow_indexing").default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Pre-defined templates available in the system
export const templates = pgTable("template", {
  id: text("id").primaryKey(), // e.g., "modern-split", "classic-stack"
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  // Template structure and styling
  layout: jsonb("layout").$type<{
    sections: Array<{
      id: string;
      type: "featured" | "social" | "links" | "custom";
      maxItems?: number;
      style?: Record<string, string>;
    }>;
    styling: {
      defaultColors: string[];
      defaultFonts: string[];
      customCSS?: string;
    };
  }>().notNull(),
  // Template availability based on subscription
  minTier: text("min_tier").$type<"free" | "pro" | "business">().default("free"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Content blocks represent different types of links/content
export const contentBlocks = pgTable("content_block", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  // Block type and configuration
  type: text("type").$type<
    "standard_link" | 
    "shop_link" | 
    "booking_link" | 
    "social_link" | 
    "showcase" | 
    "form" | 
    "digital_product" | 
    "event"
  >().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  icon: text("icon"),
  thumbnail: text("thumbnail"),
  // Block positioning and visibility
  sectionId: text("section_id").notNull(), // References template section
  position: integer("position").notNull(),
  isActive: boolean("is_active").default(true),
  // Block-specific configuration
  config: jsonb("config").$type<{
    // Standard link config
    openInNewTab?: boolean;
    // Shop link config
    price?: number;
    currency?: string;
    inStock?: boolean;
    // Booking link config
    duration?: number;
    availabilitySlots?: Array<{
      day: string;
      times: string[];
    }>;
    // Event link config
    eventDate?: string;
    location?: string;
    // Form link config
    fields?: Array<{
      type: string;
      label: string;
      required: boolean;
    }>;
    // Digital product config
    fileUrl?: string;
    downloadLimit?: number;
  }>(),
  // Scheduling
  startDate: timestamp("start_date", { mode: "date" }),
  endDate: timestamp("end_date", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
}, (content) => {
  return {
    workspaceBlocks: index("workspace_blocks_idx").on(content.workspaceId, content.position),
    
  };
});

// Analytics for tracking link performance
export const analytics = pgTable("analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  blockId: uuid("block_id")
    .references(() => contentBlocks.id, { onDelete: "set null" }),
  // Visit information
  visitorId: text("visitor_id"), // Anonymized identifier
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  device: text("device"),
  country: text("country"),
  // Event data
  eventType: text("event_type").$type<"view" | "click" | "conversion">(),
  metadata: jsonb("metadata"), // Additional event-specific data
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
}, (analytics) => {
  return {
    workspaceAnalytics: index("workspace_analytics_idx").on(analytics.workspaceId, analytics.timestamp),
    blockAnalytics: index("block_analytics_idx").on(analytics.blockId, analytics.timestamp),
  };
});


