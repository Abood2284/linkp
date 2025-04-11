// apps/linkp-website/app/dashboard/[slug]/instagram/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useInstagramProfile from "@/lib/swr/use-instagram-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Instagram,
  AlertCircle,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const runtime = "edge";

export default function InstagramPage() {
  const searchParams = useSearchParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Use the custom hook to fetch Instagram profile data and manage state
  const {
    profile,
    error,
    isLoading,
    isConnected,
    isConnectionCheckLoading,
    isNotConnected,
    fetchError,
    mutate,
  } = useInstagramProfile();

  // State for the connect button action itself
  const [isInitiatingConnection, setIsInitiatingConnection] = useState(false);

  // Add a state to track if we've just connected
  const [justConnected, setJustConnected] = useState(false);

  // Add a debug state to toggle raw data display
  const [showRawData, setShowRawData] = useState(false);

  // Log raw profile data to console whenever it changes
  useEffect(() => {
    if (profile) {
      console.log("📊 INSTAGRAM PROFILE RAW DATA:", profile);
      console.log("📊 FOLLOWER COUNT:", profile.followerCount);
      console.log("📊 ENGAGEMENT RATE:", profile.engagementRate);
      console.log("📊 PROFILE VIEWS:", profile.profileViews);
      console.log("📊 REACH:", profile.reach);
    }
  }, [profile]);

  // Default values for growth metrics (can be replaced with real data when available)
  const defaultGrowthData = {
    followers: 0,
    engagement: 0,
    websiteClicks: 0,
  };

  // Generate sample recent posts from content data if available
  const getRecentPosts = () => {
    if (!profile?.insights?.content || profile.insights.content.length === 0) {
      return [];
    }

    return profile.insights.content.map((post: any) => ({
      id: post.id,
      type: post.media_type?.toLowerCase() || "image",
      caption: post.caption || "No caption",
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      date: post.timestamp || new Date().toISOString(),
      permalink: post.permalink,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url,
    }));
  };

  const handleConnectInstagram = () => {
    // Step 1: User clicks the button (this function is triggered)

    // Step 2: Set loading state to provide visual feedback
    setIsInitiatingConnection(true);

    // Step 3: Prepare redirection to Instagram authorization page
    const instagramAuthUrl = constructInstagramAuthUrl();

    // Step 4: Redirect the user
    if (instagramAuthUrl) {
      window.location.href = instagramAuthUrl;
    }
  };

  // Helper function to construct the Instagram authorization URL
  const constructInstagramAuthUrl = () => {
    const redirectUri = encodeURIComponent(
      "https://b34e-115-98-235-132.ngrok-free.app/api/instagram/callback"
    );

    const scope = encodeURIComponent(
      "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights"
    );

    // Get slug from path for now
    const pathParts = window.location.pathname.split("/");
    const dashboardIndex = pathParts.indexOf("dashboard");
    const slugFromPath =
      dashboardIndex !== -1 && pathParts.length > dashboardIndex + 1
        ? pathParts[dashboardIndex + 1]
        : null;

    const randomState = crypto.randomUUID();
    const compositeState = `${slugFromPath || "unknown"}:${randomState}`;
    localStorage.setItem("instagram_auth_state", compositeState);

    // Client ID should ideally come from env vars
    const clientId = "28798183066492843";

    // Changed parameter configuration:
    // enable_fb_login=0: Forces Instagram credential usage rather than Facebook
    // force_authentication=1: Forces Instagram to prompt for credentials even if already logged in
    return `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${encodeURIComponent(compositeState)}&enable_fb_login=0&force_authentication=1`;
  };

  // Show success alert on redirect and refresh data when connected
  useEffect(() => {
    if (searchParams.get("status") === "connected") {
      // Show success alert
      setShowSuccessAlert(true);
      setJustConnected(true);

      // Refresh the profile data to get the latest connection status
      mutate();

      // Optional: Remove alert after some time
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);

      // Clean the URL to remove the status parameter
      window.history.replaceState(null, "", window.location.pathname);

      return () => clearTimeout(timer);
    }
  }, [searchParams, mutate]);

  // Force a data refresh after connection
  useEffect(() => {
    if (justConnected) {
      // Add a slight delay to ensure the backend has processed the connection
      const timer = setTimeout(() => {
        console.log("🔄 Refreshing Instagram data after connection...");
        mutate();
        setJustConnected(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [justConnected, mutate]);

  // Loading state for initial connection check
  if (isConnectionCheckLoading) {
    return (
      <div className="container max-w-5xl py-8 flex justify-center items-center">
        <p>Loading Instagram connection status...</p> {/* Or a spinner */}
      </div>
    );
  }

  // Error state (excluding 404 which means not connected)
  if (fetchError && error?.status !== 404) {
    return (
      <div className="container max-w-5xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Instagram data. Please try again later. (Status:{" "}
            {error?.status})
            <pre className="mt-2 text-xs bg-muted p-2 rounded">
              {JSON.stringify(error?.info, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Debug the connection state
  console.log("🔍 Connection state:", {
    isConnected,
    isNotConnected,
    errorStatus: error?.status,
    justConnected,
    hasProfile: !!profile,
  });

  // Render Connect section if not connected (or 404 error) and not in the process of connecting
  if (
    (!isConnected || isNotConnected || error?.status === 404) &&
    !justConnected
  ) {
    return (
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-6">Instagram Integration</h1>
        {showSuccessAlert && (
          <Alert className="mb-4 bg-green-100 border-green-300">
            <AlertCircle className="h-4 w-4 text-green-700" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Instagram account connected successfully.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              Connect Your Instagram Account
            </CardTitle>
            <CardDescription>
              Enhance your creator profile by connecting your Instagram account
              to display your follower count and engagement metrics to potential
              brand partners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Verify Your Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Display your verified follower count to increase trust with
                    brands.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Show Your Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Highlight your engagement rates to attract better brand
                    deals.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Track Your Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Monitor your audience growth and engagement trends over
                    time.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Privacy Notice</AlertTitle>
              <AlertDescription>
                We only access your public profile data and basic metrics. We
                never post on your behalf or access your private messages.
              </AlertDescription>
            </Alert>

            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleConnectInstagram}
              disabled={isInitiatingConnection}
            >
              {isInitiatingConnection ? (
                <>
                  <span className="mr-2">Connecting...</span>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <Instagram className="mr-2 h-4 w-4" />
                  Connect Instagram Account
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Analytics Dashboard if connected
  // Double check that we have profile data before rendering the dashboard
  if (!profile) {
    return (
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-6">Instagram Integration</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              Connect Your Instagram Account
            </CardTitle>
            <CardDescription>
              Enhance your creator profile by connecting your Instagram account
              to display your follower count and engagement metrics to potential
              brand partners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setIsInitiatingConnection(true);
                window.location.href = constructInstagramAuthUrl();
              }}
              disabled={isInitiatingConnection}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isInitiatingConnection ? "Connecting..." : "Connect Instagram"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TODO: Replace dummy data with actual fetched data (`profileData.data`)
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Instagram className="h-7 w-7 text-pink-500" /> Instagram Analytics
        <Badge variant="secondary">@{profile?.username || "..."}</Badge>
      </h1>

      {showSuccessAlert && (
        <Alert className="mb-4 bg-green-100 border-green-300">
          <AlertCircle className="h-4 w-4 text-green-700" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Instagram account connected successfully.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Growth Metrics</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                A summary of your Instagram account&apos;s key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Followers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-bold">
                      {profile?.followerCount?.toLocaleString() || "0"}
                    </div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />+
                      {profile?.growth?.followers ||
                        defaultGrowthData.followers}
                      % this month
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Following
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-bold">
                      {profile?.followingCount?.toLocaleString() || "0"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      Accounts you follow
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-bold">
                      {profile?.mediaCount?.toLocaleString() || "0"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Instagram className="h-3 w-3 mr-1" />
                      Total media items
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-bold">
                      {profile?.engagementRate || "0"}%
                    </div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />+
                      {profile?.growth?.engagement ||
                        defaultGrowthData.engagement}
                      % this month
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Profile Views (30 days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-bold">
                      {profile?.profileViews?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {profile?.websiteClicks ||
                        defaultGrowthData.websiteClicks}{" "}
                      website clicks
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* Debug toggle button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRawData(!showRawData)}
            >
              {showRawData ? "Hide Raw Data" : "Show Raw Data"}
            </Button>
          </div>

          {/* Raw data debug panel */}
          {showRawData && profile && (
            <Card className="mb-4 bg-slate-50 dark:bg-slate-900 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-500">
                  Raw Instagram Data (Debug)
                </CardTitle>
                <CardDescription>
                  Displaying raw data from Instagram API for debugging purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 overflow-auto max-h-[500px] text-xs font-mono">
                  <div>
                    <h3 className="font-bold mb-2">Basic Profile Data</h3>
                    <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                      {JSON.stringify(
                        {
                          username: profile.username,
                          instagramUserId: profile.instagramUserId,
                          followerCount: profile.followerCount,
                          engagementRate: profile.engagementRate,
                          profileViews: profile.profileViews,
                          reach: profile.reach,
                          lastSyncedAt: profile.lastSyncedAt,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  {profile.insights?.interactionMetrics && (
                    <div>
                      <h3 className="font-bold mb-2">
                        Interaction Metrics (Raw)
                      </h3>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                        {JSON.stringify(
                          profile.insights.interactionMetrics,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}

                  {profile.insights?.reachBreakdown && (
                    <div>
                      <h3 className="font-bold mb-2">Reach Breakdown (Raw)</h3>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                        {JSON.stringify(
                          profile.insights.reachBreakdown,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}

                  {profile.insights?.views && (
                    <div>
                      <h3 className="font-bold mb-2">Views Data (Raw)</h3>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                        {JSON.stringify(profile.insights.views, null, 2)}
                      </pre>
                    </div>
                  )}

                  {profile.insights?.followerDemographics && (
                    <div>
                      <h3 className="font-bold mb-2">
                        Follower Demographics (Raw)
                      </h3>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                        {JSON.stringify(
                          profile.insights.followerDemographics,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}

                  {profile.insights?.engagedDemographics && (
                    <div>
                      <h3 className="font-bold mb-2">
                        Engaged Demographics (Raw)
                      </h3>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                        {JSON.stringify(
                          profile.insights.engagedDemographics,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
              <CardDescription>
                Tracking your follower count over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">
                  [Follower Growth Chart Visualization]
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts Performance</CardTitle>
              <CardDescription>
                Engagement metrics for your most recent Instagram posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {getRecentPosts().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {getRecentPosts().map((post: any) => (
                      <div
                        key={post.id}
                        className="border rounded-md overflow-hidden flex flex-col h-full"
                      >
                        {post.media_url && (
                          <div className="relative pb-[100%]">
                            <Image
                              src={post.thumbnail_url || post.media_url}
                              alt={post.caption}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            {post.type === "video" && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary">Video</Badge>
                              </div>
                            )}
                            {post.type === "carousel_album" && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary">Album</Badge>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-3 flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-muted-foreground">
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-sm line-clamp-2 mb-2">
                            {post.caption}
                          </div>
                          <div className="flex items-center gap-4 text-sm mt-auto">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-red-500" />
                              {post.likes?.toLocaleString() || "0"}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                              {post.comments?.toLocaleString() || "0"}
                            </div>
                            {post.permalink && (
                              <a
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-xs text-blue-500 hover:underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent posts available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Understanding who your followers are
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Age Distribution</h3>
                  <div className="h-40 flex items-center justify-center bg-slate-50 rounded-md">
                    {profile?.insights?.followerDemographics &&
                    profile.insights.followerDemographics.length > 0 ? (
                      <div className="w-full p-4">
                        <h4 className="text-sm font-medium mb-2">
                          Top Countries
                        </h4>
                        <div className="space-y-2">
                          {profile?.insights?.followerDemographics[0]?.total_value?.breakdowns?.[0]?.results
                            ?.slice(0, 5)
                            ?.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between text-xs"
                              >
                                <span>
                                  {item?.dimension_values?.[1] || "Unknown"}
                                </span>
                                <span>{item?.value || 0} followers</span>
                              </div>
                            )) || (
                            <p className="text-xs text-muted-foreground">
                              No demographic data available
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No demographic data available
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Gender Distribution</h3>
                  <div className="h-40 flex items-center justify-center bg-slate-50 rounded-md">
                    {profile?.insights?.engagedDemographics &&
                    profile.insights.engagedDemographics.length > 0 ? (
                      <div className="w-full p-4">
                        <h4 className="text-sm font-medium mb-2">
                          Engaged Audience
                        </h4>
                        <div className="space-y-2">
                          {profile?.insights?.engagedDemographics[0]?.total_value?.breakdowns?.[0]?.results
                            ?.slice(0, 5)
                            ?.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between text-xs"
                              >
                                <span>
                                  {item?.dimension_values?.[1] || "Unknown"}
                                </span>
                                <span>{item?.value || 0} engaged</span>
                              </div>
                            )) || (
                            <p className="text-xs text-muted-foreground">
                              No engagement data available
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No engagement data available
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Location</h3>
                  <div className="h-40 flex items-center justify-center bg-slate-50 rounded-md">
                    <p className="text-muted-foreground">[Location Chart]</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Active Hours</h3>
                  <div className="h-40 flex items-center justify-center bg-slate-50 rounded-md">
                    <p className="text-muted-foreground">
                      [Active Hours Chart]
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* No debug panel - removed as requested */}
    </div>
  );
}
