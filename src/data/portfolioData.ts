export type PortfolioGalleryItem = {
  src: string;
  alt: string;
};

export type VideoItem = {
  src: string;
  title: string;
  aspectRatio?: "16:9" | "9:16" | "1:1" | "auto"; // Default: auto
};

export type VideoSection = {
  title: string;
  description?: string;
  videos: VideoItem[];
};

export type ImageSection = {
  title: string;
  description?: string;
  images: PortfolioGalleryItem[];
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  gallery: PortfolioGalleryItem[];
  videoSections?: VideoSection[];
  imageSections?: ImageSection[];
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
    slug: "growthLab-lead-generation",
    title: "GrowthLab Lead Generation",
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
    gallery: [],
    videoSections: [
      {
        title: "YouTube Hooks",
        description: "Cinematic teasers designed to capture attention in 16:9 format",
        videos: [
          {
            src: "https://www.youtube.com/embed/YoIztPluRC8",
            title: "Synapse hook 3",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/vqtB1cl1SHw",
            title: "Dr. SK hook",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/I0CM5uliXSQ",
            title: "Chessverse hook",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/OjQ2mGTKKpk",
            title: "Synapse hook 2",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/99zsZAYx5CE",
            title: "Synapse hook 1",
            aspectRatio: "16:9",
          },
        ],
      },
      {
        title: "Motion Graphics",
        description: "Dynamic motion graphics and animations in vertical 9:16 format",
        videos: [
          {
            src: "https://www.youtube.com/embed/yIh-E16ue6w",
            title: "Motion Graphics 1",
            aspectRatio: "9:16",
          },
          {
            src: "https://www.youtube.com/embed/TT6Yc1Om4iw",
            title: "Motion Graphics 2",
            aspectRatio: "9:16",
          },
          {
            src: "https://www.youtube.com/embed/lsFH4fhdSwo",
            title: "Motion Graphics 3",
            aspectRatio: "9:16",
          },
          {
            src: "https://www.youtube.com/embed/jJmJWkoXNSI",
            title: "Motion Graphics 4",
            aspectRatio: "9:16",
          },
        ],
      },
      {
        title: "Explainer Videos",
        description: "Comprehensive product and service explanations",
        videos: [
          {
            src: "https://www.youtube.com/embed/noVdyBcHs48",
            title: "Rencare Big Hinglish",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/Kz7vF4ZTCIY",
            title: "Struggling with mathematics",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/5Lf6VEaJo0Y",
            title: "A Proud Moment of collaboration & Growth",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/6ley8tKyBzs",
            title: "Something big is coming... Are you ready to enter the universe od chess ?",
            aspectRatio: "16:9",
          },
        ],
      },
    ],
  },
  {
    slug: "creative-designs",
    title: "Creative Designs",
    category: "Graphic Designs",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop&q=80",
    description:
      "Stunning creative designs crafted for maximum impact across all platforms and formats.",
    gallery: [],
    imageSections: [
      {
        title: "Banners & Flex Designs",
        description: "Eye-catching banners and flexible designs for various platforms",
        images: [
          {
            src: "/Creative Visual Designs/Banners & Flex Designs/Synapse 2025 Crash course.jpg",
            alt: "Synapse 2025 Crash course Banner"
          }
        ],
      },
      {
        title: "Ad Creatives (Social Media Posters)",
        description: "Engaging social media ad creatives optimized for conversions",
        images: [],
      },
      {
        title: "High CTR Thumbnails",
        description: "High-converting thumbnails designed to capture attention and drive clicks",
        images: [
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/aru podcast thumbnail.jpeg",
            alt: "Aru Podcast Thumbnail"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/Copy of ADMISSIONS OPEN (Facebook Cover) (3).jpg",
            alt: "Admissions Open Thumbnail"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/HONSLA - EENDHAN - BADLA (1).jpg",
            alt: "Honsla Eendhan Badla Thumbnail"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/Prayam TN 1.jpeg",
            alt: "Prayam Thumbnail 1"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/Prayam TN 2.jpeg",
            alt: "Prayam Thumbnail 2"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/Prayam TN 3.jpeg",
            alt: "Prayam Thumbnail 3"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/SK TN 1.jpeg",
            alt: "SK Thumbnail 1"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/SK TN 2.jpeg",
            alt: "SK Thumbnail 2"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/Syn TN test 2.jpeg",
            alt: "Synapse Thumbnail Test 2"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/Synapse test TN 1.jpeg",
            alt: "Synapse Thumbnail Test 1"
          },
          {
            src: "/Creative Visual Designs/High CTR Thumbnails/ube.jpg",
            alt: "YOUTUBE Thumbnail"
          }
        ],
      },
    ],
  },
];

const bySlug = new Map(PORTFOLIO_PROJECTS.map((p) => [p.slug, p]));

export function getPortfolioProjectBySlug(slug: string | undefined): PortfolioProject | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug);
}
