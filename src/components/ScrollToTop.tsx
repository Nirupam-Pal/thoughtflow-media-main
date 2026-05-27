import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll when the route pathname changes.
 * Hash-only updates on the same path (e.g. /#contact) are left to page-level handlers.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prevent browser auto scroll-restoration from fighting our own behavior.
    // (Only needed on this app; safe to leave as manual.)
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const scrollEl = document.scrollingElement;

    const getScrollTop = () => scrollEl?.scrollTop ?? window.scrollY ?? 0;

    const goTop = (behavior: ScrollBehavior) => {
      scrollEl?.scrollTo({ top: 0, left: 0, behavior });
      window.scrollTo({ top: 0, left: 0, behavior });
    };

    // First, attempt a smooth reset (professional feel).
    goTop("smooth");

    // Then ensure we actually end up at the top (Lenis / other scroll handlers can race).
    requestAnimationFrame(() => {
      if (getScrollTop() > 1) goTop("auto");
    });

    requestAnimationFrame(() => {
      if (getScrollTop() > 1) goTop("auto");
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
