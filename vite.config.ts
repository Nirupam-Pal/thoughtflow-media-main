import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";
// Plain-JS SEO source of truth, shared with the React app (src/components/Seo.tsx).
import { getHomeSeo, getProjectSeo, renderHeadHtml } from "./src/seo/site.js";
import { PORTFOLIO_PROJECTS } from "./src/data/portfolioData";

const SEO_START = "<!--seo:start-->";
const SEO_END = "<!--seo:end-->";
const seoBlock = (head: string) => `${SEO_START}\n    ${head}\n    ${SEO_END}`;

/**
 * Bakes SEO into the *static* HTML so crawlers and social scrapers that never run JavaScript
 * (Facebook, WhatsApp, LinkedIn, Slack, Bing's first pass…) still get complete metadata:
 *
 *  1. Injects the home page's title / meta / Open Graph / Twitter / JSON-LD into index.html.
 *  2. Preloads the self-hosted font files so text paints without waiting for a CSS round trip.
 *  3. After the build, emits dist/portfolio/<slug>/index.html for every project with that
 *     page's own head, so each case study previews correctly when shared.
 *
 * If you also run scripts/prerender.mjs, it overwrites these route files with fully rendered
 * pages; this plugin is the safety net that works with a plain `vite build`.
 */
function seoPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "tfm-seo",
    configResolved(resolved) {
      config = resolved;
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const out = html.replace(`${SEO_START}${SEO_END}`, seoBlock(renderHeadHtml(getHomeSeo())));
        const tags: { tag: string; attrs: Record<string, string | boolean>; injectTo: "head" }[] = [];

        if (ctx.bundle) {
          // Only the Latin subsets are preloaded — the ones the page actually needs at first paint.
          for (const file of Object.keys(ctx.bundle)) {
            if (/(inter|space-grotesk)-latin-wght-normal.*\.woff2$/.test(file)) {
              tags.push({
                tag: "link",
                attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "", href: `/${file}` },
                injectTo: "head",
              });
            }
          }
        }
        return { html: out, tags };
      },
    },
    closeBundle() {
      if (config.command !== "build") return;
      const distDir = path.resolve(config.root, config.build.outDir);
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const template = fs.readFileSync(indexPath, "utf8");
      const start = template.indexOf(SEO_START);
      const end = template.indexOf(SEO_END);
      if (start === -1 || end === -1) return;

      for (const project of PORTFOLIO_PROJECTS) {
        const html =
          template.slice(0, start) + seoBlock(renderHeadHtml(getProjectSeo(project))) + template.slice(end + SEO_END.length);
        const outFile = path.join(distDir, "portfolio", project.slug, "index.html");
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, html, "utf8");
      }
      console.log(`[seo] wrote static heads for ${PORTFOLIO_PROJECTS.length} portfolio routes`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), seoPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
