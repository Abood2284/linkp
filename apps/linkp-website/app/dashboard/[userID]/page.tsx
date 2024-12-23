import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LinkList } from "../components/link-list";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links</h1>
          <p className="text-muted-foreground">
            Manage and track your bio links
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/links/new">
            <Plus className="mr-2 h-4 w-4" />
            Create link
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="booking">Booking</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="newest">
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="clicks">Most clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <LinkList />
    </div>
  );
}
