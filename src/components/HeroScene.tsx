import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Search, Target, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 3D "growth stack": an isometric bar chart that rises out of a glass slab,
 * orbited by audience nodes, with floating glass KPI cards on top.
 *
 * Pure CSS 3D transforms — zero extra dependencies, no WebGL context, no JS
 * in the render loop except a spring on the pointer. Bar geometry lives in
 * `.hero-bar*` in index.css. The scene is authored at STAGE_W x STAGE_H and
 * scaled down to fit its container.
 */

const STAGE_W = 620;
const STAGE_H = 540;
const PLATE_Y = 330; // screen y of the slab centre
const BAR = 58;
const GAP = 96;
const HEIGHTS = [60, 100, 145, 200, 270] as const;
const TOP_BAR_X = (HEIGHTS.length - 1 - 2) * GAP;
const ORBIT_R = 260;
const ORBIT_ANGLES = [0, 120, 240];

type Metric = {
  value: string;
  label: string;
  icon: LucideIcon;
  className: string;
  depth: number;
  delay: number;
  hot?: boolean;
};

const METRICS: Metric[] = [
  { value: "+48.6%", label: "Growth", icon: TrendingUp, className: "left-0 top-[6%]", depth: 22, delay: 0, hot: true },
  { value: "3.8x", label: "ROAS · Meta Ads", icon: Target, className: "right-0 bottom-[3%]", depth: 30, delay: 0.8 },
  { value: "94", label: "SEO Score", icon: Search, className: "hidden sm:flex left-[2%] bottom-[8%]", depth: 16, delay: 1.6 },
  { value: "24.8K", label: "Weekly Reach", icon: Users, className: "hidden sm:flex left-[30%] top-[1%]", depth: 26, delay: 2.4 },
];

/** Charcoal → ember ramp so the chart "heats up" as it grows. */
function barFaces(t: number) {
  const p = t ** 2.2;
  const h = 30 - 14 * p;
  const s = 10 + 88 * p;
  const top = 30 + 32 * p;
  const front = 17 + 33 * p;
  const left = 10 + 25 * p;
  const c = (l: number) => `hsl(${h} ${s}% ${l}%)`;
  return {
    top: `linear-gradient(135deg, ${c(top + 6)}, ${c(top - 4)})`,
    // Front/left faces are rotated up from the base, so "to bottom"/"to right" runs base → tip.
    front: `linear-gradient(to bottom, ${c(front - 5)}, ${c(front + 7)})`,
    left: `linear-gradient(to right, ${c(left - 4)}, ${c(left + 6)})`,
  };
}

function useStageScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / STAGE_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return { ref, scale, inView };
}

const HeroScene = () => {
  const reduced = !!useReducedMotion();
  const { ref, scale, inView } = useStageScale();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.8 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);

  useEffect(() => {
    if (reduced) return;
    // Gentle sway until the visitor moves a mouse (also covers touch devices).
    const idle = animate(mx, [-0.2, 0.2], {
      duration: 7,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      idle.stop();
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      idle.stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, [mx, my, reduced]);

  return (
    <div
      ref={ref}
      className="hero-stage relative mx-auto w-full"
      style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}`, maxWidth: STAGE_W }}
      data-inview={inView}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-0 transition-opacity duration-500"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `translateX(-50%) scale(${scale ?? 1})`,
          transformOrigin: "top center",
          opacity: scale === null ? 0 : 1,
        }}
      >
        {/* Ambient glow behind the tallest bar */}
        <div
          className="absolute rounded-full"
          style={{
            width: 460,
            height: 460,
            left: 310 + TOP_BAR_X * 0.94 - 230,
            top: 60,
            background:
              "radial-gradient(closest-side, hsl(16 98% 60% / 0.34), hsl(340 85% 60% / 0.12) 55%, transparent)",
          }}
        />

        <div className={cn("absolute inset-0", !reduced && "hero-stage-float")}>
          <div className="absolute inset-0" style={{ perspective: 1600 }}>
            <motion.div
              className="absolute inset-0"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
              <div className="hero-plate" style={{ top: PLATE_Y }}>
                <div className="hero-slab-shadow" />
                <div className="hero-slab" />
                <div className="hero-slab-edge" />

                <div className="hero-ring">
                  {ORBIT_ANGLES.map((deg) => {
                    const a = (deg * Math.PI) / 180;
                    return (
                      <span
                        key={deg}
                        className="hero-ring-dot"
                        style={{
                          left: ORBIT_R + ORBIT_R * Math.cos(a) - 6,
                          top: ORBIT_R + ORBIT_R * Math.sin(a) - 6,
                        }}
                      />
                    );
                  })}
                </div>

                {HEIGHTS.map((h, i) => {
                  const faces = barFaces(i / (HEIGHTS.length - 1));
                  const cx = (i - 2) * GAP;
                  return (
                    <div
                      key={h}
                      className="hero-bar"
                      style={
                        {
                          left: cx - BAR / 2,
                          top: -BAR / 2,
                          width: BAR,
                          height: BAR,
                          "--bar-delay": `${0.35 + i * 0.13}s`,
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="hero-bar-face"
                        style={{ width: BAR, height: BAR, background: faces.top, transform: `translateZ(${h}px)` }}
                      />
                      <div
                        className="hero-bar-face"
                        style={{
                          top: BAR,
                          width: BAR,
                          height: h,
                          background: faces.front,
                          transformOrigin: "50% 0",
                          transform: "rotateX(90deg)",
                        }}
                      />
                      <div
                        className="hero-bar-face"
                        style={{
                          width: h,
                          height: BAR,
                          background: faces.left,
                          transformOrigin: "0 50%",
                          transform: "rotateY(-90deg)",
                        }}
                      />
                    </div>
                  );
                })}

                {/* Beacon halo hovering over the tallest bar */}
                <div
                  className="absolute"
                  style={{
                    left: TOP_BAR_X - 62,
                    top: -62,
                    width: 124,
                    height: 124,
                    transform: `translateZ(${HEIGHTS[HEIGHTS.length - 1] + 46}px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="hero-halo">
                    <span
                      className="hero-ring-dot"
                      style={{ left: 62 - 6, top: -6 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Growth vector — flat HUD line that draws itself in */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={STAGE_W}
          height={STAGE_H}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          fill="none"
        >
          <defs>
            <linearGradient id="hero-vector" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="hsl(30 10% 15%)" stopOpacity="0" />
              <stop offset="0.45" stopColor="hsl(30 10% 15%)" stopOpacity="0.55" />
              <stop offset="1" stopColor="hsl(16 98% 55%)" />
            </linearGradient>
          </defs>
          <path
            d="M 30 400 C 140 380, 200 290, 300 200 S 430 70, 486 46"
            stroke="url(#hero-vector)"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            className={cn(!reduced && "hero-vector-draw")}
          />
        </svg>
      </div>

      {/* Glass KPI cards — kept outside the scaled stage so text stays legible on phones */}
      <div className="pointer-events-none absolute inset-0">
        {METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} reduced={reduced} sx={sx} sy={sy} />
        ))}
      </div>
    </div>
  );
};

function MetricCard({
  metric,
  reduced,
  sx,
  sy,
}: {
  metric: Metric;
  reduced: boolean;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * metric.depth);
  const y = useTransform(sy, (v) => v * metric.depth);
  const Icon = metric.icon;

  return (
    <motion.div
      className={cn("absolute pointer-events-auto", metric.className)}
      style={reduced ? undefined : { x, y }}
    >
      <div
        className={cn(!reduced && "hero-bob")}
        style={{ animationDelay: `${metric.delay}s` }}
      >
        <div className="hero-glass group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:shadow-medium sm:px-3.5 sm:py-3">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300",
              metric.hot
                ? "bg-gradient-to-br from-[hsl(22_98%_58%)] to-[hsl(340_82%_52%)] text-white"
                : "bg-primary/[0.06] text-primary group-hover:bg-primary group-hover:text-primary-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[17px] font-bold tabular-nums text-primary sm:text-lg">
              {metric.value}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
              {metric.label}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroScene;
