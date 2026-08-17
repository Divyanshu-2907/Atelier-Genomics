'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';

// Selector for elements that should trigger the "locked-on" reticle state
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]';

/**
 * A lab-instrument crosshair cursor. A crosshair ring trails the pointer with
 * spring damping while a precise dot tracks it exactly; the ring "locks on"
 * (grows + brightens) over interactive elements. Desktop/fine-pointer only,
 * and disabled under reduced-motion — both fall back to the native cursor.
 */
export const ReticleCursor: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // 1. Decide whether the reticle should run (fine pointer + motion allowed)
  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
  }, [prefersReducedMotion]);

  // 2. Once the elements exist, wire up tracking + interaction listeners
  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.classList.add('reticle-active');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let visible = false;
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      ring.style.opacity = v ? '1' : '0';
      dot.style.opacity = v ? '1' : '0';
    };
    setVisible(false);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ring.classList.toggle('is-hover', !!el);
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => setVisible(false);

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('reticle-active');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="reticle-ring" style={{ opacity: 0 }} aria-hidden="true">
        <div className="r-inner" />
      </div>
      <div ref={dotRef} className="reticle-dot" style={{ opacity: 0 }} aria-hidden="true">
        <div className="d-inner" />
      </div>
    </>
  );
};
