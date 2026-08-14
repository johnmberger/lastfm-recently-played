import {
  recentTracksSchema,
  topArtistsSchema,
  topAlbumsSchema,
  topTracksSchema,
  userInfoSchema,
  Track,
  TopArtist,
  TopAlbum,
  TopTrack,
  ChartArtistView,
  TopAlbumView,
  TopTrackView,
  ChartTops,
  UserInfo,
  type RecentTracksResponse,
} from "../schemas";
import {
  computeDepth,
  computeOverlap,
  formatAccountAge,
} from "../listeningStats";
import type { ListeningStats } from "../listeningStats";
import {
  ChartPeriod,
  DEFAULT_CHART_PERIOD,
  durationControlLabel,
} from "../period";
import { asArray, lastfmRequest } from "./request";
import { pickImageUrl } from "./images";

export type {
  Track,
  ChartArtistView,
  TopAlbumView,
  TopTrackView,
  ChartTops,
  UserInfo,
};

export type { ListeningStats };
export type { ChartPeriod };

export { LASTFM_IMAGE_PLACEHOLDER } from "./images";

export async function getRecentTracks(limit = 51): Promise<Track[]> {
  const data = await lastfmRequest<RecentTracksResponse>({
    method: "user.getrecenttracks",
    params: {
      limit: String(Math.min(Math.max(limit, 1), 200)),
    },
    schema: recentTracksSchema,
    revalidate: 10,
    label: "recent tracks",
  });

  const rawTracks = data.recenttracks.track;
  return Array.isArray(rawTracks) ? rawTracks : Object.values(rawTracks);
}

export async function getTopArtists({
  period = "7day",
  limit = 50,
}: {
  period?: ChartPeriod;
  limit?: number;
} = {}): Promise<TopArtist[]> {
  const data = await lastfmRequest<{
    topartists: { artist: TopArtist | TopArtist[] };
  }>({
    method: "user.gettopartists",
    params: {
      period,
      limit: String(limit),
    },
    schema: topArtistsSchema,
    revalidate: 60,
    label: "top artists",
  });

  return asArray(data.topartists.artist);
}

export async function getTopAlbums({
  period = "7day",
  limit = 100,
}: {
  period?: ChartPeriod;
  limit?: number;
} = {}): Promise<TopAlbum[]> {
  const data = await lastfmRequest<{
    topalbums: { album: TopAlbum | TopAlbum[] };
  }>({
    method: "user.gettopalbums",
    params: {
      period,
      limit: String(limit),
    },
    schema: topAlbumsSchema,
    revalidate: 60,
    label: "top albums",
  });

  return asArray(data.topalbums.album);
}

export async function getTopTracks({
  period = "7day",
  limit = 50,
}: {
  period?: ChartPeriod;
  limit?: number;
} = {}): Promise<TopTrack[]> {
  const data = await lastfmRequest<{
    toptracks: { track: TopTrack | TopTrack[] };
  }>({
    method: "user.gettoptracks",
    params: {
      period,
      limit: String(limit),
    },
    schema: topTracksSchema,
    revalidate: 60,
    label: "top tracks",
  });

  return asArray(data.toptracks.track);
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

function toArtistViews(
  artists: TopArtist[],
  imageByName: Map<string, string>
): ChartArtistView[] {
  return artists.map((artist, index) => ({
    name: artist.name,
    playcount: artist.playcount,
    url: artist.url,
    rank: artist["@attr"]?.rank || String(index + 1),
    image:
      imageByName.get(artist.name.toLowerCase()) ||
      pickImageUrl(artist.image) ||
      "",
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

/**
 * Period-aware tops: artists + albums + tracks via Last.fm period charts.
 */
export async function getChartTops(
  period: ChartPeriod = DEFAULT_CHART_PERIOD
): Promise<ChartTops> {
  const [topArtists, topAlbums, topTracks] = await Promise.all([
    getTopArtists({ period, limit: 50 }).catch((error) => {
      console.error("Top artists fetch failed", error);
      return [] as TopArtist[];
    }),
    getTopAlbums({ period, limit: 100 }).catch((error) => {
      console.error("Top albums fetch failed", error);
      return [] as TopAlbum[];
    }),
    getTopTracks({ period, limit: 50 }).catch((error) => {
      console.error("Top tracks fetch failed", error);
      return [] as TopTrack[];
    }),
  ]);

  const imageByName = buildArtistImageMapFromAlbums(topAlbums);

  return {
    artists: toArtistViews(topArtists, imageByName),
    albums: toAlbumViews(topAlbums),
    tracks: toTrackViews(topTracks, imageByName),
    period,
  };
}

export async function getUserInfo(): Promise<UserInfo> {
  const data = await lastfmRequest<{
    user: {
      name: string;
      playcount: string;
      registered: { unixtime: string };
      url: string;
    };
  }>({
    method: "user.getinfo",
    schema: userInfoSchema,
    revalidate: 3600,
    label: "user info",
  });

  const user = data.user;
  return {
    name: user.name,
    playcount: parseInt(user.playcount, 10) || 0,
    registeredUnix: parseInt(user.registered.unixtime, 10) || 0,
    url: user.url,
  };
}

/** Profile + period flavor stats for the /me page. */
export async function getListeningStats(
  period: ChartPeriod = DEFAULT_CHART_PERIOD
): Promise<ListeningStats> {
  const [profile, tops] = await Promise.all([
    getUserInfo().catch((error) => {
      console.error("User info fetch failed", error);
      return null;
    }),
    getChartTops(period).catch((error) => {
      console.error("Chart tops fetch failed", error);
      return null;
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
    depth: tops ? computeDepth(tops.artists) : null,
    overlap: tops ? computeOverlap(tops) : null,
    period,
    periodLabel: durationControlLabel(period),
  };
}
