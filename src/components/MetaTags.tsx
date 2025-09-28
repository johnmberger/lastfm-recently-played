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

const defaultMetaTags = {
  siteName: "What Am I Listening To?",
  defaultTitle: "What Am I Listening To?",
  defaultDescription:
    "Stalk my music listening history! See what's currently spinning, what I've been obsessed with, and discover my musical guilty pleasures in real-time.",
  defaultKeywords:
    "music stalking, listening history, music discovery, what am i listening to, music obsession, guilty pleasures, music taste",
  defaultImage: "/placeholder.png",
  defaultImageWidth: "1200",
  defaultImageHeight: "630",
  defaultImageAlt: "What Am I Listening To? - Music Stalking Made Easy",
  themeColor: "#0ea5e9",
  author: "John",
};

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
  const finalOgImage = ogImage || defaultMetaTags.defaultImage;
  const finalOgImageWidth = ogImageWidth || defaultMetaTags.defaultImageWidth;
  const finalOgImageHeight =
    ogImageHeight || defaultMetaTags.defaultImageHeight;
  const finalOgImageAlt = ogImageAlt || defaultMetaTags.defaultImageAlt;
  const finalTwitterTitle = twitterTitle || finalTitle;
  const finalTwitterDescription = twitterDescription || finalDescription;
  const finalTwitterImage = twitterImage || defaultMetaTags.defaultImage;
  const finalTwitterImageAlt =
    twitterImageAlt || defaultMetaTags.defaultImageAlt;

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
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={defaultMetaTags.siteName} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content={finalOgImageWidth} />
      <meta property="og:image:height" content={finalOgImageHeight} />
      <meta property="og:image:alt" content={finalOgImageAlt} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}

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
