// components/onboarding/workspace-form.tsx
"use client";

import { useState, useEffect, useOptimistic, startTransition } from "react";
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
import { useFormStatus } from "react-dom"; // New in React 19

interface Workspace {
  name: string;
  slug: string;
}

// Separate submit button component to leverage useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full text-xs" disabled={pending} type="submit">
      {pending ? "Creating..." : "Create workspace"}
    </Button>
  );
}

export default function WorkspaceForm() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");

  // Optimistic state management
  const [optimisticWorkspace, addOptimisticWorkspace] = useOptimistic<
    Workspace | null,
    Workspace
  >(
    null, // Initial state
    (currentState, newWorkspace: Workspace) => newWorkspace
  );

  // Sync workspace name with slug
  useEffect(() => {
    setWorkspaceSlug(workspaceName.toLowerCase().replace(/\s+/g, "-"));
  }, [workspaceName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const workspace = {
      name: workspaceName,
      slug: workspaceSlug,
    };

    try {
      // Show optimistic update
      startTransition(() => {
        addOptimisticWorkspace(workspace);
      });

      // Validate workspace slug<
      const response : Response = await fetch(
        "http://localhost:8787/api/workspace/verify-slug",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workspaceSlug),
        }
      );

      if (!response.data) throw new Error("Failed to create workspace");

      // Navigate to template selection
      const searchParams = new URLSearchParams({
        workspace: workspaceName,
        workspaceSlug: workspaceSlug,
      });

      router.push(`/onboarding/select-template?${searchParams.toString()}`);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // You could add error handling UI here
    }
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
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 items-start mt-8"
      >
        {/* Workspace Name Field */}
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
            placeholder="Acme, Inc."
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            required
          />
        </div>

        {/* Workspace Slug Field */}
        <div className="w-full">
          <div className="flex flex-row gap-2 items-start">
            <p className="font-paragraph text-xs pb-2">Workspace Slug</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CiCircleQuestion className="text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This is your workspace's unique slug on Linkp.co. Also on
                    which you will host your Page
                  </p>
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
              placeholder="acme-inc"
              value={workspaceSlug}
              onChange={(e) => setWorkspaceSlug(e.target.value)}
              required
            />
          </div>
        </div>

        <SubmitButton />
      </form>
      {/* Show immediate feedback using optimistic state */}
      {optimisticWorkspace && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          Creating workspace "{optimisticWorkspace.name}"...
        </div>
      )}
    </div>
  );
}
