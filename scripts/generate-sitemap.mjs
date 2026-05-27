import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://thoughtflowmediaa.com";

const repoRoot = process.cwd();
const portfolioDataPath = path.join(repoRoot, "src", "data", "portfolioData.ts");
const distDir = path.join(repoRoot, "dist");

if (!fs.existsSync(distDir)) {
  console.error(`[sitemap] dist directory not found at ${distDir}. Did you run the build first?`);
  process.exit(1);
}

const ts = fs.readFileSync(portfolioDataPath, "utf8");
const slugRegex = /\bslug:\s*["'`]([^"'`]+)["'`]/g;

const slugs = new Set();
let m;
while ((m = slugRegex.exec(ts)) !== null) slugs.add(m[1]);

const urls = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  ...Array.from(slugs)
    .sort()
    .map((slug) => ({
      loc: `${SITE_URL}/portfolio/${slug}`,
      changefreq: "monthly",
      priority: "0.7",
    })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
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

