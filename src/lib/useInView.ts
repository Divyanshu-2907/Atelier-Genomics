'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { subscribeIntroActive, getIntroActive, getIntroActiveServer } from './introActive';

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

  // While the cinematic intro runs, force every canvas to keep rendering so the
  // auto-scroll journey never reveals a paused/blank canvas.
  const introActive = useSyncExternalStore(subscribeIntroActive, getIntroActive, getIntroActiveServer);

  return { ref, inView: introActive || inView } as const;
}
