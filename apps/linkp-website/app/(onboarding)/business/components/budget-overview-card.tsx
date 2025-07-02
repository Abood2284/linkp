"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils/budget-utils";

interface BudgetOverviewCardProps {
  totalBudget: number;
  availableBudget: number;
  totalSpent: number;
  pendingAllocations: number;
}

export function BudgetOverviewCard({
  totalBudget,
  availableBudget,
  totalSpent,
  pendingAllocations,
}: BudgetOverviewCardProps) {
  // Calculate percentages for the progress bar
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const pendingPercentage = totalBudget > 0 ? (pendingAllocations / totalBudget) * 100 : 0;
  const availablePercentage = totalBudget > 0 ? (availableBudget / totalBudget) * 100 : 0;

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Wallet className="h-5 w-5" /> Budget Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <span className="text-muted-foreground text-sm">Available Budget</span>
            <span className="text-2xl font-bold">{formatCurrency(availableBudget)}</span>
            <span className="text-xs text-muted-foreground">Remaining funds for new proposals</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <ArrowDown className="h-4 w-4 text-amber-500" /> Pending Allocations
            </span>
            <span className="text-2xl font-bold text-amber-500">{formatCurrency(pendingAllocations)}</span>
            <span className="text-xs text-muted-foreground">Funds reserved for pending proposals</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <ArrowUp className="h-4 w-4 text-green-500" /> Total Spent
            </span>
            <span className="text-2xl font-bold text-green-500">{formatCurrency(totalSpent)}</span>
            <span className="text-xs text-muted-foreground">Funds spent on accepted proposals</span>
          </div>
        </div>

        {/* Budget allocation visualization */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Budget Allocation</span>
            <span>Total: {formatCurrency(totalBudget)}</span>
          </div>
          <div className="h-2 flex rounded-full overflow-hidden">
            <div 
              className="bg-green-500" 
              style={{ width: `${spentPercentage}%` }}
              title={`Spent: ${formatCurrency(totalSpent)} (${Math.round(spentPercentage)}%)`}
            />
            <div 
              className="bg-amber-500" 
              style={{ width: `${pendingPercentage}%` }}
              title={`Pending: ${formatCurrency(pendingAllocations)} (${Math.round(pendingPercentage)}%)`}
            />
            <div 
              className="bg-primary" 
              style={{ width: `${availablePercentage}%` }}
              title={`Available: ${formatCurrency(availableBudget)} (${Math.round(availablePercentage)}%)`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span>Spent ({Math.round(spentPercentage)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
              <span>Pending ({Math.round(pendingPercentage)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-1"></div>
              <span>Available ({Math.round(availablePercentage)}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
