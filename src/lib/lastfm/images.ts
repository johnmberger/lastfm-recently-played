/** Last.fm intentionally returns this star for stripped artist artwork */
export const LASTFM_IMAGE_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

export function isUsableImage(url: string | undefined | null): url is string {
  return Boolean(url) && !url!.includes(LASTFM_IMAGE_PLACEHOLDER);
}

type ImageSize = "small" | "medium" | "large" | "extralarge";

const SIZE_PREFERENCE: Record<"thumb" | "tile" | "full", ImageSize[]> = {
  thumb: ["medium", "large", "small", "extralarge"],
  tile: ["large", "extralarge", "medium", "small"],
  full: ["extralarge", "large", "medium", "small"],
};

/** Path tokens Last.fm uses for each display tier */
const PATH_TOKEN = {
  thumb: "64s",
  tile: "174s",
  full: "300x300",
} as const;

export function pickImageUrl(
  images: { "#text": string; size: string }[] | undefined,
  preference: keyof typeof SIZE_PREFERENCE = "full"
): string {
  if (!images?.length) return "";
  for (const size of SIZE_PREFERENCE[preference]) {
    const hit = images.find((img) => img.size === size)?.["#text"];
    if (isUsableImage(hit)) return hit;
  }
  const fallback = images.find((img) => img["#text"])?.["#text"] || "";
  return isUsableImage(fallback) ? fallback : "";
}

/** Rewrite a Last.fm CDN URL to a smaller (or larger) raster for the layout. */
export function sizedLastfmImage(
  url: string,
  display: keyof typeof PATH_TOKEN = "full"
): string {
  if (!url) return "";
  const token = PATH_TOKEN[display];
  return url.replace(/\/i\/u\/(?:\d+s|\d+x\d+)\//, `/i/u/${token}/`);
}
