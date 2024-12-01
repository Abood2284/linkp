import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const modernMinimalTemplate: BaseTemplateConfig = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  description: 'Clean and minimal design with focus on content',
  thumbnail: '/templates/modern-minimal/thumbnail.png',
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