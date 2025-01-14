import { Button } from "@/components/ui/button"

export function Pagination() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled className="h-8">
        Previous
      </Button>
      <Button variant="outline" size="sm" disabled className="h-8">
        Next
      </Button>
    </div>
  )
}

