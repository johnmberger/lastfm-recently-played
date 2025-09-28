import {
  trackSchema,
  recentTracksSchema,
  topArtistSchema,
  topArtistsSchema,
  weeklyArtistSchema,
  weeklyArtistsSchema,
  Track,
  TopArtist,
  TopArtistsResponse,
  WeeklyArtist,
  WeeklyArtistsResponse,
} from "./schemas";

// Re-export types for backward compatibility
export type { Track, WeeklyArtist };

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
    limit: "51",
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 10,
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

export async function getWeeklyArtists(): Promise<WeeklyArtist[]> {
  const API_KEY = process.env.LASTFM_API_KEY;
  const USERNAME = process.env.LASTFM_USERNAME;
  const API_URL = "https://ws.audioscrobbler.com/2.0/";

  if (!API_KEY || !USERNAME) {
    throw new Error(
      "Missing Last.fm API Key or Username in environment variables."
    );
  }

  const params = new URLSearchParams({
    method: "user.getweeklyartistchart",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch weekly artists from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();

  const parsedData = weeklyArtistsSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse weekly artists data from Last.fm API.");
  }

  const artists = parsedData.data.weeklyartistchart.artist;

  return artists;
}
