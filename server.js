import express from "express";
import compression from "compression";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "dist");
const port = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";
const CANONICAL_HOST = "thoughtflowmediaa.com";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true); // Render / Cloudflare terminate TLS in front of us

/**
 * Real routes = the URLs in dist/sitemap.xml (generated from the same route list as the build).
 * Anything else returns HTTP 404 instead of a 200 "soft 404", which search engines penalise.
 * If the sitemap is missing we fail open (treat everything as valid) rather than 404 real pages.
 */
function loadKnownRoutes() {
  try {
    const xml = fs.readFileSync(path.join(distPath, "sitemap.xml"), "utf8");
    const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/+$/, "") || "/");
    return new Set(routes);
  } catch {
    return null;
  }
}
const knownRoutes = loadKnownRoutes();

// ── Canonicalisation: one URL per page (https, no www, no trailing slash) ──
app.use((req, res, next) => {
  if (!isProd) return next();
  const host = (req.headers.host || "").toLowerCase();
  const wrongHost = host.startsWith("www.");
  const insecure = req.protocol !== "https";
  if (wrongHost || insecure) {
    return res.redirect(301, `https://${wrongHost ? CANONICAL_HOST : host}${req.originalUrl}`);
  }
  next();
});
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, "") + query);
  }
  next();
});

app.use(compression());

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ── Static files, with cache policy ──
// /assets/* is content-hashed by Vite, so it can be cached "forever". Everything else in
// /public (images, fonts, favicons) changes rarely: a week. HTML is always revalidated.
app.use(
  express.static(distPath, {
    index: false,
    redirect: false,
    setHeaders(res, filePath) {
      const rel = path.relative(distPath, filePath).replace(/\\/g, "/");
      if (rel.startsWith("assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (rel.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (rel === "sitemap.xml" || rel === "robots.txt") {
        res.setHeader("Cache-Control", "public, max-age=3600");
      } else {
        res.setHeader("Cache-Control", "public, max-age=604800");
      }
    },
  })
);

// ── Pages ──
app.get("*", (req, res) => {
  // A path with a file extension that static didn't find is a genuinely missing file.
  if (path.extname(req.path)) return res.status(404).type("text/plain").send("Not found");

  const route = req.path.replace(/\/+$/, "") || "/";
  const known = !knownRoutes || knownRoutes.has(route);

  // Prefer the route's own prerendered / head-injected HTML, then fall back to the SPA shell.
  const routeFile = path.join(distPath, ...route.split("/").filter(Boolean), "index.html");
  const file = known && route !== "/" && fs.existsSync(routeFile) ? routeFile : path.join(distPath, "index.html");

  res.setHeader("Cache-Control", "no-cache");
  res.status(known ? 200 : 404).sendFile(file);
});

app.listen(port, () => {
  console.log(`Serving dist on port ${port}`);
});
