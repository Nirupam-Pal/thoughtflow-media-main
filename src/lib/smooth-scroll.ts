import Lenis from "lenis";
import { cancelFrame, frame } from "framer-motion";

/**
 * One Lenis instance for the whole app, driven by Framer Motion's frame loop.
 *
 * Why this matters for smoothness:
 * - Lenis and Framer's `useScroll` now update in the SAME frame, so scroll-linked
 *   transforms never lag the scroll position by a frame.
 * - There is exactly one requestAnimationFrame loop instead of two.
 * - Anchor links (#contact…) and programmatic jumps go through Lenis, so they use
 *   the same easing instead of the browser's competing smooth-scroll.
 */
let lenis: Lenis | null = null;

export const getLenis = () => lenis;

export function startSmoothScroll(): () => void {
  if (typeof window === "undefined" || lenis) return () => {};
  // Visitors who ask for reduced motion keep native scrolling.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const instance = new Lenis({ anchors: true });
  lenis = instance;

  const update = ({ timestamp }: { timestamp: number }) => instance.raf(timestamp);
  frame.update(update, true);

  return () => {
    cancelFrame(update);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

/** Smooth-scroll to an element or selector, via Lenis when it's running. */
export function scrollToTarget(target: string | Element | null): boolean {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return false;
  if (lenis) lenis.scrollTo(el as HTMLElement);
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}
