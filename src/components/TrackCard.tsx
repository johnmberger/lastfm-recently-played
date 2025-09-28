'use client';
import { Track } from '@/lib/lastfm';
import Image from 'next/image';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const albumArtUrl = track.image.find(img => img.size === 'extralarge')?.['#text'] || '/placeholder.png';

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative aspect-square">
        <Image 
          src={albumArtUrl} 
          alt={`${track.name} album art`} 
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <a href={track.url} target="_blank" rel="noopener noreferrer" className="block">
          <p className="font-bold text-white truncate">{track.name}</p>
          <p className="text-neutral-400 truncate">{track.artist['#text']}</p>
        </a>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="py-2 flex justify-between w-full text-left text-sm font-medium text-neutral-400 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Album: {track.album['#text']}</span>
                <ChevronUpIcon
                  className={`${ open ? '' : 'transform rotate-180'} h-5 w-5 text-purple-500 transition-transform duration-200`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="text-sm text-neutral-500">
                {track.album['#text']}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
