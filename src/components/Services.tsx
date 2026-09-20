import { Video, TrendingUp, Code2, Play, MousePointer2, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";

const services: {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  Visual: () => JSX.Element;
}[] = [
  {
    icon: Video,
    title: "Content Services",
    description: "End-to-end content creation including UGC videos, commercial ads, and social media content. From pre-production to post-production, we bring your brand story to life.",
    features: ["UGC Videos", "Commercial Ads", "YouTube Content", "Social Media Posts", "Pre & Post Production"],
    Visual: ContentVisual,
  },
  {
    icon: TrendingUp,
    title: "Performance Marketing",
    description: "Data-driven marketing strategies that generate leads, drive conversions, and maximize sales. We turn clicks into customers and browsers into buyers.",
    features: ["Lead Generation", "Conversion Optimization", "ROI Tracking", "Sales Funnels", "Campaign Management"],
    Visual: PerformanceVisual,
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Dynamic websites, admin portals, and landing pages built with cutting-edge technology. Automation solutions that streamline your business operations.",
    features: ["Custom Websites", "Admin Portals", "Landing Pages", "Work Automation", "API Integration"],
    Visual: WebVisual,
  },
];

/* ── Floating CSS-3D "data cards". Children sit at different translateZ
      depths, so the card's tilt gives them real parallax. ── */

function ContentVisual() {
  const cards = [
    { x: -38, z: 18, r: -12, bg: "linear-gradient(160deg,hsl(30 10% 30%),hsl(30 10% 12%))" },
    { x: 38, z: 18, r: 12, bg: "linear-gradient(160deg,hsl(38 45% 92%),hsl(38 45% 80%))" },
    { x: 0, z: 46, r: 0, bg: "linear-gradient(160deg,hsl(22 98% 58%),hsl(340 82% 52%))" },
  ];
  return (
    <>
      {cards.map((c, i) => (
        <div
          key={i}
          className={`absolute flex h-[78px] w-[48px] items-center justify-center rounded-xl border border-white/70 shadow-medium ${i === 2 ? "svc-float" : ""}`}
          style={{ background: c.bg, transform: `translateX(${c.x}px) translateZ(${c.z}px) rotate(${c.r}deg)` }}
        >
          <Play className={`h-4 w-4 ${i === 1 ? "text-primary" : "text-white"}`} fill="currentColor" />
        </div>
      ))}
    </>
  );
}

function PerformanceVisual() {
  const bars = [26, 40, 34, 54, 74];
  return (
    <div className="absolute flex items-end gap-2" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[18px] rounded-md shadow-soft ${i === bars.length - 1 ? "svc-float" : ""}`}
          style={{
            height: h,
            transform: `translateZ(${i * 6}px)`,
            background:
              i === bars.length - 1
                ? "linear-gradient(180deg,hsl(22 98% 58%),hsl(340 82% 52%))"
                : `linear-gradient(180deg,hsl(30 10% ${34 - i * 3}%),hsl(30 10% 14%))`,
          }}
        />
      ))}
      <svg
        className="absolute -top-5 left-0"
        width="128"
        height="60"
        viewBox="0 0 128 60"
        fill="none"
        style={{ transform: "translateZ(40px)" }}
      >
        <path d="M2 54 C 30 50, 44 34, 66 30 S 104 14, 124 4" stroke="hsl(16 98% 55%)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="124" cy="4" r="4" fill="hsl(16 98% 55%)" />
      </svg>
    </div>
  );
}

function WebVisual() {
  return (
    <>
      <div
        className="absolute h-[92px] w-[148px] rounded-xl border border-white/80 bg-white/90 p-2.5 shadow-medium"
        style={{ transform: "translateZ(20px) rotateY(-10deg)" }}
      >
        <div className="mb-2 flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(0_80%_65%)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(40_90%_60%)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(140_50%_55%)]" />
        </div>
        <div className="mb-1.5 h-2 w-20 rounded bg-primary/80" />
        <div className="mb-3 h-1.5 w-28 rounded bg-primary/15" />
        <div className="h-7 w-full rounded-md bg-ember" />
      </div>
      <div
        className="svc-float-b absolute -right-1 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-medium"
        style={{ transform: "translateZ(56px)" }}
      >
        <MousePointer2 className="h-4 w-4" fill="currentColor" />
      </div>
    </>
  );
}

const Services = () => {
  return (
    <section className="section-aurora relative bg-background py-20 md:py-28 lg:py-32" id="services">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          eyebrow="Our Services"
          title="What We Do"
          accent="Best"
          description="Three core services, infinite possibilities. We blend creativity with technology to deliver exceptional results."
        />

        <Stagger className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3 lg:gap-8">
          {services.map(({ icon: Icon, title, description, features, Visual }) => (
            <StaggerItem key={title} className="h-full">
              <TiltCard className="rounded-3xl" max={7}>
                <div className="flex h-full flex-col p-6 sm:p-8">
                  <div
                    className="relative mb-7 flex h-40 items-center justify-center rounded-2xl bg-secondary/50"
                    style={{ transformStyle: "preserve-3d" }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(hsl(30_10%_15%/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(30_10%_15%/0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-background shadow-soft">
                      <Icon className="h-[18px] w-[18px] text-primary" />
                    </span>
                    <Visual />
                  </div>

                  <h3 className="mb-3 font-display text-2xl font-semibold">{title}</h3>
                  <p className="mb-6 leading-relaxed text-muted-foreground">{description}</p>

                  <ul className="mt-auto flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-full border border-primary/10 bg-background/70 px-3 py-1 text-xs font-medium text-foreground transition-colors duration-300 hover:border-primary/30 hover:bg-background sm:text-[13px]"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default Services;
