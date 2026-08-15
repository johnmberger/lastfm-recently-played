import Head from "next/head";

export type MetaTagsProps = {
  title?: string;
  description?: string;
  keywords?: string;
  /** Path or absolute URL (defaults to site root) */
  path?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
};

const SITE_URL = "https://earworms.johnberger.dev";
const SITE_NAME = "earworms";

const defaults = {
  title: SITE_NAME,
  description:
    "the songs that get stuck in my head. see what's currently spinning, what i've been obsessing over, and discover my musical guilty pleasures in real-time.",
  keywords:
    "earworms, music, listening history, music discovery, recently played, music obsession, guilty pleasures, music taste",
  image: `${SITE_URL}/og.png`,
  imageWidth: "1200",
  imageHeight: "630",
  imageAlt: "earworms — songs that get stuck in your head",
};

function toAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return SITE_URL;
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
  path,
  ogImage,
  ogImageAlt,
  noIndex = false,
}: MetaTagsProps) {
  const finalTitle = title ? `${title} | ${SITE_NAME}` : defaults.title;
  const finalDescription = description || defaults.description;
  const finalKeywords = keywords || defaults.keywords;
  const finalUrl = toAbsoluteUrl(path);
  const finalImage = toAbsoluteUrl(ogImage) || defaults.image;
  const finalImageAlt = ogImageAlt || defaults.imageAlt;

  return (
    <Head>
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content={defaults.imageWidth} />
      <meta property="og:image:height" content={defaults.imageHeight} />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:url" content={finalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
    </Head>
  );
}
