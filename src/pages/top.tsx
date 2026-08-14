import { useMemo } from "react";
import { GetServerSideProps } from "next";
import {
  getChartTops,
  ChartArtistView,
  TopAlbumView,
  TopTrackView,
} from "@/lib/lastfm";
import EmptyState from "@/components/EmptyState";
import CoverImage from "@/components/CoverImage";
import DurationControl from "@/components/DurationControl";
import {
  DurationPendingProvider,
  useIsDurationPending,
} from "@/components/DurationPending";
import MetaTags from "@/components/MetaTags";
import PageShell, { PageFooterLinks } from "@/components/PageShell";
import { TopPeriodSkeleton } from "@/components/Skeleton";
import { RankRow, SpotlightCard } from "@/components/top/ChartCards";
import { formatNumber, getArtistChartStats } from "@/lib/dateUtils";
import {
  ChartPeriod,
  parsePeriod,
  durationControlLabel,
  periodTitleSuffix,
} from "@/lib/period";

type TopsPageProps = {
  artists: ChartArtistView[];
  albums: TopAlbumView[];
  tracks: TopTrackView[];
  period: ChartPeriod;
};

export const getServerSideProps: GetServerSideProps<TopsPageProps> = async (
  context
) => {
  const period = parsePeriod(context.query.period);
  try {
    const payload = await getChartTops(period);
    return {
      props: {
        artists: payload.artists,
        albums: payload.albums,
        tracks: payload.tracks,
        period,
      },
    };
  } catch (error) {
    console.error("SSR Error (top):", error);
    return {
      props: {
        artists: [],
        albums: [],
        tracks: [],
        period,
      },
    };
  }
};

function TopsBody({ artists, albums, tracks, period }: TopsPageProps) {
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

  const topArtist = artists[0];
  const topAlbum = albums[0];
  const topTrack = tracks[0];
  const hasData = artists.length > 0 || albums.length > 0 || tracks.length > 0;
  const artistPlayTotal = artistStats.totalPlays;
  const durationPending = useIsDurationPending();

  return (
    <div aria-busy={durationPending}>
      {durationPending ? (
        <TopPeriodSkeleton />
      ) : !hasData ? (
        <EmptyState
          title="no chart data"
          message="couldn't fetch chart data. might be a temporary last.fm blip or missing config."
        />
      ) : (
        <div className="space-y-10 sm:space-y-12 animate-slide-up">
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
              #1s · {periodTitleSuffix(period)}
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

          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
              at a glance
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
                    { label: "plays", value: formatNumber(albumTotal) },
                    {
                      label: "albums",
                      value: formatNumber(albums.length),
                    },
                  ],
                },
                {
                  heading: "tracks",
                  stats: [
                    { label: "plays", value: formatNumber(trackTotal) },
                    {
                      label: "tracks",
                      value: formatNumber(tracks.length),
                    },
                  ],
                },
              ].map((group) => (
                <div
                  key={group.heading}
                  className="panel px-4 py-5 text-center"
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

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                top artists
              </h2>
              <div className="space-y-0.5">
                {artists.slice(0, 15).map((artist) => {
                  const plays = parseInt(artist.playcount, 10) || 0;
                  const sharePct =
                    artistPlayTotal > 0 ? (plays / artistPlayTotal) * 100 : 0;
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
    </div>
  );
}

export default function TopsPage(props: TopsPageProps) {
  const pageTitle = "top artists, albums, and tracks";
  const periodLabel = durationControlLabel(props.period);

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={`top artists, albums, and tracks — currently showing ${periodLabel}.`}
        keywords="earworms, top charts, top artists, top albums, top tracks, music"
        path="/top"
      />
      <DurationPendingProvider period={props.period} pathname="/top">
        <PageShell
          nav={[
            { href: "/", label: "latest tracks", back: true },
            { href: "/me", label: "the numbers" },
          ]}
          header={
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {pageTitle}
              </h2>
              <DurationControl />
            </>
          }
          footer={
            <PageFooterLinks
              links={[
                { href: "/", label: "← back to recent tracks", primary: true },
                { href: "/me", label: "the numbers →" },
              ]}
            />
          }
        >
          <TopsBody {...props} />
        </PageShell>
      </DurationPendingProvider>
    </>
  );
}
