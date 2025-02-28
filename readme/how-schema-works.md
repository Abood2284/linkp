# Linkp Database Schema Documentation

## Overview

Linkp is a modern link-in-bio platform that connects creators with businesses. The database is structured to support two main user types:
1. Creators who want to showcase their content and monetize their audience
2. Businesses looking to collaborate with creators for promotions

## Core Tables and Their Relationships

### 1. Authentication & User Management

#### Users Table (`users`)
This is the main table that stores basic user information:
- `id`: Unique identifier
- `email`: User's email address
- `name`: User's name
- `userType`: Either "creator" or "business"
- Basic timestamps and verification fields

Think of this as the entry point - every user starts here, then branches into either a creator or business profile.

#### Authentication Tables
- `accounts`: Stores OAuth connections (like Google, Twitter login)
- `sessions`: Manages user login sessions

These tables are managed by NextAuth.js and handle all the login/authentication flows.

### 2. Creator System

#### Creators Table (`creators`)
Extended information for users who are creators:
- Links to `users` table through `userId`
- Stores creator-specific information:
  - `bio`: Creator's biography
  - `categories`: Content categories they work in
  - `socialProof`: Their social media statistics
  - `monetizationEnabled`: Whether they accept promotions
  - `promotionRate`: Their rate for promotions

#### Workspaces Table (`workspaces`)
A creator's public profile page:
- Links to `creators` through `userId`
- Contains:
  - `slug`: The custom URL (e.g., linkp.io/johndoe)
  - `name`: Display name
  - `templateId`: Which template they're using
  - `templateConfig`: How they've customized their template

#### Workspace Links Table (`workspaceLinks`)
The actual links shown on a creator's profile:
- Links to `workspaces` through `workspaceId`
- Stores:
  - Different types of links (social, commerce, etc.)
  - Styling information
  - Order of appearance
  - Analytics configuration

### 3. Business System

#### Businesses Table (`businesses`)
Extended information for business users:
- Links to `users` table through `userId`
- Stores:
  - `companyName`: Business name
  - `industry`: Business industry
  - `budget`: Monthly promotion budget
  - Subscription information

#### Promotional Content Table (`promotionalContent`)
Promotional campaigns created by businesses:
- Links to `businesses` through `businessId`
- Contains:
  - Campaign details (title, description, URL)
  - Budget and duration
  - Target requirements (follower count, categories)

#### Promotional Campaigns Table (`promotionalCampaigns`)
Tracks active promotions between businesses and creators:
- Links multiple tables:
  - `promotionalContent`: What's being promoted
  - `creators`: Who's promoting it
  - `workspaces`: Where it's being promoted
- Tracks:
  - Campaign status
  - Pricing
  - Performance metrics

### 4. Analytics System

#### Link Events Table (`linkEvents`)
Raw click and interaction data:
- Links to both `workspaceLinks` and `workspaces`
- Records:
  - When links are clicked
  - Who clicked them
  - Device and location information

#### Aggregated Metrics Table (`aggregatedMetrics`)
Summarized statistics:
- Can be linked to either workspaces or specific links
- Stores:
  - Total clicks
  - Unique visitors
  - Geographic data
  - Device breakdowns

#### Realtime Metrics Table (`realtimeMetrics`)
Current activity tracking:
- Shows active visitors
- Recent clicks
- Updated in real-time

## How Tables Connect (Dependencies)

1. Everything starts with the `users` table
2. Based on `userType`:
   - Creators → `creators` → `workspaces` → `workspaceLinks`
   - Businesses → `businesses` → `promotionalContent`
3. When a promotion is active:
   `businesses` → `promotionalContent` → `promotionalCampaigns` ← `creators`

## Common Data Flows

### For Creators:
1. User signs up → `users` table
2. Chooses creator type → `creators` table
3. Creates workspace → `workspaces` table
4. Adds links → `workspaceLinks` table
5. Gets clicks → `linkEvents` table
6. Views analytics → `aggregatedMetrics` table

### For Businesses:
1. User signs up → `users` table
2. Chooses business type → `businesses` table
3. Creates promotion → `promotionalContent` table
4. Creator accepts → `promotionalCampaigns` table
5. Tracks performance → `aggregatedMetrics` table

## Best Practices When Working with the Schema

1. Always start queries from the `users` table
2. Use transactions when updating multiple tables
3. Check user type before accessing creator/business features
4. Always include proper foreign key references
5. Use the provided TypeScript types for type safety

Remember: Every table has `createdAt` and `updatedAt` timestamps to track when records are modified.

