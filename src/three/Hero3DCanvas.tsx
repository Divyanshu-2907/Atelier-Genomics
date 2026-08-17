'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { useInView } from '@/lib/useInView';
import { getGlowTexture, easeOutBack } from './particleTexture';

// Reusable temporaries for per-frame cursor projection (avoids allocation)
const _pointerWorld = new THREE.Vector3();
const _pointerLocal = new THREE.Vector3();

export type DNAState =
  | 'IDLE_SCATTERED'
  | 'ASSEMBLING'
  | 'ASSEMBLED'
  | 'DECONSTRUCTING'
  | 'SCATTERED';

// Pure deterministic pseudo-random generator for React 19 lint compliance
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Client mount store
function subscribeClient(callback: () => void) {
  return () => callback();
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

// Mobile viewport store
function subscribeMobile(callback: () => void) {
  if (typeof window === 'undefined') return () => { };
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
function getMobileSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

interface BiomolecularAssemblyProps {
  isMobile: boolean;
  dnaState: DNAState;
  onStateTransition: (nextState: DNAState) => void;
  prefersReducedMotion: boolean;
}

/**
 * Interactive Cinematic Molecular Assembly Mesh
 */
function BiomolecularAssembly({
  isMobile,
  dnaState,
  onStateTransition,
  prefersReducedMotion,
}: BiomolecularAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const rungsRef = useRef<THREE.LineSegments>(null!);

  // Soft radial sprite — turns hard GL squares into feathered glowing orbs
  const glowTexture = useMemo(() => getGlowTexture(), []);

  // Assembly progress ref [0 = SCATTERED, 1 = ASSEMBLED]
  const progressRef = useRef(prefersReducedMotion ? 1 : 0);
  const stateRef = useRef(dnaState);

  useEffect(() => {
    stateRef.current = dnaState;
  }, [dnaState]);

  // Generate parametric DNA helix targets & scattered molecular coordinates
  const {
    targetPositions,
    scatteredPositions,
    colors,
    staggerDelays,
    targetRungs,
    scatteredRungs,
    rungColors,
    cloudPositions,
    totalCount,
    rungCount,
  } = useMemo(() => {
    const strandNodeCount = isMobile ? 80 : 180;
    const totalNodes = strandNodeCount * 2;
    const posTarget = new Float32Array(totalNodes * 3);
    const posScattered = new Float32Array(totalNodes * 3);
    const cols = new Float32Array(totalNodes * 3);
    const delays = new Float32Array(totalNodes);

    const colorEmerald = new THREE.Color('#10b981');
    const colorCyan = new THREE.Color('#06b6d4');
    const colorAmber = new THREE.Color('#f59e0b');

    const radius = isMobile ? 1.7 : 2.1;
    const height = 11.5;

    for (let i = 0; i < strandNodeCount; i++) {
      const t = (i / strandNodeCount) * Math.PI * 5; // 2.5 full organic turns
      const y = (i / strandNodeCount) * height - height / 2;

      // 1. Strand A Target
      const xA = Math.cos(t) * radius;
      const zA = Math.sin(t) * radius;
      const idxA = i * 6;

      posTarget[idxA] = xA;
      posTarget[idxA + 1] = y;
      posTarget[idxA + 2] = zA;

      // 1. Strand A Scattered Offset
      const angleA = pseudoRandom(i * 5 + 1) * Math.PI * 2;
      const distA = 4.5 + pseudoRandom(i * 5 + 2) * 3.5;
      posScattered[idxA] = Math.cos(angleA) * distA;
      posScattered[idxA + 1] = y + (pseudoRandom(i * 5 + 3) - 0.5) * 5.0;
      posScattered[idxA + 2] = Math.sin(angleA) * distA;

      // Staggered delay based on vertical height / index
      delays[i * 2] = (i / strandNodeCount) * 0.45;

      // 2. Strand B Target (Phase shifted by PI)
      const xB = Math.cos(t + Math.PI) * radius;
      const zB = Math.sin(t + Math.PI) * radius;
      const idxB = idxA + 3;

      posTarget[idxB] = xB;
      posTarget[idxB + 1] = y;
      posTarget[idxB + 2] = zB;

      // 2. Strand B Scattered Offset
      const angleB = pseudoRandom(i * 7 + 1) * Math.PI * 2;
      const distB = 4.5 + pseudoRandom(i * 7 + 2) * 3.5;
      posScattered[idxB] = Math.cos(angleB) * distB;
      posScattered[idxB + 1] = y + (pseudoRandom(i * 7 + 3) - 0.5) * 5.0;
      posScattered[idxB + 2] = Math.sin(angleB) * distB;

      delays[i * 2 + 1] = 0.15 + (i / strandNodeCount) * 0.45;

      // Color mapping along the strand
      const mixRatio = i / strandNodeCount;
      const cA = colorEmerald.clone().lerp(colorCyan, mixRatio);
      const cB = colorCyan.clone().lerp(colorAmber, mixRatio);

      cols[idxA] = cA.r;
      cols[idxA + 1] = cA.g;
      cols[idxA + 2] = cA.b;

      cols[idxB] = cB.r;
      cols[idxB + 1] = cB.g;
      cols[idxB + 2] = cB.b;
    }

    // Base pair connectors (rungs every 3 nodes)
    const rungPairs = Math.floor(strandNodeCount / 3);
    const rungsTarget = new Float32Array(rungPairs * 6);
    const rungsScattered = new Float32Array(rungPairs * 6);
    const rungsCols = new Float32Array(rungPairs * 6);

    for (let i = 0; i < rungPairs; i++) {
      const nodeIdx = i * 3;
      const t = (nodeIdx / strandNodeCount) * Math.PI * 5;
      const y = (nodeIdx / strandNodeCount) * height - height / 2;

      const xA = Math.cos(t) * radius;
      const zA = Math.sin(t) * radius;
      const xB = Math.cos(t + Math.PI) * radius;
      const zB = Math.sin(t + Math.PI) * radius;

      const rIdx = i * 6;
      rungsTarget[rIdx] = xA;
      rungsTarget[rIdx + 1] = y;
      rungsTarget[rIdx + 2] = zA;
      rungsTarget[rIdx + 3] = xB;
      rungsTarget[rIdx + 4] = y;
      rungsTarget[rIdx + 5] = zB;

      // Scattered rungs
      rungsScattered[rIdx] = xA * 2.2 + (pseudoRandom(i * 11) - 0.5) * 2.5;
      rungsScattered[rIdx + 1] = y + (pseudoRandom(i * 13) - 0.5) * 3.0;
      rungsScattered[rIdx + 2] = zA * 2.2 + (pseudoRandom(i * 17) - 0.5) * 2.5;

      rungsScattered[rIdx + 3] = xB * 2.2 + (pseudoRandom(i * 19) - 0.5) * 2.5;
      rungsScattered[rIdx + 4] = y + (pseudoRandom(i * 23) - 0.5) * 3.0;
      rungsScattered[rIdx + 5] = zB * 2.2 + (pseudoRandom(i * 29) - 0.5) * 2.5;

      // Emerald color for rungs
      rungsCols[rIdx] = colorEmerald.r;
      rungsCols[rIdx + 1] = colorEmerald.g;
      rungsCols[rIdx + 2] = colorEmerald.b;
      rungsCols[rIdx + 3] = colorEmerald.r;
      rungsCols[rIdx + 4] = colorEmerald.g;
      rungsCols[rIdx + 5] = colorEmerald.b;
    }

    // Ambient floating molecular background cloud (confined near DNA specimen)
    const cloudCount = isMobile ? 120 : 260;
    const cloud = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      cloud[i * 3] = (pseudoRandom(i * 3 + 1) - 0.5) * 10;
      cloud[i * 3 + 1] = (pseudoRandom(i * 3 + 2) - 0.5) * 10;
      cloud[i * 3 + 2] = (pseudoRandom(i * 3 + 3) - 0.5) * 8;
    }

    return {
      targetPositions: posTarget,
      scatteredPositions: posScattered,
      colors: cols,
      staggerDelays: delays,
      targetRungs: rungsTarget,
      scatteredRungs: rungsScattered,
      rungColors: rungsCols,
      cloudPositions: cloud,
      totalCount: totalNodes,
      rungCount: rungPairs * 2,
    };
  }, [isMobile]);

  // Dynamic interpolated position buffers
  const currentPositions = useMemo(() => new Float32Array(targetPositions.length), [targetPositions]);
  const currentRungs = useMemo(() => new Float32Array(targetRungs.length), [targetRungs]);

  // Pointer spring lerp target tracking
  const targetRotation = useRef({ x: 0, y: 0 });
  // Raw pointer in NDC [-1, 1] for particle repulsion, + active flag
  const pointerNDC = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.6;
      targetRotation.current = { x, y };

      pointerNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNDC.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerNDC.current.active = true;
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Main frame animation & state transition loop
  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current || !rungsRef.current) return;

    // Handle state transitions & assembly progress updates
    if (prefersReducedMotion) {
      progressRef.current = stateRef.current === 'SCATTERED' || stateRef.current === 'IDLE_SCATTERED' ? 0 : 1;
    } else {
      if (stateRef.current === 'ASSEMBLING') {
        // Assembly duration: ~2.2s
        progressRef.current = Math.min(progressRef.current + delta / 2.2, 1);
        if (progressRef.current >= 1) {
          onStateTransition('ASSEMBLED');
        }
      } else if (stateRef.current === 'DECONSTRUCTING') {
        // Deconstruction duration: ~1.4s
        progressRef.current = Math.max(progressRef.current - delta / 1.4, 0);
        if (progressRef.current <= 0) {
          onStateTransition('SCATTERED');
        }
      }
    }

    const p = progressRef.current;
    const elapsedTime = performance.now() * 0.001;

    // Project the cursor onto the DNA's local plane once per frame for repulsion
    let repelActive = false;
    if (pointerNDC.current.active && p > 0.35) {
      _pointerWorld.set(pointerNDC.current.x, pointerNDC.current.y, 0.5).unproject(state.camera);
      _pointerWorld.sub(state.camera.position);
      const dz = _pointerWorld.z;
      if (Math.abs(dz) > 1e-4) {
        const tHit = -state.camera.position.z / dz; // intersect the z = 0 plane
        _pointerWorld.multiplyScalar(tHit).add(state.camera.position);
        groupRef.current.worldToLocal(_pointerLocal.copy(_pointerWorld));
        repelActive = true;
      }
    }

    // 1. Interpolate Nucleotide Points
    const ptsGeo = pointsRef.current.geometry;
    const ptsAttr = ptsGeo.attributes.position;
    if (ptsAttr) {
      const ptsBuffer = ptsAttr.array as Float32Array;

      for (let i = 0; i < totalCount; i++) {
        const i3 = i * 3;
        const delay = staggerDelays[i] || 0;

        // Calculate particle-specific staggered assembly progress
        let particleProgress = 0;
        if (p > 0) {
          particleProgress = THREE.MathUtils.clamp((p - delay) / (1 - 0.45), 0, 1);
        }

        // Spring-like ease with a subtle settle overshoot into the lattice
        const easeP = easeOutBack(particleProgress);

        const targetX = targetPositions[i3];
        const targetY = targetPositions[i3 + 1];
        const targetZ = targetPositions[i3 + 2];

        const scatX = scatteredPositions[i3];
        const scatY = scatteredPositions[i3 + 1];
        const scatZ = scatteredPositions[i3 + 2];

        // Interpolate position
        let x = THREE.MathUtils.lerp(scatX, targetX, easeP);
        const y = THREE.MathUtils.lerp(scatY, targetY, easeP);
        let z = THREE.MathUtils.lerp(scatZ, targetZ, easeP);

        // Add gentle breathing wave displacement when assembled
        if (easeP > 0.8) {
          const wave = Math.sin(elapsedTime * 1.4 + y * 0.5) * 0.05 * easeP;
          x += wave;
          z += wave;
        }

        // Cursor repulsion — nucleotides near the pointer push outward
        let yRepel = 0;
        if (repelActive && easeP > 0.5) {
          const dx = x - _pointerLocal.x;
          const dy = y - _pointerLocal.y;
          const d2 = dx * dx + dy * dy;
          const R = 2.6;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1e-4;
            const f = 1 - d / R;
            const push = f * f * 1.7 * easeP;
            x += (dx / d) * push;
            yRepel = (dy / d) * push;
            z += (dx / d) * push * 0.3;
          }
        }

        ptsBuffer[i3] = x;
        ptsBuffer[i3 + 1] = y + yRepel;
        ptsBuffer[i3 + 2] = z;
      }
      ptsAttr.needsUpdate = true;
    }

    // 2. Interpolate Base Pair Rungs
    const rungsGeo = rungsRef.current.geometry;
    const rungsAttr = rungsGeo.attributes.position;
    if (rungsAttr) {
      const rungsBuffer = rungsAttr.array as Float32Array;

      // Base pairs appear in the second half of assembly
      const rungProgress = THREE.MathUtils.clamp((p - 0.3) / 0.7, 0, 1);
      const easeRung = 1 - Math.pow(1 - rungProgress, 3);

      for (let i = 0; i < rungCount * 3; i += 3) {
        const tX = targetRungs[i];
        const tY = targetRungs[i + 1];
        const tZ = targetRungs[i + 2];

        const sX = scatteredRungs[i];
        const sY = scatteredRungs[i + 1];
        const sZ = scatteredRungs[i + 2];

        rungsBuffer[i] = THREE.MathUtils.lerp(sX, tX, easeRung);
        rungsBuffer[i + 1] = THREE.MathUtils.lerp(sY, tY, easeRung);
        rungsBuffer[i + 2] = THREE.MathUtils.lerp(sZ, tZ, easeRung);
      }
      rungsAttr.needsUpdate = true;
    }

    // Organic idle rotation & spring cursor damping
    groupRef.current.rotation.y += delta * (0.1 + p * 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.y * 0.4,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetRotation.current.x * 0.25,
      0.05
    );
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.54 : 0.70} rotation={[0.18, 0.35, 0]}>
      {/* Primary Nucleotide Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          alphaMap={glowTexture}
          size={isMobile ? 0.44 : 0.58}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Base Pair Rung Lines */}
      <lineSegments ref={rungsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentRungs, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[rungColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#10b981"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Ambient Floating Molecular Cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cloudPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          alphaMap={glowTexture}
          size={0.14}
          color="#38bdf8"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

interface Hero3DCanvasProps {
  dnaState?: DNAState;
  onStateChange?: (newState: DNAState) => void;
  onToggleAssembly?: () => void;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  dnaState: externalState,
  onStateChange,
  onToggleAssembly,
}) => {
  const isMounted = useSyncExternalStore(subscribeClient, getClientSnapshot, getServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();

  // Internal state machine fallback if not controlled externally
  const [internalState, setInternalState] = useState<DNAState>(
    prefersReducedMotion ? 'ASSEMBLED' : 'IDLE_SCATTERED'
  );
  const currentState = externalState || internalState;

  const handleStateTransition = useCallback(
    (nextState: DNAState) => {
      if (onStateChange) {
        onStateChange(nextState);
      } else {
        setInternalState(nextState);
      }
    },
    [onStateChange]
  );

  // Auto-start assembly sequence on initial mount
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (currentState === 'IDLE_SCATTERED') {
      const timer = setTimeout(() => {
        handleStateTransition('ASSEMBLING');
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentState, handleStateTransition, prefersReducedMotion]);

  const handleCanvasClick = () => {
    if (onToggleAssembly) {
      onToggleAssembly();
    } else {
      if (currentState === 'ASSEMBLED' || currentState === 'ASSEMBLING') {
        handleStateTransition('DECONSTRUCTING');
      } else if (currentState === 'SCATTERED' || currentState === 'DECONSTRUCTING' || currentState === 'IDLE_SCATTERED') {
        handleStateTransition('ASSEMBLING');
      }
    }
  };

  if (!isMounted || prefersReducedMotion) {
    return (
      <div
        onClick={handleCanvasClick}
        className="w-full aspect-square lg:aspect-[4/5] flex items-center justify-center relative bg-radial from-emerald-500/10 via-transparent to-transparent rounded-2xl border border-white/8 overflow-hidden cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label="Interactive molecular DNA visualization. Click to toggle sequence assembly."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCanvasClick();
          }
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-cyan-500/5 to-transparent blur-2xl" />
        <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest z-10 border border-emerald-500/30 px-4 py-2 rounded-full bg-[#06080a]/80">
          [ 3D BIOMOLECULAR LATTICE // ACTIVE ]
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewRef}
      onClick={handleCanvasClick}
      className="w-full aspect-square lg:aspect-[4/5] relative rounded-2xl overflow-hidden cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label="Interactive molecular DNA visualization. Click or tap to deconstruct or assemble the sequence."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCanvasClick();
        }
      }}
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 11.5], fov: 48 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Depth fade — distant nucleotides dissolve into the background */}
        <fog attach="fog" args={['#06080a', 11, 25]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <BiomolecularAssembly
          isMobile={isMobile}
          dnaState={currentState}
          onStateTransition={handleStateTransition}
          prefersReducedMotion={prefersReducedMotion}
        />
        {/* Cinematic bloom — luminous glow around the glowing sprites */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={isMobile ? 0.7 : 1.1}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.75}
          />
        </EffectComposer>
      </Canvas>

      {/* Subtle Interactive Touch/Click Hint Overlay */}
      <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#06080a]/80 border border-white/12 text-[10px] font-mono text-[#8e959e] uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-all pointer-events-none z-10 backdrop-blur-md">
        [ CLICK / TAP TO {currentState === 'ASSEMBLED' || currentState === 'ASSEMBLING' ? 'DECONSTRUCT' : 'ASSEMBLE'} ]
      </div>
    </div>
  );
};
