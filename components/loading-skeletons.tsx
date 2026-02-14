import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour un accordion item (building, techno, area, etc.)
 */
export function AccordionItemSkeleton() {
  return (
    <div className="rounded-md border bg-background-200 py-1 border-alpha-300">
      <div className="flex justify-between items-center gap-3 p-2 md:px-4 h-14 md:h-12">
        {/* Left side: chevron + title */}
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-4 w-4 shrink-0" />
          <div className="flex flex-col md:flex-row gap-1 md:gap-2 flex-1">
            <Skeleton className="h-4 w-24 md:w-32" />
            <Skeleton className="hidden md:block h-4 w-20" />
          </div>
        </div>

        {/* Right side: badges */}
        <div className="flex gap-1.5 items-center shrink-0">
          <Skeleton className="h-6 md:h-7 w-[60px] md:w-20 rounded-sm" />
          <Skeleton className="hidden md:block h-7 w-20 rounded-sm" />
          <Skeleton className="md:hidden h-7 w-14" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour la liste complète d'items
 */
export function ItemListSkeleton() {
  return (
    <div className="space-y-4 py-3 px-2 pb-28 md:p-3">
      <div className="space-y-2">
        {/* Simulate 4-6 accordion items */}
        {Array.from({ length: 5 }).map((_, i) => (
          <AccordionItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton pour un resource block
 */
export function ResourceBlockSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <section className="rounded-sm overflow-hidden border">
      {/* Header */}
      <div className="py-1 px-2 border-b bg-background-300">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Items grid */}
      <div className={`grid grid-cols-${itemCount} bg-background-300`}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="flex items-center h-[60px] gap-2 px-1 md:px-2 py-1.5">
            <Skeleton className="h-7 md:h-8 w-7 md:w-8 shrink-0" />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Skeleton pour le panneau Total Resources
 */
export function TotalResourcesSkeleton() {
  return (
    <div className="px-2 py-4 md:p-4 mb-4 md:mb-16 max-w-[870px] mx-auto space-y-3">
      {/* Main resources block */}
      <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-1 2xl:grid-cols-6 gap-3">
        <div className="col-span-4 md:col-start-2 xl:col-start-1 2xl:col-start-2">
          <ResourceBlockSkeleton itemCount={3} />
        </div>
      </div>

      {/* Era blocks + Other goods */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
        {/* Left column: Era blocks */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ResourceBlockSkeleton key={`era-${i}`} itemCount={3} />
          ))}
        </div>

        {/* Right column: Other goods */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ResourceBlockSkeleton key={`other-${i}`} itemCount={3} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour la page entière (si nécessaire)
 */
export function PageSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper gap-4">
      {/* LEFT PANEL - Total Resources (Desktop only) */}
      <aside className="sticky top-0 hidden origin-left xl:block mb-2 material-medium 2xl:w-6/11 lg:w-5/11 overflow-hidden">
        <header className="flex shrink-0 flex-col w-full transition-colors border-b bg-roc-blue">
          <div className="flex shrink-0 w-full justify-between items-center gap-3 pl-4 pr-3 sm:pl-3 sm:pr-2 h-12 sm:mx-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </header>
        <div className="bg-background-200">
          <TotalResourcesSkeleton />
        </div>
      </aside>

      {/* RIGHT PANEL - Buildings List */}
      <div className="relative flex min-w-0 flex-1 flex-col 2xl:w-5/11 lg:w-6/11">
        <main className="md:mx-0 material-medium relative mb-0 md:mb-2 mt-0 flex-1 grow overflow-hidden">
          <div className="@container/page-layout relative flex size-full min-h-0 flex-col">
            {/* Header */}
            <header className="flex shrink-0 flex-col w-full transition-colors border-b bg-roc-blue">
              <div className="flex shrink-0 w-full justify-between items-center gap-3 px-3 h-12 sm:mx-0">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="size-full overflow-y-auto no-scrollbar flex flex-col">
              <ItemListSkeleton />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
