"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown, Sparkles } from "lucide-react";
import { Compare } from "@/components/ui/compare";

export function ComparisonSection() {
  const router = useRouter();

  return (
    <section className="comparison-section min-h-screen flex items-center py-20 mt-32">
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

          {/* Compare Component */}
          <div className="flex justify-center mb-12">
            <Compare
              firstImage="assets/templates-screenshots/linktree.png"
              secondImage="assets/templates-screenshots/gold-shine-iphone12.png"
              className="w-[600px] h-[600px] md:w-[700px] md:h-[700px] rounded-2xl border-8 border-white/10 shadow-2xl"
              firstImageClassName="object-contain rounded-xl"
              secondImageClassname="object-contain rounded-xl"
              slideMode="drag"
              showHandlebar={true}
              autoplay={false}
              initialSliderPercentage={50}
            />
          </div>

          <div className="text-center">
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

            {/* Interaction hint */}
            <p className="text-sm text-[#382F2B]/50 mt-2 italic">
              Hover over the comparison above to see the difference
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
