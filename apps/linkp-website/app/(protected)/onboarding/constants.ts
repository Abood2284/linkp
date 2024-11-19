import { NicheType, UserType } from "@repo/db/schema";
import {
  Users2,
  Building2,
  Palette,
  HeartHandshake,
  GraduationCap
} from "lucide-react";

export type UserTypeConfig = {
  id: UserType;
  title: string;
  description: string;
  icon: React.ComponentType;
  nextStep: string;
};

export type NicheConfig = {
  id: NicheType;
  name: string;
  icon: string;
  description: string;
};

export const USER_TYPES: UserTypeConfig[] = [
  {
    id: "influencer",
    title: "Content Creator / Influencer",
    description: "I create content and engage with my audience",
    icon: Users2,
    nextStep: "/onboarding/niche",
  },
  {
    id: "business",
    title: "Business / Brand",
    description: "I represent a company or brand",
    icon: Building2,
    nextStep: "/onboarding/niche",
  },
  {
    id: "creator",
    title: "Creative Professional",
    description: "I create and sell creative work",
    icon: Palette,
    nextStep: "/onboarding/niche",
  },
  {
    id: "nonprofit",
    title: "Nonprofit Organization",
    description: "I work for social causes and community impact",
    icon: HeartHandshake,
    nextStep: "/onboarding/niche",
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur / Freelancer",
    description: "I offer services and build businesses",
    icon: GraduationCap,
    nextStep: "/onboarding/niche",
  },
];

export const NICHES: Record<UserType, NicheConfig[]> = {
  influencer: [
    { 
      id: "fashion_beauty",
      name: "Fashion & Beauty",
      icon: "👗",
      description: "Style, clothing, makeup, and personal care"
    },
    { 
      id: "tech_gadgets",
      name: "Tech & Gadgets",
      icon: "💻",
      description: "Technology, software, and digital tools"
    },
    { 
      id: "food_beverage",
      name: "Food & Beverage",
      icon: "🍳",
      description: "Cooking, recipes, and culinary arts"
    },
    { 
      id: "fitness_health",
      name: "Fitness & Health",
      icon: "💪",
      description: "Wellness, workouts, and healthy living"
    },
    { 
      id: "education_development",
      name: "Education & Development",
      icon: "📚",
      description: "Learning, personal growth, and skills"
    },
    { 
      id: "travel_lifestyle",
      name: "Travel & Lifestyle",
      icon: "✈️",
      description: "Travel, culture, and daily life"
    },
  ],
  business: [
    { 
      id: "tech_gadgets",
      name: "Technology",
      icon: "💻",
      description: "Software, hardware, and digital solutions"
    },
    // ... add other niches for business
  ],
  creator: [
    { 
      id: "fashion_beauty",
      name: "Fashion & Art",
      icon: "👗",
      description: "Creative works and designs"
    },
    // ... add other niches for creator
  ],
  nonprofit: [
    { 
      id: "education_development",
      name: "Education",
      icon: "📚",
      description: "Learning and development initiatives"
    },
    // ... add other niches for nonprofit
  ],
  entrepreneur: [
    { 
      id: "tech_gadgets",
      name: "Technology",
      icon: "💻",
      description: "Digital products and services"
    },
    // ... add other niches for entrepreneur
  ],
};

// Helper function to get niche config
export function getNicheConfig(userType: UserType, nicheId: NicheType): NicheConfig | undefined {
  return NICHES[userType]?.find(niche => niche.id === nicheId);
}

// Helper function to get user type config
export function getUserTypeConfig(userType: UserType): UserTypeConfig | undefined {
  return USER_TYPES.find(type => type.id === userType);
}