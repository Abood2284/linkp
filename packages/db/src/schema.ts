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
    json,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Keep existing auth tables with minor modifications
export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
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
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

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
        };
    }
);

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
);

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  userId: text('user_id').notNull(),
  templateId: text('template_id').notNull(),
  templateConfig: json('template_config').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const templates = pgTable("template", {
    id: text("id").primaryKey(), // matches folder name
    name: text("name").notNull(),
    description: text("description"),
    thumbnail: text("thumbnail"),
    category: text("category").$type<"business" | "creator" | "personal" | "portfolio">(),
    tags: text("tags").array(), // For better filtering
    availability: jsonb("availability").$type<{
        plans: ("free" | "creator" | "business")[];
        userTypes: ("regular" | "creator" | "business")[];
    }>().notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});


export const contentBlocks = pgTable(
    "content_block",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        workspaceId: uuid("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        type: text("type").$type<
            | "standard_link"
            | "shop_link"
            | "booking_link"
            | "social_link"
            | "showcase"
            | "form"
            | "digital_product"
            | "event"
        >().notNull(),
        title: text("title").notNull(),
        description: text("description"),
        url: text("url"),
        icon: text("icon"),
        thumbnail: text("thumbnail"),
        sectionId: text("section_id").notNull(),
        position: integer("position").notNull(),
        isActive: boolean("is_active").default(true),
        config: jsonb("config").$type<{
            openInNewTab?: boolean;
            price?: number;
            currency?: string;
            inStock?: boolean;
            duration?: number;
            availabilitySlots?: Array<{
                day: string;
                times: string[];
            }>;
            eventDate?: string;
            location?: string;
            fields?: Array<{
                type: string;
                label: string;
                required: boolean;
            }>;
            fileUrl?: string;
            downloadLimit?: number;
        }>(),
        startDate: timestamp("start_date", { mode: "date" }),
        endDate: timestamp("end_date", { mode: "date" }),
        createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    },
    (content) => {
        return {
            workspaceBlocks: index("workspace_blocks_idx").on(
                content.workspaceId,
                content.position
            ),
        };
    }
);

// Profile Table
export const workspaceProfiles = pgTable('workspace_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  bio: text('bio'),
  image: text('image_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Social Links Table
export const workspaceSocialLinks = pgTable('workspace_social_links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // twitter, instagram, etc.
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Custom Links Table
export const workspaceLinks = pgTable('workspace_links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  backgroundColor: text('background_color').notNull(),
  textColor: text('text_color').notNull(),
  order: integer('order').notNull(),
  isActive: boolean('is_active').default(true),
  // Optional metadata for enhanced features
  metadata: json('metadata').$type<{
    clicks?: number;
    lastClicked?: string;
    customAttributes?: Record<string, string>;
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Analytics Table (if we want to track detailed analytics)
export const workspaceLinkAnalytics = pgTable('workspace_link_analytics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  linkId: text('link_id')
    .notNull()
    .references(() => workspaceLinks.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at').defaultNow(),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  country: text('country'),
  city: text('city'),
});

// Add this to your schema.ts
export const workspaceAnalytics = pgTable('workspace_analytics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  visitCount: integer('visit_count').notNull().default(0),
  lastVisitedAt: timestamp('last_visited_at').defaultNow(),
  // Additional analytics metrics
  uniqueVisitors: integer('unique_visitors').notNull().default(0),
  averageTimeOnPage: integer('average_time_on_page').default(0),
  bounceRate: integer('bounce_rate').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export type SelectWorkspaceAnalytics = typeof workspaceAnalytics.$inferSelect;
export type InsertWorkspaceAnalytics = typeof workspaceAnalytics.$inferInsert;

// Type inference for all tables
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectAccount = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

export type SelectSession = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

export type SelectVerificationToken = typeof verificationTokens.$inferSelect;
export type InsertVerificationToken = typeof verificationTokens.$inferInsert;

export type SelectAuthenticator = typeof authenticators.$inferSelect;
export type InsertAuthenticator = typeof authenticators.$inferInsert;

export type SelectWorkspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

export type SelectTemplate = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

export type SelectContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = typeof contentBlocks.$inferInsert;

export type SelectAnalytics = typeof workspaceLinkAnalytics.$inferSelect;
export type InsertAnalytics = typeof workspaceLinkAnalytics.$inferInsert;
