import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getWeeklyArtists, WeeklyArtist } from "@/lib/lastfm";
import MetaTags from "@/components/MetaTags";
import { formatNumber, getCurrentDate } from "@/lib/dateUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const getServerSideProps: GetServerSideProps = async () => {
  const artists = await getWeeklyArtists();

  return {
    props: {
      artists,
    },
  };
};

export default function ArtistsPage({
  artists: initialArtists,
}: {
  artists: WeeklyArtist[];
}) {
  const [artists, setArtists] = useState(initialArtists);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/artists`);
      if (response.ok) {
        const newArtists = await response.json();
        setArtists(newArtists);
        setLastUpdated(getCurrentDate());
      }
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Prepare data for charts
  const chartData = artists.slice(0, 10).map((artist) => ({
    name:
      artist.name.length > 15
        ? artist.name.substring(0, 15) + "..."
        : artist.name,
    fullName: artist.name,
    plays: parseInt(artist.playcount),
    rank: parseInt(artist["@attr"].rank),
  }));

  const pieData = artists.slice(0, 8).map((artist) => ({
    name: artist.name,
    value: parseInt(artist.playcount),
  }));

  const COLORS = [
    "#0ea5e9",
    "#d946ef",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
  ];

  return (
    <>
      <MetaTags
        title="My Music Obsessions"
        description="Judge my music taste! See which artists I've been obsessing over, discover my musical guilty pleasures, and laugh at my questionable listening habits. Charts and stats included!"
        keywords="music obsessions, artist rankings, music taste, guilty pleasures, music charts, listening habits, music statistics"
        ogTitle="My Music Obsessions | Judge My Taste"
        ogDescription="Judge my music taste! See which artists I've been obsessing over, discover my musical guilty pleasures, and laugh at my questionable listening habits."
        ogUrl="/artists"
        twitterTitle="My Music Obsessions | Judge My Taste"
        twitterDescription="Judge my music taste! See which artists I've been obsessing over, discover my musical guilty pleasures, and laugh at my questionable listening habits."
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

        <main className="relative z-10">
          <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
            {/* Header */}
            <header className="text-center mb-16 sm:mb-20 lg:mb-24 animate-fade-in">
              {/* Refresh Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isRefreshing
                      ? "bg-white/10 text-dark-400 cursor-not-allowed"
                      : "bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </button>
              </div>
            </header>

            {/* Charts Section */}
            <section className="animate-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Bar Chart */}
                <div className="glass-card p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Top 10 Artists
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          formatter={(value: any, name: string, props: any) => [
                            `${value} plays`,
                            props.payload.fullName,
                          ]}
                        />
                        <Bar
                          dataKey="plays"
                          fill="#0ea5e9"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="glass-card p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Top 8 Distribution
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} (${((percent as number) * 100).toFixed(
                              0
                            )}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          formatter={(value: any) => [
                            `${value} plays`,
                            "Plays",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Artist List */}
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Complete Ranking
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {artists.map((artist) => (
                    <div
                      key={artist.name}
                      className="glass-card p-4 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {artist["@attr"].rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {artist.name}
                          </h3>
                          <p className="text-sm text-dark-400">
                            {formatNumber(parseInt(artist.playcount))} plays
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Navigation */}
            <footer className="text-center mt-20 sm:mt-24 lg:mt-32 animate-fade-in">
              <div className="glass-card p-6 max-w-md mx-auto">
                <a
                  href="/"
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-200 font-semibold"
                >
                  ← Back to Recent Tracks
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
