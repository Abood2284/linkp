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
import { InsertWorkspaceLink, proposalStatusEnum } from "@repo/db/schema";
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

// Add this interface to represent promotional proposal data
interface ProposalData {
  id?: string;
  status: (typeof proposalStatusEnum.enumValues)[number];
  startDate?: Date;
  endDate?: Date;
  price?: number;
}

interface UpdateLinkDialogProps {
  link: WorkspaceLink;
  workspaceId: string;
  mutate: KeyedMutator<WorkspaceResponse>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
interface ProposalResponse {
  status: number;
  data: {
    id: string;
    businessId: string;
    creatorId: string;
    workspaceId: string;
    title: string;
    url: string;
    startDate: string;
    endDate: string;
    price: number;
    status: (typeof proposalStatusEnum.enumValues)[number];
    workspaceLinkId: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export function UpdateLinkDialog({
  link,
  workspaceId,
  mutate,
  isOpen,
  setIsOpen,
}: UpdateLinkDialogProps) {
  // Main link form data
  const [formData, setFormData] = useState<InsertWorkspaceLink>({
    id: link.id,
    workspaceId: workspaceId,
    type: link.type,
    title: link.title,
    url: link.url,
    order: link.order,
    isActive: link.isActive,
    platform: link.platform,
    config: link.config || {
      analyticsEnabled: true,
      customization: {
        comments: "",
        previewTitle: "",
        previewDescription: "",
      },
    },
  });

  // Separate state for promotional data
  const [proposalData, setProposalData] = useState<ProposalData>({
    status: "pending",
  });

  // Fetch proposal data on component mount if it's a promotional link
  useEffect(() => {
    const fetchProposalData = async () => {
      if (link.type === "promotional") {
        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await fetch(
            `${API_BASE_URL}/api/workspace/links/proposal/${link.id}`
          );

          if (response.ok) {
            const data: ProposalResponse = await response.json();
            if (data.data) {
              setProposalData({
                id: data.data.id,
                status: data.data.status,
                startDate: new Date(data.data.startDate),
                endDate: new Date(data.data.endDate),
                price: data.data.price,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching proposal data:", error);
        }
      }
    };

    fetchProposalData();
  }, [link.id, link.type]);

  const handleSubmit = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Update the link
      const response = await fetch(
        `${API_BASE_URL}/api/workspace/links/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        console.log("Failed to update link 🚨", response.status);
        throw new Error("Failed to update link");
      }

      const responseData: APIResponse<WorkspaceLink> = await response.json();

      // Ensure we have the link data
      if (!responseData.data || !Array.isArray(responseData.data)) {
        throw new Error("Invalid response data");
      }

      const updatedLink = responseData.data[0] as WorkspaceLink;

      // If it's a promotional link, update the proposal data as well
      if (link.type === "promotional" && proposalData.id) {
        await fetch(`${API_BASE_URL}/api/workspace/links/proposal/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: proposalData.id,
            status: proposalData.status,
          }),
        });
      }

      setIsOpen(false);

      // Optimistically update the SWR cache
      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;

          return {
            ...currentData,
            data: {
              ...currentData.data,
              links: currentData.data.links.map((link) =>
                link.id === updatedLink.id ? updatedLink : link
              ),
            },
          };
        },
        {
          revalidate: false,
        }
      );
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  // Set the workspaceId in the form data, since it is received as a prop
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      workspaceId: workspaceId || prevData.workspaceId,
    }));
  }, [workspaceId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-fit max-w-[95vw] justify-center">
        <div className="grid grid-cols-[2fr,1fr] gap-4 px-1">
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <DialogTitle>Update link</DialogTitle>
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

              {/* Promotional Link Status - Only show for existing promotional links */}
              {link.type === "promotional" && (
                <div className="space-y-2">
                  <Label>Promotion Status</Label>
                  <Select
                    value={proposalData.status}
                    onValueChange={(value) =>
                      setProposalData({
                        ...proposalData,
                        status:
                          value as (typeof proposalStatusEnum.enumValues)[number],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Active</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Read-only promotional details */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="datetime-local"
                        value={
                          proposalData.startDate
                            ? proposalData.startDate.toISOString().slice(0, 16)
                            : ""
                        }
                        disabled
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="datetime-local"
                        value={
                          proposalData.endDate
                            ? proposalData.endDate.toISOString().slice(0, 16)
                            : ""
                        }
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="text"
                        value={`$${((proposalData.price || 0) / 100).toFixed(2)}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Only show URL/Title editing for non-promotional links */}
              {link.type !== "promotional" && (
                <>
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

                  {/* Rest of the component remains largely the same... */}
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
                </>
              )}
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

          {/* Right Panel - No changes needed here */}
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
            Update link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
