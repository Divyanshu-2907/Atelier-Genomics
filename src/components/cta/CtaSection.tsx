'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/shared/Button';
import { ScientificLabel } from '@/components/shared/ScientificLabel';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { ArrowRight, X, CheckCircle, ShieldCheck, Dna } from '@phosphor-icons/react';

export const CtaSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    email: '',
    domain: 'de-novo-proteins',
    scope: '',
  });

  const prefersReducedMotion = usePrefersReducedMotion();

  // Close modal on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="cta"
      className="relative min-h-[85dvh] flex items-center justify-center py-28 lg:py-40 px-6 lg:px-12 bg-[#06080a] border-t border-white/6 overflow-hidden select-none"
    >
      {/* Living Science Undulating Ambient Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto text-center space-y-10 relative z-10">
        <ScientificLabel
          index="04"
          label="RESEARCH INITIATION"
          accent="emerald"
          pulse={true}
          className="mx-auto"
        />

        {/* Enormous Editorial Headline */}
        <h2 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#f3f4f1] leading-[1.08] max-w-[20ch] mx-auto">
          Build what biology has <span className="italic font-normal text-emerald-400">not imagined yet.</span>
        </h2>

        {/* Subtext */}
        <p className="font-sans text-base lg:text-xl text-[#8e959e] leading-relaxed max-w-[55ch] mx-auto">
          Partner with Atelier Genomics to design de novo protein architectures, optimize targeted capsids, and accelerate clinical candidate synthesis.
        </p>

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Initiate Collaboration
          </Button>
        </div>

        {/* Security & Verification Pill */}
        <div className="pt-10 flex items-center justify-center gap-6 font-mono text-xs text-[#8e959e]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>SOC2 TYPE II COMPLIANT</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <Dna size={16} className="text-amber-400" />
            <span>CLINICAL PARTNER GATEWAY</span>
          </div>
        </div>
      </div>

      {/* Interactive Research Partner Inquiry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#06080a]/90 backdrop-blur-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Initiate Research Collaboration Modal"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-xl p-8 rounded-2xl bg-[#0b0f14] border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-6 text-left my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-[#8e959e] hover:text-[#f3f4f1] hover:border-emerald-500/40 transition-colors cursor-pointer focus-visible:outline-none"
                aria-label="Close Modal"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-2">
                <ScientificLabel label="PARTNER GATEWAY" accent="emerald" pulse={false} />
                <h3 className="font-sans text-2xl font-light text-[#f3f4f1] tracking-tight">
                  Initiate Research Collaboration
                </h3>
                <p className="font-sans text-xs text-[#8e959e]">
                  Submit your research scope to access our platform telemetry and candidate design pipeline.
                </p>
              </div>

              {/* Form Content or Success Confirmation */}
              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-6">
                  <div className="p-3 rounded-full bg-emerald-400/20 text-emerald-400 inline-block">
                    <CheckCircle size={32} weight="fill" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans text-lg font-medium text-[#f3f4f1]">
                      Research Inquiry Submitted
                    </h4>
                    <p className="font-mono text-xs text-emerald-400">
                      [ CONFIRMATION ID // #AG-9942-VERIFIED ]
                    </p>
                    <p className="font-sans text-xs text-[#8e959e] pt-2">
                      Our computational biophysics team will review your scope within 24 hours.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false);
                      setIsModalOpen(false);
                    }}
                  >
                    Close Window
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-[#8e959e] uppercase block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Evelyn Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#06080a] border border-white/10 text-sm text-[#f3f4f1] placeholder-[#5b626c] focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#8e959e] uppercase block mb-1">
                      Research Institution / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Institute for Synthetic Biology"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#06080a] border border-white/10 text-sm text-[#f3f4f1] placeholder-[#5b626c] focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#8e959e] uppercase block mb-1">
                      Institutional Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vance@synbio.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#06080a] border border-white/10 text-sm text-[#f3f4f1] placeholder-[#5b626c] focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#8e959e] uppercase block mb-1">
                      Primary Focus Domain
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#06080a] border border-white/10 text-sm text-[#f3f4f1] focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="de-novo-proteins">De Novo Protein Folding</option>
                      <option value="crispr-capsids">CRISPR Targeted Capsids</option>
                      <option value="cell-therapy">Cell-Selective Gene Therapy</option>
                      <option value="microfluidics">Microfluidic High-Throughput Assays</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#8e959e] uppercase block mb-1">
                      Research Scope Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of target biology and desired synthesis timeline..."
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#06080a] border border-white/10 text-sm text-[#f3f4f1] placeholder-[#5b626c] focus:border-emerald-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <Button variant="primary" size="md" className="w-full justify-center">
                      Submit Research Inquiry
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
