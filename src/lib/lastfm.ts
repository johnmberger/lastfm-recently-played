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

const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = process.env.LASTFM_USERNAME;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

export async function getRecentTracks(): Promise<Track[]> {
  if (!API_KEY || !USERNAME) {
    console.error('Missing Last.fm API Key or Username');
    throw new Error('Missing Last.fm API Key or Username in environment variables.');
  }

  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
    limit: '12',
  });

  const url = `${API_URL}?${params.toString()}`;
  console.log(`Fetching recent tracks from: ${url}`);

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    }
  });

  if (!response.ok) {
    console.error('Last.fm API response not OK', { status: response.status, statusText: response.statusText });
    throw new Error(`Failed to fetch recent tracks from Last.fm: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Received data from Last.fm API:', JSON.stringify(data, null, 2));

  const parsedData = recentTracksSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Invalid data structure from Last.fm API:', parsedData.error);
    throw new Error('Failed to parse data from Last.fm API.');
  }

  console.log('Successfully parsed data:', parsedData.data);

  const tracks = parsedData.data.recenttracks.track;
  console.log(`Returning ${tracks.length} tracks.`);

  return tracks;
}
