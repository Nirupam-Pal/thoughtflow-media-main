import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Compass, Lightbulb, Rocket, Clapperboard, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

export type ProcessStep = { icon: LucideIcon; title: string; description: string };

const DEFAULT_STEPS: ProcessStep[] = [
  {
    icon: Compass,
    title: "Discover",
    description: "We study your brand, audience and competitors to find exactly where your growth is hiding.",
  },
  {
    icon: Lightbulb,
    title: "Strategize",
    description: "A data-backed plan: the right channels, creative angles and KPIs tied to real business results.",
  },
  {
    icon: Clapperboard,
    title: "Create",
    description: "Scroll-stopping videos, ads, posters and web experiences, produced in-house at speed.",
  },
  {
    icon: Rocket,
    title: "Scale",
    description: "We launch, test and optimise with live data — then put more fuel behind what converts.",
  },
];

/**
 * One step that "powers on" as the scroll-drawn line reaches it. The card is always rendered (dimmed
 * until lit), so the section never reads as empty. Motion values only — no re-renders, and no reliance
 * on a one-shot in-view trigger that can be missed on a fast scroll.
 */
function Step({
  index,
  total,
  progress,
  step: { icon: Icon, title, description },
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  step: ProcessStep;
}) {
  const start = index / total;
  const on = useTransform(progress, [start, start + 0.12], [0, 1]);
  const scale = useTransform(on, [0, 1], [0.92, 1]);
  const cardOpacity = useTransform(on, [0, 1], [0.45, 1]);
  const cardY = useTransform(on, [0, 1], [12, 0]);

  return (
    <div className="flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
      <div className="shrink-0 lg:mb-6">
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-background shadow-soft"
          style={{ scale }}
        >
          <motion.div className="absolute inset-0 rounded-2xl bg-ember" style={{ opacity: on }} />
          <Icon className="relative h-6 w-6 text-primary transition-colors" />
          <motion.span className="absolute inset-0 flex items-center justify-center text-white" style={{ opacity: on }}>
            <Icon className="h-6 w-6" />
          </motion.span>
        </motion.div>
      </div>
      <motion.div className="flex-1" style={{ opacity: cardOpacity, y: cardY }}>
        <TiltCard className="h-full rounded-3xl" max={6}>
          <div className="p-6">
            <span className="mb-2 block font-display text-sm font-semibold tabular-nums text-muted-foreground">
              0{index + 1}
            </span>
            <h3 className="mb-2 font-display text-xl font-semibold">{title}</h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}

/** Defaults are the home page's agency process; case studies pass their own steps and copy. */
const Process = ({
  id = "process",
  eyebrow = "How We Work",
  title = "From idea to",
  accent = "impact",
  description = "A simple, transparent process that turns attention into measurable growth.",
  steps = DEFAULT_STEPS,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  accent?: ReactNode;
  description?: ReactNode;
  steps?: ProcessStep[];
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const progress = reduced ? scrollYProgress : smooth;
  // Reduced motion: show the fully-lit state instead of a scroll-scrubbed one.
  const line = useTransform(progress, (v) => (reduced ? 1 : v));

  return (
    <section aria-labelledby={`${id}-heading`} className={cn("relative overflow-x-clip bg-secondary/30 py-20 md:py-28 lg:py-32", className)} id={id}>
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          id={`${id}-heading`}
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          description={description}
        />

        <div ref={ref} className="relative mx-auto max-w-7xl">
          {/* Scroll-drawn line: horizontal on desktop, vertical on mobile. Both scale from one value. */}
          <div className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-px bg-primary/10 lg:left-[12.5%] lg:right-[12.5%] lg:top-[27px] lg:h-px lg:w-auto" />
          <motion.div
            className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-ember lg:hidden"
            style={{ scaleY: line }}
          />
          <motion.div
            className="absolute left-[12.5%] right-[12.5%] top-[27px] hidden h-px origin-left bg-ember lg:block"
            style={{ scaleX: line }}
          />

          <div className="relative grid gap-6 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <Step key={step.title} index={i} total={steps.length} progress={line} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
