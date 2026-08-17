'use client';

import React, { useRef, useMemo, useEffect, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { useInView } from '@/lib/useInView';
import { getGlowTexture } from './particleTexture';

// Pure deterministic random generator
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 45.123) * 43758.5453;
  return x - Math.floor(x);
}

function subscribeClient(callback: () => void) {
  return () => callback();
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

function subscribeMobile(callback: () => void) {
  if (typeof window === 'undefined') return () => { };
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
function getMobileSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

interface VisualizerProps {
  stage: number; // 0: Biology, 1: Data, 2: Intelligence
}

function EvolutionMesh({ stage, isMobile }: { stage: number; isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null!);
  const targetMorph = useRef(stage);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  useEffect(() => {
    targetMorph.current = stage;
  }, [stage]);

  // Generate particle positions for 3 states: Sphere (Biology), Grid (Data), Network (Intelligence)
  const { posBiology, posData, posIntelligence, colorArray } = useMemo(() => {
    const count = isMobile ? 300 : 800;
    const bio = new Float32Array(count * 3);
    const dat = new Float32Array(count * 3);
    const intel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const colorEmer = new THREE.Color('#10b981');
    const colorCyan = new THREE.Color('#06b6d4');
    const colorAmb = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      // 1. Organic Sphere (Biology)
      const u = pseudoRandom(i * 3);
      const v = pseudoRandom(i * 3 + 1);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 2.2 + pseudoRandom(i * 3 + 2) * 0.4;

      bio[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bio[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bio[i * 3 + 2] = r * Math.cos(phi);

      // 2. Data Grid (Data Stream)
      const colsCount = Math.floor(Math.sqrt(count));
      const row = Math.floor(i / colsCount);
      const col = i % colsCount;

      dat[i * 3] = (col / colsCount - 0.5) * 6;
      dat[i * 3 + 1] = (row / colsCount - 0.5) * 6;
      dat[i * 3 + 2] = Math.sin(i * 0.2) * 0.8;

      // 3. Neural Network (Intelligence)
      const layer = i % 4;
      intel[i * 3] = (layer - 1.5) * 2.2;
      intel[i * 3 + 1] = (pseudoRandom(i * 7) - 0.5) * 5;
      intel[i * 3 + 2] = (pseudoRandom(i * 11) - 0.5) * 3;

      // Base colors
      const c = i % 3 === 0 ? colorEmer : i % 3 === 1 ? colorCyan : colorAmb;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return {
      posBiology: bio,
      posData: dat,
      posIntelligence: intel,
      colorArray: cols,
    };
  }, [isMobile]);

  // Current interpolated positions
  const currentPositions = useMemo(() => new Float32Array(posBiology.length), [posBiology]);

  const currentMorph = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly lerp morph stage value
    currentMorph.current = THREE.MathUtils.lerp(currentMorph.current, targetMorph.current, delta * 3);
    const m = currentMorph.current;

    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    const posBuffer = posAttr.array as Float32Array;

    for (let i = 0; i < currentPositions.length; i += 3) {
      let x = 0, y = 0, z = 0;

      if (m <= 1) {
        // Interpolate Biology (0) -> Data (1)
        const t = m;
        x = THREE.MathUtils.lerp(posBiology[i], posData[i], t);
        y = THREE.MathUtils.lerp(posBiology[i + 1], posData[i + 1], t);
        z = THREE.MathUtils.lerp(posBiology[i + 2], posData[i + 2], t);
      } else {
        // Interpolate Data (1) -> Intelligence (2)
        const t = m - 1;
        x = THREE.MathUtils.lerp(posData[i], posIntelligence[i], t);
        y = THREE.MathUtils.lerp(posData[i + 1], posIntelligence[i + 1], t);
        z = THREE.MathUtils.lerp(posData[i + 2], posIntelligence[i + 2], t);
      }

      // Add gentle organic wave displacement
      const elapsedTime = performance.now() * 0.001;
      const wave = Math.sin(elapsedTime * 1.5 + i) * 0.08;

      posBuffer[i] = x + wave;
      posBuffer[i + 1] = y + wave;
      posBuffer[i + 2] = z;
    }

    posAttr.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={glowTexture}
        alphaMap={glowTexture}
        size={isMobile ? 0.20 : 0.26}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export const InnovationVisualizer: React.FC<VisualizerProps> = ({ stage }) => {
  const isMounted = useSyncExternalStore(subscribeClient, getClientSnapshot, getServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();

  if (!isMounted || prefersReducedMotion) {
    const stageLabels = ['[ 01 // ORGANIC CELLULAR MESH ]', '[ 02 // SEQUENCE DATA STREAM ]', '[ 03 // INTELLIGENCE MODEL ]'];
    return (
      <div className="w-full h-[300px] lg:h-[360px] min-h-[300px] flex items-center justify-center relative bg-radial from-cyan-500/10 via-transparent to-transparent rounded-2xl border border-white/8">
        <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest px-4 py-2 rounded-full border border-cyan-500/30 bg-[#06080a]">
          {stageLabels[stage] || stageLabels[0]}
        </div>
      </div>
    );
  }

  return (
    <div ref={viewRef} className="w-full h-[300px] lg:h-[360px] min-h-[300px] relative rounded-2xl overflow-hidden" aria-hidden="true">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 5.8], fov: 48 }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#06080a', 6, 13]} />
        <ambientLight intensity={0.5} />
        <group scale={isMobile ? 0.62 : 0.72}>
          <EvolutionMesh stage={stage} isMobile={isMobile} />
        </group>
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={isMobile ? 0.6 : 0.95}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.72}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
