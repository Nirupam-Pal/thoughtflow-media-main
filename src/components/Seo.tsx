import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

type SeoProps = {
  title: string;
  description: string;
  /**
   * Absolute (preferred) or root-relative URL to preview image.
   * If omitted, falls back to site default.
   */
  image?: string;
  /**
   * Override canonical path. Defaults to current location pathname.
   * Should be root-relative (e.g. "/portfolio/foo").
   */
  canonicalPath?: string;
  /**
   * "website" for home, "article" for detail pages, etc.
   */
  ogType?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: object | object[];
};

const SITE_URL = "https://thoughtflowmediaa.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/tf-profile.png`;

export default function Seo({
  title,
  description,
  image,
  canonicalPath,
  ogType = "website",
  noIndex,
  jsonLd,
}: SeoProps) {
  const location = useLocation();
  const path = canonicalPath ?? location.pathname;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = image?.startsWith("http") ? image : image ? `${SITE_URL}${image}` : DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}
    </Helmet>
  );
}

