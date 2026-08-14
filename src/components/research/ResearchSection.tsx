'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScientificLabel } from '@/components/shared/ScientificLabel';
import { Target3DCanvas } from '@/three/Target3DCanvas';
import { ReticleContainer } from '@/components/shared/ReticleContainer';
import { Dna, Atom, Crosshair, Cpu, ArrowUpRight } from '@phosphor-icons/react';
import { clsx } from 'clsx';

interface ResearchPillar {
  id: number;
  slug: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  headline: string;
  explanation: string;
  sequenceId: string;
  readouts: { label: string; value: string; unit: string }[];
  accent: 'emerald' | 'amber';
}

const RESEARCH_PILLARS: ResearchPillar[] = [
  {
    id: 0,
    slug: 'genomics',
    name: 'Genomics & Editing',
    category: 'SEQUENCE ALIGNMENT',
    icon: Dna,
    headline: 'High-throughput synthetic RNA alignment & CRISPR-Cas12 codon optimization.',
    explanation:
      'We map massive cellular transcriptomic variants into structured vector spaces. Our algorithmic sequence pipeline optimizes codon usage for tissue-specific expression while avoiding off-target cleavage.',
    sequenceId: 'CRISPR-RNX-402',
    readouts: [
      { label: 'ON-TARGET AFFINITY', value: '0.12', unit: 'nM' },
      { label: 'CODON EFFICIENCY', value: '99.4', unit: '%' },
      { label: 'OFF-TARGET RATE', value: '< 0.001', unit: '%' },
    ],
    accent: 'emerald',
  },
  {
    id: 1,
    slug: 'computational-biology',
    name: 'Computational Biology',
    category: 'DE NOVO PROTEIN FOLDING',
    icon: Atom,
    headline: 'Generative tertiary protein structure prediction with sub-angstrom precision.',
    explanation:
      'Utilizing deep neural biophysics models, we simulate macromolecular folding pathways in real-time. This enables de novo design of synthetic enzymes and targeted binding pockets without physical crystal structures.',
    sequenceId: 'FOLD-3D-998',
    readouts: [
      { label: 'RMSD PRECISION', value: '0.42', unit: 'Å' },
      { label: 'THERMAL STABILITY', value: '94.2', unit: '°C' },
      { label: 'SCREENING SPEED', value: '10x', unit: 'FASTER' },
    ],
    accent: 'emerald',
  },
  {
    id: 2,
    slug: 'therapeutic-discovery',
    name: 'Therapeutic Discovery',
    category: 'TARGETED CAPSID TROPISM',
    icon: Crosshair,
    headline: 'In-vivo cell-selective capsids for targeted delivery of genetic medicine.',
    explanation:
      'We engineer viral and non-viral capsid surface topologies for selective hepatic and neural tropism, reducing off-target organ accumulation and unlocking precision cell-therapy delivery.',
    sequenceId: 'CAPSID-AAV-88',
    readouts: [
      { label: 'HEPATIC TROPISM', value: '98.8', unit: '%' },
      { label: 'IMMUNE EVASION', value: '4.2x', unit: 'TIER' },
      { label: 'SERUM HALF-LIFE', value: '72', unit: 'HRS' },
    ],
    accent: 'amber',
  },
  {
    id: 3,
    slug: 'biological-intelligence',
    name: 'Biological Intelligence',
    category: 'KINETIC ASSAY TELEMETRY',
    icon: Cpu,
    headline: 'Neural affinity optimization & automated microfluidic feedback loops.',
    explanation:
      'Our computational engine connects live wet-lab microfluidic assay telemetry directly into active machine-learning pipelines, continuously refining kinetic binding models across millions of screened variants.',
    sequenceId: 'AI-MODEL-V4',
    readouts: [
      { label: 'DAILY VARIANTS', value: '4.2M', unit: 'SAMPLES' },
      { label: 'MODEL ACCURACY', value: '98.6', unit: '%' },
      { label: 'CANDIDATE PIPELINE', value: '18', unit: 'CLINICAL' },
    ],
    accent: 'emerald',
  },
];

export const ResearchSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activePillar = RESEARCH_PILLARS[activeTab];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveTab((index + 1) % RESEARCH_PILLARS.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveTab((index - 1 + RESEARCH_PILLARS.length) % RESEARCH_PILLARS.length);
    }
  };

  return (
    <section
      id="research"
      className="relative min-h-dvh py-24 lg:py-36 px-6 lg:px-12 bg-[#06080a] border-t border-white/6 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/8">
          <div className="space-y-4 max-w-[65ch]">
            <ScientificLabel
              index="03"
              label="RESEARCH & PLATFORM PILLARS"
              accent="emerald"
              pulse={true}
            />
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#f3f4f1]">
              Computational <span className="italic font-normal text-emerald-400">Research Instrument</span>
            </h2>
            <p className="font-sans text-base text-[#8e959e] leading-relaxed">
              Explore our core technological domains driving programmable cell therapy and macromolecular synthesis.
            </p>
          </div>

          <div className="font-mono text-xs text-[#8e959e] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>INSTRUMENT ONLINE // SELECT PILLAR</span>
          </div>
        </div>

        {/* Research Instrument Tab Bar (Accessible W3C ARIA Tablist) */}
        <div
          role="tablist"
          aria-label="Research Domains"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 rounded-2xl bg-[#0b0f14] border border-white/8"
        >
          {RESEARCH_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={pillar.id}
                role="tab"
                id={`tab-${pillar.slug}`}
                aria-selected={isSelected}
                aria-controls={`panel-${pillar.slug}`}
                tabIndex={isSelected ? 0 : -1 as number}
                onClick={() => setActiveTab(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={clsx(
                  'relative flex items-center gap-3 p-4 rounded-xl text-left transition-[background-color,border-color,color] duration-200 cursor-pointer focus-visible:outline-none select-none',
                  isSelected
                    ? 'bg-[#11161d] text-[#f3f4f1] border border-white/12 shadow-[0_10px_25px_rgba(0,0,0,0.5)]'
                    : 'text-[#8e959e] hover:text-[#f3f4f1] hover:bg-white/5 border border-transparent'
                )}
              >
                <div
                  className={clsx(
                    'p-2.5 rounded-lg border shrink-0 transition-colors',
                    isSelected
                      ? pillar.accent === 'amber'
                        ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                        : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                      : 'text-[#8e959e] border-white/8'
                  )}
                >
                  <Icon size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                    0{idx + 1} {'// '} {pillar.category}
                  </span>
                  <span className="font-sans text-sm font-medium tracking-tight truncate">
                    {pillar.name}
                  </span>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="activeTabOutline"
                    className="absolute inset-0 rounded-xl border border-emerald-500/50 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Research Canvas Details */}
        <div
          role="tabpanel"
          id={`panel-${activePillar.slug}`}
          aria-labelledby={`tab-${activePillar.slug}`}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Side: Scientific Explanation & Live Data Readouts */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-6"
              >
                <ScientificLabel
                  label={activePillar.category}
                  accent={activePillar.accent}
                  pulse={false}
                />

                <h3 className="font-sans text-2xl lg:text-3xl font-light tracking-tight text-[#f3f4f1] leading-snug">
                  {activePillar.headline}
                </h3>

                <p className="font-sans text-base text-[#8e959e] leading-relaxed">
                  {activePillar.explanation}
                </p>

                {/* Supporting Live Data Readouts */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/8">
                  {activePillar.readouts.map((r, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-mono text-[10px] text-[#8e959e] uppercase tracking-wider">
                        {r.label}
                      </span>
                      <span className="font-sans text-xl lg:text-2xl font-light text-[#f3f4f1] mt-1">
                        {r.value}{' '}
                        <span className="font-mono text-xs text-emerald-400">[{r.unit}]</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#cta"
                    className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors group"
                  >
                    <span>Inspect Full Sequence Data</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Interactive 3D WebGL Target Visualizer Container */}
          <div className="lg:col-span-7">
            <ReticleContainer
              label={`RESEARCH CANVAS // ${activePillar.name.toUpperCase()}`}
              sequenceId={activePillar.sequenceId}
              accent={activePillar.accent}
            >
              <Target3DCanvas areaIndex={activeTab} />
            </ReticleContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
