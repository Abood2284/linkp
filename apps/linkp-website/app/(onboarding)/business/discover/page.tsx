"use client";

import { useState } from "react";
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
import {
  DiscoverCreatorsFilters,
  useDiscoverCreators,
} from "@/lib/swr/use-discover-creator";

export default function DiscoverPage() {
  // State for search input
  const [searchInput, setSearchInput] = useState("");

  // State for filters
  const [filters, setFilters] = useState<DiscoverCreatorsFilters>({
    page: 1,
    limit: 9,
  });

  // Fetch creators using our hook
  const { creators, pagination, isLoading } = useDiscoverCreators(filters);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  };

  // Handle follower range slider change
  const handleFollowerRangeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minFollowers: value[0] * 10000, // Convert 0-100 to 0-1M
      maxFollowers: value[1] * 10000,
      page: 1,
    }));
  };

  // Handle location selection
  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, location: value, page: 1 }));
  };

  // Handle platform selection
  const handlePlatformClick = (platform: string) => {
    setFilters((prev) => ({
      ...prev,
      platform: prev.platform === platform ? undefined : platform,
      page: 1,
    }));
  };

  // Format large numbers with K/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Discover Creators</h1>
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search creators by name, niche, or location..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <Card className="col-span-12 md:col-span-3">
          <CardHeader className="text-lg font-medium">Filters</CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={handleCategoryChange}
              >
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
                value={[
                  filters.minFollowers ? filters.minFollowers / 10000 : 0,
                  filters.maxFollowers ? filters.maxFollowers / 10000 : 100,
                ]}
                onValueChange={handleFollowerRangeChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0K</span>
                <span>1M+</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select
                value={filters.location}
                onValueChange={handleLocationChange}
              >
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
                {["instagram", "tiktok", "youtube", "twitter"].map(
                  (platform) => (
                    <Badge
                      key={platform}
                      variant={
                        filters.platform === platform ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handlePlatformClick(platform)}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creators Grid */}
        <div className="col-span-12 md:col-span-9">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-32 bg-muted" />
                    <div className="p-4 space-y-4">
                      <div className="flex items-start justify-between -mt-12">
                        <div className="h-16 w-16 rounded-full bg-muted" />
                        <div className="h-8 w-24 bg-muted rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-16" />
                        <div className="h-6 bg-muted rounded w-16" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-10 bg-muted rounded" />
                        <div className="h-10 bg-muted rounded" />
                        <div className="h-10 bg-muted rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Results grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map((creator, i) => (
                <Card key={creator.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Creator Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500" />

                    {/* Creator Info */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-start justify-between -mt-12">
                        <Avatar className="h-16 w-16 border-4 border-background">
                          <AvatarImage
                            src={
                              creator.image ||
                              `https://avatar.iran.liara.run/public/${i + 1}`
                            }
                          />
                          <AvatarFallback>
                            {creator.name?.substring(0, 2).toUpperCase() ||
                              "CC"}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => window.location.href = `/business/creator/${creator.id}`}
                        >
                          View Profile
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-semibold">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {creator.username}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {creator.categories?.map((category) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-medium">
                            {formatNumber(creator.followerCount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Followers
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {creator.engagementRate}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Eng. Rate
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {creator.averageCost}
                          </div>
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
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: prev.page ? prev.page - 1 : 1,
                    }))
                  }
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, pagination.pages) }).map(
                  (_, i) => {
                    // Show current page and surrounding pages
                    let pageToShow = pagination.page;
                    if (pagination.page < 3) {
                      pageToShow = i + 1;
                    } else if (pagination.page > pagination.pages - 2) {
                      pageToShow = pagination.pages - 4 + i;
                    } else {
                      pageToShow = pagination.page - 2 + i;
                    }

                    // Keep page numbers in valid range
                    if (pageToShow > 0 && pageToShow <= pagination.pages) {
                      return (
                        <Button
                          key={pageToShow}
                          variant={
                            pagination.page === pageToShow
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              page: pageToShow,
                            }))
                          }
                        >
                          {pageToShow}
                        </Button>
                      );
                    }
                    return null;
                  }
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: (prev.page || 1) + 1,
                    }))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
