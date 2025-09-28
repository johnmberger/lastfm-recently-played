import RecentTracksList from "@/components/RecentTracksList";
import { getRecentTracks, Track } from "@/lib/lastfm";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";

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
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/tracks");
      if (response.ok) {
        const newTracks = await response.json();
        setTracks(newTracks);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to refresh tracks:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleManualRefresh();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Update tracks when props change (after refresh)
  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);
  return (
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
          {/* Header Section */}
          <header className="text-center mb-16 sm:mb-20 lg:mb-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mb-6 animate-glow">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text text-shadow-lg">
                Recently Played
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
              A curated glimpse into my musical journey, powered by{" "}
              <span className="text-primary-400 font-semibold">Last.fm</span>{" "}
              and crafted with modern web technologies.
            </p>

            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-dark-400">
              <div
                className={`w-2 h-2 rounded-full ${
                  isRefreshing
                    ? "bg-accent-500 animate-pulse"
                    : "bg-primary-500"
                }`}
              ></div>
              <span>Live from Last.fm</span>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="ml-2 text-primary-400 hover:text-primary-300 transition-colors duration-200 disabled:opacity-50"
                title="Refresh tracks"
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
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
            <div className="text-xs text-dark-500 mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </header>

          {/* Tracks Section */}
          <section className="animate-slide-up">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Latest Tracks
              </h2>
              <p className="text-dark-400">
                Discover what's been spinning on my playlist
              </p>
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
                <span className="text-primary-400 font-semibold">Next.js</span>,{" "}
                <span className="text-accent-400 font-semibold">
                  Tailwind CSS
                </span>
                , and the{" "}
                <span className="text-primary-400 font-semibold">
                  Last.fm API
                </span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-400 transition-colors duration-200"
                >
                  Next.js
                </a>
                <span className="text-dark-600">•</span>
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-accent-400 transition-colors duration-200"
                >
                  Tailwind CSS
                </a>
                <span className="text-dark-600">•</span>
                <a
                  href="https://last.fm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-400 transition-colors duration-200"
                >
                  Last.fm
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
