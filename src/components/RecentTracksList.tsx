import { Track } from "@/lib/lastfm";
import TrackCard from "./TrackCard";

function trackKey(track: Track, index: number): string {
  const artist = track.artist?.["#text"] ?? "";
  const uts = track.date?.uts;
  if (uts) return `${uts}-${artist}-${track.name}`;
  // now-playing (and anything without a timestamp) — stable across refreshes
  return `np-${artist}-${track.name}-${index}`;
}

export default function RecentTracksList({ tracks }: { tracks: Track[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {tracks.map((track, index) => (
        <div
          key={trackKey(track, index)}
          className="animate-scale-in"
          style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
        >
          <TrackCard track={track} />
        </div>
      ))}
    </div>
  );
}
