# Linkp Database Schema Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Authentication System](#authentication-system)
4. [Workspace System](#workspace-system)
5. [Template System](#template-system)
6. [Content Management](#content-management)
7. [Analytics System](#analytics-system)
8. [Type Safety & Enums](#type-safety--enums)
9. [Database Design Decisions](#database-design-decisions)
10. [Common Operations](#common-operations)

## Overview

Linkp is a modern link-in-bio platform built with a code-first template approach. The database schema is designed to support:
- Multi-workspace user accounts
- Code-first templates
- Dynamic content blocks
- Detailed analytics tracking
- Multi-tier subscription system

## Core Concepts

### User Types
- **Regular**: Basic users
- **Creator**: Content creators and influencers
- **Business**: Business accounts with advanced features

### Subscription Tiers
- **Free**: Basic features
- **Pro**: Advanced features for creators
- **Business**: Enterprise-level features

### Template Categories
- **Business**: Business-focused templates
- **Creator**: Creator/influencer templates
- **Personal**: Personal branding templates
- **Portfolio**: Portfolio showcase templates

## Authentication System

### Users Table
```typescript
export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").unique(),
    userType: userTypeEnum('user_type'),
    subscriptionTier: subscriptionTierEnum('subscription_tier'),
    subscriptionStatus: subscriptionStatusEnum('subscription_status')
});
```

Connected tables:
- `accounts`: OAuth connections
- `sessions`: Active sessions
- `authenticators`: Passkey authentication
- `verificationTokens`: Email verification

Key Features:
- NextAuth.js integration
- Multi-provider authentication
- Passkey support
- Email verification

## Workspace System

### Workspaces Table
```typescript
export const workspaces = pgTable('workspaces', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    userId: text('user_id').notNull(),
    templateId: text('template_id').notNull(),
    templateConfig: json('template_config')
});
```

Relationships:
- Belongs to: `users`
- Has one: `workspaceProfiles`
- Has many: 
  - `contentBlocks`
  - `workspaceSocialLinks`
  - `workspaceLinks`
  - `workspaceMetrics`

Key Features:
- Unique slugs for public URLs
- Template configuration storage
- Multiple workspaces per user

## Template System

### Templates Table
```typescript
export const templates = pgTable("template", {
    id: text("id").primaryKey(),
    category: templateCategoryEnum('category'),
    availability: jsonb("availability"),
    isActive: boolean("is_active")
});
```

Key Features:
- Code-first approach
- Template files stored in codebase
- Database only stores metadata
- Plan-based availability control

## Content Management

### Content Blocks
```typescript
export const contentBlocks = pgTable("content_block", {
    type: contentBlockTypeEnum('type'),
    config: jsonb("config"),
    position: integer("position")
});
```

Block Types:
- Standard links
- Shop links
- Booking links
- Social links
- Showcases
- Forms
- Digital products
- Events

Features:
- Ordered positioning
- Type-specific configurations
- Flexible JSON config storage

### Workspace Links
```typescript
export const workspaceLinks = pgTable('workspace_links', {
    title: text('title'),
    url: text('url'),
    order: integer('order')
});
```

Features:
- Custom styling
- Click tracking
- Order management

## Analytics System

### Metrics Table
```typescript
export const workspaceMetrics = pgTable('workspace_metrics', {
    pageViews: integer('page_views'),
    uniqueVisitors: integer('unique_visitors'),
    totalTimeSpent: integer('total_time_spent'),
    bounceCount: integer('bounce_count')
});
```

Analytics Coverage:
- Page views
- Unique visitors
- Time on page
- Bounce rates
- Link clicks
- Geographic data

## Type Safety & Enums

### User Types
```typescript
export const userTypeEnum = pgEnum('user_type', [
    'regular', 
    'creator', 
    'business'
]);
```

### Subscription Tiers
```typescript
export const subscriptionTierEnum = pgEnum('subscription_tier', [
    'free', 
    'pro', 
    'business'
]);
```

### Content Block Types
```typescript
export const contentBlockTypeEnum = pgEnum('content_block_type', [
    'standard_link',
    'shop_link',
    // ... other types
]);
```

## Database Design Decisions

### ID Strategy
- Text-based UUIDs for all tables
- Compatible with NextAuth.js
- Distribution-friendly
- Non-sequential for security

### Indexing Strategy
```typescript
(workspace) => ({
    slugIdx: index('workspace_slug_idx').on(workspace.slug),
    userIdx: index('workspace_user_id_idx').on(workspace.userId)
})
```

Key Indexes:
- Workspace slugs
- User lookups
- Template filtering
- Analytics queries

### Soft Deletion
- `isActive` flags used instead of hard deletes
- Preserves referential integrity
- Allows for recovery

## Common Operations

### Workspace Creation
1. Insert user record
2. Create workspace
3. Initialize workspace profile
4. Set up default metrics

### Template Assignment
1. Check template availability
2. Update workspace template
3. Initialize template config

### Analytics Tracking
1. Update raw metrics
2. Track link clicks
3. Aggregate daily stats

### Content Management
1. Insert content blocks
2. Maintain block order
3. Update configurations

## Best Practices

1. Always use transactions for multi-table operations
2. Leverage indexes for frequent queries
3. Use parameterized queries
4. Implement proper error handling
5. Follow soft deletion patterns
6. Maintain referential integrity
7. Use type-safe operations

## Schema Migrations

When making schema changes:
1. Create new migration file
2. Update type definitions
3. Test data migrations
4. Update related services
5. Deploy with zero downtime

