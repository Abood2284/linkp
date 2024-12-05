import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const modernYellowTemplate: BaseTemplateConfig = {
  id: 'modern-yellow',
  name: 'Modern Yellow',
  description: 'Clean and minimal design with focus on content',
  thumbnail: '/templates/modern-yellow/thumbnail.png',
  category: 'minimal',
  tags: ['clean', 'minimal', 'professional'],
  availability: {
    isPublic: true,
    allowedPlans: ['free', 'creator', 'business'],
    allowedUserTypes: ['regular', 'creator', 'business']
  },
  isActive: true,
  config: {
    layout: {
      profileAlignment: 'center', // center, left, right
      linksLayout: 'stack', // stack, grid
      maxWidth: 'md', // sm, md, lg
      spacing: 'normal', // compact, normal, relaxed
    },
    styling: {
      borderRadius: 'md',
      backgroundColor: '#ffffff',
      profileImageSize: 'lg',
      animation: 'fade', // none, fade, slide
    }
  }
};

// IMPORTANT: This line is crucial
export default modernYellowTemplate;