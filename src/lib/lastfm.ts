import {
  recentTracksSchema,
  topArtistsSchema,
  topAlbumsSchema,
  topTracksSchema,
  weeklyArtistsSchema,
  userInfoSchema,
  userTopTagsSchema,
  Track,
  TopArtist,
  TopAlbum,
  TopTrack,
  WeeklyArtist,
  WeeklyArtistView,
  WeeklyChartMeta,
  EnrichedWeeklyArtists,
  TopAlbumView,
  TopTrackView,
  WeeklyTops,
  UserInfo,
  UserTag,
} from "./schemas";
import {
  computeListeningDensity,
  computeWeekDepth,
  computeWeekOverlap,
  formatAccountAge,
} from "./listeningStats";
import type { ListeningStats } from "./listeningStats";
import { formatWeekRange } from "./dateUtils";

export type {
  Track,
  WeeklyArtist,
  WeeklyArtistView,
  WeeklyChartMeta,
  EnrichedWeeklyArtists,
  TopAlbumView,
  TopTrackView,
  WeeklyTops,
  UserInfo,
  UserTag,
};

export type { ListeningStats };

/** Last.fm intentionally returns this star for stripped artist artwork */
const LASTFM_IMAGE_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

function getCredentials() {
  const API_KEY = process.env.LASTFM_API_KEY;
  const USERNAME = process.env.LASTFM_USERNAME;
  const API_URL = "https://ws.audioscrobbler.com/2.0/";

  if (!API_KEY || !USERNAME) {
    throw new Error(
      "Missing Last.fm API Key or Username in environment variables."
    );
  }

  return { API_KEY, USERNAME, API_URL };
}

function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function isUsableImage(url: string | undefined | null): url is string {
  return Boolean(url) && !url!.includes(LASTFM_IMAGE_PLACEHOLDER);
}

function pickImageUrl(
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

export async function getRecentTracks(limit = 51): Promise<Track[]> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
    limit: String(Math.min(Math.max(limit, 1), 200)),
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 10,
    },
  });

  if (!response.ok) {
    const responseText = await response
      .text()
      .catch(() => "<failed to read body>");
    console.error("Last.fm recent tracks fetch failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      responseText,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch recent tracks from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();

  const parsedData = recentTracksSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(
      "Last.fm recent tracks parse error",
      parsedData.error.format()
    );
    throw new Error("Failed to parse data from Last.fm API.");
  }

  const rawTracks = (parsedData.data as any).recenttracks.track;
  const tracks: Track[] = Array.isArray(rawTracks)
    ? rawTracks
    : Object.values(rawTracks);

  return tracks;
}

export async function getWeeklyArtistChart(): Promise<{
  artists: WeeklyArtist[];
  meta: WeeklyChartMeta;
}> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

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
    const responseText = await response
      .text()
      .catch(() => "<failed to read body>");
    console.error("Last.fm weekly artists fetch failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      responseText,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch weekly artists from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsedData = weeklyArtistsSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(
      "Last.fm weekly artists parse error",
      parsedData.error.format()
    );
    throw new Error("Failed to parse weekly artists data from Last.fm API.");
  }

  const chart = parsedData.data.weeklyartistchart;
  const artists = asArray(chart.artist);
  const meta: WeeklyChartMeta = {
    user: chart["@attr"].user,
    from: chart["@attr"].from,
    to: chart["@attr"].to,
  };

  return { artists, meta };
}

/** @deprecated Prefer getWeeklyArtistChart / getEnrichedWeeklyArtists */
export async function getWeeklyArtists(): Promise<WeeklyArtist[]> {
  const { artists } = await getWeeklyArtistChart();
  return artists;
}

export async function getTopArtists({
  period = "7day",
  limit = 50,
}: {
  period?: "7day" | "1month" | "3month" | "6month" | "12month" | "overall";
  limit?: number;
} = {}): Promise<TopArtist[]> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

  const params = new URLSearchParams({
    method: "user.gettopartists",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
    period,
    limit: String(limit),
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const responseText = await response
      .text()
      .catch(() => "<failed to read body>");
    console.error("Last.fm top artists fetch failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      responseText,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch top artists from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsedData = topArtistsSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(
      "Last.fm top artists parse error",
      parsedData.error.format()
    );
    throw new Error("Failed to parse top artists data from Last.fm API.");
  }

  return asArray(parsedData.data.topartists.artist);
}

export async function getTopAlbums({
  period = "7day",
  limit = 100,
}: {
  period?: "7day" | "1month" | "3month" | "6month" | "12month" | "overall";
  limit?: number;
} = {}): Promise<TopAlbum[]> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

  const params = new URLSearchParams({
    method: "user.gettopalbums",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
    period,
    limit: String(limit),
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const responseText = await response
      .text()
      .catch(() => "<failed to read body>");
    console.error("Last.fm top albums fetch failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      responseText,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch top albums from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsedData = topAlbumsSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(
      "Last.fm top albums parse error",
      parsedData.error.format()
    );
    throw new Error("Failed to parse top albums data from Last.fm API.");
  }

  return asArray(parsedData.data.topalbums.album);
}

export async function getTopTracks({
  period = "7day",
  limit = 50,
}: {
  period?: "7day" | "1month" | "3month" | "6month" | "12month" | "overall";
  limit?: number;
} = {}): Promise<TopTrack[]> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

  const params = new URLSearchParams({
    method: "user.gettoptracks",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
    period,
    limit: String(limit),
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const responseText = await response
      .text()
      .catch(() => "<failed to read body>");
    console.error("Last.fm top tracks fetch failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      responseText,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch top tracks from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsedData = topTracksSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(
      "Last.fm top tracks parse error",
      parsedData.error.format()
    );
    throw new Error("Failed to parse top tracks data from Last.fm API.");
  }

  return asArray(parsedData.data.toptracks.track);
}

/**
 * Map artist → best album cover from this week's top albums.
 * Last.fm artist images are always a placeholder; album art still works.
 */
export function buildArtistImageMapFromAlbums(
  albums: TopAlbum[]
): Map<string, string> {
  const imageByName = new Map<string, string>();
  for (const album of albums) {
    const key = album.artist.name.toLowerCase();
    if (imageByName.has(key)) continue;
    const image = pickImageUrl(album.image);
    if (image) {
      imageByName.set(key, image);
    }
  }
  return imageByName;
}

export function mergeWeeklyArtistsWithImages(
  weekly: WeeklyArtist[],
  imageByName: Map<string, string>
): WeeklyArtistView[] {
  return weekly.map((artist) => ({
    name: artist.name,
    playcount: artist.playcount,
    url: artist.url,
    rank: artist["@attr"].rank,
    image: imageByName.get(artist.name.toLowerCase()) || "",
  }));
}

function toAlbumViews(albums: TopAlbum[]): TopAlbumView[] {
  return albums.map((album, index) => ({
    name: album.name,
    artist: album.artist.name,
    playcount: album.playcount,
    url: album.url,
    rank: album["@attr"]?.rank || String(index + 1),
    image: pickImageUrl(album.image),
  }));
}

function toTrackViews(
  tracks: TopTrack[],
  fallbackImages?: Map<string, string>
): TopTrackView[] {
  return tracks.map((track, index) => {
    const fromTrack = pickImageUrl(track.image);
    const fromAlbum =
      fallbackImages?.get(track.artist.name.toLowerCase()) || "";
    return {
      name: track.name,
      artist: track.artist.name,
      playcount: track.playcount,
      url: track.url,
      rank: track["@attr"]?.rank || String(index + 1),
      image: fromTrack || fromAlbum,
    };
  });
}

/** Weekly chart ranks/plays + album covers from top-albums(7day). */
export async function getEnrichedWeeklyArtists(): Promise<EnrichedWeeklyArtists> {
  const tops = await getWeeklyTops();
  return { artists: tops.artists, meta: tops.meta };
}

/**
 * This week's tops: artists (weekly chart) + albums + tracks.
 * 3 Last.fm calls in parallel.
 */
export async function getWeeklyTops(): Promise<WeeklyTops> {
  const [weekly, topAlbums, topTracks] = await Promise.all([
    getWeeklyArtistChart(),
    getTopAlbums({ period: "7day", limit: 100 }).catch((error) => {
      console.error("Top albums fetch failed", error);
      return [] as TopAlbum[];
    }),
    getTopTracks({ period: "7day", limit: 50 }).catch((error) => {
      console.error("Top tracks fetch failed", error);
      return [] as TopTrack[];
    }),
  ]);

  const imageByName = buildArtistImageMapFromAlbums(topAlbums);

  return {
    artists: mergeWeeklyArtistsWithImages(weekly.artists, imageByName),
    albums: toAlbumViews(topAlbums),
    tracks: toTrackViews(topTracks, imageByName),
    meta: weekly.meta,
  };
}

export async function getUserInfo(): Promise<UserInfo> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

  const params = new URLSearchParams({
    method: "user.getinfo",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
  });

  const url = `${API_URL}?${params.toString()}`;
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user info from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsed = userInfoSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Last.fm user info parse error", parsed.error.format());
    throw new Error("Failed to parse user info from Last.fm API.");
  }

  const user = parsed.data.user;
  return {
    name: user.name,
    playcount: parseInt(user.playcount, 10) || 0,
    registeredUnix: parseInt(user.registered.unixtime, 10) || 0,
    url: user.url,
  };
}

export async function getTopTags(limit = 12): Promise<UserTag[]> {
  const { API_KEY, USERNAME, API_URL } = getCredentials();

  const params = new URLSearchParams({
    method: "user.gettoptags",
    user: USERNAME,
    api_key: API_KEY,
    format: "json",
    limit: String(limit),
  });

  const url = `${API_URL}?${params.toString()}`;
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch top tags from Last.fm: ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsed = userTopTagsSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Last.fm top tags parse error", parsed.error.format());
    throw new Error("Failed to parse top tags from Last.fm API.");
  }

  const raw = parsed.data.toptags.tag;
  const tags = asArray(raw).filter((t) => t?.name);
  return tags.map((tag) => ({
    name: tag.name,
    count: parseInt(tag.count, 10) || 0,
    url: tag.url || `https://www.last.fm/tag/${encodeURIComponent(tag.name)}`,
  }));
}

/** Profile + week flavor stats for the /me page. */
export async function getListeningStats(): Promise<ListeningStats> {
  const [profile, tops, recent] = await Promise.all([
    getUserInfo().catch((error) => {
      console.error("User info fetch failed", error);
      return null;
    }),
    getWeeklyTops().catch((error) => {
      console.error("Weekly tops fetch failed", error);
      return null;
    }),
    getRecentTracks(200).catch((error) => {
      console.error("Recent tracks (stats) fetch failed", error);
      return [] as Track[];
    }),
  ]);

  const age =
    profile && profile.registeredUnix > 0
      ? formatAccountAge(profile.registeredUnix)
      : null;

  return {
    profile,
    accountAgeYears: age?.years ?? null,
    accountAgeLabel: age?.label ?? null,
    depth: tops ? computeWeekDepth(tops.artists) : null,
    overlap: tops ? computeWeekOverlap(tops) : null,
    density: computeListeningDensity(recent),
    weekLabel: tops?.meta
      ? formatWeekRange(tops.meta.from, tops.meta.to)
      : null,
  };
}
