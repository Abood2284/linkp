import { z } from "zod"

// Company Profile Step
export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.enum([
    "E-commerce",
    "SaaS",
    "Agency",
    "Fashion",
    "Beauty",
    "Tech",
    "Food & Beverage",
    "Entertainment",
    "Other"
  ]),
  website: z.string().url("Please enter a valid URL").optional(),
  size: z.enum([
    "1-10",
    "11-50",
    "51-200",
    "201-1000",
    "1000+"
  ]).optional(),
})

// Goals & Budget Step
export const goalsSchema = z.object({
  monthlyBudget: z.number().min(0, "Budget must be a positive number"),
  marketingGoals: z.array(z.enum([
    "Brand Awareness",
    "Lead Generation",
    "Sales",
    "Product Launch",
    "Community Building",
    "Other"
  ])).min(1, "Select at least one goal"),
  targetAudience: z.object({
    ageRange: z.array(z.string()),
    interests: z.array(z.string()),
    locations: z.array(z.string()),
  }),
  kpis: z.array(z.enum([
    "Impressions",
    "Clicks",
    "Conversions",
    "Sales",
    "Engagement Rate"
  ])).min(1, "Select at least one KPI"),
})

// Creator Preferences Step
export const creatorPreferencesSchema = z.object({
  creatorCategories: z.array(z.string()).min(1, "Select at least one category"),
  minFollowers: z.number().min(0),
  contentTypes: z.array(z.enum([
    "Photos",
    "Videos",
    "Stories",
    "Live Streams",
    "Blog Posts"
  ])).min(1, "Select at least one content type"),
  targetLocations: z.array(z.string()).optional(),
})

// Subscription Step
export const subscriptionSchema = z.object({
  plan: z.enum(["free", "pro", "business"]),
  billingCycle: z.enum(["monthly", "yearly"]).optional(),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

// Combined schema for the entire onboarding process
export const businessOnboardingSchema = z.object({
  companyProfile: companyProfileSchema,
  goals: goalsSchema,
  creatorPreferences: creatorPreferencesSchema,
  subscription: subscriptionSchema,
}) 