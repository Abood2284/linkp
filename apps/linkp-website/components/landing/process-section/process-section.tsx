"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { View } from "@react-three/drei";
import { ProcessIconScene } from "./process-icon-scene";

gsap.registerPlugin(ScrollTrigger);

export function ProcessSection() {
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-gsap-item]", { opacity: 0, y: 50 });

      ScrollTrigger.batch("[data-gsap-item]", {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          });
        },
        onLeaveBack: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.4,
            ease: "power2.in",
          });
        },
        start: "top 80%",
        end: "bottom 20%",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="process-section min-h-screen flex items-center mt-32">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-12 leading-tight font-[family-name:var(--harmon-semi-bold-condensed-font)]">
            Simple setup.
            <span className="block text-[#D5DF35]">Serious results.</span>
          </h2>

          <p className="text-2xl md:text-3xl text-white/90 font-medium max-w-5xl mx-auto mb-16 leading-relaxed font-[family-name:var(--neue-haas-display-font)]">
            Professional creators don't have time for complicated tools. Linkp
            gets you earning faster with less effort.
          </p>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center" data-gsap-item>
              <div className="w-24 h-24 mx-auto mb-6">
                <View className="w-full h-full">
                  <ProcessIconScene iconType="connect" />
                </View>
              </div>
              <h3 className="text-2xl font-bold text-warm-cream-100 mb-4 font-nohemi">
                Connect Your Instagram
              </h3>
              <p className="text-lg text-warm-cream-200/80 font-yeager">
                2-minute setup that imports your existing content and analyzes
                your audience
              </p>
            </div>

            <div className="text-center" data-gsap-item>
              <div className="w-24 h-24 mx-auto mb-6">
                <View className="w-full h-full">
                  <ProcessIconScene iconType="template" />
                </View>
              </div>
              <h3 className="text-2xl font-bold text-warm-cream-100 mb-4 font-nohemi">
                Choose Your Revenue-Optimized Template
              </h3>
              <p className="text-lg text-warm-cream-200/80 font-yeager">
                Select from templates proven to attract brand partnerships in
                your niche
              </p>
            </div>

            <div className="text-center" data-gsap-item>
              <div className="w-24 h-24 mx-auto mb-6">
                <View className="w-full h-full">
                  <ProcessIconScene iconType="monetize" />
                </View>
              </div>
              <h3 className="text-2xl font-bold text-warm-cream-100 mb-4 font-nohemi">
                Watch Brands Start Reaching Out
              </h3>
              <p className="text-lg text-warm-cream-200/80 font-yeager">
                Track your performance in real-time and receive partnership
                offers within 30 days
              </p>
            </div>
          </div>

          {/* Success Timeline */}
          <div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12 max-w-4xl mx-auto"
            data-gsap-item
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Typical Success Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div data-gsap-item>
                <div className="text-[#D5DF35] font-bold text-lg mb-2">
                  Week 1
                </div>
                <p className="text-white/80">
                  Setup complete, professional presence live
                </p>
              </div>
              <div data-gsap-item>
                <div className="text-[#D5DF35] font-bold text-lg mb-2">
                  Week 2-3
                </div>
                <p className="text-white/80">
                  First brand inquiries start coming in
                </p>
              </div>
              <div data-gsap-item>
                <div className="text-[#D5DF35] font-bold text-lg mb-2">
                  Week 4+
                </div>
                <p className="text-white/80">
                  Regular partnership offers and revenue growth
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] font-bold px-16 py-8 text-2xl rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-[family-name:var(--new-Kansas-font)]"
            onClick={() => router.push("/creator/select-template")}
            data-gsap-item
          >
            START YOUR 30-DAY BRAND ATTRACTION TRIAL
          </Button>

          {/* Trust Indicators */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center"
            data-gsap-item
          >
            <div>
              <p className="text-white/60 text-sm">✓ No credit card required</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">
                ✓ 30-day performance guarantee
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">✓ Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
