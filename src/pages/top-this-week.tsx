import { useMemo } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import {
  getWeeklyTops,
  WeeklyArtistView,
  WeeklyChartMeta,
  TopAlbumView,
  TopTrackView,
} from "@/lib/lastfm";
import EmptyState from "@/components/EmptyState";
import EarwormLogo from "@/components/EarwormLogo";
import CoverImage from "@/components/CoverImage";
import BuiltBy from "@/components/BuiltBy";
import MetaTags from "@/components/MetaTags";
import {
  formatNumber,
  formatWeekRange,
  getArtistChartStats,
} from "@/lib/dateUtils";

type TopsPageProps = {
  artists: WeeklyArtistView[];
  albums: TopAlbumView[];
  tracks: TopTrackView[];
  meta: WeeklyChartMeta | null;
};

export const getServerSideProps: GetServerSideProps<TopsPageProps> = async () => {
  try {
    const payload = await getWeeklyTops();
    return {
      props: {
        artists: payload.artists,
        albums: payload.albums,
        tracks: payload.tracks,
        meta: payload.meta,
      },
    };
  } catch (error) {
    console.error("SSR Error (top-this-week):", error);
    return {
      props: {
        artists: [],
        albums: [],
        tracks: [],
        meta: null,
      },
    };
  }
};

function ShareBar({
  value,
  max,
  className = "",
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const width = Math.max(3, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div className={`h-1.5 rounded-full bg-white/5 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function SpotlightCard({
  label,
  title,
  subtitle,
  plays,
  image,
  href,
}: {
  label: string;
  title: string;
  subtitle?: string;
  plays: number;
  image: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300 px-3 py-4 sm:px-4 sm:py-5 h-full flex flex-col items-center text-center"
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {image && !image.includes("2a96cbd8b46e442fc41c2b86b821562f") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover scale-110 blur-2xl opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-blue-500/30" />
        )}
      </div>
      <div className="relative flex flex-col items-center w-full min-w-0">
        <CoverImage
          name={title}
          image={image}
          className="w-40 h-40 sm:w-44 sm:h-44 text-4xl shadow-lg shadow-black/40"
          rounded="rounded-xl"
        />
        <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/80 mt-3 mb-1">
          {label}
        </p>
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-200 transition-colors leading-snug line-clamp-2">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-xs text-dark-300 mt-1 line-clamp-1 w-full">
            {subtitle}
          </p>
        ) : null}
        <p className="text-xs text-dark-400 mt-2 tabular-nums">
          {formatNumber(plays)} {plays === 1 ? "play" : "plays"}
        </p>
      </div>
    </a>
  );
}

function RankRow({
  rank,
  title,
  subtitle,
  plays,
  maxPlays,
  image,
  href,
}: {
  rank: string | number;
  title: string;
  subtitle?: string;
  plays: number;
  maxPlays: number;
  image: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 py-2.5 px-1.5 -mx-1.5 rounded-xl hover:bg-white/5 transition-colors group"
    >
      <span className="w-6 text-center text-xs font-semibold text-dark-500 tabular-nums shrink-0">
        {rank}
      </span>
      <CoverImage name={title} image={image} className="w-10 h-10" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="font-medium text-white truncate group-hover:text-pink-300 transition-colors text-sm sm:text-base">
              {title}
            </p>
            <p className="text-xs text-dark-400 truncate">
              {subtitle || "\u00A0"}
            </p>
          </div>
          <span className="text-xs sm:text-sm text-dark-400 tabular-nums shrink-0">
            {formatNumber(plays)} {plays === 1 ? "play" : "plays"}
          </span>
        </div>
        <ShareBar value={plays} max={maxPlays} />
      </div>
    </a>
  );
}

export default function TopsPage({
  artists,
  albums,
  tracks,
  meta,
}: TopsPageProps) {
  const artistPlays = useMemo(
    () => artists.map((a) => parseInt(a.playcount, 10) || 0),
    [artists]
  );
  const albumPlays = useMemo(
    () => albums.map((a) => parseInt(a.playcount, 10) || 0),
    [albums]
  );
  const trackPlays = useMemo(
    () => tracks.map((t) => parseInt(t.playcount, 10) || 0),
    [tracks]
  );

  const artistStats = useMemo(
    () => getArtistChartStats(artistPlays),
    [artistPlays]
  );
  const albumTotal = useMemo(
    () => albumPlays.reduce((s, n) => s + n, 0),
    [albumPlays]
  );
  const trackTotal = useMemo(
    () => trackPlays.reduce((s, n) => s + n, 0),
    [trackPlays]
  );

  const weekLabel = meta ? formatWeekRange(meta.from, meta.to) : null;
  const topArtist = artists[0];
  const topAlbum = albums[0];
  const topTrack = tracks[0];
  const hasData = artists.length > 0 || albums.length > 0 || tracks.length > 0;
  const artistPlayTotal = artistStats.totalPlays;

  return (
    <>
      <MetaTags
        title="top this week"
        description="top artists, albums, and tracks from my last.fm week — the songs stuck in my head."
        keywords="earworms, top this week, top artists, top albums, top tracks, weekly chart, music"
        ogTitle="top this week | earworms"
        ogDescription="top artists, albums, and tracks from my last.fm week — the songs stuck in my head."
        ogUrl="/top-this-week"
        twitterTitle="top this week | earworms"
        twitterDescription="top artists, albums, and tracks from my last.fm week — the songs stuck in my head."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/25 via-pink-500/20 to-red-500/25 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <main className="relative z-10">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
            <header className="mb-10 sm:mb-12 animate-fade-in">
              <div className="flex items-start justify-between gap-4 mb-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity max-w-full min-w-0"
                >
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-none bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    earworms
                  </span>
                  <EarwormLogo
                    size="md"
                    crawling={false}
                    className="shrink-0"
                  />
                </Link>
                <nav className="hidden md:flex items-center gap-4 shrink-0 mt-2 lg:mt-3 text-sm">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-dark-300 hover:text-pink-300 transition-colors group"
                  >
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:-translate-x-0.5"
                    >
                      ←
                    </span>
                    latest tracks
                  </Link>
                  <Link
                    href="/me"
                    className="inline-flex items-center gap-1.5 text-dark-300 hover:text-pink-300 transition-colors group"
                  >
                    the numbers
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </nav>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                top this week
              </h2>
              <p className="text-dark-400 text-sm sm:text-base break-words">
                {weekLabel
                  ? `artists, albums, and tracks · ${weekLabel}`
                  : "artists, albums, and tracks from my last.fm week"}
              </p>
              <p className="text-xs text-dark-500 mt-2 max-w-2xl leading-relaxed">
                rolling 7-day chart. roughly. last.fm sends these charts by
                carrier pigeon.
              </p>
            </header>

            {!hasData ? (
              <EmptyState
                title="no chart data"
                message="couldn't fetch this week's chart. might be a temporary last.fm blip or missing config."
              />
            ) : (
              <div className="space-y-10 sm:space-y-12 animate-slide-up">
                {/* spotlight trio */}
                <section>
                  <h2 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
                    this week&apos;s #1s
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-start">
                    {topArtist ? (
                      <SpotlightCard
                        label="#1 artist"
                        title={topArtist.name}
                        plays={parseInt(topArtist.playcount, 10) || 0}
                        image={topArtist.image}
                        href={topArtist.url}
                      />
                    ) : null}
                    {topAlbum ? (
                      <SpotlightCard
                        label="#1 album"
                        title={topAlbum.name}
                        subtitle={topAlbum.artist}
                        plays={parseInt(topAlbum.playcount, 10) || 0}
                        image={topAlbum.image}
                        href={topAlbum.url}
                      />
                    ) : null}
                    {topTrack ? (
                      <SpotlightCard
                        label="#1 track"
                        title={topTrack.name}
                        subtitle={topTrack.artist}
                        plays={parseInt(topTrack.playcount, 10) || 0}
                        image={topTrack.image}
                        href={topTrack.url}
                      />
                    ) : null}
                  </div>
                </section>

                {/* week numbers */}
                <section>
                  <h2 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
                    week at a glance
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      {
                        heading: "artists",
                        stats: [
                          {
                            label: "plays",
                            value: formatNumber(artistStats.totalPlays),
                          },
                          {
                            label: "artists",
                            value: formatNumber(artistStats.artistCount),
                          },
                        ],
                      },
                      {
                        heading: "albums",
                        stats: [
                          {
                            label: "plays",
                            value: formatNumber(albumTotal),
                          },
                          {
                            label: "albums",
                            value: formatNumber(albums.length),
                          },
                        ],
                      },
                      {
                        heading: "tracks",
                        stats: [
                          {
                            label: "plays",
                            value: formatNumber(trackTotal),
                          },
                          {
                            label: "tracks",
                            value: formatNumber(tracks.length),
                          },
                        ],
                      },
                    ].map((group) => (
                      <div
                        key={group.heading}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 text-center"
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/80 mb-4">
                          {group.heading}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {group.stats.map((stat) => (
                            <div key={stat.label} className="min-w-0">
                              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none tracking-tight">
                                {stat.value}
                              </p>
                              <p className="text-xs text-dark-400 mt-1.5 truncate">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* dense three lists */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      top artists
                    </h2>
                    <div className="space-y-0.5">
                      {artists.slice(0, 15).map((artist) => {
                        const plays = parseInt(artist.playcount, 10) || 0;
                        const sharePct =
                          artistPlayTotal > 0
                            ? (plays / artistPlayTotal) * 100
                            : 0;
                        const shareLabel =
                          sharePct > 0 && sharePct < 1
                            ? "<1% of plays"
                            : `${Math.round(sharePct)}% of plays`;
                        return (
                          <RankRow
                            key={`a-${artist.rank}-${artist.name}`}
                            rank={artist.rank}
                            title={artist.name}
                            subtitle={shareLabel}
                            plays={plays}
                            maxPlays={artistPlays[0] || 1}
                            image={artist.image}
                            href={artist.url}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      top albums
                    </h2>
                    <div className="space-y-0.5">
                      {albums.slice(0, 15).map((album) => (
                        <RankRow
                          key={`al-${album.rank}-${album.name}`}
                          rank={album.rank}
                          title={album.name}
                          subtitle={album.artist}
                          plays={parseInt(album.playcount, 10) || 0}
                          maxPlays={albumPlays[0] || 1}
                          image={album.image}
                          href={album.url}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      top tracks
                    </h2>
                    <div className="space-y-0.5">
                      {tracks.slice(0, 15).map((track) => (
                        <RankRow
                          key={`t-${track.rank}-${track.name}`}
                          rank={track.rank}
                          title={track.name}
                          subtitle={track.artist}
                          plays={parseInt(track.playcount, 10) || 0}
                          maxPlays={trackPlays[0] || 1}
                          image={track.image}
                          href={track.url}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* album cover strip — eye candy */}
                {albums.length > 0 ? (
                  <section>
                    <h2 className="text-sm uppercase tracking-wide text-dark-400 mb-5">
                      album covers
                    </h2>
                    <div className="relative -mx-4 sm:-mx-6">
                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-4 sm:px-6 [mask-image:linear-gradient(90deg,transparent_0%,#000_3rem,#000_calc(100%-3rem),transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_3rem,#000_calc(100%-3rem),transparent_100%)]">
                        <div className="shrink-0 w-2 sm:w-3" aria-hidden="true" />
                        {albums.slice(0, 20).map((album) => (
                          <a
                            key={`cover-${album.rank}-${album.name}`}
                            href={album.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 w-28 sm:w-32 group"
                            title={`${album.name} — ${album.artist}`}
                          >
                            <CoverImage
                              name={album.name}
                              image={album.image}
                              className="w-28 h-28 sm:w-32 sm:h-32 shadow-lg shadow-black/30 group-hover:scale-[1.03] transition-transform duration-300"
                              rounded="rounded-2xl"
                            />
                            <p className="mt-2 text-xs text-white truncate group-hover:text-pink-300 transition-colors">
                              {album.name}
                            </p>
                            <p className="text-[11px] text-dark-400 truncate">
                              {album.artist}
                            </p>
                          </a>
                        ))}
                        <div className="shrink-0 w-2 sm:w-3" aria-hidden="true" />
                      </div>
                    </div>
                  </section>
                ) : null}
              </div>
            )}

            <footer className="mt-20 sm:mt-24 lg:mt-32 pt-10 border-t border-white/10 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <Link
                    href="/"
                    className="text-pink-400 hover:text-pink-300 transition-colors duration-200 font-semibold"
                  >
                    ← back to recent tracks
                  </Link>
                  <Link
                    href="/me"
                    className="text-dark-300 hover:text-pink-300 transition-colors"
                  >
                    the numbers →
                  </Link>
                </div>
                <BuiltBy className="sm:justify-end" />
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
