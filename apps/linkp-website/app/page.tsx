// apps/linkp-website/app/page.tsx
"use client";

import { useState } from "react";
import { LandingLayout } from "@/components/landing/landing-layout";
import { HeroSection } from "@/components/landing/hero-section/hero-section";
import { ValuePropositionSection } from "@/components/landing/value-proposition/value-proposition-section";
import { ProcessSection } from "@/components/landing/process-section/process-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section/final-cta-section";
import { ComparisonSection } from "@/components/landing/comparison-section/comparison-section";
import { TemplateShowcaseSection } from "@/components/landing/template-showcase/template-showcase-section";
import { LoadingScreen } from "@/components/shared/loading-screen";

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true);

  if (showLoading) {
    return (
      <LoadingScreen onComplete={() => setShowLoading(false)} duration={4000} />
    );
  }

  return (
    <>
      <LandingLayout>
        <HeroSection />
        {/* <ValuePropositionSection />
        <TemplateShowcaseSection />
        <ComparisonSection />
        <ProcessSection />
        <FinalCtaSection /> */}
      </LandingLayout>
    </>
  );
}
