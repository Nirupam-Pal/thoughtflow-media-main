import { Children, createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE, REVEAL_VIEWPORT } from "@/lib/motion";

/**
 * Scroll reveal. Animates transform + opacity only, so it can never cause
 * layout shift: the element keeps its full box while hidden.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger's in-view state and each item's delay. Items read it directly instead of inheriting a
 * variant label from the parent, which could leave a whole group stuck at opacity 0.
 */
const StaggerContext = createContext<{ shown: boolean; delay: number }>({ shown: true, delay: 0 });

/** One observer for the whole group; children reveal in sequence. */
export function Stagger({
  children,
  className,
  gap = 0.09,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const shown = Boolean(reduced) || inView;

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <StaggerContext.Provider value={{ shown, delay: reduced ? 0 : i * gap }}>{child}</StaggerContext.Provider>
      ))}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  const { shown, delay } = useContext(StaggerContext);

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
