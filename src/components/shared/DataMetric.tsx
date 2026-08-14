'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface DataMetricProps {
  value: string;
  unit?: string;
  label: string;
  subtext?: string;
  accent?: 'emerald' | 'amber' | 'neutral';
  className?: string;
}

export const DataMetric: React.FC<DataMetricProps> = ({
  value,
  unit,
  label,
  subtext,
  accent = 'emerald',
  className,
}) => {
  const accentText = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    neutral: 'text-[#8e959e]',
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-2 p-6 rounded-2xl bg-[#0b0f14]/80 border border-white/8 backdrop-blur-sm transition-all hover:border-white/20',
        className
      )}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-5xl lg:text-6xl font-light tracking-tight text-[#f3f4f1]">
          {value}
        </span>
        {unit && (
          <span className={clsx('font-mono text-sm uppercase tracking-widest', accentText[accent])}>
            [{unit}]
          </span>
        )}
      </div>
      <div className="font-sans text-base font-medium text-[#f3f4f1] tracking-wide">{label}</div>
      {subtext && <div className="font-mono text-xs text-[#8e959e]">{subtext}</div>}
    </div>
  );
};
