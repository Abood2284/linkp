"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const ONBOARDING_STEPS = [
  { name: "Welcome", path: "/onboarding" },
  { name: "Identity", path: "/onboarding/identity" },
  { name: "Niche", path: "/onboarding/niche" },
  { name: "Profile", path: "/onboarding/profile" },
  { name: "Plan", path: "/onboarding/plan" },
  { name: "Template", path: "/onboarding/template" },
  { name: "Social", path: "/onboarding/social" },
  { name: "Complete", path: "/onboarding/complete" },
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]["path"];

export function Steps() {
  const pathname = usePathname();
  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (step) => step.path === pathname
  );

  return (
    <div className="relative mb-8">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200" />
      <div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-coffee-500 transition-all duration-500"
        style={{
          width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%`,
        }}
      />
      <div className="relative z-10 flex justify-between">
        {ONBOARDING_STEPS.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.path} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500",
                  isActive
                    ? "bg-coffee-500 text-white"
                    : "bg-slate-200 text-slate-600",
                  isCurrent && "ring-2 ring-coffee-300 ring-offset-2"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs",
                  isActive ? "text-coffee-800" : "text-slate-500"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
