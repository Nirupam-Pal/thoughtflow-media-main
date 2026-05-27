import fs from "node:fs";
import path from "node:path";
import { getPrerenderRoutes } from "./get-routes.mjs";

const SITE_URL = "https://thoughtflowmediaa.com";
const distDir = path.join(process.cwd(), "dist");

if (!fs.existsSync(distDir)) {
  console.error(`[sitemap] dist directory not found at ${distDir}. Did you run the build first?`);
  process.exit(1);
}

const routes = getPrerenderRoutes();

const urls = routes.map((route) => ({
  loc: route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`,
  changefreq: route === "/" ? "weekly" : "monthly",
  priority: route === "/" ? "1.0" : "0.7",
}));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

const outPath = path.join(distDir, "sitemap.xml");
fs.writeFileSync(outPath, xml, "utf8");
console.log(`[sitemap] wrote ${outPath} with ${urls.length} urls`);
