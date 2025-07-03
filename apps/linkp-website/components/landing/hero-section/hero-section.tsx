"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useHeroContent } from "../landing-layout";

export interface HeroSectionRef {
  titleRef: HTMLHeadingElement | null;
  subtitleRef: HTMLParagraphElement | null;
  ctaRef: HTMLButtonElement | null;
}

export function HeroSection() {
  const heroQualificationRef = useRef<HTMLParagraphElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Get hero content visibility state
  const { showHeroContent, setHeroAnimationsComplete } = useHeroContent();

  // Set initial hidden states immediately
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only animate refs that exist
      const targets = [
        heroQualificationRef.current,
        heroSubtitleRef.current,
        heroCtaRef.current,
      ].filter(Boolean);
      if (targets.length) {
        gsap.set(targets, {
          opacity: 0,
          y: 100,
        });
      }

      // Set initial states for words
      gsap.set(".hero-word", {
        opacity: 0,
        y: 100,
        rotateX: -90,
      });
    });

    return () => ctx.revert();
  }, []);

  // Animate hero content when iPhone animation completes
  useEffect(() => {
    if (!showHeroContent) return;

    console.log("Starting hero content animations");

    const ctx = gsap.context(() => {
      // Only animate refs that exist
      const targets = [
        heroQualificationRef.current,
        heroSubtitleRef.current,
        heroCtaRef.current,
      ].filter(Boolean);
      // Create timeline for hero animations
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          console.log("Hero animations complete - triggering iPhone exit");
          setHeroAnimationsComplete(true);
        },
      });

      // Animate qualification first (if it exists)
      if (targets[0]) {
        tl.to(targets[0], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Animate title words one by one with a more dynamic effect
      tl.to(
        ".hero-word",
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.1,
          ease: "back.out(2)",
          stagger: 0.18,
          delay: 0.5,
        },
        "-=0.2"
      );

      // Animate subtitle (if it exists)
      if (targets[1]) {
        tl.to(
          targets[1],
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      // Animate CTA button (if it exists)
      if (targets[2]) {
        tl.to(
          targets[2],
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.7"
        );
      }
    });

    return () => ctx.revert();
  }, [showHeroContent]);

  return (
    <section className="hero-content relative min-h-screen flex items-center justify-center">
      {/* Content */}
      <div className="container mx-auto px-6 text-center relative max-w-6xl">
        {/* Main Headline - Damaging Admission + Status */}
        <h1
          ref={heroTitleRef}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#382F2B] leading-[0.95] tracking-tight mb-6 sm:mb-8 font-nohemi max-w-xs xs:max-w-sm sm:max-w-5xl mx-auto"
        >
          <span className="hero-word inline-block mr-2">Manage</span>
          <span className="hero-word inline-block mr-2">Links</span>
          <span className="hero-word inline-block mr-2">like</span>
          <span
            className="hero-word inline-block font-harmonSemiBoldCondensed italic text-[#A77AB4] ml-2"
            style={{ fontStyle: "italic" }}
          >
            never before
          </span>
        </h1>

        {/* Status Promise */}
        <p
          ref={heroSubtitleRef}
          className="text-sm xs:text-base sm:text-lg md:text-2xl text-[#A77AB4] font-medium max-w-xs xs:max-w-sm sm:max-w-4xl mx-auto mb-8 sm:mb-16 leading-relaxed font-absans"
        >
          Stand out as a Creator where brands reach out to YOU, not the other
          way around.
        </p>

        {/* CTA */}
        {/*
        <Button
          ref={heroCtaRef}
          size="lg"
          className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] px-16 py-8 text-lg font-bold rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-volaroidSan"
          onClick={() => router.push("/creator/select-template")}
        >
          SEE IF YOU QUALIFY
        </Button>
        */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-[#382F2B] px-8 py-5 text-base sm:text-lg font-bold rounded-none font-volaroidSan border-[#382F2B] hover:bg-[#f5f5f5]"
            onClick={() => router.push("/authentication")}
          >
            Login
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] px-8 py-5 text-base sm:text-lg font-bold rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-volaroidSan"
            onClick={() => router.push("/waitlist")}
          >
            Join Waitlist
          </Button>
        </div>

        {/* Trust Indicator */}
        <p className="text-sm text-[#382F2B]/60 mt-6 font-absans">
          Join 847+ creators who get brand partnership offers in their DMs
        </p>
      </div>
    </section>
  );
}
