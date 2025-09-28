import { Track } from '@/lib/lastfm';
import TrackCard from './TrackCard';

export default function RecentTracksList({ tracks }: { tracks: Track[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track, index) => (
        <TrackCard key={`${track.date?.uts || index}-${track.name}`} track={track} />
      ))}
    </div>
  );
}
