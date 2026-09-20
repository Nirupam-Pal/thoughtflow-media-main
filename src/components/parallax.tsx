"use client";

import { motion, MotionValue, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

/**
 * Parallax "creative wall".
 *
 * The old wall repeated ten colour variants of the logo poster (gold, green,
 * purple, red…), which fought the site's cream / charcoal / ember palette.
 * Now the wall is real client work in a unified monochrome + warm-charcoal
 * treatment (colour returns on hover), anchored by the three on-brand logo
 * tiles, with a glass brand card that stays centred while the columns drift.
 */

type Tile = { src: string; kind: "work" | "brand"; alt: string };

const work = (n: number): Tile => ({ src: `/posters/${n}.jpg`, kind: "work", alt: "Ad creative by Thoughtflow Mediaa" });
const brand = (n: number): Tile => ({ src: `/parallax/logos/${n}.png`, kind: "brand", alt: "Thoughtflow Mediaa" });

const COLUMNS: Tile[][] = [
  [work(2), brand(4), work(6)],
  [brand(8), work(4), work(7)],
  [work(11), work(9), brand(10)],
  [work(12), work(1), work(5)],
];

// Vertical start offset per column (staggers the wall) and drift multiplier.
const OFFSETS = ["-top-[45%]", "-top-[95%]", "-top-[45%]", "-top-[75%]"];
const DRIFT = [2, 3.3, 1.25, 3];

const Skiper30 = () => {
  const reduced = useReducedMotion();
  const gallery = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  // Promote the columns to their own GPU layers only while the wall is near the viewport.
  const nearViewport = useInView(gallery, { margin: "300px 0px 300px 0px" });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const y0 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[0] * (reduced ? 0 : 1)]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[1] * (reduced ? 0 : 1)]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[2] * (reduced ? 0 : 1)]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * DRIFT[3] * (reduced ? 0 : 1)]);
  const ys = [y0, y1, y2, y3];

  // Smooth scrolling itself is app-wide now (see lib/smooth-scroll.ts).
  useEffect(() => {
    const resize = () => setHeight(window.innerHeight);
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section
      aria-label="Our creative work"
      className="w-full min-w-0 max-w-[100vw] overflow-x-clip bg-background text-foreground"
    >
      {/* overflow-clip (not hidden) keeps the sticky brand card working inside. */}
      <div
        ref={gallery}
        className="relative box-border grid h-[125vh] grid-cols-2 gap-2 overflow-clip bg-secondary/50 p-2 sm:h-[150vh] sm:grid-cols-4 sm:gap-[2vw] sm:p-[2vw] lg:h-[175vh]"
      >
        {COLUMNS.map((tiles, i) => (
          <Column key={i} tiles={tiles} y={ys[i]} offset={OFFSETS[i]} hot={nearViewport} className={i > 1 ? "hidden sm:flex" : "flex"} />
        ))}

        {/* Brand card — sticky so it stays centred while the wall moves behind it */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="sticky top-0 grid h-[100dvh] place-items-center px-4">
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

type ColumnProps = {
  tiles: Tile[];
  y: MotionValue<number>;
  offset: string;
  hot: boolean;
  className?: string;
};

const Column = ({ tiles, y, offset, hot, className }: ColumnProps) => {
  return (
    <motion.div
      className={cn("relative h-full w-full min-w-0 flex-col gap-2 sm:gap-[2vw]", offset, className)}
      style={{ y, willChange: hot ? "transform" : "auto" }}
    >
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="group relative min-h-[100px] w-full flex-1 overflow-hidden rounded-xl bg-muted shadow-soft sm:rounded-2xl"
        >
          <img
            src={tile.src}
            alt={tile.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={cn(
              "h-full w-full min-h-[100px] select-none object-cover",
              // One unified look for real work: monochrome, colour returns on hover (desktop only).
              tile.kind === "work" &&
                "grayscale contrast-[1.08] brightness-[0.97] transition-[filter] duration-700 [@media(hover:hover)]:group-hover:grayscale-0"
            )}
          />
          {tile.kind === "work" && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-primary/5 to-[hsl(22_98%_54%/0.16)] mix-blend-multiply transition-opacity duration-700 [@media(hover:hover)]:group-hover:opacity-0" />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/50" />
        </div>
      ))}
    </motion.div>
  );
};

export { Skiper30 };

/**
 * Parallax mechanic adapted from Skiper 30 Parallax_002 — React + framer motion + lenis
 * Inspired by https://www.siena.film/films/my-project-x
 * Attribution to Skiper UI is required when using the free version. Author: @gurvinder-singh02 (https://gxuri.in)
 */
