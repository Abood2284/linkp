"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Check, X, Crown, Sparkles } from "lucide-react";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      Draggable.create(rightPanelRef.current, {
        type: "x",
        bounds: sectionRef.current,
        onDrag: function () {
          gsap.set(rightPanelRef.current, { width: this.x });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="comparison-section min-h-screen flex items-center py-20 mt-32"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-[#382F2B] mb-8 leading-tight font-[family-name:var(--harmon-semi-bold-condensed-font)]">
              Linkp doesn't have 50+ template categories
              <span className="block text-[#EB5F28]">
                but every pixel is optimized for revenue, not decoration
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-[#382F2B]/80 max-w-4xl mx-auto font-yeager">
              While others collect followers, you'll collect revenue.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] overflow-hidden rounded-2xl border-8 border-white/10 shadow-2xl">
            {/* Left Panel - Basic Link Tools */}
            <div
              ref={leftPanelRef}
              className="absolute inset-0 w-full bg-[#382F2B]/10 p-8"
            >
              <h3 className="text-2xl font-bold text-[#382F2B] mb-6">
                Basic Link Tools
              </h3>
              {/* Mock Basic Interface */}
              <div className="bg-gray-200 rounded-xl p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto"></div>
                  <h4 className="text-gray-800 font-bold">@creator_name</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-300 rounded-lg p-3 text-gray-600 text-sm">
                      Link 1
                    </div>
                    <div className="bg-gray-300 rounded-lg p-3 text-gray-600 text-sm">
                      Link 2
                    </div>
                    <div className="bg-gray-300 rounded-lg p-3 text-gray-600 text-sm">
                      Link 3
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Powered by BasicLinks
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Linkp */}
            <div
              ref={rightPanelRef}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-[#EB5F28]/20 to-[#D5DF35]/20 p-1"
            >
              <div className="bg-[#382F2B] h-full rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-6 h-6 text-[#D5DF35]" />
                  <h3 className="text-2xl font-bold text-white">
                    Linkp Professional
                  </h3>
                  <span className="bg-[#D5DF35] text-[#382F2B] px-3 py-1 rounded-full text-xs font-bold ml-auto">
                    REVENUE FOCUSED
                  </span>
                </div>
                {/* Mock Linkp Interface */}
                <div className="bg-gradient-to-br from-[#382F2B] to-[#2a2420] rounded-xl p-6 mb-6 border border-[#D5DF35]/20">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#EB5F28] to-[#D5DF35] rounded-full mx-auto flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-lg">
                      @pro_creator
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-[#EB5F28] to-[#D5DF35] rounded-lg p-4 text-white font-medium">
                        Latest Video - High CTR
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-white">
                        Brand Partnerships - Active
                      </div>
                    </div>
                    <div className="flex justify-between text-xs bg-black/40 rounded-lg p-2">
                      <span className="text-green-400">High engagement</span>
                      <span className="text-yellow-400">Brand inquiries</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-[#EB5F28] hover:bg-[#d55530] text-white font-bold px-16 py-6 text-xl rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-volaroidSan"
              onClick={() => router.push("/creator/select-template")}
            >
              SWITCH TO THE REVENUE-FOCUSED PLATFORM
            </Button>
            <p className="text-[#382F2B]/60 mt-4 text-lg">
              Join creators who get approached by brands, not the other way
              around
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
