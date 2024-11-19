// app/onboarding/layout.tsx
import { Metadata } from "next";
import { Steps } from "./steps";
import { FormProvider } from "./form-providers";

export const metadata: Metadata = {
  title: "Onboarding - Link Bio",
  description: "Create your stunning link in bio page",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="container flex min-h-screen items-center justify-center py-8 md:py-12 lg:py-16">
        <div className="relative w-full max-w-[1200px] space-y-8 rounded-2xl border bg-white/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/50 sm:p-8 md:p-12">
          <FormProvider>
            <Steps />
            <div className="mx-auto max-w-full">
              {children}
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
