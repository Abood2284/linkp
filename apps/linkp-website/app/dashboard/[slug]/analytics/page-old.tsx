// apps/linkp-website/app/dashboard/[slug]/analytics/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analytics } from "@/lib/analytics";
import useWorkspace from "@/lib/swr/use-workspace";
import {
  useWorkspaceAnalytics,
  WorkspaceAnalyticsData,
} from "@/lib/swr/use-workspace-analytics";
import {
  Activity,
  BarChart3,
  Battery,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  Laptop,
  Link2,
  MapPin,
  Monitor,
  MousePointerClick,
  Smartphone,
  Tablet,
  Terminal,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
} from "recharts";

/**
 * Helper function to get device information with icon and display name
 * @param deviceType The raw device type string from analytics
 * @returns Device info object with icon and friendly name
 */
function getDeviceInfo(deviceType: string) {
  // Handle undefined/null values
  if (!deviceType) {
    return {
      icon: <Globe className="h-5 w-5" />,
      name: "Unknown",
    };
  }

  const lowerType = deviceType.toLowerCase().trim();
  console.log(`Normalizing device type: '${deviceType}' -> '${lowerType}'`);

  // Operating systems
  if (lowerType === "windows" || lowerType.includes("win")) {
    return {
      icon: <Monitor className="h-5 w-5" />,
      name: "Windows",
    };
  } else if (
    lowerType === "macos" ||
    lowerType === "mac os" ||
    lowerType.includes("mac") ||
    lowerType.includes("os x")
  ) {
    return {
      icon: <Laptop className="h-5 w-5" />,
      name: "Mac",
    };
  } else if (
    lowerType === "linux" ||
    lowerType.includes("ubuntu") ||
    lowerType.includes("debian")
  ) {
    return {
      icon: <Terminal className="h-5 w-5" />,
      name: "Linux",
    };
  } else if (lowerType === "android" || lowerType.includes("android")) {
    return {
      icon: <Smartphone className="h-5 w-5" />,
      name: "Android",
    };
  } else if (
    lowerType === "ios" ||
    lowerType.includes("iphone") ||
    lowerType.includes("ipad") ||
    lowerType.includes("ipod")
  ) {
    return {
      icon: <Smartphone className="h-5 w-5" />,
      name: "iOS",
    };
  }

  // Device categories
  else if (lowerType.includes("desktop") || lowerType.includes("pc")) {
    return {
      icon: <Monitor className="h-5 w-5" />,
      name: "Desktop",
    };
  } else if (lowerType.includes("mobile") || lowerType.includes("phone")) {
    return {
      icon: <Smartphone className="h-5 w-5" />,
      name: "Mobile",
    };
  } else if (lowerType.includes("tablet")) {
    return {
      icon: <Tablet className="h-5 w-5" />,
      name: "Tablet",
    };
  } else if (
    lowerType.includes("chrome") ||
    lowerType.includes("browser") ||
    lowerType.includes("firefox") ||
    lowerType.includes("safari")
  ) {
    return {
      icon: <Globe className="h-5 w-5" />,
      name: "Browser",
    };
  } else {
    // Return a cleaned up version of the device type, making the first letter uppercase
    const cleanName =
      deviceType.charAt(0).toUpperCase() + deviceType.slice(1).toLowerCase();
    console.log(
      `Using fallback name for device type: '${deviceType}' -> '${cleanName}'`
    );
    return {
      icon: <Globe className="h-5 w-5" />,
      name: cleanName !== "Unknown" ? cleanName : deviceType,
    };
  }
}

// Interface matching the structure expected AFTER processing
interface ProcessedAnalyticsData {
  // View metrics
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: { date: string; views: number }[];

  // Link click metrics
  totalLinkClicks: number;
  avgClicksPerView: number;
  linkClicks: {
    total: number;
    breakdown: {
      link_id: string;
      count: number;
    }[];
  };

  // Device breakdown
  devices: {
    os: string;
    count: number;
  }[];

  // Geographical breakdown
  geography: {
    country: string;
    count: number;
  }[];

  // Traffic sources
  referrers: {
    path: string;
    count: number;
  }[];

  // Exit pages
  exits: {
    path: string;
    count: number;
  }[];
}

export default function AnalyticsPage() {
  const { workspace } = useWorkspace();
  const workspaceId = workspace?.id;

  console.log(
    `[AnalyticsPage] Rendering. Workspace ID: ${workspaceId ?? "Loading..."}`
  );

  // --- Re-enable SWR hook --- START ---
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateFrom = thirtyDaysAgo.toISOString().split("T")[0]; // Default to last 30 days
  const dateTo = new Date().toISOString().split("T")[0];

  const {
    analytics: rawData, // Hook returns data in the { data: WorkspaceAnalyticsData } structure
    error: analyticsError,
    isLoading: isAnalyticsLoading,
  } = useWorkspaceAnalytics({
    workspaceId: workspaceId || "", // Pass workspaceId or empty string if not loaded yet
    dateFrom: dateFrom,
    dateTo: dateTo,
    interval: "day", // Keep interval as day for the chart
  });

  useEffect(() => {
    console.log("🔄 Analytics data changed:", rawData);

    // Detailed logging for device types
    if (rawData?.views?.device) {
      console.log(
        "[AnalyticsPage] Device data:",
        JSON.stringify(rawData.views.device, null, 2)
      );

      // Log each device type with its count
      rawData.views.device.forEach((device: any) => {
        console.log(
          `[AnalyticsPage] Device Type: ${device.breakdown_value}, Count: ${device.count}`
        );
      });
    } else {
      console.log("[AnalyticsPage] No device data available");
    }

    // Debug Geography data
    if (rawData?.views?.geography) {
      console.log(
        "[AnalyticsPage] Geography data:",
        JSON.stringify(rawData.views.geography, null, 2)
      );
    } else {
      console.log("[AnalyticsPage] No geography data available");
    }
  }, [rawData]);
  // --- Re-enable SWR hook --- END ---

  // Processing data for display
  const processedData: ProcessedAnalyticsData = {
    // View metrics
    totalViews: 0,
    uniqueVisitors: 0,
    viewsByDay: [],

    // Link clicks
    totalLinkClicks: 0,
    avgClicksPerView: 0,
    linkClicks: {
      total: 0,
      breakdown: [],
    },

    // Device breakdown
    devices: [],

    // Geographical breakdown
    geography: [],

    // Traffic sources
    referrers: [],

    // Exit pages
    exits: [],
  };

  if (rawData) {
    // Process total views and unique visitors
    processedData.totalViews = rawData.views.totalViews || 0;
    processedData.uniqueVisitors = rawData.views.totalUniqueVisitors || 0;

    // Process views by day
    if (rawData.views.viewsByDay) {
      processedData.viewsByDay = rawData.views.viewsByDay.map((item) => ({
        date: item.date,
        views: item.totalViews,
      }));
    }

    // Process link clicks
    if (rawData.linkClicks) {
      processedData.totalLinkClicks = rawData.linkClicks.total || 0;

      // Only map breakdown items if they exist
      if (rawData.linkClicks.items && Array.isArray(rawData.linkClicks.items)) {
        processedData.linkClicks.breakdown = rawData.linkClicks.items.map(
          (item) => ({
            link_id: item.link_id || "unknown",
            count: item.count || 0,
          })
        );
      }

      processedData.linkClicks.total = processedData.totalLinkClicks;
    }

    // Process device data
    if (rawData.views.device && Array.isArray(rawData.views.device)) {
      console.log(
        "Raw device data from PostHog:",
        JSON.stringify(rawData.views.device, null, 2)
      );
      processedData.devices = rawData.views.device.map((item) => {
        const deviceType = item.breakdown_value?.toString() || "unknown";
        console.log(`Processing device type: ${deviceType}`);
        return {
          os: deviceType,
          count: item.count || 0,
        };
      });
    }

    // Process geography data
    if (rawData.views.geography && Array.isArray(rawData.views.geography)) {
      console.log(
        "Frontend processing geography data:",
        rawData.views.geography
      );
      // Log the first item to see what properties it has
      if (rawData.views.geography.length > 0) {
        console.log(
          "First geography item details:",
          JSON.stringify(rawData.views.geography[0], null, 2)
        );
        // Check if we have the correct breakdown_value property
        console.log(
          "breakdown_value from first item:",
          rawData.views.geography[0].breakdown_value
        );
      }

      processedData.geography = rawData.views.geography.map((item) => {
        // Get the country code - log all possible properties to help debug
        console.log("Geography item full properties:", Object.keys(item));

        // First try getting the breakdown_value directly from the backend
        // This is the standard field PostHog provides that contains the country code
        let countryCode = item.breakdown_value;

        // Fallback to unknown if neither exists
        if (!countryCode) {
          countryCode = "unknown";
        }

        console.log(
          `Processing geography item: Raw country code = '${countryCode}'`
        );

        // Clean up the country code
        const cleanCountryCode = String(countryCode).trim();

        return {
          country: cleanCountryCode,
          count: item.count || 0,
        };
      });

      // Log the processed geography data for debugging
      console.log("Final processed geography data:", processedData.geography);
    }

    // Process referrer data (entry)
    if (rawData.views.entry && Array.isArray(rawData.views.entry)) {
      processedData.referrers = rawData.views.entry.map((item) => ({
        path: item.breakdown_value?.toString() || "unknown",
        count: item.count || 0,
      }));
    }

    // Process exit data
    if (rawData.views.exit && Array.isArray(rawData.views.exit)) {
      processedData.exits = rawData.views.exit.map((item) => ({
        path: item.breakdown_value?.toString() || "unknown",
        count: item.count || 0,
      }));
    }

    // Calculate average clicks per view
    processedData.avgClicksPerView =
      processedData.totalViews > 0
        ? processedData.totalLinkClicks / processedData.totalViews
        : 0;
  }

  // No data state
  if (!rawData && !isAnalyticsLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-xl text-center mb-4">No analytics data available</p>
        <p className="text-muted-foreground text-center max-w-md">
          We haven&apos;t collected any analytics for this workspace yet. Check
          back later or make sure your page is receiving traffic.
        </p>
      </div>
    );
  }

  // Loading state
  if (isAnalyticsLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-xl">Loading analytics data...</p>
      </div>
    );
  }

  // Error state
  if (analyticsError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-xl text-destructive mb-2">Error loading analytics</p>
        <p className="text-muted-foreground">
          {analyticsError.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  // Create top links array for chart display
  const topLinks = processedData.linkClicks.breakdown
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((link) => {
      // Find the corresponding workspace link if available
      const workspaceLink = workspace?.links?.find(
        (wsLink) => wsLink.id === link.link_id
      );

      // Use the URL as the name, or a default if not found
      const linkName = workspaceLink
        ? workspaceLink.url.replace(/^https?:\/\//i, "").substring(0, 20) // Truncate for display
        : link.link_id === "unknown"
          ? "Unknown Link"
          : link.link_id.substring(0, 20);

      return {
        linkName: linkName + (linkName.length >= 20 ? "..." : ""),
        clicks: link.count,
      };
    });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 font-nunSans font-bold overflow-y-auto max-h-[calc(100vh-4rem)]">
      <h2 className="text-xl">Analytics</h2>

      {/* Key Metrics Row - Updated for better mobile responsiveness */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedData.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedData.uniqueVisitors.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedData.linkClicks?.total.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Clicks / View
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedData.avgClicksPerView.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Charts and Breakdowns - Updated for better mobile responsiveness */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="whitespace-nowrap">
            Overview
          </TabsTrigger>
          <TabsTrigger value="links" className="whitespace-nowrap">
            Link Performance
          </TabsTrigger>
          <TabsTrigger value="audience" className="whitespace-nowrap">
            Audience
          </TabsTrigger>
          <TabsTrigger value="traffic" className="whitespace-nowrap">
            Traffic Sources
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Views Chart */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={processedData.viewsByDay}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="views"
                      fill="#8884d8"
                      label={{ position: "top" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Link Performance Tab */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {rawData?.linkClicks &&
              rawData.linkClicks.items &&
              rawData.linkClicks.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Link Identifier</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      // Group links by link_id to combine unknown links
                      const linkGroups = new Map();

                      // Process all link items
                      rawData.linkClicks.items.forEach((link) => {
                        const key = link.link_id || "unknown";

                        if (!linkGroups.has(key)) {
                          linkGroups.set(key, {
                            link_id: key,
                            count: link.count,
                          });
                        } else {
                          // Add counts for the same link_id
                          const existing = linkGroups.get(key);
                          existing.count += link.count;
                        }
                      });

                      // Convert to array and render
                      return Array.from(linkGroups.values()).map(
                        (groupedLink, index) => {
                          // Find the corresponding link in the workspace data
                          const workspaceLink =
                            groupedLink.link_id !== "unknown"
                              ? workspace?.links?.find(
                                  (wsLink) => wsLink.id === groupedLink.link_id
                                )
                              : undefined;

                          // Determine the display value and URL
                          let displayValue =
                            groupedLink.link_id === "unknown"
                              ? "Unknown Link"
                              : groupedLink.link_id;
                          let displayUrl: string | undefined = undefined;

                          // Check for social links
                          if (
                            groupedLink.link_id &&
                            typeof groupedLink.link_id === "string" &&
                            groupedLink.link_id.startsWith("social-")
                          ) {
                            // Handle social links - display platform name or ID
                            displayValue = `Social: ${groupedLink.link_id.replace("social-", "")}`;

                            // Optionally find the URL from workspace?.socials if needed
                            // const socialLink = workspace?.socials?.find(
                            //   (s) => s.platform === groupedLink.link_id.replace("social-", "")
                            // );
                            // displayUrl = socialLink?.url;
                          } else if (workspaceLink) {
                            // Use the URL from the workspace data for regular links
                            displayValue = workspaceLink.url;
                            displayUrl = workspaceLink.url;
                          }

                          return (
                            <TableRow
                              key={`link-${groupedLink.link_id}-${index}`}
                            >
                              <TableCell className="font-medium break-all">
                                {displayUrl ? (
                                  <a
                                    href={displayUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 hover:underline"
                                    title={displayUrl}
                                  >
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                    {displayValue.length > 50
                                      ? `${displayValue.substring(0, 50)}...`
                                      : displayValue}
                                  </a>
                                ) : (
                                  <span>{displayValue}</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {groupedLink.count.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      );
                    })()}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No link click data available for this period.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab - Geo and Device - Updated for better mobile responsiveness */}
        <TabsContent
          value="audience"
          className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Geography Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(processedData.geography) &&
                  processedData.geography.length > 0 ? (
                    processedData.geography
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((geo) => {
                        // Get the country code (convert to uppercase for flag emoji use)
                        console.log("Rendering country data:", geo);
                        // Make sure we have a clean string for the country code
                        const countryCode = String(geo.country || "")
                          .trim()
                          .toUpperCase();
                        console.log("Normalized country code:", countryCode);

                        // Generate flag emoji from country code
                        // Country codes should be exactly 2 letters to generate valid flag emoji
                        const flag =
                          countryCode && countryCode.length === 2
                            ? countryCode
                                .toUpperCase()
                                .replace(/./g, (char) =>
                                  String.fromCodePoint(
                                    char.charCodeAt(0) + 127397
                                  )
                                )
                            : "🌐";

                        // Get the country name from the country code
                        const countryNames: Record<string, string> = {
                          AF: "Afghanistan",
                          AL: "Albania",
                          DZ: "Algeria",
                          AD: "Andorra",
                          AO: "Angola",
                          AG: "Antigua and Barbuda",
                          AR: "Argentina",
                          AM: "Armenia",
                          AU: "Australia",
                          AT: "Austria",
                          AZ: "Azerbaijan",
                          BS: "Bahamas",
                          BH: "Bahrain",
                          BD: "Bangladesh",
                          BB: "Barbados",
                          BY: "Belarus",
                          BE: "Belgium",
                          BZ: "Belize",
                          BJ: "Benin",
                          BT: "Bhutan",
                          BO: "Bolivia",
                          BA: "Bosnia and Herzegovina",
                          BW: "Botswana",
                          BR: "Brazil",
                          BN: "Brunei",
                          BG: "Bulgaria",
                          BF: "Burkina Faso",
                          BI: "Burundi",
                          KH: "Cambodia",
                          CM: "Cameroon",
                          CA: "Canada",
                          CV: "Cape Verde",
                          CF: "Central African Republic",
                          TD: "Chad",
                          CL: "Chile",
                          CN: "China",
                          CO: "Colombia",
                          KM: "Comoros",
                          CG: "Congo",
                          CD: "Congo (Democratic Republic)",
                          CR: "Costa Rica",
                          HR: "Croatia",
                          CU: "Cuba",
                          CY: "Cyprus",
                          CZ: "Czech Republic",
                          DK: "Denmark",
                          DJ: "Djibouti",
                          DM: "Dominica",
                          DO: "Dominican Republic",
                          EC: "Ecuador",
                          EG: "Egypt",
                          SV: "El Salvador",
                          GQ: "Equatorial Guinea",
                          ER: "Eritrea",
                          EE: "Estonia",
                          SZ: "Eswatini",
                          ET: "Ethiopia",
                          FJ: "Fiji",
                          FI: "Finland",
                          FR: "France",
                          GA: "Gabon",
                          GM: "Gambia",
                          GE: "Georgia",
                          DE: "Germany",
                          GH: "Ghana",
                          GR: "Greece",
                          GD: "Grenada",
                          GT: "Guatemala",
                          GN: "Guinea",
                          GW: "Guinea-Bissau",
                          GY: "Guyana",
                          HT: "Haiti",
                          HN: "Honduras",
                          HU: "Hungary",
                          IS: "Iceland",
                          IN: "India",
                          ID: "Indonesia",
                          IR: "Iran",
                          IQ: "Iraq",
                          IE: "Ireland",
                          IL: "Israel",
                          IT: "Italy",
                          JM: "Jamaica",
                          JP: "Japan",
                          JO: "Jordan",
                          KZ: "Kazakhstan",
                          KE: "Kenya",
                          KI: "Kiribati",
                          KP: "North Korea",
                          KR: "South Korea",
                          KW: "Kuwait",
                          KG: "Kyrgyzstan",
                          LA: "Laos",
                          LV: "Latvia",
                          LB: "Lebanon",
                          LS: "Lesotho",
                          LR: "Liberia",
                          LY: "Libya",
                          LI: "Liechtenstein",
                          LT: "Lithuania",
                          LU: "Luxembourg",
                          MG: "Madagascar",
                          MW: "Malawi",
                          MY: "Malaysia",
                          MV: "Maldives",
                          ML: "Mali",
                          MT: "Malta",
                          MH: "Marshall Islands",
                          MR: "Mauritania",
                          MU: "Mauritius",
                          MX: "Mexico",
                          FM: "Micronesia",
                          MD: "Moldova",
                          MC: "Monaco",
                          MN: "Mongolia",
                          ME: "Montenegro",
                          MA: "Morocco",
                          MZ: "Mozambique",
                          MM: "Myanmar",
                          NA: "Namibia",
                          NR: "Nauru",
                          NP: "Nepal",
                          NL: "Netherlands",
                          NZ: "New Zealand",
                          NI: "Nicaragua",
                          NE: "Niger",
                          NG: "Nigeria",
                          NO: "Norway",
                          OM: "Oman",
                          PK: "Pakistan",
                          PW: "Palau",
                          PA: "Panama",
                          PG: "Papua New Guinea",
                          PY: "Paraguay",
                          PE: "Peru",
                          PH: "Philippines",
                          PL: "Poland",
                          PT: "Portugal",
                          QA: "Qatar",
                          RO: "Romania",
                          RU: "Russia",
                          RW: "Rwanda",
                          KN: "Saint Kitts and Nevis",
                          LC: "Saint Lucia",
                          VC: "Saint Vincent and the Grenadines",
                          WS: "Samoa",
                          SM: "San Marino",
                          ST: "Sao Tome and Principe",
                          SA: "Saudi Arabia",
                          SN: "Senegal",
                          RS: "Serbia",
                          SC: "Seychelles",
                          SL: "Sierra Leone",
                          SG: "Singapore",
                          SK: "Slovakia",
                          SI: "Slovenia",
                          SB: "Solomon Islands",
                          SO: "Somalia",
                          ZA: "South Africa",
                          ES: "Spain",
                          LK: "Sri Lanka",
                          SD: "Sudan",
                          SR: "Suriname",
                          SE: "Sweden",
                          CH: "Switzerland",
                          SY: "Syria",
                          TW: "Taiwan",
                          TJ: "Tajikistan",
                          TZ: "Tanzania",
                          TH: "Thailand",
                          TL: "Timor-Leste",
                          TG: "Togo",
                          TO: "Tonga",
                          TT: "Trinidad and Tobago",
                          TN: "Tunisia",
                          TR: "Turkey",
                          TM: "Turkmenistan",
                          TV: "Tuvalu",
                          UG: "Uganda",
                          UA: "Ukraine",
                          AE: "United Arab Emirates",
                          GB: "United Kingdom",
                          US: "United States",
                          UY: "Uruguay",
                          UZ: "Uzbekistan",
                          VU: "Vanuatu",
                          VA: "Vatican City",
                          VE: "Venezuela",
                          VN: "Vietnam",
                          YE: "Yemen",
                          ZM: "Zambia",
                          ZW: "Zimbabwe",
                        };

                        // Find the country name from the code using our comprehensive mapping
                        // If the country code isn't in our mapping, fall back to the code itself
                        const countryName =
                          countryNames[countryCode] || countryCode;

                        console.log(
                          `Final resolved country name: ${countryName}`
                        );

                        return (
                          <TableRow key={geo.country}>
                            <TableCell className="font-medium">
                              <span className="mr-2 text-lg" aria-hidden="true">
                                {flag}
                              </span>
                              <span>{countryName}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              {geo.count.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          No location data available yet.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Add an 'Other' row if more exist */}
                  {processedData.geography.length > 5 && (
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Other
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {processedData.geography
                          .slice(5)
                          .reduce((sum, item) => sum + item.count, 0)
                          .toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Device Chart */}
              {processedData.devices && processedData.devices.length > 0 ? (
                <div>
                  {/* Device Icons and Labels */}
                  <div className="space-y-3 mb-6">
                    {processedData.devices
                      .sort((a, b) => b.count - a.count)
                      .map((device) => {
                        // Get device type and proper display name
                        const deviceType = device.os || "";
                        const deviceInfo = getDeviceInfo(deviceType);

                        // Calculate percentage of total device views for more accurate representation
                        const totalDeviceViews = processedData.devices.reduce(
                          (sum, d) => sum + d.count,
                          0
                        );
                        const percentage =
                          totalDeviceViews > 0
                            ? (device.count / totalDeviceViews) * 100
                            : 0;

                        return (
                          <div key={deviceType} className="flex items-center">
                            <div className="mr-3 text-muted-foreground">
                              {deviceInfo.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {deviceInfo.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {device.count.toLocaleString()} (
                                  {percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{
                                    width: `${Math.max(percentage, 3)}%`,
                                  }}
                                  title={`${percentage.toFixed(1)}% of visitors`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No device data available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources Tab - Updated for better mobile responsiveness */}
        <TabsContent value="traffic" className="space-y-4">
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Referrer Table */}
              {Array.isArray(processedData.referrers) &&
              processedData.referrers.length > 0 ? (
                <div className="min-w-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referrer</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData.referrers
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((referrer) => (
                          <TableRow key={referrer.path}>
                            <TableCell className="font-medium">
                              {/* Add link icon and make it clickable if not direct */}
                              {referrer.path === "(direct)" ? (
                                <span>(Direct)</span>
                              ) : (
                                <a
                                  href={`https://${referrer.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                  {referrer.path}
                                </a>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {referrer.count.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      {/* Add an 'Other' row if more exist */}
                      {processedData.referrers.length > 5 && (
                        <TableRow>
                          <TableCell className="font-medium text-muted-foreground">
                            Other
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {processedData.referrers
                              .slice(5)
                              .reduce((sum, item) => sum + item.count, 0)
                              .toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No referrer data available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
