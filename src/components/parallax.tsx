"use client";

import { motion, MotionValue, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

/**
 * Parallax "creative wall".
 *
 * The wall is real client work in a unified monochrome + warm-charcoal treatment
 * (colour returns on hover), anchored by the three on-brand logo tiles, with a
 * glass brand card that stays centred while the columns drift behind it.
 *
 * How the drift is driven (this is what makes it smooth on phones):
 *
 *  css     – A CSS scroll-driven animation (`animation-timeline`). It runs on the
 *            compositor, locked to native scrolling, so there is no JS in the scroll
 *            path at all: no one-frame lag, no jitter. Used wherever supported.
 *  js      – Framer `useScroll`, only for desktop browsers without scroll timelines.
 *            (Desktop scroll is driven by Lenis in JS, so JS parallax stays in sync.)
 *  static  – Reduced motion, or a touch browser without scroll timelines: the wall
 *            simply rests at its mid-scroll pose. Better still than a jittery one.
 */

type Tile = { src: string; kind: "work" | "brand"; alt: string };
type Mode = "css" | "js" | "static";

const work = (n: number): Tile => ({ src: `/posters/${n}.jpg`, kind: "work", alt: "Ad creative by Thoughtflow Mediaa" });
const brand = (n: number): Tile => ({ src: `/parallax/logos/${n}.png`, kind: "brand", alt: "Thoughtflow Mediaa" });

const COLUMNS: Tile[][] = [
  [work(2), brand(4), work(6)],
  [brand(8), work(4), work(7)],
  [work(11), work(9), brand(10)],
  [work(12), work(1), work(5)],
];

// Vertical start offset per column (staggers the wall) and drift, in viewport heights.
const OFFSETS = ["-top-[45%]", "-top-[95%]", "-top-[45%]", "-top-[75%]"];
const DRIFT = [2, 3.3, 1.25, 3];

function detectMode(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")) return "css";
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "js" : "static";
}

const Skiper30 = () => {
  const gallery = useRef<HTMLDivElement>(null);
  // Start on "css": modern browsers (the vast majority) never change it, so there's no flash.
  const [mode, setMode] = useState<Mode>("css");

  useEffect(() => setMode(detectMode()), []);

  return (
    <section
      aria-label="Our creative work"
      className="w-full min-w-0 max-w-[100vw] overflow-x-clip bg-background text-foreground"
    >
      {/* overflow-clip (not hidden) keeps the sticky brand card working inside. */}
      <div
        ref={gallery}
        className={cn(
          "relative box-border grid h-[125vh] grid-cols-2 gap-2 overflow-clip bg-secondary/50 p-2 sm:h-[150vh] sm:grid-cols-4 sm:gap-[2vw] sm:p-[2vw] lg:h-[175vh]",
          mode === "css" && "wall"
        )}
      >
        {mode === "js" ? (
          <JsColumns galleryRef={gallery} />
        ) : (
          COLUMNS.map((tiles, i) => (
            <Column key={i} tiles={tiles} index={i} className={mode === "css" ? "wall-col" : "wall-static"} />
          ))
        )}

        {/* Brand card — sticky so it stays centred while the wall moves behind it.
            svh (not dvh): dvh changes as a phone's URL bar collapses, which would make this card jump. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="sticky top-0 grid h-[100svh] place-items-center px-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_42%_at_50%_50%,hsl(40_30%_97%/0.94),transparent_78%)]" />
            <div className="glass-solid pointer-events-auto relative w-full max-w-md rounded-3xl p-7 text-center sm:p-10">
              <img
                src="/tf-profile.png"
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="mx-auto mb-5 h-14 w-14 rounded-2xl object-cover shadow-medium"
              />
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Thoughtflow Mediaa
              </p>
              <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl">
                We make your <span className="text-ember">Brand Matter</span>
              </h2>
              <p className="mx-auto mb-7 mt-4 max-w-xs text-sm text-muted-foreground sm:text-base">
                Digital marketing &amp; advertising — creative, performance and web under one roof.
              </p>
              <Magnetic>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-shadow duration-300 hover:shadow-medium sm:text-base"
                >
                  Start your project
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** JS-driven fallback (desktop only, browsers without CSS scroll timelines). */
const JsColumns = ({ galleryRef }: { galleryRef: RefObject<HTMLDivElement> }) => {
  const [height, setHeight] = useState(0);
  const nearViewport = useInView(galleryRef, { margin: "300px 0px 300px 0px" });
  const { scrollYProgress } = useScroll({ target: galleryRef, offset: ["start end", "end start"] });

  const y0 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[0]]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[1]]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[2]]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[3]]);
  const ys = [y0, y1, y2, y3];

  useEffect(() => {
    const resize = () => setHeight(window.innerHeight);
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      {COLUMNS.map((tiles, i) => (
        <Column key={i} tiles={tiles} index={i} y={ys[i]} hot={nearViewport} />
      ))}
    </>
  );
};

type ColumnProps = {
  tiles: Tile[];
  index: number;
  /** Present only in JS mode. */
  y?: MotionValue<number>;
  hot?: boolean;
  className?: string;
};

const Column = ({ tiles, index, y, hot, className }: ColumnProps) => {
  const classes = cn(
    "relative h-full w-full min-w-0 flex-col gap-2 sm:gap-[2vw]",
    OFFSETS[index],
    index > 1 ? "hidden sm:flex" : "flex",
    className
  );
  // `--drift` feeds the CSS animation / static pose (see index.css).
  const style = { "--drift": DRIFT[index] } as CSSProperties;

  const content = tiles.map((tile, i) => (
    <div key={i} className="group relative min-h-[100px] w-full flex-1 rounded-xl bg-muted shadow-soft sm:rounded-2xl">
      {/* The image carries the rounded corners itself: no overflow:hidden clip layer per tile,
          which is a real cost when 12 of them move at once on a phone GPU. */}
      <img
        src={tile.src}
        alt={tile.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn(
          "h-full w-full min-h-[100px] select-none rounded-[inherit] object-cover",
          // One unified look for real work: monochrome, colour returns on hover (desktop only).
          tile.kind === "work" &&
            "grayscale contrast-[1.08] brightness-[0.97] [@media(hover:hover)]:transition-[filter] [@media(hover:hover)]:duration-700 [@media(hover:hover)]:group-hover:grayscale-0"
        )}
      />
      {tile.kind === "work" && (
        // Plain gradient, no mix-blend-mode: blend modes over moving layers are costly on mobile.
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-primary/40 via-primary/5 to-[hsl(22_98%_54%/0.14)] [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:duration-700 [@media(hover:hover)]:group-hover:opacity-0" />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/50" />
    </div>
  ));

  if (y) {
    return (
      <motion.div className={classes} style={{ ...style, y, willChange: hot ? "transform" : "auto" }}>
        {content}
      </motion.div>
    );
  }
  return (
    <div className={classes} style={style}>
      {content}
    </div>
  );
};

export { Skiper30 };

/**
 * Parallax mechanic adapted from Skiper 30 Parallax_002 — React + framer motion + lenis
 * Inspired by https://www.siena.film/films/my-project-x
 * Attribution to Skiper UI is required when using the free version. Author: @gurvinder-singh02 (https://gxuri.in)
 */
