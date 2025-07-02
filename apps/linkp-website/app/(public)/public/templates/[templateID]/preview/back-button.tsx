"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BackButton({ templateName }: { templateName: string }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Hide the button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Only hide if not in the initial 3-second period
    setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 500); // Small delay before hiding
  };

  return (
    <div
      className="fixed top-4 left-4 z-50 w-20 h-12" // Fixed dimensions for hover area
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={handleBack}
        variant="secondary"
        className={`
          flex items-center gap-2 bg-white shadow-md hover:shadow-lg 
          transition-all duration-500 ease-in-out
          ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
        `}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to {templateName}</span>
      </Button>
    </div>
  );
}
