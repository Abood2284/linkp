import React from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  title?: string;
  className?: string;
}

export function SectionDivider({ title, className }: SectionDividerProps) {
  if (!title)
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center my-6",
          className
        )}
      >
        <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-linkp-blue/30 to-transparent" />
      </div>
    );
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center my-6 px-4",
        className
      )}
    >
      <div className="flex-grow h-px bg-gradient-to-r from-transparent to-linkp-blue/30 max-w-[80px]" />
      <div className="mx-4">
        <span className="text-sm font-medium text-linkp-blue-dark/60 uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="flex-grow h-px bg-gradient-to-l from-transparent to-linkp-blue/30 max-w-[80px]" />
    </div>
  );
}

export default SectionDivider;
