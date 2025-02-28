"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Proposal } from "@/lib/swr/use-proposals";
import { WorkspaceType } from "@repo/db/types";

interface ProposalsDashboardProps {
  userType: "creator" | "business";
  proposals: Proposal[];
  workspaceId: string;
  workspaces: WorkspaceType[];
  onUpdateStatus: (
    proposalId: string,
    status: "accepted" | "rejected"
  ) => Promise<boolean>;
  onCreateProposal: (proposalData: any) => Promise<boolean>;
}

export function ProposalsDashboard({
  userType,
  proposals,
  workspaceId,
  workspaces,
  onUpdateStatus,
  onCreateProposal,
}: ProposalsDashboardProps) {
  const router = useRouter();
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    url: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    price: 0,
    creatorId: "", // Only used by business users
    workspaceId: "", // Selected workspace ID
  });

  // Filter proposals based on status
  const pendingProposals = proposals.filter((p) => p.status === "pending");
  const activeProposals = proposals.filter((p) => p.status === "accepted");
  const pastProposals = proposals.filter(
    (p) => p.status === "rejected" || p.status === "expired"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is stored in cents
  };

  const handleCreateProposal = async () => {
    try {
      setIsUpdating(true);

      // Validate form
      if (!newProposal.title || !newProposal.url || !newProposal.price) {
        toast.error("Please fill out all required fields");
        setIsUpdating(false);
        return;
      }

      if (!newProposal.workspaceId) {
        toast.error("Please select a creator workspace");
        setIsUpdating(false);
        return;
      }

      // Call the API through the provided callback
      const success = await onCreateProposal({
        ...newProposal,
        // The API expects price in cents
        price: parseInt(
          (parseFloat(newProposal.price.toString()) * 100).toString()
        ),
      });

      if (success) {
        toast.success("Proposal created successfully!");
        setIsCreatingProposal(false);
        // Reset form
        setNewProposal({
          title: "",
          url: "",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          price: 0,
          creatorId: "",
          workspaceId: "",
        });
      } else {
        toast.error("Failed to create proposal");
      }
    } catch (error) {
      toast.error("Failed to create proposal");
      console.error("Error creating proposal:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProposalStatus = async (
    proposalId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    try {
      setIsUpdating(true);
      const success = await onUpdateStatus(proposalId, newStatus);

      if (success) {
        toast.success(`Proposal ${newStatus} successfully!`);
      } else {
        toast.error(`Failed to ${newStatus} proposal`);
      }
    } catch (error) {
      toast.error(`Failed to ${newStatus} proposal`);
      console.error(`Error updating proposal status:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Promotional Proposals
          </h1>
          <p className="text-muted-foreground">
            {userType === "creator"
              ? "Manage promotional link proposals from businesses."
              : "Create and manage your promotional proposals to creators."}
          </p>
        </div>
        {userType === "business" && (
          <Dialog
            open={isCreatingProposal}
            onOpenChange={setIsCreatingProposal}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Promotional Proposal</DialogTitle>
                <DialogDescription>
                  Send a promotional link proposal to a creator. They'll review
                  it and decide whether to accept or reject.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newProposal.title}
                    onChange={(e) =>
                      setNewProposal({ ...newProposal, title: e.target.value })
                    }
                    placeholder="Summer Sale Promotion"
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newProposal.url}
                    onChange={(e) =>
                      setNewProposal({ ...newProposal, url: e.target.value })
                    }
                    placeholder="https://yourbrand.com/summer-sale"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid items-center gap-1.5">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newProposal.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newProposal.startDate
                            ? format(newProposal.startDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newProposal.startDate}
                          onSelect={(date) =>
                            date &&
                            setNewProposal({ ...newProposal, startDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid items-center gap-1.5">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newProposal.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newProposal.endDate
                            ? format(newProposal.endDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newProposal.endDate}
                          onSelect={(date) =>
                            date &&
                            setNewProposal({ ...newProposal, endDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProposal.price === 0 ? "" : newProposal.price}
                    onChange={(e) =>
                      setNewProposal({
                        ...newProposal,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="50.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    The amount you'll pay the creator for this promotion.
                  </p>
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="workspace">Creator Workspace</Label>
                  <Select
                    value={newProposal.workspaceId}
                    onValueChange={(value) => {
                      // Find the workspace to get the creator ID
                      const workspace = workspaces.find((w) => w.id === value);
                      setNewProposal({
                        ...newProposal,
                        workspaceId: value,
                        // This assumes you have creator ID in workspace or can derive it
                        // You may need to adjust this logic based on your data structure
                        creatorId: workspace?.userId || "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a creator workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                          {workspace.name} (@{workspace.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingProposal(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProposal} disabled={isUpdating}>
                  {isUpdating ? "Creating..." : "Create Proposal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending
            {pendingProposals.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingProposals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  {userType === "creator"
                    ? "No pending promotional proposals at the moment."
                    : "You don't have any pending proposals. Create one to get started!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    {userType === "business" && <TableHead>Creator</TableHead>}
                    {userType === "creator" && <TableHead>Business</TableHead>}
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.title}
                      </TableCell>
                      {userType === "business" && (
                        <TableCell>
                          {proposal.workspace?.name || "Unknown Creator"}
                        </TableCell>
                      )}
                      {userType === "creator" && (
                        <TableCell>
                          {proposal.business?.companyName || "Unknown Business"}
                        </TableCell>
                      )}
                      <TableCell>
                        {format(new Date(proposal.startDate), "MMM d")} -{" "}
                        {format(new Date(proposal.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{formatCurrency(proposal.price)}</TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-right">
                        {userType === "creator" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateProposalStatus(
                                  proposal.id,
                                  "accepted"
                                )
                              }
                              disabled={isUpdating}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateProposalStatus(
                                  proposal.id,
                                  "rejected"
                                )
                              }
                              disabled={isUpdating}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {userType === "business" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              /* View details would go here */
                            }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {activeProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No active promotional campaigns at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    {userType === "business" && <TableHead>Creator</TableHead>}
                    {userType === "creator" && <TableHead>Business</TableHead>}
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead className="text-right">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.title}
                      </TableCell>
                      {userType === "business" && (
                        <TableCell>
                          {proposal.workspace?.name || "Unknown Creator"}
                        </TableCell>
                      )}
                      {userType === "creator" && (
                        <TableCell>
                          {proposal.business?.companyName || "Unknown Business"}
                        </TableCell>
                      )}
                      <TableCell>
                        {format(new Date(proposal.startDate), "MMM d")} -{" "}
                        {format(new Date(proposal.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{formatCurrency(proposal.price)}</TableCell>
                      <TableCell>
                        {/* This would be real metrics in production */}
                        {Math.floor(Math.random() * 100)} clicks
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            /* View analytics would go here */
                          }}
                        >
                          View Analytics
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastProposals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No past promotional campaigns to display.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    {userType === "business" && <TableHead>Creator</TableHead>}
                    {userType === "creator" && <TableHead>Business</TableHead>}
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.title}
                      </TableCell>
                      {userType === "business" && (
                        <TableCell>
                          {proposal.workspace?.name || "Unknown Creator"}
                        </TableCell>
                      )}
                      {userType === "creator" && (
                        <TableCell>
                          {proposal.business?.companyName || "Unknown Business"}
                        </TableCell>
                      )}
                      <TableCell>
                        {format(new Date(proposal.startDate), "MMM d")} -{" "}
                        {format(new Date(proposal.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{formatCurrency(proposal.price)}</TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-right">
                        {proposal.status === "rejected" &&
                          userType === "business" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                /* Resend proposal would go here */
                              }}
                            >
                              Resend
                            </Button>
                          )}
                        {proposal.status === "accepted" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              /* View history would go here */
                            }}
                          >
                            View History
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
