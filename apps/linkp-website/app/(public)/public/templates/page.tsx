// apps/linkp-website/app/(public)/public/templates/page.tsx
"use client";

import { templateRegistry } from "@/lib/templates/registry";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { useEffect, useState, useMemo } from "react";
import TemplateFilters from "./components/templateFilters";
import TemplateThumbnail from "./components/templateThumbnail";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Helper function to extract all unique tags from templates
const extractAllTags = (templates: BaseTemplateConfig[]): string[] => {
  const tagsSet = new Set<string>();
  templates.forEach((template) => {
    template.tags.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

// Helper function to filter and organize templates
const filterAndOrganizeTemplates = (
  templates: BaseTemplateConfig[],
  selectedCategory: string | null,
  selectedTags: string[]
) => {
  // Apply filters
  const filteredTemplates = templates.filter((template) => {
    // Filter by category if one is selected
    if (selectedCategory && template.category !== selectedCategory) {
      return false;
    }

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      // Check if template has ALL selected tags
      return selectedTags.every((tag) => template.tags.includes(tag));
    }

    return true;
  });

  // If no category filter is applied, organize by category
  if (!selectedCategory) {
    const categories: Record<string, BaseTemplateConfig[]> = {};

    filteredTemplates.forEach((template) => {
      if (!categories[template.category]) {
        categories[template.category] = [];
      }
      categories[template.category].push(template);
    });

    return { byCategory: categories, flat: filteredTemplates };
  }

  // If a category is selected, return templates in a flat structure
  return {
    byCategory: { [selectedCategory]: filteredTemplates },
    flat: filteredTemplates,
  };
};

export default function TemplatesPage() {
  const router = useRouter();
  // Memoize allTemplates to avoid infinite re-renders
  const allTemplates = useMemo(
    () => templateRegistry.getAvailableTemplates("free", "creator"),
    []
  );

  // Extract all categories and tags for filters
  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Initialize categories and tags
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(allTemplates.map((t) => t.category))
    ).sort();

    setCategories(uniqueCategories);
    setAllTags(extractAllTags(allTemplates));
  }, [allTemplates]);

  // Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  // Apply filters
  const { byCategory: filteredTemplatesByCategory } =
    filterAndOrganizeTemplates(allTemplates, selectedCategory, selectedTags);

  const handleViewTemplate = (templateId: string) => {
    router.push(`/public/templates/${templateId}`);
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/creator/select-template?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-[#457b9d] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center font-heading md:text-left">
            Find Your Perfect Template
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl opacity-90 text-center md:text-left mx-auto md:mx-0">
            Discover beautiful, professionally designed templates to showcase
            your content and engage your audience.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <TemplateFilters
        categories={categories}
        tags={allTags}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        onCategoryChange={handleCategoryChange}
        onTagToggle={handleTagToggle}
        onClearFilters={clearFilters}
      />

      {/* Templates Grid */}
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4">
        {Object.keys(filteredTemplatesByCategory).length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later for more templates.
            </p>
          </div>
        ) : (
          Object.entries(filteredTemplatesByCategory).map(
            ([category, templates]) => (
              <div key={category} className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 capitalize border-b pb-2">
                  {category} Templates
                </h2>
                <div className="space-y-10">
                  <div className="flex flex-col gap-6 md:flex-row md:overflow-x-auto md:whitespace-nowrap md:snap-x md:snap-mandatory md:gap-8">
                    {templates.map((template) => (
                      <div key={template.id} className="flex-shrink-0">
                        <div className="w-[320px] min-w-[320px] max-w-[320px] bg-white rounded-lg shadow-sm flex flex-col border border-gray-100 hover:shadow-md transition-all snap-start">
                          <div className="flex items-center justify-center overflow-visible">
                            <div className="w-full aspect-[390/644] flex items-center justify-center overflow-hidden">
                              <TemplateThumbnail templateId={template.id} />
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="font-medium text-sm mb-1 whitespace-normal break-words">
                              {template.name}
                            </div>
                            <div className="text-xs text-gray-500 mb-3 whitespace-normal break-words">
                              {template.description}
                            </div>
                            <div className="flex-1" />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() =>
                                router.push(
                                  `/public/templates/${template.id}/preview`
                                )
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
