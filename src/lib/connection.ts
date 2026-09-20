import { useSyncExternalStore } from "react";

/** The (Chromium-only) Network Information API. Safari/Firefox don't expose it → treated as "not slow". */
interface NetworkInformation extends EventTarget {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

const connection = (): NetworkInformation | undefined =>
  typeof navigator === "undefined" ? undefined : (navigator as Navigator & { connection?: NetworkInformation }).connection;

/**
 * True when the visitor is on a slow link or has asked their browser to save data.
 * "3g" is included on purpose: that's ~0.7–1.7 Mbps, where a 100 KB image takes a second or more.
 */
export function isSlowConnection(): boolean {
  const c = connection();
  if (!c) return false;
  return !!c.saveData || c.effectiveType === "slow-2g" || c.effectiveType === "2g" || c.effectiveType === "3g";
}

/**
 * Reactive version, built on useSyncExternalStore so the value is correct on the FIRST client
 * render. (An effect-then-setState version starts as "not slow", and on a slow link the browser
 * has already begun downloading the big images by the time it flips.) During hydration of
 * prerendered HTML React uses the server value (false) first, then re-renders — no mismatch.
 */
export function useSlowConnection(): boolean {
  return useSyncExternalStore(subscribe, isSlowConnection, () => false);
}

function subscribe(onChange: () => void) {
  const c = connection();
  c?.addEventListener("change", onChange);
  return () => c?.removeEventListener("change", onChange);
}
