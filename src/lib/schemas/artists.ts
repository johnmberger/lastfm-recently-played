import { z } from "zod";
import { trackImageSchema } from "./base";

// Top Artists schemas — Last.fm sometimes omits/empties fields
export const topArtistSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  listeners: z.string().optional(),
  mbid: z.string().optional().default(""),
  url: z.string().url(),
  streamable: z.union([z.string(), z.object({ "#text": z.string() })]).optional(),
  image: z.array(trackImageSchema).default([]),
});

export const topArtistsSchema = z.object({
  topartists: z.object({
    artist: z.union([z.array(topArtistSchema), topArtistSchema]),
    "@attr": z.object({
      user: z.string(),
      totalPages: z.string(),
      page: z.string(),
      perPage: z.string(),
      total: z.string(),
    }),
  }),
});

// Weekly Artists schemas
export const weeklyArtistSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  mbid: z.string().optional().default(""),
  url: z.string().url(),
  "@attr": z.object({
    rank: z.string(),
  }),
});

export const weeklyArtistsSchema = z.object({
  weeklyartistchart: z.object({
    artist: z.union([z.array(weeklyArtistSchema), weeklyArtistSchema]),
    "@attr": z.object({
      user: z.string(),
      from: z.string(),
      to: z.string(),
    }),
  }),
});

// TypeScript Types
export type TopArtist = z.infer<typeof topArtistSchema>;
export type TopArtistsResponse = z.infer<typeof topArtistsSchema>;
export type WeeklyArtist = z.infer<typeof weeklyArtistSchema>;
export type WeeklyArtistsResponse = z.infer<typeof weeklyArtistsSchema>;

export type WeeklyArtistView = {
  name: string;
  playcount: string;
  url: string;
  rank: string;
  image: string;
};

export type WeeklyChartMeta = {
  user: string;
  from: string;
  to: string;
};

export type EnrichedWeeklyArtists = {
  artists: WeeklyArtistView[];
  meta: WeeklyChartMeta;
};

/** Top albums — used for real cover art (artist images are placeholders in the API) */
export const topAlbumSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  mbid: z.string().optional().default(""),
  url: z.string().url().or(z.literal("")),
  artist: z.object({
    name: z.string(),
    mbid: z.string().optional().default(""),
    url: z.string().url().or(z.literal("")).optional(),
  }),
  image: z.array(trackImageSchema).default([]),
  "@attr": z
    .object({
      rank: z.string().optional(),
    })
    .optional(),
});

export const topAlbumsSchema = z.object({
  topalbums: z.object({
    album: z.union([z.array(topAlbumSchema), topAlbumSchema]),
    "@attr": z.object({
      user: z.string(),
      totalPages: z.string().optional(),
      page: z.string().optional(),
      perPage: z.string().optional(),
      total: z.string().optional(),
    }),
  }),
});

export type TopAlbum = z.infer<typeof topAlbumSchema>;
export type TopAlbumsResponse = z.infer<typeof topAlbumsSchema>;

/** Top tracks for the week — album art usually still works */
export const topTrackSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  mbid: z.string().optional().default(""),
  url: z.string().url().or(z.literal("")),
  duration: z.string().optional(),
  artist: z.object({
    name: z.string(),
    mbid: z.string().optional().default(""),
    url: z.string().url().or(z.literal("")).optional(),
  }),
  image: z.array(trackImageSchema).default([]),
  "@attr": z
    .object({
      rank: z.string().optional(),
    })
    .optional(),
});

export const topTracksSchema = z.object({
  toptracks: z.object({
    track: z.union([z.array(topTrackSchema), topTrackSchema]),
    "@attr": z.object({
      user: z.string(),
      totalPages: z.string().optional(),
      page: z.string().optional(),
      perPage: z.string().optional(),
      total: z.string().optional(),
    }),
  }),
});

export type TopTrack = z.infer<typeof topTrackSchema>;
export type TopTracksResponse = z.infer<typeof topTracksSchema>;

export type TopAlbumView = {
  name: string;
  artist: string;
  playcount: string;
  url: string;
  rank: string;
  image: string;
};

export type TopTrackView = {
  name: string;
  artist: string;
  playcount: string;
  url: string;
  rank: string;
  image: string;
};

export type WeeklyTops = {
  artists: WeeklyArtistView[];
  albums: TopAlbumView[];
  tracks: TopTrackView[];
  meta: WeeklyChartMeta;
};

