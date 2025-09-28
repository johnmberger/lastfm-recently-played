import { z } from "zod";

// Zod Schemas for validation
const trackImageSchema = z.object({
  "#text": z.string().url(),
  size: z.string(),
});

const artistSchema = z.object({
  "#text": z.string(),
});

const albumSchema = z.object({
  "#text": z.string(),
});

const trackSchema = z.object({
  artist: artistSchema,
  album: albumSchema,
  image: z.array(trackImageSchema),
  name: z.string(),
  url: z.string().url(),
  date: z.object({ uts: z.string() }).optional(),
});

const recentTracksSchema = z.object({
  recenttracks: z.object({
    track: z.array(trackSchema),
  }),
});

// TypeScript Types inferred from Zod Schemas
export type Track = z.infer<typeof trackSchema>;
export type Artist = z.infer<typeof artistSchema>;
export type Album = z.infer<typeof albumSchema>;
export type TrackImage = z.infer<typeof trackImageSchema>;

export async function getRecentTracks(): Promise<Track[]> {
  const API_KEY = process.env.LASTFM_API_KEY;
  const USERNAME = process.env.LASTFM_USERNAME;
  const API_URL = "https://ws.audioscrobbler.com/2.0/";

  if (!API_KEY || !USERNAME) {


    throw new Error(
      "Missing Last.fm API Key or Username in environment variables."
    );
  }

  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
    limit: "12",
  });

  const url = `${API_URL}?${params.toString()}`;


  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {

    throw new Error(
      `Failed to fetch recent tracks from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();


  const parsedData = recentTracksSchema.safeParse(data);

  if (!parsedData.success) {

    throw new Error("Failed to parse data from Last.fm API.");
  }



  const tracks = parsedData.data.recenttracks.track;


  return tracks;
}
