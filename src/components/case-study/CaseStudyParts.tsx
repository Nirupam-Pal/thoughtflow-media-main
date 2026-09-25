/* eslint-disable react-refresh/only-export-components -- a small kit of layout pieces + helpers */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { PORTFOLIO_PROJECTS, type PortfolioProject, type ProjectMetric } from "@/data/portfolioData";
import { Button } from "@/components/ui/button";
import { BookCallButton } from "@/components/BookCallButton";
import Marquee from "@/components/ui/marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isPrerenderedDocument } from "@/lib/prerender";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { useMediaCursor } from "./MediaCursor";

/*
 * Shared building blocks for the case-study pages (video, design…). Each page supplies its own
 * media tiles and hero visual; the structure, typography and motion live here so the pages stay
 * consistent with each other and with the rest of the site.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const sectionId = (title: string) =>
  `work-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

/** The project after this one in the portfolio (wrapping), or undefined if it's the only one. */
/** The project `step` places away in the portfolio (wrapping), or undefined if it's the only one. */
function projectAt(project: PortfolioProject, step: number) {
  const n = PORTFOLIO_PROJECTS.length;
  const i = PORTFOLIO_PROJECTS.findIndex((p) => p.slug === project.slug);
  const other = PORTFOLIO_PROJECTS[(((i + step) % n) + n) % n];
  return other.slug === project.slug ? undefined : other;
}

export const nextProjectOf = (project: PortfolioProject) => projectAt(project, 1);

/** Top row of a case study: back to the portfolio on the left, "Case 06 / 06" and prev/next on the right. */
function CaseBar({ project }: { project: PortfolioProject }) {
  const index = PORTFOLIO_PROJECTS.findIndex((p) => p.slug === project.slug);
  const prev = projectAt(project, -1);
  const next = projectAt(project, 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  const step = "glass-flat flex h-10 w-10 items-center justify-center rounded-full text-foreground transition duration-300 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <nav aria-label="Case studies" className="mb-8 flex items-center justify-between gap-4 border-b border-primary/10 pb-4 lg:mb-6">
      <Button variant="ghost" className="group -ml-3 rounded-full text-muted-foreground hover:text-foreground" asChild>
        <Link to="/#portfolio">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Portfolio
        </Link>
      </Button>
      <div className="flex items-center gap-3 sm:gap-4">
        {index >= 0 && (
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:inline">
            Case <span className="font-display text-sm tabular-nums text-foreground">{pad(index + 1)}</span>
            <span className="mx-1 text-primary/30">/</span>
            <span className="font-display text-sm tabular-nums">{pad(PORTFOLIO_PROJECTS.length)}</span>
          </span>
        )}
        {prev && (
          <Link to={`/portfolio/${prev.slug}`} aria-label={`Previous case study: ${prev.title}`} title={prev.title} className={step}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
        {next && (
          <Link to={`/portfolio/${next.slug}`} aria-label={`Next case study: ${next.title}`} title={next.title} className={step}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export function Eyebrow({ children, pulse, dark }: { children: ReactNode; pulse?: boolean; dark?: boolean }) {
  return (
    <span
      className={cn(
        "mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide sm:text-[13px]",
        dark ? "bg-white/10 text-white/70 ring-1 ring-white/15" : "glass text-muted-foreground"
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(16_98%_55%)] opacity-60 motion-reduce:animate-none" />}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(16_98%_55%)]" />
      </span>
      {children}
    </span>
  );
}

/* ─────────────────────────── hero ─────────────────────────── */

export function CaseHero({
  project,
  deliverables,
  primary,
  visual,
}: {
  project: PortfolioProject;
  /** Last entry of the metadata strip, e.g. "25 videos". */
  deliverables: string;
  primary: { label: string; icon: LucideIcon; onClick: () => void };
  /** The right-hand visual; `still` is true when entrance animations should be skipped. */
  visual: (still: boolean) => ReactNode;
}) {
  const reduced = useReducedMotion();
  const still = !!reduced || isPrerenderedDocument();
  const words = project.title.split(" ");
  const split = Math.ceil(words.length / 2);
  const lines = [words.slice(0, split), words.slice(split)];
  const PrimaryIcon = primary.icon;

  const meta: ProjectMetric[] = [
    { label: "Service", value: project.category },
    ...(project.story?.meta ?? []),
    { label: "Deliverables", value: deliverables },
  ];

  const fade = (delay: number) =>
    still
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } };

  let w = 0;
  return (
    <section aria-labelledby="case-title" className="section-aurora relative overflow-x-clip pb-14 pt-24 sm:pb-20 sm:pt-28 lg:pt-32">
      <div className="grain absolute inset-0 -z-10 opacity-[0.05]" />
      <div className="hero-fine-grid absolute inset-0 -z-10 opacity-70" />

      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <motion.div {...fade(0)}>
          <CaseBar project={project} />
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
          <div className="min-w-0 text-center lg:text-left">
            <motion.div {...fade(0.05)}>
              <Eyebrow pulse>Case Study · {project.category}</Eyebrow>
            </motion.div>

            <h1 id="case-title" className="font-display text-[clamp(2.6rem,6.6vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.035em]">
              {lines.map((line, l) => (
                <span key={l} className="block">
                  {line.map((word) => {
                    const i = w++;
                    return (
                      <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                        <motion.span
                          className={cn("inline-block", l === 1 && "text-ember")}
                          initial={still ? false : { y: "110%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1, delay: 0.12 + i * 0.08, ease: EASE }}
                        >
                          {word}
                        </motion.span>
                        {/* Non-breaking: a normal trailing space collapses inside the inline-block. */}
                        {" "}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>

            <motion.p {...fade(0.45)} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:mx-0">
              {project.description}
            </motion.p>

            <motion.div {...fade(0.55)} className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Magnetic>
                <button
                  type="button"
                  onClick={primary.onClick}
                  className="group inline-flex items-center gap-3 rounded-full bg-primary py-2 pl-2 pr-6 font-medium text-primary-foreground shadow-soft transition-shadow duration-300 hover:shadow-medium"
                >
                  <span className="bg-ember flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                    <PrimaryIcon className="h-4 w-4 text-white" />
                  </span>
                  {primary.label}
                </button>
              </Magnetic>
              <button
                type="button"
                onClick={() => scrollToTarget("#work-heading")}
                className="glass-flat group inline-flex h-14 items-center gap-2 rounded-full px-6 font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:shadow-medium"
              >
                Explore the work
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </motion.div>
          </div>

          {visual(still)}
        </div>

        {/* Project metadata */}
        <motion.dl {...fade(0.7)} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-primary/10 pt-6 sm:mt-14 md:grid-cols-3 lg:grid-cols-5">
          {meta.map((m, i) => (
            <div key={m.label} className={cn("min-w-0", i === meta.length - 1 && meta.length % 2 === 1 && "col-span-2 md:col-span-1")}>
              <dt className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{m.label}</dt>
              <dd className="font-display text-base font-semibold leading-snug sm:text-lg">{m.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

export type StackCard = { key: string | number; label: string; content: ReactNode; onOpen: () => void };

/**
 * Three cards fanned out (front first, then left, then right) that drift apart while scrolling,
 * plus a floating caption and a count badge. Used as the hero visual.
 */
export function FannedStack({
  cards,
  still,
  aspect,
  cursor,
  caption,
  badge,
  children,
}: {
  cards: StackCard[];
  still: boolean;
  /** Tailwind aspect class for every card, e.g. "aspect-[9/16]". */
  aspect: string;
  cursor: { label: string; kind: "play" | "view" };
  caption?: { eyebrow: string; title: string };
  badge: { value: number; label: string };
  /** Extra floating pieces positioned inside the stage. */
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const pointer = useMediaCursor();
  const { scrollY } = useScroll();
  const k = reduced ? 0 : 1;
  const yFront = useTransform(scrollY, [0, 800], [0, -40 * k]);
  const yLeft = useTransform(scrollY, [0, 800], [0, -120 * k]);
  const yRight = useTransform(scrollY, [0, 800], [0, -190 * k]);
  const [front, left, right] = cards;

  const slots: { card?: StackCard; y: MotionValue<number>; rotate: number; className: string; delay: number }[] = [
    { card: left, y: yLeft, rotate: -9, className: "left-[2%] top-[10%] z-10 w-[40%] sm:left-[8%] lg:left-[2%]", delay: 0.35 },
    { card: right, y: yRight, rotate: 8, className: "right-[2%] top-[22%] z-10 w-[40%] sm:right-[8%] lg:right-[0%]", delay: 0.45 },
    { card: front, y: yFront, rotate: -1.5, className: "left-[24%] top-[2%] z-20 w-[52%] sm:left-[28%] sm:w-[44%] lg:left-[24%] lg:w-[52%]", delay: 0.2 },
  ];

  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[520px]">
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,hsl(16_98%_58%/0.35),transparent_65%)] blur-2xl" />
      {slots.map(({ card, y, rotate, className, delay }) =>
        card ? (
          <motion.div key={card.key} style={{ y }} className={cn("absolute", className)}>
            <motion.div
              initial={still ? false : { opacity: 0, y: 90, rotate: 0, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
              transition={{ duration: 1.1, delay, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => {
                  pointer.hide();
                  card.onOpen();
                }}
                onPointerEnter={(e) => e.pointerType === "mouse" && pointer.show(cursor.label, cursor.kind)}
                onPointerLeave={(e) => e.pointerType === "mouse" && pointer.hide()}
                aria-haspopup="dialog"
                aria-label={card.label}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-[1.5rem] bg-primary shadow-[0_30px_70px_-20px_hsl(30_10%_15%/0.5)] ring-1 ring-white/40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [@media(hover:hover)]:cursor-none",
                  aspect
                )}
              >
                {card.content}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </button>
            </motion.div>
          </motion.div>
        ) : null
      )}

      {children}

      {caption && (
        <motion.div
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="glass absolute bottom-[4%] left-[4%] z-30 flex max-w-[72%] items-center gap-3 rounded-2xl px-3.5 py-2.5 sm:left-[10%] lg:left-[0%]"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(16_98%_55%)] opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(16_98%_55%)]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{caption.eyebrow}</span>
            <span className="block truncate font-display text-sm font-semibold">{caption.title}</span>
          </span>
        </motion.div>
      )}
      <motion.div
        initial={still ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: EASE }}
        className="glass absolute right-[3%] top-[2%] z-30 rounded-2xl px-4 py-2.5 text-center sm:right-[10%] lg:right-[2%]"
      >
        <span className="block font-display text-2xl font-bold tabular-nums leading-none">{badge.value}</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{badge.label}</span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── ticker ─────────────────────────── */

export function Ticker({ words }: { words: string[] }) {
  if (words.length === 0) return null;
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-primary/10 bg-background py-4 sm:py-5 motion-reduce:[&_.animate-marquee]:[animation-play-state:paused]">
      <Marquee className="p-0 [--duration:55s] [--gap:2rem]" repeat={3}>
        {words.map((word) => (
          <span key={word} className="flex items-center gap-8 whitespace-nowrap font-display text-xl font-semibold tracking-tight text-foreground/80 sm:text-3xl">
            {word}
            <span className="text-ember text-base sm:text-xl">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ─────────────────────────── approach ─────────────────────────── */

export function Approach({ statement, points }: { statement: string; points: { title: string; description: string }[] }) {
  return (
    <section aria-labelledby="approach-heading" className="relative overflow-x-clip bg-background py-20 sm:py-28 lg:py-36">
      <div className="container mx-auto grid min-w-0 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Our Approach</Eyebrow>
          </Reveal>
          <h2 id="approach-heading">
            <ScrubText text={statement} />
          </h2>
        </div>

        <Stagger className="flex flex-col justify-end lg:col-span-5">
          {points.map((p, i) => (
            <StaggerItem key={p.title} className="border-t border-primary/10 py-6 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-6">
              <div className="flex gap-5">
                <span className="font-display text-sm font-semibold tabular-nums text-ember">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="mb-1.5 font-display text-xl font-semibold">{p.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** "One. Two: three" → ["One. Two:", "three"] */
function splitLastClause(text: string): [string, string] {
  const m = text.match(/^(.*[.:])\s+(.*)$/);
  return m ? [m[1], m[2]] : [text, ""];
}

/** Words brighten one by one as the paragraph scrolls through the viewport. The last clause (after the final "." or ":") gets the ember accent. */
function ScrubText({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const [lead, accent] = splitLastClause(text);
  const words = [...lead.split(" ").map((w) => ({ w, a: false })), ...(accent ? accent.split(" ").map((w) => ({ w, a: true })) : [])];

  return (
    <span ref={ref} className="block font-display text-[clamp(1.85rem,4.2vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
      {words.map(({ w, a }, i) => (
        <ScrubWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={a} still={!!reduced}>
          {w}
        </ScrubWord>
      ))}
    </span>
  );
}

function ScrubWord({
  progress,
  range,
  accent,
  still,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  still: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={still ? undefined : { opacity }} className={cn(accent && "text-ember")}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/* ─────────────────────────── the work ─────────────────────────── */

/** "Selected work" wrapper: centred heading, a jump-nav of collections, then the collections. */
export function WorkSection({
  title,
  accent,
  description,
  collections,
  children,
}: {
  title: string;
  accent: string;
  description: string;
  collections: { title: string; count: number }[];
  children: ReactNode;
}) {
  return (
    <section aria-labelledby="work-heading" className="section-aurora relative overflow-x-clip py-20 sm:py-24 lg:py-32">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader id="work-heading" eyebrow="Selected Work" title={title} accent={accent} description={description} className="mb-8 sm:mb-10" />
        {collections.length > 1 && (
        <Reveal className="mb-16 flex flex-wrap justify-center gap-2 sm:mb-24 sm:gap-3">
          <nav aria-label="Collections" className="contents">
            {collections.map((c) => (
              <button
                key={c.title}
                type="button"
                onClick={() => scrollToTarget(`#${sectionId(c.title)}`)}
                className="glass-flat group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-secondary-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {c.title}
                <span className="rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold tabular-nums transition-colors group-hover:bg-white/20 sm:text-xs">
                  {c.count}
                </span>
              </button>
            ))}
          </nav>
        </Reveal>
        )}
        <div className="space-y-24 sm:space-y-32 lg:space-y-40">{children}</div>
      </div>
    </section>
  );
}

/** Numbered collection heading with a masked title reveal and a couple of stats on the right. */
export function ShowcaseSection({
  title,
  description,
  number,
  total,
  stats,
  children,
}: {
  title: string;
  description?: string;
  number: number;
  total: number;
  stats: ProjectMetric[];
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const id = sectionId(title);

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <header className="mb-8 grid gap-4 border-t border-primary/10 pt-6 sm:mb-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-display text-sm font-semibold tabular-nums text-muted-foreground">
            <span className="text-ember">{String(number).padStart(2, "0")}</span>
            <span className="mx-1.5 text-primary/30">/</span>
            {String(total).padStart(2, "0")}
          </p>
          {/* The observer sits on the <h3>: the span starts fully clipped, so it could never "intersect" itself. */}
          <motion.h3
            id={`${id}-title`}
            className="overflow-hidden pb-[0.08em] font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            initial={reduced ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          >
            <motion.span className="block" variants={{ hidden: { y: "105%" }, shown: { y: 0 } }} transition={{ duration: 0.9, ease: EASE }}>
              {title}
            </motion.span>
          </motion.h3>
          {description && (
            <motion.p
              className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              {description}
            </motion.p>
          )}
        </div>
        <dl className="flex gap-6 text-sm md:text-right">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      {children}
    </section>
  );
}

/* ─────────────────────────── layouts ─────────────────────────── */

/**
 * Tile entrance: a bottom-up mask wipe while the tile rises. Runs once, and the clip is dropped
 * afterwards so it can't cut off the tile's hover lift and shadow.
 */
export function MaskReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { clipPath: "inset(22% 0% 0% 0% round 24px)", y: 48, opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", y: 0, opacity: 1, transitionEnd: { clipPath: "none" } }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Column count per breakpoint. Starts at the desktop value so it matches the prerendered HTML. */
function useColumns(lg: number, md: number, base: number) {
  const [cols, setCols] = useState(lg);
  useIsoLayoutEffect(() => {
    const qLg = window.matchMedia("(min-width: 1024px)");
    const qMd = window.matchMedia("(min-width: 768px)");
    const update = () => setCols(qLg.matches ? lg : qMd.matches ? md : base);
    update();
    qLg.addEventListener("change", update);
    qMd.addEventListener("change", update);
    return () => {
      qLg.removeEventListener("change", update);
      qMd.removeEventListener("change", update);
    };
  }, [lg, md, base]);
  return cols;
}

// Per-column drift in px over the section's pass through the viewport. Alternating directions read as depth.
const DRIFT = [40, -70, 20, -100];

function DriftColumn({ progress, col, children }: { progress: MotionValue<number>; col: number; children: ReactNode }) {
  const d = DRIFT[col % DRIFT.length];
  const y = useTransform(progress, [0, 1], [d, -d]);
  return (
    <motion.div style={{ y }} className={cn("flex flex-col gap-4 sm:gap-6", col % 2 === 1 && "pt-12 sm:pt-20")}>
      {children}
    </motion.div>
  );
}

/** Items dealt into columns that drift at different speeds while the section scrolls by. */
export function ParallaxColumns<T>({
  items,
  keyOf,
  render,
  columns = [4, 3, 2],
}: {
  items: T[];
  keyOf: (item: T) => string | number;
  render: (item: T) => ReactNode;
  /** [desktop, tablet, phone] */
  columns?: [number, number, number];
}) {
  const cols = useColumns(...columns);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useTransform(scrollYProgress, () => 0.5);
  const progress = reduced ? still : scrollYProgress;
  const dealt = Array.from({ length: cols }, (_, c) => items.filter((_, i) => i % cols === c));

  return (
    <div ref={ref} className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {dealt.map((col, c) => (
        <DriftColumn key={c} col={c} progress={progress}>
          {col.map((item, i) => (
            <MaskReveal key={keyOf(item)} delay={(c * 0.07 + i * 0.05) % 0.35}>
              {render(item)}
            </MaskReveal>
          ))}
        </DriftColumn>
      ))}
    </div>
  );
}

export type EditorialRole = "feature" | "side" | "pair" | "solo";

/**
 * Groups of three: a large feature with two stacked tiles beside it, mirrored on every other
 * group; a trailing pair sits side by side. Rather than strand one leftover tile, the last four
 * become two pairs (a lone item is only centred when it is the only one).
 * `render` must make "feature" tiles fill their cell's height on large screens.
 */
export function EditorialGrid<T>({
  items,
  keyOf,
  render,
}: {
  items: T[];
  keyOf: (item: T) => string | number;
  render: (item: T, role: EditorialRole) => ReactNode;
}) {
  const groups: T[][] = [];
  const pairedTail = items.length > 3 && items.length % 3 === 1 ? 4 : 0;
  const head = items.length - pairedTail;
  for (let i = 0; i < head; i += 3) groups.push(items.slice(i, i + 3));
  if (pairedTail) groups.push(items.slice(head, head + 2), items.slice(head + 2));

  return (
    <div className="space-y-4 sm:space-y-6">
      {groups.map((group, g) => {
        const flip = g % 2 === 1;
        if (group.length === 3) {
          const [feature, ...side] = group;
          return (
            <div key={g} className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12">
              <MaskReveal className={cn("sm:col-span-2 lg:col-span-8 lg:row-span-2", flip && "lg:col-start-5 lg:row-start-1")}>
                {render(feature, "feature")}
              </MaskReveal>
              {side.map((item, i) => (
                <MaskReveal key={keyOf(item)} delay={0.08 + i * 0.08} className={cn("lg:col-span-4", flip && "lg:col-start-1")}>
                  {render(item, "side")}
                </MaskReveal>
              ))}
            </div>
          );
        }
        return (
          <div key={g} className={cn("grid gap-4 sm:gap-6", group.length === 2 ? "sm:grid-cols-2" : "lg:mx-auto lg:w-2/3")}>
            {group.map((item, i) => (
              <MaskReveal key={keyOf(item)} delay={i * 0.08}>
                {render(item, group.length === 1 ? "solo" : "pair")}
              </MaskReveal>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── CTA ─────────────────────────── */

export function ClosingCta({
  eyebrow,
  title,
  accent,
  body,
  peeks,
  next,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  /** Up to two decorative pieces of work peeking in from the card's edges (large screens only). */
  peeks: ReactNode[];
  next?: PortfolioProject;
}) {
  return (
    <section id="start" aria-labelledby="cta-heading" className="relative overflow-x-clip bg-background py-20 sm:py-28 lg:py-32">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-premium px-6 py-14 text-center shadow-medium sm:rounded-[2.5rem] sm:px-12 sm:py-20 lg:py-28">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,hsl(16_95%_72%/0.4),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,hsl(38_45%_86%),transparent_60%)]" />
            <div className="hero-fine-grid absolute inset-0 opacity-60" />
            <div className="grain absolute inset-0 opacity-[0.05]" />

            {peeks.slice(0, 2).map((peek, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={cn(
                  "absolute hidden w-36 overflow-hidden rounded-2xl shadow-medium ring-4 ring-white/70 lg:block xl:w-44",
                  i === 0 ? "svc-float -left-6 top-12 -rotate-12" : "svc-float-b -right-6 bottom-10 rotate-12"
                )}
              >
                {peek}
              </div>
            ))}

            <div className="relative z-10 mx-auto max-w-3xl">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 id="cta-heading" className="text-balance font-display text-[clamp(2.1rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-tight">
                {title} <span className="text-ember">{accent}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{body}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Magnetic className="w-full sm:w-auto">
                  <Link
                    to="/#contact"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-soft transition-shadow duration-300 hover:shadow-medium sm:w-auto"
                  >
                    Start a project
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
                <Magnetic className="w-full sm:w-auto">
                  <BookCallButton
                    size="lg"
                    variant="outline"
                    className="glass h-auto w-full rounded-full border-2 border-primary/20 px-7 py-3.5 hover:border-primary/40 hover:bg-background/60 sm:w-auto"
                  />
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>

        {next && (
          <Reveal className="mx-auto mt-10 max-w-6xl sm:mt-14">
            <Link
              to={`/portfolio/${next.slug}`}
              className="group flex items-center justify-between gap-6 border-t border-primary/10 pt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            >
              <span className="min-w-0">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Next case study</span>
                <span className="block text-balance font-display text-3xl font-bold tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-5xl">
                  {next.title}
                </span>
              </span>
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 sm:h-16 sm:w-16">
                <span className="bg-ember absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <ArrowUpRight className="relative h-6 w-6" />
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
