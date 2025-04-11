// apps/linkp-website/app/(onboarding)/business/onboarding/layout.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboardingStore } from "@/lib/stores/business-onboarding-store";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const steps = [
  {
    id: 1,
    name: "Company Profile",
    path: "/business/onboarding/company-profile",
  },
  { id: 2, name: "Goals", path: "/business/onboarding/goals" },
  {
    id: 3,
    name: "Creator Preferences",
    path: "/business/onboarding/creator-preferences",
  },
  { id: 4, name: "Subscription", path: "/business/onboarding/subscription" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentStep, setCurrentStep, isStepComplete, getProgress } =
    useOnboardingStore();
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Sync current step with URL path on mount
  useEffect(() => {
    const currentPath = pathname;
    const matchedStep = steps.find((step) => step.path === currentPath);
    if (matchedStep && matchedStep.id !== currentStep) {
      setCurrentStep(matchedStep.id);
    }
  }, [pathname, currentStep, setCurrentStep]);

  // Update progress calculation
  useEffect(() => {
    setProgress(getProgress());
  }, [getProgress]);

  const currentStepData =
    steps.find((step) => step.id === currentStep) || steps[0];

  const handleNext = () => {
    startTransition(() => {
      if (currentStep < steps.length) {
        const nextStep = steps.find((step) => step.id === currentStep + 1);
        if (nextStep) {
          router.push(nextStep.path);
        }
      } else {
        // Final step - redirect to dashboard
        router.push("/business/dashboard");
      }
    });
  };

  const handlePrevious = () => {
    startTransition(() => {
      if (currentStep > 1) {
        const prevStep = steps.find((step) => step.id === currentStep - 1);
        if (prevStep) {
          router.push(prevStep.path);
        }
      }
    });
  };

  const isLastStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Business Account Setup</h1>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <div className="flex space-x-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`${
                      currentStep === step.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                    {step.id < steps.length && " →"}
                  </div>
                ))}
              </div>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress
              value={progress}
              className="h-2"
              aria-label="Onboarding progress"
              max={100}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{currentStepData.name}</h2>
            <p className="text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          {children}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ChevronLeft className="mr-2 h-4 w-4" />
              )}
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep) || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isLastStep ? "Complete Setup" : "Next"}
                  {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
