/**
 * Video delivery optimisation for the "Ad Videos" carousel.
 *
 *   node scripts/optimize-videos.mjs
 *
 * For every public/videos/N.mp4 it produces:
 *   • public/videos/preview/N.mp4  – tiny muted 480p loop (first 8 s) used *in the carousel*.
 *   • public/videos/poster/N.webp  – a still frame shown instantly, before/instead of any video.
 *   • and, if the original isn't "fast-start", a lossless re-mux (no re-encode, no quality loss)
 *     so playback can begin without downloading the end of the file first.
 *
 * The carousel used to stream up to 29 MB per video just for a thumbnail. Now it loads a
 * few hundred KB; the full-quality original is only fetched when a visitor taps a slide.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "videos");
const previewDir = path.join(dir, "preview");
const posterDir = path.join(dir, "poster");
fs.mkdirSync(previewDir, { recursive: true });
fs.mkdirSync(posterDir, { recursive: true });

const ff = (args) => execFileSync(ffmpegPath, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "pipe" });
const mb = (n) => (n / 1048576).toFixed(1).padStart(5) + " MB";

/** Is the moov atom before the media data? (i.e. "fast-start") */
function isFastStart(file) {
  const fd = fs.openSync(file, "r");
  const size = fs.statSync(file).size;
  const hdr = Buffer.alloc(16);
  let pos = 0;
  let result = false;
  while (pos < size) {
    fs.readSync(fd, hdr, 0, 16, pos);
    let len = hdr.readUInt32BE(0);
    const type = hdr.toString("latin1", 4, 8);
    if (len === 1) len = Number(hdr.readBigUInt64BE(8));
    if (type === "moov") { result = true; break; }
    if (type === "mdat") break;
    if (!len) break;
    pos += len;
  }
  fs.closeSync(fd);
  return result;
}

const files = fs.readdirSync(dir).filter((f) => /^\d+\.mp4$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b));
let originalTotal = 0;
let previewTotal = 0;

for (const file of files) {
  const id = path.basename(file, ".mp4");
  const src = path.join(dir, file);
  const originalSize = fs.statSync(src).size;
  originalTotal += originalSize;
  let note = "";

  // 1. Lossless fast-start fix (only where needed)
  if (!isFastStart(src)) {
    const tmp = path.join(dir, `${id}.faststart.tmp.mp4`);
    ff(["-i", src, "-c", "copy", "-movflags", "+faststart", tmp]);
    if (isFastStart(tmp) && Math.abs(fs.statSync(tmp).size - originalSize) / originalSize < 0.02) {
      fs.renameSync(tmp, src);
      note = "fast-start fixed";
    } else {
      fs.rmSync(tmp, { force: true });
      note = "fast-start FAILED (kept original)";
    }
  }

  // 2. Small preview loop for the carousel
  const preview = path.join(previewDir, file);
  ff([
    "-i", src, "-t", "8", "-an",
    "-vf", "scale=-2:480",
    "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", preview,
  ]);
  previewTotal += fs.statSync(preview).size;

  // 3. Poster still (first moments of the video), as WebP
  const tmpPng = path.join(posterDir, `${id}.tmp.png`);
  ff(["-ss", "0.6", "-i", src, "-frames:v", "1", "-vf", "scale=-2:480", tmpPng]);
  await sharp(tmpPng).webp({ quality: 72 }).toFile(path.join(posterDir, `${id}.webp`));
  fs.rmSync(tmpPng, { force: true });

  console.log(
    `${file.padEnd(7)} original ${mb(originalSize)} → preview ${mb(fs.statSync(preview).size)}  poster ${(fs.statSync(path.join(posterDir, `${id}.webp`)).size / 1024).toFixed(0)} KB  ${note}`
  );
}

console.log(`\nCarousel now loads ${mb(previewTotal)} of previews instead of up to ${mb(originalTotal)} of full videos.`);
