'use client';

import type Lenis from 'lenis';

/**
 * Holds a reference to the app's single Lenis smooth-scroll instance so the
 * intro sequence can pause it while it drives the auto-scroll "journey", then
 * hand control back to the user.
 */
let instance: Lenis | null = null;

type LenisWindow = { __agLenis?: Lenis | null };

export function setLenis(l: Lenis | null) {
  instance = l;
  if (typeof window !== 'undefined') (window as unknown as LenisWindow).__agLenis = l;
}

export function getLenis() {
  if (instance) return instance;
  if (typeof window !== 'undefined') return (window as unknown as LenisWindow).__agLenis ?? null;
  return null;
}
