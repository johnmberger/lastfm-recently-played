import RecentTracksList from "@/components/RecentTracksList";
import { getRecentTracks, Track } from "@/lib/lastfm";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import MetaTags from "@/components/MetaTags";
import { formatTime, getCurrentDate } from "@/lib/dateUtils";

export const getServerSideProps: GetServerSideProps = async () => {
  const tracks = await getRecentTracks();
  return {
    props: {
      tracks,
    },
  };
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
        title="What Is John Listening To?"
        description="Stalk my music in real-time! See what's currently spinning, what I've been obsessed with lately, and catch me in my musical guilty pleasures. Live updates every 30 seconds!"
        keywords="what is john listening to, music stalking, live music, current song, music obsession, guilty pleasures, music taste"
        ogTitle="What Is John Listening To? | Music Stalking Made Easy"
        ogDescription="Stalk my music in real-time! See what's currently spinning, what I've been obsessed with lately, and catch me in my musical guilty pleasures."
        ogUrl="/"
        twitterTitle="What Is John Listening To? | Stalking John Made Easy"
        twitterDescription="Stalk my music in real-time! See what's currently spinning, what I've been obsessed with lately, and catch me in my musical guilty pleasures."
      />
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <main className="relative z-10">
          <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
            {/* Tracks Section */}
            <section className="animate-slide-up">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Latest Tracks
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRefreshing
                          ? "bg-accent-500 animate-pulse"
                          : "bg-primary-500"
                      }`}
                    ></div>
                    <span>Live</span>
                    <button
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="text-primary-400 hover:text-primary-300 transition-colors duration-200 disabled:opacity-50"
                      title="Refresh tracks"
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
                  Discover what's been spinning on my playlist
                </p>
                <div className="text-xs text-dark-500 mt-1">
                  Last updated: {formatTime(lastUpdated)}
                </div>
              </div>

              <RecentTracksList tracks={tracks} />
            </section>

            {/* Navigation */}
            <div className="text-center mt-20 sm:mt-24 lg:mt-32 animate-fade-in">
              <div className="glass-card p-6 max-w-md mx-auto mb-8">
                <a
                  href="/artists"
                  className="text-accent-400 hover:text-accent-300 transition-colors duration-200 font-semibold text-lg"
                >
                  View Top Artists →
                </a>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center animate-fade-in">
              <div className="glass-card p-6 max-w-md mx-auto">
                <p className="text-dark-300 text-sm">
                  Built with{" "}
                  <span className="text-primary-400 font-semibold">
                    Next.js
                  </span>
                  ,{" "}
                  <span className="text-accent-400 font-semibold">
                    Tailwind CSS
                  </span>
                  , and the{" "}
                  <span className="text-primary-400 font-semibold">
                    Last.fm API
                  </span>
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
