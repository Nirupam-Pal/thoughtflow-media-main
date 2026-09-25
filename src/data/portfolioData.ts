export type PortfolioGalleryItem = {
  src: string;
  /** Describes the image; case studies also use it as the visible title. */
  alt: string;
  /** Short format label, e.g. "Admission Ad". */
  tag?: string;
  /** Intrinsic size, for pieces shown at their own proportions (reserves space, no layout shift). */
  width?: number;
  height?: number;
};

export type VideoItem = {
  /** A YouTube embed URL, or a self-hosted file path (e.g. "/videos/1.mp4"). */
  src: string;
  title: string;
  /** Still frame for self-hosted videos, shown until the visitor presses play. (YouTube posters are derived.) */
  poster?: string;
  /** Tiny muted loop for self-hosted videos, played on hover / in view instead of the full file. */
  preview?: string;
  /** Short format label shown on the tile, e.g. "Brand Film". Falls back to the section title. */
  tag?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1" | "auto"; // Default: auto
};

/**
 * How a video case study lays a section out:
 *   wall      – columns of vertical videos that drift at different speeds while scrolling
 *   editorial – one large feature with smaller tiles stacked beside it
 *   filmstrip – a single row of vertical videos at staggered heights
 *   reel      – a horizontal, draggable row of large cinematic cards
 * Omitted → chosen from the videos' aspect ratio.
 */
export type VideoSectionLayout = "wall" | "editorial" | "filmstrip" | "reel";

export type VideoSection = {
  title: string;
  description?: string;
  layout?: VideoSectionLayout;
  videos: VideoItem[];
};

/** Extra storytelling for video case studies. Every part is optional. */
export type CaseStudyStory = {
  /** Metadata strip in the hero, e.g. { label: "Client type", value: "Education brands" }. */
  meta?: ProjectMetric[];
  /** A short statement about the creative approach, plus supporting principles. */
  approach?: { statement: string; points: { title: string; description: string }[] };
  process?: { title: string; description: string }[];
  /** `src` of the video (from any section) to feature in the full-width showreel band. */
  showreel?: string;
  /** `src`s of vertical videos to feature in the hero, front card first. */
  heroVideos?: string[];
  /** `src`s of images to feature in the hero, front card first. */
  heroImages?: string[];
};

/**
 * How a design case study lays out an image section:
 *   wall      – portrait posters in columns that drift at different speeds
 *   editorial – landscape pieces as a large feature with two stacked beside it
 *   billboard – a few big pieces hung on a textured wall, sized to their own proportions
 */
export type ImageSectionLayout = "wall" | "editorial" | "billboard";

export type ImageSection = {
  title: string;
  description?: string;
  layout?: ImageSectionLayout;
  images: PortfolioGalleryItem[];
};

/** A real, verified result to headline on the card, e.g. { value: "+240%", label: "ROI" }. */
export type ProjectMetric = {
  value: string;
  label: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  /** Optional. Shown as large stats on the card; only add numbers you can back up. */
  metrics?: ProjectMetric[];
  gallery: PortfolioGalleryItem[];
  videoSections?: VideoSection[];
  imageSections?: ImageSection[];
  story?: CaseStudyStory;
};

// Self-hosted ad videos and posters (optimized by scripts/optimize-videos.mjs and scripts/optimize-images.mjs).
// Files are numbered 1..N in the order listed here.
const adVideos = (items: { title: string; tag: string }[]): VideoItem[] =>
  items.map(({ title, tag }, i) => ({
    src: `/videos/${i + 1}.mp4`,
    poster: `/videos/poster/${i + 1}.webp`,
    preview: `/videos/preview/${i + 1}.mp4`,
    title,
    tag,
    aspectRatio: "9:16",
  }));

// Files are numbered 1..N in the order listed here.
const adPosters = (items: { alt: string; tag: string }[]): PortfolioGalleryItem[] =>
  items.map(({ alt, tag }, i) => ({ src: `/posters/${i + 1}.webp`, alt, tag }));

// Optimised .webp next to each original in public/Creative Visual Designs/<folder>/ (scripts/optimize-images.mjs).
const designs = (
  folder: string,
  items: { file: string; alt: string; tag: string; width?: number; height?: number }[]
): PortfolioGalleryItem[] =>
  items.map(({ file, ...rest }) => ({ src: `/Creative Visual Designs/${folder}/${file}.webp`, ...rest }));

const gallery = (
  items: { seed: string; alt: string }[],
): PortfolioGalleryItem[] =>
  items.map(({ seed, alt }) => ({
    src: `https://images.unsplash.com/${seed}?w=1600&h=1000&fit=crop&q=80&auto=format`,
    alt,
  }));

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: "techstart-brand-campaign",
    title: "TechStart Brand Campaign",
    category: "Content Production",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80&auto=format",
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
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&q=80&auto=format",
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
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80&auto=format",
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
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80&auto=format",
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
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop&q=80&auto=format",
    description:
      "High-impact commercial ads, product spots, and social-first cutdowns.",
    gallery: [],
    videoSections: [
      {
        title: "ROI-Driven Ad Videos",
        description: "Highly engineered ad videos built for performance (90% better performance)",
        layout: "wall",
        videos: adVideos([
          { title: "Chemistry Classes Teaser", tag: "Education Ad" },
          { title: "MediQues Test Series Launch", tag: "Launch Promo" },
          { title: "Prayam Classes Brand Story", tag: "Brand Film" },
          { title: "Maths Faculty Introduction", tag: "Talking Head" },
          { title: "Namaskar Welcome Reel", tag: "UGC Reel" },
          { title: "Synapse Celebration Reel", tag: "Event Reel" },
          { title: "Teacher's Day Celebration", tag: "Event Reel" },
          { title: "Synapse Test Series Announcement", tag: "Announcement" },
          { title: "Seven Oceans Music School", tag: "Brand Intro" },
          { title: "Campus Walkthrough", tag: "UGC Reel" },
          { title: "Synapse Exam Update", tag: "Announcement" },
          { title: "Synapse Podcast Clip", tag: "Podcast" },
        ]),
      },
      {
        title: "YouTube Hooks",
        description: "Cinematic teasers designed to capture attention in 16:9 format",
        layout: "editorial",
        videos: [
          {
            src: "https://www.youtube.com/embed/YoIztPluRC8",
            title: "Synapse Brand Teaser",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/vqtB1cl1SHw",
            title: "Dr. SK Biology Awareness Reel",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/I0CM5uliXSQ",
            title: "Chessverse Launch Trailer",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/OjQ2mGTKKpk",
            title: "Synapse Product Spotlight",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/99zsZAYx5CE",
            title: "Synapse Growth Story",
            aspectRatio: "16:9",
          },
        ],
      },
      {
        title: "Motion Graphics",
        description: "Dynamic motion graphics and animations in vertical 9:16 format",
        layout: "filmstrip",
        videos: [
          {
            src: "https://www.youtube.com/embed/yIh-E16ue6w",
            title: "Animated Brand Motion",
            aspectRatio: "9:16",
          },
          {
            src: "https://www.youtube.com/embed/TT6Yc1Om4iw",
            title: "Dynamic Social Ad Animation",
            aspectRatio: "9:16",
          },
          {
            src: "https://www.youtube.com/embed/lsFH4fhdSwo",
            title: "Product Launch Motion Graphic",
            aspectRatio: "9:16",
          },
          {
            src: "https://www.youtube.com/embed/jJmJWkoXNSI",
            title: "Promotional Motion Loop",
            aspectRatio: "9:16",
          },
        ],
      },
      {
        title: "Explainer Videos",
        description: "Comprehensive product and service explanations",
        layout: "reel",
        videos: [
          {
            src: "https://www.youtube.com/embed/noVdyBcHs48",
            title: "Rencare Explainer Video",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/Kz7vF4ZTCIY",
            title: "Mathematics Learning Explainer",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/5Lf6VEaJo0Y",
            title: "Collaboration & Growth Spotlight",
            aspectRatio: "16:9",
          },
          {
            src: "https://www.youtube.com/embed/6ley8tKyBzs",
            title: "Chess Universe Teaser",
            aspectRatio: "16:9",
          },
        ],
      },
    ],
    story: {
      meta: [
        { label: "Clients", value: "Education & local brands" },
        { label: "Formats", value: "Reels · YouTube · Explainers" },
        { label: "Platforms", value: "Instagram · YouTube · Meta Ads" },
      ],
      approach: {
        statement:
          "Nobody owes an ad their attention. So every frame we cut has one job: earn the next second.",
        points: [
          {
            title: "Hook in the first second",
            description: "Open on motion, a face or a question. The thumb decides before the logo ever shows up.",
          },
          {
            title: "Built for sound-off",
            description: "Bold on-screen type and captions carry the story, so it lands even on mute.",
          },
          {
            title: "Cut for every placement",
            description: "One shoot becomes Reels, Shorts, YouTube spots and ad variations ready to test.",
          },
        ],
      },
      process: [
        {
          title: "Concept",
          description: "Audience insight, hooks and a tight script, planned around where the video will run.",
        },
        {
          title: "Production",
          description: "On-location or in-studio shoots with talent, faculty and founders who feel real on camera.",
        },
        {
          title: "Editing",
          description: "Pacing, motion graphics, captions and sound design tuned for retention.",
        },
        {
          title: "Final Output",
          description: "Platform-ready cuts in every aspect ratio, ready to publish and scale with ads.",
        },
      ],
      showreel: "https://www.youtube.com/embed/YoIztPluRC8",
      heroVideos: ["/videos/6.mp4", "/videos/3.mp4", "/videos/9.mp4"],
    },
  },
  {
    slug: "creative-designs",
    title: "Creative Designs",
    category: "Graphic Designs",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop&q=80&auto=format",
    description:
      "Stunning creative designs crafted for maximum impact across all platforms and formats.",
    gallery: [],
    imageSections: [
      {
        title: "Ad Creatives (Social Media Posters)",
        description: "Feed-ready posters that bring enquiries and enrollments (50% better performance)",
        layout: "wall",
        images: adPosters([
          { alt: "NEET 2025 “All the Best” post for The Core Academy", tag: "Motivation Post" },
          { alt: "“Achievers of Excellence” results post for Prayam Classes", tag: "Results Post" },
          { alt: "“All the Best Champions” JEE Advanced 2025 post for Prayam Classes", tag: "Motivation Post" },
          { alt: "MediQuest NEET Test Series 2025 ad for The Core Academy", tag: "Admission Ad" },
          { alt: "AI117 tribute post for Ready to Ride", tag: "Topical Post" },
          { alt: "Father’s Day special offer for Ready to Ride", tag: "Offer Ad" },
          { alt: "Baleno self-drive rental ad for Ready to Ride", tag: "Product Ad" },
          { alt: "Royal Enfield GT 650 rental ad for Ready to Ride", tag: "Product Ad" },
          { alt: "“Save up to 80% on electricity bills” ad for Rencare Energy", tag: "Lead Gen Ad" },
          { alt: "PM Surya Ghar solar subsidy ad for Rencare Energy", tag: "Lead Gen Ad" },
          { alt: "NEEV 3.0 Chemistry Foundation admission ad for The Core Academy", tag: "Admission Ad" },
          { alt: "Mentor spotlight on Er. Pratik Sir for Prayam Classes", tag: "Faculty Spotlight" },
          { alt: "Free solar site visit ad for Rencare Energy", tag: "Lead Gen Ad" },
        ]),
      },
      {
        title: "High CTR Thumbnails",
        description: "High-converting thumbnails designed to capture attention and drive clicks",
        layout: "editorial",
        images: designs("High CTR Thumbnails", [
          { file: "Synapse test TN 1", alt: "“NEET 2025 Expected Cutoff” thumbnail for Synapse", tag: "YouTube Thumbnail" },
          { file: "aru podcast thumbnail", alt: "“Study Smarter, Not Harder” podcast thumbnail for Synapse", tag: "Podcast Thumbnail" },
          { file: "ube", alt: "“Huge Update! Crash Course 2026” thumbnail", tag: "YouTube Thumbnail" },
          { file: "Prayam TN 2", alt: "“JEE Advanced 2025 Paper Prediction” thumbnail for Prayam Classes", tag: "YouTube Thumbnail" },
          { file: "Syn TN test 2", alt: "“99% Students Fail Because of This” thumbnail for Synapse", tag: "Podcast Thumbnail" },
          { file: "HONSLA - EENDHAN - BADLA (1)", alt: "“CBSE Class 10 Toppers 2026” thumbnail", tag: "YouTube Thumbnail" },
          { file: "SK TN 2", alt: "“Neural Control & Coordination” biology lecture thumbnail", tag: "Lecture Thumbnail" },
          { file: "Prayam TN 1", alt: "“How to Find a Square Root” maths thumbnail for Prayam Classes", tag: "Lecture Thumbnail" },
          { file: "SK TN 1", alt: "“Attention Class 11 & 12 Students” thumbnail", tag: "YouTube Thumbnail" },
          { file: "Prayam TN 3", alt: "“Complex Number – JEE Advance Problem Discussion” thumbnail for Prayam Classes", tag: "Lecture Thumbnail" },
        ]),
      },
      {
        title: "Banners & Flex Designs",
        description: "Print flex and cover banners that stay readable from across the street",
        layout: "billboard",
        images: [
          ...designs("Banners & Flex Designs", [
            { file: "Synapse 2025 Crash course", alt: "Synapse NEET 2025 Crash Course flex banner", tag: "Print Flex", width: 3375, height: 4219 },
          ]),
          // Filed with the thumbnails on disk, but it's a 2.7:1 cover banner.
          ...designs("High CTR Thumbnails", [
            { file: "Copy of ADMISSIONS OPEN (Facebook Cover) (3)", alt: "“Admissions Open” Facebook cover for Conjugate", tag: "Facebook Cover", width: 2659, height: 984 },
          ]),
        ],
      },
    ],
    story: {
      meta: [
        { label: "Clients", value: "Coaching, auto rental & solar brands" },
        { label: "Formats", value: "Posters · Thumbnails · Flex" },
        { label: "Platforms", value: "Instagram · YouTube · Print" },
      ],
      approach: {
        statement:
          "A thumb gives a design half a second. So every layout we build says one thing: stop here, this is for you.",
        points: [
          {
            title: "One message per frame",
            description: "A single headline, a single offer, a single action. Anything else is noise at scrolling speed.",
          },
          {
            title: "Faces and big numbers",
            description: "Real people and bold prices, ranks or dates pull the eye first, then the brand closes the deal.",
          },
          {
            title: "Consistent, but native",
            description: "Each brand keeps its colours and type while every piece is sized and paced for where it runs.",
          },
        ],
      },
      process: [
        {
          title: "Brief",
          description: "Goal, audience and offer pinned down first, with a look at what competitors are running.",
        },
        {
          title: "Concept",
          description: "Headline, hierarchy and a rough layout, so the message works before any pixels are polished.",
        },
        {
          title: "Design",
          description: "Photography, type and colour brought together in the brand's system, with quick feedback rounds.",
        },
        {
          title: "Delivery",
          description: "Export-ready files for every size: feed, story, thumbnail, cover and print.",
        },
      ],
      heroImages: ["/posters/3.webp", "/posters/7.webp", "/posters/9.webp"],
    },
  },
];

const bySlug = new Map(PORTFOLIO_PROJECTS.map((p) => [p.slug, p]));

export function getPortfolioProjectBySlug(slug: string | undefined): PortfolioProject | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug);
}
