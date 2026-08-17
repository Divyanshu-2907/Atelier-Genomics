import * as THREE from 'three';

/**
 * Generates a soft radial-gradient sprite texture used as the `map` on
 * pointsMaterials. Replaces the default hard square GL point with a circular,
 * feathered glow — the single biggest upgrade to how a particle field reads.
 *
 * The core is a bright, tight highlight that falls off through a wider halo to
 * fully transparent, so additive blending produces luminous "orbs" rather than
 * flat dots. Rendered once into a 128px canvas and cached as a module singleton.
 */
let cachedTexture: THREE.CanvasTexture | null = null;

export function getGlowTexture(): THREE.CanvasTexture {
  if (cachedTexture) return cachedTexture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d')!;
  const center = size / 2;

  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  // Tight bright core
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
  // Feathered mid halo
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)');
  // Fully transparent edge
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  cachedTexture = texture;
  return texture;
}

/**
 * easeOutBack — a mild overshoot that lets particles "settle" into their target
 * lattice positions instead of decelerating linearly. Reads as crafted rather
 * than mechanical. Constant is gentled from the canonical 1.70158 to keep the
 * overshoot subtle on convergent molecular geometry.
 */
export function easeOutBack(x: number): number {
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
