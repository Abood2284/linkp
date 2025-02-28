// import { create } from "zustand"
// import { persist } from "zustand/middleware"
// import type { z } from "zod"
// import type {
//   businessOnboardingSchema,
//   companyProfileSchema,
//   goalsSchema,
//   creatorPreferencesSchema,
//   subscriptionSchema,
// } from "../validations/business-onboarding"

// type CompanyProfile = z.infer<typeof companyProfileSchema>
// type Goals = z.infer<typeof goalsSchema>
// type CreatorPreferences = z.infer<typeof creatorPreferencesSchema>
// type Subscription = z.infer<typeof subscriptionSchema>
// type BusinessOnboarding = z.infer<typeof businessOnboardingSchema>

// interface OnboardingState {
//   companyProfile: Partial<CompanyProfile>
//   goals: Partial<Goals>
//   creatorPreferences: Partial<CreatorPreferences>
//   subscription: Partial<Subscription>
//   setCompanyProfile: (data: Partial<CompanyProfile>) => void
//   setGoals: (data: Partial<Goals>) => void
//   setCreatorPreferences: (data: Partial<CreatorPreferences>) => void
//   setSubscription: (data: Partial<Subscription>) => void
//   reset: () => void
// }w

// const initialState = {
//   companyProfile: {},
//   goals: {},
//   creatorPreferences: {},
//   subscription: {},
// }

// export const useOnboardingStore = create<OnboardingState>()(
//   persist(
//     (set) => ({
//       ...initialState,
//       setCompanyProfile: (data) =>
//         set((state) => ({
//           companyProfile: { ...state.companyProfile, ...data },
//         })),
//       setGoals: (data) =>
//         set((state) => ({
//           goals: { ...state.goals, ...data },
//         })),
//       setCreatorPreferences: (data) =>
//         set((state) => ({
//           creatorPreferences: { ...state.creatorPreferences, ...data },
//         })),
//       setSubscription: (data) =>
//         set((state) => ({
//           subscription: { ...state.subscription, ...data },
//         })),
//       reset: () => set(initialState),
//     }),
//     {
//       name: "business-onboarding",
//     }
//   )
// ) 