"use client";

import { Edit, ExternalLink, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This would come from your database
const links = [
  {
    id: "1",
    title: "Twitter Profile",
    url: "https://twitter.com/username",
    type: "social",
    clicks: 1234,
    isActive: true,
  },
  {
    id: "2",
    title: "Latest Blog Post",
    url: "https://blog.com/post",
    type: "regular",
    clicks: 567,
    isActive: true,
  },
];

export function LinkList() {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
        <div className="text-2xl">No links found</div>
        <p className="text-muted-foreground">
          Start creating short links for your marketing campaigns, referral
          programs, and more.
        </p>
        <Button asChild>
          <Link href="/dashboard/links/new">Create your first link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Card key={link.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>{link.title}</CardTitle>
              <CardDescription className="line-clamp-1">
                {link.url}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/links/${link.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={link.url} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="capitalize">{link.type}</div>
              <div>{link.clicks.toLocaleString()} clicks</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
