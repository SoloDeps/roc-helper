import { Skeleton } from "@/components/ui/skeleton";

export function HeritageVaultSkeleton() {
  return (
    <div className="container-wrapper flex min-h-0 flex-1">
      <div className="mx-auto w-full max-w-350 lg:pt-4">
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[0, 1].map((card) => (
            <div
              key={card}
              className="flex h-30 flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <Skeleton className="h-5 w-44" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="mb-6 flex gap-2">
          {[0, 1].map((tab) => (
            <Skeleton key={tab} className="h-8 w-28 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            {[0, 1].map((block) => (
              <div key={block} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
