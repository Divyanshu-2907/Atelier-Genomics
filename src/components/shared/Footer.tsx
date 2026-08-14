'use client';

import React from 'react';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { ArrowUp, Dna, GithubLogo, LinkedinLogo, TwitterLogo, Article } from '@phosphor-icons/react';

export const Footer: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="bg-[#06080a] border-t border-white/8 pt-20 pb-12 px-6 lg:px-12 text-[#8e959e] font-sans text-xs select-none">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main 4-Column Minimal Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/6">
          {/* Column 1: Brand Identity & Operational Status (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#" className="flex items-center gap-3 w-fit group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                <Dna size={22} weight="bold" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-light tracking-tight text-[#f3f4f1] group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  ATELIER <span className="font-normal text-emerald-400">GENOMICS</span>
                </span>
                <span className="font-mono text-[10px] text-[#8e959e]">
                  Computational Cell Therapy Platform
                </span>
              </div>
            </a>

            <p className="font-sans text-xs text-[#8e959e] leading-relaxed max-w-[34ch]">
              Pioneering de novo macromolecular synthesis, targeted capsid tropism, and automated microfluidic assay telemetry.
            </p>

            {/* Operational Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 font-mono text-[11px] text-emerald-400 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM OPERATIONAL // SOC2 TYPE II</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase text-[#f3f4f1] tracking-widest">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 font-mono text-[11px]">
              <li>
                <a href="#hero" className="hover:text-[#f3f4f1] transition-colors focus-visible:outline-none focus-visible:text-emerald-400">
                  01 // OVERVIEW
                </a>
              </li>
              <li>
                <a href="#innovation" className="hover:text-[#f3f4f1] transition-colors focus-visible:outline-none focus-visible:text-emerald-400">
                  02 // INNOVATION
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-[#f3f4f1] transition-colors focus-visible:outline-none focus-visible:text-emerald-400">
                  03 // RESEARCH
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#f3f4f1] transition-colors focus-visible:outline-none focus-visible:text-emerald-400">
                  04 // CAPABILITIES
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-[#f3f4f1] transition-colors focus-visible:outline-none focus-visible:text-emerald-400">
                  05 // TELEMETRY
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Research Domains (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs uppercase text-[#f3f4f1] tracking-widest">
              RESEARCH DOMAINS
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-[#8e959e]">
              <li className="hover:text-[#f3f4f1] transition-colors cursor-pointer">
                De Novo Protein Folding Architecture
              </li>
              <li className="hover:text-[#f3f4f1] transition-colors cursor-pointer">
                Synthetic RNA & CRISPR-Cas12 Alignment
              </li>
              <li className="hover:text-[#f3f4f1] transition-colors cursor-pointer">
                Cell-Selective AAV & Viral Tropism
              </li>
              <li className="hover:text-[#f3f4f1] transition-colors cursor-pointer">
                Automated Wet-Lab Microfluidic Telemetry
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Gateway & Repositories (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs uppercase text-[#f3f4f1] tracking-widest">
              INSTITUTIONAL GATEWAY
            </h4>
            <div className="space-y-3 font-mono text-[11px]">
              <p className="text-[#f3f4f1]">inquiries@ateliergenomics.com</p>
              <p className="text-[#8e959e]">Cambridge, MA // Bio-Hub</p>
            </div>

            {/* Scientific Repository Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#8e959e] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="GitHub Repository"
              >
                <GithubLogo size={16} />
              </a>
              <a
                href="https://biorxiv.org"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#8e959e] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="bioRxiv Preprints"
              >
                <Article size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#8e959e] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="LinkedIn Profile"
              >
                <LinkedinLogo size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#8e959e] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="X / Twitter"
              >
                <TwitterLogo size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back-to-Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px]">
          <p>© {new Date().getFullYear()} Atelier Genomics Inc. All rights reserved. Precision Biology Platform.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-[#f3f4f1] hover:border-emerald-500/40 hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 min-h-[44px]"
            aria-label="Back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
