// apps/linkp-website/lib/validations/business-onboarding.ts
import * as z from "zod";

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string({
    required_error: "Please select an industry",
  }),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const goalsSchema = z.object({
  monthlyBudget: z.number().min(0, "Budget cannot be negative"),
  linkObjectives: z.array(z.string()).min(1, "Select at least one objective"),
  targetAudience: z.object({
    ageRange: z.array(z.string()).min(1, "Select at least one age range"),
    interests: z.array(z.string()).min(1, "Select at least one interest"),
  }),
  linkMetrics: z.array(z.string()).min(1, "Select at least one metric"),
});

export const creatorPreferencesSchema = z.object({
  creatorCategories: z.array(z.string()).min(1, "Select at least one category"),
  minFollowers: z
    .number()
    .min(1000, "Minimum followers must be at least 1,000"),
  targetLocations: z.array(z.string()).optional(),
});

export const subscriptionSchema = z.object({
  plan: z.enum(["free", "pro", "business"]),
  billingCycle: z.enum(["monthly", "yearly"]),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});
