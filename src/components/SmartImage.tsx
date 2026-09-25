import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { LQIP } from "@/data/lqip.js";
import { useSlowConnection } from "@/lib/connection";

type SmartImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes" | "loading"> & {
  /** Path of the LARGEST variant, e.g. "/posters/6.webp". */
  src: string;
  /**
   * Widths of the variants, ascending; the last one is `src` itself and the others are
   * `<name>-<width>.webp` (made by scripts/optimize-images.mjs). Phones download the small ones.
   */
  widths?: number[];
  /** Layout hint so the browser picks the right variant before CSS loads. */
  sizes?: string;
  /** Above-the-fold / about-to-be-seen images load immediately; everything else is lazy. */
  priority?: boolean;
};

/** Poster variants produced by scripts/optimize-images.mjs (keep in sync). */
export const POSTER_WIDTHS = [360, 600, 900];

const variant = (src: string, width: number) => src.replace(/\.webp$/, `-${width}.webp`);

/**
 * An <img> built for slow networks:
 *  • srcset/sizes → each device downloads only the resolution it can actually show;
 *  • a ~200-byte blurred preview (LQIP) fills the box instantly, so the layout never looks empty;
 *  • on a slow connection / Data Saver it fetches the smallest variant only.
 */
export function SmartImage({ src, widths, sizes, priority, alt, style, onLoad, ...rest }: SmartImageProps) {
  const slow = useSlowConnection();
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Images that finished loading before hydration never fire onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  const hasVariants = !!widths && widths.length > 1;
  const smallest = hasVariants ? variant(src, widths[0]) : src;
  const srcSet = hasVariants
    ? // encodeURI: srcset is whitespace-separated, so paths with spaces must be escaped.
      widths.map((w, i) => `${encodeURI(i === widths.length - 1 ? src : variant(src, w))} ${w}w`).join(", ")
    : undefined;

  const lqip = (LQIP as Record<string, string>)[src];
  const placeholder =
    !loaded && lqip ? { backgroundImage: `url("${lqip}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined;

  return (
    <img
      ref={ref}
      src={slow ? smallest : src}
      srcSet={slow ? undefined : srcSet}
      sizes={slow ? undefined : sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ ...placeholder, ...style }}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      {...rest}
    />
  );
}
