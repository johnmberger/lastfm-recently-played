type SkeletonProps = {
  className?: string;
};

/** Shimmer bone for period-change loading states. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-cover-shimmer rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}
