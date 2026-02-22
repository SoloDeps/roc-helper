"use client";

import { useMemo } from "react";
import { calculateTotalCosts } from "@/lib/utils/calculations";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import {
  useBuildings,
  useTechnos,
  useOttomanAreas,
  useOttomanTradePosts,
} from "@/hooks/use-database";
import {
  eras,
  goodsUrlByEra,
  goodsByCivilization,
  type EraAbbr,
  MAIN_RESOURCE_ORDER,
  PRIORITY_TYPES,
  makePriorityKey,
  isPriorityGoodKey,
  getExcludedItems,
  isAlliedCityResource,
} from "@/lib/constants";
import { getBuildingFromLocal, slugify, getItemIconLocal } from "@/lib/utils";
import { ResourceBlock } from "./resource-block";
import { TotalResourcesSkeleton } from "@/components/loading-skeletons";
import { EmptyOutline } from "@/components/cards/empty-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TotalGoodsDisplayProps {
  compareMode?: boolean;
}

// ============================================================================
// TYPES
// ============================================================================

interface ResourceItem {
  icon: string;
  name: string;
  amount: number;
  difference?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Obtenir la couleur de différence
 */
function getDifferenceColor(difference: number): string {
  return difference >= 0 ? "34, 197, 94" : "239, 68, 68";
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook pour charger toutes les données depuis Dexie
 */
function useAllEntities() {
  const buildingsData = useBuildings();
  const technosData = useTechnos();
  const areasData = useOttomanAreas();
  const tradePostsData = useOttomanTradePosts();

  //  AMÉLIORATION: Détection plus précise du loading
  const isLoading =
    buildingsData === undefined ||
    technosData === undefined ||
    areasData === undefined ||
    tradePostsData === undefined;

  const buildings = buildingsData ?? [];
  const technos = technosData ?? [];
  const areas = areasData ?? [];
  const tradePosts = tradePostsData ?? [];

  return { buildings, technos, areas, tradePosts, isLoading };
}

/**
 * Hook pour calculer les totaux
 */
function useTotalCosts(
  buildings: ReturnType<typeof useBuildings>,
  technos: ReturnType<typeof useTechnos>,
  areas: ReturnType<typeof useOttomanAreas>,
  tradePosts: ReturnType<typeof useOttomanTradePosts>,
) {
  return useMemo(() => {
    if (!buildings || !technos || !areas || !tradePosts) {
      return {
        main: {},
        goods: new Map<string, number>(),
        byEra: new Map<string, Map<string, number>>(),
        byCity: new Map<string, Map<string, number>>(),
      };
    }

    return calculateTotalCosts(buildings, technos, areas, tradePosts);
  }, [buildings, technos, areas, tradePosts]);
}

/**
 * Hook pour convertir un good réel en format priority
 */
function useGoodToPriorityConverter(selections: string[][]) {
  return useMemo(() => {
    return (goodName: string): string | null => {
      if (!selections || selections.length === 0) return null;

      const normalizedGoodName = slugify(goodName);

      for (const era of eras) {
        const abbr = era.abbr as EraAbbr;
        const goodsForEra = goodsUrlByEra[abbr];

        if (!goodsForEra) continue;

        const priorities: Array<"primary" | "secondary" | "tertiary"> = [
          "primary",
          "secondary",
          "tertiary",
        ];

        for (const priority of priorities) {
          const building = getBuildingFromLocal(priority, abbr, selections);
          if (!building) continue;

          const normalizedBuilding = slugify(building);
          const goodMeta = goodsForEra[normalizedBuilding];

          if (goodMeta && slugify(goodMeta.name) === normalizedGoodName) {
            return makePriorityKey(priority, abbr);
          }
        }
      }

      return null;
    };
  }, [selections]);
}

/**
 * Hook pour normaliser les priority goods
 */
function useNormalizedPriorityGoods(
  goodsMap: Map<string, number>,
  convertGoodToPriority: (goodName: string) => string | null,
) {
  return useMemo(() => {
    const priorityMap = new Map<string, number>();

    // Traiter tous les goods
    goodsMap.forEach((amount, type) => {
      let finalKey: string | null = null;

      // Cas 1: C'est déjà un priority good
      if (isPriorityGoodKey(type)) {
        finalKey = type.toLowerCase();
      }
      // Cas 2: C'est un nom de good réel
      else {
        finalKey = convertGoodToPriority(type);
      }

      // Si on a trouvé une clé valide, l'ajouter/fusionner
      if (finalKey) {
        priorityMap.set(finalKey, (priorityMap.get(finalKey) ?? 0) + amount);
      }
    });

    // S'assurer que toutes les combinaisons era/priority existent (même à 0)
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
  }, [goodsMap, convertGoodToPriority]);
}

/**
 * Hook pour les autres goods (non-priority)
 */
function useOtherGoods(
  goodsMap: Map<string, number>,
  convertGoodToPriority: (goodName: string) => string | null,
) {
  return useMemo(() => {
    const otherMap = new Map<string, number>();

    goodsMap.forEach((amount, type) => {
      // Ignorer les priority goods
      if (isPriorityGoodKey(type)) return;

      // Vérifier si ce good a été converti en priority good
      const convertedKey = convertGoodToPriority(type);
      if (convertedKey) return;

      otherMap.set(type, (otherMap.get(type) ?? 0) + amount);
    });

    return otherMap;
  }, [goodsMap, convertGoodToPriority]);
}

/**
 * Hook pour créer les era blocks
 */
function useEraBlocks(
  selections: string[][],
  normalizedPriorityGoods: Map<string, number>,
) {
  return useMemo(() => {
    if (!selections || selections.length === 0) {
      return [];
    }

    return eras.map((era) => {
      const abbr = era.abbr as EraAbbr;

      const amounts = {
        primary:
          normalizedPriorityGoods.get(makePriorityKey("primary", abbr)) ?? 0,
        secondary:
          normalizedPriorityGoods.get(makePriorityKey("secondary", abbr)) ?? 0,
        tertiary:
          normalizedPriorityGoods.get(makePriorityKey("tertiary", abbr)) ?? 0,
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
            name: primaryMeta?.name ?? "Primary",
            amount: amounts.primary,
            difference: amounts.primary,
          },
          {
            icon: secondaryMeta?.name
              ? `/goods/${slugify(secondaryMeta.name)}.webp`
              : "/goods/default.webp",
            name: secondaryMeta?.name ?? "Secondary",
            amount: amounts.secondary,
            difference: amounts.secondary,
          },
          {
            icon: tertiaryMeta?.name
              ? `/goods/${slugify(tertiaryMeta.name)}.webp`
              : "/goods/default.webp",
            name: tertiaryMeta?.name ?? "Tertiary",
            amount: amounts.tertiary,
            difference: amounts.tertiary,
          },
        ],
        shouldHide:
          amounts.primary === 0 &&
          amounts.secondary === 0 &&
          amounts.tertiary === 0,
      };
    });
  }, [selections, normalizedPriorityGoods]);
}

/**
 * Hook pour grouper les other goods par civilisation
 */
function useOtherGoodsByCiv(
  otherGoods: Map<string, number>,
  mainResources: Record<string, number>,
) {
  return useMemo(() => {
    const grouped: Record<string, ResourceItem[]> = {};
    const processedTypes = new Set<string>(); //  Track déjà traités pour éviter doublons

    // Initialiser les groupes
    Object.keys(goodsByCivilization).forEach((civ) => (grouped[civ] = []));

    const itemsList = getExcludedItems();

    //  1. Traiter les ITEMS depuis mainResources
    Object.entries(mainResources).forEach(([type, amount]) => {
      if (itemsList.includes(type)) {
        const item = {
          icon: getItemIconLocal(type),
          name: type.replace(/_/g, " "),
          amount,
          difference: amount,
        };

        if (!grouped.ITEMS) grouped.ITEMS = [];
        grouped.ITEMS.push(item);
        processedTypes.add(type); //  Marquer comme traité
      }
    });

    //  2. NOUVEAU : Traiter les ALLIED CITY RESOURCES depuis mainResources
    Object.entries(mainResources).forEach(([type, amount]) => {
      //  Skip si déjà traité dans ITEMS
      if (processedTypes.has(type)) return;

      // Vérifier si c'est une ressource alliée (deben, aspers, wu_zhu, etc.)
      for (const [civKey, civData] of Object.entries(goodsByCivilization)) {
        if (civData.goods.includes(type)) {
          const item = {
            icon: getItemIconLocal(type),
            name: type.replace(/_/g, " "),
            amount,
            difference: amount,
          };

          if (!grouped[civKey]) grouped[civKey] = [];
          grouped[civKey].push(item);
          processedTypes.add(type); //  Marquer comme traité
          break; // Sortir dès qu'on a trouvé la civilisation
        }
      }
    });

    //  3. Traiter tous les autres goods (goods map)
    otherGoods.forEach((amount, type) => {
      //  Skip si déjà traité
      if (processedTypes.has(type)) return;

      const displayName = type.replace(/_/g, " ");
      const normalized = slugify(displayName);
      let foundCiv: string | null = null;

      for (const [civKey, civData] of Object.entries(goodsByCivilization)) {
        if (civData.goods.includes(normalized)) {
          foundCiv = civKey;
          break;
        }
      }

      const item = {
        icon: `/goods/${normalized}.webp`,
        name: displayName,
        amount,
        difference: amount,
      };

      if (foundCiv) {
        grouped[foundCiv].push(item);
      } else {
        if (!grouped.OTHERS) grouped.OTHERS = [];
        grouped.OTHERS.push(item);
      }
      processedTypes.add(type); //  Marquer comme traité
    });

    // Retourner uniquement les groupes non vides
    return Object.fromEntries(
      Object.entries(grouped).filter(([_, resources]) => resources.length > 0),
    );
  }, [otherGoods, mainResources]);
}

/**
 * Hook pour les ressources principales
 */
function useMainResources(mainResources: Record<string, number>) {
  return useMemo(() => {
    const itemsToExclude = getExcludedItems();

    return Object.entries(mainResources)
      .filter(([type, amount]) => {
        if (itemsToExclude.includes(type)) return false;
        if (isAlliedCityResource(type)) return false;
        if (amount <= 0) return false;
        return true;
      })
      .map(([type, amount]) => ({
        type,
        amount,
        icon: getItemIconLocal(type),
        name: type.replace(/_/g, " "),
        difference: amount,
      }))
      .sort((a, b) => {
        const aIdx = MAIN_RESOURCE_ORDER.indexOf(
          a.type as (typeof MAIN_RESOURCE_ORDER)[number],
        );
        const bIdx = MAIN_RESOURCE_ORDER.indexOf(
          b.type as (typeof MAIN_RESOURCE_ORDER)[number],
        );

        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.type.localeCompare(b.type);
      });
  }, [mainResources]);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TotalGoodsDisplay({
  compareMode = false,
}: TotalGoodsDisplayProps) {
  // ========================================
  // DATA LOADING
  // ========================================
  const selections = useBuildingSelections();
  const { buildings, technos, areas, tradePosts, isLoading } = useAllEntities();

  // ========================================
  // CALCULATIONS
  // ========================================
  const totals = useTotalCosts(buildings, technos, areas, tradePosts);

  // ========================================
  // DATA PROCESSING
  // ========================================
  const convertGoodToPriority = useGoodToPriorityConverter(selections);
  const normalizedPriorityGoods = useNormalizedPriorityGoods(
    totals.goods,
    convertGoodToPriority,
  );
  const otherGoods = useOtherGoods(totals.goods, convertGoodToPriority);
  const eraBlocks = useEraBlocks(selections, normalizedPriorityGoods);
  const otherGoodsByCiv = useOtherGoodsByCiv(otherGoods, totals.main);
  const mainResources = useMainResources(totals.main);

  // ========================================
  // RENDERING CONDITIONS
  // ========================================
  const visibleEras = useMemo(
    () => eraBlocks.filter((b) => !b.shouldHide),
    [eraBlocks],
  );

  const hasOtherGoods = useMemo(
    () => Object.keys(otherGoodsByCiv).length > 0,
    [otherGoodsByCiv],
  );

  const hasAnyResources = useMemo(
    () => mainResources.length > 0 || visibleEras.length > 0 || hasOtherGoods,
    [mainResources.length, visibleEras.length, hasOtherGoods],
  );

  const allDataHidden = useMemo(() => {
    const hasData =
      buildings.length > 0 ||
      technos.length > 0 ||
      areas.length > 0 ||
      tradePosts.length > 0;
    if (!hasData) return false;
    return (
      buildings.every((b) => b.hidden) &&
      technos.every((t) => t.hidden) &&
      areas.every((a) => a.hidden) &&
      tradePosts.every((tp) => tp.hidden)
    );
  }, [buildings, technos, areas, tradePosts]);

  // ========================================
  // RENDER
  // ========================================

  //  AMÉLIORATION: Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className="size-full overflow-y-auto bg-background-200">
        <TotalResourcesSkeleton />
      </div>
    );
  }

  // Toutes les données sont cachées → priorité sur hasAnyResources
  // (les entités hidden sont exclues du calcul, donc totals = vide aussi)
  if (allDataHidden) {
    return (
      <div className="p-3 size-full m-auto flex items-center justify-center bg-background-200">
        <div className="-mt-12">
          <EmptyOutline perso="male2" type="all-hidden" />
        </div>
      </div>
    );
  }

  //  AMÉLIORATION: EmptyCard apparaît seulement après le chargement
  if (!hasAnyResources) {
    return (
      <div className="p-3 size-full m-auto flex items-center justify-center bg-background-200">
        <div className="-mt-12">
          <EmptyOutline perso="female" type="total" />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="size-full overflow-y-auto bg-background-200">
      <div className="px-2 py-4 md:p-4 mb-4 md:mb-16 max-w-[870px] mx-auto">
        {/* Main Resources */}
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-1 2xl:grid-cols-6 gap-3">
          <div className="col-span-4 md:col-start-2 xl:col-start-1 2xl:col-start-2">
            <ResourceBlock
              title={
                compareMode
                  ? "Difference (your stock – stock required)"
                  : "Main Resources"
              }
              resources={mainResources}
              type="main"
              className={
                mainResources.length > 3
                  ? "grid-cols-3 md:grid-cols-4"
                  : "grid-cols-3"
              }
              compareMode={compareMode}
              getDifferenceColor={getDifferenceColor}
            />
          </div>
        </div>

        {/* Era Blocks + Other Goods */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3 pt-3">
          {/* Era Priority Goods */}
          <div className="space-y-3">
            {visibleEras.map((block) => (
              <ResourceBlock
                key={block.title}
                {...block}
                type="era"
                compareMode={compareMode}
                getDifferenceColor={getDifferenceColor}
              />
            ))}
          </div>

          {/* Other Goods (by Civilization) */}
          {hasOtherGoods && (
            <div className="space-y-3">
              {Object.entries(otherGoodsByCiv).map(([civ, resources]) => (
                <ResourceBlock
                  key={civ}
                  title={civ}
                  resources={resources}
                  type="other"
                  compareMode={compareMode}
                  getDifferenceColor={getDifferenceColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
