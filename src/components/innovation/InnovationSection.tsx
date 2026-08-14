'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScientificLabel } from '@/components/shared/ScientificLabel';
import { InnovationVisualizer } from '@/three/InnovationVisualizer';
import { ReticleContainer } from '@/components/shared/ReticleContainer';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { Dna, Database, Cpu } from '@phosphor-icons/react';
import { clsx } from 'clsx';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  {
    id: 0,
    title: 'BIOLOGY',
    subtitle: 'High-dimensional cellular systems',
    icon: Dna,
    desc: 'Biological organisms express immense genetic complexity through stochastic molecular interactions.',
  },
  {
    id: 1,
    title: 'DATA',
    subtitle: 'High-throughput sequence telemetry',
    icon: Database,
    desc: 'Microfluidic arrays capture billions of genomic variants, converting cellular state into clean digital signals.',
  },
  {
    id: 2,
    title: 'INTELLIGENCE',
    subtitle: 'Generative macromolecular design',
    icon: Cpu,
    desc: 'Neural target models predict de novo protein folding configurations with sub-angstrom affinity precision.',
  },
];

export const InnovationSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // ScrollTrigger stage transition sequence
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 40%',
        end: 'bottom 60%',
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.33) {
            setActiveStage(0);
          } else if (progress < 0.66) {
            setActiveStage(1);
          } else {
            setActiveStage(2);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="innovation"
      className="relative min-h-dvh py-24 lg:py-36 px-6 lg:px-12 bg-[#080c10] border-t border-white/6 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto space-y-20">
        {/* Section Header with Narrative Arrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/8">
          <div className="space-y-4 max-w-[65ch]">
            <ScientificLabel
              index="02"
              label="THE SHIFT FROM DISCOVERY TO SYNTHESIS"
              accent="amber"
              pulse={false}
            />
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#f3f4f1] leading-tight">
              We translate the high-dimensional language of cellular biology into{' '}
              <span className="italic font-normal text-amber-400">deterministic therapeutic code.</span>
            </h2>
          </div>

          {/* Vertical Visual Flow Stepper */}
          <div className="flex items-center gap-3 font-mono text-xs text-[#8e959e] select-none">
            <span className={clsx('px-3 py-1 rounded-md border transition-colors', activeStage === 0 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-medium' : 'border-white/8')}>
              BIOLOGY
            </span>
            <span>↓</span>
            <span className={clsx('px-3 py-1 rounded-md border transition-colors', activeStage === 1 ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10 font-medium' : 'border-white/8')}>
              DATA
            </span>
            <span>↓</span>
            <span className={clsx('px-3 py-1 rounded-md border transition-colors', activeStage === 2 ? 'text-amber-400 border-amber-500/40 bg-amber-500/10 font-medium' : 'border-white/8')}>
              INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Asymmetric Content & Interactive Visual Transformation Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Stage Stepper Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              {STAGES.map((s) => {
                const Icon = s.icon;
                const isActive = activeStage === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveStage(s.id)}
                    className={clsx(
                      'p-6 rounded-2xl border transition-[background-color,border-color] duration-200 cursor-pointer select-none',
                      isActive
                        ? 'bg-[#11161d] border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                        : 'bg-[#0b0f14]/60 border-white/6 hover:border-white/14 hover:bg-[#0b0f14]'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={clsx('p-2 rounded-lg border', isActive ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-[#8e959e] border-white/8')}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <span className="font-mono text-xs text-[#8e959e] block">0{s.id + 1} {'// STAGE'}</span>
                          <h3 className="font-sans text-lg font-normal text-[#f3f4f1] tracking-tight">{s.title}</h3>
                        </div>
                      </div>
                      <span className={clsx('font-mono text-xs', isActive ? 'text-amber-400' : 'text-[#8e959e]')}>
                        {isActive ? '● ACTIVE' : 'SELECT'}
                      </span>
                    </div>

                    {isActive && (
                      <p className="font-sans text-sm text-[#8e959e] leading-relaxed mt-4 pt-4 border-t border-white/6">
                        {s.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Visual Transformation Canvas */}
          <div className="lg:col-span-7">
            <ReticleContainer
              label={`STAGE 0${activeStage + 1} // ${STAGES[activeStage].title}`}
              sequenceId="MODEL-MORPH"
              accent={activeStage === 0 ? 'emerald' : activeStage === 1 ? 'emerald' : 'amber'}
            >
              <InnovationVisualizer stage={activeStage} />
            </ReticleContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
