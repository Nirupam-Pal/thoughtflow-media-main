import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Muted looping video that only downloads once it's near the viewport and
 * only plays while visible. Replaces "autoplay every video on the page",
 * which is the single biggest mobile CPU / bandwidth cost in a carousel.
 */
export function LazyVideo({ src, className }: { src: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    if (visible && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [visible, mounted, reduced]);

  return (
    <div ref={wrap} className={cn("h-full w-full bg-gradient-to-br from-primary/80 to-primary", className)}>
      {mounted && (
        <video
          ref={video}
          className="h-full w-full object-cover"
          src={src}
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
