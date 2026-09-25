import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Maximize2, Play } from "lucide-react";
import { useInteractiveMotion } from "@/lib/motion";

type CursorKind = "play" | "view";
type CursorApi = { show: (label?: string, kind?: CursorKind) => void; hide: () => void };

const NOOP: CursorApi = { show: () => {}, hide: () => {} };
const CursorContext = createContext<CursorApi>(NOOP);

/** Tiles call `show()` on pointer enter and `hide()` on leave. A no-op on touch / reduced motion. */
// eslint-disable-next-line react-refresh/only-export-components
export const useMediaCursor = () => useContext(CursorContext);

/**
 * One cursor bubble ("Play" for video, "View" for images) that follows the pointer over media tiles.
 * Position, visibility, label and icon all bypass React state, so moving the mouse never re-renders.
 */
export function MediaCursorProvider({ children }: { children: ReactNode }) {
  const interactive = useInteractiveMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.35 });
  const scale = useSpring(0, { stiffness: 340, damping: 26 });
  const label = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [interactive, x, y]);

  const api = useMemo<CursorApi>(
    () => ({
      show: (text = "Play", kind = "play") => {
        if (label.current) label.current.textContent = text;
        bubble.current?.setAttribute("data-kind", kind);
        scale.set(1);
      },
      hide: () => scale.set(0),
    }),
    [scale]
  );

  return (
    <CursorContext.Provider value={interactive ? api : NOOP}>
      {children}
      {interactive && (
        <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[70]" style={{ x: sx, y: sy }}>
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.div
              ref={bubble}
              data-kind="play"
              style={{ scale }}
              className="bg-ember group/cursor flex h-[84px] w-[84px] flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-[0_12px_40px_-8px_hsl(8_90%_50%/0.55)]"
            >
              <Play className="h-5 w-5 fill-white group-data-[kind=view]/cursor:hidden" />
              <Maximize2 className="hidden h-5 w-5 group-data-[kind=view]/cursor:block" />
              <span ref={label} className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                Play
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </CursorContext.Provider>
  );
}
