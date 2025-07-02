"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  MousePointer,
  DollarSign,
  Bell,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

export interface ValuePropositionSectionRef {
  sectionRef: HTMLElement | null;
  textRef: HTMLParagraphElement | null;
}

export function ValuePropositionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [animatedNumber, setAnimatedNumber] = React.useState(0);
  const animatedNumberRef = React.useRef(animatedNumber);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(animatedNumberRef, {
        current: 50000,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: () => {
          setAnimatedNumber(Math.round(animatedNumberRef.current));
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for Section 2 animations
      gsap.set(".money-heading-char", {
        opacity: 0,
        scale: 1.3,
        y: "40%",
        rotation: -25,
      });

      gsap.set([textRef.current, flowRef.current], {
        opacity: 0,
        y: 20,
      });

      // Set initial states for dashboard elements
      gsap.set([dashboardRef.current], {
        opacity: 0,
        scale: 0.8,
        y: 30,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          // Money section heading animation
          gsap.to(".money-heading-char", {
            opacity: 1,
            scale: 1,
            y: "0%",
            rotation: 0,
            duration: 0.3,
            ease: "back.out(3)",
            stagger: 0.03,
            delay: 0.4,
          });

          // Text animation
          gsap.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1.2,
          });

          // Flow diagram animation
          gsap.to(flowRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1.6,
          });

          // Dashboard animations
          gsap.to([dashboardRef.current], {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 2,
          });
        },
        onLeaveBack: () => {
          // Reset animations
          gsap.to(".money-heading-char", {
            opacity: 0,
            scale: 1.3,
            y: 40,
            rotation: -25,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.1,
          });

          gsap.to([textRef.current, flowRef.current, dashboardRef.current], {
            opacity: 0,
            y: 20,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="value-proposition-section min-h-screen flex items-center"
    >
      <div className="container mx-auto px-6 z-[80]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Money Flow Explanation */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight font-harmonSemiBoldCondensed">
                <span className="money-heading-char inline-block">H</span>
                <span className="money-heading-char inline-block">o</span>
                <span className="money-heading-char inline-block">w</span>
                <span className="money-heading-char inline-block">&nbsp;</span>
                <span className="money-heading-char inline-block">R</span>
                <span className="money-heading-char inline-block">e</span>
                <span className="money-heading-char inline-block">v</span>
                <span className="money-heading-char inline-block">e</span>
                <span className="money-heading-char inline-block">n</span>
                <span className="money-heading-char inline-block">u</span>
                <span className="money-heading-char inline-block">e</span>
                <span className="money-heading-char inline-block">&nbsp;</span>
                <span className="money-heading-char inline-block">F</span>
                <span className="money-heading-char inline-block">l</span>
                <span className="money-heading-char inline-block">o</span>
                <span className="money-heading-char inline-block">w</span>
                <span className="money-heading-char inline-block">s</span>
                <span className="money-heading-char inline-block">&nbsp;</span>
                <span className="money-heading-char inline-block">:</span>
                <span className="block text-[#D5DF35] mt-4">
                  <span className="money-heading-char inline-block">
                    ₹{animatedNumber.toLocaleString()}/month in Brand Deals
                  </span>
                </span>
              </h2>

              <p
                ref={textRef}
                className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed font-yeager"
              >
                See exactly which posts drive brand partnerships, right from
                your dashboard, in real time.
              </p>

              {/* Revenue Flow Steps */}
              <div ref={flowRef} className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D5DF35] rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#382F2B]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Connect</h3>
                    <p className="text-white/70">
                      Professional profile attracts brand attention
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EB5F28] rounded-full flex items-center justify-center">
                    <MousePointer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Convert</h3>
                    <p className="text-white/70">
                      Track which content drives highest engagement
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D5DF35] rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#382F2B]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Collect</h3>
                    <p className="text-white/70">
                      Brands reach out with partnership offers
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] font-bold px-12 py-6 text-lg rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-volaroidSan mt-8"
                onClick={() => router.push("/creator/select-template")}
              >
                ACTIVATE YOUR BRAND MAGNET
              </Button>
            </div>

            {/* Right Column - Analytics Preview */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md space-y-6">
                {/* Analytics Dashboard Preview */}
                <div
                  ref={dashboardRef}
                  className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#D5DF35] rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[#382F2B]" />
                    </div>
                    <h3 className="text-white font-bold">
                      Analytics Dashboard
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Story Views:</span>
                      <span className="text-white font-bold">
                        Live Tracking
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Link Clicks:</span>
                      <span className="text-green-400 font-bold">
                        Real-time Data
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Brand Inquiries:</span>
                      <span className="text-yellow-400 font-bold">Tracked</span>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Performance:</span>
                        <span className="text-[#D5DF35] font-bold text-lg">
                          Optimized
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Setup Indicator */}
                <div className="bg-gradient-to-r from-[#EB5F28] to-[#D5DF35] p-1 rounded-2xl">
                  <div className="bg-black rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Bell className="w-5 h-5 text-[#D5DF35]" />
                      <span className="text-[#D5DF35] font-bold text-sm">
                        PROFESSIONAL SETUP
                      </span>
                    </div>
                    <div className="text-white">
                      <p className="font-bold">Brand-Ready Profile</p>
                      <p className="text-white/70 text-sm mt-1">
                        Professional templates that brands notice
                      </p>
                      <p className="text-white/50 text-xs mt-2">
                        "Stand out from amateur link pages"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="text-center">
                  <p className="text-[#D5DF35] font-bold text-lg">
                    Stop chasing brands.
                  </p>
                  <p className="text-white/80">Make them chase you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
