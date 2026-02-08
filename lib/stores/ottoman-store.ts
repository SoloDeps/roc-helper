"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "@/lib/db/schema";

interface OttomanState {
  areas: Map<string, OttomanAreaEntity>;
  tradePosts: Map<string, OttomanTradePostEntity>;

  // Areas
  addArea: (area: OttomanAreaEntity) => void;
  addAreas: (areas: OttomanAreaEntity[]) => void;
  removeArea: (id: string) => void;
  removeAllAreas: () => void;
  toggleAreaHidden: (id: string) => void;

  // Trade Posts
  addTradePost: (tradePost: OttomanTradePostEntity) => void;
  addTradePosts: (tradePosts: OttomanTradePostEntity[]) => void;
  removeTradePost: (id: string) => void;
  removeAllTradePosts: () => void;
  toggleTradePostHidden: (id: string) => void;
  toggleTradePostLevel: (
    id: string,
    level: keyof OttomanTradePostEntity["levels"],
  ) => void;

  // Getters
  getVisibleAreas: () => OttomanAreaEntity[];
  getVisibleTradePosts: () => OttomanTradePostEntity[];
}

export const useOttomanStore = create<OttomanState>()(
  persist(
    immer((set, get) => ({
      areas: new Map(),
      tradePosts: new Map(),

      // Areas
      addArea: (area) =>
        set((state) => {
          state.areas.set(area.id, {
            ...area,
            hidden: area.hidden ?? false,
            updatedAt: Date.now(),
          });
        }),

      addAreas: (areas) =>
        set((state) => {
          areas.forEach((area) => {
            state.areas.set(area.id, {
              ...area,
              hidden: area.hidden ?? false,
              updatedAt: Date.now(),
            });
          });
        }),

      removeArea: (id) =>
        set((state) => {
          state.areas.delete(id);
        }),

      removeAllAreas: () =>
        set((state) => {
          state.areas.clear();
        }),

      toggleAreaHidden: (id) =>
        set((state) => {
          const area = state.areas.get(id);
          if (area) {
            area.hidden = !area.hidden;
            area.updatedAt = Date.now();
          }
        }),

      // Trade Posts
      addTradePost: (tradePost) =>
        set((state) => {
          state.tradePosts.set(tradePost.id, {
            ...tradePost,
            hidden: tradePost.hidden ?? false,
            updatedAt: Date.now(),
          });
        }),

      addTradePosts: (tradePosts) =>
        set((state) => {
          tradePosts.forEach((tp) => {
            state.tradePosts.set(tp.id, {
              ...tp,
              hidden: tp.hidden ?? false,
              updatedAt: Date.now(),
            });
          });
        }),

      removeTradePost: (id) =>
        set((state) => {
          state.tradePosts.delete(id);
        }),

      removeAllTradePosts: () =>
        set((state) => {
          state.tradePosts.clear();
        }),

      toggleTradePostHidden: (id) =>
        set((state) => {
          const tp = state.tradePosts.get(id);
          if (tp) {
            tp.hidden = !tp.hidden;
            tp.updatedAt = Date.now();
          }
        }),

      toggleTradePostLevel: (id, level) =>
        set((state) => {
          const tp = state.tradePosts.get(id);
          if (!tp) return;

          tp.levels[level] = !tp.levels[level];

          // Recalculer les coûts
          if (tp.sourceData) {
            tp.costs = calculateTradePostCosts(tp.sourceData, tp.levels);
          }

          tp.updatedAt = Date.now();
        }),

      getVisibleAreas: () => {
        return Array.from(get().areas.values())
          .filter((a) => !a.hidden)
          .sort((a, b) => a.areaIndex - b.areaIndex);
      },

      getVisibleTradePosts: () => {
        return Array.from(get().tradePosts.values())
          .filter((tp) => !tp.hidden)
          .sort((a, b) => a.area - b.area);
      },
    })),
    {
      name: "ottoman-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        areas: Array.from(state.areas.entries()),
        tradePosts: Array.from(state.tradePosts.entries()),
      }),
      merge: (persistedState: any, currentState) => {
        const areas = new Map(persistedState?.areas || []);
        const tradePosts = new Map(persistedState?.tradePosts || []);
        return { ...currentState, areas, tradePosts };
      },
    },
  ),
);

// Helper function
function calculateTradePostCosts(
  sourceData: NonNullable<OttomanTradePostEntity["sourceData"]>,
  levels: OttomanTradePostEntity["levels"],
): OttomanTradePostEntity["costs"] {
  const costs: OttomanTradePostEntity["costs"] = { goods: [], aspers: 0 };
  const goodsMap = new Map<string, number>();

  const levelMapping: Record<keyof OttomanTradePostEntity["levels"], number> = {
    unlock: 1,
    lvl2: 2,
    lvl3: 3,
    lvl4: 4,
    lvl5: 5,
  };

  Object.entries(levels).forEach(([levelKey, isEnabled]) => {
    if (!isEnabled) return;

    const levelNum =
      levelMapping[levelKey as keyof OttomanTradePostEntity["levels"]];
    const levelData = sourceData.levels?.[levelNum];

    if (!levelData || !Array.isArray(levelData)) return;

    levelData.forEach((item: { resource: string; amount: number }) => {
      const resource = item.resource.toLowerCase();
      const amount = item.amount;

      const ottomanGoods = [
        "wheat",
        "pomegranate",
        "confection",
        "syrup",
        "mohair",
        "apricot",
        "tea",
        "brocade",
      ];

      if (
        ottomanGoods.includes(resource) ||
        resource.match(/^(primary|secondary|tertiary)_/i)
      ) {
        goodsMap.set(resource, (goodsMap.get(resource) || 0) + amount);
      } else {
        costs[resource] = ((costs[resource] as number) || 0) + amount;
      }
    });
  });

  costs.goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
    type,
    amount,
  }));

  return costs;
}
