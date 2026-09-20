import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSlowConnection } from "@/lib/connection";

/**
 * Muted looping *preview* video for a carousel tile.
 *
 * Built for slow networks:
 *  • the poster still (a few KB) shows instantly, so a tile is never blank;
 *  • the video itself is a small preview loop (see scripts/optimize-videos.mjs), and is only
 *    downloaded once the tile is near the viewport and only plays while visible;
 *  • on a slow connection / Data Saver / reduced motion, no video is fetched at all — the
 *    poster stays, and the full video loads only if the visitor taps to open it.
 */
export function LazyVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const slow = useSlowConnection();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canPlay = !slow && !reduced;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible && canPlay) v.play().catch(() => {});
    else v.pause();
  }, [visible, mounted, canPlay]);

  return (
    <div ref={wrap} className={cn("relative h-full w-full bg-gradient-to-br from-primary/80 to-primary", className)}>
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {mounted && canPlay && (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
