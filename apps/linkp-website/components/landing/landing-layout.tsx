"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ========================================
// CONTEXT SETUP
// ========================================
// Simplified context for hero content (no longer tied to iPhone animations)
const HeroContentContext = createContext<{
  showHeroContent: boolean;
  setHeroAnimationsComplete: (complete: boolean) => void;
  setHeroTimeline: (timeline: any) => void;
}>({
  showHeroContent: true, // Always show hero content immediately
  setHeroAnimationsComplete: () => {},
  setHeroTimeline: () => {},
});

export const useHeroContent = () => useContext(HeroContentContext);

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  // ========================================
  // REFS SETUP
  // ========================================
  const backgroundRef = useRef<HTMLDivElement>(null);
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  // ========================================
  // SMOOTH SCROLLING & SECTION COLOR CHANGES
  // ========================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize GSAP ScrollSmoother for smooth scrolling experience
      let smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current,
        content: smoothContentRef.current,
        smooth: 2.5, // Smoothness factor
        effects: true, // Enable GSAP effects
        normalizeScroll: true, // Normalize scroll behavior across devices
      });

      // Define each section and its corresponding background color
      const sections = [
        { className: ".value-proposition-section", color: "#EB5F28" }, // Orange
        { className: ".template-showcase-section", color: "#FBF8EC" }, // Dark brown
        { className: ".comparison-section", color: "#FBF8EC" }, // Light cream
        { className: ".process-section", color: "#382F2B" }, // Dark brown
        { className: ".final-cta-section", color: "#382F2B" }, // Dark brown
      ];

      // Create ScrollTrigger for each section to change background color
      sections.forEach((section, index) => {
        const element = document.querySelector(section.className);
        if (element) {
          ScrollTrigger.create({
            trigger: element,
            start: "top 60%",
            end: "bottom 15%",
            onEnter: () => {
              gsap.to(backgroundRef.current, {
                backgroundColor: section.color,
                duration: 1.2,
                ease: "power2.out",
              });
            },
            onLeaveBack: () => {
              const prevColor =
                index === 0 ? "#FBF8EC" : sections[index - 1]?.color;
              gsap.to(backgroundRef.current, {
                backgroundColor: prevColor,
                duration: 1.2,
                ease: "power2.out",
              });
            },
          });
        }
      });

      // Cleanup function to prevent memory leaks
      return () => {
        smoother?.kill();
      };
    });

    return () => ctx.revert();
  }, []);

  // ========================================
  // RENDER STRUCTURE
  // ========================================
  return (
    <div className="relative min-h-screen">
      {/* SQUIRCLE BUTTON STYLING */}
      <style jsx global>{`
        /* Squircle button styling for landing page */
        #smooth-wrapper button,
        #smooth-wrapper .btn,
        #smooth-wrapper [role="button"],
        #smooth-wrapper a.button,
        #smooth-wrapper .button {
          border-radius: 16px !important;
          background-clip: padding-box !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-size: 16px !important;
          font-family: "yeager" !important;
          font-weight: 500 !important;
          letter-spacing: 0.025em !important;
        }

        /* Enhanced squircle for primary buttons */
        #smooth-wrapper button.squircle,
        #smooth-wrapper .btn.squircle,
        #smooth-wrapper .squircle {
          border-radius: 20px !important;
          background-clip: padding-box !important;
          transform-origin: center !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em !important;
        }

        /* Hover and active states for squircle buttons */
        #smooth-wrapper button:hover,
        #smooth-wrapper .btn:hover,
        #smooth-wrapper [role="button"]:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }

        #smooth-wrapper button:active,
        #smooth-wrapper .btn:active,
        #smooth-wrapper [role="button"]:active {
          transform: translateY(0px) !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }

        /* Specific overrides for Shadcn UI buttons */
        #smooth-wrapper .inline-flex.items-center.justify-center {
          border-radius: 16px !important;
        }

        /* Large button variant with more pronounced squircle */
        #smooth-wrapper button.btn-lg,
        #smooth-wrapper .btn-lg {
          border-radius: 24px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }

        /* Small button variant */
        #smooth-wrapper button.btn-sm,
        #smooth-wrapper .btn-sm {
          border-radius: 12px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
        }
      `}</style>

      {/* ANIMATED BACKGROUND ELEMENT */}
      <div
        ref={backgroundRef}
        className="fixed inset-0 -z-10 bg-[#FBF8EC] transition-colors duration-1000 ease-out"
      />

      {/* SMOOTH SCROLL WRAPPER */}
      <div ref={smoothWrapperRef} id="smooth-wrapper">
        <div ref={smoothContentRef} id="smooth-content">
          {/* PAGE CONTENT WITH CONTEXT PROVIDER */}
          <HeroContentContext.Provider
            value={{
              showHeroContent: true, // Always true now
              setHeroAnimationsComplete: () => {},
              setHeroTimeline: () => {},
            }}
          >
            {children}
          </HeroContentContext.Provider>
        </div>
      </div>
    </div>
  );
}
