'use client';

// ─────────────────────────────────────────────────────────────────────────────
// StatsPanel.tsx
// Panneau droit — stats production + happiness
// Affiché/masqué via bouton toggle dans la topbar
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { useCityPlannerStore, useCurrentEra, useEntityCount } from '@/planner/state/cityPlannerStore';
import { calculateCityHappinessStats, isCultureSite, isHappinessConsumer } from '@/planner/core/happinessCalculator';
import { ERAS } from '@/lib/catalog';
import type { EraCode } from '@/types/shared';

export function StatsPanel() {
  const stateRef   = useCityPlannerStore(s => s.stateRef);
  const entityCount= useEntityCount();
  const currentEra = useCurrentEra();
  const setEra     = useCityPlannerStore(s => s.setEra);

  const stats = useMemo(() => {
    const entities = stateRef.current.mapState.entities;
    if (entities.size === 0) return null;
    return calculateCityHappinessStats(entities);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityCount, stateRef]);

  // Compter par type
  const counts = useMemo(() => {
    const entities = stateRef.current.mapState.entities;
    const byType: Record<string, number> = {};
    for (const e of entities.values()) {
      byType[e.buildingDataId] = (byType[e.buildingDataId] ?? 0) + 1;
    }
    return byType;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityCount, stateRef]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Sélecteur d'ère */}
      <div className="p-3 border-b flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ère</label>
        <select
          value={currentEra}
          onChange={e => setEra(e.target.value as EraCode)}
          className="w-full text-xs rounded border bg-background px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ERAS.map(era => (
            <option key={era.abbr} value={era.abbr}>{era.name}</option>
          ))}
        </select>
      </div>

      {entityCount === 0 ? (
        <div className="p-3 text-xs text-muted-foreground">
          Aucun bâtiment placé.
        </div>
      ) : (
        <div className="flex flex-col gap-0">

          {/* ── Happiness ───────────────────────────────────────── */}
          {stats && (
            <section className="p-3 border-b flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Happiness</p>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total disponible</span>
                <span className="font-medium tabular-nums">{stats.totalAvailable.toLocaleString()} pts</span>
              </div>

              {/* Répartition des bonus */}
              {stats.consumers.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-xs text-muted-foreground">Bâtiments productifs ({stats.consumers.length})</p>
                  <div className="flex gap-1 flex-wrap">
                    {stats.count100 > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/15 text-green-600 dark:text-green-400 font-medium">
                        {stats.count100}× +100%
                      </span>
                    )}
                    {stats.count50 > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 font-medium">
                        {stats.count50}× +50%
                      </span>
                    )}
                    {stats.count25 > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-orange-500/15 text-orange-600 dark:text-orange-400 font-medium">
                        {stats.count25}× +25%
                      </span>
                    )}
                    {stats.countNoBonus > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground font-medium">
                        {stats.countNoBonus}× 0%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Bâtiments placés ────────────────────────────────── */}
          <section className="p-3 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bâtiments ({entityCount})
            </p>

            <div className="flex flex-col gap-1">
              {Object.entries(counts).map(([id, count]) => {
                const consumerStats = stats?.consumers.filter(c => c.buildingDataId === id) ?? [];
                const avgBonus = consumerStats.length > 0
                  ? consumerStats.reduce((s, c) => s + c.productionBonus, 0) / consumerStats.length
                  : null;

                return (
                  <div key={id} className="flex items-center justify-between text-xs py-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-muted-foreground shrink-0">{count}×</span>
                      <span className="truncate capitalize">
                        {id.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    {avgBonus !== null && (
                      <span className={`shrink-0 font-medium tabular-nums ml-2 ${
                        avgBonus >= 1.0 ? 'text-green-600 dark:text-green-400' :
                        avgBonus >= 0.5 ? 'text-yellow-600 dark:text-yellow-400' :
                        avgBonus >= 0.25 ? 'text-orange-600 dark:text-orange-400' :
                        'text-muted-foreground'
                      }`}>
                        +{Math.round(avgBonus * 100)}%
                      </span>
                    )}
                    {isCultureSite(id) && (
                      <span className="shrink-0 text-yellow-500 ml-2">★</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
