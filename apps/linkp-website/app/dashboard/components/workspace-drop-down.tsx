"use client";

import {
  Check,
  ChevronRight,
  HelpCircle,
  FileText,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { WorkspaceType } from "@repo/db/types";
import {
  WorkspaceSchema,
  generateWorkspaceSlug,
  verifyWorkspaceSlug,
} from "@/lib/validations/workspace";
import { revalidateWorkspaces } from "@/lib/swr/use-workspaces";

export function WorkspaceDropDown({
  workspaces,
  onWorkspaceChange,
}: {
  workspaces: WorkspaceType[];
  onWorkspaceChange?: (workspace: WorkspaceType) => void;
}) {
  const { data: session } = useSession();
  console.log("🎯 WorkspaceDropDown Render", {
    workspacesCount: workspaces.length,
  });

  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [workspaceSlug, setWorkspaceSlug] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  );

  // Update value when params change or workspaces load
  useEffect(() => {
    const currentSlug = params?.slug as string;
    console.log("🔄 WorkspaceDropDown useEffect", {
      currentSlug,
      workspacesCount: workspaces.length,
      currentValue: value,
    });

    if (currentSlug) {
      console.log("📍 Setting value to currentSlug:", currentSlug);
      setValue(currentSlug);
    } else if (workspaces.length > 0 && !value) {
      console.log("📍 Setting value to first workspace:", workspaces[0].slug);
      setValue(workspaces[0].slug);
    }
  }, [params?.slug, workspaces, value]);

  const selectedWorkspace = React.useMemo(() => {
    const workspace = workspaces.find((workspace) => workspace.slug === value);
    console.log("🎯 Workspace Selection:", {
      value,
      workspaceExists: !!workspace,
      availableSlugs: workspaces.map((w) => w.slug),
      fallbackToFirst: !workspace && workspaces.length > 0,
    });

    // Only fallback to first workspace if no slug in URL
    if (!workspace && !value && workspaces.length > 0) {
      return workspaces[0];
    }

    // Otherwise, show loading state
    return (
      workspace || {
        name: "Loading...",
        slug: value || "unknown",
        id: "loading",
      }
    );
  }, [workspaces, value]);

  const handleWorkspaceChange = async (slug: string) => {
    console.log("🔄 Handling Workspace Change:", { newSlug: slug });
    try {
      setValue(slug);
      const workspace = workspaces.find((w) => w.slug === slug);
      if (workspace && onWorkspaceChange) {
        onWorkspaceChange(workspace);
      }
      router.push(`/dashboard/${slug}/links`);
    } catch (error) {
      console.error("❌ Error changing workspace:", error);
    }
  };

  const handleHelpCenter = () => {
    router.push("/help");
  };

  const handleDocumentation = () => {
    router.push("/docs");
  };

  const handleCreateWorkspace = () => {
    setOpen(false);
    setShowCreateDialog(true);
  };

  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newName = e.target.value;
    setWorkspaceName(newName);

    // Auto-generate slug if it hasn't been manually edited
    if (
      workspaceSlug === "" ||
      workspaceSlug === generateWorkspaceSlug(workspaceName)
    ) {
      setWorkspaceSlug(generateWorkspaceSlug(newName));
    }
  };

  const handleWorkspaceSlugChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setWorkspaceSlug(newSlug);
  };

  const handleCreateWorkspaceSubmit = async () => {
    console.log("�� Starting workspace validation:", {
      name: workspaceName,
      slug: workspaceSlug,
    });

    try {
      setIsSubmitting(true);
      setValidationError(null);

      const validationResult = WorkspaceSchema.safeParse({
        workspaceName,
        workspaceSlug,
      });

      if (!validationResult.success) {
        console.log(
          "❌ Validation failed:",
          validationResult.error.errors[0].message
        );
        setValidationError(validationResult.error.errors[0].message);
        return;
      }

      const slugVerification = await verifyWorkspaceSlug(workspaceSlug);
      console.log("✅ Slug verification result:", slugVerification);

      if (!slugVerification.isAvailable) {
        console.log("❌ Slug not available:", slugVerification.message);
        setValidationError(
          slugVerification.message || "Workspace slug is not available"
        );
        return;
      }

      setShowCreateDialog(false);

      const searchParams = new URLSearchParams({
        workspace: workspaceName,
        workspaceSlug: workspaceSlug,
        userId: session?.user?.id || "",
        isNewWorkspace: "true",
      });

      console.log("➡️ Redirecting to template selection");
      router.push(`/creator/select-template?${searchParams.toString()}`);
    } catch (error) {
      console.error("❌ Error validating workspace:", error);
      setValidationError("An error occurred while validating the workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="justify-between h-auto py-3 px-2 font-normal w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-red-100 text-red-700 h-8 w-8 rounded-lg font-semibold">
                {selectedWorkspace.name.substring(0, 2).toUpperCase() || "NA"}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm">
                  {selectedWorkspace.slug || "Unknown"}
                </span>
                <span className="text-xs text-muted-foreground">Free</span>
              </div>
            </div>
            <ChevronsUpDown className="h-2 w-2 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                <CommandItem onSelect={handleHelpCenter}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Center
                </CommandItem>
                <CommandItem onSelect={handleDocumentation}>
                  <FileText className="mr-2 h-4 w-4" />
                  Documentation
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Workspaces">
                {workspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.slug}
                    value={workspace.slug}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      handleWorkspaceChange(currentValue);
                    }}
                    className={cn(
                      workspace.slug === selectedWorkspace.slug && "bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center bg-red-100 text-red-700 h-6 w-6 rounded font-medium text-sm">
                        {workspace.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{workspace.slug}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        workspace.slug === selectedWorkspace.slug
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={handleCreateWorkspace}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white rounded-[40%]" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Create a new workspace
            </DialogTitle>
            <DialogDescription className="text-center">
              <button className="text-sm text-muted-foreground underline">
                What is a workspace?
              </button>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="Acme, Inc."
                value={workspaceName}
                onChange={handleWorkspaceNameChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Workspace Slug</Label>
              <div className="flex">
                <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground text-sm">
                  linkp.co/
                </div>
                <Input
                  id="workspace-slug"
                  className="rounded-l-none"
                  placeholder="acme"
                  value={workspaceSlug}
                  onChange={handleWorkspaceSlugChange}
                />
              </div>
              {validationError && (
                <p className="text-sm text-destructive mt-1">
                  {validationError}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleCreateWorkspaceSubmit}
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? "Creating..." : "Create workspace"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
