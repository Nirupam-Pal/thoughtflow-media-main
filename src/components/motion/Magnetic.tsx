import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInteractiveMotion } from "@/lib/motion";

/** Wraps a button/link so it leans toward the cursor. No-op on touch. */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const interactive = useInteractiveMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.6 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerEnter={
        interactive ? () => (rect.current = ref.current?.getBoundingClientRect() ?? null) : undefined
      }
      onPointerMove={
        interactive
          ? (e) => {
              const r = rect.current;
              if (!r) return;
              x.set((e.clientX - (r.left + r.width / 2)) * strength);
              y.set((e.clientY - (r.top + r.height / 2)) * strength);
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? () => {
              rect.current = null;
              x.set(0);
              y.set(0);
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
