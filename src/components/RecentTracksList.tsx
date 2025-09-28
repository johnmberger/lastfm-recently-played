import { Track } from "@/lib/lastfm";
import TrackCard from "./TrackCard";

export default function RecentTracksList({ tracks }: { tracks: Track[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {tracks.map((track, index) => (
        <div
          key={`${track.date?.uts || index}-${track.name}`}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TrackCard track={track} />
        </div>
      ))}
    </div>
  );
}
