/**
 * Atelier Genomics — Central Motion Tokens
 * Engineered following Emil Kowalski's design engineering principles.
 */

export const motionDurations = {
  instant: 0,
  micro: 0.125,     // 125ms (tooltips, micro toggles)
  fast: 0.18,       // 180ms (button press feedback, dropdowns)
  normal: 0.25,     // 250ms (card reveals, tab morphs)
  gentle: 0.4,      // 400ms (drawers, modals)
  cinematic: 0.7,   // 700ms (hero entrance, story transition)
} as const;

export const motionEasings = {
  // Strong ease-out curve for instant responsive feedback
  easeOut: [0.23, 1, 0.32, 1] as const,
  // Strong ease-in-out curve for morphing/spatial movement
  easeInOut: [0.77, 0, 0.175, 1] as const,
  // Snappy spring config for press feedback scale(0.97)
  springTactile: { type: 'spring', stiffness: 400, damping: 25 } as const,
  // Smooth natural spring for modal/drawer entry
  springSmooth: { type: 'spring', stiffness: 180, damping: 20 } as const,
  // Airy gentle spring for scroll/3D sync
  springAiry: { type: 'spring', stiffness: 90, damping: 15 } as const,
} as const;

/**
 * Standard reusable Framer Motion / Motion variants
 */
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.normal,
      ease: motionEasings.easeOut,
    },
  },
};

export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionDurations.normal,
      ease: motionEasings.easeOut,
    },
  },
};

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionDurations.fast,
      ease: motionEasings.easeOut,
    },
  },
};

export const staggerContainer = (staggerDelay = 0.06, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});
