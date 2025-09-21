// apps/linkp-website/app/dashboard/components/create-link-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InsertWorkspaceLink } from "@repo/db/schema";
import { APIResponse, WorkspaceLink, WorkspaceResponse } from "@repo/db/types";
import { Globe, Info, LinkIcon, Target } from "lucide-react";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { KeyedMutator } from "swr";
import { toast } from "sonner";

export type CreateLinkHandle = { open: () => void };

interface CreateLinkButtonProps {
  workspaceId: string;
  mutate: KeyedMutator<WorkspaceResponse>;
  isDisabled: boolean;
}

export const CreateLinkButton = forwardRef(function CreateLinkButton(
  { workspaceId, mutate, isDisabled }: CreateLinkButtonProps,
  ref: ForwardedRef<CreateLinkHandle>
) {
  const [highestOrder, setHighestOrder] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useImperativeHandle(ref, () => ({ open: () => setIsDialogOpen(true) }), []);

  const [formData, setFormData] = useState<InsertWorkspaceLink>({
    workspaceId,
    type: "regular",
    title: "",
    url: "",
    order: 0,
    isActive: true,
    platform: "",
    config: {
      analyticsEnabled: true,
      customization: { comments: "" },
    },
  });

  const isValid = useMemo(() => {
    const titleOk = formData.title.trim().length > 0;
    const urlOk = /^https?:\/\//i.test(formData.url.trim());
    return titleOk && urlOk;
  }, [formData.title, formData.url]);

  useEffect(() => {
    const fetchHighestOrder = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(
          `${API_BASE_URL}/api/workspace/links/max-order`
        );
        const data: APIResponse = await res.json();
        setHighestOrder(Number(data.data || 0));
      } catch (error) {
        console.error("Error fetching highest order:", error);
      }
    };
    fetchHighestOrder();
  }, [workspaceId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      workspaceId: workspaceId || prev.workspaceId,
      order: highestOrder + 1,
    }));
  }, [workspaceId, highestOrder]);

  const handleSubmit = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${API_BASE_URL}/api/workspace/links/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to create link (${response.status})`);
      const responseData: WorkspaceResponse = await response.json();
      if (!responseData.data || !Array.isArray(responseData.data))
        throw new Error("Invalid response data");
      const newLink = responseData.data[0] as WorkspaceLink;

      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              links: [...(currentData.data.links || []), { ...newLink }],
            },
          };
        },
        { revalidate: false }
      );

      toast.success("Link created");
      setIsDialogOpen(false);
      setFormData((p) => ({
        ...p,
        title: "",
        url: "",
        platform: "",
        config: { ...p.config, customization: { comments: "" } },
      }));
    } catch (error: any) {
      console.error("Error creating link:", error);
      toast.error(error?.message || "Failed to create link");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isDisabled}
          size="sm"
          className="bg-brand-primary text-brand-ink hover:opacity-90"
        >
          <PlusIcon />
          New Link
          <div className="ml-2 hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <DialogTitle>Create a new link</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Field
            label="Link Type"
            hint="Select the type of link you want to create"
          >
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as InsertWorkspaceLink["type"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular Link</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="commerce">E-commerce</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Destination URL"
            hint="Enter the destination URL for your link"
          >
            <Input
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
          </Field>

          <Field label="Title" hint="Give your link a short, clear title">
            <Input
              placeholder="E.g., Merch Drop"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Field>

          {formData.type === "social" && (
            <Field label="Platform">
              <Select
                value={formData.platform!}
                onValueChange={(v) => setFormData({ ...formData, platform: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field label="Comments" hint="Internal notes—only you can see this">
            <Textarea
              placeholder="Add comments"
              className="h-16 resize-none"
              value={formData.config?.customization?.comments || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    customization: {
                      ...(formData.config?.customization || {}),
                      comments: e.target.value,
                    },
                  },
                })
              }
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              UTM
            </Button>
            <Button variant="outline" className="gap-2">
              <Target className="h-4 w-4" />
              Targeting
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            onClick={handleSubmit}
            className="bg-brand-primary text-brand-ink hover:opacity-90"
          >
            Create link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {hint && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{hint}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
