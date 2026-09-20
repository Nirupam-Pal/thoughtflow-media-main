/**
 * One-off / repeatable image optimisation → next-gen WebP at the sizes the site actually displays.
 *
 *   node scripts/optimize-images.mjs
 *
 * Originals are left untouched; a .webp is written next to each one. Re-run after adding images.
 * (Sizes are ~2× the largest CSS display size, for retina screens.)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const pub = path.join(process.cwd(), "public");

/** [directory, extensions, max width, quality] */
const jobs = [
  ["logos", [".png", ".jpg", ".jpeg"], 256, 82], // client logos: shown at ≤128px
  ["posters", [".jpg", ".jpeg", ".png"], 900, 78], // wall tiles + poster carousel
  ["clients", [".jpg", ".jpeg", ".png"], 720, 80], // testimonial portraits: shown at ≤340px
  [path.join("parallax", "logos"), [".png"], 640, 82], // brand tiles in the wall
];

let before = 0;
let after = 0;

for (const [dir, exts, width, quality] of jobs) {
  const abs = path.join(pub, dir);
  if (!fs.existsSync(abs)) continue;
  for (const file of fs.readdirSync(abs)) {
    const ext = path.extname(file).toLowerCase();
    if (!exts.includes(ext)) continue;
    const src = path.join(abs, file);
    const out = path.join(abs, `${path.basename(file, path.extname(file))}.webp`);
    await sharp(src)
      .rotate() // honour EXIF orientation before metadata is dropped
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(out);
    const a = fs.statSync(src).size;
    const b = fs.statSync(out).size;
    before += a;
    after += b;
    console.log(`${path.join(dir, file).padEnd(34)} ${(a / 1024).toFixed(0).padStart(6)} KB → ${(b / 1024).toFixed(0).padStart(5)} KB`);
  }
}

// Brand logo: a 512×512 PNG for structured data / app icons (the 4432px original is ~200 KB and
// far larger than any consumer needs), plus a tiny WebP for the on-page card.
const logoSrc = path.join(pub, "tf-profile.png");
await sharp(logoSrc).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(pub, "logo-512.png"));
await sharp(logoSrc).resize(128, 128).webp({ quality: 85 }).toFile(path.join(pub, "logo-128.webp"));
console.log("logo-512.png + logo-128.webp written");

console.log(`\nTotal: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB (${Math.round((1 - after / before) * 100)}% smaller)`);
