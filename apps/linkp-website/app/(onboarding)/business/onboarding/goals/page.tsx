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
import { goalsSchema } from "@/lib/validations/business-onboarding";
import { useOnboardingStore } from "@/lib/stores/business-onboarding-store";

type FormData = z.infer<typeof goalsSchema>;

const MARKETING_GOALS = [
  "Brand Awareness",
  "Lead Generation",
  "Sales",
  "Product Launch",
  "Community Building",
  "Other",
];

const KPIS = [
  "Impressions",
  "Clicks",
  "Conversions",
  "Sales",
  "Engagement Rate",
];

const AGE_RANGES = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"];

const INTERESTS = [
  "Technology",
  "Fashion",
  "Beauty",
  "Gaming",
  "Fitness",
  "Food",
  "Travel",
  "Business",
  "Entertainment",
];

export default function GoalsPage() {
  const router = useRouter();
  const { goals, setGoals } = useOnboardingStore();

  const form = useForm<FormData>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      monthlyBudget: goals.monthlyBudget || 0,
      marketingGoals: goals.marketingGoals || [],
      targetAudience: goals.targetAudience || {
        ageRange: [],
        interests: [],
        locations: [],
      },
      kpis: goals.kpis || [],
    },
  });

  function onSubmit(data: FormData) {
    setGoals(data);
    router.push("/business/onboarding/creator-preferences");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set your marketing goals</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Marketing Budget ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your monthly budget"
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
              name="marketingGoals"
              render={() => (
                <FormItem>
                  <FormLabel>Marketing Goals</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {MARKETING_GOALS.map((goal) => (
                      <FormField
                        key={goal}
                        control={form.control}
                        name="marketingGoals"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(goal)}
                                onCheckedChange={(checked) => {
                                  const goals = field.value || [];
                                  if (checked) {
                                    field.onChange([...goals, goal]);
                                  } else {
                                    field.onChange(
                                      goals.filter((g) => g !== goal)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {goal}
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

            <div className="space-y-4">
              <FormLabel>Target Audience</FormLabel>

              <FormField
                control={form.control}
                name="targetAudience.ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Age Range</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                      {AGE_RANGES.map((age) => (
                        <FormItem
                          key={age}
                          className="flex items-center space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(age)}
                              onCheckedChange={(checked) => {
                                const ages = field.value || [];
                                if (checked) {
                                  field.onChange([...ages, age]);
                                } else {
                                  field.onChange(ages.filter((a) => a !== age));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{age}</FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience.interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Interests</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                      {INTERESTS.map((interest) => (
                        <FormItem
                          key={interest}
                          className="flex items-center space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(interest)}
                              onCheckedChange={(checked) => {
                                const interests = field.value || [];
                                if (checked) {
                                  field.onChange([...interests, interest]);
                                } else {
                                  field.onChange(
                                    interests.filter((i) => i !== interest)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {interest}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="kpis"
              render={() => (
                <FormItem>
                  <FormLabel>Key Performance Indicators</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {KPIS.map((kpi) => (
                      <FormField
                        key={kpi}
                        control={form.control}
                        name="kpis"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(kpi)}
                                onCheckedChange={(checked) => {
                                  const kpis = field.value || [];
                                  if (checked) {
                                    field.onChange([...kpis, kpi]);
                                  } else {
                                    field.onChange(
                                      kpis.filter((k) => k !== kpi)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{kpi}</FormLabel>
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
