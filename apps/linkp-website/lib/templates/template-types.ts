// apps/linkp-website/lib/templates/types.ts
export type TemplateId = string;

export type BaseTemplateConfig = {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  tags: string[];
  availability: {
    isPublic: boolean;
    allowedPlans: Array<"free" | "creator" | "business">;
    allowedUserTypes: Array<"regular" | "creator" | "business">;
  };
  isActive: boolean;
  // config: Record<string, any>; // REMOVED
};

export type TemplateCategory =
  | "minimal"
  | "creative"
  | "professional"
  | "animated";

// This represents the data structure that ALL templates will receive
export type WorkspaceData = {
  profile: {
    image: string;
    name: string;
    bio: string;
  };
  socials: Array<{
    platform: string;
    url: string;
    order: number;
    icon: string;
  }>;
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
    order: number;
  }>;
};

// Props that every template component must accept
export type TemplateProps = {
  data: WorkspaceData;
  isPreview?: boolean;
};

// Helper type for template registry (updated)
export type TemplateRegistry = Record<
  TemplateId,
  {
    // config: BaseTemplateConfig; // REMOVED
    Component: React.ComponentType<TemplateProps>;
  }
>;

export type SocialPlatform = {
  platform: "twitter" | "instagram" | "youtube" | "tiktok" | "spotify";
  url: string;
  order?: number;
  icon?: string;
};
