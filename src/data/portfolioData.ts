export type PortfolioGalleryItem = {
  src: string;
  alt: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  gallery: PortfolioGalleryItem[];
};

const gallery = (
  items: { seed: string; alt: string }[],
): PortfolioGalleryItem[] =>
  items.map(({ seed, alt }) => ({
    src: `https://images.unsplash.com/${seed}?w=1600&h=1000&fit=crop&q=80`,
    alt,
  }));

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: "techstart-brand-campaign",
    title: "TechStart Brand Campaign",
    category: "Content Production",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
    description:
      "Complete brand transformation with UGC content strategy, launch films, and channel toolkits.",
    gallery: gallery([
      { seed: "photo-1460925895917-afdab827c52f", alt: "Analytics dashboard mockup" },
      { seed: "photo-1551434678-e076c223a692", alt: "Team collaboration" },
      { seed: "photo-1542744173-8e7e53415bb0", alt: "Strategy workshop" },
      { seed: "photo-1553877522-43269d4ea984", alt: "Brand presentation" },
      { seed: "photo-1533750516457-a7f3520142e9", alt: "Campaign creative boards" },
      { seed: "photo-1522071820081-009f0129c71c", alt: "Content production" },
    ]),
  },
  {
    slug: "funnel-workshop-training",
    title: "Funnel Workshop Training",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&q=80",
    description:
      "Full-funnel marketing curriculum, ad creative frameworks, and hands-on workshop assets.",
    gallery: gallery([
      { seed: "photo-1558655146-9f40138edfeb", alt: "Workshop slides" },
      { seed: "photo-1552664730-d307ca884978", alt: "Training session" },
      { seed: "photo-1517245386807-bb43f82e33f4", alt: "Whiteboard funnel" },
      { seed: "photo-1556761175-5973dc0f32e7", alt: "Group coaching" },
      { seed: "photo-1522202176988-66273c2fd55f", alt: "Laptop and notes" },
      { seed: "photo-1504384308090-c894fdcc538d", alt: "Presentation stage" },
    ]),
  },
  {
    slug: "organic-growth-engine",
    title: "Organic Growth Engine",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80",
    description:
      "Custom-engineered organic growth: landing pages, SEO content hubs, and performance dashboards.",
    gallery: gallery([
      { seed: "photo-1498050108023-c5249f4df085", alt: "Developer workspace" },
      { seed: "photo-1461749280684-dccba630e2f6", alt: "Code on screen" },
      { seed: "photo-1504639725590-34d0984388bd", alt: "App interface" },
      { seed: "photo-1555066931-4365d14bab8c", alt: "UI components" },
      { seed: "photo-1517694712202-3dd9230cf112", alt: "Laptop analytics" },
      { seed: "photo-1551650975-87deedd944c3", alt: "Mobile mockup" },
    ]),
  },
  {
    slug: "okv",
    title: "OKV",
    category: "Performance Marketing",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
    description:
      "Data-driven campaigns and reporting dashboards delivering measurable ROI.",
    gallery: gallery([
      { seed: "photo-1551288049-bebda4e38f71", alt: "Performance charts" },
      { seed: "photo-1553877522-43269d4ea984", alt: "Marketing metrics" },
      { seed: "photo-1551434678-e076c223a692", alt: "Campaign review" },
      { seed: "photo-1543286386-713bdd548da4", alt: "Growth graph" },
      { seed: "photo-1460925895917-afdab827c52f", alt: "KPI dashboard" },
    ]),
  },
  {
    slug: "scroll-stopping-video-production",
    title: "Scroll Stopping Video Production",
    category: "Content Production",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop&q=80",
    description:
      "High-impact commercial ads, product spots, and social-first cutdowns.",
    gallery: gallery([
      { seed: "photo-1492619375914-88005aa9e8fb", alt: "Video shoot" },
      { seed: "photo-1574717024653-61fd2cf4d44d", alt: "Editing suite" },
      { seed: "photo-1536240478700-b869070f9279", alt: "Camera setup" },
      { seed: "photo-1478720568477-152d9b164e26", alt: "Film lighting" },
      { seed: "photo-1516035069371-29a1b244ccff", alt: "Director monitor" },
    ]),
  },
  {
    slug: "creative-designs",
    title: "Creative Designs",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop&q=80",
    description:
      "Enterprise admin portal with real-time analytics and refined design systems.",
    gallery: gallery([
      { seed: "photo-1547658719-da2b51169166", alt: "Design workspace" },
      { seed: "photo-1561070791-2526d30994b5", alt: "UI kit" },
      { seed: "photo-1581291518857-4e27b48ff24e", alt: "Wireframes" },
      { seed: "photo-1507238691740-187a5b1d37b8", alt: "Web mockup" },
      { seed: "photo-1618005182384-a83a8bd57fbe", alt: "Abstract interface" },
    ]),
  },
];

const bySlug = new Map(PORTFOLIO_PROJECTS.map((p) => [p.slug, p]));

export function getPortfolioProjectBySlug(slug: string | undefined): PortfolioProject | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug);
}
