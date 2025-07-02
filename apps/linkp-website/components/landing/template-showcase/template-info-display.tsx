"use client";

import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Palette, Sparkles, Users } from "lucide-react";
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "minimal":
        return <Sparkles className="w-5 h-5" />;
      case "creative":
        return <Palette className="w-5 h-5" />;
      case "professional":
        return <Users className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "minimal":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "creative":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "professional":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      {/* Template Name */}
      <div className="space-y-4">
        <h3
          ref={headlineRef}
          className="headline text-4xl md:text-5xl font-black text-white leading-tight font-nohemi"
        >
          {splitTextIntoSpans(template.name)}
        </h3>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm ${getCategoryColor(
              template.category
            )}`}
          >
            {getCategoryIcon(template.category)}
            <span className="text-sm font-medium capitalize">
              {template.category}
            </span>
          </div>
        </div>
      </div>

      {/* Template Description */}
      <div className="text-xl md:text-2xl text-white/90 leading-relaxed font-yeager">
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

      {/* Template Tags */}
      <div className="flex flex-wrap gap-2">
        {template.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => onPreview?.(template.id)}
          variant="outline"
          size="lg"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Preview
        </Button>

        <Button
          onClick={() => onUseTemplate?.(template.id)}
          size="lg"
          className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Use This Template
        </Button>
        <Button
          onClick={() => (onPreview as any)?.(template.id, true)}
          variant="outline"
          size="lg"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
        >
          Preview with your content
        </Button>
      </div>

      {/* Professional Badge */}
      <div className="pt-4 border-t border-white/20">
        <div className="flex items-center gap-3 text-white/70">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            Professional Grade • Mobile Optimized • Analytics Ready
          </span>
        </div>
      </div>
    </div>
  );
}