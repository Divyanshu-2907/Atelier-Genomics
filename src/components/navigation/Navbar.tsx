'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/shared/Button';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { List, X, ArrowRight } from '@phosphor-icons/react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Innovation', href: '#innovation' },
  { label: 'Research & Platform', href: '#research' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Impact & Telemetry', href: '#impact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll detection threshold for background backdrop switch
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section observer to update active navigation state
  useEffect(() => {
    const sectionIds = ['innovation', 'research', 'capabilities', 'impact', 'cta'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Close mobile drawer on Escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, handleKeyDown]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none h-16 lg:h-20 flex items-center',
          isScrolled
            ? 'bg-[#06080a]/90 backdrop-blur-md border-b border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Identity */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
            aria-label="Atelier Genomics Homepage"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0b0f14] border border-white/14 group-hover:border-emerald-500/50 transition-colors shrink-0 overflow-hidden flex items-center justify-center shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.png" alt="Atelier Genomics Icon" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-base lg:text-lg font-light tracking-tight text-[#f3f4f1] group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                ATELIER <span className="font-normal text-emerald-400">GENOMICS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={clsx(
                    'relative font-sans text-xs uppercase tracking-widest transition-colors py-1 focus-visible:outline-none',
                    isActive
                      ? 'text-[#f3f4f1] font-medium'
                      : 'text-[#8e959e] hover:text-[#f3f4f1]'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Primary CTA & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={14} />}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector('#cta');
                  if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }}
              >
                Initiate Collaboration
              </Button>
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-[#0b0f14] border border-white/12 text-[#f3f4f1] hover:border-emerald-500/40 focus-visible:outline-none cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-[#06080a]/98 backdrop-blur-xl md:hidden flex flex-col justify-between p-8 pt-28 min-h-dvh"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest border-b border-white/10 pb-3">
                [ NAVIGATION MENU ]
              </span>
              {NAV_ITEMS.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="font-sans text-2xl font-light text-[#f3f4f1] hover:text-emerald-400 transition-colors flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-[#8e959e] group-hover:text-emerald-400">
                    0{idx + 1}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Mobile Footer CTA */}
            <div className="pt-8 border-t border-white/10 space-y-4">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={<ArrowRight size={16} />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  const target = document.querySelector('#cta');
                  if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }}
              >
                Initiate Collaboration
              </Button>
              <p className="font-mono text-xs text-center text-[#8e959e]">
                Atelier Genomics · Operational v4.2
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
