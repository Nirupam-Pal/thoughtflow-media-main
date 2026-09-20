/**
 * Services offered — single source of truth.
 * Rendered by <Services /> and emitted as Service / OfferCatalog structured data.
 *
 * @typedef {{ id: string, title: string, description: string, features: string[], keywords: string }} ServiceItem
 * @type {ServiceItem[]}
 */
export const SERVICES = [
  {
    id: "content",
    title: "Content Services",
    description:
      "End-to-end content creation including UGC videos, commercial ads, and social media content. From pre-production to post-production, we bring your brand story to life.",
    features: ["UGC Videos", "Commercial Ads", "YouTube Content", "Social Media Posts", "Pre & Post Production"],
    keywords: "UGC video production, commercial ads, social media content, YouTube content",
  },
  {
    id: "performance",
    title: "Performance Marketing",
    description:
      "Data-driven marketing strategies that generate leads, drive conversions, and maximize sales. We turn clicks into customers and browsers into buyers.",
    features: ["Lead Generation", "Conversion Optimization", "ROI Tracking", "Sales Funnels", "Campaign Management"],
    keywords: "Meta Ads, Google Ads, lead generation, conversion optimization",
  },
  {
    id: "web",
    title: "Web Development",
    description:
      "Dynamic websites, admin portals, and landing pages built with cutting-edge technology. Automation solutions that streamline your business operations.",
    features: ["Custom Websites", "Admin Portals", "Landing Pages", "Work Automation", "API Integration"],
    keywords: "website development, landing pages, admin portals, business automation",
  },
];
