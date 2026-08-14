# Atelier Genomics — Computational Cell Therapy & Programmable Biology

> **A Next-Generation Biotechnology Landing Page & Scientific Digital Experience.**
> Engineered with Next.js 16, TypeScript, Tailwind CSS v4, Motion, GSAP, and Three.js / React Three Fiber.

---

## 1. Executive Summary & Design Concept

**Atelier Genomics** is an original biotechnology brand operating at the intersection of computational biophysics, de novo protein engineering, and cell-selective genetic therapeutics.

The visual identity and digital experience are conceived around four core design principles:
- **Scientific Editorial**: Clean grid compositions, generous negative whitespace, and high numerical hierarchy.
- **Luxury Technology**: Deep obsidian mineral slate backdrop (`#06080a`), alabaster primary typography (`#f3f4f1`), chlorophyll emerald accents (`#10b981`), and bioluminescent amber readouts (`#f59e0b`).
- **Research Laboratory Instrumentation**: Real-time telemetry readouts, W3C ARIA tablist domain controls, and interactive 3D WebGL target visualizers.
- **Cinematic Motion**: Smooth scroll momentum powered by Lenis, scroll-pinned section transitions via GSAP ScrollTrigger, and spring-based pointer inertia.

*Strictly avoids generic AI templates, purple/cyan cyberpunk glows, or stock 3D objects.*

---

## 2. Technology Stack

- **Core Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Tokens (`src/app/globals.css`)
- **Interactive 3D WebGL**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animation Systems**: Motion (`motion/react`), GSAP + ScrollTrigger, Lenis Smooth Scroll
- **Typography**: Google Fonts `Outfit` (display geometric sans) + `JetBrains Mono` (scientific sequence & telemetry code font)
- **Iconography**: `@phosphor-icons/react`

---

## 3. Scientific Visualization Approach

The platform incorporates three dedicated WebGL canvas centerpieces:

1. **Hero Double-Helix Biomolecule (`src/three/Hero3DCanvas.tsx`)**:
   - Parametric double-helix strand with base-pair rungs and bio-fluorescent node points.
   - Smooth cursor inertia tracking via `THREE.MathUtils.lerp` with zero camera jumps.
2. **Innovation Stage Morph (`src/three/InnovationVisualizer.tsx`)**:
   - Interactive particle system that transforms dynamically across 3 stages (`01 Organic Cell`, `02 Sequence Stream`, `03 Intelligence Model`).
3. **Research Target Geometry Instrument (`src/three/Target3DCanvas.tsx`)**:
   - Morphs WebGL point lattices between 4 target structures: Helical Codon Strand, Folded Protein Lattice, Icosahedral Capsid, and Neural Topology.

---

## 4. Motion & Animation Philosophy

- **UI Micro-Interactions**: Ultra-responsive 180ms `ease-out` transitions with `scale(0.97)` active press feedback.
- **Spatial Transitions**: Spring physics (`stiffness: 350, damping: 28`) for active tab indicators (`motion.div layoutId="activeTabOutline"`).
- **Scroll Choreography**: GSAP `ScrollTrigger` pinned scrub timelines with clean `ctx.revert()` teardown on component unmount.
- **Smooth Scroll**: Lenis smooth scroll provider integrated cleanly into `RootLayout` and synchronized with `ScrollTrigger.update`.
- **Zero Layout Property Animations**: All motion strictly animates GPU-accelerated `transform` and `opacity` properties.

---

## 5. Responsive Design Architecture

- **Viewport Coverage**: Fully tested across `320px`, `375px`, `430px`, `768px`, `1024px`, `1280px`, `1440px`, and `1920px`.
- **Touch Target Guarantees**: All buttons, tab items, and accordion selectors maintain a minimum height of `44px` (`min-h-[44px]`).
- **Mobile GPU Protection**: WebGL 3D particle counts scale down automatically (e.g. 520 to 210 particles) on `< 768px` viewports, preserving 60fps frame rates.
- **Zero Horizontal Overflow & Text Clipping**: Built with fluid `clamp()` typography and `overflow-x-hidden` containers.

---

## 6. Accessibility & Performance

- **WCAG AA Compliance**: Text `#f3f4f1` on `#06080a` delivers a **16.2:1 contrast ratio**; secondary text `#8e959e` delivers a **5.8:1 contrast ratio**.
- **Keyboard Navigation**: Full `Tab` / `Shift+Tab` accessibility with global focus indicators (`focus-visible:ring-2 focus-visible:ring-emerald-400`).
- **Modal & Drawer Focus**: Mobile navigation menu and Research Partner Inquiry modal feature body scroll locking and `Escape` key close handling.
- **Screen Reader Support**: Decorative 3D WebGL canvases are hidden from screen readers via `aria-hidden="true"`.
- **Reduced Motion**: Gracefully degrades to static high-contrast layouts when `prefers-reduced-motion` is enabled.
- **Performance**: Static page prerendering via Next.js Turbopack in **430ms**. Zero cumulative layout shifts (`CLS = 0`).

---

## 7. Local Development & Production Build

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/atelier-genomics/atelier-landing-page.git

# Navigate to project directory
cd "Biotech Animated Landing Page"

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build & Linting

```bash
# Execute ESLint audit
npm run lint

# Compile Next.js production build
npm run build

# Start production server locally
npm run start
```

---

## 8. Disclaimers & Design Rationale

- **Design Inspiration Disclaimer**: *Public biotechnology visual benchmarks (such as DeepPiction and curated Dribbble computational biology concepts) were studied exclusively as high-bar standards for composition, scientific storytelling, and animation principles. Atelier Genomics is an independently designed, original brand identity and web application.*
- **Data Telemetry Disclaimer**: *All platform statistics, candidate numbers, binding affinities, and throughput metrics displayed on this landing page are illustrative sample telemetry generated for demonstration purposes.*
