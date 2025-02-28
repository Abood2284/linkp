"use client";

import { motion } from "framer-motion";
import { TemplateCard } from "./templateCard";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { useSearchParams, useRouter } from "next/navigation";
import { InsertCreator, InsertWorkspace } from "@repo/db/schema";
import { APIResponse } from "@repo/db/types";
import { useSession } from "next-auth/react";
import { fetchWithSession } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useCallback } from "react";

interface OnboardingData {
  workspace: InsertWorkspace;
  creator?: InsertCreator;
  onboardingCompleted?: boolean;
}

type TemplateGridProps = {
  templates: BaseTemplateConfig[];
  userId: string;
};

export function TemplateGrid({ templates, userId }: TemplateGridProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract all URL parameters
  const categories = searchParams.get("categories")?.split(",") || [];
  const workspace = searchParams.get("workspace") || "";
  const workspaceSlug = searchParams.get("workspaceSlug") || "";
  const isNewWorkspace = searchParams.get("isNewWorkspace") === "true";

  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Prepare workspace data
        const workspaceData: InsertWorkspace = {
          name: workspace,
          slug: workspaceSlug,
          userId: userId,
          templateId: templateId,
          isActive: true,
        };

        // Prepare onboarding data based on the scenario
        const onboardingData: OnboardingData = {
          workspace: workspaceData,
        };

        // If this is part of initial onboarding, include creator data
        if (!isNewWorkspace) {
          onboardingData.creator = {
            userId: userId,
            categories: categories,
            subscriptionTier: "free",
            subscriptionStatus: "trial",
            defaultWorkspace: workspaceSlug,
          };
          onboardingData.onboardingCompleted = true;
        }

        // * Determine which API endpoint to use, if we are creating a new workspace, we use the `workspace/create` endpoint, if we are completing onboarding, we use the `onboarding/complete` endpoint
        const endpoint = isNewWorkspace
          ? `${API_BASE_URL}/api/workspace/create`
          : `${API_BASE_URL}/api/onboarding/complete`;

        // Optimistically show success message
        const loadingToastId = toast.loading(
          isNewWorkspace
            ? "Creating your workspace..."
            : "Setting up your workspace..."
        );

        const body = isNewWorkspace ? workspaceData : onboardingData;
        console.log("➡️ Body:", body);
        // Make the API call
        const response = await fetchWithSession(endpoint, {
          method: "POST",
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const error = (await response.json()) as { message: string };
          throw new Error(error.message || "Failed to complete operation");
        }

        const { data }: APIResponse = await response.json();

        // Update loading toast to success
        toast.dismiss(loadingToastId);
        toast.success(
          isNewWorkspace
            ? "New workspace created successfully!"
            : "Your workspace is ready!"
        );

        // Optimistically redirect
        router.push(
          `/dashboard/${isNewWorkspace ? data.slug : data.workspace.slug}`
        );
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      workspace,
      workspaceSlug,
      userId,
      isNewWorkspace,
      categories,
      router,
    ]
  );

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TemplateCard
            template={template}
            onSelect={handleTemplateSelect}
            disabled={isSubmitting}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
