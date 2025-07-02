// apps/linkp-website/app/(onboarding)/business/onboarding/subscription/page.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { subscriptionSchema } from "@/lib/validations/business-onboarding";
import { useOnboardingStore } from "@/lib/stores/business-onboarding-store";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, CreditCard } from "lucide-react";
import { fetchWithSession } from "@/lib/utils";
import * as z from "zod";

type SubscriptionValues = z.infer<typeof subscriptionSchema>;

const plans = [
  {
    id: "free" as const,
    name: "Basic",
    description: "Essential tools to start your creator collaborations",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "5 active collaborations",
      "Basic analytics",
      "Standard support",
      "Manual payments",
    ],
    limitations: ["No advanced targeting", "No priority listing"],
  },
  {
    id: "pro" as const,
    name: "Professional",
    description: "Enhanced tools for growing your creator marketing",
    price: {
      monthly: 49,
      yearly: 470,
    },
    features: [
      "25 active collaborations",
      "Advanced analytics",
      "Priority support",
      "Automated payments",
      "Creator discovery tools",
      "Campaign templates",
    ],
    limitations: [],
  },
  {
    id: "business" as const,
    name: "Enterprise",
    description: "Complete solution for scaling creator partnerships",
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      "Unlimited collaborations",
      "Real-time analytics",
      "Dedicated support",
      "Escrow payments",
      "Advanced creator matching",
      "Custom reporting",
      "API access",
    ],
    limitations: [],
  },
] as const;

type PlanId = (typeof plans)[number]["id"];

export default function SubscriptionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    companyProfile,
    goals,
    creatorPreferences,
    setSubscription,
    subscription,
  } = useOnboardingStore();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    subscription.billingCycle || "monthly"
  );

  const form = useForm<SubscriptionValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      plan: subscription.plan || "free",
      billingCycle: subscription.billingCycle || "monthly",
      acceptedTerms: subscription.acceptedTerms || false,
    },
  });

  const watchPlan = form.watch("plan");

  const handleBillingCycleChange = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
    form.setValue("billingCycle", cycle);
  };

  async function onSubmit(values: SubscriptionValues) {
    try {
      setIsSubmitting(true);

      // Update local store with form values
      setSubscription(values);

      // Get all onboarding data from the store using the destructured variables
      const onboardingData = {
        companyProfile,
        goals,
        creatorPreferences,
        subscription: values,
      };

      // Submit to API
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetchWithSession(
        `${API_BASE_URL}/api/business/complete-onboarding`,
        {
          method: "POST",
          body: JSON.stringify(onboardingData),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as Error;
        throw new Error(errorData.message || "Failed to complete onboarding");
      }
      console.log(
        `🚧[BusinessSubscriptionPage] API response: ${response.status}`
      );
      // Show success message
      toast.success("Your business account has been set up successfully!");

      // IMPORTANT: Reset the store after successful submission
      useOnboardingStore.getState().reset();

      // Navigate to dashboard
      router.push("/business/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to complete setup";
      toast.error(errorMessage);
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          variant={billingCycle === "monthly" ? "default" : "outline"}
          onClick={() => handleBillingCycleChange("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === "yearly" ? "default" : "outline"}
          onClick={() => handleBillingCycleChange("yearly")}
        >
          Yearly (Save 20%)
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {plans.map((plan) => (
                    <FormItem key={plan.id}>
                      <FormControl>
                        <RadioGroupItem
                          value={plan.id}
                          className="sr-only"
                          id={`plan-${plan.id}`}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`plan-${plan.id}`}
                        className="cursor-pointer"
                      >
                        <Card
                          className={`h-full ${watchPlan === plan.id ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>
                              {plan.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="mb-4">
                              <span className="text-3xl font-bold">
                                $
                                {billingCycle === "monthly"
                                  ? plan.price.monthly
                                  : plan.price.yearly}
                              </span>
                              <span className="text-muted-foreground">
                                /{billingCycle === "monthly" ? "month" : "year"}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <Check className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                              {plan.limitations.map((limitation, index) => (
                                <li
                                  key={index}
                                  className="flex items-center text-muted-foreground"
                                >
                                  <X className="h-4 w-4 text-red-500 mr-2" />
                                  <span className="text-sm">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button
                              type="button"
                              variant={
                                watchPlan === plan.id ? "default" : "outline"
                              }
                              className="w-full"
                              onClick={() => form.setValue("plan", plan.id)}
                            >
                              {watchPlan === plan.id
                                ? "Selected"
                                : "Select Plan"}
                            </Button>
                          </CardFooter>
                        </Card>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-8">
            <FormField
              control={form.control}
              name="acceptedTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms of service and privacy policy
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our Terms of Service
                      and Privacy Policy.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <CreditCard className="mr-2 h-4 w-4" />
            {isSubmitting
              ? "Processing..."
              : watchPlan === "free"
                ? "Complete Setup"
                : "Proceed to Payment"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
