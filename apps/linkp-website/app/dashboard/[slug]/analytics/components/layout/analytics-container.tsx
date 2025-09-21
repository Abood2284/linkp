import { ReactNode } from "react";

interface AnalyticsContainerProps {
  children: ReactNode;
  className?: string;
}

export function AnalyticsContainer({
  children,
  className,
}: AnalyticsContainerProps) {
  return <div className={`max-w-7xl mx-auto ${className}`}>{children}</div>;
}
