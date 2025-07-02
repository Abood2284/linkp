"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCreatorProfile } from "@/lib/swr/use-creator-profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProposalDialog } from "@/components/proposals/create-proposal-dialog";

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params.id as string;
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  const { creator, isLoading, isError } = useCreatorProfile(creatorId);

  // Set the default selected workspace when creator data loads
  useEffect(() => {
    if (
      creator?.workspaces &&
      creator.workspaces.length > 0 &&
      !selectedWorkspaceId
    ) {
      setSelectedWorkspaceId(creator.workspaces[0].id);
    }
  }, [creator, selectedWorkspaceId]);

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading creator profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Creator Info */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Creator Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  {isLoading ? (
                    <Skeleton className="h-24 w-24 rounded-full" />
                  ) : (
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={creator?.image} />
                      <AvatarFallback>
                        {creator?.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {isLoading ? (
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-6 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-xl font-bold">{creator?.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {creator?.username}
                      </p>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                      {creator?.categories?.map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                      {(!creator?.categories ||
                        creator.categories.length === 0) && (
                        <Badge variant="secondary">General</Badge>
                      )}
                    </div>
                  )}

                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setIsProposalDialogOpen(true)}
                    >
                      Create Proposal
                    </Button>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Bio</p>
                      {isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {creator?.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      {isLoading ? (
                        <Skeleton className="h-4 w-40" />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {creator?.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      {isLoading ? (
                        <Skeleton className="h-4 w-32" />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {creator?.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Joined</p>
                      {isLoading ? (
                        <Skeleton className="h-4 w-28" />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {creator?.createdAt
                            ? new Date(creator.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="md:col-span-2">
            <Tabs defaultValue="metrics">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="links">Link-in-Bio</TabsTrigger>
                <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                          Followers
                        </p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-24 mx-auto mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">
                            {creator?.followerCount
                              ? creator.followerCount.toLocaleString()
                              : "0"}
                          </p>
                        )}
                      </div>

                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                          Engagement Rate
                        </p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-16 mx-auto mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">
                            {creator?.engagementRate}
                          </p>
                        )}
                      </div>

                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                          Average Cost
                        </p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-20 mx-auto mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">
                            {creator?.averageCost}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">
                        Engagement Details
                      </h3>
                      {isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Average Likes</span>
                              <span className="text-sm font-medium">
                                {creator?.engagement?.averageLikes
                                  ? creator.engagement.averageLikes.toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                            <Progress
                              value={
                                creator?.engagement?.averageLikes
                                  ? Math.min(
                                      (creator.engagement.averageLikes /
                                        (creator?.followerCount || 1)) *
                                        100,
                                      100
                                    )
                                  : 0
                              }
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Average Comments</span>
                              <span className="text-sm font-medium">
                                {creator?.engagement?.averageComments
                                  ? creator.engagement.averageComments.toLocaleString()
                                  : "0"}
                              </span>
                            </div>
                            <Progress
                              value={
                                creator?.engagement?.averageComments
                                  ? Math.min(
                                      (creator.engagement.averageComments /
                                        (creator?.followerCount || 1)) *
                                        100,
                                      100
                                    )
                                  : 0
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Status:{" "}
                            <span className="capitalize">
                              {creator?.availability.status}
                            </span>
                          </span>
                          <span className="text-sm">
                            {creator?.availability.percentage}%
                          </span>
                        </div>
                        <Progress
                          value={creator?.availability.percentage}
                          className={
                            creator?.availability.status === "available"
                              ? "bg-green-100"
                              : creator?.availability.status === "limited"
                                ? "bg-amber-100"
                                : "bg-red-100"
                          }
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Link-in-Bio Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 text-center mb-6">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Profile Views
                      </p>
                      {isLoading ? (
                        <Skeleton className="h-8 w-24 mx-auto mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {creator?.linkInBio?.views
                            ? creator.linkInBio.views.toLocaleString()
                            : "0"}
                        </p>
                      )}
                    </div>

                    <h3 className="text-lg font-medium mb-4">Links</h3>
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {creator?.linkInBio?.links?.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <LinkIcon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{link.title}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Clicks
                              </p>
                              <p className="font-medium">
                                {link.clicks
                                  ? link.clicks.toLocaleString()
                                  : "0"}
                              </p>
                            </div>
                          </div>
                        ))}

                        {(!creator?.linkInBio?.links ||
                          creator.linkInBio.links.length === 0) && (
                          <p className="text-center text-muted-foreground py-4">
                            No links available
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaborations" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Previous Collaborations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {creator?.previousCollaborations?.map(
                          (collab, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex justify-between mb-1">
                                <h4 className="font-medium">
                                  {collab.businessName}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {collab.startDate}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {collab.title}
                              </p>
                              {collab.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {collab.description}
                                </p>
                              )}
                              {collab.metrics && (
                                <div className="mt-2 pt-2 border-t flex justify-between text-xs text-muted-foreground">
                                  <span>
                                    Clicks: {collab.metrics.clicks || 0}
                                  </span>
                                  <span>
                                    Conversions:{" "}
                                    {collab.metrics.conversions || 0}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        )}

                        {(!creator?.previousCollaborations ||
                          creator.previousCollaborations.length === 0) && (
                          <p className="text-center text-muted-foreground py-4">
                            No previous collaborations
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-col items-center mt-6 space-y-4">
                  {creator?.workspaces && creator.workspaces.length > 0 ? (
                    <>
                      {creator.workspaces.length > 1 && (
                        <div className="w-full max-w-md space-y-2">
                          <label className="text-sm font-medium">
                            Select Workspace:
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={selectedWorkspaceId}
                            onChange={(e) =>
                              setSelectedWorkspaceId(e.target.value)
                            }
                          >
                            {creator.workspaces.map((workspace) => (
                              <option key={workspace.id} value={workspace.id}>
                                {workspace.name} ({workspace.slug})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <Button
                        size="lg"
                        onClick={() => setIsProposalDialogOpen(true)}
                      >
                        Create Proposal
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      disabled
                      title="This creator has no active workspaces"
                    >
                      Create Proposal
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Proposal Dialog */}
      {creator && creator.workspaces && creator.workspaces.length > 0 ? (
        <CreateProposalDialog
          isOpen={isProposalDialogOpen}
          onClose={() => setIsProposalDialogOpen(false)}
          creatorId={creatorId}
          workspaceId={selectedWorkspaceId}
        />
      ) : (
        isProposalDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">
                Cannot Create Proposal
              </h3>
              <p className="text-gray-600 mb-4">
                This creator doesn&apos;t have any active workspaces to propose
                to. Please try again later.
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setIsProposalDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
