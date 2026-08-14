import RecentTracksList from "@/components/RecentTracksList";
import EmptyState from "@/components/EmptyState";
import BuiltBy from "@/components/BuiltBy";
import PageShell from "@/components/PageShell";
import PaceSection from "@/components/PaceSection";
import { getRecentTracks, Track } from "@/lib/lastfm";
import {
  computeListeningDensity,
  type ListeningDensity,
} from "@/lib/listeningStats";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import MetaTags from "@/components/MetaTags";
import { formatTime, getCurrentDate } from "@/lib/dateUtils";

const DISPLAY_LIMIT = 51;
const SAMPLE_LIMIT = 200;

type HomeProps = {
  tracks: Track[];
  density: ListeningDensity | null;
};

type TracksPayload = {
  tracks: Track[];
  density: ListeningDensity | null;
};

function tracksSignature(tracks: Track[]): string {
  return tracks
    .map(
      (t) =>
        `${t.name}\0${t.artist?.["#text"] ?? ""}\0${t.date?.uts ?? "np"}\0${
          t["@attr"]?.nowplaying ?? ""
        }`
    )
    .join("\n");
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const recent = await getRecentTracks(SAMPLE_LIMIT);
    return {
      props: {
        tracks: recent.slice(0, DISPLAY_LIMIT),
        density: computeListeningDensity(recent),
      },
    };
  } catch (error) {
    console.error("SSR Error (index):", error);
    return {
      props: {
        tracks: [],
        density: null,
      },
    };
  }
};

export default function Home({
  tracks: initialTracks,
  density: initialDensity,
}: HomeProps) {
  const propsSig = tracksSignature(initialTracks);
  const [tracks, setTracks] = useState(initialTracks);
  const [density, setDensity] = useState(initialDensity);
  const [tracksSig, setTracksSig] = useState(propsSig);
  const [seenPropsSig, setSeenPropsSig] = useState(propsSig);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(getCurrentDate());
  const refreshingRef = useRef(false);

  // Sync from new SSR props (client navigation back to home)
  if (seenPropsSig !== propsSig) {
    setSeenPropsSig(propsSig);
    setTracks(initialTracks);
    setDensity(initialDensity);
    setTracksSig(propsSig);
  }

  const handleManualRefresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/tracks");
      if (response.ok) {
        const payload = (await response.json()) as TracksPayload;
        const nextSig = tracksSignature(payload.tracks);
        if (nextSig !== tracksSig) {
          setTracksSig(nextSig);
          setLastUpdated(getCurrentDate());
        }
        setTracks(payload.tracks);
        setDensity(payload.density);
      }
    } catch (error) {
      console.error("Failed to refresh tracks:", error);
    } finally {
      refreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, [tracksSig]);

  // Auto-refresh every 30s while the tab is visible
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "hidden") return;
      void handleManualRefresh();
    };
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [handleManualRefresh]);

  return (
    <>
      <MetaTags
        description="the songs that get stuck in my head. see what's currently spinning, what i've been obsessing over, and catch my musical guilty pleasures. live updates every 30 seconds."
        keywords="earworms, recently played, live music, current song, music obsession, guilty pleasures, music taste"
        path="/"
      />
      <PageShell
        brandLinksHome={false}
        width="wide"
        showCenterOrb
        nav={[
          { href: "/top", label: "top" },
          { href: "/me", label: "the numbers" },
        ]}
        header={
          <>
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
          </>
        }
        footer={
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10 sm:gap-12">
            <div className="flex flex-col gap-8 sm:gap-10 max-w-lg">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-dark-400 mb-2">
                  charts
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  top
                </h2>
                <p className="text-dark-300 text-sm sm:text-base mb-4">
                  artists, albums, and tracks that got stuck on repeat
                </p>
                <Link
                  href="/top"
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
        }
      >
        <section className="animate-slide-up">
          {tracks.length === 0 ? (
            <EmptyState
              title="no recent tracks"
              message="couldn't fetch recent tracks. might be a temporary last.fm blip or missing config."
              actionLabel="try refresh"
              onAction={handleManualRefresh}
            />
          ) : (
            <>
              <RecentTracksList tracks={tracks} />
              <PaceSection density={density} />
            </>
          )}
        </section>
      </PageShell>
    </>
  );
}
