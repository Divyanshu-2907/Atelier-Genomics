<div align="center">

# Atelier Genomics

### Computational Cell Therapy & Programmable Biology — an animation-driven biotech landing page

*Engineering biology for what comes next.*

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Three.js / React Three Fiber · GSAP · Lenis

**🌐 Live demo:** **[atelier-genomics.vercel.app](https://atelier-genomics.vercel.app/)**

</div>

---

## Table of Contents

- [Atelier Genomics](#atelier-genomics)
    - [Computational Cell Therapy \& Programmable Biology — an animation-driven biotech landing page](#computational-cell-therapy--programmable-biology--an-animation-driven-biotech-landing-page)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Design Concept](#2-design-concept)
  - [3. Feature Highlights](#3-feature-highlights)
  - [4. Animation \& Interaction Approach](#4-animation--interaction-approach)
    - [The intro sequence — `src/components/intro/IntroSequence.tsx`](#the-intro-sequence--srccomponentsintrointrosequencetsx)
    - [3D visualization — React Three Fiber + Three.js](#3d-visualization--react-three-fiber--threejs)
    - [Micro-interactions](#micro-interactions)
  - [5. Performance Strategy](#5-performance-strategy)
  - [6. Accessibility](#6-accessibility)
  - [7. Tech Stack](#7-tech-stack)
  - [8. Project Structure](#8-project-structure)
  - [9. Getting Started](#9-getting-started)
    - [Prerequisites](#prerequisites)
    - [Install \& run](#install--run)
    - [Scripts](#scripts)
  - [10. Disclaimers](#10-disclaimers)

---

## 1. Overview

**Atelier Genomics** is an original, fictional biotechnology brand operating at the intersection of computational biophysics, de novo protein engineering, and cell-selective genetic therapeutics. This project is a premium, single-page marketing experience built to feel like a real-world biotech company site — not a template.

The page is composed of seven scroll sections, each a self-contained React component:

| # | Section | Purpose |
|---|---------|---------|
| 01 | **Hero** | Headline, dual CTAs, live telemetry, interactive 3D DNA |
| 02 | **Innovation** | The discovery-to-synthesis narrative + 3-stage particle morph |
| 03 | **Research & Platform** | Four research pillars, each with a morphing 3D instrument |
| 04 | **Capabilities** | Service/capability breakdown |
| 05 | **Impact & Telemetry** | Statistics and measured outcomes |
| 06 | **Final CTA** | Collaboration call-to-action |
| — | **Footer** | Navigation + brand |

On top of the page sits a **cinematic intro sequence** and a **custom lab-instrument cursor** that establish the identity the moment a visitor arrives.

---

## 2. Design Concept

The visual identity is built on four principles, deliberately avoiding generic AI-template aesthetics (no purple/cyan cyberpunk glow, no stock 3D objects):

- **Scientific editorial** — clean grid compositions, generous negative space, strong numerical hierarchy, and monospace telemetry readouts.
- **Luxury technology** — a deep obsidian backdrop (`#06080a`), alabaster type (`#f3f4f1`), chlorophyll-emerald accents (`#10b981`), and bioluminescent amber (`#f59e0b`).
- **Laboratory instrumentation** — corner reticles, crosshair framing, ARIA tablist domain controls, and "live" status badges that react to the 3D state.
- **Cinematic motion** — momentum smooth-scroll, scroll-pinned transitions, spring-based pointer inertia, and a WebGL centerpiece in every major section.

**Typography:** `Outfit` (geometric display sans) for headlines and body, `JetBrains Mono` for all scientific / telemetry text.

---

## 3. Feature Highlights

- **Cinematic intro sequence** — on first visit, a DNA helix assembles and spins up, then detonates: particles blast past the camera, a shockwave sweeps the screen, and the page beneath takes a brief shake + color-glitch "impact" before settling into the normal layout. Plays once per session; fully skippable.
- **Three interactive WebGL centerpieces** — a double-helix, a 3-stage morphing particle field, and a 4-target morphing lattice, all rendered with soft glow sprites and a selective **bloom** post-process pass.
- **Cursor-reactive Hero DNA** — nucleotides physically repel away from the pointer (the cursor is projected onto the helix plane each frame).
- **Custom reticle cursor** — a crosshair that trails the pointer with spring damping and "locks on" over interactive elements.
- **Magnetic buttons** — the hero CTAs pull toward the cursor and spring back.
- **Smooth momentum scroll** with scroll-driven section choreography.
- **Fully responsive** across mobile, tablet, and desktop, with automatic quality scaling on smaller devices.
- **Reduced-motion aware** end to end — every animated system degrades to a calm, static experience.

---

## 4. Animation & Interaction Approach

The motion design is layered so that no single technology is overused — each is chosen for what it does best.

### The intro sequence — [`src/components/intro/IntroSequence.tsx`](src/components/intro/IntroSequence.tsx)
A three-phase state machine driven off a single render-clock:
1. **Assemble** — particles interpolate from a scattered shell into a double helix with per-particle stagger delays, while the camera dollies in and a diegetic `SEQUENCING GENOME · NN%` readout counts up.
2. **Charge** — the fully-formed helix spins up ("round and round").
3. **Detonate** — particles lerp to far radial burst targets with an `easeOutExpo` curve (biased toward the viewer so they fly *past* the camera); simultaneously a GSAP timeline fires the flash, shockwave ring, overlay fade, and a keyframed shake + CSS color-glitch on the page content.

Scroll is locked during the intro and released on completion — "then it scrolls, and it's normal."

### 3D visualization — React Three Fiber + Three.js
All three canvases share a **morph-target** technique: positions are precomputed for each target shape, and a single point buffer is interpolated between them every frame in `useFrame`. A shared, canvas-generated **radial-gradient sprite** (`src/three/particleTexture.ts`) turns hard GL points into soft glowing orbs, and a **selective bloom** pass (`@react-three/postprocessing`) provides the luminous, cinematic quality. Depth fog fades distant particles for volume, and the Hero assembly uses a gentle `easeOutBack` overshoot so nucleotides *settle* into the lattice.

### Micro-interactions
- **Custom cursor** ([`ReticleCursor.tsx`](src/components/shared/ReticleCursor.tsx)) and **magnetic buttons** ([`Magnetic.tsx`](src/components/shared/Magnetic.tsx)) run on `requestAnimationFrame` / GSAP `quickTo` and only activate on fine-pointer (desktop) devices.
- **Scroll choreography** — GSAP `ScrollTrigger` pinned/scrubbed timelines with clean `ctx.revert()` teardown, synchronized to **Lenis** smooth scroll.
- **Spatial UI** — spring-physics tab indicators via Motion (`layoutId`).
- All motion animates only GPU-friendly `transform` and `opacity`.

---

## 5. Performance Strategy

Running multiple WebGL contexts with post-processing is expensive, so the render budget is actively managed:

- **Off-screen canvases pause completely** — an `IntersectionObserver` hook (`src/lib/useInView.ts`) toggles each canvas's R3F `frameloop` between `always` and `never`, so only the canvas actually on screen consumes GPU/CPU. Canvases mount running (first frame guaranteed) and pause once scrolled away.
- **Capped device pixel ratio** — DPR is limited to `1.5` desktop / `1.25` mobile, so the fullscreen bloom pass doesn't process 4× the pixels on high-DPI displays.
- **No MSAA on the composers** — the soft sprites don't need hardware anti-aliasing.
- **Mobile quality scaling** — particle counts drop automatically below `768px`.
- **Static generation** — the whole page is prerendered (SSG) via Next.js + Turbopack; no runtime server work, no layout shift.

---

## 6. Accessibility

- **Reduced motion** — `prefers-reduced-motion` disables the intro, the custom cursor, magnetic effects, smooth scroll, and freezes the 3D scenes into static states.
- **Keyboard** — full `Tab` / `Shift+Tab` navigation with visible `:focus-visible` rings; the intro is dismissible via `Enter` / `Space` / `Escape`.
- **Screen readers** — decorative WebGL canvases are `aria-hidden`; interactive canvases expose descriptive `aria-label`s and roles.
- **Contrast** — primary text `#f3f4f1` on `#06080a` (~16:1); secondary `#8e959e` clears WCAG AA.
- **Touch targets** — interactive controls maintain a comfortable minimum hit area; the custom cursor never appears on touch devices.

---

## 7. Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 · CSS custom-property tokens |
| 3D / WebGL | Three.js · `@react-three/fiber` · `@react-three/drei` · `@react-three/postprocessing` |
| Animation | GSAP + ScrollTrigger · Motion · Lenis (smooth scroll) |
| Fonts | Outfit · JetBrains Mono (`next/font`) |
| Icons | `@phosphor-icons/react` |
| Utilities | `clsx` · `tailwind-merge` |

---

## 8. Project Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, IntroSequence, ReticleCursor, SmoothScroll
│   ├── page.tsx            # Section composition
│   └── globals.css         # Tokens, intro/cursor CSS, reduced-motion rules
├── components/
│   ├── intro/              # IntroSequence — cinematic loader
│   ├── hero/ innovation/ research/ capabilities/ impact/ cta/
│   ├── navigation/         # Navbar
│   └── shared/             # Button, Magnetic, ReticleCursor, ReticleContainer,
│                           #   SmoothScroll, ScientificLabel, DataMetric, Footer …
├── three/
│   ├── Hero3DCanvas.tsx        # Double-helix + cursor repulsion
│   ├── InnovationVisualizer.tsx # 3-stage particle morph
│   ├── Target3DCanvas.tsx       # 4-target research morph
│   └── particleTexture.ts       # Shared glow sprite + easing
└── lib/
    ├── useInView.ts        # Off-screen canvas pausing
    └── reduced-motion.ts   # prefers-reduced-motion hook
```

---

## 9. Getting Started

### Prerequisites
- **Node.js 18.18+** (Node 20 LTS recommended)
- **npm 9+**

### Install & run

```bash
# Clone
git clone https://github.com/Divyanshu-2907/Atelier-Genomics.git
cd Atelier-Genomics

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:3000**.

> **Tip:** the intro plays once per browser session. To replay it during development, run
> `sessionStorage.removeItem('ag-intro-played')` in the console and refresh (or use an incognito window).

### Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint
```

---

## 10. Disclaimers

- **Original work.** Public biotech design benchmarks (e.g. DeepPiction and curated Dribbble concepts) were studied only as bars for composition and motion quality. Atelier Genomics is an independently designed, original brand and application — not a copy of any reference.
- **Illustrative data.** All statistics, candidate counts, binding affinities, and throughput figures shown are sample telemetry for demonstration purposes only. Atelier Genomics is a fictional company.

<div align="center">

---

Built with care for the Round 1 — Creative Frontend Developer assignment.

</div>
