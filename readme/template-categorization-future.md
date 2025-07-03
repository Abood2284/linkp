# Template Categorization & Discovery — Future Strategy

## Problem Statement

The current template categorization system uses broad style-based categories like “professional” and “creative.” While simple, these are too vague for real-world creators. For example, a gym owner or a musician may not know which category fits their needs, leading to confusion and poor template discovery.

## Goals

- Make template discovery precise, relevant, and user-centric.
- Allow creators from any industry or background to quickly find templates tailored to their needs.
- Support future growth with a scalable, metadata-driven system.

## Proposed Categorization Structure

### 1. **Industry/Niche**
- Fitness
- Music
- Art
- Coaching
- Education
- Food
- Tech
- Fashion
- ... (expandable)

### 2. **Persona**
- Gym Owner
- Musician
- Influencer
- Coach
- Startup Founder
- Restaurant Owner
- Teacher
- ... (expandable)

### 3. **Goal/Use-Case**
- Lead Generation (newsletter, sign-up, booking)
- Portfolio/Showcase (projects, gallery, testimonials)
- E-commerce (sell products, accept payments)
- Event Promotion (RSVP, event calendar)
- Social Growth (link to all socials, highlight latest content)
- ... (expandable)

### 4. **Features**
- Video header
- Instagram feed integration
- Booking calendar
- Payment links
- Custom backgrounds
- Animations
- ... (expandable)

### 5. **Style/Branding** (secondary filter)
- Minimal
- Bold
- Animated
- Elegant
- ... (expandable)

---

## Example Template Metadata Structure

```ts
interface TemplateMetadata {
  id: string
  name: string
  industry: string[]      // e.g. ["Fitness", "Health"]
  persona: string[]       // e.g. ["Gym Owner", "Coach"]
  goal: string[]          // e.g. ["Book Clients", "Showcase"]
  features: string[]      // e.g. ["Booking", "Video"]
  style: string[]         // e.g. ["Bold", "Minimal"]
}
```

---

## Example Filter UI

- **Industry:** [Fitness] [Music] [Education] ...
- **Persona:** [Gym Owner] [Musician] [Teacher] ...
- **Goal:** [Book Clients] [Sell Products] [Showcase Work] ...
- **Features:** [Booking] [Video] [Payments] ...
- **Style:** [Minimal] [Bold] [Animated] ...

---

## Example Table

| Template Name | Industry | Persona      | Goal         | Features         | Style    |
|---------------|----------|--------------|--------------|------------------|----------|
| Gym Hero      | Fitness  | Gym Owner    | Book Clients | Booking, Video   | Bold     |
| Music Pro     | Music    | Musician     | Showcase     | Audio, Gallery   | Creative |
| Edu Simple    | Education| Teacher      | Collect Leads| Form, Calendar   | Minimal  |

---

## Implementation Notes

- **Template Configs:**  
  Update each template’s config to include the new metadata fields.
- **Filter UI:**  
  Redesign the filter UI to use these new categories, with multi-select and clear groupings.
- **Onboarding:**  
  Consider a short onboarding quiz to recommend templates based on user answers.
- **Search:**  
  Add keyword search for quick access (e.g., “yoga”, “podcast”, “wedding”).
- **Smart Recommendations:**  
  Show trending templates in the user’s niche/persona.

---

## Open Questions

- What are the most important industries and personas to support at launch?
- Should templates be able to belong to multiple industries/personas/goals?
- How should we handle templates that fit multiple use-cases?
- What’s the best way to collect this metadata from template authors?

---

## Next Steps

1. Finalize the list of industries, personas, goals, and features.
2. Update template config types and all existing templates.
3. Redesign the filter UI and onboarding flow.
4. Roll out in stages, starting with metadata collection and UI update.

---

*This document is a living strategy. Please add feedback, questions, and ideas as we iterate!*