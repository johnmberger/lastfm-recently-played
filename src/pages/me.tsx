import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { getListeningStats, ListeningStats } from "@/lib/lastfm";
import EarwormLogo from "@/components/EarwormLogo";
import BuiltBy from "@/components/BuiltBy";
import PeriodControl from "@/components/PeriodControl";
import MetaTags from "@/components/MetaTags";
import EmptyState from "@/components/EmptyState";
import { MePeriodSkeleton } from "@/components/Skeleton";
import { formatNumber } from "@/lib/dateUtils";
import {
  parsePeriod,
  periodControlLabel,
  periodTitleSuffix,
} from "@/lib/period";

type StatsPageProps = {
  stats: ListeningStats;
};

export const getServerSideProps: GetServerSideProps<StatsPageProps> = async (
  context
) => {
  const period = parsePeriod(context.query.period);
  try {
    const stats = await getListeningStats(period);
    return { props: { stats } };
  } catch (error) {
    console.error("SSR Error (me):", error);
    return {
      props: {
        stats: {
          profile: null,
          accountAgeYears: null,
          accountAgeLabel: null,
          depth: null,
          overlap: null,
          density: null,
          period,
          periodLabel: periodControlLabel(period),
        },
      },
    };
  }
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 sm:px-5 sm:py-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/80 mb-3">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-tight tracking-tight break-words">
        {value}
      </p>
      {hint ? (
        <p className="text-xs text-dark-400 mt-2 leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}

function densityDelta(today: number, yesterday: number): string {
  if (today === yesterday) return "same as yesterday";
  if (today > yesterday) {
    const n = today - yesterday;
    return `+${n} vs yesterday`;
  }
  const n = yesterday - today;
  return `−${n} vs yesterday`;
}

function depthVibe(playsPerArtist: number): string {
  if (playsPerArtist >= 8) return "deep in the loop";
  if (playsPerArtist >= 4) return "a healthy amount of repeat";
  if (playsPerArtist >= 2) return "mixing it up";
  return "lots of variety";
}

function registeredLabel(unix: number): string {
  return new Date(unix * 1000)
    .toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    .toLowerCase();
}

export default function StatsPage({ stats }: StatsPageProps) {
  const {
    profile,
    accountAgeLabel,
    depth,
    overlap,
    density,
    period,
  } = stats;

  const hasAnything =
    Boolean(profile) ||
    Boolean(depth) ||
    Boolean(overlap) ||
    Boolean(density);

  const rangeLabel = periodTitleSuffix(period);
  const [periodPending, setPeriodPending] = useState(false);

  return (
    <>
      <MetaTags
        title="the numbers"
        description="how things stack up — and how long i've been at this."
        keywords="earworms, listening stats, scrobbles, music stats"
        ogTitle="the numbers | earworms"
        ogDescription="how things stack up — and how long i've been at this."
        ogUrl="/me"
        twitterTitle="the numbers | earworms"
        twitterDescription="how things stack up — and how long i've been at this."
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
                    href="/top"
                    className="inline-flex items-center gap-1.5 text-dark-300 hover:text-pink-300 transition-colors group"
                  >
                    top
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
                the numbers
              </h2>
              <p className="text-dark-400 text-sm sm:text-base mb-4">
                how things stack up — and how long i&apos;ve been at this.
              </p>
              <PeriodControl
                period={period}
                pathname="/me"
                onPendingChange={setPeriodPending}
              />
            </header>

            <div aria-busy={periodPending}>
            {!hasAnything ? (
              <EmptyState
                title="no stats yet"
                message="couldn't pull listening stats from last.fm right now."
              />
            ) : (
              <div className="space-y-10 sm:space-y-12 animate-slide-up">
                {periodPending ? (
                  <MePeriodSkeleton />
                ) : (
                <section>
                  <h3 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
                    {rangeLabel}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {depth ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 sm:px-5 sm:py-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/80 mb-4">
                          depth
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                              {formatNumber(depth.totalPlays)}
                            </p>
                            <p className="text-xs text-dark-400 mt-1.5">
                              plays
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                              {formatNumber(depth.uniqueArtists)}
                            </p>
                            <p className="text-xs text-dark-400 mt-1.5">
                              artists
                            </p>
                          </div>
                        </div>

                        {depth.leaders.length > 0 ? (
                          <>
                            <div className="flex h-2 rounded-full overflow-hidden bg-white/5 mb-3">
                              {depth.leaders.map((leader, i) => {
                                const tones = [
                                  "bg-pink-400",
                                  "bg-purple-400",
                                  "bg-blue-400",
                                  "bg-cyan-400",
                                  "bg-violet-300",
                                ];
                                return (
                                  <div
                                    key={leader.name}
                                    className={`${tones[i % tones.length]} min-w-[2px]`}
                                    style={{
                                      width: `${Math.max(leader.sharePercent, 1)}%`,
                                    }}
                                    title={`${leader.name} · ${leader.sharePercent}%`}
                                  />
                                );
                              })}
                              {depth.leadersSharePercent < 100 ? (
                                <div
                                  className="bg-white/10 min-w-[2px] flex-1"
                                  title="everyone else"
                                />
                              ) : null}
                            </div>
                            <ul className="space-y-1.5 mb-3">
                              {depth.leaders.map((leader, i) => {
                                const tones = [
                                  "bg-pink-400",
                                  "bg-purple-400",
                                  "bg-blue-400",
                                  "bg-cyan-400",
                                  "bg-violet-300",
                                ];
                                return (
                                  <li
                                    key={leader.name}
                                    className="flex items-baseline justify-between gap-3 text-sm"
                                  >
                                    <span className="flex items-center gap-2 min-w-0 text-white/90">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${tones[i % tones.length]}`}
                                      />
                                      <span className="truncate">
                                        {leader.name}
                                      </span>
                                    </span>
                                    <span className="text-xs text-dark-400 tabular-nums shrink-0">
                                      {leader.sharePercent}%
                                      <span className="text-dark-500 hidden sm:inline">
                                        {" "}
                                        · {formatNumber(leader.plays)}
                                      </span>
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                            <p className="text-xs text-dark-400">
                              top {depth.leaders.length} ={" "}
                              {depth.leadersSharePercent}% of plays ·{" "}
                              {depth.playsPerArtist} plays / artist ·{" "}
                              {depthVibe(depth.playsPerArtist)}
                            </p>
                          </>
                        ) : null}
                      </div>
                    ) : (
                      <StatCard label="depth" value="—" />
                    )}

                    {overlap && overlap.items.length > 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 sm:px-5 sm:py-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/80 mb-1">
                          earworms
                        </p>
                        <p className="text-xs text-dark-500 mb-4">
                          on more than one chart
                        </p>
                        <ul className="space-y-3">
                          {overlap.items.map((hit) => {
                            const pieces = [
                              ...hit.albums.map((a) => a.name),
                              ...hit.tracks.map((t) => t.name),
                            ];
                            return (
                              <li key={hit.artist} className="min-w-0">
                                <p className="font-semibold text-white truncate">
                                  {hit.artist}
                                </p>
                                {pieces.length > 0 ? (
                                  <p className="text-xs text-dark-300 truncate mt-0.5">
                                    {pieces.join(" · ")}
                                  </p>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 sm:px-5 sm:py-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/80 mb-3">
                          earworms
                        </p>
                        <p className="text-sm text-dark-300">
                          nothing stuck across charts for this window.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
                )}

                <section>
                  <h3 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
                    lifetime
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <StatCard
                      label="scrobbles"
                      value={
                        profile ? formatNumber(profile.playcount) : "—"
                      }
                      hint="everything last.fm has counted so far"
                    />
                    <StatCard
                      label="listening for"
                      value={accountAgeLabel ?? "—"}
                      hint={
                        profile?.registeredUnix
                          ? `since ${registeredLabel(profile.registeredUnix)}`
                          : undefined
                      }
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-sm uppercase tracking-[0.18em] text-dark-400 mb-4 sm:mb-5">
                    density
                  </h3>
                  <p className="text-xs text-dark-500 -mt-2 mb-4">
                    always from recent scrobbles — not the chart window above
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <StatCard
                      label="today"
                      value={density ? formatNumber(density.today) : "—"}
                      hint={
                        density
                          ? densityDelta(density.today, density.yesterday)
                          : undefined
                      }
                    />
                    <StatCard
                      label="yesterday"
                      value={
                        density ? formatNumber(density.yesterday) : "—"
                      }
                      hint="scrobbles yesterday"
                    />
                    <StatCard
                      label="recent daily avg"
                      value={
                        density
                          ? formatNumber(density.recentDailyAvg)
                          : "—"
                      }
                      hint={
                        density
                          ? `from the last ${formatNumber(density.samplePlays)} scrobbles across ${density.sampleDays} day${density.sampleDays === 1 ? "" : "s"}`
                          : undefined
                      }
                    />
                  </div>
                </section>
              </div>
            )}
            </div>

            <footer className="mt-20 sm:mt-24 lg:mt-32 pt-10 border-t border-white/10 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <Link
                    href="/"
                    className="text-pink-400 hover:text-pink-300 transition-colors font-semibold"
                  >
                    ← latest tracks
                  </Link>
                  <Link
                    href="/top"
                    className="text-dark-300 hover:text-pink-300 transition-colors"
                  >
                    top →
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
