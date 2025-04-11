// apps/linkp-website/lib/stores/business-onboarding-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { z } from "zod";
import type {
  companyProfileSchema,
  goalsSchema,
  creatorPreferencesSchema,
  subscriptionSchema,
} from "../validations/business-onboarding";

type CompanyProfile = z.infer<typeof companyProfileSchema>;
type Goals = z.infer<typeof goalsSchema>;
type CreatorPreferences = z.infer<typeof creatorPreferencesSchema>;
type Subscription = z.infer<typeof subscriptionSchema>;

interface OnboardingState {
  // Current step tracking
  currentStep: number;

  // Data for each step
  companyProfile: Partial<CompanyProfile>;
  goals: Partial<Goals>;
  creatorPreferences: Partial<CreatorPreferences>;
  subscription: Partial<Subscription>;

  // Methods for updating state
  setCurrentStep: (step: number) => void;
  setCompanyProfile: (data: Partial<CompanyProfile>) => void;
  setGoals: (data: Partial<Goals>) => void;
  setCreatorPreferences: (data: Partial<CreatorPreferences>) => void;
  setSubscription: (data: Partial<Subscription>) => void;

  // Helper methods
  reset: () => void;
  isStepComplete: (step: number) => boolean;
  getProgress: () => number;
}

const initialState = {
  currentStep: 1,
  companyProfile: {},
  goals: {},
  creatorPreferences: {},
  subscription: {},
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set: any, get: any) => ({
      ...initialState,

      setCurrentStep: (step: any) => set({ currentStep: step }),

      setCompanyProfile: (data: any) =>
        set((state: any) => ({
          companyProfile: { ...state.companyProfile, ...data },
        })),

      setGoals: (data: any) =>
        set((state: any) => ({
          goals: { ...state.goals, ...data },
        })),

      setCreatorPreferences: (data: any) =>
        set((state: any) => ({
          creatorPreferences: { ...state.creatorPreferences, ...data },
        })),

      setSubscription: (data: any) =>
        set((state: any) => ({
          subscription: { ...state.subscription, ...data },
        })),

      reset: () => set(initialState),

      isStepComplete: (step: number) => {
        const state = get();
        switch (step) {
          case 1:
            return Boolean(
              state.companyProfile.companyName && state.companyProfile.industry
            );
          case 2:
            return Boolean(
              state.goals.monthlyBudget && state.goals.marketingGoals?.length
            );
          case 3:
            return Boolean(state.creatorPreferences.creatorCategories?.length);
          case 4:
            return Boolean(
              state.subscription.plan && state.subscription.acceptedTerms
            );
          default:
            return false;
        }
      },

      getProgress: () => {
        const state = get();
        const totalSteps = 4;
        const completedSteps = [1, 2, 3, 4].filter((step) =>
          state.isStepComplete(step)
        ).length;

        // Ensure we return a number between 0 and 100
        const calculatedProgress = Math.min(
          Math.max((completedSteps / totalSteps) * 100, 0),
          100
        );
        return Math.round(calculatedProgress);
      },
    }),
    {
      name: "business-onboarding",
      storage: createJSONStorage(() => sessionStorage), // This change ensures that even if a user forgets to complete the onboarding process, the data won't persist beyond their browser session.
    }
  )
);
