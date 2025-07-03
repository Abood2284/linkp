# Instagram API Integration: Technical Documentation

## Remember:
In development you are using ngrok to get webhook requests sent your `localhost:8787` backend
To get request on your main domain you need to make changes in these places
- `// apps/linkp-website/app/dashboard/[slug]/instagram/page.tsx` -      `constructInstagramAuthUrl` Function `redirectUri`
- `// apps/linkp-worker/src/routes/instagram.ts` - `webhook` endpoint `redirectUri`
- On your Facebook Dashboard -> API Setup with Instagram Login -> update the `configure webhooks` part
- Update your Embed URL -> Business login settings -> OAuth redirect URIs should be updated

## 1. Overview

This document provides a comprehensive explanation of the Instagram API integration within the Linkp platform. It covers the complete workflow from user authorization through the OAuth flow, to data storage, API endpoints, and background processing. This integration enables creators to connect their Instagram accounts to enhance their profiles with verified follower counts and engagement metrics.

## 2. Architecture Components

The Instagram integration consists of several interconnected components:

- **Frontend Connection Interface**: Located at `dashboard/[slug]/instagram/page.tsx`
- **Backend API Endpoints**: Implemented in `apps/linkp-worker/src/routes/instagram.ts`
- **Database Schema**: Tables for storing connection credentials and metadata
- **Background Processing**: Asynchronous data fetching using Cloudflare KV
- **Webhook Handler**: For receiving real-time updates from Instagram

## 3. OAuth Authorization Flow

### 3.1 User Initiates Connection

When a creator clicks "Connect Instagram" in the dashboard, the application:

1. Generates a unique state parameter combining workspace slug and a random UUID
2. Stores this state in localStorage for verification
3. Constructs an Instagram authorization URL with required scopes
4. Redirects the user to Instagram's authorization page

```javascript
const constructInstagramAuthUrl = () => {
  const clientId = "28798183066492843";
  const redirectUri = encodeURIComponent("https://your-callback-url.com/api/instagram/callback");
  const scope = encodeURIComponent("instagram_business_basic,instagram_business_manage_messages,...");
  
  // Create composite state for security
  const workspace = getCurrentWorkspaceSlug();
  const randomState = crypto.randomUUID();
  const compositeState = `${workspace}:${randomState}`;
  localStorage.setItem("instagram_auth_state", compositeState);
  
  return `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${encodeURIComponent(compositeState)}`;
};
```

### 3.2 OAuth Callback Processing

After the user authorizes access, Instagram redirects to our callback URL with:

1. `code`: The authorization code
2. `state`: The composite state parameter we provided

Our backend processes this callback by:

1. Validating the state parameter
2. Retrieving the workspace from the state parameter
3. Finding the user ID associated with the workspace
4. Exchanging the authorization code for a short-lived access token
5. Exchanging the short-lived token for a long-lived token (valid for 60 days)
6. Storing the connection details in the database

## 4. Data Storage

### 4.1 Database Schema

The Instagram integration uses two primary tables:

```typescript
// Instagram connection table - stores user connection details
export const instagramConnections = pgTable("instagram_connections", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  instagramUserId: text("instagram_user_id").notNull(),
  username: text("username"),
  accessToken: text("access_token").notNull(),
  tokenExpiresAt: text("token_expires_at"),
  followerCount: integer("follower_count"),
  lastSyncedAt: text("last_synced_at"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Instagram webhook events table - stores incoming webhook data
export const instagramWebhookEvents = pgTable("instagram_webhook_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  eventData: json("event_data").$type<Record<string, any>>(),
  processed: boolean("processed").default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
```

### 4.2 Token Management

The system stores long-lived access tokens (valid for 60 days) and manages token expiration. A background process should refresh tokens before they expire to maintain continuous access.

## 5. Background Data Processing

After successful authentication, we initiate a background process to fetch additional profile data:

```typescript
async function fetchInitialInstagramData(
  c: { env: Env; req: { db: any } },
  userId: string,
  accessToken: string
) {
  // Fetch basic profile information
  const profile = await fetchInstagramProfile(accessToken);
  
  // Store profile data in database
  await updateProfileInDatabase(c, userId, profile);
  
  // Queue detailed data fetch for async processing
  await c.env.linkp_instagram_queue_fetching.put(
    `instagram_sync:${userId}`,
    "pending",
    { expirationTtl: 3600 }
  );
}
```

The queue entry in Cloudflare KV:
- Uses a key format of `instagram_sync:{userId}`
- Sets a value of `"pending"`
- Expires after 3600 seconds (1 hour)

This pattern allows a separate worker or process to identify accounts that need data synchronization without requiring immediate processing during the OAuth flow.

## 6. API Endpoints

The following endpoints are available for Instagram integration:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/instagram/callback` | GET | OAuth callback handler |
| `/api/instagram/webhook` | GET/POST | Webhook verification and event handling |
| `/api/instagram/status` | GET | Check connection status |
| `/api/instagram/profile` | GET | Fetch user profile data including follower count, following count, and media count |
| `/api/instagram/insights` | GET | Fetch detailed insights including engagement metrics and audience demographics |

## 7. Common Instagram Graph API Calls

### 7.1 Basic Profile Information

```javascript
// Fetch user profile
`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`

// Fetch media insights
`https://graph.instagram.com/{media-id}/insights?metric=impressions,reach,engagement&access_token=${accessToken}`
```

### 7.2 Available Metrics

Instagram provides various metrics through the Graph API:

#### 7.2.1 Profile Metrics
- **Basic Account Information**:
  - Follower count
  - Following count
  - Media count
  - Account type
  - Profile picture URL
  - Account name

#### 7.2.2 Engagement Metrics
- **Interaction Metrics**:
  - Likes
  - Comments
  - Shares
  - Saves
  - Replies

#### 7.2.3 Reach and Impression Metrics
- **Reach Breakdown**:
  - Follower vs. non-follower reach
  - Geographic distribution
  - Age and gender demographics
- **Impression Sources**:
  - Home feed
  - Profile
  - Explore page
  - Hashtags

#### 7.2.4 Content Performance
- **Post-level Analytics**:
  - Individual post engagement rates
  - Post reach and impressions
  - Post type performance (photos vs. videos vs. carousels)
  - Caption effectiveness

## 8. Webhook Implementation

The Instagram webhook system allows for real-time updates when:
- New media is published
- Comments are received
- Follower count changes

Our webhook handler:
1. Verifies requests using the `hub.challenge` parameter
2. Processes incoming events by storing them in the `instagramWebhookEvents` table
3. Updates metrics asynchronously to reflect current Instagram data

## 9. Security Considerations

The implementation includes several security measures:

1. **State Parameter Verification**: Prevents CSRF attacks during OAuth
2. **Token Storage**: Secure storage of access tokens in the database
3. **Webhook Verification**: Validation of incoming webhook requests
4. **Error Handling**: Comprehensive error reporting and graceful fallbacks

## 10. Future Improvements

The Instagram integration could be enhanced with:

### 10.1 Enhanced Analytics

- Implement trend analysis for follower growth
- Add engagement rate benchmarking against industry averages
- Create visual representations of audience demographics

### 10.2 Technical Enhancements

- Implement automatic token refreshing before expiration
- Add background workers for processing webhook events
- Improve error recovery for failed API requests

### 10.3 User Experience

- Implement a more interactive dashboard with filtering options
- Add export functionality for metrics and insights
- Create customizable date range selectors for historical data analysis
- Implement automated insights and recommendations based on performance data

## 11. Data Visualization

The current implementation includes several visualization components:

### 11.1 Profile Overview
- Profile statistics card showing follower count, following count, and media count
- Account type indicator
- Connection status with timestamp

### 11.2 Engagement Metrics
- Bar charts for interaction metrics (likes, comments, shares)
- Pie charts for reach breakdown by demographic
- Line graphs for follower growth over time

### 11.3 Content Performance
- Grid layout displaying recent posts with engagement metrics
- Visual indicators for content type (photo, video, carousel)
- Engagement metrics for each post
- Direct links to original content on Instagram

### 11.4 Audience Insights
- Demographic breakdown by age and gender
- Geographic distribution of followers
- Active hours and peak engagement times

## 12. Implementation Notes

### 12.1 Rate Limiting

The Instagram Graph API has strict rate limits that must be respected:
- 200 requests per user per hour
- 5000 requests per app per hour

Implementation includes caching strategies to minimize API calls:
- SWR for frontend data fetching with appropriate cache invalidation
- Server-side caching of metrics that don't change frequently
- Batch processing of data updates during background synchronization

### 12.2 Error Handling

The implementation includes comprehensive error handling:
- Graceful degradation when API calls fail
- User-friendly error messages
- Automatic retry mechanisms for transient failures
- Logging for debugging and monitoring

### 12.3 Performance Considerations

- Lazy loading of media content
- Pagination for large datasets
- Optimized database queries
- Efficient state management in the frontend

- Add real-time connection status indicators
- Implement detailed permission explanations
- Create a guided connection process for creators

## 11. Troubleshooting

Common issues with Instagram integration:

1. **OAuth Errors**: Usually related to incorrect client ID, secret, or redirect URI
2. **Missing Data**: May indicate insufficient permissions or rate limiting
3. **Token Expiration**: Long-lived tokens expire after 60 days and must be refreshed
4. **Webhook Failures**: Often caused by verification issues or signature mismatch

## 12. Configuration Reference

### 12.1 Required Environment Variables

- `INSTAGRAM_APP_ID`: Your Instagram App ID
- `INSTAGRAM_APP_SECRET`: Your Instagram App Secret
- `INSTAGRAM_VERIFY_TOKEN`: Custom token for webhook verification

### 12.2 Permission Scopes


## instagram_business_basic
**Unlocks:**
- Basic profile information (username, account name, ID)
- Follower count, following count, media count
- Profile picture URL
- Account type (personal, business, creator)

**When to Use:**
- Essential for creator profile verification
- Required for displaying authentic follower metrics
- Foundational for any Instagram integration
- Minimal permission with highest acceptance rate
- Use as your baseline permission for all integrations

## instagram_business_manage_insights
**Unlocks:**
- Detailed engagement metrics (likes, comments, shares, saves)
- Audience demographics (age, gender, location)
- Reach and impression data (follower vs. non-follower)
- Content performance analytics
- Impression sources (home, profile, explore, hashtags)
- Post-level analytics and engagement rates

**When to Use:**
- When building analytics dashboards
- For brand-creator matching algorithms
- When tracking campaign performance
- To generate social proof metrics for creator profiles
- For advanced audience insights features

## instagram_business_content_publish
**Unlocks:**
- Ability to create and publish feed posts
- Photo and video upload capabilities
- Carousel post creation
- Content scheduling

**When to Use:**
- For promotional content publishing features
- When implementing cross-platform content sharing
- For automated campaign content deployment
- In content scheduling workflows
- During Phase 3/4 of platform development

## instagram_business_manage_comments
**Unlocks:**
- Access to read post comments
- Ability to reply to comments
- Comment moderation (hide/unhide)
- Comment deletion

**When to Use:**
- For engagement monitoring features
- When building community management tools
- For sentiment analysis of audience feedback
- To monitor brand safety in collaborations
- In advanced moderation workflows

## instagram_business_manage_messages
**Unlocks:**
- Access to read direct messages
- Ability to send direct messages
- Conversation thread management

**When to Use:**
- For brand-creator communication features
- When implementing automated responses
- For lead generation workflows
- In campaign coordination systems
- During advanced phases of platform development

## Implementation Considerations
- Request only permissions necessary for your current feature set
- Implement proper rate limiting (200 requests/user/hour)
- Ensure secure token storage, especially for message permissions
- Add appropriate privacy disclosures when requesting sensitive permissions
- Implement graceful error handling for API rejections

## Conclusion

This Instagram integration provides a robust foundation for enhancing creator profiles with verified Instagram metrics. By displaying authentic follower counts and engagement rates, creators can build trust with potential brand partners while gaining valuable insights into their audience. The implementation follows security best practices and provides a scalable architecture for future enhancements.