/**
 * Atelier Genomics — Original Biotech Design System Tokens
 * Palette: Mineral Dark Base + Warm Off-White Type + Muted Stone + Chlorophyll Emerald + Bioluminescent Amber
 */

export const colors = {
  bg: {
    base: '#06080a',          // Mineral Dark Base
    surface: '#0b0f14',       // Mineral Surface
    elevated: '#11161d',      // Elevated Card Tile
    hover: '#161e27',         // Interactive Hover Surface
    overlay: '#1a222e',       // Modal / Drawer Backdrop
  },
  text: {
    primary: '#f3f4f1',       // Warm Off-White (Alabaster)
    secondary: '#8e959e',     // Muted Stone Quartz
    tertiary: '#5b626c',      // Dark Mineral Subtext
    inverse: '#06080a',        // Dark text on bright CTAs
  },
  accent: {
    emerald: '#10b981',       // Chlorophyll Emerald Primary Accent
    emeraldBright: '#34d399',
    emeraldSubtle: 'rgba(16, 185, 129, 0.12)',
    amber: '#f59e0b',         // Bioluminescent Amber Secondary Accent
    amberBright: '#fbbf24',
    amberSubtle: 'rgba(245, 158, 11, 0.12)',
  },
  border: {
    hairline: 'rgba(243, 244, 241, 0.08)',
    medium: 'rgba(243, 244, 241, 0.16)',
    emerald: 'rgba(16, 185, 129, 0.35)',
    amber: 'rgba(245, 158, 11, 0.35)',
  },
} as const;

export const typography = {
  fonts: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  scale: {
    displayHero: 'clamp(2.75rem, 5.5vw + 1rem, 5.25rem)',
    h1: 'clamp(2.25rem, 4vw + 0.5rem, 3.75rem)',
    h2: 'clamp(1.75rem, 3vw + 0.5rem, 2.75rem)',
    h3: 'clamp(1.25rem, 2vw + 0.25rem, 1.875rem)',
    bodyLarge: '1.125rem',
    body: '1rem',
    small: '0.875rem',
    monoMeta: '0.75rem',
  },
} as const;

export const radii = {
  none: '0px',
  sm: '6px',
  md: '12px',
  lg: '18px',
  pill: '9999px',
} as const;

export const shadows = {
  emeraldGlow: '0 0 40px -8px rgba(16, 185, 129, 0.25)',
  amberGlow: '0 0 40px -8px rgba(245, 158, 11, 0.25)',
  elevatedCard: '0 24px 60px -12px rgba(0, 0, 0, 0.75)',
  insetRefraction: 'inset 0 1px 0 0 rgba(243, 244, 241, 0.1)',
} as const;

export const zIndex = {
  base: 0,
  canvas: 1,
  content: 10,
  header: 40,
  drawer: 50,
  modal: 60,
  tooltip: 70,
} as const;
