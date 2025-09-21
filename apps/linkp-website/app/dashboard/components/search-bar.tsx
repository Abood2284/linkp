// apps/linkp-website/app/dashboard/components/search-bar.tsx
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ForwardedRef, forwardRef } from "react";

export const SearchBar = forwardRef(function SearchBar(
  _props: {},
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="relative flex-1 w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={ref}
        placeholder="Search links, titles, URLs…"
        className="pl-9 h-9 w-full"
        aria-label="Search links"
      />
    </div>
  );
});
