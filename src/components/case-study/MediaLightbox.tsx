import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE, useFinePointer } from "@/lib/motion";
import { getLenis } from "@/lib/smooth-scroll";

const SWIPE_PX = 70;

/** Anything the lightbox can show: a video, an image… Each item renders its own media. */
export type LightboxItem = {
  key: string | number;
  title: string;
  /** Small label above the title, e.g. "Brand Film". */
  tag: string;
  /** Collection name shown next to the counter. */
  group: string;
  description?: string;
  /** Small image for the filmstrip, and its width / height ratio. */
  thumb?: string;
  thumbRatio: number;
  /**
   * "16:9" / "9:16" – a fixed player frame (the media fills it);
   * "free"          – the media keeps its natural size, capped to the stage.
   */
  frame: "16:9" | "9:16" | "free";
  render: () => ReactNode;
};

/**
 * Fullscreen viewer shared by the case studies. Radix Dialog supplies the focus trap,
 * Esc-to-close, scroll lock and ARIA; this adds prev/next (buttons, ←/→ keys, swipe),
 * a filmstrip of every item and direction-aware transitions.
 */
export function MediaLightbox({
  items,
  index,
  onIndexChange,
  onClose,
  label = "media",
}: {
  items: LightboxItem[];
  /** Open item, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Used in accessible names, e.g. "video" → "Next video". */
  label?: string;
}) {
  const open = index !== null;
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const [direction, setDirection] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const count = items.length;

  // Keep showing the last item while the dialog animates closed.
  const last = useRef<{ item: LightboxItem; index: number }>();
  if (index !== null && items[index]) last.current = { item: items[index], index };
  const current = last.current;
  const item = current?.item;

  // Tiles open the dialog programmatically (not via Dialog.Trigger), so remember what to refocus on close.
  const returnFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  if (open && !wasOpen.current && typeof document !== "undefined") {
    returnFocus.current = document.activeElement as HTMLElement | null;
  }
  wasOpen.current = open;

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDirection(step);
      onIndexChange((index + step + count) % count);
    },
    [index, count, onIndexChange]
  );

  // Pause the page's smooth scroller underneath the dialog.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, [open]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (index === null) return;
    const el = strip.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
  }, [index, reduced]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Don't hijack arrows while a native <video> control (e.g. the seek bar) has focus.
    if ((e.target as HTMLElement).tagName === "VIDEO") return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) go(1);
    else if (info.offset.x > SWIPE_PX) go(-1);
  };

  const offset = reduced ? 0 : 60;
  const frame = item?.frame ?? "free";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-[hsl(30_12%_5%/0.97)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          onCloseAutoFocus={(e) => {
            const el = returnFocus.current;
            if (el && el.isConnected) {
              e.preventDefault();
              el.focus({ preventScroll: true });
            }
          }}
          className="video-lightbox fixed inset-0 z-[81] flex flex-col text-white outline-none duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"
        >
          <div className="grain absolute inset-0 opacity-[0.07]" />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-4 pb-2 pt-4 sm:px-8 sm:pt-6">
            <p className="min-w-0 truncate text-xs font-medium uppercase tracking-[0.16em] text-white/60 sm:text-sm">
              <span className="font-display tabular-nums text-white">{String((current?.index ?? 0) + 1).padStart(2, "0")}</span>
              <span className="mx-1.5">/</span>
              <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
              {item && <span className="ml-3 hidden sm:inline">{item.group}</span>}
            </p>
            <DialogPrimitive.Close
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:rotate-90 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Close ${label}`}
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Stage */}
          <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20 lg:px-28">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {item && current && (
                <motion.div
                  key={current.index}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * offset, scale: reduced ? 1 : 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -offset, scale: reduced ? 1 : 0.97 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                  drag={!fine && count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={onDragEnd}
                  className={cn(
                    frame === "free"
                      ? "relative flex h-full w-full items-center justify-center"
                      : "relative overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10",
                    frame === "9:16" && "aspect-[9/16]",
                    frame === "16:9" && "aspect-video w-full"
                  )}
                  style={
                    frame === "9:16"
                      ? { height: "min(100%, calc((100vw - 2rem) * 16 / 9))" }
                      : frame === "16:9"
                        ? { maxWidth: "min(100%, calc((100dvh - 15rem) * 16 / 9))" }
                        : undefined
                  }
                >
                  {item.render()}
                </motion.div>
              )}
            </AnimatePresence>

            {count > 1 && (
              <>
                <NavButton side="left" label={label} onClick={() => go(-1)} />
                <NavButton side="right" label={label} onClick={() => go(1)} />
              </>
            )}
          </div>

          {/* Caption + filmstrip */}
          <div className="relative z-10 px-4 pb-4 pt-4 sm:px-8 sm:pb-6">
            <div className="mx-auto flex max-w-5xl items-end justify-between gap-4">
              <div className="min-w-0">
                {item && (
                  <>
                    <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(16_98%_55%)]" />
                      {item.tag}
                    </span>
                    <DialogPrimitive.Title className="truncate font-display text-xl font-semibold sm:text-2xl md:text-3xl">
                      {item.title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-1 line-clamp-1 text-sm text-white/55">
                      {item.description ?? item.group}
                    </DialogPrimitive.Description>
                  </>
                )}
              </div>
              {count > 1 && (
                <div className="flex shrink-0 gap-2 sm:hidden">
                  <button type="button" onClick={() => go(-1)} aria-label={`Previous ${label}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label={`Next ${label}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div ref={strip} className="no-scrollbar mx-auto mt-4 hidden max-w-5xl gap-2 overflow-x-auto py-1 md:flex" role="group" aria-label={`All ${label}s`}>
              {items.map((it, i) => {
                const active = i === index;
                return (
                  <button
                    key={it.key}
                    type="button"
                    data-thumb={i}
                    onClick={() => {
                      setDirection(i > (index ?? 0) ? 1 : -1);
                      onIndexChange(i);
                    }}
                    aria-label={`Show ${it.title}`}
                    aria-current={active || undefined}
                    style={{ width: Math.round(56 * it.thumbRatio) }}
                    className={cn(
                      "relative h-14 shrink-0 overflow-hidden rounded-lg bg-white/5 ring-1 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      active ? "opacity-100 ring-[hsl(16_98%_55%)]" : "opacity-45 ring-white/10 hover:opacity-80"
                    )}
                  >
                    {it.thumb && <img src={it.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function NavButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? `Previous ${label}` : `Next ${label}`}
      className={cn(
        "group absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition duration-300 hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex",
        side === "left" ? "left-4 lg:left-8" : "right-4 lg:right-8"
      )}
    >
      <Icon className={cn("h-6 w-6 transition-transform duration-300", side === "left" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5")} />
    </button>
  );
}
