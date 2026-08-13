import Head from "next/head";

export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

const SITE_URL = "https://earworms.johnberger.dev";

const defaultMetaTags = {
  siteName: "earworms",
  defaultTitle: "earworms",
  defaultDescription:
    "the songs that get stuck in my head. see what's currently spinning, what i've been obsessing over, and discover my musical guilty pleasures in real-time.",
  defaultKeywords:
    "earworms, music, listening history, music discovery, recently played, music obsession, guilty pleasures, music taste",
  defaultImage: `${SITE_URL}/og.png`,
  defaultImageWidth: "1200",
  defaultImageHeight: "630",
  defaultImageAlt: "earworms — songs that get stuck in your head",
  themeColor: "#0ea5e9",
  author: "John",
};

function toAbsoluteUrl(pathOrUrl?: string): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

export default function MetaTags({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  canonicalUrl,
  noIndex = false,
}: MetaTagsProps) {
  const finalTitle = title
    ? `${title} | ${defaultMetaTags.siteName}`
    : defaultMetaTags.defaultTitle;
  const finalDescription = description || defaultMetaTags.defaultDescription;
  const finalKeywords = keywords || defaultMetaTags.defaultKeywords;
  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;
  const finalOgImage =
    toAbsoluteUrl(ogImage) || defaultMetaTags.defaultImage;
  const finalOgImageWidth = ogImageWidth || defaultMetaTags.defaultImageWidth;
  const finalOgImageHeight =
    ogImageHeight || defaultMetaTags.defaultImageHeight;
  const finalOgImageAlt = ogImageAlt || defaultMetaTags.defaultImageAlt;
  const finalTwitterTitle = twitterTitle || finalTitle;
  const finalTwitterDescription = twitterDescription || finalDescription;
  const finalTwitterImage =
    toAbsoluteUrl(twitterImage) || defaultMetaTags.defaultImage;
  const finalTwitterImageAlt =
    twitterImageAlt || defaultMetaTags.defaultImageAlt;
  const finalOgUrl = toAbsoluteUrl(ogUrl) || SITE_URL;
  const finalCanonicalUrl = toAbsoluteUrl(canonicalUrl) || finalOgUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content={defaultMetaTags.themeColor} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="author" content={defaultMetaTags.author} />

      {/* Page Title */}
      <title>{finalTitle}</title>

      {/* SEO Meta Tags */}
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={defaultMetaTags.siteName} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content={finalOgImageWidth} />
      <meta property="og:image:height" content={finalOgImageHeight} />
      <meta property="og:image:alt" content={finalOgImageAlt} />
      <meta property="og:url" content={finalOgUrl} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:image:alt" content={finalTwitterImageAlt} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link
        rel="icon"
        href="/favicon-16x16.svg"
        type="image/svg+xml"
        sizes="16x16"
      />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="32x32" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      <link rel="shortcut icon" href="/favicon.svg" />
    </Head>
  );
}
