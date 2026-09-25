import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, ClipboardList, Heart, Images, Lightbulb, Maximize2, MessageCircle, PenTool, Send } from "lucide-react";
import type { ImageSectionLayout, PortfolioProject } from "@/data/portfolioData";
import Process from "@/components/Process";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { SmartImage } from "@/components/SmartImage";
import Marquee from "@/components/ui/marquee";
import { EASE, useFinePointer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { buildGallery, imageLayout, imageWidths, smallestVariant, type GalleryEntry } from "@/lib/design";
import { MediaCursorProvider, useMediaCursor } from "./MediaCursor";
import { MediaLightbox, type LightboxItem } from "./MediaLightbox";
import {
  Approach,
  CaseHero,
  ClosingCta,
  EditorialGrid,
  Eyebrow,
  FannedStack,
  MaskReveal,
  ParallaxColumns,
  ShowcaseSection,
  Ticker,
  WorkSection,
  nextProjectOf,
} from "./CaseStudyParts";
import { ImageTile } from "./ImageTile";

const PROCESS_ICONS = [ClipboardList, Lightbulb, PenTool, Send];

/** Short plural noun for a layout, used in stats ("13 Posters"). */
const LAYOUT_NOUN: Record<ImageSectionLayout, string> = { wall: "Posters", editorial: "Thumbnails", billboard: "Banners" };
const LAYOUT_FORMAT: Record<ImageSectionLayout, string> = { wall: "4:5", editorial: "16:9", billboard: "Print" };

/**
 * Case-study layout for design work (posters, thumbnails, banners). Shares its structure with the
 * video case study; the work itself is shown as a drifting poster wall, an editorial thumbnail
 * grid and framed prints, plus an "in the feed" phone mockup. Everything comes from project data.
 */
export function DesignCaseStudy({ project }: { project: PortfolioProject }) {
  const sections = useMemo(() => (project.imageSections ?? []).filter((s) => s.images.length > 0), [project]);
  const gallery = useMemo(() => buildGallery(sections), [sections]);
  const lightboxItems = useMemo(() => gallery.map(toLightboxItem), [gallery]);
  const story = project.story;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setOpenIndex(i), []);

  const bySrc = (src: string) => gallery.find((e) => e.item.src === src);
  const inLayout = (layout: ImageSectionLayout) => gallery.filter((e) => imageLayout(e.section) === layout);
  const posters = inLayout("wall");
  const thumbnails = inLayout("editorial");
  const picked = (story?.heroImages ?? []).map(bySrc).filter((e): e is GalleryEntry => !!e);
  const heroEntries = picked.length ? picked : posters.slice(0, 3);

  let offset = 0;
  const sectionEntries = sections.map((s) => {
    const slice = gallery.slice(offset, offset + s.images.length);
    offset += s.images.length;
    return slice;
  });

  return (
    <MediaCursorProvider>
      <main className="min-w-0 flex-1">
        <CaseHero
          project={project}
          deliverables={`${gallery.length} designs`}
          primary={{ label: "View the gallery", icon: Images, onClick: () => open(heroEntries[0]?.index ?? 0) }}
          visual={(still) => (
            <FannedStack
              still={still}
              aspect="aspect-[4/5]"
              cursor={{ label: "View", kind: "view" }}
              badge={{ value: gallery.length, label: "Designs" }}
              caption={heroEntries[0] && { eyebrow: "Featured design", title: heroEntries[0].item.tag ?? heroEntries[0].section.title }}
              cards={heroEntries.map((e, i) => ({
                key: e.index,
                label: `View design: ${e.item.alt}`,
                onOpen: () => open(e.index),
                content: (
                  <SmartImage
                    src={e.item.src}
                    widths={imageWidths(e.item.src)}
                    sizes="(min-width: 1024px) 280px, 45vw"
                    priority={i === 0}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ),
              }))}
            >
              {thumbnails[0] && <HeroThumbnail entry={thumbnails[0]} still={still} onOpen={open} />}
            </FannedStack>
          )}
        />

        <Ticker words={[...new Set(gallery.map((e) => e.item.tag ?? e.section.title))]} />

        {story?.approach && <Approach statement={story.approach.statement} points={story.approach.points} />}

        <WorkSection
          title="One message."
          accent="Zero noise."
          description={`${gallery.length} designs across ${sections.length} formats. Tap any piece to see it full size.`}
          collections={sections.map((s) => ({ title: s.title, count: s.images.length }))}
        >
          {sections.map((s, i) => {
            const layout = imageLayout(s);
            return (
              <ShowcaseSection
                key={s.title}
                title={s.title}
                description={s.description}
                number={i + 1}
                total={sections.length}
                stats={[
                  { label: LAYOUT_NOUN[layout], value: String(s.images.length) },
                  { label: "Format", value: LAYOUT_FORMAT[layout] },
                ]}
              >
                {layout === "wall" && <PosterWall entries={sectionEntries[i]} onOpen={open} />}
                {layout === "editorial" && <ThumbnailGrid entries={sectionEntries[i]} onOpen={open} />}
                {layout === "billboard" && <Billboard entries={sectionEntries[i]} onOpen={open} />}
              </ShowcaseSection>
            );
          })}
        </WorkSection>

        {story?.process && story.process.length > 0 && (
          <Process
            id="design-process"
            eyebrow="Design Process"
            title="From brief to"
            accent="final files"
            description="Four steps that keep every design on-message, on-brand and ready for wherever it runs."
            steps={story.process.map((step, i) => ({ ...step, icon: PROCESS_ICONS[i % PROCESS_ICONS.length] }))}
          />
        )}

        {posters.length > 0 && (
          <FeedBand
            posters={posters}
            thumbnails={thumbnails}
            stats={sections.map((s) => ({ label: LAYOUT_NOUN[imageLayout(s)], value: s.images.length }))}
            onOpen={open}
          />
        )}

        <ClosingCta
          eyebrow="Your brand next"
          title="Need designs that"
          accent="stop the thumb?"
          body="Let's make them. Posters, thumbnails and banners built around one clear message, in your brand's look."
          peeks={posters.slice(-2).map((e) => (
            <div key={e.index} className="relative aspect-[4/5]">
              <img src={smallestVariant(e.item.src)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
          next={nextProjectOf(project)}
        />
      </main>

      <MediaLightbox items={lightboxItems} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} label="design" />
    </MediaCursorProvider>
  );
}

function toLightboxItem(entry: GalleryEntry): LightboxItem {
  const { item, section } = entry;
  const layout = imageLayout(section);
  return {
    key: entry.index,
    title: item.alt,
    tag: item.tag ?? section.title,
    group: section.title,
    description: section.description,
    thumb: smallestVariant(item.src),
    thumbRatio: item.width && item.height ? item.width / item.height : layout === "wall" ? 4 / 5 : 16 / 9,
    frame: "free",
    render: () => (
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        draggable={false}
        className="max-h-full max-w-full rounded-xl object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
      />
    ),
  };
}

/* ─────────────────────────── hero extra ─────────────────────────── */

/** A YouTube thumbnail floating over the poster stack, so the hero shows both formats. */
function HeroThumbnail({ entry, still, onOpen }: { entry: GalleryEntry; still: boolean; onOpen: (i: number) => void }) {
  const cursor = useMediaCursor();
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 40, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: -5 }}
      transition={{ duration: 1, delay: 0.65, ease: EASE }}
      className="absolute bottom-[14%] right-[0%] z-30 w-[50%] sm:right-[6%] lg:right-[-4%]"
    >
      <button
        type="button"
        onClick={() => {
          cursor.hide();
          onOpen(entry.index);
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && cursor.show("View", "view")}
        onPointerLeave={(e) => e.pointerType === "mouse" && cursor.hide()}
        aria-haspopup="dialog"
        aria-label={`View design: ${entry.item.alt}`}
        className="relative block aspect-video w-full overflow-hidden rounded-xl bg-primary shadow-[0_24px_60px_-18px_hsl(30_10%_15%/0.55)] ring-4 ring-white/90 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-ring [@media(hover:hover)]:cursor-none"
      >
        <SmartImage
          src={entry.item.src}
          widths={imageWidths(entry.item.src)}
          sizes="(min-width: 1024px) 300px, 50vw"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </button>
    </motion.div>
  );
}

/* ─────────────────────────── layouts ─────────────────────────── */

type LayoutProps = { entries: GalleryEntry[]; onOpen: (i: number) => void };

function PosterWall({ entries, onOpen }: LayoutProps) {
  return (
    <ParallaxColumns
      items={entries}
      keyOf={(e) => e.index}
      render={(e) => (
        <ImageTile
          item={e.item}
          index={e.index}
          onOpen={onOpen}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="aspect-[4/5]"
          size="sm"
        />
      )}
    />
  );
}

function ThumbnailGrid({ entries, onOpen }: LayoutProps) {
  return (
    <EditorialGrid
      items={entries}
      keyOf={(e) => e.index}
      render={(e, role) => (
        <ImageTile
          item={e.item}
          index={e.index}
          onOpen={onOpen}
          size={role === "feature" || role === "solo" ? "lg" : "md"}
          sizes={role === "feature" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className={role === "feature" ? "aspect-video lg:aspect-auto lg:h-full" : "aspect-video"}
        />
      )}
    />
  );
}

/** Prints "taped" to a textured wall, each at its own proportions, straightening on hover. */
function Billboard({ entries, onOpen }: LayoutProps) {
  const cursor = useMediaCursor();
  const fine = useFinePointer();
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-secondary/60 px-5 py-12 sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      <div className="hero-fine-grid absolute inset-0 opacity-70" />
      <div className="grain absolute inset-0 opacity-[0.06]" />
      <div className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        {entries.map((e, i) => {
          const portrait = !!e.item.width && !!e.item.height && e.item.height > e.item.width;
          return (
            <MaskReveal
              key={e.index}
              delay={i * 0.12}
              className={cn(
                entries.length === 1 ? "lg:col-span-8 lg:col-start-3" : portrait ? "lg:col-span-5" : "lg:col-span-7",
                portrait && "mx-auto w-full max-w-[420px] lg:max-w-none"
              )}
            >
              <figure>
                <button
                  type="button"
                  onClick={() => {
                    cursor.hide();
                    onOpen(e.index);
                  }}
                  onPointerEnter={(ev) => ev.pointerType === "mouse" && cursor.show("View", "view")}
                  onPointerLeave={(ev) => ev.pointerType === "mouse" && cursor.hide()}
                  aria-haspopup="dialog"
                  aria-label={`View design: ${e.item.alt}`}
                  className={cn(
                    "group relative block w-full rounded-lg bg-white p-2 shadow-[0_30px_60px_-24px_hsl(30_10%_15%/0.45)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-0 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:p-3",
                    i % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.2deg]",
                    fine && "cursor-none"
                  )}
                >
                  {/* Tape */}
                  <span aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-[hsl(40_40%_92%/0.8)] shadow-sm ring-1 ring-black/5" />
                  <SmartImage
                    src={e.item.src}
                    widths={imageWidths(e.item.src)}
                    sizes={portrait ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 55vw, 90vw"}
                    width={e.item.width}
                    height={e.item.height}
                    alt=""
                    aria-hidden="true"
                    className="block h-auto w-full rounded-[4px]"
                  />
                  <span className="bg-ember absolute right-4 top-4 flex h-10 w-10 scale-50 items-center justify-center rounded-full text-white opacity-0 shadow-soft transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 sm:right-5 sm:top-5">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                </button>
                <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 px-1">
                  {e.item.tag && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(16_98%_55%)]" />
                      {e.item.tag}
                    </span>
                  )}
                  <span className="font-display text-base font-semibold sm:text-lg">{e.item.alt}</span>
                </figcaption>
              </figure>
            </MaskReveal>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── in the feed ─────────────────────────── */

/**
 * Dark band with a phone mockup: the posters scroll by in a feed while thumbnails slide past
 * behind it. Pure CSS marquees, paused while off-screen and for reduced motion.
 */
function FeedBand({
  posters,
  thumbnails,
  stats,
  onOpen,
}: {
  posters: GalleryEntry[];
  thumbnails: GalleryEntry[];
  stats: { label: string; value: number }[];
  onOpen: (i: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const half = Math.ceil(thumbnails.length / 2);
  const rows = [thumbnails.slice(0, half), thumbnails.slice(half)].filter((r) => r.length > 0);

  return (
    <section
      ref={ref}
      aria-labelledby="feed-heading"
      data-inview={inView}
      className="relative overflow-hidden bg-primary py-20 text-primary-foreground data-[inview=false]:[&_.animate-marquee-vertical]:[animation-play-state:paused] data-[inview=false]:[&_.animate-marquee]:[animation-play-state:paused] motion-reduce:[&_.animate-marquee-vertical]:[animation-play-state:paused] motion-reduce:[&_.animate-marquee]:[animation-play-state:paused] sm:py-28 lg:py-36"
    >
      <div className="grain absolute inset-0 opacity-[0.09]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_20%,hsl(16_95%_55%/0.28),transparent_70%),radial-gradient(45%_35%_at_5%_95%,hsl(340_80%_50%/0.14),transparent_70%)]" />

      <div className="container relative mx-auto grid min-w-0 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="relative z-10 text-center lg:text-left">
          <Reveal>
            <Eyebrow dark>In the Feed</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="feed-heading" className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Built for where people <span className="text-ember">actually look</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-lg text-base text-white/60 sm:text-lg lg:mx-0">
              Every poster is checked at phone size, between real posts, before it ships. If it doesn't stop the thumb there, it
              isn't finished.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <dl className="mx-auto mt-10 flex max-w-md justify-center gap-8 border-t border-white/10 pt-6 lg:mx-0 lg:justify-start">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.24} className="mt-10">
            <Magnetic>
              <button
                type="button"
                onClick={() => onOpen(posters[0].index)}
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6 font-medium text-primary shadow-soft transition-shadow duration-300 hover:shadow-medium"
              >
                <span className="bg-ember flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:scale-110">
                  <Images className="h-4 w-4" />
                </span>
                Open the gallery
              </button>
            </Magnetic>
          </Reveal>
        </div>

        <div aria-hidden="true" className="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[600px]">
          {/* Thumbnails sliding past behind the phone */}
          {/* Edges fade out so the strips never run under the copy beside them. */}
          <div className="absolute inset-x-[-12%] top-1/2 flex -translate-y-1/2 -rotate-6 flex-col gap-4 opacity-60 [mask-image:linear-gradient(90deg,transparent,black_22%,black_78%,transparent)]">
            {rows.map((row, r) => (
              <Marquee key={r} reverse={r === 1} repeat={3} className="p-0 [--duration:50s] [--gap:1rem]">
                {row.map((e) => (
                  <div key={e.index} className="relative aspect-video w-56 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:w-64">
                    <img src={smallestVariant(e.item.src)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ))}
              </Marquee>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,hsl(30_10%_15%/0.85),transparent)]" />

          {/* Phone */}
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[2.6rem] bg-[hsl(30_8%_9%)] p-[9px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15 sm:h-[570px] sm:w-[284px]">
            <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-white">
              <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-[hsl(30_8%_9%)]" />
              <div className="absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-white via-white/90 to-transparent" />
              <Marquee vertical repeat={2} className="h-full p-0 [--duration:60s] [--gap:0px]">
                {posters.map((e) => (
                  <FeedPost key={e.index} src={smallestVariant(e.item.src)} caption={e.item.tag ?? ""} />
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A generic feed post: placeholder account row (no fake identity or numbers), the poster, action icons. */
function FeedPost({ src, caption }: { src: string; caption: string }) {
  return (
    <article className="w-full shrink-0 bg-white pb-3 text-[hsl(30_10%_12%)]">
      <div className="flex items-center gap-2 px-3 pb-2 pt-3">
        <span className="bg-ember h-7 w-7 rounded-full p-[2px]">
          <span className="block h-full w-full rounded-full bg-[hsl(38_35%_90%)] ring-2 ring-white" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="block h-2 w-20 rounded-full bg-neutral-300" />
          <span className="block h-1.5 w-12 rounded-full bg-neutral-200" />
        </span>
      </div>
      <div className="relative aspect-[4/5] w-full bg-neutral-100">
        <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center gap-3 px-3 pt-2.5">
        <Heart className="h-4 w-4" />
        <MessageCircle className="h-4 w-4" />
        <Send className="h-4 w-4" />
        <Bookmark className="ml-auto h-4 w-4" />
      </div>
      <p className="px-3 pt-1.5 text-[10px] font-medium text-neutral-500">{caption}</p>
    </article>
  );
}
