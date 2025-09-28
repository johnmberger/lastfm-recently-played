"use client";
import { Track } from "@/lib/lastfm";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const albumArtUrl =
    track.image.find((img) => img.size === "large")?.["#text"] ||
    "/placeholder.png";

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative aspect-square">
        <img
          src={albumArtUrl}
          alt={`${track.name} album art`}
          className="object-cover"
          height={200}
          width={200}
        />
      </div>
      <div className="p-4">
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <p className="font-bold text-white truncate">{track.name}</p>
          <p className="text-neutral-400 truncate">{track.artist["#text"]}</p>
        </a>
      </div>
    </div>
  );
}
