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
import { useEffect, useState } from "react";
import { KeyedMutator } from "swr";

interface CreateLinkButtonProps {
  workspaceId: string;
  mutate: KeyedMutator<WorkspaceResponse>;
  isDisabled: boolean;
}

export function CreateLinkButton({
  workspaceId,
  mutate,
  isDisabled,
}: CreateLinkButtonProps) {
  const [highestOrder, setHighestOrder] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<InsertWorkspaceLink>({
    workspaceId: workspaceId,
    type: "regular",
    title: "",
    url: "",
    order: 0,
    isActive: true,
    platform: "",
    config: {
      analyticsEnabled: true,
      customization: {
        comments: "",
      },
    },
  });

  const handleSubmit = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetch(
        `${API_BASE_URL}/api/workspace/links/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        console.log("Failed to create link 🚨", response.status);
        throw new Error("Failed to create link");
      }

      const responseData: WorkspaceResponse = await response.json();

      if (!responseData.data || !Array.isArray(responseData.data)) {
        throw new Error("Invalid response data");
      }

      const newLink = responseData.data[0] as WorkspaceLink;

      setIsDialogOpen(false);

      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;

          return {
            ...currentData,
            data: {
              ...currentData.data,
              links: [
                ...(currentData.data.links || []),
                {
                  ...newLink,
                },
              ],
            },
          };
        },
        {
          revalidate: false,
        }
      );
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  useEffect(() => {
    const fetchHighestOrder = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(
          `${API_BASE_URL}/api/workspace/links/max-order`,
          {
            method: "GET",
          }
        );
        const data: APIResponse = await response.json();
        setHighestOrder(data.data);
      } catch (error) {
        console.error("Error fetching highest order:", error);
      }
    };

    fetchHighestOrder();
  }, [workspaceId]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      workspaceId: workspaceId || prevData.workspaceId,
    }));
  }, [workspaceId]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} size="sm">
          Create link
          <div className="ml-2 hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ⌘K
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <DialogTitle>New link</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Link Type Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Label>Link Type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Select the type of link you want to create
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
          </div>

          {/* Destination URL */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Label>Destination URL</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Enter the destination URL for your link
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
          </div>

          {/* Title */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Label>Title</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Enter a title for your link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              placeholder="Enter link title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Platform Selection for Social Links */}
          {formData.type === "social" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Label>Platform</Label>
              </div>
              <Select
                value={formData.platform!}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Label>Comments</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Add internal notes about this link
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                      ...formData.config?.customization,
                      comments: e.target.value,
                    },
                  },
                })
              }
            />
          </div>

          {/* UTM and Targeting Options */}
          <div className="flex items-center gap-2">
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Create link</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
