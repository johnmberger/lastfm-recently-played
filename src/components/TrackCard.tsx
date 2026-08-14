import { Track } from "@/lib/lastfm";
import CoverImage from "@/components/CoverImage";
import { formatTrackDate } from "@/lib/dateUtils";

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const albumArtUrl =
    track.image.find((img) => img.size === "extralarge")?.["#text"] || "";

  const isNowPlaying = track["@attr"]?.nowplaying === "true";

  return (
    <div
      className={`group track-card h-full flex flex-col ${
        isNowPlaying
          ? "ring-2 ring-pink-500/40 shadow-2xl shadow-pink-500/20"
          : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out z-10" />

        <CoverImage
          name={track.name}
          image={albumArtUrl}
          alt={`${track.name} album art`}
          className="w-full h-full text-5xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          rounded="rounded-none"
        />

        <div className="absolute top-4 right-4 z-20 opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-out">
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-110 transition-all duration-300 ease-out md:backdrop-blur-xl"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-semibold text-white text-xl leading-tight line-clamp-2 group-hover:text-pink-300 transition-all duration-500 ease-out">
            {track.name}
          </h3>
          <p className="text-blue-200 text-sm font-medium line-clamp-1 group-hover:text-blue-100 transition-all duration-500 ease-out">
            {track.artist["#text"]}
          </p>
          {track.album["#text"] ? (
            <p className="text-purple-200 text-xs line-clamp-1 group-hover:text-purple-100 transition-all duration-500 ease-out">
              {track.album["#text"]}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          {track.date?.uts ? (
            <div className="flex items-center gap-2 text-xs text-cyan-300 group-hover:text-cyan-200 transition-all duration-500 ease-out">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-all duration-500 ease-out" />
              <span>{formatTrackDate(track.date.uts)}</span>
            </div>
          ) : null}

          {isNowPlaying ? (
            <div className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg md:backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <div className="eq-bars" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <span>now playing</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
