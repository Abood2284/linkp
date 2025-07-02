/**
 * Budget utility functions for calculating and formatting business budgets
 */

export interface BudgetData {
  // Raw budget data
  totalBudget: number;      // The total budget allocated to the business
  pendingAllocations: number; // Amount allocated to pending proposals
  totalSpent: number;       // Amount spent on accepted proposals
  
  // Calculated values
  availableBudget: number;  // Available budget (totalBudget - pendingAllocations - totalSpent)
  
  // Percentages for visualization
  spentPercentage: number;
  pendingPercentage: number;
  availablePercentage: number;
}

/**
 * Calculate budget data from raw values
 * 
 * @param totalBudget - The total budget allocated to the business
 * @param pendingAllocations - Amount allocated to pending proposals
 * @param totalSpent - Amount spent on accepted proposals
 * @returns Calculated budget data
 */
export function calculateBudgetData(
  totalBudget: number,
  pendingAllocations: number,
  totalSpent: number
): BudgetData {
  // Calculate available budget
  const availableBudget = Math.max(0, totalBudget - pendingAllocations - totalSpent);
  
  // Calculate percentages for visualization
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const pendingPercentage = totalBudget > 0 ? (pendingAllocations / totalBudget) * 100 : 0;
  const availablePercentage = totalBudget > 0 ? (availableBudget / totalBudget) * 100 : 0;
  
  return {
    totalBudget,
    pendingAllocations,
    totalSpent,
    availableBudget,
    spentPercentage,
    pendingPercentage,
    availablePercentage,
  };
}

/**
 * Format currency values for display
 * 
 * @param amount - Amount in dollars
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
