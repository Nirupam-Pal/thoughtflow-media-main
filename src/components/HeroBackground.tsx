import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Filter,
  Megaphone,
  MousePointerClick,
  Search,
  Share2,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingIconConfig = {
  Icon: typeof TrendingUp;
  className: string;
  delay: number;
  duration: number;
  desktopOnly?: boolean;
};

type StatCardConfig = {
  label: string;
  value: string;
  className: string;
  delay: number;
  desktopOnly?: boolean;
};

type ParticleConfig = {
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
};

const floatingIcons: FloatingIconConfig[] = [
  {
    Icon: TrendingUp,
    className: "left-[6%] top-[18%] lg:left-[8%] lg:top-[22%]",
    delay: 0,
    duration: 22,
  },
  {
    Icon: BarChart3,
    className: "right-[7%] top-[20%] lg:right-[10%] lg:top-[24%]",
    delay: 1.5,
    duration: 26,
    desktopOnly: true,
  },
  {
    Icon: Megaphone,
    className: "left-[10%] bottom-[28%] lg:left-[12%] lg:bottom-[30%]",
    delay: 0.8,
    duration: 24,
  },
  {
    Icon: Search,
    className: "right-[9%] bottom-[32%] lg:right-[11%] lg:bottom-[34%]",
    delay: 2,
    duration: 28,
    desktopOnly: true,
  },
  {
    Icon: MousePointerClick,
    className: "left-[4%] top-[48%] hidden lg:block",
    delay: 1.2,
    duration: 30,
    desktopOnly: true,
  },
  {
    Icon: Share2,
    className: "right-[5%] top-[42%] hidden lg:block",
    delay: 0.5,
    duration: 25,
    desktopOnly: true,
  },
  {
    Icon: Filter,
    className: "left-[18%] top-[12%] hidden lg:block",
    delay: 2.5,
    duration: 27,
    desktopOnly: true,
  },
  {
    Icon: Target,
    className: "right-[16%] bottom-[22%] hidden lg:block",
    delay: 1.8,
    duration: 23,
    desktopOnly: true,
  },
];

const statCards: StatCardConfig[] = [
  {
    label: "Growth",
    value: "+42%",
    className: "left-[4%] top-[32%] hidden md:flex lg:left-[5%] lg:top-[35%]",
    delay: 0.3,
  },
  {
    label: "SEO Score",
    value: "94",
    className: "right-[4%] top-[30%] hidden md:flex lg:right-[6%] lg:top-[33%]",
    delay: 0.6,
  },
  {
    label: "Reach",
    value: "12.8K",
    className: "left-[3%] bottom-[18%] hidden lg:flex",
    delay: 0.9,
    desktopOnly: true,
  },
  {
    label: "Conversion",
    value: "+28%",
    className: "right-[3%] bottom-[16%] hidden lg:flex",
    delay: 1.2,
    desktopOnly: true,
  },
  {
    label: "ROAS",
    value: "3.2x",
    className: "right-[18%] top-[14%] hidden xl:flex",
    delay: 1.5,
    desktopOnly: true,
  },
];

const networkNodes = [
  { cx: 12, cy: 28, r: 3 },
  { cx: 28, cy: 18, r: 2.5 },
  { cx: 45, cy: 32, r: 3 },
  { cx: 62, cy: 22, r: 2.5 },
  { cx: 78, cy: 35, r: 3 },
  { cx: 88, cy: 20, r: 2.5 },
  { cx: 18, cy: 55, r: 2.5 },
  { cx: 35, cy: 62, r: 3 },
  { cx: 55, cy: 58, r: 2.5 },
  { cx: 72, cy: 65, r: 3 },
  { cx: 85, cy: 52, r: 2.5 },
  { cx: 92, cy: 72, r: 2.5 },
];

const networkEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [0, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [2, 7],
  [4, 9],
  [3, 8],
];

const mobileParticles: ParticleConfig[] = [
  { left: "12%", top: "20%", size: 3, delay: 0, duration: 20 },
  { left: "88%", top: "18%", size: 3, delay: 1.5, duration: 22 },
  { left: "8%", top: "55%", size: 3, delay: 0.8, duration: 24 },
  { left: "90%", top: "52%", size: 3, delay: 2, duration: 21 },
  { left: "50%", top: "10%", size: 2, delay: 1, duration: 26 },
];

const mobileIcons: FloatingIconConfig[] = [
  {
    Icon: TrendingUp,
    className: "left-[3%] top-[12%]",
    delay: 0,
    duration: 22,
  },
  {
    Icon: Megaphone,
    className: "right-[3%] top-[12%]",
    delay: 0.8,
    duration: 24,
  },
  {
    Icon: Search,
    className: "left-[2%] bottom-[26%]",
    delay: 1.2,
    duration: 26,
  },
  {
    Icon: BarChart3,
    className: "right-[2%] bottom-[26%]",
    delay: 0.5,
    duration: 23,
  },
];

const mobileStatCards: StatCardConfig[] = [
  {
    label: "Growth",
    value: "+42%",
    className: "left-[3%] bottom-[32%]",
    delay: 0.3,
  },
  {
    label: "SEO Score",
    value: "94",
    className: "right-[3%] bottom-[32%]",
    delay: 0.6,
  },
];

const mobileNetworkNodes = [
  { cx: 8, cy: 25, r: 2.5 },
  { cx: 25, cy: 15, r: 2 },
  { cx: 75, cy: 18, r: 2.5 },
  { cx: 92, cy: 28, r: 2 },
  { cx: 10, cy: 70, r: 2 },
  { cx: 30, cy: 80, r: 2.5 },
  { cx: 70, cy: 78, r: 2 },
  { cx: 90, cy: 68, r: 2.5 },
];

const mobileNetworkEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [2, 6],
];

const particles: ParticleConfig[] = [
  { left: "15%", top: "25%", size: 4, delay: 0, duration: 18 },
  { left: "85%", top: "30%", size: 3, delay: 2, duration: 22 },
  { left: "72%", top: "65%", size: 4, delay: 1, duration: 20 },
  { left: "25%", top: "70%", size: 3, delay: 3, duration: 24 },
  { left: "50%", top: "15%", size: 3, delay: 1.5, duration: 26 },
  { left: "40%", top: "85%", size: 4, delay: 0.5, duration: 21 },
  { left: "92%", top: "48%", size: 3, delay: 2.5, duration: 23 },
  { left: "8%", top: "52%", size: 3, delay: 4, duration: 25 },
  { left: "60%", top: "78%", size: 3, delay: 1.8, duration: 19 },
  { left: "33%", top: "38%", size: 3, delay: 3.5, duration: 27 },
  { left: "78%", top: "12%", size: 4, delay: 0.8, duration: 20 },
  { left: "55%", top: "45%", size: 3, delay: 2.2, duration: 22 },
];

const MiniLineChart = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 40"
    className={cn("h-9 w-[4.5rem] opacity-55", className)}
    aria-hidden="true"
  >
    <polyline
      points="0,35 12,28 24,32 36,18 48,22 60,10 72,14 80,6"
      fill="none"
      stroke="hsl(30 10% 15% / 0.45)"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="10" r="2" fill="hsl(30 10% 15% / 0.5)" />
  </svg>
);

const MiniBarChart = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 32"
    className={cn("h-8 w-12 opacity-50", className)}
    aria-hidden="true"
  >
    {[6, 14, 10, 22, 16, 26].map((h, i) => (
      <rect
        key={i}
        x={i * 8 + 2}
        y={32 - h}
        width={5}
        height={h}
        rx={1}
        fill="hsl(30 10% 15% / 0.35)"
      />
    ))}
  </svg>
);

const HeroBackground = () => {
  const prefersReducedMotion = useReducedMotion();

  const visibleParticles = useMemo(
    () => (prefersReducedMotion ? particles.slice(0, 4) : particles),
    [prefersReducedMotion]
  );

  const floatTransition = (duration: number, delay: number) =>
    prefersReducedMotion
      ? { duration: 0 }
      : {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const,
        };

  const visibleMobileParticles = useMemo(
    () => (prefersReducedMotion ? mobileParticles.slice(0, 3) : mobileParticles),
    [prefersReducedMotion]
  );

  const renderFloatingIcon = (
    { Icon, className, delay, duration }: FloatingIconConfig,
    key: string
  ) => (
    <motion.div
      key={key}
      className={cn(
        "absolute flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-background/60 shadow-soft backdrop-blur-sm sm:h-10 sm:w-10 md:h-11 md:w-11",
        className
      )}
      initial={{ opacity: 0 }}
      animate={
        prefersReducedMotion
          ? { opacity: 0.5, y: 0, rotate: 0 }
          : {
              opacity: [0.4, 0.65, 0.4],
              y: [-8, 8, -8],
              rotate: [-3, 3, -3],
            }
      }
      transition={floatTransition(duration, delay)}
    >
      <Icon className="h-4 w-4 text-primary/50 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]" strokeWidth={1.6} />
    </motion.div>
  );

  const renderStatCard = (
    { label, value, className, delay }: StatCardConfig,
    key: string,
    durationOffset = 0
  ) => (
    <motion.div
      key={key}
      className={cn(
        "absolute flex flex-col gap-0.5 rounded-lg border border-primary/15 bg-background/65 px-2.5 py-1.5 shadow-soft backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0 }}
      animate={
        prefersReducedMotion
          ? { opacity: 0.55, y: 0, scale: 1 }
          : {
              opacity: [0.45, 0.72, 0.45],
              y: [-6, 6, -6],
              scale: [1, 1.02, 1],
            }
      }
      transition={floatTransition(20 + durationOffset * 2, delay)}
    >
      <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/90">
        {label}
      </span>
      <span className="font-display text-sm font-bold tabular-nums text-primary/85">
        {value}
      </span>
    </motion.div>
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Digital grid — stronger on mobile */}
      <div className="hero-grid absolute inset-0 opacity-[0.13] sm:opacity-[0.08]" />

      {/* Gradient blobs */}
      <div
        className={cn(
          "hero-blob absolute -left-[15%] top-[10%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,hsl(38_50%_85%/0.72),transparent_68%)] blur-3xl sm:-left-[10%] sm:top-[15%] sm:h-[450px] sm:w-[450px] sm:bg-[radial-gradient(circle,hsl(38_50%_85%/0.65),transparent_70%)]",
          !prefersReducedMotion && "hero-blob-drift-a"
        )}
      />
      <div
        className={cn(
          "hero-blob absolute -right-[12%] bottom-[8%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,hsl(38_45%_88%/0.68),transparent_68%)] blur-3xl sm:-right-[8%] sm:bottom-[10%] sm:h-[410px] sm:w-[410px] sm:bg-[radial-gradient(circle,hsl(38_45%_88%/0.6),transparent_70%)]",
          !prefersReducedMotion && "hero-blob-drift-b"
        )}
      />
      <div
        className={cn(
          "hero-blob absolute left-[20%] top-[60%] h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,hsl(38_35%_92%/0.5),transparent_68%)] blur-3xl sm:left-[35%] sm:top-[55%] sm:h-[300px] sm:w-[300px] sm:bg-[radial-gradient(circle,hsl(38_35%_92%/0.55),transparent_70%)]",
          !prefersReducedMotion && "hero-blob-pulse"
        )}
      />

      {/* Mobile network graph */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14] sm:hidden"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {mobileNetworkEdges.map(([from, to], i) => {
          const a = mobileNetworkNodes[from];
          const b = mobileNetworkNodes[to];
          return (
            <line
              key={`m-${i}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke="hsl(30 10% 15%)"
              strokeWidth="0.2"
              className={cn(!prefersReducedMotion && "hero-network-line")}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          );
        })}
        {mobileNetworkNodes.map((node, i) => (
          <circle
            key={`m-node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="hsl(30 10% 15% / 0.6)"
            className={cn(!prefersReducedMotion && "hero-network-node")}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>

      {/* Desktop / tablet network graph */}
      <svg
        className="absolute inset-0 hidden h-full w-full opacity-[0.12] sm:block md:opacity-[0.14]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {networkEdges.map(([from, to], i) => {
          const a = networkNodes[from];
          const b = networkNodes[to];
          return (
            <line
              key={i}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke="hsl(30 10% 15%)"
              strokeWidth="0.18"
              className={cn(!prefersReducedMotion && "hero-network-line")}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          );
        })}
        {networkNodes.map((node, i) => (
          <circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="hsl(30 10% 15% / 0.6)"
            className={cn(!prefersReducedMotion && "hero-network-node")}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>

      {/* Mobile particles */}
      <div className="absolute inset-0 sm:hidden">
        {visibleMobileParticles.map((p, i) => (
          <span
            key={`m-p-${i}`}
            className={cn(
              "hero-particle absolute rounded-full bg-primary/35",
              !prefersReducedMotion && "hero-particle-float"
            )}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Desktop / tablet particles */}
      <div className="absolute inset-0 hidden sm:block">
        {visibleParticles.map((p, i) => (
          <span
            key={i}
            className={cn(
              "hero-particle absolute rounded-full bg-primary/30",
              !prefersReducedMotion && "hero-particle-float"
            )}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Mobile data viz */}
      <MiniLineChart className="absolute left-[6%] bottom-[38%] sm:hidden" />
      <MiniBarChart className="absolute right-[6%] bottom-[38%] sm:hidden" />

      {/* Desktop data viz */}
      <MiniLineChart className="absolute left-[14%] top-[58%] hidden lg:block" />
      <MiniBarChart className="absolute right-[14%] top-[52%] hidden lg:block" />
      <div className="absolute left-[22%] top-[68%] hidden items-center gap-1.5 opacity-45 xl:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-primary/45" />
        <span className="h-px w-8 bg-primary/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/45" />
        <span className="h-px w-6 bg-primary/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/55" />
      </div>
      <div className="absolute right-[20%] top-[68%] hidden text-[11px] font-medium tabular-nums text-primary/45 xl:block">
        87%
      </div>

      {/* Floating marketing icons */}
      {floatingIcons.map(({ Icon, className, delay, duration, desktopOnly }, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-background/60 shadow-soft backdrop-blur-sm md:h-11 md:w-11",
            desktopOnly ? "hidden md:flex" : "hidden sm:flex",
            className
          )}
          initial={{ opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.5, y: 0, rotate: 0 }
              : {
                  opacity: [0.4, 0.65, 0.4],
                  y: [-8, 8, -8],
                  rotate: [-3, 3, -3],
                }
          }
          transition={floatTransition(duration, delay)}
        >
          <Icon className="h-4 w-4 text-primary/50 md:h-[18px] md:w-[18px]" strokeWidth={1.6} />
        </motion.div>
      ))}

      {/* Floating stat cards */}
      {statCards.map(({ label, value, className, delay, desktopOnly }, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute flex flex-col gap-0.5 rounded-lg border border-primary/15 bg-background/65 px-2.5 py-1.5 shadow-soft backdrop-blur-sm",
            desktopOnly ? "hidden lg:flex" : "hidden md:flex",
            className
          )}
          initial={{ opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.55, y: 0, scale: 1 }
              : {
                  opacity: [0.45, 0.72, 0.45],
                  y: [-6, 6, -6],
                  scale: [1, 1.02, 1],
                }
          }
          transition={floatTransition(20 + i * 2, delay)}
        >
          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/90">
            {label}
          </span>
          <span className="font-display text-sm font-bold tabular-nums text-primary/85">
            {value}
          </span>
        </motion.div>
      ))}

      {/* Center fade — keeps headline readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(40_30%_97%/0.68)_0%,transparent_62%)]" />
    </div>
  );
};

export default HeroBackground;
