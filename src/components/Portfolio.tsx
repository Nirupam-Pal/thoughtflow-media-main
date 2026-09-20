import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Film, Image as ImageIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useWillChange } from "framer-motion";
import { PORTFOLIO_PROJECTS, type PortfolioProject } from "@/data/portfolioData";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";
import { useSlowConnection } from "@/lib/connection";

/*
 * Motion model for this section
 * ─────────────────────────────
 * Everything that moves is a Framer Motion spring on transform/opacity, so it stays
 * on the compositor and never fights a CSS transition (there are none on these
 * elements). Four spring "feels":
 *   UI      – snappy, for hover state changes
 *   ENTER   – slow and floaty, for cards gliding in on scroll
 *   REVEAL  – very soft, for the image settling out of its zoom
 *   LAYOUT  – firm, for cards re-flowing when a filter changes
 */
const SPRING_UI = { type: "spring", stiffness: 260, damping: 26, mass: 0.8 } as const;
const SPRING_ENTER = { type: "spring", stiffness: 90, damping: 20, mass: 0.9 } as const;
const SPRING_REVEAL = { type: "spring", stiffness: 40, damping: 18, mass: 1.1 } as const;
const SPRING_LAYOUT = { type: "spring", stiffness: 240, damping: 30 } as const;
const NO_MOTION = { duration: 0 } as const;

const IN_VIEW = { once: true, margin: "0px 0px -8% 0px" } as const;

/** Honest, data-derived facts for every card; real `metrics` (if set) take over the headline slot. */
function assetCounts(project: PortfolioProject) {
  const videos = project.videoSections?.reduce((n, s) => n + s.videos.length, 0) ?? 0;
  const images = project.imageSections?.reduce((n, s) => n + s.images.length, 0) ?? project.gallery.length;
  return { videos, images };
}

/**
 * The card is a 4:5 portrait crop, so ask the image CDN for exactly that crop at the width we need
 * (instead of a 4:3 landscape the browser then has to crop and downscale). Cuts bytes ~35%.
 * Non-Unsplash images are returned untouched.
 */
function cropUrl(url: string, width: number, quality: number) {
  if (!url.includes("images.unsplash.com")) return url;
  const u = new URL(url);
  u.searchParams.set("w", String(width));
  u.searchParams.set("h", String(Math.round(width * 1.25)));
  u.searchParams.set("fit", "crop");
  u.searchParams.set("q", String(quality));
  u.searchParams.set("auto", "format");
  return u.toString();
}

/** Tracks an element's height so the grid wrapper can spring to it (no abrupt page jump on filter). */
function useMeasuredHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, height] as const;
}

// forwardRef: AnimatePresence(popLayout) attaches a ref to each direct child to measure it.
const CaseCard = forwardRef<HTMLDivElement, { project: PortfolioProject; index: number; reduced: boolean }>(function CaseCard(
  { project, index, reduced },
  ref
) {
  const willChange = useWillChange();
  const slow = useSlowConnection();
  const [open, setOpen] = useState(false);
  const { videos, images } = assetCounts(project);
  const ui = reduced ? NO_MOTION : SPRING_UI;
  const mouseOnly = (fn: () => void) => (e: React.PointerEvent) => e.pointerType === "mouse" && fn();

  return (
    <motion.div
      ref={ref}
      layout={reduced ? false : "position"}
      style={{ willChange }}
      initial={reduced ? false : { opacity: 0, y: 56, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={IN_VIEW}
      exit={reduced ? undefined : { opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
      transition={reduced ? NO_MOTION : { default: { ...SPRING_ENTER, delay: (index % 3) * 0.08 }, layout: SPRING_LAYOUT }}
    >
      <TiltCard className="rounded-3xl" max={6} spotlightOver>
        <Link
          to={`/portfolio/${project.slug}`}
          onPointerEnter={mouseOnly(() => setOpen(true))}
          onPointerLeave={mouseOnly(() => setOpen(false))}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="relative block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* Gradient border */}
          <motion.span
            className="pointer-events-none absolute -inset-px rounded-[calc(1.5rem+1px)] bg-ember"
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={ui}
          />

          <article className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-primary shadow-medium">
            {/* Image: springs from a slight zoom on scroll-in, then zooms again on hover.
                Two nested layers so the two animations never fight over one transform. */}
            <motion.div
              className="absolute inset-0"
              initial={reduced ? false : { scale: 1.22 }}
              whileInView={{ scale: 1 }}
              viewport={IN_VIEW}
              transition={reduced ? NO_MOTION : SPRING_REVEAL}
            >
              <motion.img
                // Phones get a 480px crop, big screens 720px. On a slow link / Data Saver: 480px, lower quality.
                src={cropUrl(project.image, slow ? 480 : 720, slow ? 55 : 68)}
                srcSet={
                  slow
                    ? undefined
                    : `${cropUrl(project.image, 480, 68)} 480w, ${cropUrl(project.image, 720, 68)} 720w`
                }
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, 92vw"
                width={720}
                height={900}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                initial={false}
                animate={{ scale: open ? 1.07 : 1 }}
                transition={ui}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/30" />

            {/* Top row: index + arrow */}
            <div className="absolute inset-x-4 top-4 flex items-start justify-between sm:inset-x-5 sm:top-5">
              <span className="glass-solid rounded-full px-3 py-1 font-display text-xs font-semibold tabular-nums text-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <motion.span
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-medium"
                initial={false}
                animate={{ rotate: open ? 45 : 0 }}
                transition={ui}
              >
                <motion.span
                  className="absolute inset-0 bg-ember"
                  initial={false}
                  animate={{ opacity: open ? 1 : 0 }}
                  transition={ui}
                />
                <motion.span
                  className="relative"
                  initial={false}
                  animate={{ color: open ? "rgb(255,255,255)" : "rgb(42,38,35)" }}
                  transition={ui}
                >
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </motion.span>
              </motion.span>
            </div>

            {/* Bottom: title panel is always there; a details panel springs up above it.
                Both are opaque (no backdrop blur) so tilting the card stays cheap. */}
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
              <div className="relative">
                <motion.div
                  className={cn(
                    "glass-solid pointer-events-none absolute inset-x-0 bottom-full mb-2 origin-bottom rounded-2xl p-4",
                    // Touch has no hover, so keep the details visible there.
                    "[@media(hover:none)]:!opacity-100 [@media(hover:none)]:![transform:none]"
                  )}
                  initial={false}
                  animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
                  transition={ui}
                >
                  <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

                  {project.metrics && project.metrics.length > 0 ? (
                    <dl className="mt-3 flex gap-6 border-t border-primary/10 pt-3">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="flex flex-col-reverse">
                          <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            {m.label}
                          </dt>
                          <dd className="font-display text-2xl font-bold tabular-nums text-ember">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-primary/10 pt-3 text-xs font-medium text-foreground/80">
                      {videos > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Film className="h-3.5 w-3.5" /> {videos} videos
                        </span>
                      )}
                      {images > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5" /> {images} visuals
                        </span>
                      )}
                      <span className="ml-auto inline-flex items-center gap-1 text-foreground">
                        View  <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  )}
                </motion.div>

                <div className="glass-solid rounded-2xl p-4 sm:p-5">
                  <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(16_98%_55%)]" />
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight text-foreground sm:text-2xl">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </TiltCard>
    </motion.div>
  );
});

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const reduced = !!useReducedMotion();
  const [gridRef, gridHeight] = useMeasuredHeight();

  // Categories come from the data, so a new category never needs a code change.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PORTFOLIO_PROJECTS.map((p) => p.category)))],
    []
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>([["All", PORTFOLIO_PROJECTS.length]]);
    PORTFOLIO_PROJECTS.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, []);

  const filtered =
    activeCategory === "All" ? PORTFOLIO_PROJECTS : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section aria-labelledby="portfolio-heading" id="portfolio" className="section-aurora relative overflow-x-clip bg-background py-16 sm:py-20 lg:py-32">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          id="portfolio-heading"
          eyebrow="Case Studies"
          title="Work that"
          accent="moves the needle"
          description="Campaigns, content and builds we've shipped for brands across Northeast India."
        />

        {/* Filters — the active pill glides between options */}
        <Reveal className="mb-10 flex flex-wrap justify-center gap-2 px-1 sm:mb-14 sm:gap-3">
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-center text-xs font-medium leading-tight transition-colors duration-300 sm:px-6 sm:py-2.5 sm:text-base",
                  active ? "text-primary-foreground" : "glass-flat text-secondary-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 rounded-full bg-primary shadow-soft"
                    transition={reduced ? NO_MOTION : { type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{category}</span>
                <span
                  className={cn(
                    "relative rounded-full px-1.5 text-[10px] font-semibold tabular-nums sm:text-xs",
                    active ? "bg-white/20" : "bg-primary/10"
                  )}
                >
                  {counts.get(category)}
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* The wrapper springs to the grid's height, so when a filter removes cards the
            sections below glide up instead of snapping. Cards re-flow with position-only
            layout animations (no image squashing). */}
        <motion.div
          initial={false}
          animate={{ height: gridHeight ?? "auto" }}
          transition={reduced ? NO_MOTION : SPRING_LAYOUT}
        >
          <div ref={gridRef} className="relative mx-auto grid min-w-0 max-w-7xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((project, index) => (
                <CaseCard key={project.slug} project={project} index={index} reduced={reduced} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <Reveal className="mt-14 flex flex-col items-center gap-3 text-center sm:mt-16">
          <p className="text-muted-foreground">Have a project in mind?</p>
          <Magnetic>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground shadow-soft transition-shadow duration-300 hover:shadow-medium"
            >
              Let's build yours next
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
};

export default Portfolio;
