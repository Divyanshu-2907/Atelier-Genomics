'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { getGlowTexture } from '@/three/particleTexture';
import { getLenis } from '@/lib/lenisStore';
import { setIntroActive } from '@/lib/introActive';

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

// ── Sequence phases & timing (seconds) ────────────────────────────────────
type Phase = 'journey-down' | 'journey-up' | 'gather' | 'explode';

const JOURNEY_DOWN_DUR = 4.4; // auto-scroll top → bottom
const JOURNEY_UP_DUR = 2.8; // auto-scroll bottom → top
const GATHER_DUR = 2.2; // helix charges / spins up
const EXPLODE_DUR = 1.6; // detonation

// Sections the journey threads through, in order
const JOURNEY_SECTIONS = [
  { id: 'innovation', label: '02 · INNOVATION' },
  { id: 'research', label: '03 · RESEARCH & PLATFORM' },
  { id: 'capabilities', label: '04 · CAPABILITIES' },
  { id: 'impact', label: '05 · IMPACT & TELEMETRY' },
];

interface DNAProps {
  isMobile: boolean;
  phase: Phase;
  buildRef: React.RefObject<number>;
  onExplodeStart: () => void;
  onComplete: () => void;
}

function IntroDNA({ isMobile, phase, buildRef, onExplodeStart, onComplete }: DNAProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const glowTexture = useMemo(() => getGlowTexture(), []);
  const { camera } = useThree();

  const startRef = useRef<number | null>(null);
  const explodeStartRef = useRef<number | null>(null);
  const explodedRef = useRef(false);
  const completedRef = useRef(false);
  const spinRef = useRef(0.9);
  const assembleRef = useRef(0); // monotonic build progress (never un-builds)

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

        const hx = Math.cos(angle) * radius;
        const hz = Math.sin(angle) * radius;
        posHelix[idx] = hx;
        posHelix[idx + 1] = y;
        posHelix[idx + 2] = hz;

        const sa = pseudoRandom(i * 7 + s * 3 + 1) * Math.PI * 2;
        const sd = 5.5 + pseudoRandom(i * 7 + s * 3 + 2) * 4.5;
        posScattered[idx] = Math.cos(sa) * sd;
        posScattered[idx + 1] = y + (pseudoRandom(i * 7 + s * 3 + 3) - 0.5) * 6;
        posScattered[idx + 2] = Math.sin(sa) * sd;

        const dir = new THREE.Vector3(hx, y * 0.35, hz).normalize();
        dir.x += (pseudoRandom(i * 11 + s) - 0.5) * 0.7;
        dir.y += (pseudoRandom(i * 13 + s) - 0.5) * 0.7;
        dir.z += (pseudoRandom(i * 17 + s) - 0.5) * 0.8 + 0.35;
        dir.normalize();
        const dist = 24 + pseudoRandom(i * 19 + s) * 28;
        posBurst[idx] = dir.x * dist;
        posBurst[idx + 1] = dir.y * dist;
        posBurst[idx + 2] = dir.z * dist;

        const mix = i / strandNodes;
        const c = s === 0 ? emerald.clone().lerp(cyan, mix) : cyan.clone().lerp(amber, mix);
        cols[idx] = c.r;
        cols[idx + 1] = c.g;
        cols[idx + 2] = c.b;

        // Top of the helix forms first so it "draws" downward as you scroll down
        stagger[i * 2 + s] = (1 - i / strandNodes) * 0.4 + s * 0.05;
      }
    }

    return { scattered: posScattered, helix: posHelix, burst: posBurst, colors: cols, delays: stagger, count: total };
  }, [isMobile]);

  const live = useMemo(() => new Float32Array(helix.length), [helix]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !groupRef.current) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startRef.current;

    const attr = pointsRef.current.geometry.attributes.position;
    const buf = attr.array as Float32Array;

    // Build progress is driven by the scroll journey: the helix constructs
    // itself as the page travels down. Latched so it never un-builds.
    const targetBuild = phase === 'journey-down' ? buildRef.current : 1;
    assembleRef.current = Math.max(assembleRef.current, targetBuild);
    const globalP = assembleRef.current;
    const breathe = globalP >= 0.999 ? Math.sin(elapsed * 2.2) * 0.04 : 0;

    // Detonation bookkeeping
    if (phase === 'explode' && !explodedRef.current) {
      explodedRef.current = true;
      explodeStartRef.current = elapsed;
      onExplodeStart();
    }
    let e = 0;
    if (explodedRef.current && explodeStartRef.current !== null) {
      e = THREE.MathUtils.clamp((elapsed - explodeStartRef.current) / EXPLODE_DUR, 0, 1);
    }
    const eEase = 1 - Math.pow(2, -10 * e);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (e <= 0) {
        const pp = THREE.MathUtils.clamp((globalP - delays[i]) / (1 - 0.4), 0, 1);
        const ease = 1 - Math.pow(1 - pp, 3);
        buf[i3] = THREE.MathUtils.lerp(scattered[i3], helix[i3], ease) + breathe;
        buf[i3 + 1] = THREE.MathUtils.lerp(scattered[i3 + 1], helix[i3 + 1], ease);
        buf[i3 + 2] = THREE.MathUtils.lerp(scattered[i3 + 2], helix[i3 + 2], ease) + breathe;
      } else {
        buf[i3] = THREE.MathUtils.lerp(helix[i3], burst[i3], eEase);
        buf[i3 + 1] = THREE.MathUtils.lerp(helix[i3 + 1], burst[i3 + 1], eEase);
        buf[i3 + 2] = THREE.MathUtils.lerp(helix[i3 + 2], burst[i3 + 2], eEase);
      }
    }
    attr.needsUpdate = true;

    if (matRef.current) matRef.current.opacity = explodedRef.current ? 0.95 * (1 - e) : 0.95;

    // Spin: gentle while travelling, charges up on gather, releases on explode
    const targetSpin = phase === 'gather' ? 6.5 : phase === 'explode' ? 3.0 * (1 - e) : 1.0;
    spinRef.current = THREE.MathUtils.lerp(spinRef.current, targetSpin, delta * 1.8);
    groupRef.current.rotation.y += delta * spinRef.current;

    // Camera holds during the journey, punches back on detonation
    camera.position.z = explodedRef.current ? THREE.MathUtils.lerp(11.5, 17.5, eEase) : 11.5;
    camera.lookAt(0, 0, 0);

    if (e >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.6 : 0.78} rotation={[0.14, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[live, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          map={glowTexture}
          alphaMap={glowTexture}
          size={isMobile ? 0.4 : 0.48}
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
  const [phase, setPhase] = useState<Phase>('journey-down');

  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const shockRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const finishedRef = useRef(false);
  const scrollProxy = useRef({ y: 0 });
  const rafRef = useRef(0);
  const buildRef = useRef(0); // 0→1 helix build progress, driven by scroll depth

  // Block user scroll/keys while the journey auto-scrolls
  const guard = useCallback((e: Event) => {
    e.preventDefault();
  }, []);
  const addGuards = useCallback(() => {
    window.addEventListener('wheel', guard, { passive: false });
    window.addEventListener('touchmove', guard, { passive: false });
  }, [guard]);
  const removeGuards = useCallback(() => {
    window.removeEventListener('wheel', guard);
    window.removeEventListener('touchmove', guard);
  }, [guard]);

  const setLabel = (text: string) => {
    if (labelRef.current) labelRef.current.textContent = text;
  };

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    cancelAnimationFrame(rafRef.current);
    gsap.killTweensOf(scrollProxy.current);
    removeGuards();
    sessionStorage.setItem('ag-intro-played', '1');
    const lenis = getLenis();
    lenis?.scrollTo(0, { immediate: true, force: true }); // cancel any in-flight journey scroll
    window.scrollTo(0, 0);
    document.documentElement.classList.remove('intro-scroll-lock');
    lenis?.start();
    setIntroActive(false);
    setActive(false);
  }, [removeGuards]);

  // Update the section-name ticker + progress bar as we scroll
  const updateTicker = useCallback((progress: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    const mid = window.innerHeight / 2;
    let current = '';
    for (const s of JOURNEY_SECTIONS) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        current = s.label;
        break;
      }
    }
    if (current) setLabel(current);
  }, []);

  const runExplode = useCallback(() => {
    // Flash
    if (flashRef.current) {
      gsap.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.06, ease: 'power2.out' });
      gsap.to(flashRef.current, { opacity: 0, duration: 1.0, delay: 0.06, ease: 'power2.out' });
    }
    // Shockwave ring
    if (shockRef.current) {
      gsap.fromTo(shockRef.current, { scale: 0.1, opacity: 0.75 }, { scale: 9, opacity: 0, duration: 1.3, ease: 'power3.out' });
    }
    // Fade the whole overlay away to reveal the page beneath
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
          keyframes: { x: [-14, 11, -9, 6, -3, 0], y: [7, -9, 5, -4, 2, 0], rotate: [-0.4, 0.3, -0.2, 0.1, 0] },
          clearProps: 'transform',
        }
      );
      window.setTimeout(() => root.classList.remove('intro-glitch'), 650);
    }
  }, []);

  const startGather = useCallback(() => {
    if (finishedRef.current) return;
    cancelAnimationFrame(rafRef.current);
    removeGuards();
    getLenis()?.stop();
    window.scrollTo(0, 0);
    document.documentElement.classList.add('intro-scroll-lock');
    setLabel('SEQUENCE LOCKED · 100%');
    setPhase('gather');
    // Darken the scrim to fully hide the page for the detonation
    if (scrimRef.current) gsap.to(scrimRef.current, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
    // After the charge, trigger detonation
    window.setTimeout(() => {
      if (!finishedRef.current) setPhase('explode');
    }, GATHER_DUR * 1000);
  }, [removeGuards]);

  const runJourney = useCallback(() => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    addGuards();

    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    // Live progress loop drives the section ticker + bar off the real scroll
    const loop = () => {
      const progress = maxY > 0 ? Math.min(1, window.scrollY / maxY) : 0;
      buildRef.current = Math.max(buildRef.current, progress); // build the helix as we descend
      updateTicker(progress);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const lenis = getLenis();

    const goUp = () => {
      if (finishedRef.current) return;
      setPhase('journey-up');
      if (lenis) {
        lenis.scrollTo(0, { duration: JOURNEY_UP_DUR, easing: easeInOut, lock: true, force: true, onComplete: startGather });
      } else {
        gsap.to(scrollProxy.current, { y: 0, duration: JOURNEY_UP_DUR, ease: 'power2.inOut', onUpdate: () => window.scrollTo(0, scrollProxy.current.y), onComplete: startGather });
      }
    };

    // Down: top → bottom, then back up
    if (lenis) {
      lenis.scrollTo(maxY, { duration: JOURNEY_DOWN_DUR, easing: easeInOut, lock: true, force: true, onComplete: goUp });
    } else {
      scrollProxy.current.y = 0;
      gsap.to(scrollProxy.current, { y: maxY, duration: JOURNEY_DOWN_DUR, ease: 'power1.inOut', onUpdate: () => window.scrollTo(0, scrollProxy.current.y), onComplete: goUp });
    }
  }, [addGuards, updateTicker, startGather]);

  // Decide whether to run, then kick off the sequence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('ag-intro-played') || prefersReducedMotion) return;

    setActive(true);
    setIntroActive(true);
    window.scrollTo(0, 0);

    // Give Lenis / the section canvases a moment to mount, then travel
    const timer = window.setTimeout(runJourney, 500);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
      gsap.killTweensOf(scrollProxy.current);
      removeGuards();
      document.documentElement.classList.remove('intro-scroll-lock');
      getLenis()?.start();
      setIntroActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  const skip = useCallback(() => finish(), [finish]);

  if (!isMounted || !active) return null;

  const journeyLabel = phase === 'journey-down' || phase === 'journey-up';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer select-none"
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
      {/* Scrim over the page — dimmed during the journey, opaque for the blast */}
      <div ref={scrimRef} className="absolute inset-0 bg-[#06080a]" style={{ opacity: 0.55 }} />
      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(6,8,10,0.85)_100%)]" />

      <Canvas
        camera={{ position: [0, 0, 11.5], fov: 50 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <IntroDNA
          isMobile={isMobile}
          phase={phase}
          buildRef={buildRef}
          onExplodeStart={runExplode}
          onComplete={finish}
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={isMobile ? 0.9 : 1.35} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur radius={0.8} />
        </EffectComposer>
      </Canvas>

      {/* Top status */}
      <div className="pointer-events-none absolute top-[12%] left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-emerald-400/80">
        {journeyLabel ? 'SCANNING PLATFORM' : 'ATELIER GENOMICS'}
      </div>

      {/* Section-name ticker */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute bottom-[20%] left-1/2 -translate-x-1/2 font-mono text-sm sm:text-base uppercase tracking-[0.3em] text-[#f3f4f1]"
        style={{ textShadow: '0 0 18px rgba(16,185,129,0.5)' }}
      />

      {/* Journey progress bar */}
      <div className="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 h-px w-40 sm:w-56 bg-white/10 overflow-hidden">
        <div ref={barRef} className="h-full w-full origin-left bg-emerald-400/80" style={{ transform: 'scaleX(0)' }} />
      </div>

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
