import RecentTracksList from "@/components/RecentTracksList";
import EmptyState from "@/components/EmptyState";
import EarwormLogo from "@/components/EarwormLogo";
import BuiltBy from "@/components/BuiltBy";
import { getRecentTracks, Track } from "@/lib/lastfm";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import MetaTags from "@/components/MetaTags";
import { formatTime, getCurrentDate } from "@/lib/dateUtils";

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tracks = await getRecentTracks();
    return {
      props: {
        tracks,
      },
    };
  } catch (error) {
    console.error("SSR Error (index):", error);
    return {
      props: {
        tracks: [],
      },
    };
  }
};

export default function Home({ tracks: initialTracks }: { tracks: Track[] }) {
  const [tracks, setTracks] = useState(initialTracks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(getCurrentDate());

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/tracks");
      if (response.ok) {
        const newTracks = await response.json();
        setTracks(newTracks);
        setLastUpdated(getCurrentDate());
      }
    } catch (error) {
      console.error("Failed to refresh tracks:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleManualRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update tracks when props change (after refresh)
  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);
  return (
    <>
      <MetaTags
        description="the songs that get stuck in my head. see what's currently spinning, what i've been obsessing over, and catch my musical guilty pleasures. live updates every 30 seconds."
        keywords="earworms, recently played, live music, current song, music obsession, guilty pleasures, music taste"
        ogTitle="earworms"
        ogDescription="the songs that get stuck in my head. see what's currently spinning, what i've been obsessing over, and catch my musical guilty pleasures."
        ogUrl="/"
        twitterTitle="earworms"
        twitterDescription="the songs that get stuck in my head. see what's currently spinning, what i've been obsessing over, and catch my musical guilty pleasures."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/25 via-pink-500/20 to-red-500/25 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <main className="relative z-10">
          <div className="container mx-auto px-4 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
            {/* Tracks Section */}
            <section className="animate-slide-up">
              <div className="mb-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-none bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      earworms
                    </h1>
                    <EarwormLogo
                      size="md"
                      crawling={false}
                      className="shrink-0"
                    />
                  </div>
                  <nav className="hidden md:flex items-center gap-4 shrink-0 mt-2 lg:mt-3 text-sm">
                    <Link
                      href="/top-this-week"
                      className="inline-flex items-center gap-1.5 text-dark-300 hover:text-pink-300 transition-colors group"
                    >
                      top this week
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
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
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    latest tracks
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-dark-400 shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRefreshing
                          ? "bg-pink-500 animate-pulse"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span>live</span>
                    <button
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 disabled:opacity-50"
                      title="refresh tracks"
                    >
                      <svg
                        className={`w-4 h-4 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-dark-400">
                  discover what i&apos;ve been listening to
                </p>
                <div className="text-xs text-dark-500 mt-1">
                  last updated: {formatTime(lastUpdated)}
                </div>
              </div>

              {tracks.length === 0 ? (
                <EmptyState
                  title="no recent tracks"
                  message="couldn't fetch recent tracks. might be a temporary last.fm blip or missing config."
                  actionLabel="try refresh"
                  onAction={handleManualRefresh}
                />
              ) : (
                <RecentTracksList tracks={tracks} />
              )}
            </section>

            <footer className="mt-20 sm:mt-24 lg:mt-28 pt-10 border-t border-white/10 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10 sm:gap-12">
                <div className="flex flex-col gap-8 sm:gap-10 max-w-lg">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-dark-400 mb-2">
                      charts
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      top this week
                    </h2>
                    <p className="text-dark-300 text-sm sm:text-base mb-4">
                      artists, albums, and tracks that got stuck on repeat this
                      week
                    </p>
                    <Link
                      href="/top-this-week"
                      className="inline-flex items-center gap-2 text-pink-300 hover:text-pink-200 transition-colors font-semibold group"
                    >
                      see the full rankings
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-dark-400 mb-2">
                      stats
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      the numbers
                    </h2>
                    <p className="text-dark-300 text-sm sm:text-base mb-4">
                      how the week stacked up — and how long i&apos;ve been at
                      this.
                    </p>
                    <Link
                      href="/me"
                      className="inline-flex items-center gap-2 text-pink-300 hover:text-pink-200 transition-colors font-semibold group"
                    >
                      dig into the stats
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
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
