import { useState } from "react";
import { DateRange } from "../../types/filters";
import { useAnalyticsFilters } from "../../contexts/analytics-filters-context";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  className?: string;
  presets?: Array<{
    id: string;
    label: string;
    range: DateRange;
  }>;
}

export function DateRangeFilter({ className, presets }: DateRangeFilterProps) {
  const { filters, updateFilters } = useAnalyticsFilters();
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: NonNullable<typeof presets>[0]) => {
    updateFilters({ dateRange: preset.range });
    setIsOpen(false);
  };

  const handleCustomRange = (range: DateRange) => {
    updateFilters({ dateRange: range });
    setIsOpen(false);
  };

  const formatDateRange = (range: DateRange) => {
    const from = range.from.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const to = range.to.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${from} - ${to}`;
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span>{formatDateRange(filters.dateRange)}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-4 border rounded-md bg-white shadow-lg z-50 min-w-64">
          {/* Preset options */}
          {presets && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Quick Select</h3>
              <div className="space-y-1">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom date picker would go here */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Custom Range</h3>
            <div className="text-xs text-gray-500">
              Custom date picker implementation would go here
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
