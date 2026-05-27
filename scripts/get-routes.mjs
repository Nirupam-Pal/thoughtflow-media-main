import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const portfolioDataPath = path.join(repoRoot, "src", "data", "portfolioData.ts");

/** @returns {string[]} */
export function getPortfolioSlugs() {
  const ts = fs.readFileSync(portfolioDataPath, "utf8");
  const slugRegex = /\bslug:\s*["'`]([^"'`]+)["'`]/g;
  const slugs = new Set();
  let match;
  while ((match = slugRegex.exec(ts)) !== null) {
    slugs.add(match[1]);
  }
  return Array.from(slugs).sort();
}

/** @returns {string[]} */
export function getPrerenderRoutes() {
  return ["/", ...getPortfolioSlugs().map((slug) => `/portfolio/${slug}`)];
}
