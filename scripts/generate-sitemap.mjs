/**
 * Generates dist/sitemap.xml from the site's real route list (scripts/get-routes.mjs), so a new
 * portfolio project is in the sitemap automatically — no manual editing.
 *
 * Runs after every build (package.json "postbuild", and at the end of "build:prerender").
 * server.js also reads this file to decide which URLs are real (200) and which are 404s.
 */
import fs from "node:fs";
import path from "node:path";
import { getPrerenderRoutes } from "./get-routes.mjs";

const SITE_URL = "https://thoughtflowmediaa.com";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const distDir = path.join(process.cwd(), "dist");

if (!fs.existsSync(distDir)) {
  console.error(`[sitemap] dist directory not found at ${distDir}. Did you run the build first?`);
  process.exit(1);
}

// `lastmod` = the build date. Google uses it (when accurate) to prioritise re-crawling.
const lastmod = new Date().toISOString().slice(0, 10);

const urls = getPrerenderRoutes().map((route) => ({
  loc: route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`,
  lastmod,
  changefreq: route === "/" ? "weekly" : "monthly",
  priority: route === "/" ? "1.0" : "0.7",
  // Home also declares its social image so image search can associate it with the brand.
  image: route === "/" ? OG_IMAGE : null,
}));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        `    <lastmod>${u.lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        (u.image ? `    <image:image>\n      <image:loc>${u.image}</image:loc>\n    </image:image>\n` : "") +
        `  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

const outPath = path.join(distDir, "sitemap.xml");
fs.writeFileSync(outPath, xml, "utf8");
console.log(`[sitemap] wrote ${outPath} with ${urls.length} urls`);
