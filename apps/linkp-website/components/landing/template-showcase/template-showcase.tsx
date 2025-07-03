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

// Number of spins when changing templates
const SPINS_ON_CHANGE = 4;

// Simple floating iPhone with elegant sparkles
function FloatingIphone({
  iphoneRef,
  templateId,
  currentTemplateId,
}: {
  iphoneRef: React.MutableRefObject<Group | null>;
  templateId: string;
  currentTemplateId: string;
}) {
  // Gentle floating animation
  useFrame((state) => {
    if (iphoneRef.current) {
      iphoneRef.current.position.y =
        -1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
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
        scale={13}
        position={[0, -1, 0]}
        rotation={[0.1, 0.2, 0]}
      />

      {/* Simple, elegant sparkles */}
      <Sparkles
        count={40}
        scale={20}
        size={3}
        speed={0.3}
        opacity={0.6}
        color="#ffffff"
        noise={0.1}
      />
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

      // Direct iPhone ref
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

      // Simple GSAP animations
      useGSAP(() => {
        // Gentle container floating
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            y: "+=10",
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
          });
        }

        // Clean button hover effects
        if (prevButtonRef.current && nextButtonRef.current) {
          [prevButtonRef.current, nextButtonRef.current].forEach((button) => {
            const handleMouseEnter = () => {
              gsap.to(button, {
                scale: 1.1,
                duration: 0.3,
                ease: "back.out(1.7)",
              });
            };

            const handleMouseLeave = () => {
              gsap.to(button, {
                scale: 1,
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

      // Simple iPhone rotation animation
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

        // Simple rotation animation
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
          setCurrentIndex(index);
          onTemplateChange(templates[index]);
          changeTemplate(direction);
        }
      };

      const currentTemplateId =
        currentTemplate?.id || templates[currentIndex]?.id || "seaside-retreat";

      return (
        <div
          ref={containerRef}
          className="w-full h-full min-h-[80vh] rounded-3xl relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
          tabIndex={0}
          role="region"
          aria-label="Template showcase - Use arrow keys to navigate"
        >
          {/* Clean 3D iPhone Scene */}
          <div ref={sceneWrapperRef} className="w-full h-full">
            <View className="pointer-events-none w-full h-full">
              <Suspense fallback={null}>
                <group>
                  {/* Floating iPhone */}
                  <FloatingIphone
                    iphoneRef={iphoneRef}
                    templateId={currentTemplateId}
                    currentTemplateId={currentTemplateId}
                  />

                  {/* Clean environment */}
                  <Environment preset="sunset" environmentIntensity={0.3} />

                  {/* Subtle contact shadows */}
                  <ContactShadows
                    opacity={0.4}
                    scale={15}
                    blur={2}
                    far={4}
                    resolution={256}
                    frames={1}
                    position={[0, -0.8, 0]}
                    color="#000000"
                  />

                  {/* Simple lighting */}
                  <ambientLight intensity={0.6} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                  />
                </group>
              </Suspense>
            </View>
          </div>

          {/* Clean Navigation Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-8 z-20">
            {/* Previous Button */}
            <button
              ref={prevButtonRef}
              onClick={handlePrevious}
              disabled={isTransitioning}
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[#382F2B] hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D5DF35]/50"
              aria-label="Previous template (Left arrow key)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Simple Template Indicator Dots */}
            <div className="flex items-center gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateJump(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    index === currentIndex
                      ? "bg-[#D5DF35] scale-125"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  disabled={isTransitioning}
                  aria-label={`Go to ${template.name} template`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              disabled={isTransitioning}
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[#382F2B] hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D5DF35]/50"
              aria-label="Next template (Right arrow key or Space)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }
  )
);

TemplateShowcase.displayName = "TemplateShowcase";
