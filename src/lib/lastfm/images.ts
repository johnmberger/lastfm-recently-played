/** Last.fm intentionally returns this star for stripped artist artwork */
export const LASTFM_IMAGE_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

export function isUsableImage(url: string | undefined | null): url is string {
  return Boolean(url) && !url!.includes(LASTFM_IMAGE_PLACEHOLDER);
}

export function pickImageUrl(
  images: { "#text": string; size: string }[] | undefined
): string {
  if (!images?.length) return "";
  const preferred =
    images.find((img) => img.size === "extralarge")?.["#text"] ||
    images.find((img) => img.size === "large")?.["#text"] ||
    images.find((img) => img.size === "medium")?.["#text"] ||
    images.find((img) => img["#text"])?.["#text"] ||
    "";
  return isUsableImage(preferred) ? preferred : "";
}
