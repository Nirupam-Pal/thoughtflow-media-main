import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type MetricPill = {
  value: string;
  label: string;
  className: string;
  depth: number;
};

const METRICS: MetricPill[] = [
  {
    value: "+48.6%",
    label: "Growth",
    className: "left-4 top-[14%] sm:left-8 sm:top-[16%]",
    depth: 18,
  },
  {
    value: "3.8x ROAS",
    label: "Meta Ads",
    className: "right-4 top-[14%] sm:right-8 sm:top-[16%]",
    depth: 22,
  },
  {
    value: "94 SEO",
    label: "Score",
    className: "left-4 bottom-[26%] hidden sm:flex sm:left-8 sm:bottom-[28%]",
    depth: 14,
  },
  {
    value: "24.8K Reach",
    label: "Weekly",
    className: "right-4 bottom-[26%] hidden sm:flex sm:right-8 sm:bottom-[28%]",
    depth: 16,
  },
];

const CURVE =
  "M 0 520 Q 180 480 320 400 T 640 280 T 960 120 T 1200 40";

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
          "hero-orb absolute -left-[15%] -top-[10%] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full",
          "bg-[radial-gradient(circle,hsl(38_50%_85%/0.7)_0%,transparent_70%)] blur-[80px]",
          !reduced && "hero-orb-float-a"
        )}
        style={reduced ? undefined : { x: orb1X, y: orb1Y }}
      />
      <motion.div
        className={cn(
          "hero-orb absolute -right-[10%] top-[20%] h-[min(60vw,440px)] w-[min(60vw,440px)] rounded-full",
          "bg-[radial-gradient(circle,hsl(38_45%_88%/0.55)_0%,transparent_68%)] blur-[72px]",
          !reduced && "hero-orb-float-b"
        )}
        style={reduced ? undefined : { x: orb2X, y: orb2Y }}
      />
      <motion.div
        className={cn(
          "hero-orb absolute bottom-[5%] left-[25%] hidden h-[min(50vw,360px)] w-[min(50vw,360px)] rounded-full sm:block",
          "bg-[radial-gradient(circle,hsl(38_35%_92%/0.45)_0%,transparent_70%)] blur-[64px]",
          !reduced && "hero-orb-float-c"
        )}
        style={reduced ? undefined : { x: orb3X, y: orb3Y }}
      />

      {/* Subtle editorial grid — fades at center */}
      <div className="hero-fine-grid absolute inset-0" />

      {/* Spotlight behind headline */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,hsl(40_30%_97%/0.95)_0%,transparent_100%)]" />

      {/* Single elegant growth curve */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="curve-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(30 10% 15% / 0)" />
            <stop offset="30%" stopColor="hsl(30 10% 15% / 0.12)" />
            <stop offset="70%" stopColor="hsl(30 10% 15% / 0.22)" />
            <stop offset="100%" stopColor="hsl(30 10% 15% / 0.08)" />
          </linearGradient>
        </defs>

        <path
          d={CURVE}
          fill="none"
          stroke="url(#curve-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={cn(!reduced && "hero-curve-draw")}
        />

        {/* Highlight dot at peak */}
        <circle
          cx="960"
          cy="120"
          r="4"
          fill="hsl(30 10% 15% / 0.2)"
          className={cn(!reduced && "hero-curve-dot")}
        />
        <circle cx="960" cy="120" r="2" fill="hsl(30 10% 15% / 0.45)" />
      </svg>

      {/* Metric pills */}
      {METRICS.map((m, i) => (
        <MetricPillCard
          key={m.label}
          metric={m}
          index={i}
          reduced={reduced}
          springX={sx}
          springY={sy}
        />
      ))}

      {/* Bottom soft fade */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[hsl(40_30%_97%)] to-transparent" />
    </div>
  );
};

function MetricPillCard({
  metric,
  index,
  reduced,
  springX,
  springY,
}: {
  metric: MetricPill;
  index: number;
  reduced: boolean;
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(springX, (v) => v * metric.depth);
  const y = useTransform(springY, (v) => v * metric.depth);

  return (
    <motion.div
      className={cn(
        "hero-pill absolute flex items-center gap-2.5 rounded-full border border-primary/[0.08] px-3.5 py-2 sm:px-4 sm:py-2.5",
        metric.className
      )}
      style={reduced ? undefined : { x, y }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: [0, -4, 0] }
      }
      transition={
        reduced
          ? { duration: 0.5, delay: index * 0.1 }
          : {
              y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
              opacity: { duration: 0.6, delay: index * 0.1 },
            }
      }
    >
      <span className="font-display text-sm font-bold tabular-nums text-primary sm:text-[15px]">
        {metric.value}
      </span>
      <span className="h-3 w-px bg-primary/15" />
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
        {metric.label}
      </span>
    </motion.div>
  );
}

export default HeroBackground;
