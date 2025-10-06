import { z } from "zod";

// Base schemas used across different Last.fm API responses
export const trackImageSchema = z.object({
  "#text": z.string().url().or(z.literal("")),
  size: z.string(),
});

export const artistSchema = z.object({
  "#text": z.string(),
});

export const albumSchema = z.object({
  "#text": z.string(),
});

// TypeScript Types
export type TrackImage = z.infer<typeof trackImageSchema>;
export type Artist = z.infer<typeof artistSchema>;
export type Album = z.infer<typeof albumSchema>;
