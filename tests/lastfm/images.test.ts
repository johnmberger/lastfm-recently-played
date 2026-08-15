import { describe, expect, it } from "vitest";
import {
  LASTFM_IMAGE_PLACEHOLDER,
  isUsableImage,
  pickImageUrl,
  sizedLastfmImage,
} from "@/lib/lastfm/images";

const PLACEHOLDER = `https://lastfm.freetls.fastly.net/i/u/300x300/${LASTFM_IMAGE_PLACEHOLDER}.png`;
const FULL = "https://lastfm.freetls.fastly.net/i/u/300x300/abc123.png";
const LARGE = "https://lastfm.freetls.fastly.net/i/u/174s/abc123.png";
const MEDIUM = "https://lastfm.freetls.fastly.net/i/u/64s/abc123.png";

describe("isUsableImage", () => {
  it("rejects empty and placeholder artwork", () => {
    expect(isUsableImage("")).toBe(false);
    expect(isUsableImage(PLACEHOLDER)).toBe(false);
    expect(isUsableImage(FULL)).toBe(true);
  });
});

describe("pickImageUrl", () => {
  const images = [
    { size: "small", "#text": "https://lastfm.freetls.fastly.net/i/u/34s/abc123.png" },
    { size: "medium", "#text": MEDIUM },
    { size: "large", "#text": LARGE },
    { size: "extralarge", "#text": FULL },
  ];

  it("prefers extralarge for full cards", () => {
    expect(pickImageUrl(images, "full")).toBe(FULL);
  });

  it("prefers medium for thumbs", () => {
    expect(pickImageUrl(images, "thumb")).toBe(MEDIUM);
  });

  it("skips placeholder entries", () => {
    expect(
      pickImageUrl(
        [
          { size: "extralarge", "#text": PLACEHOLDER },
          { size: "large", "#text": LARGE },
        ],
        "full"
      )
    ).toBe(LARGE);
  });
});

describe("sizedLastfmImage", () => {
  it("rewrites CDN path tokens", () => {
    expect(sizedLastfmImage(FULL, "thumb")).toBe(
      "https://lastfm.freetls.fastly.net/i/u/64s/abc123.png"
    );
    expect(sizedLastfmImage(MEDIUM, "full")).toBe(
      "https://lastfm.freetls.fastly.net/i/u/300x300/abc123.png"
    );
  });

  it("returns empty string for empty input", () => {
    expect(sizedLastfmImage("")).toBe("");
  });
});
