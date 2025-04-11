// apps/linkp-website/app/(onboarding)/business/onboarding/creator-preferences/page.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { creatorPreferencesSchema } from "@/lib/validations/business-onboarding";
import { useOnboardingStore } from "@/lib/stores/business-onboarding-store";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Users, Camera, Map } from "lucide-react";

// Constants for form options
const CREATOR_CATEGORIES = [
  "Tech",
  "Fashion",
  "Beauty",
  "Gaming",
  "Fitness",
  "Food",
  "Travel",
  "Finance",
  "Education",
  "Entertainment",
  "Sports",
  "Lifestyle",
];

const CONTENT_TYPES = [
  { id: "photos", label: "Photos", value: "Photos" as const },
  { id: "videos", label: "Videos", value: "Videos" as const },
  { id: "stories", label: "Stories", value: "Stories" as const },
  { id: "live-streams", label: "Live Streams", value: "Live Streams" as const },
  { id: "blog-posts", label: "Blog Posts", value: "Blog Posts" as const },
] as const;

type ContentType = (typeof CONTENT_TYPES)[number]["value"];

const POPULAR_LOCATIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "India",
  "Spain",
];

type CreatorPreferencesValues = Zod.infer<typeof creatorPreferencesSchema>;

export default function CreatorPreferencesPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { creatorPreferences, setCreatorPreferences } = useOnboardingStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    creatorPreferences.creatorCategories || []
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    creatorPreferences.targetLocations || []
  );
  const [locationInput, setLocationInput] = useState("");

  const form = useForm<CreatorPreferencesValues>({
    resolver: zodResolver(creatorPreferencesSchema),
    defaultValues: {
      creatorCategories: creatorPreferences.creatorCategories || [],
      minFollowers: creatorPreferences.minFollowers || 1000,
      targetLocations: creatorPreferences.targetLocations || [],
    },
  });

  const addLocation = () => {
    if (locationInput && !selectedLocations.includes(locationInput)) {
      const newLocations = [...selectedLocations, locationInput];
      setSelectedLocations(newLocations);
      form.setValue("targetLocations", newLocations);
      setLocationInput("");
    }
  };

  const removeLocation = (location: string) => {
    const newLocations = selectedLocations.filter((i) => i !== location);
    setSelectedLocations(newLocations);
    form.setValue("targetLocations", newLocations);
  };

  async function onSubmit(values: CreatorPreferencesValues) {
    try {
      setIsSubmitting(true);

      // 1. Format data to align with the businessPreferences table schema
      const formattedPreferences = {
        creatorCategories: values.creatorCategories,
        minFollowers: values.minFollowers,
        targetLocations: values.targetLocations || [], // Handle empty array case
      };

      // 2. Update local store with formatted values
      setCreatorPreferences(formattedPreferences);

      // 3. Optionally, we could send this data to the API
      // This would typically happen at the final step of onboarding
      // but we could also store it incrementally
      /*
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      await BusinessService.savePreferences(formattedPreferences);
    }
    */

      // 4. Log success for debugging (remove in production)
      console.log("Business preferences saved:", formattedPreferences);

      // 5. Navigate to next step
      router.push("/business/onboarding/subscription");
    } catch (error) {
      // Handle errors gracefully
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save preferences";
      toast.error(`Failed to save creator preferences: ${errorMessage}`);
      console.error("Creator preferences error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Creator Categories */}
            <FormField
              control={form.control}
              name="creatorCategories"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Creator Categories</FormLabel>
                    <Users className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Select the types of creators you want to work with
                  </FormDescription>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {CREATOR_CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          selectedCategories.includes(category)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          if (selectedCategories.includes(category)) {
                            const newCategories = selectedCategories.filter(
                              (c) => c !== category
                            );
                            setSelectedCategories(newCategories);
                            field.onChange(newCategories);
                          } else {
                            const newCategories = [
                              ...selectedCategories,
                              category,
                            ];
                            setSelectedCategories(newCategories);
                            field.onChange(newCategories);
                          }
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Followers */}
            <FormField
              control={form.control}
              name="minFollowers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Followers</FormLabel>
                  <FormDescription>
                    Set the minimum follower count for creator collaborations
                  </FormDescription>
                  <div className="space-y-4">
                    <Slider
                      min={1000}
                      max={1000000}
                      step={1000}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <div className="flex justify-between">
                      <span>1K</span>
                      <span className="font-medium">
                        {field.value >= 1000000
                          ? "1M+"
                          : `${(field.value / 1000).toFixed(0)}K`}
                      </span>
                      <span>1M+</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Locations */}
            <FormField
              control={form.control}
              name="targetLocations"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Target Locations (Optional)</FormLabel>
                    <Map className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Select or add locations where you want to target creators
                  </FormDescription>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {POPULAR_LOCATIONS.map((location) => (
                      <Badge
                        key={location}
                        variant={
                          selectedLocations.includes(location)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          if (selectedLocations.includes(location)) {
                            removeLocation(location);
                          } else {
                            const newLocations = [
                              ...selectedLocations,
                              location,
                            ];
                            setSelectedLocations(newLocations);
                            field.onChange(newLocations);
                          }
                        }}
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex mt-4">
                    <Input
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Add custom location"
                      className="mr-2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLocation}
                    >
                      Add
                    </Button>
                  </div>

                  {selectedLocations.length > 0 && (
                    <div className="mt-4">
                      <FormLabel>Selected Locations:</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedLocations.map((location) => (
                          <Badge key={location} className="cursor-pointer">
                            {location}
                            <span
                              className="ml-1 cursor-pointer"
                              onClick={() => removeLocation(location)}
                            >
                              ×
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
