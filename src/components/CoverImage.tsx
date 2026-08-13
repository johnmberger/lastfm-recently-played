import { useState } from "react";

const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

type CoverImageProps = {
  name: string;
  image: string;
  className?: string;
  rounded?: string;
};

/** Cover/artist art with shimmer while loading and letter fallback. */
export default function CoverImage({
  name,
  image,
  className = "w-12 h-12",
  rounded = "rounded-xl",
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isPlaceholder = !image || image.includes(PLACEHOLDER);
  const showFallback = isPlaceholder || failed;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (showFallback) {
    return (
      <div
        className={`${className} ${rounded} bg-gradient-to-br from-pink-500/40 via-purple-500/40 to-blue-500/40 flex items-center justify-center text-white font-bold shrink-0`}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={`${className} ${rounded} relative overflow-hidden shrink-0 bg-dark-800`}>
      {!loaded && (
        <div className="absolute inset-0 animate-cover-shimmer" aria-hidden="true" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  );
}
