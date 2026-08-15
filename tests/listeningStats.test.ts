import { describe, expect, it } from "vitest";
import {
  computeDepth,
  computeListeningDensity,
  computeOverlap,
  depthVibe,
  formatAccountAge,
  type ChartDepth,
} from "@/lib/listeningStats";
import type { ChartTops } from "@/lib/schemas";
import type { Track } from "@/lib/schemas";

function depthFixture(
  partial: Partial<ChartDepth> & Pick<ChartDepth, "leaders" | "leadersSharePercent">
): ChartDepth {
  return {
    uniqueArtists: 10,
    totalPlays: 100,
    playsPerArtist: 10,
    ...partial,
  };
}

describe("computeDepth", () => {
  it("returns null for an empty chart", () => {
    expect(computeDepth([])).toBeNull();
  });

  it("sums plays and computes leader shares", () => {
    const depth = computeDepth(
      [
        { name: "A", playcount: "40" },
        { name: "B", playcount: "30" },
        { name: "C", playcount: "20" },
        { name: "D", playcount: "10" },
      ],
      3
    );

    expect(depth).toMatchObject({
      uniqueArtists: 4,
      totalPlays: 100,
      playsPerArtist: 25,
      leadersSharePercent: 90,
    });
    expect(depth!.leaders).toHaveLength(3);
    expect(depth!.leaders[0]).toEqual({
      name: "A",
      plays: 40,
      sharePercent: 40,
    });
  });
});

describe("depthVibe", () => {
  it("flags ~20% top-artist share as deep in the loop", () => {
    expect(
      depthVibe(
        depthFixture({
          leaders: [{ name: "A", plays: 20, sharePercent: 20 }],
          leadersSharePercent: 45,
        })
      )
    ).toBe("deep in the loop");
  });

  it("uses mid-band copy for moderate concentration", () => {
    expect(
      depthVibe(
        depthFixture({
          leaders: [{ name: "A", plays: 14, sharePercent: 14 }],
          leadersSharePercent: 40,
        })
      )
    ).toBe("a healthy amount of repeat");
  });

  it("calls a varied chart lots of variety", () => {
    expect(
      depthVibe(
        depthFixture({
          leaders: [{ name: "A", plays: 5, sharePercent: 5 }],
          leadersSharePercent: 20,
        })
      )
    ).toBe("lots of variety");
  });
});

describe("computeListeningDensity", () => {
  const now = new Date("2026-08-15T15:00:00");

  function trackAt(iso: string, name = "song"): Track {
    const uts = String(Math.floor(new Date(iso).getTime() / 1000));
    return {
      name,
      artist: { "#text": "Artist", mbid: "" },
      album: { "#text": "Album", mbid: "" },
      image: [],
      url: "https://example.com",
      date: { uts, "#text": iso },
    } as Track;
  }

  it("ignores now-playing rows without timestamps", () => {
    const np = {
      name: "live",
      artist: { "#text": "A", mbid: "" },
      album: { "#text": "", mbid: "" },
      image: [],
      url: "https://example.com",
      "@attr": { nowplaying: "true" },
    } as Track;
    expect(computeListeningDensity([np], now)).toBeNull();
  });

  it("splits today / yesterday and averages across sample days", () => {
    const density = computeListeningDensity(
      [
        trackAt("2026-08-15T10:00:00"),
        trackAt("2026-08-15T11:00:00"),
        trackAt("2026-08-14T12:00:00"),
        trackAt("2026-08-13T12:00:00"),
      ],
      now
    );

    expect(density).toEqual({
      today: 2,
      yesterday: 1,
      samplePlays: 4,
      sampleDays: 3,
      recentDailyAvg: 1.3,
    });
  });
});

describe("computeOverlap", () => {
  it("keeps artists that appear on at least two surfaces", () => {
    const tops = {
      period: "7day",
      artists: [
        {
          name: "Overlap Act",
          playcount: "10",
          url: "https://example.com/a",
          rank: "1",
          image: "",
        },
      ],
      albums: [
        {
          name: "Album",
          artist: "Overlap Act",
          playcount: "5",
          url: "https://example.com/al",
          rank: "1",
          image: "",
        },
      ],
      tracks: [
        {
          name: "Solo Only",
          artist: "Other",
          playcount: "3",
          url: "https://example.com/t",
          rank: "1",
          image: "",
        },
      ],
    } as ChartTops;

    const overlap = computeOverlap(tops);
    expect(overlap?.items).toHaveLength(1);
    expect(overlap?.items[0].artist).toBe("Overlap Act");
    expect(overlap?.items[0].surfaces).toBe(2);
  });
});

describe("formatAccountAge", () => {
  it("formats multi-year ages", () => {
    const now = new Date("2026-08-15T00:00:00Z");
    const registered = Math.floor(
      new Date("2020-02-15T00:00:00Z").getTime() / 1000
    );
    expect(formatAccountAge(registered, now).label).toMatch(/6y/);
  });
});
