"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TemplateShowcase, TemplateShowcaseRef } from "./template-showcase";
import { TemplateInfoDisplay } from "./template-info-display";
import { templateRegistry } from "@/lib/templates/registry";
import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { useRouter } from "next/navigation";
import { TrendingUp, Eye, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function TemplateShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const templateShowcaseRef = useRef<TemplateShowcaseRef>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [currentTemplate, setCurrentTemplate] =
    useState<BaseTemplateConfig | null>(null);

  // Initialize with first template
  useEffect(() => {
    const templates = templateRegistry.getAvailableTemplates("free", "creator");
    if (templates.length > 0) {
      setCurrentTemplate(templates[0]);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          // Mark section as animated to prevent child conflicts
          if (sectionRef.current) {
            sectionRef.current.setAttribute("data-animated", "true");
          }

          // Animate template showcase container
          if (templateShowcaseRef.current?.container) {
            gsap.fromTo(
              templateShowcaseRef.current.container,
              {
                scale: 0.9,
                opacity: 0,
                y: 30,
              },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.2,
              }
            );
          }

          // Animate metrics with stagger
          if (metricsRef.current) {
            gsap.fromTo(
              metricsRef.current.children,
              { y: 50, opacity: 0, scale: 0.8 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                stagger: 0.1,
                delay: 0.5,
              }
            );
          }

          // Animate navigation buttons
          if (
            templateShowcaseRef.current?.prevButton &&
            templateShowcaseRef.current?.nextButton
          ) {
            gsap.fromTo(
              [
                templateShowcaseRef.current.prevButton,
                templateShowcaseRef.current.nextButton,
              ],
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                delay: 0.8,
                stagger: 0.1,
              }
            );
          }
        },
        onLeaveBack: () => {
          // Remove animation marker when leaving
          if (sectionRef.current) {
            sectionRef.current.removeAttribute("data-animated");
          }

          // Reset animations when scrolling back
          if (templateShowcaseRef.current?.container) {
            gsap.to(templateShowcaseRef.current.container, {
              scale: 0.9,
              opacity: 0,
              y: 30,
              duration: 0.4,
              ease: "power2.in",
            });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Template handlers
  const handleTemplateChange = (template: BaseTemplateConfig) => {
    setCurrentTemplate(template);
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/creator/select-template?template=${templateId}`);
  };

  const handlePreviewTemplate = (templateId: string) => {
    router.push(`/public/templates/${templateId}/preview`);
  };

  return (
    <section
      ref={sectionRef}
      className="template-showcase-section min-h-screen flex items-center py-20"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Show Don't Tell */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight font-[family-name:var(--harmon-semi-bold-condensed-font)]">
              Choose templates built for
              <span className="block text-[#D5DF35]">
                professional creators who monetize
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto font-yeager mb-8">
              Every element optimized for clicks, conversions, and brand appeal.
            </p>
          </div>

          {/* Interactive Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Template Showcase with iPhone */}
            <div className="flex justify-center lg:justify-start relative">
              <TemplateShowcase
                ref={templateShowcaseRef}
                onTemplateChange={handleTemplateChange}
                currentTemplate={currentTemplate || undefined}
              />
            </div>

            {/* Right: Template Information */}
            <div className="flex justify-center lg:justify-start">
              <div className="max-w-md w-full">
                {currentTemplate && (
                  <TemplateInfoDisplay
                    template={currentTemplate}
                    onUseTemplate={handleUseTemplate}
                    onPreview={handlePreviewTemplate}
                  />
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-[#EB5F28] hover:bg-[#d55530] text-white font-bold px-12 py-6 text-lg rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-volaroidSan"
              onClick={() => router.push("/creator/select-template")}
            >
              PREVIEW YOUR TEMPLATE
            </Button>
            <p className="text-white/60 mt-4 text-sm">
              See how your professional page will look
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
