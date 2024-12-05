import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const darkFitnessTemplate: BaseTemplateConfig = {
  id: 'dark-fitness',
  name: 'Dark Fitness',
  description: 'A sleek, dark-themed template perfect for fitness professionals',
  thumbnail: '/templates/dark-fitness/thumbnail.png',
  category: 'professional',
  tags: ['fitness', 'dark', 'minimal', 'professional'],
  availability: {
    isPublic: true,
    allowedPlans: ['free', 'creator', 'business'],
    allowedUserTypes: ['regular', 'creator', 'business']
  },
  isActive: true,
  config: {
    layout: {
      profileAlignment: 'center',
      linksLayout: 'stack',
      maxWidth: 'md',
      spacing: 'relaxed',
      heroImageStyle: 'fullWidth'
    },
    styling: {
      borderRadius: 'lg',
      backgroundColor: '#000000',
      profileImageSize: 'full',
      animation: 'fade',
      typography: {
        nameSize: '3xl',
        titleSize: 'lg'
      }
    }
  }
};

export default darkFitnessTemplate;

