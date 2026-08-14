'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/shared/Button';
import { ScientificLabel } from '@/components/shared/ScientificLabel';
import { Hero3DCanvas } from '@/three/Hero3DCanvas';
import { ReticleContainer } from '@/components/shared/ReticleContainer';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { ArrowRight, Dna, Database, ShieldCheck } from '@phosphor-icons/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // GSAP ScrollTrigger Sequence for cinematic scroll-driven section exit
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      // Lift & fade hero content smoothly as user scrolls
      tl.to(leftColRef.current, {
        y: -60,
        opacity: 0,
        ease: 'power2.inOut',
      }, 0);

      tl.to(metadataRef.current, {
        opacity: 0,
        scale: 0.95,
        ease: 'power2.inOut',
      }, 0);

      tl.to(rightColRef.current, {
        y: -30,
        opacity: 0.3,
        ease: 'power2.inOut',
      }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-dvh flex items-center justify-center pt-24 lg:pt-28 pb-16 px-6 lg:px-12 bg-[#06080a] bg-mineral-grain overflow-hidden"
    >
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Asymmetric Editorial Content */}
        <div ref={leftColRef} className="lg:col-span-6 flex flex-col items-start gap-6 lg:gap-8">
          {/* Eyebrow Label */}
          <ScientificLabel
            index="01"
            label="PROGRAMMABLE BIOLOGY PLATFORM"
            accent="emerald"
            pulse={true}
          />

          {/* Editorial Display Headline (Max 2 lines at desktop) */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#f3f4f1] leading-[1.08] max-w-[18ch]">
            Engineering biology for <span className="font-normal italic text-emerald-400">what comes next.</span>
          </h1>

          {/* Subtext (Max 20 words, max 3 lines) */}
          <p className="font-sans text-base lg:text-lg text-[#8e959e] leading-relaxed max-w-[48ch]">
            Atelier Genomics integrates de novo protein folding predictions and targeted cell capsids through computational intelligence.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<ArrowRight size={18} />}
              onClick={() => {
                const target = document.querySelector('#cta');
                if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
            >
              Initiate Collaboration
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Dna size={18} />}
              onClick={() => {
                const target = document.querySelector('#research');
                if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
            >
              Explore Research Data
            </Button>
          </div>

          {/* Micro Telemetry Metric Pill */}
          <div className="pt-6 border-t border-white/8 w-full flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#8e959e]">
            <div className="flex items-center gap-2">
              <Database size={15} className="text-emerald-400" />
              <span>4.2M SCREENED VARIANTS/DAY</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-amber-400" />
              <span>SOC2 TYPE II CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Canvas & Floating Scientific Metadata Overlays */}
        <div ref={rightColRef} className="lg:col-span-6 relative w-full">
          <ReticleContainer label="Macromolecular Simulator" sequenceId="GEN-04" accent="emerald" className="w-full">
            <Hero3DCanvas />

            {/* Floating Research Metadata Overlays */}
            <div
              ref={metadataRef}
              className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20 font-mono text-[11px] uppercase tracking-widest text-[#8e959e]"
            >
              {/* Top Left Metadata Overlay */}
              <div className="self-start px-3 py-1.5 rounded-md bg-[#06080a]/80 border border-white/10 backdrop-blur-md text-emerald-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                GENOME / 04
              </div>

              {/* Top Right Metadata Overlay */}
              <div className="self-end px-3 py-1.5 rounded-md bg-[#06080a]/80 border border-white/10 backdrop-blur-md text-[#f3f4f1]">
                SEQUENCE / ACTIVE
              </div>

              {/* Bottom Row Overlays */}
              <div className="flex items-center justify-between w-full">
                <div className="px-3 py-1.5 rounded-md bg-[#06080a]/80 border border-white/10 backdrop-blur-md text-amber-400">
                  MODEL CONFIDENCE / 98.4%
                </div>
                <div className="px-3 py-1.5 rounded-md bg-[#06080a]/80 border border-white/10 backdrop-blur-md text-cyan-400">
                  TARGET / P53-ONCOGENIC
                </div>
              </div>
            </div>
          </ReticleContainer>
        </div>
      </div>
    </section>
  );
};
