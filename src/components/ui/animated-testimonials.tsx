"use client";

import { IconArrowLeft, IconArrowRight, IconStarFilled } from "@tabler/icons-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/motion";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  rating: number; // Added rating field
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && !paused && !reduced) {
      const interval = setInterval(handleNext, 4000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active, paused, reduced]);

  // Deterministic tilt per card. (Math.random() here re-rolled on every render,
  // making the portraits jitter and mismatching prerendered HTML on hydration.)
  const rotation = (index: number) => ((index * 7) % 21) - 10;

  return (
    <div
      className="glass mx-auto w-full max-w-full min-w-0 rounded-3xl p-5 font-sans antialiased sm:p-8 md:max-w-4xl md:p-10 lg:p-12"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="relative grid min-w-0 grid-cols-1 gap-8 sm:gap-10 md:gap-16 md:grid-cols-2">
        <div className="min-w-0">
          <div className="relative mx-auto h-64 w-full max-w-sm sm:h-72 md:h-80 md:max-w-none">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotation(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : rotation(index),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: rotation(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-between md:py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-xl font-bold text-foreground break-words sm:text-2xl">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-muted-foreground break-words">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-2 text-base leading-relaxed text-foreground/75 break-words sm:mt-8 sm:text-lg">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    ...(fine ? { filter: "blur(10px)" } : {}),
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    ...(fine ? { filter: "blur(0px)" } : {}),
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block max-w-full break-words"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
            
            {/* Added Star Rating Section */}
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonials[active].rating
                      ? "text-[hsl(38_95%_55%)]"
                      : "text-primary/15"
                  }`}
                />
              ))}
            </div>

          </motion.div>
          <div className="flex flex-wrap items-center gap-3 pt-8 sm:gap-4 md:pt-0">
            <button
              type="button"
              onClick={handlePrev}
              className="group/button flex h-10 w-10 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/80 transition duration-300 hover:-translate-y-0.5 hover:bg-background hover:shadow-medium"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="group/button flex h-10 w-10 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/80 transition duration-300 hover:-translate-y-0.5 hover:bg-background hover:shadow-medium"
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
            <div className="ml-2 flex items-center gap-1.5" role="tablist" aria-label="Choose testimonial">
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
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? "w-6 bg-ember" : "w-1.5 bg-primary/20"
                    }`}
                  />
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