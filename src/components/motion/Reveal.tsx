import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

const parentVariants = (gap: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

const itemVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
});

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

  return (
    <motion.div
      className={className}
      variants={parentVariants(reduced ? 0 : gap)}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </motion.div>
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

  return (
    <motion.div className={className} variants={itemVariants(reduced ? 0 : y)}>
      {children}
    </motion.div>
  );
}
