"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { BaseTemplateConfig } from "@/lib/templates/template-types";
import TemplateThumbnail from "@/app/(public)/public/templates/components/templateThumbnail";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithSession } from "@/lib/utils";
import useWorkspace from "@/lib/swr/use-workspace";

interface TemplateGridProps {
  templates: BaseTemplateConfig[];
  userId: string;
}

export function TemplateGrid({ templates, userId }: TemplateGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewWorkspace = searchParams.get("isNewWorkspace") === "true";
  const workspaceName = searchParams.get("workspace") || "";
  const workspaceSlug = searchParams.get("workspaceSlug") || "";
  const categories = useMemo(
    () => searchParams.get("categories")?.split(",") || [],
    [searchParams]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only fetch workspace if not creating a new one
  const workspaceHook = !isNewWorkspace ? useWorkspace() : null;
  const workspace = workspaceHook?.workspace;
  const isLoadingWorkspace = workspaceHook?.isLoading || false;
  const workspaceError = workspaceHook?.isError || false;
  const workspaceId = workspace?.id;

  async function handleSelectTemplate(templateId: string) {
    setIsSubmitting(true);
    const loadingToastId = toast.loading(
      isNewWorkspace ? "Creating workspace..." : "Selecting template..."
    );

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      let endpoint = "";
      let body: any = {};
      let method = "POST";

      if (isNewWorkspace) {
        endpoint = `${API_BASE_URL}/api/workspace/create`;
        body = {
          name: workspaceName,
          slug: workspaceSlug,
          userId,
          templateId,
          categories,
        };
        method = "POST";
      } else {
        if (!workspaceId) {
          toast.error("Workspace ID not found. Cannot select template.");
          setIsSubmitting(false);
          return;
        }
        endpoint = `${API_BASE_URL}/api/workspace/${workspaceId}`;
        body = {
          selectedTemplateId: templateId,
        };
        method = "PATCH";
      }

      const response = await fetchWithSession(endpoint, {
        method,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(
          error.message ||
            (isNewWorkspace
              ? "Failed to create workspace."
              : "Failed to update template.")
        );
      }

      toast.dismiss(loadingToastId);
      toast.success(
        isNewWorkspace ? "Workspace created!" : "Template selected!",
        {
          icon: <CheckCircle className="h-4 w-4" />,
        }
      );

      // Redirect to dashboard or next onboarding step
      if (isNewWorkspace) {
        const json = (await response.json()) as { data: { slug: string } };
        router.push(`/dashboard/${json.data.slug}/links`);
      } else {
        router.push("/creator/workspace");
      }
    } catch (error) {
      console.error("Error selecting template:", error);
      toast.dismiss(loadingToastId);
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
        {
          icon: <AlertTriangle className="h-4 w-4" />,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Button disabled logic
  const isButtonDisabled =
    isSubmitting ||
    (!isNewWorkspace &&
      (isLoadingWorkspace || !workspaceId || !!workspaceError));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-8">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Thumbnail Area */}
          <div className="aspect-[9/16] w-full overflow-hidden relative bg-gray-100 dark:bg-gray-700">
            <TemplateThumbnail templateId={template.id} />
            {/* Optional: Add overlay on hover */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Content Area */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-base mb-1 text-gray-800 dark:text-gray-100 line-clamp-1">
              {template.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 h-8">
              {template.description}
            </p>
            <div className="flex-grow" /> {/* Pushes button to bottom */}
            {/* Selection Button */}
            <Button
              type="button"
              variant="default"
              size="sm"
              className="w-full mt-2 transition-all"
              disabled={isButtonDisabled}
              aria-disabled={isButtonDisabled}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {isSubmitting
                ? isNewWorkspace
                  ? "Creating..."
                  : "Selecting..."
                : isButtonDisabled
                  ? isNewWorkspace
                    ? "Cannot Create"
                    : "Cannot Select"
                  : isNewWorkspace
                    ? "Create Workspace"
                    : "Select Template"}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
