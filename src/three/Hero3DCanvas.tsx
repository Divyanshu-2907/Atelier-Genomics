'use client';

import React, { useRef, useMemo, useEffect, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';

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
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
function getMobileSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Double-Helix & Cellular Node Lattice Component
 */
function BiomolecularLattice({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const rungsRef = useRef<THREE.LineSegments>(null!);

  // Generate helical backbone & base pair rung coordinates
  const { positions, colors, rungPositions } = useMemo(() => {
    const count = isMobile ? 60 : 120;
    const pos = new Float32Array(count * 2 * 3);
    const cols = new Float32Array(count * 2 * 3);
    const rungs = new Float32Array(count * 2 * 3);

    const colorEmerald = new THREE.Color('#10b981');
    const colorCyan = new THREE.Color('#06b6d4');
    const colorAmber = new THREE.Color('#f59e0b');

    const radius = 1.8;
    const height = 9.0;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4; // 2 full turns
      const y = (i / count) * height - height / 2;

      // Strand A
      const xA = Math.cos(t) * radius;
      const zA = Math.sin(t) * radius;
      const idxA = i * 6;

      pos[idxA] = xA;
      pos[idxA + 1] = y;
      pos[idxA + 2] = zA;

      // Strand B
      const xB = Math.cos(t + Math.PI) * radius;
      const zB = Math.sin(t + Math.PI) * radius;
      const idxB = idxA + 3;

      pos[idxB] = xB;
      pos[idxB + 1] = y;
      pos[idxB + 2] = zB;

      // Color mapping along the strand
      const mixRatio = i / count;
      const cA = colorEmerald.clone().lerp(colorCyan, mixRatio);
      const cB = colorCyan.clone().lerp(colorAmber, mixRatio);

      cols[idxA] = cA.r;
      cols[idxA + 1] = cA.g;
      cols[idxA + 2] = cA.b;

      cols[idxB] = cB.r;
      cols[idxB + 1] = cB.g;
      cols[idxB + 2] = cB.b;

      // Base pair connector line (rung) every 3 nodes
      if (i % 3 === 0) {
        const rungIdx = (i / 3) * 6;
        rungs[rungIdx] = xA;
        rungs[rungIdx + 1] = y;
        rungs[rungIdx + 2] = zA;

        rungs[rungIdx + 3] = xB;
        rungs[rungIdx + 4] = y;
        rungs[rungIdx + 5] = zB;
      }
    }

    return {
      positions: pos,
      colors: cols,
      rungPositions: rungs.subarray(0, Math.floor(count / 3) * 6),
    };
  }, [isMobile]);

  // Floating background node cloud using pure deterministic pseudoRandom
  const cloudPositions = useMemo(() => {
    const cloudCount = isMobile ? 150 : 400;
    const pos = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      pos[i * 3] = (pseudoRandom(i * 3 + 1) - 0.5) * 16;
      pos[i * 3 + 1] = (pseudoRandom(i * 3 + 2) - 0.5) * 16;
      pos[i * 3 + 2] = (pseudoRandom(i * 3 + 3) - 0.5) * 16;
    }
    return pos;
  }, [isMobile]);

  // Pointer spring lerp target tracking
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.6;
      targetRotation.current = { x, y };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Frame animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Organic rotation
    groupRef.current.rotation.y += delta * 0.15;

    // Smooth spring lerp inertia on cursor move
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.y * 0.5,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetRotation.current.x * 0.3,
      0.05
    );
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0.4, 0]}>
      {/* Primary Nucleotide Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.12 : 0.16}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Base Pair Rung Lines */}
      <lineSegments ref={rungsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[rungPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#10b981"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Floating Cellular Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cloudPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export const Hero3DCanvas: React.FC = () => {
  const isMounted = useSyncExternalStore(subscribeClient, getClientSnapshot, getServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isMounted || prefersReducedMotion) {
    // Static fallback for SSR & reduced motion
    return (
      <div className="w-full h-full min-h-[380px] lg:min-h-[500px] flex items-center justify-center relative bg-radial from-emerald-500/10 via-transparent to-transparent rounded-2xl border border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-cyan-500/5 to-transparent blur-2xl" />
        <div className="font-mono text-xs text-emerald-400/80 uppercase tracking-widest z-10 border border-emerald-500/30 px-4 py-2 rounded-full bg-[#06080a]/80">
          [ 3D BIOMOLECULAR LATTICE // ACTIVE ]
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[550px] relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <BiomolecularLattice isMobile={isMobile} />
      </Canvas>
    </div>
  );
};
