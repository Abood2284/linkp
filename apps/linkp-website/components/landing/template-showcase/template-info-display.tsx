"use client";

import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import DecryptedText from "@/react-bits-ui/TextAnimations/DecryptedText/DecryptedText";

interface TemplateInfoDisplayProps {
  template: BaseTemplateConfig;
  onUseTemplate?: (templateId: string) => void;
  onPreview?: (templateId: string) => void;
}

export function TemplateInfoDisplay({
  template,
  onUseTemplate,
  onPreview,
}: TemplateInfoDisplayProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headlineRef.current) {
      // Kill any existing animations on these targets before starting new ones
      gsap.killTweensOf(".headline");
      gsap.killTweensOf(".headline span");

      // Reset initial state explicitly
      gsap.set(".headline", { y: 0, opacity: 1 });
      gsap.set(".headline span", { opacity: 1, y: 0 });

      // Animate the headline container
      gsap.from(".headline", {
        y: 50,
        opacity: 0,
        ease: "power2.out",
        duration: 1,
      });

      // Animate individual characters with stagger
      gsap.from(".headline span", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        delay: 0.5,
        ease: "back.out(1.7)",
      });
    }
  }, [template.name]); // Re-run animation when template changes

  // Helper function to split text into individual character spans
  const splitTextIntoSpans = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Clean Template Name */}
      <div className="space-y-4">
        <h3
          ref={headlineRef}
          className="headline text-4xl md:text-5xl font-black text-[#382F2B] leading-tight font-nohemi"
        >
          {splitTextIntoSpans(template.name)}
        </h3>
      </div>

      {/* Simple Template Description */}
      <div className="text-lg text-[#A77AB4] leading-relaxed font-yeager">
        <DecryptedText
          text={template.description}
          speed={100}
          maxIterations={20}
          characters="ABCD1234!?"
          className="revealed"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
          animateOn="view"
          revealDirection="center"
        />
      </div>

      {/* Clean Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => onUseTemplate?.(template.id)}
          size="default"
          className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
        >
          USE TEMPLATE
        </Button>

        <Button
          onClick={() => onPreview?.(template.id)}
          variant="outline"
          size="default"
          className="bg-white/50 backdrop-blur-sm border-[#A77AB4]/30 text-[#382F2B] hover:bg-white/70 hover:border-[#A77AB4]/50 transition-all duration-300 text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          PREVIEW
        </Button>
      </div>
    </div>
  );
}
