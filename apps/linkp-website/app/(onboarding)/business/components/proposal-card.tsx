"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MoreHorizontal, 
  ExternalLink, 
  Calendar, 
  DollarSign,
  User,
  Clock
} from "lucide-react";
import { Proposal } from "@/lib/swr/use-campaigns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ProposalCardProps {
  proposal: Proposal;
  onStatusChange?: () => void;
}

export function ProposalCard({ proposal, onStatusChange }: ProposalCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format price from cents to dollars
  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  // Calculate days remaining or days since proposal
  const getDaysInfo = () => {
    const now = new Date();
    const created = new Date(proposal.createdAt);
    const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return "Today";
    } else if (daysDiff === 1) {
      return "Yesterday";
    } else {
      return `${daysDiff} days ago`;
    }
  };

  // View creator profile
  const viewCreatorProfile = () => {
    if (proposal.workspace?.slug) {
      window.open(`/${proposal.workspace.slug}`, '_blank');
    } else {
      toast.error("Creator profile link not available");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{proposal.title}</h3>
              {getStatusBadge(proposal.status)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={viewCreatorProfile}>
                  View Creator Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(proposal.url, '_blank')}>
                  View Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Creator Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={proposal.workspace?.avatarUrl || `/placeholder.svg?height=40&width=40`} 
                alt={proposal.workspace?.name || "Creator"} 
              />
              <AvatarFallback>
                {(proposal.workspace?.name || "C").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{proposal.workspace?.name || "Unknown Creator"}</p>
              <p className="text-xs text-muted-foreground">
                {proposal.creator?.categories?.join(", ") || "No categories"}
              </p>
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-medium">{formatDate(proposal.startDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-medium">{formatDate(proposal.endDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-sm font-medium">{formatPrice(proposal.price)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Sent</p>
                <p className="text-sm font-medium">{getDaysInfo()}</p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={viewCreatorProfile}
            >
              <User className="h-4 w-4 mr-2" />
              View Creator
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(proposal.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
