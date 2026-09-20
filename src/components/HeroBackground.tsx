import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const HeroBackground = () => {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 30 });
  const sy = useSpring(my, { stiffness: 50, damping: 30 });

  const orb1X = useTransform(sx, (v) => v * 40);
  const orb1Y = useTransform(sy, (v) => v * 30);
  const orb2X = useTransform(sx, (v) => v * -28);
  const orb2Y = useTransform(sy, (v) => v * -22);
  const orb3X = useTransform(sx, (v) => v * 18);
  const orb3Y = useTransform(sy, (v) => v * 14);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (reduced || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my, reduced]
  );

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove, reduced]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-[hsl(40_30%_97%)]" />

      {/* Aurora mesh — soft overlapping orbs */}
      <motion.div
        className={cn(
          "hero-orb absolute -left-[10%] -top-[8%] h-[min(60vw,520px)] w-[min(60vw,520px)] rounded-full sm:-left-[15%] sm:-top-[10%] sm:h-[min(70vw,520px)] sm:w-[min(70vw,520px)]",
          "bg-[radial-gradient(circle,hsl(38_50%_85%/0.7)_0%,transparent_70%)] blur-[80px]",
          !reduced && "hero-orb-float-a"
        )}
        style={reduced ? undefined : { x: orb1X, y: orb1Y }}
      />
      <motion.div
        className={cn(
          "hero-orb absolute -right-[6%] top-[14%] h-[min(50vw,380px)] w-[min(50vw,380px)] rounded-full sm:-right-[10%] sm:top-[16%] sm:h-[min(60vw,520px)] sm:w-[min(60vw,520px)]",
          "bg-[radial-gradient(circle,hsl(16_95%_72%/0.38)_0%,hsl(340_80%_75%/0.14)_45%,transparent_70%)] blur-[72px]",
          !reduced && "hero-orb-float-b"
        )}
        style={reduced ? undefined : { x: orb2X, y: orb2Y }}
      />
      <motion.div
        className={cn(
          "hero-orb absolute bottom-12 left-[18%] hidden h-[min(45vw,300px)] w-[min(45vw,300px)] rounded-full sm:block sm:bottom-[5%] sm:left-[25%] sm:h-[min(50vw,360px)] sm:w-[min(50vw,360px)]",
          "bg-[radial-gradient(circle,hsl(38_35%_92%/0.45)_0%,transparent_70%)] blur-[64px]",
          !reduced && "hero-orb-float-c"
        )}
        style={reduced ? undefined : { x: orb3X, y: orb3Y }}
      />

      {/* Subtle editorial grid — fades at edges */}
      <div className="hero-fine-grid absolute inset-0" />

      {/* Bottom soft fade into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[hsl(40_30%_97%)] to-transparent" />
    </div>
  );
};

export default HeroBackground;
