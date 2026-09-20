import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Shared easing — a soft expo-out that feels "buttery" for reveals. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Margin that fires reveals slightly before an element is fully on-screen. */
export const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * True only on devices with a real hover pointer (desktop / laptop).
 * Tilt, spotlight and magnetic effects are gated on this so touch devices
 * never pay for pointer math they can't use.
 */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

/** Fine pointer AND the visitor hasn't asked for reduced motion. */
export function useInteractiveMotion(): boolean {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  return fine && !reduced;
}
