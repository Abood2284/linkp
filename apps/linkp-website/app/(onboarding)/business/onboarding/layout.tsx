"use client";

import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";

const STEPS = [
  { path: "company-profile", label: "Company Profile" },
  { path: "goals", label: "Goals & Budget" },
  { path: "creator-preferences", label: "Creator Preferences" },
  { path: "subscription", label: "Subscription" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = STEPS.findIndex((step) => pathname.includes(step.path));
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-10">
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            {STEPS.map((step, index) => (
              <span
                key={step.path}
                className={index <= currentStep ? "text-primary" : ""}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
