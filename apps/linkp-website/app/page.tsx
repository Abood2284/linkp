// apps/linkp-website/app/page.tsx
import { LandingLayout } from "@/components/landing/landing-layout";
import { HeroSection } from "@/components/landing/hero-section/hero-section";
import { ValuePropositionSection } from "@/components/landing/value-proposition/value-proposition-section";
import { ProcessSection } from "@/components/landing/process-section/process-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section/final-cta-section";
import { ComparisonSection } from "@/components/landing/comparison-section/comparison-section";
import { TemplateShowcaseSection } from "@/components/landing/template-showcase/template-showcase-section";

export default function HomePage() {
  return (
    <>
      <LandingLayout>
        <HeroSection />
        <ValuePropositionSection />
        <TemplateShowcaseSection />
        <ComparisonSection />
        <ProcessSection />
        <FinalCtaSection />
      </LandingLayout>
    </>
  );
}
