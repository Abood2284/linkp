"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdWorkspaces } from "react-icons/md";
import { CiCircleQuestion } from "react-icons/ci";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APIResponse, WorkspaceSlugResponse } from "@repo/db/types";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";

const WorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters" }),
  workspaceSlug: z
    .string()
    .min(2, { message: "Workspace slug must be at least 2 characters" })
    .max(50, { message: "Workspace slug must be at most 50 characters" })
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Workspace slug can only contain lowercase letters, numbers, and underscores",
    }),
});

export default function WorkspaceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    workspaceName?: string;
    workspaceSlug?: string;
  }>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Debounced validation function
  const debouncedValidate = useDebouncedCallback(async (slug: string) => {
    if (!slug) return;

    try {
      setIsValidating(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${API_BASE_URL}/api/workspace/verify-slug`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workspaceSlug: slug }),
        }
      );

      const result: WorkspaceSlugResponse = await response.json();
      if (!result.data) {
        setValidationErrors((prev) => ({
          ...prev,
          workspaceSlug: result.message,
        }));
      } else {
        // Only keep errors that are not undefined
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.workspaceSlug;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  }, 500);

  const handleWorkspaceNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setWorkspaceName(newName);

      // Auto-generate slug if it hasn't been manually edited
      if (
        workspaceSlug === "" ||
        workspaceSlug ===
          workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "_")
      ) {
        const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
        setWorkspaceSlug(newSlug);
        debouncedValidate(newSlug);
      }
    },
    [workspaceSlug, workspaceName, debouncedValidate]
  );

  const handleWorkspaceSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
      setWorkspaceSlug(newSlug);
      debouncedValidate(newSlug);
    },
    [debouncedValidate]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPending(true);

      try {
        // Validate form data using Zod
        const validationResult = WorkspaceSchema.safeParse({
          workspaceName,
          workspaceSlug,
        });

        // If validation fails, set errors and prevent submission
        if (!validationResult.success) {
          const errors = validationResult.error.flatten().fieldErrors;
          const newErrors: Record<string, string | undefined> = {};
          if (errors.workspaceName?.[0])
            newErrors.workspaceName = errors.workspaceName[0];
          if (errors.workspaceSlug?.[0])
            newErrors.workspaceSlug = errors.workspaceSlug[0];
          setValidationErrors(newErrors);
          return;
        }

        // Clear previous validation errors
        setValidationErrors({});

        // Create new URLSearchParams while preserving existing ones
        const newSearchParams = new URLSearchParams(searchParams.toString());

        // Add new workspace params
        newSearchParams.set("workspace", workspaceName);
        newSearchParams.set("workspaceSlug", workspaceSlug);

        // Optimistically navigate
        router.push(`/creator/select-template?${newSearchParams.toString()}`);
      } catch (error) {
        console.error("Submission error:", error);
        setValidationErrors({
          workspaceSlug: "An error occurred. Please try again.",
        });
      } finally {
        setIsPending(false);
      }
    },
    [workspaceName, workspaceSlug, searchParams, router]
  );

  const isSubmitDisabled =
    isPending ||
    isValidating ||
    !workspaceName ||
    !workspaceSlug ||
    Object.values(validationErrors).filter(Boolean).length > 0;

  return (
    <div className="mt-[12%] w-[25%] mx-auto">
      <div className="flex flex-col justify-center items-center">
        <div className="border border-gray-400 rounded-full p-2">
          <MdWorkspaces className="h-4 w-4" />
        </div>
        <h4 className="font-medium font-heading text-2xl">
          Create a workspace
        </h4>
        <Link href="/help/article/what-is-a-workspace">
          <p className="underline text-sm text-gray-600 font-paragraph">
            what is a workspace?
          </p>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 items-start mt-8"
      >
        {/* Workspace Name */}
        <div className="w-full">
          <div className="flex flex-row gap-2 items-start">
            <p className="font-paragraph text-xs pb-2">Workspace Name</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CiCircleQuestion className="text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is the name of your workspace on Linkp.co.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            className="text-xs"
            type="text"
            name="workspaceName"
            placeholder="Acme, Inc."
            value={workspaceName}
            onChange={handleWorkspaceNameChange}
            required
          />
          {validationErrors.workspaceName && (
            <p className="text-red-600 text-xs mt-1">
              {validationErrors.workspaceName}
            </p>
          )}
        </div>

        {/* Workspace Slug */}
        <div className="w-full">
          <div className="flex flex-row gap-2 items-start">
            <p className="font-paragraph text-xs pb-2">Workspace Slug</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CiCircleQuestion className="text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is your workspace&apos;s unique slug on Linkp.co.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-row">
            <div className="border border-gray-400 rounded-r-sm rounded-l-md p-2 text-center text-gray-500 text-xs bg-gray-100">
              linkp.co/
            </div>
            <Input
              className="rounded-l-sm border-l-0 text-xs"
              type="text"
              name="workspaceSlug"
              placeholder="acme-inc"
              value={workspaceSlug}
              onChange={handleWorkspaceSlugChange}
              required
            />
          </div>
          {validationErrors.workspaceSlug && (
            <p className="text-red-600 text-xs mt-1">
              {validationErrors.workspaceSlug}
            </p>
          )}
        </div>

        <Button
          className="w-full text-xs"
          disabled={isSubmitDisabled}
          type="submit"
        >
          {isPending || isValidating ? "Validating..." : "Create workspace"}
        </Button>
      </form>
    </div>
  );
}
