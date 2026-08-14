'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface ScientificLabelProps {
  index?: string;
  label: string;
  accent?: 'emerald' | 'amber' | 'neutral';
  pulse?: boolean;
  className?: string;
}

export const ScientificLabel: React.FC<ScientificLabelProps> = ({
  index,
  label,
  accent = 'emerald',
  pulse = true,
  className,
}) => {
  const accentColors = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    neutral: 'text-[#8e959e] border-white/10 bg-white/5',
  };

  const dotColors = {
    emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    neutral: 'bg-slate-400',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2.5 px-3 py-1 rounded-full border text-[11px] font-mono uppercase tracking-[0.2em] backdrop-blur-sm select-none',
        accentColors[accent],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={clsx(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[accent]
            )}
          />
          <span className={clsx('relative inline-flex rounded-full h-2 w-2', dotColors[accent])} />
        </span>
      )}
      <span>
        {index && <span className="opacity-60 mr-1.5">{index} {'//'}</span>}
        {label}
      </span>
    </div>
  );
};
