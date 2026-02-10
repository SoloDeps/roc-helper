import { useEffect, useState, useMemo } from "react";
import { getAllResources, type UserResource } from "@/lib/roc/rocApi";
import { useBuildingSelections } from "@/hooks/useBuildingSelections";
import {
  eras,
  goodsUrlByEra,
  goodsByCivilization,
  type EraAbbr,
  MAIN_RESOURCE_ORDER,
  PRIORITY_TYPES,
  makePriorityKey,
  isAlliedCityResource,
} from "@/lib/constants";
import { getBuildingFromLocal, slugify, getItemIconLocal } from "@/lib/utils";
import { ResourceBlock } from "@/components/total-goods/resource-block";
import { ScrollArea } from "@/components/ui/scroll-area";

export const UserGoodsDisplay = () => {
  const selections = useBuildingSelections();
  const [userResources, setUserResources] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const resources = await getAllResources();
        if (mounted) {
          // Convertir UserResource[] en Record<string, number>
          // Filtrer uniquement les ressources avec amount > 0
          const resourceMap = resources.reduce(
            (acc, resource) => {
              // Ne pas inclure les selection_kits ici (ils vont à droite)
              // Ne pas inclure les ressources à 0
              if (resource.type !== "selection_kit" && resource.amount > 0) {
                acc[resource.id] = resource.amount;
              }
              return acc;
            },
            {} as Record<string, number>,
          );

          console.log("User resources loaded:", resourceMap);
          console.log(
            "Total non-zero resources:",
            Object.keys(resourceMap).length,
          );
          setUserResources(resourceMap);
        }
      } catch (error) {
        console.error("Error loading user resources:", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Normaliser les priority goods
  const normalizedPriorityGoods = useMemo(() => {
    const priorityMap = new Map<string, number>();

    if (!userResources || !selections || selections.length === 0) {
      return priorityMap;
    }

    Object.entries(userResources).forEach(([type, amount]) => {
      // Ignorer les main resources
      if (MAIN_RESOURCE_ORDER.includes(type as any)) return;
      // Ignorer les allied currencies
      if (isAlliedCityResource(type)) return;
      // Ignorer les selection_kit
      if (type.includes("selection_kit")) return;

      // Si c'est déjà un priority good (primary_cg, etc.)
      if (/^(primary|secondary|tertiary)_[a-z]{2}$/i.test(type)) {
        const key = type.toLowerCase();
        priorityMap.set(key, (priorityMap.get(key) || 0) + amount);
        return;
      }

      // Sinon, trouver le priority good correspondant
      for (const era of eras) {
        const abbr = era.abbr as EraAbbr;
        const goodsForEra = goodsUrlByEra[abbr];
        if (!goodsForEra) continue;

        for (const priority of PRIORITY_TYPES) {
          const building = getBuildingFromLocal(priority, abbr, selections);
          if (!building) continue;

          const normalizedBuilding = slugify(building);
          const goodMeta = goodsForEra[normalizedBuilding];

          if (goodMeta && slugify(goodMeta.name) === slugify(type)) {
            const key = makePriorityKey(priority, abbr);
            priorityMap.set(key, (priorityMap.get(key) || 0) + amount);
            return;
          }
        }
      }
    });

    // S'assurer que toutes les ères ont leurs 3 priority (même à 0)
    eras.forEach((era) => {
      const abbr = era.abbr as EraAbbr;
      PRIORITY_TYPES.forEach((priority) => {
        const key = makePriorityKey(priority, abbr);
        if (!priorityMap.has(key)) {
          priorityMap.set(key, 0);
        }
      });
    });

    return priorityMap;
  }, [userResources, selections]);

  // Autres goods (allied cities)
  const otherGoods = useMemo(() => {
    const otherMap = new Map<string, number>();

    if (!userResources) return otherMap;

    Object.entries(userResources).forEach(([type, amount]) => {
      // Ignorer les main resources
      if (MAIN_RESOURCE_ORDER.includes(type as any)) return;
      // Ignorer les selection_kit
      if (type.includes("selection_kit")) return;
      // Ignorer les priority goods déjà traités
      if (/^(primary|secondary|tertiary)_[a-z]{2}$/i.test(type)) return;

      // Vérifier si c'est un priority good sous forme de nom
      let isPriorityGood = false;
      for (const era of eras) {
        const abbr = era.abbr as EraAbbr;
        const goodsForEra = goodsUrlByEra[abbr];
        if (!goodsForEra) continue;

        for (const priority of PRIORITY_TYPES) {
          const building = getBuildingFromLocal(priority, abbr, selections);
          if (!building) continue;

          const normalizedBuilding = slugify(building);
          const goodMeta = goodsForEra[normalizedBuilding];

          if (goodMeta && slugify(goodMeta.name) === slugify(type)) {
            isPriorityGood = true;
            break;
          }
        }
        if (isPriorityGood) break;
      }

      if (!isPriorityGood) {
        otherMap.set(type, amount);
      }
    });

    return otherMap;
  }, [userResources, selections]);

  // ERA BLOCKS
  const eraBlocks = useMemo(() => {
    if (!selections || selections.length === 0) return [];

    return eras.map((era) => {
      const abbr = era.abbr as EraAbbr;

      const amounts = {
        primary:
          normalizedPriorityGoods.get(makePriorityKey("primary", abbr)) || 0,
        secondary:
          normalizedPriorityGoods.get(makePriorityKey("secondary", abbr)) || 0,
        tertiary:
          normalizedPriorityGoods.get(makePriorityKey("tertiary", abbr)) || 0,
      };

      const getGoodMeta = (priority: string) => {
        const building = getBuildingFromLocal(priority, abbr, selections);
        if (!building) return undefined;
        const normalized = slugify(building);
        return goodsUrlByEra[abbr]?.[normalized];
      };

      const primaryMeta = getGoodMeta("primary");
      const secondaryMeta = getGoodMeta("secondary");
      const tertiaryMeta = getGoodMeta("tertiary");

      return {
        title: era.name,
        resources: [
          {
            icon: primaryMeta?.name
              ? `/goods/${slugify(primaryMeta.name)}.webp`
              : "/goods/default.webp",
            name: primaryMeta?.name || "Primary",
            amount: amounts.primary,
          },
          {
            icon: secondaryMeta?.name
              ? `/goods/${slugify(secondaryMeta.name)}.webp`
              : "/goods/default.webp",
            name: secondaryMeta?.name || "Secondary",
            amount: amounts.secondary,
          },
          {
            icon: tertiaryMeta?.name
              ? `/goods/${slugify(tertiaryMeta.name)}.webp`
              : "/goods/default.webp",
            name: tertiaryMeta?.name || "Tertiary",
            amount: amounts.tertiary,
          },
        ],
        shouldHide: Object.values(amounts).every((v) => v === 0),
      };
    });
  }, [selections, normalizedPriorityGoods]);

  // GOODS PAR CIVILISATION
  const otherGoodsByCiv = useMemo(() => {
    const grouped: Record<
      string,
      Array<{ icon: string; name: string; amount: number }>
    > = {};

    Object.keys(goodsByCivilization).forEach((civ) => {
      if (civ !== "ITEMS") grouped[civ] = [];
    });

    otherGoods.forEach((amount, type) => {
      const displayName = type.replace(/_/g, " ");
      const normalized = slugify(displayName);
      let foundCiv: string | null = null;

      for (const [civKey, civData] of Object.entries(goodsByCivilization)) {
        if (civKey === "ITEMS") continue;
        if (civData.goods.includes(normalized)) {
          foundCiv = civKey;
          break;
        }
      }

      const item = {
        icon: `/goods/${normalized}.webp`,
        name: displayName,
        amount,
      };

      if (foundCiv) {
        grouped[foundCiv].push(item);
      } else {
        if (!grouped.OTHERS) grouped.OTHERS = [];
        grouped.OTHERS.push(item);
      }
    });

    return Object.fromEntries(
      Object.entries(grouped).filter(([_, resources]) => resources.length > 0),
    );
  }, [otherGoods]);

  // MAIN RESOURCES
  const mainResources = useMemo(() => {
    if (!userResources) return [];

    return Object.entries(userResources)
      .filter(([type]) => {
        return MAIN_RESOURCE_ORDER.includes(type as any);
      })
      .map(([type, amount]) => ({
        type,
        amount,
        icon: getItemIconLocal(type),
        name: type.replace(/_/g, " "),
      }))
      .sort((a, b) => {
        const aIdx = MAIN_RESOURCE_ORDER.indexOf(a.type as any);
        const bIdx = MAIN_RESOURCE_ORDER.indexOf(b.type as any);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.type.localeCompare(b.type);
      });
  }, [userResources]);

  const visibleEras = eraBlocks.filter((b) => !b.shouldHide);
  const hasOtherGoods = Object.keys(otherGoodsByCiv).length > 0;
  const hasMainResources = mainResources.length > 0;

  return (
    <ScrollArea className="size-full overflow-y-auto bg-background-200">
      <div className="p-4 pb-16 max-w-[870px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="col-span-4 md:col-start-2">
            <ResourceBlock
              title="Main Resources"
              resources={mainResources}
              type="main"
              className={
                mainResources.length > 3 ? "grid-cols-4" : "grid-cols-3"
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
          <div className="space-y-3">
            {visibleEras.map((block) => (
              <ResourceBlock key={block.title} {...block} type="era" />
            ))}
          </div>

          {hasOtherGoods && (
            <div className="space-y-3">
              {Object.entries(otherGoodsByCiv).map(([civ, resources]) => (
                <ResourceBlock
                  key={civ}
                  title={civ}
                  resources={resources}
                  type="other"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
