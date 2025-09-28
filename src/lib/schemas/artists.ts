import { z } from "zod";
import { trackImageSchema } from "./base";

// Top Artists schemas
export const topArtistSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  listeners: z.string(),
  mbid: z.string(),
  url: z.string().url(),
  streamable: z.string(),
  image: z.array(trackImageSchema),
});

export const topArtistsSchema = z.object({
  topartists: z.object({
    artist: z.array(topArtistSchema),
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
  mbid: z.string(),
  url: z.string().url(),
  "@attr": z.object({
    rank: z.string(),
  }),
});

export const weeklyArtistsSchema = z.object({
  weeklyartistchart: z.object({
    artist: z.array(weeklyArtistSchema),
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
