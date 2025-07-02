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
      // Set initial states - everything hidden
      gsap.set(
        [
          heroQualificationRef.current,
          heroSubtitleRef.current,
          heroCtaRef.current,
        ],
        {
          opacity: 0,
          y: 100,
        }
      );

      // Set initial state for title words
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
      // Create timeline for hero animations
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          console.log("Hero animations complete - triggering iPhone exit");
          setHeroAnimationsComplete(true);
        },
      });

      // Animate qualification first
      tl.to(heroQualificationRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })

        // Animate title words one by one with a more dynamic effect
        .to(
          ".hero-word",
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2, // Slower duration for a more dramatic effect
            ease: "back.out(2)", // A more playful ease
            stagger: 0.08, // Slightly faster stagger
          },
          "-=0.2"
        )

        // Animate subtitle
        .to(
          heroSubtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5" // Overlap with the end of the title animation
        )

        // Animate CTA button
        .to(
          heroCtaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.7" // Overlap even more for a faster feel
        );
    });

    return () => ctx.revert();
  }, [showHeroContent]);

  return (
    <section className="hero-content relative min-h-screen flex items-center justify-center">
      {/* Content */}
      <div className="container mx-auto px-6 text-center relative max-w-6xl">
        {/* Qualification Hook */}
        <p
          ref={heroQualificationRef}
          className="text-sm md:text-sm text-[#EB5F28] font-bold mb-8 tracking-wide font-yeager border-2 border-[#EB5F28]/20 bg-[#EB5F28]/5 px-6 py-3 rounded-full inline-block"
        >
          Not for new creators with 500 followers — This is for established
          creators with 5K-1M followers ready to turn their audience into income
        </p>

        {/* Main Headline - Damaging Admission + Status */}
        <h1
          ref={heroTitleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-[#382F2B] leading-[0.9] tracking-tight mb-8 font-nohemi max-w-5xl mx-auto"
        >
          <span className="hero-word inline-block">Linkp</span>{" "}
          <span className="hero-word inline-block">doesn't</span>{" "}
          <span className="hero-word inline-block">have</span>{" "}
          <span className="hero-word inline-block">the</span>{" "}
          <span className="hero-word inline-block">most</span>
          <span className="block mt-4">
            <span className="hero-word inline-block">templates</span>{" "}
            <span className="hero-word inline-block">in</span>{" "}
            <span className="hero-word inline-block">the</span>{" "}
            <span className="hero-word inline-block">market</span>{" "}
            <span className="hero-word inline-block text-[#EB5F28]">—</span>
          </span>
          <span className="block text-[#EB5F28] font-harmonSemiBoldCondensed mt-4">
            <span className="hero-word inline-block">but</span>{" "}
            <span className="hero-word inline-block">every</span>{" "}
            <span className="hero-word inline-block">feature</span>{" "}
            <span className="hero-word inline-block">is</span>{" "}
            <span className="hero-word inline-block">built</span>
          </span>
          <span className="block text-[#D5DF35] font-harmonSemiBoldCondensed">
            <span className="hero-word inline-block">for</span>{" "}
            <span className="hero-word inline-block">monetization,</span>{" "}
            <span className="hero-word inline-block">not</span>{" "}
            <span className="hero-word inline-block">fluff</span>
          </span>
        </h1>

        {/* Status Promise */}
        <p
          ref={heroSubtitleRef}
          className="text-2xl md:text-3xl text-[#A77AB4] font-medium max-w-4xl mx-auto mb-16 leading-relaxed font-absans"
        >
          Stand out as a Pro Creator where brands reach out to YOU, not the
          other way around.
        </p>

        {/* CTA */}

        <Button
          ref={heroCtaRef}
          size="lg"
          className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] px-16 py-8 text-lg font-bold rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-volaroidSan"
          onClick={() => router.push("/creator/select-template")}
        >
          SEE IF YOU QUALIFY
        </Button>

        {/* Trust Indicator */}
        <p className="text-sm text-[#382F2B]/60 mt-6 font-absans">
          Join 847+ creators who get brand partnership offers in their DMs
        </p>
      </div>
    </section>
  );
}
