import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { PortfolioGalleryItem } from "@/data/portfolioData";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/motion";
import { imageWidths } from "@/lib/design";
import { useMediaCursor } from "./MediaCursor";

/**
 * A design tile. The artwork is the point, so the tile stays clean: just an index chip. The
 * tag, title and an expand button slide in on hover / keyboard focus. Images come through
 * SmartImage (blurred placeholder + srcset), so phones download the small variants.
 */
export function ImageTile({
  item,
  index,
  onOpen,
  sizes,
  className,
  size = "md",
  eager,
}: {
  item: PortfolioGalleryItem;
  /** Position in the page-wide gallery (what the lightbox opens at). */
  index: number;
  onOpen: (index: number) => void;
  /** `sizes` hint for the srcset, e.g. "(min-width: 1024px) 25vw, 50vw". */
  sizes: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  eager?: boolean;
}) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const cursor = useMediaCursor();
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      data-active={active}
      aria-haspopup="dialog"
      aria-label={`View design: ${item.alt}`}
      onClick={() => {
        setActive(false);
        cursor.hide();
        onOpen(index);
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        setActive(true);
        cursor.show("View", "view");
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setActive(false);
        cursor.hide();
      }}
      className={cn(
        "group relative isolate block w-full overflow-hidden rounded-[1.25rem] bg-muted text-left shadow-medium sm:rounded-3xl",
        "transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-[active=true]:-translate-y-1 data-[active=true]:shadow-[0_24px_60px_-18px_hsl(30_10%_15%/0.45)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        fine && !reduced && "cursor-none",
        className
      )}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:scale-[1.04] group-data-[active=true]:scale-[1.04]">
        <SmartImage
          src={item.src}
          widths={imageWidths(item.src)}
          sizes={sizes}
          priority={eager}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Hover scrim + caption */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-focus-visible:opacity-100 group-data-[active=true]:opacity-100" />

      <div className="absolute inset-x-3 top-3 flex items-start justify-between sm:inset-x-4 sm:top-4">
        <span className="rounded-full bg-black/40 px-2.5 py-1 font-display text-[11px] font-semibold tabular-nums text-white/90 ring-1 ring-white/15 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "bg-ember flex items-center justify-center rounded-full text-white shadow-soft transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            size === "lg" ? "h-12 w-12" : "h-9 w-9 sm:h-10 sm:w-10",
            "scale-50 opacity-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-data-[active=true]:scale-100 group-data-[active=true]:opacity-100"
          )}
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100",
          size === "lg" ? "p-5 sm:p-7" : "p-3.5 sm:p-5"
        )}
      >
        {item.tag && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/90 ring-1 ring-white/20 backdrop-blur-sm sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(16_98%_55%)]" />
            {item.tag}
          </span>
        )}
        <span
          className={cn(
            "block font-display font-semibold leading-tight text-white",
            size === "lg" ? "text-xl sm:text-2xl" : "line-clamp-2 text-sm sm:text-base"
          )}
        >
          {item.alt}
        </span>
      </div>
    </button>
  );
}
