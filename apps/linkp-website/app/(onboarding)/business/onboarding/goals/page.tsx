// apps/linkp-website/app/(onboarding)/business/onboarding/goals/page.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { goalsSchema } from "@/lib/validations/business-onboarding";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Target, Users, BarChart } from "lucide-react";

// Updated constants for link-specific objectives and metrics
const LINK_OBJECTIVES = [
  {
    id: "drive-traffic",
    label: "Drive Traffic to Product/Service",
    value: "Drive Traffic" as const,
  },
  {
    id: "generate-leads",
    label: "Generate Leads/Signups",
    value: "Generate Leads" as const,
  },
  {
    id: "direct-sales",
    label: "Direct Sales",
    value: "Direct Sales" as const,
  },
  {
    id: "limited-offer",
    label: "Promote Limited Time Offer",
    value: "Limited Offer" as const,
  },
  {
    id: "content-promotion",
    label: "Promote Content",
    value: "Content Promotion" as const,
  },
] as const;

const AGE_RANGES = [
  { id: "13-17", label: "13-17", value: "13-17" },
  { id: "18-24", label: "18-24", value: "18-24" },
  { id: "25-34", label: "25-34", value: "25-34" },
  { id: "35-44", label: "35-44", value: "35-44" },
  { id: "45-54", label: "45-54", value: "45-54" },
  { id: "55+", label: "55+", value: "55+" },
];

const INTEREST_OPTIONS = [
  "Technology",
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

// Updated link-specific metrics
const LINK_METRICS = [
  { id: "clicks", label: "Total Clicks", value: "Clicks" as const },
  { id: "ctr", label: "Click-Through Rate", value: "CTR" as const },
  { id: "conversions", label: "Conversions", value: "Conversions" as const },
  { id: "cpc", label: "Cost Per Click", value: "CPC" as const },
  { id: "roi", label: "Return on Investment", value: "ROI" as const },
  {
    id: "position-performance",
    label: "Position Performance",
    value: "Position Performance" as const,
  },
] as const;

type GoalsValues = Zod.infer<typeof goalsSchema>;
type LinkObjective = (typeof LINK_OBJECTIVES)[number]["value"];
type LinkMetric = (typeof LINK_METRICS)[number]["value"];

export default function GoalsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { goals, setGoals } = useOnboardingStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    goals.targetAudience?.interests || []
  );
  const [interestInput, setInterestInput] = useState("");

  const form = useForm<GoalsValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      monthlyBudget: goals.monthlyBudget || 0,
      linkObjectives: goals.linkObjectives || [],
      targetAudience: {
        ageRange: goals.targetAudience?.ageRange || [],
        interests: goals.targetAudience?.interests || [],
      },
      linkMetrics: goals.linkMetrics || [],
    },
  });

  const addInterest = () => {
    if (interestInput && !selectedInterests.includes(interestInput)) {
      const newInterests = [...selectedInterests, interestInput];
      setSelectedInterests(newInterests);
      form.setValue("targetAudience.interests", newInterests);
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    const newInterests = selectedInterests.filter((i) => i !== interest);
    setSelectedInterests(newInterests);
    form.setValue("targetAudience.interests", newInterests);
  };

  async function onSubmit(values: GoalsValues) {
    try {
      setIsSubmitting(true);
      setGoals(values);
      router.push("/business/onboarding/creator-preferences");
    } catch (error) {
      toast.error("Failed to save goals");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Goals & Targeting</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Monthly Budget */}
            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget</FormLabel>
                  <FormDescription>
                    Set your monthly budget for promotional links on creator
                    profiles
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-10"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link Objectives */}
            <FormField
              control={form.control}
              name="linkObjectives"
              render={() => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Link Objectives</FormLabel>
                    <Target className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Select what you want to achieve with your promotional links
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {LINK_OBJECTIVES.map((objective) => (
                      <FormField
                        key={objective.id}
                        control={form.control}
                        name="linkObjectives"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={objective.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    objective.value
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          objective.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== objective.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {objective.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Audience */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FormLabel className="text-base">Target Audience</FormLabel>
                <Users className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Age Range */}
              <FormField
                control={form.control}
                name="targetAudience.ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Range</FormLabel>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {AGE_RANGES.map((age) => (
                        <FormField
                          key={age.id}
                          control={form.control}
                          name="targetAudience.ageRange"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={age.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(age.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            age.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== age.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {age.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Interests */}
              <FormField
                control={form.control}
                name="targetAudience.interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormDescription>
                      Select interests relevant to your target audience
                    </FormDescription>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {INTEREST_OPTIONS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={
                            selectedInterests.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            if (selectedInterests.includes(interest)) {
                              removeInterest(interest);
                            } else {
                              const newInterests = [
                                ...selectedInterests,
                                interest,
                              ];
                              setSelectedInterests(newInterests);
                              field.onChange(newInterests);
                            }
                          }}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex mt-4">
                      <Input
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        placeholder="Add custom interest"
                        className="mr-2"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInterest}
                      >
                        Add
                      </Button>
                    </div>

                    {selectedInterests.length > 0 && (
                      <div className="mt-4">
                        <FormLabel>Selected Interests:</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedInterests.map((interest) => (
                            <Badge key={interest} className="cursor-pointer">
                              {interest}
                              <span
                                className="ml-1 cursor-pointer"
                                onClick={() => removeInterest(interest)}
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
            </div>

            {/* Link Performance Metrics */}
            <FormField
              control={form.control}
              name="linkMetrics"
              render={() => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Link Performance Metrics</FormLabel>
                    <BarChart className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Select metrics for measuring your promotional link
                    performance
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {LINK_METRICS.map((metric) => (
                      <FormField
                        key={metric.id}
                        control={form.control}
                        name="linkMetrics"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={metric.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(metric.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          metric.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== metric.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {metric.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
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
