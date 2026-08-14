'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface ReticleContainerProps {
  children: React.ReactNode;
  label?: string;
  sequenceId?: string;
  accent?: 'emerald' | 'amber';
  className?: string;
}

export const ReticleContainer: React.FC<ReticleContainerProps> = ({
  children,
  label,
  sequenceId,
  accent = 'emerald',
  className,
}) => {
  const accentBorder = {
    emerald: 'group-hover:border-emerald-500/40',
    amber: 'group-hover:border-amber-500/40',
  };

  const accentReticle = {
    emerald: 'text-emerald-400/80',
    amber: 'text-amber-400/80',
  };

  return (
    <div
      className={clsx(
        'group relative p-6 lg:p-8 rounded-2xl bg-[#0b0f14]/90 border border-white/10 backdrop-blur-md transition-colors overflow-hidden',
        accentBorder[accent],
        className
      )}
    >
      {/* Corner Crosshair Reticles */}
      <span className={clsx('absolute top-2 left-2.5 font-mono text-[10px] select-none pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity', accentReticle[accent])}>
        +
      </span>
      <span className={clsx('absolute top-2 right-2.5 font-mono text-[10px] select-none pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity', accentReticle[accent])}>
        +
      </span>
      <span className={clsx('absolute bottom-2 left-2.5 font-mono text-[10px] select-none pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity', accentReticle[accent])}>
        +
      </span>
      <span className={clsx('absolute bottom-2 right-2.5 font-mono text-[10px] select-none pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity', accentReticle[accent])}>
        +
      </span>

      {/* Header Info Bar */}
      {(label || sequenceId) && (
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/6 font-mono text-xs select-none">
          {label && <span className="text-[#8e959e] uppercase tracking-widest">{label}</span>}
          {sequenceId && <span className="text-emerald-400/90 tracking-wider">[{sequenceId}]</span>}
        </div>
      )}

      {/* Container Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
