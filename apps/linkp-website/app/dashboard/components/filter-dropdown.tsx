// apps/linkp-website/app/dashboard/components/filter-dropdown.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

interface FilterDropdownProps {
  icon?: React.ReactNode;
  label: string;
}

export function FilterDropdown({ icon, label }: FilterDropdownProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-sm font-normal h-9 w-full sm:w-auto"
        >
          {icon}
          {label}
          <ChevronDown className="h-4 w-4 ml-auto sm:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {["Most Recent", "Most Clicked"].map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => setSelected(opt)}>
            <span className="mr-2 h-4 w-4 inline-flex items-center justify-center">
              {selected === opt ? <Check className="h-4 w-4" /> : null}
            </span>
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
