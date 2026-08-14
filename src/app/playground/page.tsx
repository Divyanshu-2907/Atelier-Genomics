'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { ScientificLabel } from '@/components/shared/ScientificLabel';
import { DataMetric } from '@/components/shared/DataMetric';
import { ResearchCard } from '@/components/shared/ResearchCard';
import { ReticleContainer } from '@/components/shared/ReticleContainer';
import { ArrowRight, Dna, Atom, Flask } from '@phosphor-icons/react';

export default function StylePlaygroundPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'typography'>('overview');

  return (
    <div className="min-h-dvh bg-[#06080a] text-[#f3f4f1] p-6 lg:p-12 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="max-w-7xl mx-auto pb-10 mb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <ScientificLabel label="Phase 2 Design System Playground" index="SYS // 02" accent="emerald" />
          <h1 className="font-sans text-4xl lg:text-5xl font-light tracking-tight text-[#f3f4f1] mt-4">
            Atelier Genomics <span className="italic text-emerald-400 font-normal">Design System</span>
          </h1>
          <p className="font-sans text-base text-[#8e959e] mt-2 max-w-[60ch]">
            Scientific Editorial + Luxury Technology + Research Laboratory visual identity.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0b0f14] border border-white/10">
          {(['overview', 'components', 'typography'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#f3f4f1] text-[#06080a] font-medium'
                  : 'text-[#8e959e] hover:text-[#f3f4f1]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-16">
        {/* Section 1: Typography System */}
        <section className="space-y-6">
          <ScientificLabel label="01 / Typography Hierarchy" accent="emerald" pulse={false} />
          <div className="p-8 rounded-2xl bg-[#0b0f14] border border-white/8 space-y-8">
            <div>
              <span className="font-mono text-xs text-[#8e959e] uppercase block mb-2">Display Hero (Outfit Light)</span>
              <p className="font-sans text-4xl lg:text-6xl font-light tracking-tight text-[#f3f4f1] leading-none">
                Programmable Biology for Next-Era Therapeutics
              </p>
            </div>
            <div className="pt-6 border-t border-white/6">
              <span className="font-mono text-xs text-[#8e959e] uppercase block mb-2">Section Heading H2</span>
              <p className="font-sans text-2xl lg:text-3xl font-normal tracking-tight text-[#f3f4f1]">
                De Novo Protein Synthesis & Computational Cell Targeting
              </p>
            </div>
            <div className="pt-6 border-t border-white/6">
              <span className="font-mono text-xs text-[#8e959e] uppercase block mb-2">Body Text</span>
              <p className="font-sans text-base text-[#8e959e] leading-relaxed max-w-[65ch]">
                Our generative macromolecular engine predicts tertiary protein folding configurations with sub-angstrom accuracy, accelerating therapeutic candidate optimization by 10x.
              </p>
            </div>
            <div className="pt-6 border-t border-white/6">
              <span className="font-mono text-xs text-[#8e959e] uppercase block mb-2">Scientific Readout (JetBrains Mono)</span>
              <p className="font-mono text-sm text-emerald-400 tracking-wider">
                [SEQ-9942] Affinity: 0.14 nM · Stability Index: 99.8% · Mutation Rate: 0.002%
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Tactile Buttons */}
        <section className="space-y-6">
          <ScientificLabel label="02 / Tactile Buttons & Micro-Interactions" accent="emerald" pulse={false} />
          <div className="p-8 rounded-2xl bg-[#0b0f14] border border-white/8 flex flex-wrap items-center gap-6">
            <Button variant="primary" icon={<ArrowRight size={16} />}>
              Primary CTA (Alabaster)
            </Button>
            <Button variant="secondary" icon={<Dna size={16} />}>
              Secondary Button (Mineral)
            </Button>
            <Button variant="ghost">
              Ghost Link
            </Button>
            <Button variant="scientific" icon={<Atom size={16} />}>
              [ RUN TARGET SIMULATION ]
            </Button>
          </div>
        </section>

        {/* Section 3: Data Readouts */}
        <section className="space-y-6">
          <ScientificLabel label="03 / Data Metrics & Telemetry" accent="amber" pulse={false} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataMetric
              value="99.8%"
              unit="Kd = 0.14 nM"
              label="On-Target Binding Precision"
              subtext="Screened across 4.2M variant configurations"
              accent="emerald"
            />
            <DataMetric
              value="10x"
              unit="Lead Opt"
              label="Accelerated Synthesis Speed"
              subtext="From sequence design to in-vitro validation"
              accent="emerald"
            />
            <DataMetric
              value="18"
              unit="Phase II"
              label="Clinical Candidates"
              subtext="Targeted capsids in active pipeline"
              accent="amber"
            />
          </div>
        </section>

        {/* Section 4: Interactive Reticle Visual Container & Research Item */}
        <section className="space-y-6">
          <ScientificLabel label="04 / Interactive Viewport & Research Item" accent="emerald" pulse={false} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ReticleContainer label="Macromolecular Simulator" sequenceId="CAS-12B">
              <div className="h-64 flex flex-col items-center justify-center rounded-xl bg-[#06080a] border border-white/6 p-6 text-center space-y-4">
                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Flask size={32} weight="duotone" />
                </div>
                <div>
                  <h4 className="font-sans text-lg font-medium text-[#f3f4f1]">Interactive 3D Viewport Target</h4>
                  <p className="font-mono text-xs text-[#8e959e] mt-1">[Hover active reticle container for subtle outline morph]</p>
                </div>
              </div>
            </ReticleContainer>

            <ResearchCard
              category="Synthetic Biology"
              sequenceTag="[RNX-4091]"
              title="De Novo CRISPR-Cas12 Capsid Engineering"
              description="Engineering targeted viral capsids with tissue-specific tropism for cell-selective gene therapy delivery."
              metrics={[
                { label: 'AFFINITY', value: '0.12 nM' },
                { label: 'TROPISM', value: 'Hepatic Tier-1' },
              ]}
              accent="emerald"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
