"use client";
import { Track } from "@/lib/lastfm";
import Image from "next/image";
import { useState } from "react";

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const albumArtUrl =
    track.image.find((img) => img.size === "large")?.["#text"] ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23374155'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

  const isNowPlaying = track["@attr"]?.nowplaying === "true";

  const formatDate = (uts: string) => {
    const date = new Date(parseInt(uts) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`group glass-card glass-card-hover card-hover perspective-1000 h-full flex flex-col ${
        isNowPlaying
          ? "ring-2 ring-accent-500/50 shadow-2xl shadow-accent-500/20"
          : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

        {/* Album Art */}
        <div className="relative w-full h-full">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-700 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-dark-600 rounded-full animate-pulse"></div>
            </div>
          )}
          <img
            src={albumArtUrl}
            alt={`${track.name} album art`}
            className={`object-cover w-full h-full transition-all duration-500 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            } ${isHovered ? "scale-105" : "scale-100"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          } z-20`}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Now Playing Badge */}
        {isNowPlaying && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                <span>NOW PLAYING</span>
              </div>
            </div>
          </div>
        )}

        {/* External Link Icon */}
        <div
          className={`absolute top-3 right-3 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } z-20`}
        >
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors duration-200"
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
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        {/* Track Name */}
        <div className="space-y-1">
          <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-primary-300 transition-colors duration-200">
            {track.name}
          </h3>
          <p className="text-dark-300 text-sm font-medium line-clamp-1">
            {track.artist["#text"]}
          </p>
          {track.album["#text"] && (
            <p className="text-dark-400 text-xs line-clamp-1">
              {track.album["#text"]}
            </p>
          )}
        </div>

        {/* Date */}
        {track.date?.uts && (
          <div className="flex items-center gap-2 text-xs text-dark-400">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
            <span>{formatDate(track.date.uts)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
