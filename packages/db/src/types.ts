export type APIResponse<T = any> = {
  status: 200 | 201 | 400 | 401 | 403 | 404 | 500;
  data?: T;
  message?: string;
};

export type WorkspaceSlugResponse = APIResponse<boolean>;
export type WorkspacesResponse = APIResponse<WorkspaceType[]>;
export type WorkspaceResponse = APIResponse<ExpandedWorkspaceData>;

export type WorkspaceType = {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  slug: string;
  userId: string;
  avatarUrl: string | null;
  templateId: string;
  templateConfig: Record<string, any> | null;
  isActive: boolean | null;
};

// Define the structure for expanded workspace data
export type ExpandedWorkspaceData = {
  // Core workspace data from the workspaces table
  id: string;
  name: string;
  slug: string;
  userId: string;

  // Profile information
  avatarUrl: string | null;

  // Add profile object for frontend consumption
  profile: {
    image: string;
    name: string;
    bio: string;
  };

  // Socials for WorkspaceData compatibility
  socials: Array<{
    platform: string;
    url: string;
    order: number;
    icon: string;
  }>;

  // Template configuration
  templateId: string;
  templateConfig: Record<string, any> | null;

  // Status and metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Related entities
  links: WorkspaceLink[];

  // Workspace-level analytics
  analytics: {
    realtime: {
      activeVisitors: number;
      recentClicks: number;
      lastUpdated: Date;
    };

    aggregated: Array<{
      timeBucket: "hour" | "day" | "week" | "month" | "year";
      bucketStart: Date;
      bucketEnd: Date;
      metrics: {
        totalClicks: number;
        uniqueVisitors: number;
        uniqueSessions: number;
        avgTimeOnPage?: number;
        bounceRate?: number;
        topCountries: Array<{ country: string; count: number }>;
        topReferrers: Array<{ referrer: string; count: number }>;
        deviceBreakdown: Record<string, number>;
      };
    }>;
  };
};

export type WorkspaceLink = {
  id: string;
  type:
    | "social"
    | "regular"
    | "promotional"
    | "commerce"
    | "booking"
    | "newsletter"
    | "music"
    | "video"
    | "donation"
    | "poll"
    | "file";
  platform: string | null;
  title: string;
  url: string;
  icon: string | null;
  backgroundColor?: string;
  textColor?: string;
  order: number;
  isActive: boolean;

  // Promotional link fields
  businessId?: string;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  promotionStatus?: string;
  promotionPrice?: number;
  promotionMetrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };

  config?: {
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
  };
  createdAt: Date;
  updatedAt: Date;
};

// ! Copied from Claude. Doesn't know its use-case yet.
// Helper type for converting database results to the expanded format
// export type WorkspaceDataConverter = {
//   workspace: SelectWorkspace;
//   links: SelectWorkspaceLink[];
//   linkEvents: Record<string, SelectLinkEvent[]>;
//   aggregatedMetrics: Record<string, SelectAggregatedMetric[]>;
//   realtimeMetrics: Record<string, SelectRealtimeMetric>;
// };
