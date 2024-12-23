"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
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
import { APIResponse } from "@repo/db/types";
import { z } from "zod";

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
  const [state, formAction, pending] = useActionState(
    validateSlugDebounced,
    undefined
  );

  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    workspaceName?: string;
    workspaceSlug?: string;
  }>({});

  async function validateSlugDebounced(
    previousState: unknown,
    formData: FormData
  ) {
    // Validate form data using Zod
    const validationResult = WorkspaceSchema.safeParse({
      workspaceName: formData.get("workspaceName"),
      workspaceSlug: formData.get("workspaceSlug"),
    });

    // If validation fails, set errors and prevent submission
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setValidationErrors({
        workspaceName: errors.workspaceName?.[0],
        workspaceSlug: errors.workspaceSlug?.[0],
      });
      return null;
    }

    // Clear previous validation errors
    setValidationErrors({});

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log("API_BASE_URL:", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/api/workspace/verify-slug`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceSlug: formData.get("workspaceSlug") as string,
      }),
    });

    const result: APIResponse = await response.json();
    console.log("Slug validation result:", result.data);
    if (result.status === "success" && !result.data) {
      const searchParams = new URLSearchParams({
        workspace: formData.get("workspaceName") as string,
        workspaceSlug: formData.get("workspaceSlug") as string,
      });

      router.push(`/onboarding/select-template?${searchParams.toString()}`);
    }
    return result;
  }

  const handleWorkspaceNameChange = (e: any) => {
    const newValue = e.target.value;
    setWorkspaceName(newValue);

    // Auto-generate slug, but allow manual override
    const slugifiedValue = newValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    if (workspaceSlug === "" || workspaceSlug === workspaceName.toLowerCase()) {
      setWorkspaceSlug(slugifiedValue);
    }
  };

  const handleWorkspaceSlugChange = (e: any) => {
    const newValue = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");

    setWorkspaceSlug(newValue);
  };

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
        action={formAction}
        // onSubmit={handleSubmit}
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
            value={workspaceName} // Bind value to state
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
          {(validationErrors.workspaceSlug ||
            state?.status === "error" ||
            state?.data) && (
            <p className="text-red-600 text-xs mt-1">
              {validationErrors.workspaceSlug || state?.message}
            </p>
          )}
        </div>

        <Button
          className="w-full text-xs"
          aria-disabled={pending}
          type="submit"
        >
          {pending ? "Creating..." : "Create workspace"}
        </Button>
      </form>
    </div>
  );
}
