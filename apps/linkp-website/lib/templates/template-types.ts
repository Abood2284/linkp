// apps/linkp-website/lib/templates/types.ts
export type TemplateId = string;

export interface TemplateVariationStyleConfig {
  layout: "classic" | "grid" | "stacked" | "showcase" | "compact";
  colorScheme?: "light" | "dark" | "vibrant" | "monochrome" | "gradient";
  style?: "minimal" | "rounded" | "shadowed" | "bordered" | "flat";
  spacing?: "tight" | "moderate" | "airy";
  backgroundType?: string;
}

export interface TemplateVariation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  styleConfig: TemplateVariationStyleConfig;
}

export type BaseTemplateConfig = {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  tags: string[];
  variations?: TemplateVariation[];
  availability: {
    isPublic: boolean;
    allowedPlans: Array<"free" | "creator" | "business">;
    allowedUserTypes: Array<"creator" | "business">;
  };
  isActive: boolean;
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

export type WorkspaceType = {
  id: string;
  name: string;
  slug: string;
  userId: string;
  avatarUrl: null;
  templateId: string;
  templateConfig: null;
  isActive: true;
  createdAt: string;
  updatedAt: string;
};

// Props that every template component must accept
export type TemplateProps = {
  data: WorkspaceData;
  isPreview?: boolean;
};

// Helper type for template registry (updated)
export type TemplateRegistry = Record<
  string,
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
