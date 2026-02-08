"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TechnoEntity } from "@/lib/db/schema";

interface TechnosState {
  technos: Map<string, TechnoEntity>;

  addTechno: (techno: TechnoEntity) => void;
  addTechnos: (technos: TechnoEntity[]) => void;
  removeTechno: (id: string) => void;
  removeAllTechnos: () => void;
  toggleHidden: (eraPath: string) => void;
  clearEraTechnos: (eraPrefix: string) => void;

  getVisibleTechnos: () => TechnoEntity[];
  getTechnosByEra: (eraPrefix: string) => TechnoEntity[];
  getAggregatedByEra: () => Map<
    string,
    {
      technos: TechnoEntity[];
      totalResearch: number;
      totalCoins: number;
      totalFood: number;
      goods: Array<{ type: string; amount: number }>;
      technoCount: number;
      hidden: boolean;
    }
  >;
}

export const useTechnosStore = create<TechnosState>()(
  persist(
    immer((set, get) => ({
      technos: new Map(),

      addTechno: (techno) =>
        set((state) => {
          state.technos.set(techno.id, {
            ...techno,
            hidden: techno.hidden ?? false,
            updatedAt: Date.now(),
          });
        }),

      addTechnos: (technos) =>
        set((state) => {
          technos.forEach((techno) => {
            state.technos.set(techno.id, {
              ...techno,
              hidden: techno.hidden ?? false,
              updatedAt: Date.now(),
            });
          });
        }),

      removeTechno: (id) =>
        set((state) => {
          state.technos.delete(id);
        }),

      removeAllTechnos: () =>
        set((state) => {
          state.technos.clear();
        }),

      toggleHidden: (eraPath) =>
        set((state) => {
          const technos = Array.from(state.technos.values()).filter((t) =>
            t.id.startsWith(`techno_${eraPath}`),
          );

          if (technos.length === 0) return;

          const newHiddenState = !technos[0].hidden;

          technos.forEach((techno) => {
            const t = state.technos.get(techno.id);
            if (t) {
              t.hidden = newHiddenState;
              t.updatedAt = Date.now();
            }
          });
        }),

      clearEraTechnos: (eraPrefix) =>
        set((state) => {
          const toDelete = Array.from(state.technos.keys()).filter((id) =>
            id.startsWith(`techno_${eraPrefix}`),
          );
          toDelete.forEach((id) => state.technos.delete(id));
        }),

      getVisibleTechnos: () => {
        return Array.from(get().technos.values()).filter((t) => !t.hidden);
      },

      getTechnosByEra: (eraPrefix) => {
        return Array.from(get().technos.values()).filter((t) =>
          t.id.startsWith(`techno_${eraPrefix}`),
        );
      },

      getAggregatedByEra: () => {
        const technos = Array.from(get().technos.values());
        const grouped = new Map<string, TechnoEntity[]>();

        technos.forEach((techno) => {
          const match = techno.id.match(/^techno_([^_]+)/);
          if (match) {
            const era = match[1];
            if (!grouped.has(era)) grouped.set(era, []);
            grouped.get(era)!.push(techno);
          }
        });

        const result = new Map();

        grouped.forEach((eraTechnos, era) => {
          const goodsMap = new Map<string, number>();
          let totalResearch = 0;
          let totalCoins = 0;
          let totalFood = 0;
          const hidden = eraTechnos.every((t) => t.hidden);

          eraTechnos.forEach((techno) => {
            if (techno.hidden) return;

            totalResearch += (techno.costs.research_points as number) ?? 0;
            totalCoins += (techno.costs.coins as number) ?? 0;
            totalFood += (techno.costs.food as number) ?? 0;

            if (Array.isArray(techno.costs.goods)) {
              techno.costs.goods.forEach((g) => {
                goodsMap.set(g.type, (goodsMap.get(g.type) ?? 0) + g.amount);
              });
            }
          });

          result.set(era, {
            technos: eraTechnos,
            totalResearch,
            totalCoins,
            totalFood,
            goods: Array.from(goodsMap.entries()).map(([type, amount]) => ({
              type,
              amount,
            })),
            technoCount: eraTechnos.length,
            hidden,
          });
        });

        return result;
      },
    })),
    {
      name: "technos-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        technos: Array.from(state.technos.entries()),
      }),
      merge: (persistedState: any, currentState) => {
        const technos = new Map(persistedState?.technos || []);
        return { ...currentState, technos };
      },
    },
  ),
);
