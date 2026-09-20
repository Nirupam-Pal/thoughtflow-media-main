import { ArrowDownRight } from "lucide-react";
import CountUp from "react-countup";
import { CtaButton } from "./ui/cta-button";
import HeroBackground from "./HeroBackground";
import HeroScene from "./HeroScene";

/** Swap `ACTIVE` to A/B test. All variants keep the local "Agartala" keyword. */
const HEADLINES = {
  outcome: {
    line: "Turn attention",
    accent: "into revenue.",
    sub: (
      <>
        We fuse creative storytelling with performance data — <Em>Meta Ads</Em>, <Em>UGC videos</Em> and{" "}
        <Em>websites that convert</Em> — so every rupee you spend compounds. Agartala's AI-powered marketing agency,
        growing brands across Northeast India.
      </>
    ),
  },
  engineered: {
    line: "Growth isn't luck.",
    accent: "It's engineered.",
    sub: (
      <>
        Thoughtflow Mediaa maps your audience, tests creative fast and scales what converts. <Em>1,000+ projects</Em>{" "}
        for <Em>50+ brands</Em> prove the system works — from our studio in Agartala, Tripura.
      </>
    ),
  },
  audience: {
    line: "Your next 1,000 customers",
    accent: "are already scrolling.",
    sub: (
      <>
        We put your brand in front of them with scroll-stopping <Em>UGC</Em>, data-tuned <Em>Meta Ads</Em> and sites
        built to close. An AI-powered marketing agency based in Agartala, India.
      </>
    ),
  },
};

const ACTIVE = HEADLINES.outcome;

const STATS = [
  { number: "1000+", label: "Projects Delivered" },
  { number: "98%", label: "Client Satisfaction Rate" },
  { number: "20+", label: "Creative Specialists" },
  { number: "15+ L", label: "Ads Spend Experience" },
];

function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-foreground">{children}</span>;
}

const Hero = () => {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-x-clip bg-background pb-12 pt-24 sm:pt-28 md:pb-16 lg:pt-32">
      <HeroBackground />

      <div className="container relative z-10 mx-auto min-w-0 px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-6 xl:gap-12">
          {/* Copy */}
          <div className="min-w-0 text-center lg:text-left">
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="font-display font-bold tracking-tight">
                <span className="mb-6 block">
                  <span className="hero-glass inline-flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-left font-sans sm:rounded-full text-xs font-medium tracking-wide text-muted-foreground sm:text-[13px]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(16_98%_55%)] opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(16_98%_55%)]" />
                    </span>
                    Thoughtflow Mediaa · AI-Powered Marketing Agency in Agartala
                  </span>
                </span>{" "}
                <span className="block text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.04] text-foreground">
                  {ACTIVE.line}
                </span>{" "}
                <span className="block bg-gradient-to-r from-[hsl(22_98%_54%)] via-[hsl(8_90%_54%)] to-[hsl(340_82%_52%)] bg-clip-text pb-2 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.04] text-transparent">
                  {ACTIVE.accent}
                </span>
              </h1>
            </div>

            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <p className="mx-auto mb-9 mt-5 max-w-xl break-words text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {ACTIVE.sub}
              </p>
            </div>

            <div
              className="opacity-0 animate-fade-in-up flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
              style={{ animationDelay: "0.5s" }}
            >
              <a href="#contact" aria-label="Start your project" className="w-full sm:w-auto flex justify-center">
                <CtaButton />
              </a>
              <a
                href="#portfolio"
                className="hero-glass group inline-flex h-[50px] items-center gap-2 rounded-[20px] px-7 text-base font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-medium"
              >
                See our work
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* 3D growth stack */}
          <div className="opacity-0 animate-fade-in min-w-0" style={{ animationDelay: "0.35s" }}>
            <HeroScene />
          </div>
        </div>

        {/* Proof strip */}
        <div
          className="opacity-0 animate-fade-in mx-auto mt-12 grid min-w-0 max-w-4xl grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:grid-cols-4 lg:mt-16"
          style={{ animationDelay: "0.8s" }}
        >
          {STATS.map((stat, index) => {
            const numericValue = parseInt(stat.number.replace(/[^\d]/g, ""), 10);
            const suffix = stat.number.replace(/\d/g, "");
            const prefix = index === 3 ? "₹" : "";

            return (
              <div
                key={stat.label}
                className="hero-glass flex min-h-[92px] min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-3 text-center transition duration-300 hover:-translate-y-1 hover:shadow-medium sm:min-h-[100px]"
              >
                <div className="mb-1 font-display text-2xl font-bold tabular-nums text-primary sm:text-3xl md:text-4xl">
                  {prefix}
                  <CountUp
                    end={numericValue}
                    duration={3.5}
                    delay={index * 0.2}
                    suffix={suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="hyphens-auto break-words px-0.5 text-[11px] leading-snug text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
