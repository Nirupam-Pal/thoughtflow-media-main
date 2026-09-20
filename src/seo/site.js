/**
 * SEO source of truth for Thoughtflow Mediaa.
 *
 * Plain JS (no TypeScript, no React) on purpose: it is imported by the React app
 * (src/components/Seo.tsx, pages) AND by the Node build tooling (vite.config.ts,
 * scripts/*.mjs) that bakes the same tags into the static HTML. One definition,
 * so what crawlers read in the raw HTML always matches what the app renders.
 */
import { SERVICES } from "../data/services.js";
import { TESTIMONIALS } from "../data/testimonials.js";

export const SITE = {
  url: "https://thoughtflowmediaa.com",
  name: "Thoughtflow Mediaa",
  shortName: "TFM",
  /** Brand variations people actually type. Emitted as schema alternateName + keywords. */
  alternateNames: ["TFM", "Thoughtflow Media", "Thoughtflow", "Thoughtflow Mediaa Agartala"],
  tagline: "We make your Brand Matter",
  lang: "en-IN",
  locale: "en_IN",
  themeColor: "#faf8f5",
  email: "thoughtflowmedia@gmail.com",
  phone: "+917005046836",
  address: { locality: "Agartala", region: "Tripura", country: "IN" },
  areaServed: ["Agartala", "Tripura", "Northeast India"],
  social: [
    "https://www.instagram.com/thoughtflowmediaa/",
    "https://www.facebook.com/profile.php?id=100094976734947",
    "https://www.linkedin.com/company/thoughtflow-media/",
  ],
  logo: { path: "/logo-512.png", width: 512, height: 512 },
  ogImage: {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Thoughtflow Mediaa — AI-powered digital marketing agency in Agartala, Tripura",
  },
};

export const KEYWORDS = [
  "Thoughtflow Mediaa",
  "Thoughtflow Media",
  "TFM",
  "TFM Agartala",
  "digital marketing agency in Agartala",
  "marketing agency Tripura",
  "AI marketing agency",
  "Meta Ads agency Agartala",
  "Google Ads agency Tripura",
  "social media marketing Agartala",
  "UGC video production",
  "video production Agartala",
  "web development Agartala",
  "performance marketing agency",
  "lead generation Northeast India",
];

export const abs = (path) => (path.startsWith("http") ? path : `${SITE.url}${path}`);

/** "/portfolio/x/" -> "/portfolio/x". Root stays "/". One canonical URL per page. */
export const normalizePath = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path) || "/";

/** Trim to a search-snippet-friendly length at a word boundary. */
export function clamp(text, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const ids = {
  org: `${SITE.url}/#organization`,
  site: `${SITE.url}/#website`,
  logo: `${SITE.url}/#logo`,
  service: `${SITE.url}/#service`,
  serviceItem: (id) => `${SITE.url}/#service-${id}`,
};

const areaServedNodes = () => [
  { "@type": "City", name: "Agartala" },
  { "@type": "State", name: "Tripura" },
  { "@type": "Place", name: "Northeast India" },
];

/* ───────────────────────── Page meta ───────────────────────── */

export function getHomeSeo() {
  const title = "Thoughtflow Mediaa (TFM) | Digital Marketing Agency Agartala";
  const description = clamp(
    "Thoughtflow Mediaa (TFM): AI-powered digital marketing agency in Agartala, Tripura. Meta & Google Ads, UGC videos, social media & websites for Northeast India."
  );
  return {
    title,
    description,
    keywords: KEYWORDS.join(", "),
    canonicalPath: "/",
    ogType: "website",
    image: SITE.ogImage.path,
    jsonLd: buildHomeGraph(title, description),
  };
}

/** @param {{ slug: string, title: string, category: string, description: string, image: string }} project */
export function getProjectSeo(project) {
  const path = `/portfolio/${project.slug}`;
  // "Case Study" is a useful search term, but only when it still fits a ~60-character SERP title.
  const withCaseStudy = `${project.title} – Case Study | ${SITE.name}`;
  const title = withCaseStudy.length <= 60 ? withCaseStudy : `${project.title} | ${SITE.name}`;
  const description = clamp(
    `${project.description} ${project.category} case study by ${SITE.name}, digital marketing agency in Agartala.`
  );
  return {
    title,
    description,
    keywords: [project.title, project.category, ...KEYWORDS.slice(0, 6)].join(", "),
    canonicalPath: path,
    ogType: "article",
    image: project.image,
    jsonLd: buildProjectGraph(project, path, title, description),
  };
}

export function getNotFoundSeo(path) {
  return {
    title: `Page not found | ${SITE.name}`,
    description: "The page you’re looking for doesn’t exist.",
    canonicalPath: path,
    noIndex: true,
  };
}

/* ───────────────────────── Tag descriptors ─────────────────────────
 * Framework-neutral list of head tags. Seo.tsx renders these with Helmet; the
 * build step renders the same list to strings for the static HTML.          */

export function buildHeadTags(seo) {
  const canonical = `${SITE.url}${normalizePath(seo.canonicalPath ?? "/")}`;
  const image = abs(seo.image ?? SITE.ogImage.path);
  const usingDefaultImage = !seo.image || seo.image === SITE.ogImage.path;
  const imageAlt = usingDefaultImage ? SITE.ogImage.alt : seo.title;
  const robots = seo.noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  /** @type {{ tag: string, attrs: Record<string, string> }[]} */
  const tags = [
    { tag: "meta", attrs: { name: "description", content: seo.description } },
    ...(seo.keywords ? [{ tag: "meta", attrs: { name: "keywords", content: seo.keywords } }] : []),
    { tag: "meta", attrs: { name: "author", content: SITE.name } },
    { tag: "meta", attrs: { name: "robots", content: robots } },
    { tag: "meta", attrs: { name: "googlebot", content: robots } },
    { tag: "link", attrs: { rel: "canonical", href: canonical } },
  ];

  if (!seo.noIndex) {
    tags.push(
      { tag: "link", attrs: { rel: "alternate", hreflang: SITE.lang, href: canonical } },
      { tag: "link", attrs: { rel: "alternate", hreflang: "x-default", href: canonical } },
      { tag: "meta", attrs: { name: "geo.region", content: "IN-TR" } },
      { tag: "meta", attrs: { name: "geo.placename", content: "Agartala" } },
      { tag: "meta", attrs: { name: "application-name", content: SITE.name } },
      { tag: "meta", attrs: { name: "apple-mobile-web-app-title", content: SITE.name } },

      // Open Graph (Facebook, WhatsApp, LinkedIn, Slack, Telegram, iMessage…)
      { tag: "meta", attrs: { property: "og:type", content: seo.ogType ?? "website" } },
      { tag: "meta", attrs: { property: "og:site_name", content: SITE.name } },
      { tag: "meta", attrs: { property: "og:locale", content: SITE.locale } },
      { tag: "meta", attrs: { property: "og:title", content: seo.title } },
      { tag: "meta", attrs: { property: "og:description", content: seo.description } },
      { tag: "meta", attrs: { property: "og:url", content: canonical } },
      { tag: "meta", attrs: { property: "og:image", content: image } },
      { tag: "meta", attrs: { property: "og:image:secure_url", content: image } },
      { tag: "meta", attrs: { property: "og:image:alt", content: imageAlt } },
      ...(usingDefaultImage
        ? [
            { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
            { tag: "meta", attrs: { property: "og:image:width", content: String(SITE.ogImage.width) } },
            { tag: "meta", attrs: { property: "og:image:height", content: String(SITE.ogImage.height) } },
          ]
        : []),

      // Twitter / X
      { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
      { tag: "meta", attrs: { name: "twitter:title", content: seo.title } },
      { tag: "meta", attrs: { name: "twitter:description", content: seo.description } },
      { tag: "meta", attrs: { name: "twitter:image", content: image } },
      { tag: "meta", attrs: { name: "twitter:image:alt", content: imageAlt } }
    );
  }
  return tags;
}

/* ───────────────────────── Structured data ───────────────────────── */

const averageRating = () =>
  Math.round((TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length) * 100) / 100;

function organizationNode(description) {
  const logoUrl = abs(SITE.logo.path);
  return {
    "@type": ["ProfessionalService", "Organization"],
    "@id": ids.org,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: `${SITE.url}/`,
    logo: {
      "@type": "ImageObject",
      "@id": ids.logo,
      url: logoUrl,
      contentUrl: logoUrl,
      width: SITE.logo.width,
      height: SITE.logo.height,
      caption: SITE.name,
    },
    image: [logoUrl, abs(SITE.ogImage.path)],
    description,
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: areaServedNodes(),
    knowsAbout: [
      "Digital marketing",
      "Performance marketing",
      "Meta Ads",
      "Google Ads",
      "UGC video production",
      "Social media marketing",
      "Web development",
      "Lead generation",
    ],
    sameAs: SITE.social,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: SITE.phone,
        email: SITE.email,
        areaServed: "IN",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital marketing services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", "@id": ids.serviceItem(s.id) },
      })),
    },
  };
}

/** Minimal org reference for inner pages, so the graph resolves standalone. */
const organizationRef = () => ({
  "@type": "Organization",
  "@id": ids.org,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: abs(SITE.logo.path),
});

function reviewNodes() {
  return TESTIMONIALS.map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.name, description: t.designation },
    reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5, worstRating: 1 },
    reviewBody: t.quote,
  }));
}

export function buildHomeGraph(title = getHomeSeoTitle(), description = "") {
  const homeUrl = `${SITE.url}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.site,
        url: homeUrl,
        name: SITE.name,
        alternateName: SITE.alternateNames,
        inLanguage: SITE.lang,
        publisher: { "@id": ids.org },
      },
      organizationNode(description),
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: title,
        description,
        inLanguage: SITE.lang,
        isPartOf: { "@id": ids.site },
        about: { "@id": ids.org },
        primaryImageOfPage: { "@type": "ImageObject", url: abs(SITE.ogImage.path) },
      },
      // One Service per offering…
      ...SERVICES.map((s) => ({
        "@type": "Service",
        "@id": ids.serviceItem(s.id),
        name: s.title,
        serviceType: s.title,
        description: s.description,
        provider: { "@id": ids.org },
        areaServed: areaServedNodes(),
        url: `${SITE.url}/#services`,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${s.title} — what's included`,
          itemListElement: s.features.map((f) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: f },
          })),
        },
      })),
      // …and the client reviews, attached to the overall service (they describe working with the
      // agency as a whole, not one specific line). Built from src/data/testimonials.js — the same
      // data the page renders — so ratings can never drift from what visitors see.
      {
        "@type": "Service",
        "@id": ids.service,
        name: "Digital Marketing & Creative Services",
        serviceType: "Digital marketing agency services",
        provider: { "@id": ids.org },
        areaServed: areaServedNodes(),
        url: `${SITE.url}/#clients`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating(),
          reviewCount: TESTIMONIALS.length,
          bestRating: 5,
          worstRating: 1,
        },
        review: reviewNodes(),
      },
    ],
  };
}

function getHomeSeoTitle() {
  return `${SITE.name} (${SITE.shortName}) | Digital Marketing Agency Agartala`;
}

export function buildProjectGraph(project, path, title, description) {
  const url = `${SITE.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationRef(),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: SITE.lang,
        isPartOf: { "@id": ids.site },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", url: abs(project.image) },
      },
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.title,
        description: project.description,
        url,
        image: abs(project.image),
        genre: project.category,
        creator: { "@id": ids.org },
        publisher: { "@id": ids.org },
        inLanguage: SITE.lang,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE.url}/#portfolio` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };
}

/* ───────────────────────── Static HTML helpers (Node) ───────────────────────── */

const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Head fragment for the static HTML. Every tag is marked data-default-seo so the client
 *  (Seo.tsx) removes them once React's Helmet takes over — no duplicates after hydration. */
export function renderHeadHtml(seo) {
  const tags = buildHeadTags(seo).map(({ tag, attrs }) => {
    const attr = Object.entries(attrs)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(" ");
    return `<${tag} ${attr} data-default-seo="true" />`;
  });
  const ld = seo.jsonLd
    ? `<script type="application/ld+json" data-default-seo="true">${JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c")}</script>`
    : "";
  // <title> is deliberately NOT marked: Helmet updates it in place through document.title.
  return [`<title>${esc(seo.title)}</title>`, ...tags, ld].filter(Boolean).join("\n    ");
}
