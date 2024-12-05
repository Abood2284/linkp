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
  config: Record<string, any>; // Template-specific configuration
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
  config?: Record<string, any>;
  isPreview?: boolean;
};

// Helper type for template registry
export type TemplateRegistry = Record<TemplateId, {
  config: BaseTemplateConfig;
  Component: React.ComponentType<TemplateProps>;
}>;