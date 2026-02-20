/**
 * Logique d'agrégation pour la TechnoCard
 * hidden: 0 = visible (inclus dans les calculs)
 * hidden: 1 = caché (exclu des calculs, barré dans l'UI)
 */

import { useMemo } from "react";
import { getWikiDB } from "@/lib/db/schema";
import { getEraAbbr } from "@/lib/era-mappings";
import type { HydratedTechno } from "@/lib/db/data-hydration";

export function useAggregatedTechnoCosts(technos: HydratedTechno[]) {
  return useMemo(() => {
    const visibleTechnos = technos.filter((t) => !t.hidden);

    if (visibleTechnos.length === 0) {
      return {
        totalResearch: 0,
        totalCoins: 0,
        totalFood: 0,
        goods: [],
        technoCount: 0,
        allHidden: technos.length > 0,
      };
    }

    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();

    visibleTechnos.forEach((techno) => {
      // ✅ costs.resources est un Record<string, number>
      Object.entries(techno.costs?.resources ?? {}).forEach(([key, value]) => {
        resources[key] = (resources[key] || 0) + value;
      });

      // ✅ costs.goods est un Array<{ resource: string; amount: number }>
      (techno.costs?.goods ?? []).forEach((good) => {
        goodsMap.set(
          good.resource,
          (goodsMap.get(good.resource) || 0) + good.amount,
        );
      });
    });

    const goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
      type,
      amount,
    }));

    return {
      totalResearch: resources.research_points || 0,
      totalCoins: resources.coins || 0,
      totalFood: resources.food || 0,
      goods,
      technoCount: visibleTechnos.length,
      allHidden: false,
    };
  }, [technos]);
}

export async function removeAllTechnosFromEra(eraId: string) {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId);
  const technos = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  if (technos.length > 0) {
    await db.technos.bulkDelete(technos.map((t) => t.id));
  }
}

export async function toggleAllTechnosInEra(eraId: string) {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId);
  const eraTechnos = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  if (eraTechnos.length === 0) return;
  const allHidden = eraTechnos.every((t) => !!t.hidden);
  await db.technos.bulkPut(
    eraTechnos.map((t) => ({ ...t, hidden: allHidden ? 0 : 1 })),
  );
}

export async function toggleIndividualTechno(technoId: string) {
  const db = getWikiDB();
  const techno = await db.technos.get(technoId);
  if (!techno) return;
  await db.technos.update(technoId, { hidden: techno.hidden ? 0 : 1 });
}
