import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Discover Creators</h1>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search creators by name, niche, or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <Card className="col-span-3">
          <CardHeader className="text-lg font-medium">Filters</CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Follower Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Follower Range</label>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0K</span>
                <span>1M+</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worldwide">Worldwide</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer">
                  Instagram
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  TikTok
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  YouTube
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  Twitter
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creators Grid */}
        <div className="col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Creator Cover Image */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500" />

                {/* Creator Info */}
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between -mt-12">
                    <Avatar className="h-16 w-16 border-4 border-background">
                      <AvatarImage
                        src={`https://avatar.iran.liara.run/public/${i + 1}`}
                      />
                      <AvatarFallback>CC</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="secondary">
                      View Profile
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold">Creator Name {i + 1}</h3>
                    <p className="text-sm text-muted-foreground">@username</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Lifestyle</Badge>
                    <Badge variant="secondary">Fashion</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-medium">150K</div>
                      <div className="text-xs text-muted-foreground">
                        Followers
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">4.8%</div>
                      <div className="text-xs text-muted-foreground">
                        Eng. Rate
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">$500</div>
                      <div className="text-xs text-muted-foreground">
                        Avg. Cost
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
