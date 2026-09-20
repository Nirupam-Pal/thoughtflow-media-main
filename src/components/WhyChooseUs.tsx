import { Sparkles, Target, Zap, Users } from "lucide-react";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";

const reasons = [
  {
    icon: Sparkles,
    title: "AI-Powered Creativity",
    description: "Leverage cutting-edge AI technology to create content that stands out and resonates with your audience."
  },
  {
    icon: Target,
    title: "Results-Driven Approach",
    description: "Every strategy is built around measurable outcomes. We focus on what matters: your growth and success."
  },
  {
    icon: Zap,
    title: "Lightning Fast Delivery",
    description: "Speed without compromise. Our streamlined processes ensure rapid delivery while maintaining premium quality."
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Work with a passionate team committed to your success. We're partners in your growth journey."
  }
];

const WhyChooseUs = () => {
  return (
    <section aria-labelledby="why-heading" className="section-aurora relative overflow-hidden bg-gradient-premium py-20 md:py-28 lg:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(38_25%_88%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(38_25%_88%)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]" />

      <div className="container relative z-10 mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          id="why-heading"
          eyebrow="Why Thoughtflow"
          title="Why Choose"
          accent="Thoughtflow Mediaa"
          description="We don't just deliver projects—we build partnerships that drive lasting success."
        />

        <Stagger className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {reasons.map(({ icon: Icon, title, description }, i) => (
            <StaggerItem key={title} className="h-full">
              <TiltCard className="rounded-3xl" max={9}>
                <div className="group flex h-full flex-col p-6 sm:p-7">
                  <div
                    className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-soft transition-shadow duration-300 group-hover:shadow-medium"
                    style={{ transform: "translateZ(36px)" }}
                  >
                    <span className="absolute inset-0 rounded-2xl bg-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Icon className="relative h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <span className="mb-2 font-display text-sm font-semibold tabular-nums text-muted-foreground">
                    0{i + 1}
                  </span>
                  <h3 className="mb-3 font-display text-xl font-semibold">{title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default WhyChooseUs;
