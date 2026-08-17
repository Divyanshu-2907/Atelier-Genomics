'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { clsx } from 'clsx';

interface MetricItem {
  id: number;
  value: number;
  suffix: string;
  label: string;
  subtext: string;
  accent: 'emerald' | 'amber';
}

const METRICS: MetricItem[] = [
  {
    id: 1,
    value: 42,
    suffix: '+',
    label: 'Research Programs',
    subtext: 'Active computational in-vitro candidate screening',
    accent: 'emerald',
  },
  {
    id: 2,
    value: 18,
    suffix: '',
    label: 'Clinical Candidates',
    subtext: 'Cell-selective capsids in advanced pipeline',
    accent: 'emerald',
  },
  {
    id: 3,
    value: 7,
    suffix: '',
    label: 'Scientific Platforms',
    subtext: 'Proprietary de novo synthesis engines',
    accent: 'amber',
  },
  {
    id: 4,
    value: 98.4,
    suffix: '%',
    label: 'Model Confidence',
    subtext: 'Sub-angstrom target binding affinity precision',
    accent: 'emerald',
  },
];

function CountUpMetric({ metric }: { metric: MetricItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      requestAnimationFrame(() => setDisplayValue(metric.value));
      return;
    }

    const start = 0;
    const end = metric.value;
    const duration = 1200; // 1.2s single-trigger count
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;

      setDisplayValue(metric.value % 1 !== 0 ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, metric.value, prefersReducedMotion]);

  return (
    <div ref={ref} className="flex flex-col gap-3 group">
      <div className="flex items-baseline gap-1">
        <span className="font-sans text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#f3f4f1]">
          {displayValue}
        </span>
        <span className={clsx('font-mono text-2xl lg:text-3xl font-light', metric.accent === 'amber' ? 'text-amber-400' : 'text-emerald-400')}>
          {metric.suffix}
        </span>
      </div>

      {/* Hairline Indicator Line */}
      <div className="w-12 h-0.5 bg-white/12 group-hover:w-20 group-hover:bg-emerald-400 transition-all duration-300" />

      <div className="space-y-1 pt-1">
        <h3 className="font-sans text-lg lg:text-xl font-normal text-[#f3f4f1] tracking-tight">
          {metric.label}
        </h3>
        <p className="font-mono text-xs text-[#8e959e] leading-relaxed">
          {metric.subtext}
        </p>
      </div>
    </div>
  );
}

export const ImpactSection: React.FC = () => {
  return (
    <section
      id="impact"
      className="relative py-16 lg:py-24 px-6 lg:px-12 bg-[#06080a] border-t border-white/6 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto space-y-12 lg:space-y-16">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/8">
          <div className="space-y-3 max-w-[65ch]">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block">
              PLATFORM TELEMETRY
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#f3f4f1] leading-tight">
              Calibrated metrics across <span className="italic font-normal text-emerald-400">computational biology.</span>
            </h2>
          </div>

          <div className="font-mono text-xs text-[#8e959e] text-right">
            <span>[ SAMPLE PLATFORM TELEMETRY DATA ]</span>
          </div>
        </div>

        {/* Airy 4-Metric Grid with Large Whitespace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pt-4">
          {METRICS.map((m) => (
            <CountUpMetric key={m.id} metric={m} />
          ))}
        </div>
      </div>
    </section>
  );
};
