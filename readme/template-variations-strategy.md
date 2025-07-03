# Template Variations Strategy

This document provides comprehensive guidance on implementing and managing template variations in the Linkp platform. It serves as the authoritative reference for creating, organizing, and displaying template variations to enhance user choice while maintaining implementation simplicity.

## Table of Contents

1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [Implementation Guide](#implementation-guide)
4. [Niche-Specific Templates](#niche-specific-templates)
5. [User Interface](#user-interface)
6. [Data Management](#data-management)
7. [Testing & Quality Assurance](#testing--quality-assurance)
8. [Future Enhancements](#future-enhancements)

## Overview

Template variations provide multiple visual expressions of the same template family without requiring user customization. This approach offers several key benefits:

- **Increased User Choice**: Provides users multiple style options without overwhelming them
- **Controlled Design Quality**: Maintains design integrity compared to free-form customization
- **Implementation Efficiency**: Shares code between variations to minimize duplication
- **Niche Targeting**: Enables creating templates optimized for specific creator types
- **Performance Optimization**: Templates are pre-rendered instead of dynamically generated

## Core Architecture

### Enhanced Template Configuration

Each template will have multiple variations defined in its configuration:

```typescript
// Extended from current BaseTemplateConfig
export interface BaseTemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  tags: string[];
  variations: TemplateVariation[];
  availability: {
    isPublic: boolean;
    allowedPlans: Array<"free" | "creator" | "business">;
    allowedUserTypes: Array<"creator" | "business">;
  };
  isActive: boolean;
}

export interface TemplateVariation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  styleConfig: {
    layout: "classic" | "grid" | "stacked" | "showcase" | "compact";
    colorScheme: "light" | "dark" | "vibrant" | "monochrome" | "gradient";
    style: "minimal" | "rounded" | "shadowed" | "bordered" | "flat";
    spacing: "tight" | "moderate" | "airy";
    // Other style properties as needed
  };
}
```

### Template Component Structure

A template with variations will be structured as follows:

```
templates/
└── fashion-lookbook/
    ├── index.tsx              # Main template component with variation handling
    ├── template-config.ts     # Template config with variations array
    ├── styles.ts              # Shared styles and configurations
    └── layouts/               # Layout components for different variations
        ├── classic.tsx        # Classic layout component
        ├── grid.tsx           # Grid layout component
        └── showcase.tsx       # Showcase layout component
```

## Implementation Guide

### Step 1: Update Template Types

Extend the current template type definitions to include variations:

```typescript
// lib/templates/template-types.ts
export type TemplateProps = {
  data: WorkspaceData;
  isPreview?: boolean;
  variationId?: string; // Add variation ID
};
```

### Step 2: Create Template with Variations

Here's an example implementation of a template with multiple variations:

```tsx
// templates/fashion-lookbook/index.tsx
import { TemplateProps } from "@/lib/templates/template-types";
import { templateConfig } from "./template-config";
import ClassicLayout from "./layouts/classic";
import GridLayout from "./layouts/grid";
import ShowcaseLayout from "./layouts/showcase";

export default function FashionLookbookTemplate({ 
  data, 
  isPreview, 
  variationId = "default" 
}: TemplateProps) {
  
  // Find the variation configuration based on the ID
  const variation = templateConfig.variations.find(v => v.id === variationId) || 
                    templateConfig.variations[0];
  
  // Render the appropriate layout based on the variation
  switch(variation.styleConfig.layout) {
    case "grid":
      return (
        <GridLayout 
          data={data} 
          isPreview={isPreview} 
          config={variation.styleConfig} 
        />
      );
    case "showcase":
      return (
        <ShowcaseLayout 
          data={data} 
          isPreview={isPreview} 
          config={variation.styleConfig} 
        />
      );
    case "classic":
    default:
      return (
        <ClassicLayout 
          data={data} 
          isPreview={isPreview} 
          config={variation.styleConfig} 
        />
      );
  }
}
```

### Step 3: Define Template Configuration with Variations

```typescript
// templates/fashion-lookbook/template-config.ts
import { BaseTemplateConfig } from "@/lib/templates/template-types";

export const templateConfig: BaseTemplateConfig = {
  id: "fashion-lookbook",
  name: "Fashion Lookbook",
  description: "Perfect for fashion creators showcasing products and styles",
  thumbnail: "/thumbnails/fashion-lookbook-default.png",
  category: "fashion",  // Niche-specific category
  tags: ["fashion", "product", "lookbook"],
  
  variations: [
    {
      id: "classic",
      name: "Classic Gallery",
      description: "Traditional layout with gallery-style images",
      thumbnail: "/thumbnails/fashion-lookbook-classic.png",
      styleConfig: {
        layout: "classic",
        colorScheme: "light",
        style: "rounded",
        spacing: "moderate"
      }
    },
    {
      id: "grid",
      name: "Product Grid",
      description: "Grid-based layout for showcasing multiple products",
      thumbnail: "/thumbnails/fashion-lookbook-grid.png",
      styleConfig: {
        layout: "grid",
        colorScheme: "light",
        style: "shadowed",
        spacing: "tight"
      }
    },
    {
      id: "editorial",
      name: "Editorial Style",
      description: "Magazine-inspired layout with featured content",
      thumbnail: "/thumbnails/fashion-lookbook-editorial.png",
      styleConfig: {
        layout: "showcase",
        colorScheme: "monochrome",
        style: "minimal",
        spacing: "airy"
      }
    }
  ],
  
  availability: {
    isPublic: true,
    allowedPlans: ["free", "creator", "business"],
    allowedUserTypes: ["creator", "business"]
  },
  isActive: true
};
```

### Step 4: Implement Layout Components

Create separate layout components that share styling logic:

```tsx
// templates/fashion-lookbook/layouts/classic.tsx
import { TemplateProps } from "@/lib/templates/template-types";
import { fonts } from "@/public/assets/fonts/fonts";

interface ClassicLayoutProps {
  data: TemplateProps['data'];
  isPreview?: boolean;
  config: {
    colorScheme: string;
    style: string;
    spacing: string;
  };
}

export default function ClassicLayout({ data, isPreview, config }: ClassicLayoutProps) {
  // Determine styling based on config
  const bgColor = config.colorScheme === 'light' ? '#ffffff' : '#121212';
  const textColor = config.colorScheme === 'light' ? '#333333' : '#f0f0f0';
  const borderRadius = config.style === 'rounded' ? 'rounded-lg' : 'rounded-none';
  const padding = config.spacing === 'airy' ? 'p-6' : 'p-4';
  
  return (
    <div
      className={`min-h-screen ${fonts.body.variable}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Profile section */}
      <header className="text-center py-8">
        <div className="relative mx-auto mb-4 w-24 h-24">
          <img
            src={data.profile.image}
            alt={data.profile.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h1 className={`text-2xl font-bold ${fonts.heading.variable}`}>
          {data.profile.name}
        </h1>
        <p className="mt-2 max-w-md mx-auto">{data.profile.bio}</p>
      </header>
      
      {/* Links section */}
      <main className="max-w-md mx-auto px-4">
        {data.links.sort((a, b) => a.order - b.order).map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block mb-4 ${borderRadius} ${padding} transition-all hover:-translate-y-1 hover:shadow-md`}
            style={{
              backgroundColor: link.backgroundColor || '#f0f0f0',
              color: link.textColor || '#333333'
            }}
          >
            <div className="flex items-center">
              {link.icon && <span className="mr-3">{link.icon}</span>}
              <span>{link.title}</span>
            </div>
          </a>
        ))}
      </main>
    </div>
  );
}
```

## Niche-Specific Templates

Instead of generic categories like "minimal" or "professional," we'll organize templates by creator niche:

### Primary Niches

1. **Fashion & Beauty**
   - Target: Fashion bloggers, influencers, stylists, makeup artists
   - Key Features: 
     - Gallery layouts for showcasing outfits/products
     - Prominent visual elements
     - Product link optimizations
     - Instagram integration for latest posts

2. **Fitness & Wellness**
   - Target: Personal trainers, yoga instructors, nutritionists
   - Key Features:
     - Booking integration for sessions
     - Video content thumbnails
     - Testimonial sections
     - Meal/workout plan downloads

3. **Digital Creators**
   - Target: Course creators, digital product sellers, consultants
   - Key Features:
     - Content organization for courses/ebooks
     - Lead magnet integrations
     - Testimonial sections
     - Direct payment links

4. **Small Business**
   - Target: Local shops, service providers, restaurants
   - Key Features:
     - Location map integration
     - Hours display
     - Menu/catalog sections
     - Booking/reservation links

5. **General Purpose**
   - Target: Multi-purpose use, community managers, event organizers
   - Key Features:
     - Flexible content organization
     - Event countdown elements
     - Multi-section layouts
     - Community/group links

### Implementation Steps for Niche Templates

1. **Research Niche Requirements**
   - Study top creators in each niche
   - Identify common link patterns and priorities
   - Analyze specific functional needs

2. **Design Template Family**
   - Create base template for the niche
   - Develop 3-4 variations with meaningful differences
   - Ensure each variation addresses specific use cases

3. **Organize by Niche Tags**
   - Apply consistent niche tagging
   - Create descriptive names relevant to the niche
   - Add niche-specific thumbnails

## User Interface

The template selection UI will be organized to showcase templates by niche with variations visible within each template:

### Templates Gallery Page

Update the templates gallery page to show variations for each template:

```tsx
// app/(public)/public/templates/page.tsx
export default function TemplatesPage() {
  // ... existing code ...
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* ... existing hero section and filters ... */}
      
      {/* Templates Grid */}
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4">
        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 capitalize border-b pb-2">
              {formatCategoryName(category)}
            </h2>

            {templates.map(template => (
              <div key={template.id} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {template.name}
                  </h3>
                  <Badge className="capitalize bg-blue-50 text-blue-700">
                    {template.category}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {template.description}
                </p>
                
                {/* Variations Scroll Row */}
                <div className="relative">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6">
                      {template.variations.map(variation => (
                        <div key={variation.id} className="flex-shrink-0 w-64">
                          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="aspect-[9/16] w-full overflow-hidden relative">
                              <img 
                                src={variation.thumbnail} 
                                alt={variation.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => previewTemplate(template.id, variation.id)}
                                >
                                  Preview
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => useTemplate(template.id, variation.id)}
                                >
                                  Use
                                </Button>
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium text-gray-800">
                                {variation.name}
                              </h4>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {variation.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Data Management

### Database Schema Update

To support template variations, update the workspace schema:

```typescript
// Current schema
interface Workspace {
  // ... existing fields
  templateId: string;
  templateConfig: null;
  // ... other fields
}

// Updated schema
interface Workspace {
  // ... existing fields
  templateId: string;
  templateVariationId: string; // New field to store the selected variation
  templateConfig: null;
  // ... other fields
}
```

### Template Registry Updates

Update the template registry to handle variations:

```typescript
// lib/templates/registry.ts
export function getTemplateWithVariation(templateId: string, variationId?: string) {
  const template = templateRegistry[templateId];
  
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }
  
  const templateConfig = getTemplateConfig(templateId);
  const variations = templateConfig.variations || [];
  
  // Find requested variation or use default
  const variation = variationId 
    ? variations.find(v => v.id === variationId) 
    : variations[0];
    
  return {
    Component: template.Component,
    config: templateConfig,
    variation: variation || variations[0]
  };
}
```

## Testing & Quality Assurance

Implement a comprehensive testing strategy for template variations:

1. **Visual Testing**
   - Test each variation across devices (mobile, tablet, desktop)
   - Verify correct rendering of all variation styles
   - Ensure smooth transitions between variations

2. **Functional Testing**
   - Verify correct application of style configurations
   - Test template selection with different variations
   - Validate saving and loading of template variations

3. **Performance Testing**
   - Measure load times for different variations
   - Ensure variations don't introduce rendering bottlenecks
   - Test performance on low-end devices

## Future Enhancements

Future improvements to the template variations system:

1. **A/B Testing Integration**
   - Allow creators to test different variations against each other
   - Track performance metrics by variation
   - Provide insights on which variation performs better

2. **Seasonal Variations**
   - Create holiday/seasonal versions of templates
   - Implement time-based variation switching
   - Add special event templates

3. **Advanced Layouts**
   - Develop more sophisticated layout options
   - Create advanced interactive elements
   - Support rich media content types

4. **AI-Assisted Recommendations**
   - Suggest optimal template variations based on creator content
   - Analyze engagement patterns to recommend templates
   - Recommend templates based on similar successful creators

---

This document serves as the complete guide for implementing template variations in the Linkp platform. By following these guidelines, we can create a rich template ecosystem that offers users meaningful choices while maintaining code efficiency and design integrity.

*This document is a living strategy. Please add feedback, questions, and ideas as we iterate!*