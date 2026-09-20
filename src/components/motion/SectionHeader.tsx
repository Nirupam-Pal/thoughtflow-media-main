import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Same eyebrow chip + ember-gradient accent as the hero, for every section. */
export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  /** Rendered after `title` in the ember gradient. */
  accent?: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto mb-12 max-w-3xl text-center sm:mb-16", className)}>
      <Reveal>
        <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground sm:text-[13px]">
          <span className="h-2 w-2 rounded-full bg-[hsl(16_98%_55%)]" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
          {title}
          {accent && (
            <>
              {" "}
              <span className="text-ember">{accent}</span>
            </>
          )}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
