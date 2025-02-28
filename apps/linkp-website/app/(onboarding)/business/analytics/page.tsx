"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDateRangePicker } from "../components/date-range-picker";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";

// Sample data
const performanceData = [
  { date: "Jan", impressions: 120000, engagement: 32000, conversions: 2400 },
  { date: "Feb", impressions: 160000, engagement: 28000, conversions: 3100 },
  { date: "Mar", impressions: 180000, engagement: 41000, conversions: 3800 },
  { date: "Apr", impressions: 250000, engagement: 55000, conversions: 4200 },
  { date: "May", impressions: 320000, engagement: 68000, conversions: 5100 },
  { date: "Jun", impressions: 280000, engagement: 62000, conversions: 4800 },
];

const campaignPerformance = [
  {
    name: "Summer Collection",
    impressions: 180000,
    engagement: 12.4,
    conversions: 3.2,
  },
  {
    name: "Fall Preview",
    impressions: 150000,
    engagement: 10.8,
    conversions: 2.8,
  },
  {
    name: "Holiday Special",
    impressions: 220000,
    engagement: 15.2,
    conversions: 4.1,
  },
  {
    name: "Spring Launch",
    impressions: 190000,
    engagement: 13.5,
    conversions: 3.5,
  },
];

const creatorPerformance = [
  { name: "Creator 1", engagement: 15.2, roi: 320, followers: 250000 },
  { name: "Creator 2", engagement: 12.8, roi: 280, followers: 180000 },
  { name: "Creator 3", engagement: 18.5, roi: 420, followers: 350000 },
  { name: "Creator 4", engagement: 14.2, roi: 300, followers: 220000 },
];

const overviewStats = [
  {
    title: "Total Impressions",
    value: "1.2M",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Engagement Rate",
    value: "4.8%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
  },
  {
    title: "Conversion Rate",
    value: "2.4%",
    change: "-0.8%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    title: "Average ROI",
    value: "320%",
    change: "+15.4%",
    trend: "up",
    icon: DollarSign,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track your campaign performance and ROI
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CalendarDateRangePicker />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="summer">Summer Collection</SelectItem>
              <SelectItem value="fall">Fall Preview</SelectItem>
              <SelectItem value="holiday">Holiday Special</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </span>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-full",
                    stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                  )}
                >
                  <stat.icon
                    className={cn(
                      "w-4 h-4",
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {stat.trend === "up" ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm ml-1",
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  )}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions & Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Impressions & Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient
                      id="impressions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#impressions)"
                    name="Impressions"
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#engagement)"
                    name="Engagement"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign & Creator Performance */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="creators">Creator Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignPerformance} barSize={40}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#22c55e"
                    />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar
                      yAxisId="left"
                      dataKey="impressions"
                      fill="#6366f1"
                      name="Impressions"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="engagement"
                      fill="#22c55e"
                      name="Engagement Rate (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators">
          <Card>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={creatorPerformance} barSize={40}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#22c55e"
                    />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar
                      yAxisId="left"
                      dataKey="engagement"
                      fill="#6366f1"
                      name="Engagement Rate (%)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="roi"
                      fill="#22c55e"
                      name="ROI (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
