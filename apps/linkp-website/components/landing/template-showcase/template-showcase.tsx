"use client";

import { View, Environment, ContactShadows, Sparkles } from "@react-three/drei";
import {
  memo,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  Suspense,
} from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useFrame } from "@react-three/fiber";

import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { templateRegistry } from "@/lib/templates/registry";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Group } from "three";
import { Iphone16 } from "@/components/3d/iphone-16";

// Number of spins when changing templates (like SodaCan)
const SPINS_ON_CHANGE = 4;

// Inner component for floating animation (needs to be inside Canvas context)
function FloatingIphone({
  iphoneRef,
  templateId,
  currentTemplateId,
}: {
  iphoneRef: React.MutableRefObject<Group | null>;
  templateId: string;
  currentTemplateId: string;
}) {
  // Manual floating animation using useFrame (from TemplateShowcaseScene)
  useFrame((state) => {
    if (iphoneRef.current) {
      // Add subtle floating motion manually
      iphoneRef.current.position.y =
        -0.69 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      // Add very subtle rotation for natural movement
      iphoneRef.current.rotation.x =
        0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <>
      <Iphone16
        ref={(instance: Group | null) => {
          iphoneRef.current = instance;
        }}
        template={currentTemplateId as any}
        scale={12}
        position={[0, -0.69, 0]}
        rotation={[0.1, 0.2, 0]}
      />

      {/* Fallback mesh in case iPhone doesn't load (from TemplateShowcaseScene) */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
}

interface TemplateShowcaseProps {
  onTemplateChange: (template: BaseTemplateConfig) => void;
  currentTemplate?: BaseTemplateConfig;
}

export interface TemplateShowcaseRef {
  container: HTMLDivElement | null;
  prevButton: HTMLButtonElement | null;
  nextButton: HTMLButtonElement | null;
}

export const TemplateShowcase = memo(
  forwardRef<TemplateShowcaseRef, TemplateShowcaseProps>(
    ({ onTemplateChange, currentTemplate }, ref) => {
      const templates = templateRegistry.getAvailableTemplates(
        "free",
        "creator"
      );
      const [currentIndex, setCurrentIndex] = useState(0);
      const [isTransitioning, setIsTransitioning] = useState(false);

      // Refs for GSAP animations
      const containerRef = useRef<HTMLDivElement>(null);
      const prevButtonRef = useRef<HTMLButtonElement | null>(null);
      const nextButtonRef = useRef<HTMLButtonElement | null>(null);
      const sceneWrapperRef = useRef<HTMLDivElement>(null);
      const overlayRef = useRef<HTMLDivElement>(null);

      // Direct iPhone ref (bypassing scene wrapper)
      const iphoneRef = useRef<Group | null>(null);

      // Expose refs to parent component for GSAP animations
      useImperativeHandle(ref, () => ({
        container: containerRef.current,
        prevButton: prevButtonRef.current,
        nextButton: nextButtonRef.current,
      }));

      // Keyboard controls
      useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
          if (isTransitioning) return;

          switch (event.key) {
            case "ArrowLeft":
              event.preventDefault();
              handlePrevious();
              break;
            case "ArrowRight":
              event.preventDefault();
              handleNext();
              break;
            case " ":
              event.preventDefault();
              handleNext();
              break;
          }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
      }, [isTransitioning, currentIndex]);

      // GSAP animations - simplified to avoid conflicts
      useGSAP(() => {
        // Only floating animation for the container - this is safe and smooth
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            y: "+=10",
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
          });
        }

        // Button hover animations - these are always safe
        if (prevButtonRef.current && nextButtonRef.current) {
          [prevButtonRef.current, nextButtonRef.current].forEach((button) => {
            const handleMouseEnter = () => {
              gsap.to(button, {
                scale: 1.1,
                rotationZ: 5,
                duration: 0.3,
                ease: "back.out(1.7)",
              });
            };

            const handleMouseLeave = () => {
              gsap.to(button, {
                scale: 1,
                rotationZ: 0,
                duration: 0.3,
                ease: "back.out(1.7)",
              });
            };

            button?.addEventListener("mouseenter", handleMouseEnter);
            button?.addEventListener("mouseleave", handleMouseLeave);

            return () => {
              button?.removeEventListener("mouseenter", handleMouseEnter);
              button?.removeEventListener("mouseleave", handleMouseLeave);
            };
          });
        }
      }, []);

      // Initialize with first template
      useEffect(() => {
        const templates = templateRegistry.getAvailableTemplates(
          "free",
          "creator"
        );
        if (templates.length > 0 && !currentTemplate) {
          setCurrentIndex(0);
          onTemplateChange(templates[0]);
        }
      }, [currentTemplate, onTemplateChange]);

      // Sync currentIndex with currentTemplate prop
      useEffect(() => {
        if (currentTemplate) {
          const templateIndex = templates.findIndex(
            (t) => t.id === currentTemplate.id
          );
          if (templateIndex !== -1 && templateIndex !== currentIndex) {
            setCurrentIndex(templateIndex);
          }
        }
      }, [currentTemplate, templates, currentIndex]);

      // iPhone Rotation Animation (like SodaCan)
      const changeTemplate = (direction: "next" | "prev", retryCount = 0) => {
        if (isTransitioning) {
          return;
        }

        if (!iphoneRef.current) {
          if (retryCount < 10) {
            setTimeout(() => changeTemplate(direction, retryCount + 1), 100);
          }
          return;
        }

        setIsTransitioning(true);

        const isNext = direction === "next";
        const newIndex = isNext
          ? (currentIndex + 1) % templates.length
          : (currentIndex - 1 + templates.length) % templates.length;

        const iphoneObject = iphoneRef.current;

        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
          },
        });

        // Rotate the iPhone directly (like SodaCan)
        tl.to(
          iphoneObject.rotation,
          {
            y: isNext
              ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
              : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
            ease: "power2.inOut",
            duration: 1.2,
          },
          0
        ).call(
          () => {
            setCurrentIndex(newIndex);
            onTemplateChange(templates[newIndex]);
          },
          undefined,
          0.6
        );
      };

      const handlePrevious = () => {
        changeTemplate("prev");
      };

      const handleNext = () => {
        changeTemplate("next");
      };

      const handleTemplateJump = (index: number) => {
        if (index !== currentIndex && !isTransitioning) {
          const direction = index > currentIndex ? "next" : "prev";
          // Set the index first for jumping
          setCurrentIndex(index);
          onTemplateChange(templates[index]);
          // Then do a quick rotation animation
          changeTemplate(direction);
        }
      };

      const currentTemplateId =
        currentTemplate?.id || templates[currentIndex]?.id || "seaside-retreat";

      return (
        <div
          ref={containerRef}
          className="w-full h-[500px] lg:h-[600px] rounded-3xl relative overflow-hidden border-white/20"
          tabIndex={0}
          role="region"
          aria-label="Template showcase - Use arrow keys to navigate"
        >
          {/* Enhanced Transition Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-30 opacity-0 pointer-events-none backdrop-blur-sm"
            // style={{
            //   background:
            //     "linear-gradient(45deg, rgba(213, 223, 53, 0.1), rgba(213, 223, 53, 0.05))",
            // }}
          />

          {/* 3D iPhone Scene - Direct Test (Replicating Working Hero Pattern) */}
          <div ref={sceneWrapperRef} className="w-full h-full">
            <View className="pointer-events-none w-full h-full">
              <Suspense fallback={null}>
                <group>
                  {/* Floating iPhone with animation */}
                  <FloatingIphone
                    iphoneRef={iphoneRef}
                    templateId={currentTemplateId}
                    currentTemplateId={currentTemplateId}
                  />

                  {/* Sparkles - Premium white sparkles that pop on dark background */}
                  <Sparkles
                    count={60}
                    scale={20}
                    size={4}
                    speed={0.4}
                    opacity={0.8}
                    color="#ffffff"
                    noise={0.1}
                  />

                  {/* Secondary Golden Sparkles - Brand color accent */}
                  <Sparkles
                    count={40}
                    scale={25}
                    size={2}
                    speed={0.3}
                    opacity={0.6}
                    color="#D5DF35"
                    noise={0.2}
                  />

                  {/* Environment - Using sunset preset from TemplateShowcaseScene */}
                  <Environment preset="sunset" environmentIntensity={0.3} />

                  {/* ContactShadows - Positioned under iPhone */}
                  <ContactShadows
                    opacity={0.6}
                    scale={15}
                    blur={2}
                    far={4}
                    resolution={256}
                    frames={1}
                    position={[0, -0.8, 0]}
                    color="#000000"
                  />

                  {/* Enhanced lighting for dark background (from TemplateShowcaseScene) */}
                  <ambientLight intensity={0.6} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                  />
                  {/* Rim light to make iPhone glow on dark background */}
                  <directionalLight
                    position={[-10, 5, -5]}
                    intensity={0.8}
                    color="#D5DF35"
                  />
                </group>
              </Suspense>
            </View>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-8 z-20">
            {/* Previous Button */}
            <button
              ref={prevButtonRef}
              onClick={handlePrevious}
              disabled={isTransitioning}
              className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/20 group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Previous template (Left arrow key)"
            >
              {/* Enhanced Button background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Loading indicator during transition */}
              {isTransitioning && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              )}

              <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform duration-200 relative z-10" />
            </button>

            {/* Enhanced Template Indicator Dots */}
            <div className="flex items-center gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateJump(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 group ${
                    index === currentIndex
                      ? "bg-[#D5DF35] scale-125 shadow-lg shadow-[#D5DF35]/50"
                      : "bg-white/40 hover:bg-white/60 scale-100"
                  }`}
                  disabled={isTransitioning}
                  aria-label={`Go to ${template.name} template`}
                >
                  {/* Subtle template preview on hover */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {template.name}
                  </div>

                  {/* Active indicator pulse */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-[#D5DF35] rounded-full animate-ping opacity-30" />
                  )}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              disabled={isTransitioning}
              className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/20 group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Next template (Right arrow key or Space)"
            >
              {/* Enhanced Button background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Loading indicator during transition */}
              {isTransitioning && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              )}

              <ChevronRight className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform duration-200 relative z-10" />
            </button>
          </div>
        </div>
      );
    }
  )
);

TemplateShowcase.displayName = "TemplateShowcase";
