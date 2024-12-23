"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";

type MasonryGridProps = {
  children: React.ReactNode[];
  gap?: number;
  className?: string;
};

function MasonryGrid({ children, gap = 20, className = "" }: MasonryGridProps) {
  const [columnCount, setColumnCount] = useState(3); // Default to 3 columns
  const gridRef = useRef<HTMLDivElement>(null);

  // Update column count based on container width
  useEffect(() => {
    const handleResize = () => {
      if (!gridRef.current) return;

      const width = gridRef.current.offsetWidth;
      if (width < 640) {
        setColumnCount(1); // 1 column for small screens
      } else if (width < 768) {
        setColumnCount(2); // 2 columns for medium screens
      } else {
        setColumnCount(3); // 3 columns for large screens and above
      }
    };

    handleResize(); // Initial calculation
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={gridRef}
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {React.Children.map(children, (child) => (
        <div className="break-inside-avoid">{child}</div>
      ))}
    </div>
  );
}

export default MasonryGrid;
