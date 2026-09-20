import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { PORTFOLIO_PROJECTS } from "@/data/portfolioData";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const projects = PORTFOLIO_PROJECTS;

const categories = ["All", "Content Production", "Social Media", "Web Development", "Performance Marketing"];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="portfolio" className="section-aurora relative overflow-x-clip bg-background py-16 sm:py-20 lg:py-32">
      <div className="container mx-auto min-w-0 px-4 sm:px-6">
        <SectionHeader
          eyebrow="Case Studies"
          title="Our"
          accent="Work"
          description="Explore our portfolio of successful projects and transformative campaigns"
        />

        {/* Filter pills — the active pill slides between options (layout animation, transform only) */}
        <Reveal className="mb-10 flex flex-wrap justify-center gap-2 px-1 sm:mb-12 sm:gap-3">
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-center text-xs font-medium leading-tight transition-colors duration-300 sm:px-6 sm:text-base",
                  active ? "text-primary-foreground" : "glass text-secondary-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 rounded-full bg-primary shadow-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{category}</span>
              </button>
            );
          })}
        </Reveal>

        {/* key restarts the stagger when the category changes */}
        <Stagger
          key={activeCategory}
          gap={0.08}
          className="mx-auto grid min-w-0 max-w-7xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project, index) => (
            <StaggerItem key={`${project.slug}-${index}`} className="h-full">
              <TiltCard className="rounded-3xl" max={6}>
                <Link
                  to={`/portfolio/${project.slug}`}
                  className="group flex h-full flex-col rounded-3xl p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="translate-y-4 rounded-full bg-primary-foreground p-3 text-primary transition-transform duration-300 group-hover:translate-y-0">
                        <ArrowUpRight className="h-6 w-6" aria-hidden />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 pb-3">
                    <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/10 bg-background/70 px-3 py-1 text-xs font-medium text-secondary-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(16_98%_55%)]" />
                      {project.category}
                    </div>
                    <h3 className="mb-2 font-display text-xl font-bold transition-colors">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default Portfolio;
