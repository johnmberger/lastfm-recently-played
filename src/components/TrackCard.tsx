"use client";
import { Track } from "@/lib/lastfm";
import { useState } from "react";
import { formatTrackDate } from "@/lib/dateUtils";

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const albumArtUrl =
    track.image.find((img) => img.size === "extralarge")?.["#text"] ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23374155'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

  const isNowPlaying = track["@attr"]?.nowplaying === "true";

  return (
    <div
      className={`group apple-glass-card perspective-1000 h-full flex flex-col transition-all duration-700 ease-out ${
        isNowPlaying
          ? "ring-2 ring-accent-500/30 shadow-2xl shadow-accent-500/10"
          : ""
      } ${isHovered ? "apple-glass-hover" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-3xl">
        {/* Liquid Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10"></div>

        {/* Subtle Light Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out z-10"></div>

        {/* Album Art */}
        <div className="relative w-full h-full">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800/80 to-dark-700/80 backdrop-blur-sm animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse backdrop-blur-md"></div>
            </div>
          )}
          <img
            src={albumArtUrl}
            alt={`${track.name} album art`}
            className={`object-cover w-full h-full transition-all duration-700 ease-out ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            } ${isHovered ? "scale-[1.02]" : "scale-100"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>

        {/* External Link Icon */}
        <div
          className={`absolute top-4 right-4 transition-all duration-500 ease-out ${
            isHovered
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-90"
          } z-20`}
        >
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 ease-out"
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

      {/* Content */}
      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        {/* Track Name */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white text-xl leading-tight line-clamp-2 group-hover:text-white/90 transition-all duration-500 ease-out">
            {track.name}
          </h3>
          <p className="text-white/70 text-sm font-medium line-clamp-1 group-hover:text-white/80 transition-all duration-500 ease-out">
            {track.artist["#text"]}
          </p>
          {track.album["#text"] && (
            <p className="text-white/50 text-xs line-clamp-1 group-hover:text-white/60 transition-all duration-500 ease-out">
              {track.album["#text"]}
            </p>
          )}
        </div>

        {/* Date and Now Playing */}
        <div className="flex items-center justify-between">
          {track.date?.uts && (
            <div className="flex items-center gap-2 text-xs text-white/40 group-hover:text-white/60 transition-all duration-500 ease-out">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full group-hover:bg-white/80 transition-all duration-500 ease-out"></div>
              <span>{formatTrackDate(track.date.uts)}</span>
            </div>
          )}

          {isNowPlaying && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 flex items-end justify-center">
                  <div className="flex items-end gap-0.5">
                    <div className="w-0.5 bg-white rounded-full animate-eq-bar-1"></div>
                    <div className="w-0.5 bg-white rounded-full animate-eq-bar-2"></div>
                    <div className="w-0.5 bg-white rounded-full animate-eq-bar-3"></div>
                    <div className="w-0.5 bg-white rounded-full animate-eq-bar-4"></div>
                  </div>
                </div>
                <span>NOW PLAYING</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
