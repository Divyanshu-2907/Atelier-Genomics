'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element is within (or near) the viewport. Used to pause
 * expensive WebGL canvases while they're scrolled off-screen — the render loop
 * is only kept alive for the canvas the user can actually see.
 *
 * `rootMargin` pre-warms the canvas slightly before it enters view so there's
 * no visible pop-in.
 */
export function useInView<T extends HTMLElement>(rootMargin = '250px') {
  const ref = useRef<T>(null);
  // Start true so the canvas mounts with its render loop registered and paints
  // a first frame; the observer then pauses it only once it scrolls out of view.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView } as const;
}
