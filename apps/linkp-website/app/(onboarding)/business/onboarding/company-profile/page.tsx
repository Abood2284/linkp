// apps/linkp-website/app/(onboarding)/business/onboarding/company-profile/page.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { companyProfileSchema } from "@/lib/validations/business-onboarding";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Globe } from "lucide-react";

type CompanyProfileValues = Zod.infer<typeof companyProfileSchema>;

export default function CompanyProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { companyProfile, setCompanyProfile } = useOnboardingStore();

  const form = useForm<CompanyProfileValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: companyProfile.companyName || "",
      industry: companyProfile.industry || undefined,
      website: companyProfile.website || "",
    },
  });

  async function onSubmit(values: CompanyProfileValues) {
    try {
      setIsSubmitting(true);
      setCompanyProfile(values);
      router.push("/business/onboarding/goals");
    } catch (error) {
      toast.error("Failed to save company profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormDescription>
                      This will be visible to creators reviewing your link
                      proposals
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          placeholder="Acme Inc."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormDescription>
                      Helps match you with relevant creators
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Agency">Agency</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Food & Beverage">
                          Food & Beverage
                        </SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormDescription>
                      Your website or landing page for promotional links
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          placeholder="https://example.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
