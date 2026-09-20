import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useWillChange,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useInteractiveMotion } from "@/lib/motion";

/**
 * Glass card with a 3D tilt and a cursor-following spotlight.
 *
 * - All pointer state lives in motion values, so moving the mouse never
 *   re-renders React.
 * - The glass layer and the content layer are siblings: content can use
 *   `translateZ` for real depth, while the glass layer keeps its
 *   `overflow: hidden` without flattening the 3D context.
 * - On touch / reduced-motion the card renders statically, no handlers.
 */
export function TiltCard({
  children,
  className,
  glassClassName,
  max = 8,
  spotlight = true,
  spotlightOver = false,
}: {
  children: ReactNode;
  className?: string;
  glassClassName?: string;
  /** Max tilt in degrees. 0 keeps the spotlight but disables rotation. */
  max?: number;
  spotlight?: boolean;
  /** Paint the spotlight above the content (for full-bleed images) instead of under it. */
  spotlightOver?: boolean;
}) {
  const interactive = useInteractiveMotion();
  const willChange = useWillChange();
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const lightX = useMotionValue(-400);
  const lightY = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(360px circle at ${lightX}px ${lightY}px, hsl(16 98% 58% / 0.16), transparent 62%)`;
  const sheen = useMotionTemplate`radial-gradient(240px circle at ${lightX}px ${lightY}px, hsl(0 0% 100% / 0.28), transparent 70%)`;

  const light = interactive && spotlight && (
    <>
      <motion.div className="absolute inset-0" style={{ background: glow }} />
      <motion.div className="absolute inset-0" style={{ background: sheen }} />
    </>
  );

  const onEnter = () => {
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const onMove = (e: React.PointerEvent) => {
    const r = rect.current;
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    px.set(x / r.width);
    py.set(y / r.height);
    lightX.set(x);
    lightY.set(y);
    if (max > 0) {
      rotateY.set((px.get() - 0.5) * 2 * max);
      rotateX.set(-(py.get() - 0.5) * 2 * max);
    }
  };

  const onLeave = () => {
    rect.current = null;
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(-400);
    lightY.set(-400);
  };

  return (
    <div
      ref={ref}
      className={cn("relative h-full", className)}
      style={{ perspective: 1000 }}
      onPointerEnter={interactive ? onEnter : undefined}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? onLeave : undefined}
    >
      <motion.div
        className="relative h-full rounded-[inherit]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange }}
      >
        <div
          className={cn(
            "glass-flat pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
            glassClassName
          )}
        >
          {!spotlightOver && light}
        </div>
        <div className="relative h-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
        {spotlightOver && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">{light}</div>
        )}
      </motion.div>
    </div>
  );
}
