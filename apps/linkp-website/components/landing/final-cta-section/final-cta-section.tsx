"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown, Users, TrendingUp, Shield } from "lucide-react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FinalCtaSection() {
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
    <section className="final-cta-section min-h-screen flex items-center mt-32">
      <div className="container mx-auto px-6 text-center">
        {/* Final Qualification - Ultimate Filter */}
        <div className="mb-12" data-gsap-item>
          <div className="bg-[#EB5F28]/10 border-2 border-[#EB5F28]/30 rounded-2xl px-12 py-6 inline-block">
            <p className="text-xs md:text-sm text-[#EB5F28] font-black font-yeager">
              Last chance: This creator marketplace is only for established
              creators (5K+ followers) ready to monetize professionally
            </p>
          </div>
        </div>

        {/* Alternative Path for Others */}
        <div className="mb-8" data-gsap-item>
          <p className="text-lg text-white/70 font-absans">
            If you're just starting out,
            <a
              href="#"
              className="text-[#D5DF35] underline hover:no-underline ml-1"
            >
              check our free resources instead
            </a>
          </p>
        </div>

        {/* Main Headline - Status Promise */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-12 font-nohemi"
          data-gsap-item
        >
          Join creators who get
          <span className="block text-[#D5DF35] font-harmonSemiBoldCondensed">
            brand partnership offers
          </span>
          <span className="block text-[#EB5F28] font-harmonSemiBoldCondensed">
            in their DMs
          </span>
        </h2>

        <p
          className="text-2xl md:text-3xl text-white/90 font-medium max-w-5xl mx-auto mb-16 leading-relaxed font-yeager"
          data-gsap-item
        >
          Instead of sending cold pitches to brands that ignore you.
        </p>

        {/* Final CTA */}
        <Button
          size="lg"
          className="bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] font-black px-24 py-12 text-3xl rounded-none shadow-2xl hover:shadow-3xl transition-all duration-300 font-[family-name:var(--new-Kansas-font)]"
          onClick={() => router.push("/creator/select-template")}
          data-gsap-item
        >
          CLAIM YOUR SPOT IN THE LINKP CREATOR MARKETPLACE
        </Button>

        {/* Trust & Urgency */}
        <div className="mt-8 space-y-4" data-gsap-item>
          <p className="text-lg text-white/80 font-yeager">
            Join the professional creators who get approached by brands daily
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-white/60 text-sm font-absans">
            <span>✓ No credit card required</span>
            <span>✓ Professional setup in 2 minutes</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Built for Indian creators</span>
          </div>
        </div>

        {/* Strategic Positioning */}
        <div className="mt-16 max-w-3xl mx-auto" data-gsap-item>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center">
              <p className="text-[#D5DF35] font-bold text-xl mb-4">
                "Stop looking like every other creator"
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                Professional creators use professional tools. Your link page
                should look like you're serious about your business, not like
                you just started yesterday.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
