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
  /**
   * The project's signature animated section. `kind` picks the visual, the rest is its copy:
   *   campaign – one central idea wired out to every channel (items = channels)
   *   funnel   – stages stacking into a funnel with leads flowing through (items = stages)
   *   build    – a browser mockup assembling as you scroll (items = build layers)
   *   growth   – a test-and-scale curve drawing on scroll, plus a lead pipeline (items = milestones)
   */
  feature?: {
    kind: "campaign" | "funnel" | "build" | "growth";
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    items: { title: string; description: string }[];
  };
  /** Heading for a photo gallery (projects that use `gallery` instead of sections). */
  gallery?: { title: string; description?: string };
  /** Closing call to action. */
  cta?: { title: string; accent: string; body: string };
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
      { seed: "photo-1531403009284-440f080d1e12", alt: "Campaign creative boards" },
      { seed: "photo-1522071820081-009f0129c71c", alt: "Content production" },
    ]),
    story: {
      meta: [
        { label: "Client", value: "TechStart" },
        { label: "Scope", value: "Strategy · UGC · Launch films" },
        { label: "Channels", value: "Instagram · YouTube · Web" },
      ],
      approach: {
        statement:
          "A launch is only as strong as its idea. So we found one and made every channel say it: clearly, consistently, everywhere.",
        points: [
          { title: "One big idea", description: "A single message the whole campaign hangs on, tested with the audience before anything is produced." },
          { title: "UGC that feels real", description: "Creator-style content that sounds like customers, not like an ad reading itself out." },
          { title: "Toolkits, not one-offs", description: "Templates and guidelines so the team can keep the campaign going long after launch day." },
        ],
      },
      process: [
        { title: "Discover", description: "Brand, audience and competitor research to find the gap the launch can own." },
        { title: "Concept", description: "The campaign idea, key messages and a creative route for every channel." },
        { title: "Produce", description: "Launch films, UGC shoots and design assets, produced in-house." },
        { title: "Roll out", description: "Channel toolkits and a launch calendar so everything lands together." },
      ],
      feature: {
        kind: "campaign",
        eyebrow: "The Campaign",
        title: "One idea,",
        accent: "every channel",
        body: "Great campaigns don't reinvent themselves per platform. They carry one idea everywhere, adapted to how each channel is actually used.",
        items: [
          { title: "Launch Films", description: "Hero videos that introduce the brand story." },
          { title: "UGC", description: "Creator content that builds trust at scale." },
          { title: "Social", description: "Always-on posts and reels in the campaign look." },
          { title: "Web", description: "Landing pages that carry the idea to conversion." },
          { title: "Toolkits", description: "Templates so the team keeps it consistent." },
        ],
      },
      gallery: { title: "Campaign Highlights", description: "Workshops, creative boards and production from the launch." },
      cta: {
        title: "Launching something",
        accent: "worth talking about?",
        body: "Let's build the idea behind it, then make every channel say it well.",
      },
    },
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
      { seed: "photo-1557804506-669a67965ba0", alt: "Whiteboard planning session" },
      { seed: "photo-1556761175-5973dc0f32e7", alt: "Group coaching" },
      { seed: "photo-1522202176988-66273c2fd55f", alt: "Laptop and notes" },
      { seed: "photo-1504384308090-c894fdcc538d", alt: "Presentation stage" },
    ]),
    story: {
      meta: [
        { label: "Programme", value: "Funnel Workshop" },
        { label: "Scope", value: "Curriculum · Ad frameworks · Assets" },
        { label: "Format", value: "Live workshops · Templates" },
      ],
      approach: {
        statement:
          "Most funnels leak because each stage is built on its own. We teach teams to design the whole journey: every ad, page and follow-up doing one job.",
        points: [
          { title: "Stage-by-stage thinking", description: "Each step of the funnel gets its own goal, message and measure of success." },
          { title: "Frameworks you can reuse", description: "Ad creative and landing page frameworks the team can apply to every future campaign." },
          { title: "Hands-on, not theory", description: "Participants build their own funnel during the workshop, with feedback as they go." },
        ],
      },
      process: [
        { title: "Audit", description: "A look at the team's current funnel to find where attention and leads drop off." },
        { title: "Curriculum", description: "A full-funnel course shaped around the gaps the audit found." },
        { title: "Assets", description: "Slides, worksheets and creative templates for every module." },
        { title: "Workshop", description: "Live, hands-on sessions that end with a funnel ready to launch." },
      ],
      feature: {
        kind: "funnel",
        eyebrow: "The Framework",
        title: "The whole funnel,",
        accent: "one stage at a time",
        body: "The workshop walks through every stage of the journey, so each ad and page knows exactly what it's there to do.",
        items: [
          { title: "Awareness", description: "Scroll-stopping creative that earns a first look." },
          { title: "Interest", description: "Content that turns a glance into curiosity." },
          { title: "Consideration", description: "Proof, answers and offers that build trust." },
          { title: "Conversion", description: "Landing pages and calls to action that close." },
          { title: "Retention", description: "Follow-ups that bring customers back." },
        ],
      },
      gallery: { title: "Workshop Moments", description: "Slides, sessions and whiteboards from the training." },
      cta: {
        title: "Want your team to",
        accent: "think in funnels?",
        body: "Let's run a workshop built around your product, your audience and your numbers.",
      },
    },
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
      { seed: "photo-1454165804606-c3d57bc86b40", alt: "Reviewing analytics reports" },
      { seed: "photo-1551650975-87deedd944c3", alt: "Mobile mockup" },
    ]),
    story: {
      meta: [
        { label: "Scope", value: "Landing pages · SEO hubs · Dashboards" },
        { label: "Build", value: "Custom, performance-first" },
        { label: "Goal", value: "Organic search growth" },
      ],
      approach: {
        statement:
          "Traffic you pay for stops when the budget does. So we build pages that search engines can read and people want to use.",
        points: [
          { title: "Fast by default", description: "Lightweight pages that load quickly on real phones and real networks." },
          { title: "Content built for search", description: "Topic hubs and landing pages planned around what people actually search for." },
          { title: "Measure everything", description: "Dashboards that show which pages bring visitors, and which bring leads." },
        ],
      },
      process: [
        { title: "Research", description: "Keyword and competitor research to map the searches worth winning." },
        { title: "Architecture", description: "Site structure, internal linking and page templates planned around those searches." },
        { title: "Build", description: "Custom-engineered pages, tuned for speed, accessibility and search." },
        { title: "Measure", description: "Performance dashboards, then ongoing content and technical improvements." },
      ],
      feature: {
        kind: "build",
        eyebrow: "The Build",
        title: "Engineered in",
        accent: "layers",
        body: "Every page is built up in the same order, so nothing important is left to the end.",
        items: [
          { title: "Structure", description: "Clean, semantic templates search engines can read." },
          { title: "Content", description: "Pages written around real search intent." },
          { title: "Speed", description: "Optimised images, code and delivery for fast loads." },
          { title: "Insight", description: "Dashboards that track what brings visitors and leads." },
        ],
      },
      gallery: { title: "Build Highlights", description: "Workspaces, interfaces and dashboards from the build." },
      cta: {
        title: "Ready for traffic that",
        accent: "doesn't stop?",
        body: "Let's build a site that keeps bringing in visitors long after launch.",
      },
    },
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
    story: {
      meta: [
        { label: "Client", value: "GrowthLab" },
        { label: "Scope", value: "Paid ads · Landing pages · Reporting" },
        { label: "Channels", value: "Meta Ads · Google Ads" },
      ],
      approach: {
        statement:
          "Every rupee should be able to explain itself. So each campaign is built to be measured, tested and scaled on what the data says.",
        points: [
          { title: "Tracking before spend", description: "Conversion tracking and reporting are set up before the first rupee goes out." },
          { title: "Test creatives fast", description: "Several angles launched side by side, so the audience picks the winner." },
          { title: "Scale what converts", description: "Budget moves to the ads and audiences that bring real leads, not just clicks." },
        ],
      },
      process: [
        { title: "Audit", description: "Accounts, tracking and past results reviewed to find the quickest wins." },
        { title: "Launch", description: "Campaigns, audiences and landing pages go live with tracking in place." },
        { title: "Test", description: "Creatives, offers and audiences tested against each other every week." },
        { title: "Scale", description: "Budget shifted to what works, with clear reports on every rupee." },
      ],
      feature: {
        kind: "growth",
        eyebrow: "The Method",
        title: "Test, learn,",
        accent: "then scale",
        body: "Performance campaigns don't start big. They start measured, and grow as the data proves what works.",
        items: [
          { title: "Launch", description: "Tracking in place, first campaigns live." },
          { title: "Learn", description: "Early data shows which angles land." },
          { title: "Optimise", description: "Losers paused, winners refined." },
          { title: "Scale", description: "Budget follows what converts." },
        ],
      },
      gallery: { title: "Campaign Dashboards", description: "Reporting, reviews and the dashboards behind every decision." },
      cta: {
        title: "Want leads you can",
        accent: "actually measure?",
        body: "Let's set up campaigns where every rupee can explain itself.",
      },
    },
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
