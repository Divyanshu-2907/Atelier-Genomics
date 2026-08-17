'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReticleContainer } from '@/components/shared/ReticleContainer';
import { ArrowRight, CheckCircle, Dna, Cpu, Flask, Crosshair } from '@phosphor-icons/react';
import { clsx } from 'clsx';

interface Capability {
  id: number;
  number: string;
  name: string;
  category: string;
  summary: string;
  details: string[];
  metrics: { label: string; value: string }[];
  accent: 'emerald' | 'amber';
  visualType: 'sequence' | 'folding' | 'tropism' | 'synthesis';
}

const CAPABILITIES: Capability[] = [
  {
    id: 0,
    number: '01',
    name: 'Genomic Intelligence',
    category: 'SEQUENCE ARCHITECTURE',
    summary: 'High-throughput transcriptomic alignment & CRISPR codon optimization.',
    details: [
      'De novo RNA sequence synthesis with targeted secondary structure stability',
      'Tissue-specific promoter design eliminating off-target cellular toxicity',
      'Algorithmic CRISPR-Cas12 guide optimization with sub-picomolar affinity',
    ],
    metrics: [
      { label: 'ALIGNMENT ACCURACY', value: '99.98%' },
      { label: 'OFF-TARGET RATE', value: '< 0.001%' },
    ],
    accent: 'emerald',
    visualType: 'sequence',
  },
  {
    id: 1,
    number: '02',
    name: 'Bioinformatics',
    category: 'STRUCTURAL BIOPHYSICS',
    summary: 'Generative macromolecular folding & tertiary energy surface modeling.',
    details: [
      'Neural lattice biophysics simulating 100M+ atomic interaction frames/sec',
      'De novo enzyme catalytic pocket synthesis without crystal structure templates',
      'Multi-chain complex assembly predictions with sub-angstrom RMSD precision',
    ],
    metrics: [
      { label: 'RMSD PRECISION', value: '0.38 Å' },
      { label: 'COMPUTATION SPEED', value: '10x FASTER' },
    ],
    accent: 'emerald',
    visualType: 'folding',
  },
  {
    id: 2,
    number: '03',
    name: 'Drug Discovery',
    category: 'IN-VIVO TARGETING',
    summary: 'Cell-selective capsid engineering & target affinity optimization.',
    details: [
      'Synthetic viral and non-viral capsids with cell-selective surface tropism',
      'Hepatic and neural target specificity reducing peripheral systemic clearance',
      'Immune evasion topology mutations for multi-dose therapeutic administration',
    ],
    metrics: [
      { label: 'TISSUES TARGETED', value: '14 SPECIFIC' },
      { label: 'SERUM HALF-LIFE', value: '72 HOURS' },
    ],
    accent: 'amber',
    visualType: 'tropism',
  },
  {
    id: 3,
    number: '04',
    name: 'Synthetic Biology',
    category: 'AUTOMATED SYNTHESIS',
    summary: 'De novo enzyme engineering & automated microfluidic bio-manufacturing.',
    details: [
      'Continuous microfluidic wet-lab telemetry integrated with neural feedback',
      'High-yield cell-free translation systems for rapid candidate validation',
      'Automated sequence assembly scaling from microfluidic chips to pilot batches',
    ],
    metrics: [
      { label: 'DAILY THROUGHPUT', value: '4.2M SAMPLES' },
      { label: 'BATCH PURITY', value: '99.6%' },
    ],
    accent: 'emerald',
    visualType: 'synthesis',
  },
];

export const CapabilitiesSection: React.FC = () => {
  const [activeId, setActiveId] = useState(0);
  const activeCap = CAPABILITIES[activeId];

  return (
    <section
      id="capabilities"
      className="relative py-16 lg:py-24 px-6 lg:px-12 bg-[#080c10] border-t border-white/6 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto space-y-12 lg:space-y-16">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/8">
          <div className="space-y-3 max-w-[65ch]">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#f3f4f1]">
              Engineered <span className="italic font-normal text-emerald-400">Scientific Domains</span>
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8e959e] flex items-center gap-2">
            <span>[ SELECT CAPABILITY FOR TELEMETRY ]</span>
          </div>
        </div>

        {/* Asymmetric Composition: Left Vertical Selector + Right Interactive Visual Cue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Vertical Interactive Accordion Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {CAPABILITIES.map((cap, idx) => {
              const isActive = activeId === idx;
              return (
                <div
                  key={cap.id}
                  onClick={() => setActiveId(idx)}
                  className={clsx(
                    'group p-6 rounded-2xl border transition-[background-color,border-color,box-shadow] duration-200 cursor-pointer select-none',
                    isActive
                      ? 'bg-[#11161d] border-emerald-500/40 shadow-[0_12px_35px_rgba(0,0,0,0.6)]'
                      : 'bg-[#0b0f14]/60 border-white/6 hover:border-white/14 hover:bg-[#0b0f14]'
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span
                        className={clsx(
                          'font-mono text-xl font-light transition-colors',
                          isActive ? 'text-emerald-400 font-medium' : 'text-[#8e959e]'
                        )}
                      >
                        {cap.number}
                      </span>
                      <h3
                        className={clsx(
                          'font-sans text-xl lg:text-2xl font-light tracking-tight transition-colors',
                          isActive ? 'text-[#f3f4f1]' : 'text-[#8e959e] group-hover:text-[#f3f4f1]'
                        )}
                      >
                        {cap.name}
                      </h3>
                    </div>

                    <ArrowRight
                      size={18}
                      className={clsx(
                        'transition-transform shrink-0',
                        isActive ? 'text-emerald-400 translate-x-1' : 'text-[#8e959e] group-hover:translate-x-0.5'
                      )}
                    />
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="mt-4 pt-4 border-t border-white/6 space-y-3"
                    >
                      <p className="font-sans text-sm text-[#8e959e] leading-relaxed">
                        {cap.summary}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Reticle Visual Container showcasing Active Scientific Visual Cue */}
          <div className="lg:col-span-7">
            <ReticleContainer
              label={`CAPABILITY TELEMETRY // ${activeCap.category}`}
              sequenceId={`CAP-${activeCap.number}`}
              accent={activeCap.accent}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCap.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-8 p-4 lg:p-6"
                >
                  {/* Dynamic Visual Cue Box based on Capability Type */}
                  {activeCap.visualType === 'sequence' && (
                    <div className="p-6 rounded-xl bg-[#06080a] border border-emerald-500/20 font-mono text-xs space-y-4">
                      <div className="flex items-center justify-between text-emerald-400 border-b border-white/6 pb-3">
                        <span className="flex items-center gap-2">
                          <Dna size={16} /> CODON ALIGNMENT STREAM
                        </span>
                        <span>[ MATCH: 99.98% ]</span>
                      </div>
                      <div className="space-y-2 text-[#8e959e] tracking-wider leading-relaxed">
                        <p><span className="text-emerald-400">01 //</span> ATCG-8821-TACG-GGAT-CTAG-AACT-GGCA</p>
                        <p><span className="text-cyan-400">02 //</span> ATCG-8821-TACG-GGAT-CTAG-AACT-GGCA</p>
                        <p><span className="text-amber-400">03 //</span> ATCG-8821-TACG-GGAT-CTAG-AACT-[MUTATED]</p>
                      </div>
                    </div>
                  )}

                  {activeCap.visualType === 'folding' && (
                    <div className="p-6 rounded-xl bg-[#06080a] border border-cyan-500/20 font-mono text-xs space-y-4">
                      <div className="flex items-center justify-between text-cyan-400 border-b border-white/6 pb-3">
                        <span className="flex items-center gap-2">
                          <Cpu size={16} /> TERTIARY RMSD CONTOUR
                        </span>
                        <span>[ RMSD: 0.38 Å ]</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-[#0b0f14] border border-white/8">
                          <span className="text-[#8e959e] block text-[10px]">ALPHA-HELIX STABILITY</span>
                          <span className="text-lg font-sans font-light text-[#f3f4f1] mt-1 block">99.4%</span>
                        </div>
                        <div className="p-4 rounded-lg bg-[#0b0f14] border border-white/8">
                          <span className="text-[#8e959e] block text-[10px]">BETA-SHEET FREE ENERGY</span>
                          <span className="text-lg font-sans font-light text-cyan-400 mt-1 block">-14.2 kcal/mol</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCap.visualType === 'tropism' && (
                    <div className="p-6 rounded-xl bg-[#06080a] border border-amber-500/20 font-mono text-xs space-y-4">
                      <div className="flex items-center justify-between text-amber-400 border-b border-white/6 pb-3">
                        <span className="flex items-center gap-2">
                          <Crosshair size={16} /> CELL-SELECTIVE TROPISM MAP
                        </span>
                        <span>[ HEPATIC TIER-1 ]</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8e959e]">LIVER / HEPATOCYTES</span>
                          <span className="text-amber-400">98.8% TARGETING</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden">
                          <div className="h-full bg-amber-400 w-[98.8%]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCap.visualType === 'synthesis' && (
                    <div className="p-6 rounded-xl bg-[#06080a] border border-emerald-500/20 font-mono text-xs space-y-4">
                      <div className="flex items-center justify-between text-emerald-400 border-b border-white/6 pb-3">
                        <span className="flex items-center gap-2">
                          <Flask size={16} /> MICROFLUIDIC WET-LAB STREAM
                        </span>
                        <span>[ 4.2M/DAY ]</span>
                      </div>
                      <div className="flex items-center justify-around py-2">
                        <div className="text-center">
                          <span className="text-[#8e959e] text-[10px] block">BATCH YIELD</span>
                          <span className="text-xl font-sans font-light text-[#f3f4f1] mt-1 block">99.6%</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[#8e959e] text-[10px] block">CYCLE TIME</span>
                          <span className="text-xl font-sans font-light text-emerald-400 mt-1 block">12.4 SEC</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technical Feature List */}
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[#8e959e] uppercase tracking-wider block">
                      CORE SPECIFICATIONS:
                    </span>
                    {activeCap.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-3 text-sm text-[#f3f4f1]">
                        <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Supporting Metrics Bar */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/8">
                    {activeCap.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="font-mono text-[10px] text-[#8e959e] uppercase">{m.label}</span>
                        <span className="font-sans text-xl font-light text-[#f3f4f1] mt-0.5">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </ReticleContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
