// apps/linkp-website/app/dashboard/components/pagination.tsx
import { Button } from "@/components/ui/button";

export function Pagination() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8" disabled>
        Previous
      </Button>
      <Button variant="outline" size="sm" className="h-8" disabled>
        Next
      </Button>
    </div>
  );
}
