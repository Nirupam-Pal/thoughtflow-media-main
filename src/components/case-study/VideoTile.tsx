import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/motion";
import { useSlowConnection } from "@/lib/connection";
import { videoPoster, type PlaylistEntry } from "@/lib/video";
import { useMediaCursor } from "./MediaCursor";

/** Poster <img> that swaps to a fallback URL once if the preferred size doesn't exist (YouTube maxres). */
export function PosterImage({
  src,
  fallback,
  className,
  eager,
}: {
  src?: string;
  fallback?: string;
  className?: string;
  eager?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  if (!current) return null;
  return (
    <img
      src={current}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => fallback && current !== fallback && setCurrent(fallback)}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}

/**
 * A video card. Before interaction it's just a poster (a few KB). The muted preview loop is
 * fetched only when needed — on hover with a mouse, or while mostly on-screen on touch — and
 * paused as soon as it isn't. Slow connections and reduced motion never load it.
 */
export function VideoTile({
  entry,
  onOpen,
  className,
  size = "md",
  eager,
}: {
  entry: PlaylistEntry;
  onOpen: (index: number) => void;
  className?: string;
  /** Scales the caption type. */
  size?: "sm" | "md" | "lg";
  /** Load the poster immediately (above the fold). */
  eager?: boolean;
}) {
  const { video, section, index } = entry;
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const slow = useSlowConnection();
  const cursor = useMediaCursor();
  const root = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLVideoElement>(null);

  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);

  const canPreview = !!video.preview && !slow && !reduced;
  const playing = canPreview && (fine ? hovered : inView);
  const poster = videoPoster(video, size === "lg");

  // Touch: preview while at least 60% of the tile is visible.
  useEffect(() => {
    const el = root.current;
    if (!el || !canPreview || fine) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [canPreview, fine]);

  useEffect(() => {
    if (playing) setArmed(true);
  }, [playing]);

  useEffect(() => {
    const v = player.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, armed]);

  const active = hovered;
  const tag = video.tag ?? section.title;

  return (
    <button
      ref={root}
      type="button"
      data-active={active}
      aria-haspopup="dialog"
      aria-label={`Play video: ${video.title}`}
      onClick={() => {
        // The lightbox covers the tile, so pointerleave never fires: stop the preview here.
        setHovered(false);
        cursor.hide();
        onOpen(index);
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        setHovered(true);
        cursor.show("Play", "play");
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setHovered(false);
        cursor.hide();
      }}
      className={cn(
        "group relative isolate block w-full overflow-hidden rounded-[1.25rem] bg-primary text-left shadow-medium sm:rounded-3xl",
        "transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-[active=true]:-translate-y-1 data-[active=true]:shadow-[0_24px_60px_-18px_hsl(30_10%_15%/0.45)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        fine && !reduced && "cursor-none",
        className
      )}
    >
      {/* Media: zooms gently on hover. */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:scale-[1.05] group-data-[active=true]:scale-[1.05]">
        <PosterImage src={poster.src} fallback={poster.fallback} eager={eager} />
        {armed && video.preview && (
          <video
            ref={player}
            src={video.preview}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onPlaying={() => setReady(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              ready && playing ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </div>

      {/* Legibility scrims; the bottom one deepens on hover. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-data-[active=true]:opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,hsl(16_98%_55%/0.35),transparent_60%)] opacity-0 transition-opacity duration-500 group-focus-visible:opacity-100 group-data-[active=true]:opacity-100" />

      {/* Top row: index + play */}
      <div className="absolute inset-x-3 top-3 flex items-start justify-between sm:inset-x-4 sm:top-4">
        <span className="rounded-full bg-black/35 px-2.5 py-1 font-display text-[11px] font-semibold tabular-nums text-white/90 ring-1 ring-white/15 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-full bg-white/90 text-primary shadow-soft transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            size === "lg" ? "h-12 w-12" : "h-9 w-9 sm:h-10 sm:w-10",
            "group-focus-visible:bg-transparent group-focus-visible:text-white group-data-[active=true]:scale-90 group-data-[active=true]:bg-transparent group-data-[active=true]:text-white"
          )}
        >
          <span className="bg-ember absolute inset-0 opacity-0 transition-opacity duration-500 group-focus-visible:opacity-100 group-data-[active=true]:opacity-100" />
          <Play className={cn("relative translate-x-[1px] fill-current", size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
        </span>
      </div>

      {/* Caption: rises slightly on hover. */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:-translate-y-1 group-data-[active=true]:-translate-y-1",
          size === "lg" ? "p-5 sm:p-7" : "p-3.5 sm:p-5"
        )}
      >
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/90 ring-1 ring-white/20 backdrop-blur-sm sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(16_98%_55%)]" />
          {tag}
        </span>
        <span
          className={cn(
            "block font-display font-semibold leading-tight text-white",
            size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "line-clamp-2 text-sm sm:text-base" : "line-clamp-2 text-base sm:text-lg"
          )}
        >
          {video.title}
        </span>
      </div>
    </button>
  );
}
