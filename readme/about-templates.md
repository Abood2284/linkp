# Linkp Template System Documentation

## Table of Contents
- [Overview](#overview)
- [Template Development Guidelines](#template-development-guidelines)
- [Step-by-Step Template Creation](#step-by-step-template-creation)
- [Common Pitfalls](#common-pitfalls)
- [Best Practices](#best-practices)
- [Edge Runtime Considerations](#edge-runtime-considerations)
- [Future Scope](#future-scope)

## Overview

The Linkp template system is a code-first approach to managing link-in-bio templates. Unlike traditional database-driven template systems, our approach stores templates as code components, providing superior type safety, better performance, and enhanced developer experience.

### Why Code-First?

Our code-first approach was chosen for several compelling reasons:

1. **Type Safety**: By storing templates as TypeScript components, we get full type checking and IDE support, making development more reliable and efficient.

2. **Performance**: Templates are compiled at build time and served from the edge, resulting in faster load times compared to database-driven approaches.

3. **Version Control**: Templates are part of our codebase, making it easy to track changes, review modifications, and roll back when needed.

4. **Developer Experience**: Direct code editing provides a better development experience than working with templates stored in a database.

## Template Development Guidelines

### 1. Type Safety First
- ALWAYS refer to `@/lib/templates/template-types.ts` for:
  - Available template categories
  - Required template configuration properties
  - Workspace data structure
  - Component props interface

### 2. Template Structure
Each template MUST have these files:
```
apps/linkp-website/templates/
└── your-template-name/
    ├── index.tsx       # Main template component
    ├── template-config.ts  # Template configuration
    └── styles.ts      # Style configurations
```

### 3. Configuration Requirements

#### template-config.ts
```typescript
import { BaseTemplateConfig } from "@/lib/templates/template-types"

// ALWAYS check BaseTemplateConfig for required properties
export const templateConfig: BaseTemplateConfig = {
  id: string;              // Template identifier
  name: string;            // Display name
  description: string;     // Template description
  thumbnail: string;       // Preview image path
  category: TemplateCategory; // MUST be one of: "minimal" | "creative" | "professional" | "animated"
  tags: string[];         // Search/filter tags
  availability: {
    isPublic: boolean;
    allowedPlans: Array<"free" | "creator" | "business">;
    allowedUserTypes: Array<"regular" | "creator" | "business">;
  };
  isActive: boolean;     // Template availability flag
}
```

#### styles.ts
```typescript
export const defaultConfig = {
  // Define your style configurations here
  // These are template-specific and don't need to follow a strict interface
}
```

#### index.tsx
```typescript
import { TemplateProps } from "@/lib/templates/template-types"

// WorkspaceData structure from template-types.ts:
type WorkspaceData = {
  profile: {
    image: string;
    name: string;
    bio: string;
  };
  socials: Array<{
    platform: string;
    url: string;
    order: number;
    icon: string;
  }>;
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
    order: number;
  }>;
};

export default function Template({ data, isPreview }: TemplateProps) {
  // Implementation
}
```

## Step-by-Step Template Creation

1. **Check Existing Templates**
   - Review existing templates in `/templates` directory
   - Understand common patterns and implementations

2. **Type Verification**
   - Open and review `template-types.ts`
   - Note all available categories and required properties
   - Understand the WorkspaceData structure

3. **Create Template Files**
   - Create directory with meaningful name
   - Create all required files
   - Import correct types

4. **Implementation**
   - Use only properties available in WorkspaceData
   - Follow the component props interface strictly
   - Test with preview system

## Common Pitfalls

1. **Configuration Mistakes**
   - Adding non-existent categories
   - Including undefined config properties
   - Missing required fields

2. **Component Props**
   - Using incorrect data structure
   - Assuming properties that don't exist
   - Not handling optional fields

3. **Style Implementation**
   - Not considering mobile responsiveness
   - Hard-coding values instead of using config
   - Not handling dark/light modes

## Best Practices

1. **Type Safety**
   - Use TypeScript strictly
   - No type assertions unless absolutely necessary
   - Handle all optional fields

2. **Performance**
   - Optimize images
   - Use proper loading strategies
   - Implement proper caching

3. **Maintenance**
   - Comment complex logic
   - Use meaningful variable names
   - Follow project coding standards

## Edge Runtime Considerations

1. **Compatibility**
   - No filesystem operations
   - Use static imports
   - Keep templates lightweight

2. **Asset Management**
   - Optimize all assets
   - Use proper image formats
   - Consider bandwidth constraints

## Testing

1. **Preview Testing**
- Test with dummy data
- Verify all responsive breakpoints
   - Check performance metrics

2. **Edge Cases**
   - Test with missing data
   - Verify error boundaries
   - Check loading states

## Future Scope

### Planned Features

1. **Template Marketplace**
   - Allow third-party template submissions
   - Template verification system
   - Revenue sharing model

2. **Enhanced Customization**
   - Visual template editor
   - Real-time preview system
   - Custom component injection

3. **Analytics Integration**
   - Template performance metrics
   - User engagement tracking
   - A/B testing support

4. **Developer Tools**
   - Template development CLI
   - Testing utilities
   - Documentation generator

### Scalability Considerations

1. **Template Versioning**
   - Version control for templates
   - Backward compatibility
   - Migration utilities

2. **Performance Optimization**
   - Template code splitting
   - Lazy loading of components
   - Asset optimization

3. **Enterprise Features**
   - Custom template development
   - White-labeling options
   - Advanced analytics

## Contributing

We welcome contributions to our template system. To contribute:

1. Fork the repository
2. Create your template following our guidelines
3. Submit a pull request with your changes
4. Ensure all tests pass
5. Provide comprehensive documentation

## Support

For questions or issues:

1. Check our documentation
2. Submit an issue on GitHub
3. Contact our support team

Remember to always check the edge compatibility of your templates before submitting them for review.

*This document is a living strategy. Please add feedback, questions, and ideas as we iterate!*