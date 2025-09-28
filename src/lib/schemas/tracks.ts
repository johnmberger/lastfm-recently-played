import { z } from "zod";
import { trackImageSchema, artistSchema, albumSchema } from "./base";

// Track-related schemas
export const trackSchema = z.object({
  artist: artistSchema,
  album: albumSchema,
  image: z.array(trackImageSchema),
  name: z.string(),
  url: z.string().url(),
  date: z.object({ uts: z.string() }).optional(),
  "@attr": z.object({ nowplaying: z.string().optional() }).optional(),
});

export const recentTracksSchema = z.object({
  recenttracks: z.object({
    track: z.array(trackSchema),
  }),
});

// TypeScript Types
export type Track = z.infer<typeof trackSchema>;
export type RecentTracksResponse = z.infer<typeof recentTracksSchema>;
