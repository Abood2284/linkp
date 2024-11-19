import { z } from "zod"

export const onboardingSchema = z.object({
  userType: z.string().min(1, "User type is required"),
  niche: z.string().min(1, "Niche is required"),
  profile: z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    photo: z.string().optional(),
    location: z.string().optional(),
    displayEmail: z.boolean().optional(),
  }),
  customization: z.object({
    theme: z.string().default("default"),
    layout: z.string().default("standard"),
    brandColor: z.string().default("#000000"),
    fontPreference: z.string().default("inter"),
  }),
  socials: z.record(z.string()).optional(),
}) 