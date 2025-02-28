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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { subscriptionSchema } from "@/lib/validations/business-onboarding";
import { useOnboardingStore } from "@/lib/stores/business-onboarding-store";

type FormData = z.infer<typeof subscriptionSchema>;

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for small businesses",
    price: 0,
    features: [
      "Up to 5 creator collaborations",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for growing businesses",
    price: 49,
    features: [
      "Up to 20 creator collaborations",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Enterprise-grade features for large businesses",
    price: 99,
    features: [
      "Unlimited creator collaborations",
      "Enterprise analytics",
      "24/7 support",
      "Custom branding",
      "API access",
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { subscription, setSubscription } = useOnboardingStore();

  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      plan: subscription.plan || "free",
      billingCycle: subscription.billingCycle || "monthly",
      acceptedTerms: subscription.acceptedTerms || false,
    },
  });

  async function onSubmit(data: FormData) {
    setSubscription(data);

    // Here we would typically submit all the data to the server
    const store = useOnboardingStore.getState();

    try {
      // Submit to API
      const response = await fetch("/api/business/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...store.companyProfile,
          ...store.goals,
          ...store.creatorPreferences,
          ...store.subscription,
        }),
      });

      if (!response.ok) throw new Error("Failed to complete onboarding");

      // Clear the store
      store.reset();

      // Redirect to dashboard
      router.push("/business/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      // Handle error (show toast, etc.)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose your plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-8"
                    >
                      {SUBSCRIPTION_PLANS.map((plan) => (
                        <FormItem key={plan.id}>
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value={plan.id}
                                id={plan.id}
                                className="sr-only"
                              />
                              <label
                                htmlFor={plan.id}
                                className={`block cursor-pointer rounded-lg border p-6 hover:border-primary ${
                                  field.value === plan.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                                }`}
                              >
                                <div className="font-semibold">{plan.name}</div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {plan.description}
                                </div>
                                <div className="mt-4 font-semibold">
                                  ${plan.price}
                                  <span className="text-sm font-normal text-muted-foreground">
                                    /month
                                  </span>
                                </div>
                                <ul className="mt-4 space-y-2 text-sm">
                                  {plan.features.map((feature) => (
                                    <li
                                      key={feature}
                                      className="flex items-center"
                                    >
                                      <svg
                                        className="mr-2 h-4 w-4 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Cycle</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="monthly" />
                        </FormControl>
                        <FormLabel className="font-normal">Monthly</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yearly" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yearly (Save 20%)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptedTerms"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Terms and Conditions</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      I agree to the terms of service and privacy policy
                    </p>
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
              <Button type="submit">Complete Setup</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
