// src/lib/templates/types.ts

export type SocialPlatform = {
  platform: "twitter" | "instagram" | "tiktok" | "youtube" | "spotify";
  url: string;
  order: number;
  icon?: string;
};

export type LinkButton = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  order: number;
};

export type TemplateConfig = {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  style: {
    background: string;
    buttonStyle: "3d-shadow" | "flat" | "gradient";
    fontFamily: string;
    socialIconColor: string;
  };
  sections: {
    profile: {
      imageShape: "circle" | "square";
      imageSize: "small" | "medium" | "large";
      bioAlignment: "left" | "center" | "right";
    };
    socials: {
      layout: "horizontal" | "vertical";
      style: "simple-icon" | "branded" | "text";
    };
    links: {
      style: "colorful-3d" | "minimal" | "outline";
      spacing: "compact" | "comfortable" | "spacious";
    };
  };
  availability: {
    isPublic: boolean;
    allowedPlans: ("free" | "creator" | "business")[];
    allowedUserTypes: ("regular" | "creator" | "business")[];
  };
};

export type WorkspaceTemplate = {
  templateId: string;
  config: {
    backgroundColor: string;
    profile: {
      image: string;
      name: string;
      bio: string;
    };
    socials: SocialPlatform[];
    links: LinkButton[];
  };
};

// Template component props type
export type TemplateProps = {
  data: WorkspaceTemplate;
  isEditing?: boolean;
  onUpdate?: (data: Partial<WorkspaceTemplate>) => void;
};