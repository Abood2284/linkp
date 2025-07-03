"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Particles from "@/react-bits-ui/Backgrounds/Particles/Particles";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({
  onComplete,
  duration = 4000,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".loading-letter", {
        opacity: 0,
        scale: 0.8,
        y: 100,
        rotateX: -90,
      });

      // Animate letters in sequence
      gsap.to(".loading-letter", {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        delay: 1,
      });

      // Add a gentle glow effect
      gsap.to(logoRef.current, {
        filter: "drop-shadow(0 0 30px rgba(213, 223, 53, 0.3))",
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      // Fade out and complete
      const fadeOutTimer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setIsVisible(false);
            onComplete?.();
          },
        });
      }, duration - 500); // Start fade 500ms before completion

      return () => clearTimeout(fadeOutTimer);
    });

    return () => ctx.revert();
  }, [onComplete, duration]);

  // Split LINKP into individual letters for animation
  const logoLetters = "LINKP".split("").map((letter, index) => (
    <span
      key={index}
      className="loading-letter inline-block font-harmonSemiBoldCondensed"
    >
      {letter}
    </span>
  ));

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#FBF8EC] overflow-hidden"
      style={{ zIndex: 100 }}
    >
      {/* Particles Background */}
      <div className="absolute inset-0 z-[1]">
        <Particles
          particleCount={100}
          particleSpread={8}
          speed={0.3}
          particleColors={["#D5DF35", "#EB5F28", "#A77AB4"]}
          moveParticlesOnHover={false}
          alphaParticles={true}
          particleBaseSize={60}
          sizeRandomness={2}
          cameraDistance={15}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-[10] w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-4xl mx-auto px-6">
          {/* Centered Layout */}
          <div className="flex flex-col items-center justify-center text-center min-h-[80vh] space-y-8">
            {/* LINKP Logo */}
            <div className="flex flex-col items-center justify-center text-center z-[15]">
              <div ref={logoRef} className="relative">
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-[#382F2B] leading-none tracking-tighter font-harmonSemiBoldCondensed">
                  {logoLetters}
                </h1>
                {/* Subtitle */}
                <p className="mt-6 text-lg md:text-xl text-[#A77AB4] font-yeager tracking-wide">
                  Professional Link-in-Bio Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[30]">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#D5DF35] rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
