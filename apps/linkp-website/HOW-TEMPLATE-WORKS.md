# Template System Documentation

## Overview
The template system allows creating and managing link-in-bio page templates with consistent styling and functionality.

## Core Components

### Template Registry (`/lib/templates/registry.ts`)
- Manages available templates
- Methods: `register()`, `getAll()`, `getById()`, `getAvailable()`
- In-memory template storage during runtime

### Template Types (`/lib/templates/template-types.ts`) 
```typescript
- TemplateConfig: metadata, styling, availability
- SocialPlatform: social media links 
- LinkButton: link styling, behavior
```

### Template Initialization (`/lib/templates/init.ts`)
- Called in root layout (`app/layout.tsx`)
- Registers all templates at startup

## Template Structure
All templates reside in `/components/templates/[template-name]/` with required files:

### 1. template-config.ts
```typescript
{
  id: string;            // Unique identifier
  name: string;          // Display name
  thumbnail: string;     // Preview image
  style: {...};         // Default styling
  sections: {...};      // Layout config
  availability: {...};  // Access control
}
```

### 2. config.ts
- Runtime styling constants
- Button presets
- Template-specific styling

### 3. index.tsx
- Template component implementation
- Uses config.ts styles
- Follows template-config.ts specs

## Creating New Templates

1. Create directory:
```
/components/templates/[your-template-name]/
```

2. Add required files:
- template-config.ts
- config.ts  
- index.tsx

3. Register in init.ts

4. Update template-types.ts if adding new styling options

## Template Selection Flow
1. User visits template selection page
2. Registry filters templates by user's plan
3. Selection creates workspace with template config
4. Template renders based on configuration

## Quick Start
1. Design your template layout
2. Feed design to GPT for template config generation
3. Implement the three required files
4. Register template in init.ts
5. Test template selection and rendering

## Notes
- Update template-types.ts when adding new styling options (e.g., diagonal profile images)
- Each template maintains independent styling and components
- Config changes require template-types.ts updates