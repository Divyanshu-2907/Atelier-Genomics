'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';

interface MagneticProps {
  children: React.ReactNode;
  /** Fraction of the cursor offset the element follows (0–1). */
  strength?: number;
  className?: string;
}

/**
 * Wraps an element so it gently pulls toward the cursor while hovered and
 * springs back on leave — the "magnetic button" micro-interaction. Desktop /
 * fine-pointer only, and inert under reduced-motion.
 */
export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.35, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [prefersReducedMotion, strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};
