## Project Requirements Document (PRD)

### Project Name: Linkp

---

## Table of Contents

1. [Introduction](#introduction)
2. [Vision and Goals](#vision-and-goals)
3. [App Flow](#app-flow)
4. [Core Features](#core-features)
5. [Technical Architecture](#technical-architecture)
6. [Tech Stack](#tech-stack)
7. [In Scope vs. Out of Scope](#in-scope-vs-out-of-scope)
8. [Data Structure](#data-structure)
9. [Future Features](#future-features)
10. [Appendices](#appendices)

---

## Introduction

**Linkp** is a modern link-in-bio platform designed specifically for creators and businesses on social media platforms. While it mirrors existing solutions like Linktree, Linkp introduces several enhancements aimed at capturing and dominating the market through niche targeting, advanced analytics, and innovative collaboration features.

---

## Vision and Goals

### Vision
To empower creators and businesses by providing an analytics-driven link-in-bio tool that fosters engagement, collaboration, and monetization opportunities.

### Goals
- **Simplicity and Usability**: Deliver an intuitive and easy-to-navigate interface that ensures users can quickly set up and manage their links.
- **Advanced Analytics**: Provide real-time and comprehensive analytics to help users optimize their online presence.
- **Monetization Opportunities**: Enable users to seamlessly integrate sales, bookings, and other revenue-generating features.
- **Scalability**: Build a robust platform that can scale with user growth and evolving feature requirements.
- **Market Differentiation**: Stand out in the market through unique features like influencer collaboration tools.

---

## App Flow

1. **User Onboarding**
   - Users can sign up and start using the app immediately without any invitation.
   - Simple onboarding process to get users up and running quickly.

2. **Workspace Creation**
   - Users can create up to three workspaces.
   - Each workspace is treated as a separate entity with its own metrics and links.

3. **Template Selection**
   - Users choose from niche-specific templates.
   - Real-time preview of selected templates with dummy data.

4. **Link Management**
   - Users add various types of links (e.g., social, commerce, booking).
   - Links can be organized within each workspace.

5. **Analytics Dashboard**
   - Real-time and aggregated analytics available for each workspace.
   - Users can view metrics like clicks, unique visitors, and engagement rates.

6. **Monetization Integration**
   - Users can integrate sales, bookings, and other monetization features.
   - Advanced options like affiliate link management and subscription services.

7. **Community and Collaboration**
   - Influencers can showcase collaborations and engage with brands.
   - Community hub for networking and participating in challenges.

---

## Core Features

### 1. Targeting Specific Niches
- **Influencer Segmentation**: Templates and tools tailored for different influencer types (e.g., fashion, tech, fitness).

### 2. Enhanced Influencer Collaboration Features
- **Collab Showcase**: Verified portfolio pages highlighting past brand collaborations.
- **Case Study Section**: Metrics-driven case studies showcasing engagement and conversion statistics.
- **Endorsement Badges**: Verified badges to enhance credibility.

### 3. Selling Options for Influencers
- **Sales Sections**: Specialized formats like “Shop the Look,” “Booking,” and “Exclusive Content.”
- **Digital Storefronts & Inventory**: Manage and track digital or physical product sales.

### 4. User-Friendly Analytics for Influencers
- **Real-Time Analytics**: Visually engaging dashboards with metrics like click-through rates and follower growth.
- **Advanced Insights**: Device/browser breakdowns and referrer analysis.
- **Public/Private Metrics Sharing**: Control visibility of analytics data.

### 5. One Simple Payment Plan Unlocking All Features
- **All-Inclusive Plan**: Single comprehensive plan with access to all features.
- **Transparent Value Statement**: Clear pricing with no hidden tiers or additional fees.

### 6. Innovative Leaderboards & Recognition
- **Leaderboard Rankings**: Monthly leaderboards for different categories to encourage engagement.
- **Reward System**: Perks for top performers, such as increased visibility and spotlight features.

---

## Technical Architecture

### Frontend
- **Framework**: NextJS 15
- **Language**: TypeScript
- **Styling**: TailwindCSS, ShadCN UI, Radix UI
- **State Management**: Next.js App Router, SWR for data fetching

### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM

### Core Features
- **Authentication**: NextAuth.js integration with multi-provider support.
- **Templates**: Code-first templates with dynamic content blocks.
- **Analytics**: In-depth tracking with real-time and aggregated metrics.
- **Monetization**: Integrated sales, bookings, and affiliate link management.
- **Collaboration Tools**: Features for showcasing collaborations and engaging with brands.

---

## Tech Stack

- **Frontend**:
  - NextJS 15
  - TypeScript
  - TailwindCSS
  - ShadCN UI
  - Radix UI
  - Tailwind Aria

- **Backend**:
  - Cloudflare Workers
  - Hono Framework
  - PostgreSQL (Neon)
  - Drizzle ORM

- **Other Tools**:
  - NextAuth.js for authentication
  - SWR for data fetching
  - Zod for form validation
  - GitHub Actions for CI/CD
  - Cloudflare Pages for deployment

---

## In Scope vs. Out of Scope

### In Scope
- **User Authentication**: Secure sign-up and login functionalities.
- **Workspace Management**: Create and manage multiple workspaces.
- **Template Selection**: Choose niche-specific templates.
- **Link Management**: Add and organize various types of links.
- **Basic Analytics**: Track visits and simple metrics.
- **Monetization Features**: Integrate sales and booking options.
- **Community Features**: Collaboration showcase and influencer hub.

### Out of Scope
- **Advanced Customization**: In-depth theme customization beyond pre-built templates.
- - **Enterprise Features**: Team collaboration tools and advanced admin controls.
- **Internationalization**: Support for multiple languages at initial launch.
- **Mobile Applications**: Native mobile apps for iOS and Android.
- **Advanced Security Features**: Beyond basic authentication and GDPR compliance.

---

## Data Structure

Refer to the [Linkp Database Schema Documentation](readme/how-schema-works.md) for comprehensive details on the database structure, tables, and relationships.

---

## Future Features

1. **Referral Programs and Tracking Creator Earnings**
2. **Custom Domain Support**
3. **Influencer Matchmaking and Brand Partnership Portal**
4. **Two-Factor Authentication and Enhanced Security Measures**

---

## Appendices

### Appendix A: Link Types

````typescript
export const expandedLinkTypeEnum = pgEnum("link_type", [
  "social",
  "regular",
  "commerce",
  "booking",
  "newsletter",
  "music",
  "video",
  "donation",
  "poll",
  "file",
]);
````

### Appendix B: Template Registry Example

````typescript:lib/templates/registry.ts
export const templateRegistry = {
  getTemplateConfig: (templateId: TemplateId) => {...},
  getAvailableTemplates: (plan, userType) => {...},
  loadTemplate: async (templateId) => {...}
}
````

### Appendix C: Deployment Workflows

Refer to [GitHub Workflows Documentation](readme/github-workflows.md) for details on deployment pipelines and automation.

---

**Last Updated**: April 27, 2024

---
