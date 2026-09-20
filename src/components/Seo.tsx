import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { buildHeadTags } from "@/seo/site.js";

type SeoProps = {
  title: string;
  description: string;
  /** Comma-separated keywords (low weight for Google, still read by Bing and others). */
  keywords?: string;
  /**
   * Absolute (preferred) or root-relative URL to the preview image.
   * If omitted, falls back to the branded 1200×630 social card.
   */
  image?: string;
  /**
   * Override canonical path. Defaults to current location pathname.
   * Trailing slashes are normalised so every page has exactly one canonical URL.
   */
  canonicalPath?: string;
  /** "website" for home, "article" for detail pages. */
  ogType?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: object | object[];
};

/**
 * Renders every SEO tag for the current view.
 *
 * The same tag list (`buildHeadTags`) is baked into the static HTML at build time so crawlers
 * and social scrapers that never run JavaScript still get complete metadata. Those static tags
 * carry `data-default-seo`; once Helmet has taken over we remove them so nothing is duplicated.
 */
export default function Seo({ jsonLd, ...seo }: SeoProps) {
  const location = useLocation();
  const canonicalPath = seo.canonicalPath ?? location.pathname;
  const tags = buildHeadTags({ ...seo, canonicalPath });

  useEffect(() => {
    document.head.querySelectorAll("[data-default-seo]").forEach((el) => el.remove());
  }, [location.pathname]);

  return (
    <Helmet>
      <title>{seo.title}</title>
      {tags.map(({ tag, attrs }) =>
        tag === "link" ? (
          <link key={`${attrs.rel}-${attrs.hreflang ?? ""}`} {...attrs} />
        ) : (
          <meta key={attrs.name ?? attrs.property} {...attrs} />
        )
      )}
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script> : null}
    </Helmet>
  );
}
