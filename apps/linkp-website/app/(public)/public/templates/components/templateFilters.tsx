"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type FiltersProps = {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  selectedTags: string[];
  onCategoryChange: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
};

export default function TemplateFilters({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearFilters,
}: FiltersProps) {
  const [isSticky, setIsSticky] = useState(false);
  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0;

  // Handle scroll for sticky filter bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 250); // Adjust this value as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`bg-white py-4 transition-all duration-300 z-10 w-full
        ${isSticky ? "sticky top-0 shadow-md" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-shrink-0">
            <h3 className="font-semibold text-gray-800">Filters:</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* All Categories option */}
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer text-sm px-3 py-1"
              onClick={() => onCategoryChange(null)}
            >
              All Categories
            </Badge>
            
            {/* Category filters */}
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-sm capitalize px-3 py-1"
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="ml-auto text-gray-500 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Tag filters */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div 
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`
                  px-2 py-1 rounded-full text-xs cursor-pointer flex items-center gap-1
                  ${selectedTags.includes(tag) 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {selectedTags.includes(tag) && (
                  <Check className="h-3 w-3" />
                )}
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
