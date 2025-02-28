import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatsCard } from "../components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessDashboard() {
  return (
    <div>
      <div className="p-6 space-y-6">
        {/* Stats Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Campaigns"
            value={24}
            trend={{
              value: "+12% from last month",
              isPositive: true,
            }}
          />
          <StatsCard
            title="Total Reach"
            value="1.2M"
            trend={{
              value: "+8% from last month",
              isPositive: true,
            }}
          />
          <StatsCard
            title="Conversion Rate"
            value="3.8%"
            trend={{
              value: "-2% from last month",
              isPositive: false,
            }}
          />
          <StatsCard
            title="ROI"
            value="287%"
            trend={{
              value: "+15% from last month",
              isPositive: true,
            }}
          />
        </div>

        {/* Recent Activity & Active Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Activity</CardTitle>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity items */}
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10">
                      <img
                        src={activity.avatar}
                        alt={activity.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {activity.message}
                        <span className="font-medium"> {activity.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Active Campaigns</CardTitle>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Campaign items */}
                {activeCampaigns.map((campaign, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                      <span>{campaign.creators} Creators</span>
                      <span>Ends in {campaign.timeLeft}</span>
                    </div>
                    <div className="mt-3 w-full bg-secondary/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sample data
const recentActivities = [
  {
    name: "Sarah Johnson",
    message: "New proposal accepted by",
    time: "2 hours ago",
    avatar: "https://avatar.iran.liara.run/public",
  },
  {
    name: "Mark Wilson",
    message: "Campaign completed with",
    time: "5 hours ago",
    avatar: "https://avatar.iran.liara.run/public",
  },
  {
    name: "Emily Chen",
    message: "New message from",
    time: "1 day ago",
    avatar: "https://avatar.iran.liara.run/public",
  },
];

const activeCampaigns = [
  {
    name: "Summer Collection Launch",
    creators: 5,
    timeLeft: "12 days",
    progress: 65,
  },
  {
    name: "Brand Awareness",
    creators: 3,
    timeLeft: "8 days",
    progress: 45,
  },
  {
    name: "Product Review Series",
    creators: 7,
    timeLeft: "15 days",
    progress: 25,
  },
];
