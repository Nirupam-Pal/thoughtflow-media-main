"use client";

import { IconArrowLeft, IconArrowRight, IconQuote, IconStarFilled } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SmartImage } from "@/components/SmartImage";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  rating: number;
  /** CSS object-position for the portrait, e.g. "50% 20%". Keeps the head in frame. */
  focus?: string;
};

const SLIDE_MS = 6000;

// Where each card sits in the deck: 0 = front, then two peeking behind.
const STACK = [
  { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  { x: 18, y: 16, scale: 0.94, rotate: 4, opacity: 0.92 },
  { x: 34, y: 30, scale: 0.88, rotate: 8, opacity: 0.6 },
];

function pose(pos: number, count: number) {
  if (pos < STACK.length) return STACK[pos];
  // The card that just left slides out to the left; the rest wait, invisible, behind the stack.
  if (pos === count - 1) return { x: -80, y: 6, scale: 0.96, rotate: -9, opacity: 0 };
  return { x: 34, y: 30, scale: 0.84, rotate: 8, opacity: 0 };
}

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const count = testimonials.length;

  const next = () => setActive((p) => (p + 1) % count);
  const prev = () => setActive((p) => (p - 1 + count) % count);
  const running = autoplay && !reduced;

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 210, damping: 26, mass: 0.9 };

  return (
    <div
      className="glass mx-auto w-full min-w-0 max-w-5xl rounded-3xl p-5 font-sans antialiased sm:p-8 md:p-10 lg:p-12"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
    >
      <div className="grid min-w-0 grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-14">
        {/* Portrait deck. 4:5 frame + per-photo focal point = heads are never cropped. */}
        <div className="mx-auto w-full max-w-[18rem] pb-8 pr-8 sm:max-w-xs md:max-w-none">
          <div className="relative aspect-[4/5] w-full">
            {testimonials.map((t, i) => {
              const pos = (i - active + count) % count;
              const front = pos === 0;
              return (
                <motion.div
                  key={t.src}
                  className="absolute inset-0 origin-bottom-left touch-pan-y select-none overflow-hidden rounded-3xl border-[5px] border-white bg-muted shadow-medium"
                  style={{ zIndex: pos === count - 1 ? 40 : 30 - pos }}
                  initial={false}
                  animate={pose(pos, count)}
                  transition={spring}
                  drag={front && !reduced ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  dragDirectionLock
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) next();
                    else if (info.offset.x > 70) prev();
                  }}
                  aria-hidden={!front}
                >
                  <SmartImage
                    src={t.src}
                    widths={[360, 720]}
                    sizes="(max-width: 768px) 288px, 380px"
                    priority={i < 3}
                    alt={front ? t.name : ""}
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: t.focus ?? "50% 22%" }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/40 to-transparent" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quotes are stacked in one grid cell, so the box is always as tall as the
            longest quote — switching testimonials can never shift the layout. */}
        <div className="flex min-w-0 flex-col">
          <IconQuote className="mb-4 h-10 w-10 text-[hsl(16_98%_55%)]" aria-hidden />

          <div className="grid">
            {testimonials.map((t, i) => {
              const on = i === active;
              return (
                <motion.figure
                  key={t.src}
                  className="col-start-1 row-start-1 m-0 flex min-w-0 flex-col"
                  style={{ visibility: i === 0 ? "visible" : "hidden" }}
                  initial={false}
                  animate={
                    on
                      ? { opacity: 1, y: 0, visibility: "visible" }
                      : { opacity: 0, y: i < active ? -16 : 16, transitionEnd: { visibility: "hidden" } }
                  }
                  transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: on ? 0.12 : 0 }}
                  aria-hidden={!on}
                >
                  <blockquote className="break-words text-lg leading-relaxed text-foreground/80 sm:text-xl">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="block font-display text-xl font-bold text-foreground sm:text-2xl">{t.name}</span>
                    <span className="mt-1 block break-words text-sm text-muted-foreground">{t.designation}</span>
                    <span className="mt-3 flex gap-1" role="img" aria-label={`${t.rating} out of 5 stars`}>
                      {[...Array(5)].map((_, s) => (
                        <IconStarFilled
                          key={s}
                          className={`h-5 w-5 ${s < t.rating ? "text-[hsl(38_95%_55%)]" : "text-primary/15"}`}
                        />
                      ))}
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={prev}
              className="group/button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/80 transition duration-300 hover:-translate-y-0.5 hover:bg-background hover:shadow-medium"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="group/button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/80 transition duration-300 hover:-translate-y-0.5 hover:bg-background hover:shadow-medium"
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>

            {/* Segmented progress. The active fill's animationend advances the slide,
                so hovering (play-state: paused) and reduced motion behave for free. */}
            <div className="ml-1 flex min-w-0 items-center gap-1.5" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((t, i) => (
                <button
                  key={t.src}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show testimonial from ${t.name}`}
                  onClick={() => setActive(i)}
                  className="flex h-6 items-center"
                >
                  <span className="block h-1.5 w-4 overflow-hidden rounded-full bg-primary/15 sm:w-8">
                    {i < active && <span className="block h-full w-full bg-ember" />}
                    {i === active && (
                      <span
                        key={`${active}-${running}`}
                        className={`block h-full w-full bg-ember ${running ? "tf-progress" : ""}`}
                        style={
                          running
                            ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }
                            : undefined
                        }
                        onAnimationEnd={running ? next : undefined}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonials;
