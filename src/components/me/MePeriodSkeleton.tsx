import { Skeleton } from "@/components/shared/Skeleton";

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
