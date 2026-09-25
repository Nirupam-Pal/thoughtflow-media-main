import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BarChart3, IndianRupee, LayoutTemplate, Megaphone, UserCheck, Zap } from "lucide-react";
import type { CaseStudyStory } from "@/data/portfolioData";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./CaseStudyParts";
import { ArtImage } from "./ImageTile";

/*
 * Signature animated sections for the gallery case studies, one per kind of project.
 * None of them show numbers: they illustrate how the work is done, not results we can't back up.
 * Looping accents run only while the band is on screen and never for reduced motion.
 */

type Feature = NonNullable<CaseStudyStory["feature"]>;
type Item = Feature["items"][number];

/* ─────────────────────────── shared shell ─────────────────────────── */

function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "100px" });
  return [ref, inView] as const;
}

function BandShell({
  feature,
  inView,
  sectionRef,
  aside,
  children,
  stacked,
}: {
  feature: Feature;
  inView: boolean;
  sectionRef: React.RefObject<HTMLElement>;
  /** Under the copy on the left (usually the item list). */
  aside?: ReactNode;
  /** The visual. */
  children: ReactNode;
  /** Put the visual full-width under the copy instead of beside it. */
  stacked?: boolean;
}) {
  return (
    <section
      ref={sectionRef}
      data-inview={inView}
      aria-labelledby="feature-heading"
      className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28 lg:py-36"
    >
      <div className="grain absolute inset-0 opacity-[0.09]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_15%,hsl(16_95%_55%/0.26),transparent_70%),radial-gradient(45%_35%_at_5%_95%,hsl(340_80%_50%/0.14),transparent_70%)]" />
      <div className={cn("container relative mx-auto grid min-w-0 gap-14 px-4 sm:px-6", !stacked && "items-center lg:grid-cols-2 lg:gap-16")}>
        <div className={cn(stacked && "grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16")}>
          <div>
            <Reveal>
              <Eyebrow dark>{feature.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="feature-heading" className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {feature.title} <span className="text-ember">{feature.accent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-base text-white/60 sm:text-lg">{feature.body}</p>
            </Reveal>
          </div>
          {aside && <div className={cn(!stacked && "mt-10")}>{aside}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** Numbered item list on the dark band. `active` highlights one (scroll-driven bands). */
function ItemList({ items, active, columns }: { items: Item[]; active?: number; columns?: boolean }) {
  return (
    <Stagger className={cn("grid gap-x-8", columns ? "sm:grid-cols-2" : "")}>
      {items.map((item, i) => (
        <StaggerItem key={item.title}>
          <div
            className={cn(
              "flex gap-4 border-t border-white/10 py-4 transition-opacity duration-500",
              active !== undefined && (i === active ? "opacity-100" : "opacity-40")
            )}
          >
            <span className="font-display text-sm font-semibold tabular-nums text-ember">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{item.description}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ─────────────────────────── campaign: one idea → every channel ─────────────────────────── */

function CampaignBand({ feature }: { feature: Feature }) {
  const [ref, inView] = useOnScreen<HTMLElement>();
  const reduced = useReducedMotion();
  const n = feature.items.length;
  const nodes = feature.items.map((item, i) => {
    const a = (-90 + (i * 360) / n) * (Math.PI / 180);
    return { item, x: 50 + 37 * Math.cos(a), y: 50 + 37 * Math.sin(a) };
  });
  const live = inView && !reduced;

  return (
    <BandShell feature={feature} inView={inView} sectionRef={ref} aside={<ItemList items={feature.items} />}>
      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        <div aria-hidden="true" className="absolute inset-[13%] animate-[spin_70s_linear_infinite] rounded-full border border-dashed border-white/15 motion-reduce:animate-none" />
        <div aria-hidden="true" className="absolute inset-[26%] rounded-full border border-white/5" />

        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="spoke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="hsl(22 98% 58%)" />
              <stop offset="100%" stopColor="hsl(340 82% 60%)" />
            </linearGradient>
          </defs>
          {nodes.map(({ item, x, y }, i) => (
            <g key={item.title}>
              <motion.line
                x1={50}
                y1={50}
                x2={x}
                y2={y}
                stroke="url(#spoke)"
                strokeWidth={0.35}
                strokeOpacity={0.7}
                initial={reduced ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
              />
              {/* A pulse carrying the idea out to the channel */}
              {live && (
                <motion.circle
                  r={0.9}
                  fill="white"
                  initial={{ cx: 50, cy: 50, opacity: 0 }}
                  animate={{ cx: [50, x], cy: [50, y], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.2, delay: 1.2 + i * 0.35, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
                />
              )}
            </g>
          ))}
        </svg>

        {/* The idea */}
        <motion.div
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute left-[34%] top-[34%] flex h-[32%] w-[32%] items-center justify-center"
        >
          <span aria-hidden="true" className="bg-ember absolute inset-0 animate-ping rounded-full opacity-20 [animation-duration:3s] motion-reduce:animate-none" />
          <span className="bg-ember relative flex h-full w-full flex-col items-center justify-center rounded-full text-center shadow-[0_20px_60px_-10px_hsl(8_90%_50%/0.6)]">
            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/75 sm:text-[11px]">One</span>
            <span className="font-display text-base font-bold leading-none sm:text-2xl">Big Idea</span>
          </span>
        </motion.div>

        {/* Channels */}
        {nodes.map(({ item, x, y }, i) => (
          <div key={item.title} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
            <motion.span
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.9 + i * 0.12 }}
              className="block whitespace-nowrap rounded-full bg-[hsl(30_10%_20%)] px-3 py-1.5 font-display text-xs font-semibold ring-1 ring-white/20 sm:px-4 sm:py-2 sm:text-sm"
            >
              {item.title}
            </motion.span>
          </div>
        ))}
      </div>
    </BandShell>
  );
}

/* ─────────────────────────── funnel: stages + leads flowing through ─────────────────────────── */

const STAGE_H = 68;
const STAGE_GAP = 8;
// Start offsets in px (a % in a transform would be relative to the 8px dot, not the funnel).
const DROPS = [
  { x: "-140px", delay: 0 },
  { x: "110px", delay: 0.6 },
  { x: "-45px", delay: 1.2 },
  { x: "150px", delay: 1.8 },
  { x: "-105px", delay: 2.4 },
  { x: "50px", delay: 3.0 },
];

function FunnelBand({ feature }: { feature: Feature }) {
  const [ref, inView] = useOnScreen<HTMLElement>();
  const reduced = useReducedMotion();
  const n = feature.items.length;
  const height = n * STAGE_H + (n - 1) * STAGE_GAP;

  return (
    <BandShell feature={feature} inView={inView} sectionRef={ref} aside={<ItemList items={feature.items} />}>
      <div className="relative mx-auto w-full max-w-[520px]" style={{ height }}>
        {feature.items.map((item, i) => {
          const width = 100 - (i * 50) / Math.max(n - 1, 1);
          return (
            <motion.div
              key={item.title}
              initial={reduced ? false : { opacity: 0, scaleX: 0.4 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.14, ease: EASE }}
              className="absolute left-1/2 flex items-center justify-center"
              style={{ top: i * (STAGE_H + STAGE_GAP), height: STAGE_H, width: `${width}%`, marginLeft: `-${width / 2}%` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0, calc(100% - 18px) 100%, 18px 100%)",
                  background: `linear-gradient(90deg, hsl(22 98% ${58 - i * 3}% / ${0.35 + i * 0.14}), hsl(340 82% ${56 - i * 3}% / ${0.35 + i * 0.14}))`,
                }}
              />
              <span className="relative flex items-center gap-2 font-display text-sm font-semibold sm:text-base">
                <span className="tabular-nums text-white/60">{String(i + 1).padStart(2, "0")}</span>
                {item.title}
              </span>
            </motion.div>
          );
        })}

        {/* Leads dropping through the funnel */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-center" style={{ ["--h" as string]: `${height}px` }}>
          {DROPS.map((d, i) => (
            <span
              key={i}
              className="funnel-drop absolute top-0 h-2 w-2 rounded-full bg-white opacity-0 shadow-[0_0_12px_2px_hsl(0_0%_100%/0.6)]"
              style={{ ["--x" as string]: d.x, animationDelay: `${d.delay}s`, left: "calc(50% - 4px)" }}
            />
          ))}
        </div>
      </div>
    </BandShell>
  );
}

/* ─────────────────────────── build: a page assembling layer by layer ─────────────────────────── */

function BuildBand({ feature, image }: { feature: Feature; image?: string }) {
  const [ref, inView] = useOnScreen<HTMLElement>();
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start 85%", "end 90%"] });
  const done = useTransform(scrollYProgress, () => 1);
  const p = reduced ? done : scrollYProgress;
  const n = feature.items.length;
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(n - 1, Math.floor(v * n))));

  // Four phases: wireframe → content → speed → insight.
  const wire = useTransform(p, [0, 0.12, 0.3, 0.42], [0, 1, 1, 0]);
  const content = useTransform(p, [0.25, 0.45], [0, 1]);
  const contentY = useTransform(p, [0.25, 0.45], [16, 0]);
  const speed = useTransform(p, [0.5, 0.68], [0, 1]);
  const badge = useTransform(p, [0.6, 0.7], [0, 1]);
  const insight = useTransform(p, [0.75, 0.9], [0, 1]);
  const insightY = useTransform(p, [0.75, 0.9], [30, 0]);

  return (
    <BandShell feature={feature} inView={inView} sectionRef={ref} aside={<ItemList items={feature.items} active={reduced ? undefined : active} />}>
      <div ref={stage} className="relative mx-auto w-full max-w-[600px]">
        <div className="overflow-hidden rounded-2xl bg-[hsl(40_30%_97%)] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
          {/* Chrome */}
          <div className="relative flex items-center gap-2 border-b border-black/5 bg-[hsl(38_25%_92%)] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 h-5 flex-1 rounded-full bg-white/80 ring-1 ring-black/5" />
            {/* Load bar */}
            <motion.span style={{ scaleX: speed }} className="bg-ember absolute inset-x-0 bottom-0 h-[3px] origin-left" />
          </div>

          <div className="relative aspect-[4/3] p-4 text-[hsl(30_10%_15%)] sm:p-6">
            {/* Wireframe */}
            <motion.div style={{ opacity: wire }} aria-hidden="true" className="absolute inset-4 grid grid-rows-[auto_1fr_auto] gap-3 sm:inset-6">
              <div className="h-6 rounded-md border border-dashed border-black/25" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-dashed border-black/25" />
                <div className="rounded-md border border-dashed border-black/25" />
              </div>
              <div className="grid h-16 grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-md border border-dashed border-black/25" />
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div style={{ opacity: content, y: contentY }} aria-hidden="true" className="absolute inset-4 grid grid-rows-[auto_1fr_auto] gap-3 sm:inset-6">
              <div className="flex h-6 items-center justify-between">
                <span className="bg-ember h-4 w-16 rounded" />
                <span className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-8 rounded-full bg-black/15" />
                  ))}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col justify-center gap-2">
                  <span className="h-3 w-11/12 rounded bg-black/70" />
                  <span className="h-3 w-3/4 rounded bg-black/70" />
                  <span className="mt-1 h-2 w-full rounded bg-black/15" />
                  <span className="h-2 w-5/6 rounded bg-black/15" />
                  <span className="mt-2 h-5 w-20 rounded-full bg-black/80" />
                </div>
                <div className="relative overflow-hidden rounded-md bg-black/10">
                  {image && <ArtImage src={image} ratio={1} sizes="240px" className="absolute inset-0 h-full w-full object-cover" />}
                </div>
              </div>
              <div className="grid h-16 grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col gap-1.5 rounded-md bg-white p-2 shadow-sm ring-1 ring-black/5">
                    <span className="h-2 w-2/3 rounded bg-black/50" />
                    <span className="h-1.5 w-full rounded bg-black/10" />
                    <span className="h-1.5 w-4/5 rounded bg-black/10" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Speed badge */}
            <motion.span
              style={{ opacity: badge, scale: badge }}
              className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[hsl(30_10%_15%)] px-3 py-1.5 text-xs font-semibold text-white shadow-medium sm:right-6 sm:top-6"
            >
              <Zap className="h-3.5 w-3.5 fill-[hsl(22_98%_58%)] text-[hsl(22_98%_58%)]" />
              Fast load
            </motion.span>
          </div>
        </div>

        {/* Insight card */}
        <motion.div
          style={{ opacity: insight, y: insightY }}
          aria-hidden="true"
          className="absolute -bottom-8 -right-2 w-[46%] rounded-2xl bg-white p-4 text-[hsl(30_10%_15%)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] sm:-right-6"
        >
          <span className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50">
            <BarChart3 className="h-3.5 w-3.5" /> Dashboard
          </span>
          <div className="flex h-16 items-end gap-1.5">
            {[28, 36, 34, 48, 56, 64, 78, 92].map((h, i) => (
              <motion.span key={i} style={{ height: `${h}%`, scaleY: insight }} className="bg-ember flex-1 origin-bottom rounded-sm" />
            ))}
          </div>
        </motion.div>
      </div>
    </BandShell>
  );
}

/* ─────────────────────────── growth: test-and-scale curve + lead pipeline ─────────────────────────── */

const CURVE = "M 0 240 C 60 238, 100 236, 150 228 S 240 226, 300 196 S 420 128, 470 92 S 560 38, 600 22";

const PIPELINE = [
  { label: "Ad", icon: Megaphone },
  { label: "Landing page", icon: LayoutTemplate },
  { label: "Lead", icon: UserCheck },
  { label: "Sale", icon: IndianRupee },
];

function Milestone({ progress, at, x, y, label }: { progress: MotionValue<number>; at: number; x: number; y: number; label: string }) {
  const on = useTransform(progress, [at - 0.05, at + 0.03], [0, 1]);
  return (
    <motion.g style={{ opacity: on }}>
      <line x1={x} y1={y} x2={x} y2={262} stroke="white" strokeOpacity={0.2} strokeDasharray="2 4" />
      <circle cx={x} cy={y} r={9} fill="hsl(16 98% 55%)" fillOpacity={0.25} />
      <circle cx={x} cy={y} r={4.5} fill="white" />
      <text x={x} y={278} textAnchor="middle" fill="white" fillOpacity={0.75} fontSize={13} fontWeight={600} className="font-display max-sm:hidden">
        {label}
      </text>
    </motion.g>
  );
}

function GrowthBand({ feature }: { feature: Feature }) {
  const [ref, inView] = useOnScreen<HTMLElement>();
  const reduced = useReducedMotion();
  const chart = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: chart, offset: ["start 85%", "end 95%"] });
  const done = useTransform(scrollYProgress, () => 1);
  const p = reduced ? done : scrollYProgress;
  // The shaded area is clipped to the drawn part of the line, so it never runs ahead of it.
  const clipWidth = useTransform(p, (v) => v * 600);
  const [points, setPoints] = useState<{ x: number; y: number; at: number }[]>([]);
  const n = feature.items.length;

  // Place each milestone on the curve, evenly by length.
  useEffect(() => {
    const el = path.current;
    if (!el) return;
    const total = el.getTotalLength();
    setPoints(
      feature.items.map((_, i) => {
        const at = (i + 0.5) / n;
        const pt = el.getPointAtLength(total * at);
        return { x: pt.x, y: pt.y, at };
      })
    );
  }, [feature.items, n]);

  return (
    <BandShell feature={feature} inView={inView} sectionRef={ref} stacked aside={<ItemList items={feature.items} columns />}>
      <div ref={chart} className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-white/[0.04] p-4 ring-1 ring-white/10 sm:p-8">
          <svg viewBox="0 0 600 290" className="h-auto w-full overflow-visible" role="img" aria-label={`Illustrative growth curve: ${feature.items.map((i) => i.title).join(", then ")}`}>
            <defs>
              <linearGradient id="growth-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(22 98% 58%)" />
                <stop offset="100%" stopColor="hsl(340 82% 60%)" />
              </linearGradient>
              <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(16 98% 55%)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(16 98% 55%)" stopOpacity={0} />
              </linearGradient>
              <clipPath id="growth-clip">
                <motion.rect x={0} y={0} height={290} width={clipWidth} />
              </clipPath>
            </defs>
            {[60, 120, 180, 240].map((y) => (
              <line key={y} x1={0} x2={600} y1={y} y2={y} stroke="white" strokeOpacity={0.06} />
            ))}
            <path d={`${CURVE} L 600 262 L 0 262 Z`} fill="url(#growth-area)" clipPath="url(#growth-clip)" />
            <motion.path ref={path} d={CURVE} fill="none" stroke="url(#growth-line)" strokeWidth={4} strokeLinecap="round" style={{ pathLength: p }} />
            {points.map((pt, i) => (
              <Milestone key={feature.items[i].title} progress={p} at={pt.at} x={pt.x} y={pt.y} label={feature.items[i].title} />
            ))}
          </svg>
          <p className="mt-2 text-right text-[11px] text-white/40">Illustrative: the typical shape of a test-and-scale campaign.</p>
        </div>

        {/* Lead pipeline */}
        <Reveal className="mt-10">
          <div className="relative mx-auto grid max-w-3xl grid-cols-4 gap-2">
            <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-6 h-px bg-white/15">
              <span className="pipeline-flow absolute -top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_3px_hsl(16_98%_55%/0.8)]" />
            </div>
            {PIPELINE.map(({ label, icon: Icon }) => (
              <div key={label} className="relative flex flex-col items-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(30_10%_20%)] ring-1 ring-white/15">
                  <Icon className="h-5 w-5 text-[hsl(22_98%_62%)]" />
                </span>
                <span className="text-xs font-medium text-white/70 sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </BandShell>
  );
}

/* ─────────────────────────── entry points ─────────────────────────── */

export function FeatureBand({ feature, image }: { feature: Feature; image?: string }) {
  switch (feature.kind) {
    case "campaign":
      return <CampaignBand feature={feature} />;
    case "funnel":
      return <FunnelBand feature={feature} />;
    case "build":
      return <BuildBand feature={feature} image={image} />;
    case "growth":
      return <GrowthBand feature={feature} />;
  }
}

/** Small floating card in the hero that previews the page's signature section. */
export function FeatureMini({ feature, still }: { feature: Feature; still: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      initial={still ? false : { opacity: 0, y: 40, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: -4 }}
      transition={{ duration: 1, delay: 0.65, ease: EASE }}
      className="glass absolute bottom-[13%] right-[0%] z-30 w-[46%] rounded-2xl p-3.5 sm:right-[6%] sm:p-4 lg:right-[-4%]"
    >
      <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{feature.eyebrow}</span>
      {feature.kind === "campaign" && (
        <span className="flex flex-wrap gap-1.5">
          {feature.items.map((item, i) => (
            <motion.span
              key={item.title}
              initial={still ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-[11px]", i === 0 ? "bg-ember text-white" : "bg-primary/10 text-foreground")}
            >
              {item.title}
            </motion.span>
          ))}
        </span>
      )}
      {feature.kind === "funnel" && (
        <span className="flex flex-col items-center gap-1">
          {feature.items.slice(0, 4).map((item, i) => (
            <motion.span
              key={item.title}
              initial={still ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.6, ease: EASE }}
              className="bg-ember block h-2.5 rounded-sm"
              style={{ width: `${100 - i * 18}%`, opacity: 0.45 + i * 0.18 }}
            />
          ))}
        </span>
      )}
      {feature.kind === "build" && (
        <span className="block overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
          <span className="flex gap-1 border-b border-black/5 px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex flex-col gap-1.5 p-2">
            {[80, 60, 90, 45].map((w, i) => (
              <motion.span
                key={i}
                initial={still ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1 + i * 0.12, duration: 0.5, ease: EASE }}
                className={cn("block h-1.5 origin-left rounded-full", i === 0 ? "bg-ember" : "bg-black/15")}
                style={{ width: `${w}%` }}
              />
            ))}
          </span>
        </span>
      )}
      {feature.kind === "growth" && (
        <svg viewBox="0 0 120 44" className="h-11 w-full overflow-visible">
          <motion.path
            d="M 2 40 C 20 39, 34 37, 46 33 S 70 26, 84 16 S 108 5, 118 3"
            fill="none"
            stroke="hsl(16 98% 55%)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={still || reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 1.4, ease: EASE }}
          />
          <circle cx={118} cy={3} r={3} fill="hsl(16 98% 55%)" />
        </svg>
      )}
    </motion.div>
  );
}
