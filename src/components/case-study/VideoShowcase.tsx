import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { VideoSection } from "@/data/portfolioData";
import { cn } from "@/lib/utils";
import { sectionLayout, type PlaylistEntry } from "@/lib/video";
import { EditorialGrid, MaskReveal, ParallaxColumns } from "./CaseStudyParts";
import { VideoTile } from "./VideoTile";

type LayoutProps = { entries: PlaylistEntry[]; onOpen: (index: number) => void; label: string };

/* ─────────────────────────── wall & editorial (shared layouts) ─────────────────────────── */

function Wall({ entries, onOpen }: LayoutProps) {
  return (
    <ParallaxColumns
      items={entries}
      keyOf={(e) => e.index}
      render={(entry) => <VideoTile entry={entry} onOpen={onOpen} className="aspect-[9/16]" size="sm" />}
    />
  );
}

function Editorial({ entries, onOpen }: LayoutProps) {
  return (
    <EditorialGrid
      items={entries}
      keyOf={(e) => e.index}
      render={(entry, role) =>
        role === "feature" ? (
          <VideoTile entry={entry} onOpen={onOpen} size="lg" className="aspect-video lg:aspect-auto lg:h-full" />
        ) : (
          <VideoTile entry={entry} onOpen={onOpen} size={role === "solo" ? "lg" : "md"} className="aspect-video" />
        )
      }
    />
  );
}

/* ─────────────────────────── filmstrip ─────────────────────────── */

const TILT = [-3, 2.5, -2, 3];

function FilmstripCard({
  entry,
  onOpen,
  progress,
  i,
}: {
  entry: PlaylistEntry;
  onOpen: (index: number) => void;
  progress: MotionValue<number>;
  i: number;
}) {
  // Cards straighten and settle into a staggered line as the strip scrolls through.
  const rotate = useTransform(progress, [0, 0.5], [TILT[i % 4] * 2, TILT[i % 4] * 0.35]);
  const y = useTransform(progress, [0, 1], [i % 2 ? 50 : -10, i % 2 ? -30 : 30]);
  return (
    <motion.div style={{ rotate, y }} className={cn("w-[62vw] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none", i % 2 === 1 && "md:mt-16")}>
      <MaskReveal delay={i * 0.08}>
        <VideoTile entry={entry} onOpen={onOpen} className="aspect-[9/16]" size="sm" />
      </MaskReveal>
    </motion.div>
  );
}

function Filmstrip({ entries, onOpen }: LayoutProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useTransform(scrollYProgress, () => 0.5);
  const progress = reduced ? still : scrollYProgress;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[1.75rem] bg-primary px-0 py-10 sm:rounded-[2.5rem] md:px-10 md:py-16 lg:px-16">
      <div className="grain absolute inset-0 opacity-[0.09]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,hsl(16_95%_55%/0.22),transparent_70%),radial-gradient(50%_40%_at_10%_100%,hsl(38_60%_70%/0.12),transparent_70%)]" />
      <div
        className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:grid md:snap-none md:gap-6 md:overflow-visible md:px-0 md:pb-0"
        style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` }}
      >
        {entries.map((entry, i) => (
          <FilmstripCard key={entry.index} entry={entry} onOpen={onOpen} progress={progress} i={i} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── reel ─────────────────────────── */

/** Mouse drag-to-scroll for a horizontal scroller; touch keeps native momentum scrolling. */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, startX: 0, left: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    state.current = { down: true, startX: e.clientX, left: ref.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.down || !ref.current) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      setDragging(true);
    }
    if (s.moved) ref.current.scrollLeft = s.left - dx;
  };
  const end = () => {
    state.current.down = false;
    setDragging(false);
  };
  // A drag shouldn't also count as a click on the tile under the pointer.
  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.moved) {
      e.stopPropagation();
      e.preventDefault();
      state.current.moved = false;
    }
  };

  return {
    ref,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerLeave: end, onClickCapture },
  };
}

function Reel({ entries, onOpen, label }: LayoutProps) {
  const { ref, dragging, handlers } = useDragScroll();
  const { scrollXProgress } = useScroll({ container: ref });
  const bar = useSpring(scrollXProgress, { stiffness: 200, damping: 30 });
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [ref]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-reel-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 600) + 24), behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={ref}
        {...handlers}
        className={cn(
          "no-scrollbar -mx-4 flex scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:mr-[calc(50%-50vw)]",
          dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory md:cursor-grab"
        )}
        role="group"
        aria-label={`${label}, scroll horizontally`}
      >
        {entries.map((entry, i) => (
          <div key={entry.index} data-reel-card className="w-[84vw] max-w-[760px] shrink-0 snap-start sm:w-[70vw] lg:w-[58vw]">
            <MaskReveal delay={Math.min(i, 2) * 0.1}>
              <VideoTile entry={entry} onOpen={onOpen} size="lg" className="aspect-video" />
            </MaskReveal>
          </div>
        ))}
        {/* Trailing space so the last card can snap to the start edge. */}
        <div aria-hidden="true" className="w-4 shrink-0 lg:w-[20vw]" />
      </div>

      <div className="mt-6 flex items-center gap-4 sm:mt-8">
        <div className="relative h-px flex-1 overflow-hidden bg-primary/10">
          <motion.div className="bg-ember absolute inset-0 origin-left" style={{ scaleX: bar }} />
        </div>
        <div className="flex gap-2">
          <ReelButton dir={-1} disabled={edges.start} onClick={() => page(-1)} />
          <ReelButton dir={1} disabled={edges.end} onClick={() => page(1)} />
        </div>
      </div>
    </div>
  );
}

function ReelButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  const Icon = dir === 1 ? ArrowRight : ArrowLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Next videos" : "Previous videos"}
      className="glass-flat flex h-11 w-11 items-center justify-center rounded-full transition duration-300 hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/* ─────────────────────────── collection ─────────────────────────── */

const LAYOUTS = { wall: Wall, editorial: Editorial, filmstrip: Filmstrip, reel: Reel };

/** The tiles of one video collection, in the layout its data asks for. */
export function VideoCollection({
  section,
  entries,
  onOpen,
}: {
  section: VideoSection;
  entries: PlaylistEntry[];
  onOpen: (index: number) => void;
}) {
  const Layout = LAYOUTS[sectionLayout(section)];
  return <Layout entries={entries} onOpen={onOpen} label={section.title} />;
}
