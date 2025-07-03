"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { templateRegistry } from "@/lib/templates/registry";
import { TemplateShowcase, TemplateShowcaseRef } from "./template-showcase";
import { TemplateInfoDisplay } from "./template-info-display";

gsap.registerPlugin(ScrollTrigger);

export function TemplateShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const templateShowcaseRef = useRef<TemplateShowcaseRef>(null);
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
          if (sectionRef.current) {
            sectionRef.current.setAttribute("data-animated", "true");
          }

          // Simple showcase entrance
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

          // Simple button animation
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
      className="template-showcase-section min-h-screen min-w-screen flex items-center py-12"
    >
      <div className="container mx-2 px-2">
        <div className="w-full">
          {/* 3-Column Layout: Left Header + Center iPhone + Right Template Info */}
          <div className="grid grid-cols-12 gap-4 items-end min-h-[100vh] pb-32">
            {/* Left Column (20%) - Section Header */}
            <div className="col-span-12 lg:col-span-2">
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-[#A77AB4] mb-4 font-yeager">
                  TEMPLATE GALLERY
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#382F2B] mb-6 leading-tight font-[family-name:var(--harmon-semi-bold-condensed-font)]">
                  Professional
                  <span className="block text-[#D5DF35]">Templates</span>
                </h2>
                <p className="text-base text-[#A77AB4] font-yeager">
                  Each template optimized for conversions and brand appeal.
                </p>
              </div>
            </div>

            {/* Center Column (60%) - iPhone Showcase */}
            <div className="col-span-12 lg:col-span-7 h-full">
              <div className="flex justify-center h-full w-full">
                <TemplateShowcase
                  ref={templateShowcaseRef}
                  onTemplateChange={handleTemplateChange}
                  currentTemplate={currentTemplate || undefined}
                />
              </div>
            </div>

            {/* Right Column (20%) - Template Info */}
            <div className="col-span-12 lg:col-span-3">
              <div className="text-left">
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
        </div>
      </div>
    </section>
  );
}
