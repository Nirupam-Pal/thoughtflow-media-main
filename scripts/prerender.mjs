import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { getPrerenderRoutes } from "./get-routes.mjs";

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const distDir = path.join(process.cwd(), "dist");

if (!fs.existsSync(path.join(distDir, "index.html"))) {
  console.error("[prerender] dist/index.html not found. Run vite build first.");
  process.exit(1);
}

/** @param {string} url */
async function waitForServer(url, timeoutMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // preview not ready yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`[prerender] Preview server did not start at ${url}`);
}

function startPreview() {
  return spawn(`npx vite preview --port ${PORT} --strictPort`, {
    shell: true,
    stdio: "pipe",
    env: { ...process.env, NODE_ENV: "production" },
  });
}

/** @param {string} route */
function routeToOutputFile(route) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, ...route.split("/").filter(Boolean), "index.html");
}

/** @param {import("node:child_process").ChildProcess} child */
function stopPreview(child) {
  return new Promise((resolve) => {
    if (!child || child.killed) {
      resolve();
      return;
    }
    child.once("exit", () => resolve());
    child.kill("SIGTERM");
    setTimeout(() => {
      if (!child.killed) child.kill("SIGKILL");
      resolve();
    }, 3000);
  });
}

const preview = startPreview();

try {
  await waitForServer(BASE);
  const routes = getPrerenderRoutes();
  const browser = await chromium.launch({ headless: true });

  console.log(`[prerender] Rendering ${routes.length} routes...`);

  for (const route of routes) {
    const page = await browser.newPage();
    await page.goto(`${BASE}${route}`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });

    await page.waitForSelector("#root h1", { timeout: 60_000 });
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-prerendered", "true");
    });

    const html = await page.content();
    const outFile = routeToOutputFile(route);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, "utf8");

    console.log(`[prerender] ${route} -> ${path.relative(process.cwd(), outFile)}`);
    await page.close();
  }

  await browser.close();
  console.log("[prerender] Done.");
} catch (error) {
  console.error("[prerender] Failed:", error);
  process.exit(1);
} finally {
  await stopPreview(preview);
}
