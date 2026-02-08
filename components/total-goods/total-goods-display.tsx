"use client";

import { useEffect, useState } from "react";
import { useBuildingsStore } from "@/lib/stores/buildings-store";
import { useTechnosStore } from "@/lib/stores/technos-store";
import { useOttomanStore } from "@/lib/stores/ottoman-store";
import { ResourceBlock } from "./resource-block";
import {
  getItemIconLocal,
  slugify,
  getGoodNameFromPriorityEra,
} from "@/lib/utils";
import { EmptyOutline } from "@/components/cards/empty-card";

interface ResourceTotals {
  main: Record<string, number>;
  goods: [string, number][];
}

export function TotalGoodsDisplay({
  userSelections,
}: {
  userSelections: string[][];
}) {
  const [totals, setTotals] = useState<ResourceTotals | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get data from stores
  const buildings = useBuildingsStore((state) => state.getVisibleBuildings());
  const technos = useTechnosStore((state) => state.getVisibleTechnos());
  const areas = useOttomanStore((state) => state.getVisibleAreas());
  const tradePosts = useOttomanStore((state) => state.getVisibleTradePosts());

  useEffect(() => {
    setIsCalculating(true);

    const worker = new Worker(
      new URL("@/lib/workers/calculations.worker.ts", import.meta.url),
    );

    worker.postMessage({
      buildings,
      technos,
      areas,
      tradePosts,
    });

    worker.onmessage = (e: MessageEvent<ResourceTotals>) => {
      setTotals(e.data);
      setIsCalculating(false);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [buildings, technos, areas, tradePosts]);

  if (!totals && !isCalculating) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyOutline perso="female" type="total" />
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Calculating totals...</p>
        </div>
      </div>
    );
  }

  if (!totals) return null;

  // Convertir les totaux en format pour ResourceBlock
  const mainResources = Object.entries(totals.main).map(([type, amount]) => ({
    icon: getItemIconLocal(type),
    name: type,
    amount,
  }));

  const goodsResources = totals.goods.map(([type, amount]) => {
    const match = type.match(/^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i);
    let goodName = type;

    if (match) {
      const [, priority, era] = match;
      const resolvedName = getGoodNameFromPriorityEra(
        priority,
        era,
        userSelections,
      );
      if (resolvedName) goodName = resolvedName;
    }

    return {
      icon: `/goods/${slugify(goodName)}.webp`,
      name: goodName,
      amount,
    };
  });

  return (
    <div className="space-y-4 p-4">
      {mainResources.length > 0 && (
        <ResourceBlock
          title="Main Resources"
          resources={mainResources}
          type="main"
        />
      )}

      {goodsResources.length > 0 && (
        <ResourceBlock title="Goods" resources={goodsResources} type="other" />
      )}
    </div>
  );
}

