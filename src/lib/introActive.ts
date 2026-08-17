'use client';

/**
 * Tiny global flag: is the cinematic intro currently running? While true, the
 * section WebGL canvases are forced to render (their off-screen pause is
 * overridden) so the auto-scroll "journey" never flies past a blank canvas.
 * Defaults false so normal browsing keeps the off-screen pause optimization.
 */
let active = false;
const listeners = new Set<() => void>();

export function setIntroActive(value: boolean) {
  if (active === value) return;
  active = value;
  listeners.forEach((l) => l());
}

export function subscribeIntroActive(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getIntroActive() {
  return active;
}

export function getIntroActiveServer() {
  return false;
}
