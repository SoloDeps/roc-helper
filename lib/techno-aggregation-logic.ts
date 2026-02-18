/**
 * Logique d'agrégation pour la TechnoCard
 *
 * La card affiche la SOMME de toutes les technos NON-HIDDEN d'une ère
 *
 * Exemple pour Early Gothic Era:
 * - 3 technos au total
 * - Si techno_0 est hidden=true (complétée)
 * - La card affiche seulement la somme de techno_1 + techno_2
 */

import { useMemo } from "react";
import { getWikiDB, type TechnoEntity } from "@/lib/db/schema";

/**
 * Hook pour agréger les coûts des technos d'une ère
 * Filtre automatiquement les technos hidden
 */
export function useAggregatedTechnoCosts(technos: TechnoEntity[]) {
  return useMemo(() => {
    // ✅ Filter out hidden technos
    const visibleTechnos = technos.filter((t) => !t.hidden);

    if (visibleTechnos.length === 0) {
      return {
        totalResearch: 0,
        totalCoins: 0,
        totalFood: 0,
        goods: [],
        technoCount: 0,
        allHidden: technos.length > 0, // true if all technos are hidden
      };
    }

    // ✅ Aggregate costs
    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();

    visibleTechnos.forEach((techno) => {
      // Aggregate resources
      Object.entries(techno.costs.resources).forEach(([key, value]) => {
        resources[key] = (resources[key] || 0) + value;
      });

      // Aggregate goods
      techno.costs.goods.forEach((good) => {
        const existing = goodsMap.get(good.resource);
        goodsMap.set(good.resource, (existing || 0) + good.amount);
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

/**
 * Exemple d'utilisation dans item-list.tsx:
 *
 * // Dans le composant
 * const technosByEra = useMemo(() => {
 *   const groups = new Map<string, TechnoEntity[]>();
 *
 *   technos.forEach((techno) => {
 *     if (!groups.has(techno.era)) groups.set(techno.era, []);
 *     groups.get(techno.era)!.push(techno);
 *   });
 *
 *   return groups;
 * }, [technos]);
 *
 * // Dans le render
 * {Array.from(technosByEra.entries()).map(([era, eraTechnos]) => {
 *   const aggregated = useAggregatedTechnoCosts(eraTechnos);
 *
 *   return (
 *     <TechnoCard
 *       key={era}
 *       era={era}
 *       aggregatedData={aggregated}
 *       technos={eraTechnos}
 *       onRemoveAll={() => removeTechnosByEra.mutate(era)}
 *     />
 *   );
 * })}
 */

/**
 * Helper: Remove all technos from an era
 */
export async function removeAllTechnosFromEra(era: string) {
  const db = getWikiDB();
  const technosToRemove = await db.technos.where("era").equals(era).toArray();

  await Promise.all(
    technosToRemove.map((techno) => db.technos.delete(techno.id)),
  );
}

/**
 * Helper: Toggle hidden status for all technos in an era
 */
export async function toggleAllTechnosInEra(era: string) {
  const db = getWikiDB();
  const eraTechnos = await db.technos.where("era").equals(era).toArray();

  if (eraTechnos.length === 0) return;

  // Toggle: if all hidden, show all. Otherwise hide all.
  const allHidden = eraTechnos.every((t) => t.hidden);
  const newHiddenState = !allHidden;

  await Promise.all(
    eraTechnos.map((techno) =>
      db.technos.update(techno.id, {
        hidden: newHiddenState,
        updatedAt: Date.now(),
      }),
    ),
  );
}

/**
 * Helper: Toggle individual techno (pour future Technology Tracker page)
 */
export async function toggleIndividualTechno(technoId: string) {
  const db = getWikiDB();
  const techno = await db.technos.get(technoId);

  if (!techno) return;

  await db.technos.update(technoId, {
    hidden: !techno.hidden,
    updatedAt: Date.now(),
  });
}
