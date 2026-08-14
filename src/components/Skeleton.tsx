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

function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`panel px-4 py-5 sm:px-5 sm:py-6 ${className}`}
    >
      <Skeleton className="h-2.5 w-16 mb-4" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

function SkeletonRankRow() {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Skeleton className="h-4 w-5 shrink-0" />
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-[70%]" />
        <Skeleton className="h-2.5 w-[40%]" />
      </div>
      <Skeleton className="h-3 w-8 shrink-0" />
    </div>
  );
}

export function MePeriodSkeleton() {
  return (
    <section aria-hidden="true">
      <Skeleton className="h-3 w-24 mb-4 sm:mb-5" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="panel px-4 py-5 sm:px-5 sm:py-6">
          <Skeleton className="h-2.5 w-14 mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-10" />
            </div>
            <div>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-2 w-full rounded-full mb-3" />
          <div className="space-y-2 mb-3">
            <div className="flex justify-between gap-3">
              <Skeleton className="h-3.5 w-[85%]" />
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
            <div className="flex justify-between gap-3">
              <Skeleton className="h-3.5 w-[70%]" />
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
            <div className="flex justify-between gap-3">
              <Skeleton className="h-3.5 w-[55%]" />
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
            <div className="flex justify-between gap-3">
              <Skeleton className="h-3.5 w-[45%]" />
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
            <div className="flex justify-between gap-3">
              <Skeleton className="h-3.5 w-[35%]" />
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
          </div>
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="panel px-4 py-5 sm:px-5 sm:py-6">
          <Skeleton className="h-2.5 w-20 mb-1" />
          <Skeleton className="h-3 w-32 mb-4" />
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[50%]" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[65%]" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TopPeriodSkeleton() {
  return (
    <div className="space-y-10 sm:space-y-12" aria-hidden="true">
      <section>
        <Skeleton className="h-3 w-36 mb-4 sm:mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="panel px-3 py-4 sm:px-4 sm:py-5 flex flex-col items-center"
            >
              <Skeleton className="w-40 h-40 sm:w-44 sm:h-44 rounded-xl mb-3" />
              <Skeleton className="h-2.5 w-16 mb-2" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="h-3 w-24 mb-4 sm:mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
        {[0, 1, 2].map((col) => (
          <div key={col}>
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="space-y-0.5">
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonRankRow key={i} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
