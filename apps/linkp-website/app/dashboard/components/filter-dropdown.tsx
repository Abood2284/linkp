import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
  icon?: React.ReactNode
  label: string
}

export function FilterDropdown({ icon, label }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm font-normal h-9 w-full sm:w-auto">
          {icon}
          {label}
          <ChevronDown className="h-4 w-4 ml-auto sm:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Most Recent</DropdownMenuItem>
        <DropdownMenuItem>Most Clicked</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

