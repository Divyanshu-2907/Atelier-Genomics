'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { getGlowTexture } from '@/three/particleTexture';

// Deterministic pseudo-random (SSR/lint-safe, no Math.random in render path)
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

function subscribeClient(cb: () => void) {
  return () => cb();
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}
function getMobileSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// ── Sequence timing (seconds) ─────────────────────────────────────────────
const ASSEMBLE_DUR = 2.6; // scattered → helix, spinning up
const HOLD_DUR = 1.1; // fully formed, spinning "round and round"
const EXPLODE_DUR = 1.5; // detonation → particles fly past viewer
const EXPLODE_AT = ASSEMBLE_DUR + HOLD_DUR;
const DONE_AT = EXPLODE_AT + EXPLODE_DUR;

interface DNAProps {
  isMobile: boolean;
  readoutRef: React.RefObject<HTMLDivElement | null>;
  onExplode: () => void;
  onComplete: () => void;
}

function IntroDNA({ isMobile, readoutRef, onExplode, onComplete }: DNAProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const glowTexture = useMemo(() => getGlowTexture(), []);
  const { camera } = useThree();

  const startRef = useRef<number | null>(null);
  const explodedRef = useRef(false);
  const completedRef = useRef(false);
  const lastPctRef = useRef(-1);

  const { scattered, helix, burst, colors, delays, count } = useMemo(() => {
    const strandNodes = isMobile ? 90 : 200;
    const total = strandNodes * 2;
    const posScattered = new Float32Array(total * 3);
    const posHelix = new Float32Array(total * 3);
    const posBurst = new Float32Array(total * 3);
    const cols = new Float32Array(total * 3);
    const stagger = new Float32Array(total);

    const emerald = new THREE.Color('#10b981');
    const cyan = new THREE.Color('#06b6d4');
    const amber = new THREE.Color('#f59e0b');

    const radius = 2.15;
    const height = 12;

    for (let i = 0; i < strandNodes; i++) {
      const t = (i / strandNodes) * Math.PI * 5.5;
      const y = (i / strandNodes) * height - height / 2;

      for (let s = 0; s < 2; s++) {
        const idx = (i * 2 + s) * 3;
        const angle = t + s * Math.PI;

        // Helix target
        const hx = Math.cos(angle) * radius;
        const hz = Math.sin(angle) * radius;
        posHelix[idx] = hx;
        posHelix[idx + 1] = y;
        posHelix[idx + 2] = hz;

        // Scattered start — a loose shell around the helix
        const sa = pseudoRandom(i * 7 + s * 3 + 1) * Math.PI * 2;
        const sd = 5.5 + pseudoRandom(i * 7 + s * 3 + 2) * 4.5;
        posScattered[idx] = Math.cos(sa) * sd;
        posScattered[idx + 1] = y + (pseudoRandom(i * 7 + s * 3 + 3) - 0.5) * 6;
        posScattered[idx + 2] = Math.sin(sa) * sd;

        // Burst target — radial direction from centre, biased toward the viewer (+z)
        const dir = new THREE.Vector3(hx, y * 0.35, hz).normalize();
        dir.x += (pseudoRandom(i * 11 + s) - 0.5) * 0.7;
        dir.y += (pseudoRandom(i * 13 + s) - 0.5) * 0.7;
        dir.z += (pseudoRandom(i * 17 + s) - 0.5) * 0.8 + 0.35;
        dir.normalize();
        const dist = 24 + pseudoRandom(i * 19 + s) * 28;
        posBurst[idx] = dir.x * dist;
        posBurst[idx + 1] = dir.y * dist;
        posBurst[idx + 2] = dir.z * dist;

        // Colour gradient along the strand
        const mix = i / strandNodes;
        const c = s === 0 ? emerald.clone().lerp(cyan, mix) : cyan.clone().lerp(amber, mix);
        cols[idx] = c.r;
        cols[idx + 1] = c.g;
        cols[idx + 2] = c.b;

        stagger[i * 2 + s] = (i / strandNodes) * 0.45 + s * 0.05;
      }
    }

    return { scattered: posScattered, helix: posHelix, burst: posBurst, colors: cols, delays: stagger, count: total };
  }, [isMobile]);

  const live = useMemo(() => new Float32Array(helix.length), [helix]);

  // Diegetic telemetry readout (updated imperatively so it never re-renders React)
  const writeReadout = (text: string, opacity: number) => {
    const el = readoutRef.current;
    if (!el) return;
    if (el.dataset.text !== text) {
      el.textContent = text;
      el.dataset.text = text;
    }
    el.style.opacity = String(opacity);
  };

  useFrame((state, delta) => {
    if (!pointsRef.current || !groupRef.current) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startRef.current;

    const attr = pointsRef.current.geometry.attributes.position;
    const buf = attr.array as Float32Array;

    // Camera drift for parallax life
    const driftX = Math.sin(elapsed * 0.5) * 0.5;
    const driftY = Math.cos(elapsed * 0.42) * 0.35;

    if (elapsed < EXPLODE_AT) {
      // ── Assemble + hold ──────────────────────────────────────────────
      const globalP = THREE.MathUtils.clamp(elapsed / ASSEMBLE_DUR, 0, 1);
      const breathe = elapsed >= ASSEMBLE_DUR ? Math.sin((elapsed - ASSEMBLE_DUR) * 8) * 0.04 : 0;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const pp = THREE.MathUtils.clamp((globalP - delays[i]) / (1 - 0.45), 0, 1);
        const ease = 1 - Math.pow(1 - pp, 3);
        buf[i3] = THREE.MathUtils.lerp(scattered[i3], helix[i3], ease) + breathe;
        buf[i3 + 1] = THREE.MathUtils.lerp(scattered[i3 + 1], helix[i3 + 1], ease);
        buf[i3 + 2] = THREE.MathUtils.lerp(scattered[i3 + 2], helix[i3 + 2], ease) + breathe;
      }

      // Spin ramps up as the "charge" builds
      const spin = 0.5 + globalP * 2.0 + (elapsed >= ASSEMBLE_DUR ? (elapsed - ASSEMBLE_DUR) * 5 : 0);
      groupRef.current.rotation.y += delta * spin;
      if (matRef.current) matRef.current.opacity = 0.95;

      // Slow cinematic dolly-in during the build
      const camZ = THREE.MathUtils.lerp(15.5, 10.2, easeInOut(globalP));
      camera.position.set(driftX, driftY, camZ);
      camera.lookAt(0, 0, 0);

      // Telemetry readout
      if (elapsed < ASSEMBLE_DUR) {
        const pct = Math.min(99, Math.floor((elapsed / ASSEMBLE_DUR) * 100));
        if (pct !== lastPctRef.current) {
          lastPctRef.current = pct;
          writeReadout(`SEQUENCING GENOME · ${pct}%`, 1);
        }
      } else {
        writeReadout('SEQUENCE LOCKED · 100%', 1);
      }
    } else {
      // ── Detonation ───────────────────────────────────────────────────
      if (!explodedRef.current) {
        explodedRef.current = true;
        onExplode();
      }
      const e = THREE.MathUtils.clamp((elapsed - EXPLODE_AT) / EXPLODE_DUR, 0, 1);
      const ease = 1 - Math.pow(2, -10 * e); // easeOutExpo — violent start

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        buf[i3] = THREE.MathUtils.lerp(helix[i3], burst[i3], ease);
        buf[i3 + 1] = THREE.MathUtils.lerp(helix[i3 + 1], burst[i3 + 1], ease);
        buf[i3 + 2] = THREE.MathUtils.lerp(helix[i3 + 2], burst[i3 + 2], ease);
      }

      groupRef.current.rotation.y += delta * 3.5 * (1 - e);
      if (matRef.current) matRef.current.opacity = 0.95 * (1 - e);

      // Camera punches back on the blast
      const camZ = THREE.MathUtils.lerp(10.2, 17.5, ease);
      camera.position.set(driftX * (1 - e), driftY * (1 - e), camZ);
      camera.lookAt(0, 0, 0);

      writeReadout('', 0);

      if (elapsed >= DONE_AT && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.72 : 0.92} rotation={[0.15, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[live, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          map={glowTexture}
          alphaMap={glowTexture}
          size={isMobile ? 0.42 : 0.5}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export const IntroSequence: React.FC = () => {
  const isMounted = useSyncExternalStore(subscribeClient, getClientSnapshot, getServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeClient, getMobileSnapshot, getServerSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [active, setActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const shockRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);

  // Decide on mount whether to run the intro
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const alreadyPlayed = sessionStorage.getItem('ag-intro-played');
    if (alreadyPlayed || prefersReducedMotion) return;

    setActive(true);
    window.scrollTo(0, 0);
    document.documentElement.classList.add('intro-scroll-lock');

    return () => {
      document.documentElement.classList.remove('intro-scroll-lock');
    };
  }, [prefersReducedMotion]);

  const handleExplode = useCallback(() => {
    // Flash
    if (flashRef.current) {
      gsap.fromTo(
        flashRef.current,
        { opacity: 0 },
        { opacity: 0.85, duration: 0.06, ease: 'power2.out' }
      );
      gsap.to(flashRef.current, { opacity: 0, duration: 1.0, delay: 0.06, ease: 'power2.out' });
    }
    // Shockwave ring
    if (shockRef.current) {
      gsap.fromTo(
        shockRef.current,
        { scale: 0.1, opacity: 0.75 },
        { scale: 9, opacity: 0, duration: 1.3, ease: 'power3.out' }
      );
    }
    // Fade the dark overlay away to reveal the page beneath
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 1.3, delay: 0.05, ease: 'power2.inOut' });
    }
    // "Damage" — shake + colour glitch on the actual page content
    const root = document.getElementById('root-container');
    if (root) {
      root.classList.add('intro-glitch');
      gsap.fromTo(
        root,
        { x: 0, y: 0, rotate: 0 },
        {
          duration: 0.6,
          ease: 'power1.inOut',
          keyframes: {
            x: [-14, 11, -9, 6, -3, 0],
            y: [7, -9, 5, -4, 2, 0],
            rotate: [-0.4, 0.3, -0.2, 0.1, 0],
          },
          clearProps: 'transform',
        }
      );
      window.setTimeout(() => root.classList.remove('intro-glitch'), 650);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('ag-intro-played', '1');
    document.documentElement.classList.remove('intro-scroll-lock');
    setActive(false);
  }, []);

  // Click / tap / key to skip
  const skip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  if (!isMounted || !active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#06080a] overflow-hidden cursor-pointer select-none"
      onClick={skip}
      role="button"
      tabIndex={0}
      aria-label="Intro animation. Click to skip."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          skip();
        }
      }}
    >
      {/* Ambient centre glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.10),_transparent_60%)]" />

      <Canvas
        camera={{ position: [0, 0, 15.5], fov: 50 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <IntroDNA isMobile={isMobile} readoutRef={readoutRef} onExplode={handleExplode} onComplete={handleComplete} />
        <EffectComposer multisampling={isMobile ? 0 : 4}>
          <Bloom intensity={isMobile ? 0.9 : 1.35} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur radius={0.8} />
        </EffectComposer>
      </Canvas>

      {/* Diegetic telemetry readout */}
      <div
        ref={readoutRef}
        className="pointer-events-none absolute left-1/2 bottom-[24%] -translate-x-1/2 font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-emerald-400/90"
        style={{ textShadow: '0 0 18px rgba(16,185,129,0.5)' }}
      />

      {/* Shockwave ring */}
      <div
        ref={shockRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400/70 opacity-0"
        style={{ boxShadow: '0 0 80px rgba(16,185,129,0.55), inset 0 0 40px rgba(16,185,129,0.35)' }}
      />

      {/* Detonation flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: 'radial-gradient(circle at center, rgba(209,250,229,0.95), rgba(16,185,129,0.5) 35%, transparent 70%)' }}
      />

      {/* Skip hint */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#5b626c]">
        [ click to skip ]
      </div>
    </div>
  );
};
