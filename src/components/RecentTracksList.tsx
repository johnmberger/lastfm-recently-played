'use client';

import { getRecentTracks, Track } from '@/lib/lastfm';
import { useEffect, useState } from 'react';
import TrackCard from './TrackCard';

export default function RecentTracksList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const recentTracks = await getRecentTracks();
        setTracks(recentTracks);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (isLoading) {
    return <p className="text-center text-neutral-400">Loading recent tracks...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track, index) => (
        <TrackCard key={`${track.date?.uts || index}-${track.name}`} track={track} />
      ))}
    </div>
  );
}
