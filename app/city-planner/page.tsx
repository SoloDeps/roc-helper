"use client";

import { CityCanvas } from "@/components/planner/CityCanvas";
import { BuildingSelector } from "@/components/planner/BuildingSelector";
import { CommandBar } from "@/components/planner/CommandBar";

export default function CityPlannerPage() {
  return (
    <div className="flex flex-1 min-h-0">
      <aside className="w-72 shrink-0 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-base font-semibold">City Planner</h1>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <BuildingSelector />
        </div>
        <div className="p-3 border-t">
          <CommandBar />
        </div>
      </aside>

      <main className="flex-1 min-w-0 min-h-0 relative bg-stone-100 dark:bg-stone-900">
        <CityCanvas gridW={52} gridH={52} />
      </main>
    </div>
  );
}
