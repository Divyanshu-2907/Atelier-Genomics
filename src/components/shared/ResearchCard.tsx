'use client';

import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { ScientificLabel } from './ScientificLabel';
import { ArrowUpRight } from '@phosphor-icons/react';

export interface ResearchCardProps {
  category: string;
  sequenceTag: string;
  title: string;
  description: string;
  metrics?: { label: string; value: string }[];
  accent?: 'emerald' | 'amber';
  onClick?: () => void;
  className?: string;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  category,
  sequenceTag,
  title,
  description,
  metrics,
  accent = 'emerald',
  onClick,
  className,
}) => {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      className={clsx(
        'group relative flex flex-col justify-between p-8 rounded-2xl bg-[#0b0f14] border border-white/8 transition-colors hover:border-emerald-500/40 hover:bg-[#11161d] cursor-pointer overflow-hidden',
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <ScientificLabel label={category} accent={accent} pulse={false} />
        <span className="font-mono text-xs text-[#8e959e] tracking-wider uppercase">
          {sequenceTag}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans text-xl lg:text-2xl font-normal text-[#f3f4f1] tracking-tight group-hover:text-emerald-300 transition-colors">
            {title}
          </h3>
          <span className="p-2 rounded-full border border-white/10 text-[#8e959e] group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors shrink-0">
            <ArrowUpRight size={18} weight="bold" />
          </span>
        </div>
        <p className="font-sans text-sm text-[#8e959e] leading-relaxed max-w-[55ch]">
          {description}
        </p>
      </div>

      {/* Footer Metrics (Optional) */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/6">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-mono text-xs text-[#8e959e] uppercase tracking-wider">
                {m.label}
              </span>
              <span className="font-mono text-base font-medium text-[#f3f4f1] mt-0.5">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.article>
  );
};
