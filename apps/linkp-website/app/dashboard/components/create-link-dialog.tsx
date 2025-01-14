// apps/linkp-website/app/dashboard/components/create-link-dialog.tsx
"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Calendar,
  ExternalLink,
  Globe,
  Info,
  LinkIcon,
  Lock,
  QrCode,
  Target,
} from "lucide-react";
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
        previewTitle: "",
        previewDescription: "",
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

      // Ensure we have the link data
      if (!responseData.data || !Array.isArray(responseData.data)) {
        throw new Error("Invalid response data");
      }

      const newLink = responseData.data[0] as WorkspaceLink;

      setIsDialogOpen(false);

      // Optimistically update the SWR cache
      await mutate(
        // 1. Update Function
        (currentData) => {
          // If no data exists in cache, return unchanged
          if (!currentData?.data) return currentData;

          // Return new state
          return {
            ...currentData, // Keep existing response structure
            data: {
              ...currentData.data, // Keep existing workspace data
              links: [
                ...(currentData.data.links || []), // Keep existing links
                {
                  // Add new link
                  ...newLink,
                  // createdAt: new Date(),
                  // updatedAt: new Date(),
                  // isActive: true,
                  // config: formData.config || {},
                },
              ],
            },
          };
        },
        // 2. Options
        {
          revalidate: false, // Don't refetch from API since we have the data
        }
      );
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  // Fetch the highest order of links in the workspace to set the order of the new link with +1
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
        console.log("Fetched highest order:", data.data);
        setHighestOrder(data.data);
      } catch (error) {
        console.error("Error fetching highest order:", error);
      }
    };

    fetchHighestOrder();
  }, [workspaceId]);

  // Set the workspaceId in the form data, since it is recieved as a prop
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
      <DialogContent className="w-fit max-w-[90vw] justify-center">
        <div className="grid grid-cols-[2fr,1fr] gap-4 px-1">
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <DialogTitle>New link</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4">
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
                      <TooltipContent>
                        Enter a title for your link
                      </TooltipContent>
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
            </div>

            {/* Advanced Options Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                UTM
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Expiration
              </Button>
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                Targeting
              </Button>
              <Button variant="outline" className="gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* QR Code Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>QR Code</Label>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted/10">
                <div className="text-center">
                  <QrCode className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter a short link to
                    <br />
                    generate a QR code
                  </p>
                </div>
              </div>
            </div>

            {/* Link Preview Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Label>Link Preview</Label>
                  <Badge variant="secondary" className="rounded-md">
                    PRO
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Globe className="h-4 w-4" />
                  </Button>
                  {formData.type === "social" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted/10">
                  <div className="text-center">
                    <Globe className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enter a link to
                      <br />
                      generate a preview
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Add a title..."
                    value={formData.config?.customization?.previewTitle || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          customization: {
                            ...formData.config?.customization,
                            previewTitle: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Add a description..."
                    value={
                      formData.config?.customization?.previewDescription || ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          customization: {
                            ...formData.config?.customization,
                            previewDescription: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="absolute bottom-4 right-6">
          <Button onClick={handleSubmit} className="gap-2">
            Create link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
