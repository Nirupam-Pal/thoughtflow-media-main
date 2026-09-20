/**
 * Renders the 1200×630 social-share card (Open Graph / Twitter) to public/og-image.png.
 *
 *   node scripts/generate-og-image.mjs
 *
 * Uses the site's real fonts, colours and logo, so the card matches the brand exactly.
 * Re-run after changing the copy below. 1200×630 is the size Facebook, LinkedIn, WhatsApp,
 * Slack and X all render as a large image card without cropping.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const root = process.cwd();
const b64 = (file) => fs.readFileSync(path.join(root, file)).toString("base64");

const spaceGrotesk = b64("node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2");
const inter = b64("node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2");
const logo = b64("public/logo-512.png");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:SG;src:url(data:font/woff2;base64,${spaceGrotesk}) format("woff2");font-weight:300 700}
@font-face{font-family:IN;src:url(data:font/woff2;base64,${inter}) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#faf8f5;font-family:IN,system-ui,sans-serif;color:#2a2623;position:relative}
.glow1{position:absolute;right:-120px;top:-140px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(251,152,116,.55),rgba(232,90,120,.16) 60%,transparent)}
.glow2{position:absolute;left:-160px;bottom:-220px;width:640px;height:640px;border-radius:50%;background:radial-gradient(closest-side,rgba(238,228,211,.95),transparent)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(42,38,35,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(42,38,35,.045) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 90% 80% at 40% 50%,#000,transparent 78%);mask-image:radial-gradient(ellipse 90% 80% at 40% 50%,#000,transparent 78%)}
.wrap{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:20px}
.logo{width:76px;height:76px;border-radius:20px;box-shadow:0 12px 30px -10px rgba(42,38,35,.35)}
.chip{display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:999px;background:rgba(255,255,255,.75);border:1px solid #fff;box-shadow:0 8px 24px -10px rgba(42,38,35,.25);font-size:22px;font-weight:500;color:#6b625b}
.dot{width:11px;height:11px;border-radius:50%;background:#ff5a1f}
h1{font-family:SG,IN,sans-serif;font-weight:700;font-size:96px;line-height:1.02;letter-spacing:-2.5px}
.accent{background:linear-gradient(90deg,#ff7a1a,#ee3a2a 55%,#e8296c);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{font-size:30px;line-height:1.4;color:#6b625b;max-width:600px;margin-top:22px;font-weight:450}
.foot{display:flex;align-items:center;gap:18px;font-size:26px;font-weight:600;color:#2a2623}
.foot i{width:6px;height:6px;border-radius:50%;background:#c9bfb2;display:block}
.bars{position:absolute;right:84px;bottom:70px;display:flex;align-items:flex-end;gap:18px;height:420px}
.bar{width:62px;border-radius:14px 14px 6px 6px;box-shadow:0 22px 40px -16px rgba(42,38,35,.45)}
</style></head><body>
<div class="glow1"></div><div class="glow2"></div><div class="grid"></div>
<div class="bars">
  <div class="bar" style="height:120px;background:linear-gradient(180deg,#5b524b,#2a2623)"></div>
  <div class="bar" style="height:190px;background:linear-gradient(180deg,#5a4a44,#2c2421)"></div>
  <div class="bar" style="height:255px;background:linear-gradient(180deg,#8a5a3c,#3a2a22)"></div>
  <div class="bar" style="height:335px;background:linear-gradient(180deg,#d9682f,#7a3418)"></div>
  <div class="bar" style="height:420px;background:linear-gradient(180deg,#ff7a1a,#e8296c)"></div>
</div>
<div class="wrap">
  <div class="brand"><img class="logo" src="data:image/png;base64,${logo}"><span class="chip"><span class="dot"></span>Agartala, Tripura · Northeast India</span></div>
  <div>
    <h1>Thoughtflow<br><span class="accent">Mediaa</span></h1>
    <p class="sub">AI-powered digital marketing agency — Meta &amp; Google Ads, UGC videos, social media and websites that grow brands.</p>
  </div>
  <div class="foot">thoughtflowmediaa.com<i></i>TFM</div>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const raw = await page.screenshot({ type: "png" });
await browser.close();

// Palette-quantise: the card is mostly flat colour + gradients, so this cuts the file size a lot.
const out = path.join(root, "public", "og-image.png");
await sharp(raw).png({ palette: true, quality: 92, compressionLevel: 9, effort: 8 }).toFile(out);
console.log(`og-image.png written: ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
