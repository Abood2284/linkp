'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="social-proof-section py-20">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Join the First 100 Creators</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Be part of the exclusive early access group shaping the future of creator monetization in India.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold">100</h3>
              <p className="text-muted-foreground">Exclusive Early Spots</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold">73</h3>
              <p className="text-muted-foreground">Spots Remaining</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold">₹0</h3>
              <p className="text-muted-foreground">Forever Free for First 100</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
