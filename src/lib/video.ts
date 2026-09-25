import type { VideoItem, VideoSection, VideoSectionLayout } from "@/data/portfolioData";

/** "https://www.youtube.com/embed/ID" (or watch?v=ID / youtu.be/ID) → "ID". */
export function youTubeId(src: string): string | null {
  const m = src.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export const isVertical = (video: VideoItem) => video.aspectRatio === "9:16";

/**
 * Still image for a tile. YouTube posters come from its image CDN:
 *   • vertical (Shorts)  → oardefault, the native 9:16 frame
 *   • landscape          → hqdefault (always exists); `large` asks for maxresdefault, with
 *                          `fallback` to swap in when that size was never generated.
 */
export function videoPoster(video: VideoItem, large = false): { src?: string; fallback?: string } {
  if (video.poster) return { src: video.poster };
  const id = youTubeId(video.src);
  if (!id) return {};
  const base = `https://i.ytimg.com/vi/${id}`;
  if (isVertical(video)) return { src: `${base}/oardefault.jpg`, fallback: `${base}/hqdefault.jpg` };
  return large
    ? { src: `${base}/maxresdefault.jpg`, fallback: `${base}/hqdefault.jpg` }
    : { src: `${base}/hqdefault.jpg` };
}

/** Embed URL for the lightbox: starts playing, no unrelated suggestions at the end. */
export function embedUrl(src: string): string {
  const id = youTubeId(src);
  if (!id) return src;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

export function sectionLayout(section: VideoSection): VideoSectionLayout {
  if (section.layout) return section.layout;
  return section.videos.every(isVertical) ? (section.videos.length > 5 ? "wall" : "filmstrip") : "editorial";
}

/** One entry in the page-wide playlist the lightbox pages through. */
export type PlaylistEntry = {
  video: VideoItem;
  /** Section the video belongs to (used as the tag fallback and lightbox context). */
  section: VideoSection;
  /** Position in the whole playlist. */
  index: number;
};

export function buildPlaylist(sections: VideoSection[]): PlaylistEntry[] {
  let index = 0;
  return sections.flatMap((section) => section.videos.map((video) => ({ video, section, index: index++ })));
}
