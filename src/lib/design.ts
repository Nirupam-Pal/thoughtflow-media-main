import type { ImageSection, ImageSectionLayout, PortfolioGalleryItem } from "@/data/portfolioData";
import { POSTER_WIDTHS } from "@/components/SmartImage";

/** Variant widths produced by scripts/optimize-images.mjs for the Creative Visual Designs folders (keep in sync). */
const THUMBNAIL_WIDTHS = [480, 960, 1280];
const BANNER_WIDTHS = [640, 1280, 2000];

/** Variant widths that scripts/optimize-images.mjs generated for an image, based on its folder. */
export function imageWidths(src: string): number[] | undefined {
  if (!src.endsWith(".webp")) return undefined;
  if (src.startsWith("/posters/")) return POSTER_WIDTHS;
  if (src.includes("/High CTR Thumbnails/")) return THUMBNAIL_WIDTHS;
  if (src.includes("/Banners & Flex Designs/")) return BANNER_WIDTHS;
  return undefined;
}

/** Smallest generated variant: cheap enough for filmstrips and decorative peeks. */
export function smallestVariant(src: string): string {
  const w = imageWidths(src);
  return w && w.length > 1 ? src.replace(/\.webp$/, `-${w[0]}.webp`) : src;
}

export function imageLayout(section: ImageSection): ImageSectionLayout {
  return section.layout ?? (section.images.length <= 3 ? "billboard" : "editorial");
}

/** One entry in the page-wide gallery the lightbox pages through. */
export type GalleryEntry = { item: PortfolioGalleryItem; section: ImageSection; index: number };

export function buildGallery(sections: ImageSection[]): GalleryEntry[] {
  let index = 0;
  return sections.flatMap((section) => section.images.map((item) => ({ item, section, index: index++ })));
}

/* ─── Remote (Unsplash) photos: sized and cropped through URL parameters ─── */

export const isUnsplash = (src: string) => src.includes("images.unsplash.com");

/** The same Unsplash photo at `width` px (and, with `ratio` = w/h, cropped to that shape). */
export function unsplashAt(src: string, width: number, ratio?: number, quality = 72): string {
  const u = new URL(src);
  u.searchParams.set("w", String(width));
  if (ratio) {
    u.searchParams.set("h", String(Math.round(width / ratio)));
    u.searchParams.set("fit", "crop");
  } else {
    u.searchParams.delete("h");
  }
  u.searchParams.set("q", String(quality));
  u.searchParams.set("auto", "format");
  return u.toString();
}

/** src + srcset for an Unsplash photo, so each device downloads only the size it shows. */
export function unsplashSet(src: string, ratio?: number, widths = [480, 960, 1600]) {
  return {
    src: unsplashAt(src, widths[1] ?? widths[0], ratio),
    srcSet: widths.map((w) => `${unsplashAt(src, w, ratio)} ${w}w`).join(", "),
  };
}
