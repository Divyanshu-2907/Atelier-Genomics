'use client';

import React, { useRef, useMemo, useEffect, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/reduced-motion';
import { useInView } from '@/lib/useInView';
import { getGlowTexture } from './particleTexture';

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 91.733) * 43758.5453;
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

interface TargetCanvasProps {
  areaIndex: number;
}

function ResearchTargetMesh({ areaIndex, isMobile }: { areaIndex: number; isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null!);
  const targetArea = useRef(areaIndex);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  useEffect(() => {
    targetArea.current = areaIndex;
  }, [areaIndex]);

  // Generate vertex positions for the 4 research areas
  const { posGenomics, posCompBio, posTherapeutics, posIntel, colorArray } = useMemo(() => {
    const count = isMobile ? 280 : 560;
    const gen = new Float32Array(count * 3);
    const comp = new Float32Array(count * 3);
    const ther = new Float32Array(count * 3);
    const intel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const colorEmerald = new THREE.Color('#10b981');
    const colorCyan = new THREE.Color('#06b6d4');
    const colorAmber = new THREE.Color('#f59e0b');

    for (let i = 0; i < count; i++) {
      // 0. Genomics: Helical Strand + Codon Ring
      const t = (i / count) * Math.PI * 6;
      gen[i * 3] = Math.cos(t) * (1.8 + (i % 2) * 0.4);
      gen[i * 3 + 1] = (i / count) * 7 - 3.5;
      gen[i * 3 + 2] = Math.sin(t) * (1.8 + (i % 2) * 0.4);

      // 1. Computational Biology: Folded Macromolecular Lattice
      const phi = pseudoRandom(i * 3) * Math.PI * 2;
      const theta = pseudoRandom(i * 3 + 1) * Math.PI;
      const r = 2.2 + Math.sin(phi * 4) * 0.6;
      comp[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      comp[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      comp[i * 3 + 2] = r * Math.cos(theta);

      // 2. Therapeutic Discovery: Icosahedral Capsids with Receptors
      const capRadius = 2.4;
      const capU = pseudoRandom(i * 5);
      const capV = pseudoRandom(i * 5 + 1);
      const capTheta = capU * Math.PI * 2;
      const capPhi = Math.acos(2 * capV - 1);
      const spike = i % 5 === 0 ? 0.8 : 0;
      ther[i * 3] = (capRadius + spike) * Math.sin(capPhi) * Math.cos(capTheta);
      ther[i * 3 + 1] = (capRadius + spike) * Math.sin(capPhi) * Math.sin(capTheta);
      ther[i * 3 + 2] = (capRadius + spike) * Math.cos(capPhi);

      // 3. Biological Intelligence: Multi-layer Neural Topology
      const layer = i % 5;
      intel[i * 3] = (layer - 2) * 1.8;
      intel[i * 3 + 1] = (pseudoRandom(i * 13) - 0.5) * 5.5;
      intel[i * 3 + 2] = (pseudoRandom(i * 17) - 0.5) * 3.5;

      // Color assign
      const col = i % 3 === 0 ? colorEmerald : i % 3 === 1 ? colorCyan : colorAmber;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    return {
      posGenomics: gen,
      posCompBio: comp,
      posTherapeutics: ther,
      posIntel: intel,
      colorArray: cols,
    };
  }, [isMobile]);

  const currentPos = useMemo(() => new Float32Array(posGenomics.length), [posGenomics]);
  const currentArea = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    currentArea.current = THREE.MathUtils.lerp(currentArea.current, targetArea.current, delta * 3.5);
    const a = currentArea.current;

    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    const posBuffer = posAttr.array as Float32Array;

    for (let i = 0; i < currentPos.length; i += 3) {
      let x = 0, y = 0, z = 0;

      if (a <= 1) {
        const t = a;
        x = THREE.MathUtils.lerp(posGenomics[i], posCompBio[i], t);
        y = THREE.MathUtils.lerp(posGenomics[i + 1], posCompBio[i + 1], t);
        z = THREE.MathUtils.lerp(posGenomics[i + 2], posCompBio[i + 2], t);
      } else if (a <= 2) {
        const t = a - 1;
        x = THREE.MathUtils.lerp(posCompBio[i], posTherapeutics[i], t);
        y = THREE.MathUtils.lerp(posCompBio[i + 1], posTherapeutics[i + 1], t);
        z = THREE.MathUtils.lerp(posCompBio[i + 2], posTherapeutics[i + 2], t);
      } else {
        const t = Math.min(a - 2, 1);
        x = THREE.MathUtils.lerp(posTherapeutics[i], posIntel[i], t);
        y = THREE.MathUtils.lerp(posTherapeutics[i + 1], posIntel[i + 1], t);
        z = THREE.MathUtils.lerp(posTherapeutics[i + 2], posIntel[i + 2], t);
      }

      const elapsedTime = performance.now() * 0.001;
      const pulse = Math.sin(elapsedTime * 2 + i * 0.1) * 0.05;

      posBuffer[i] = x + pulse;
      posBuffer[i + 1] = y + pulse;
      posBuffer[i + 2] = z;
    }

    posAttr.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={glowTexture}
        alphaMap={glowTexture}
        size={isMobile ? 0.24 : 0.30}
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export const Target3DCanvas: React.FC<TargetCanvasProps> = ({ areaIndex }) => {
  const isMounted = useSyncExternalStore(subscribeClient, getClientSnapshot, getServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();

  if (!isMounted || prefersReducedMotion) {
    const areaNames = ['[ 01 // GENOMICS ALIGNMENT ]', '[ 02 // PROTEIN FOLDING ]', '[ 03 // CAPSID ENGINEERING ]', '[ 04 // NEURAL AFFINITY ]'];
    return (
      <div className="w-full h-full min-h-[320px] lg:min-h-[420px] flex items-center justify-center relative bg-radial from-emerald-500/10 via-transparent to-transparent rounded-2xl border border-white/8">
        <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/30 bg-[#06080a]">
          {areaNames[areaIndex] || areaNames[0]}
        </div>
      </div>
    );
  }

  return (
    <div ref={viewRef} className="w-full aspect-square sm:aspect-[4/3] relative rounded-2xl overflow-hidden" aria-hidden="true">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 7.5], fov: 46 }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#06080a', 7.5, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <group scale={isMobile ? 0.52 : 0.62}>
          <ResearchTargetMesh areaIndex={areaIndex} isMobile={isMobile} />
        </group>
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={isMobile ? 0.65 : 1.0}
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
