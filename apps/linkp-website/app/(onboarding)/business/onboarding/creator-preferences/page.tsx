"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { creatorPreferencesSchema } from "@/lib/validations/business-onboarding";
import { useOnboardingStore } from "@/lib/stores/business-onboarding-store";

type FormData = z.infer<typeof creatorPreferencesSchema>;

const CREATOR_CATEGORIES = [
  "Lifestyle",
  "Fashion",
  "Beauty",
  "Tech",
  "Gaming",
  "Food",
  "Travel",
  "Fitness",
  "Business",
  "Entertainment",
  "Education",
];

const CONTENT_TYPES = [
  "Photos",
  "Videos",
  "Stories",
  "Live Streams",
  "Blog Posts",
];

const LOCATIONS = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Australia",
];

export default function CreatorPreferencesPage() {
  const router = useRouter();
  const { creatorPreferences, setCreatorPreferences } = useOnboardingStore();

  const form = useForm<FormData>({
    resolver: zodResolver(creatorPreferencesSchema),
    defaultValues: {
      creatorCategories: creatorPreferences.creatorCategories || [],
      minFollowers: creatorPreferences.minFollowers || 1000,
      contentTypes: creatorPreferences.contentTypes || [],
      targetLocations: creatorPreferences.targetLocations || [],
    },
  });

  function onSubmit(data: FormData) {
    setCreatorPreferences(data);
    router.push("/business/onboarding/subscription");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="creatorCategories"
              render={() => (
                <FormItem>
                  <FormLabel>Creator Categories</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    {CREATOR_CATEGORIES.map((category) => (
                      <FormField
                        key={category}
                        control={form.control}
                        name="creatorCategories"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category)}
                                onCheckedChange={(checked) => {
                                  const categories = field.value || [];
                                  if (checked) {
                                    field.onChange([...categories, category]);
                                  } else {
                                    field.onChange(
                                      categories.filter((c) => c !== category)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {category}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minFollowers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Followers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter minimum followers"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentTypes"
              render={() => (
                <FormItem>
                  <FormLabel>Content Types</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {CONTENT_TYPES.map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="contentTypes"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type)}
                                onCheckedChange={(checked) => {
                                  const types = field.value || [];
                                  if (checked) {
                                    field.onChange([...types, type]);
                                  } else {
                                    field.onChange(
                                      types.filter((t) => t !== type)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {type}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetLocations"
              render={() => (
                <FormItem>
                  <FormLabel>Target Locations</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {LOCATIONS.map((location) => (
                      <FormField
                        key={location}
                        control={form.control}
                        name="targetLocations"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(location)}
                                onCheckedChange={(checked) => {
                                  const locations = field.value || [];
                                  if (checked) {
                                    field.onChange([...locations, location]);
                                  } else {
                                    field.onChange(
                                      locations.filter((l) => l !== location)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {location}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
