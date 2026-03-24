"use client";

import { useMemo, useState } from "react";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceBadge } from "@/components/items/resource-badge";
import { formatNumber, getItemIconLocal, formatDuration } from "@/lib/utils";
import type { CampaignRegion } from "@/types/campaign-types";

interface CampaignInfoPanelProps {
  regions: CampaignRegion[];
  completedIds: Set<string>;
  onClose: () => void;
  hideHeader?: boolean;
}

export function CampaignInfoPanel({
  regions,
  completedIds,
  onClose,
  hideHeader = false,
}: CampaignInfoPanelProps) {
  const remaining = useMemo(
    () => regions.filter((r) => !completedIds.has(r.id)),
    [regions, completedIds],
  );

  const completed = useMemo(
    () => regions.filter((r) => completedIds.has(r.id)),
    [regions, completedIds],
  );

  const total = regions.length;
  const completedCount = total - remaining.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const { totalCoins, totalDuration } = useMemo(
    () => ({
      totalCoins: remaining.reduce((s, r) => s + r.scout.coins, 0),
      totalDuration: remaining.reduce((s, r) => s + r.scout.duration, 0),
    }),
    [remaining],
  );

  // Aggregate regionRewards + parts rewards from remaining regions
  const { aggregated, commanders } = useMemo(() => {
    const rewardMap = new Map<string, number>();
    const cmdMap = new Map<string, string>();

    remaining.forEach((r) => {
      r.regionRewards.forEach((rw) => {
        if (rw.resource.startsWith("commander_")) {
          cmdMap.set(rw.resource, rw.name ?? rw.resource);
        } else {
          rewardMap.set(
            rw.resource,
            (rewardMap.get(rw.resource) ?? 0) + rw.amount,
          );
        }
      });
      r.parts.forEach((part) => {
        part.rewards.forEach((rw) => {
          if (rw.resource.startsWith("commander_")) {
            cmdMap.set(rw.resource, rw.name ?? rw.resource);
          } else {
            rewardMap.set(
              rw.resource,
              (rewardMap.get(rw.resource) ?? 0) + rw.amount,
            );
          }
        });
      });
    });

    return {
      aggregated: Array.from(rewardMap.entries()).map(([resource, amount]) => ({
        resource,
        amount,
      })),
      commanders: Array.from(cmdMap.entries()).map(([resource, name]) => ({
        resource,
        name,
      })),
    };
  }, [remaining]);

  // Aggregate regionRewards + parts rewards from completed regions
  const { obtainedAggregated, obtainedCommanders } = useMemo(() => {
    const rewardMap = new Map<string, number>();
    const cmdMap = new Map<string, string>();

    completed.forEach((r) => {
      r.regionRewards.forEach((rw) => {
        if (rw.resource.startsWith("commander_")) {
          cmdMap.set(rw.resource, rw.name ?? rw.resource);
        } else {
          rewardMap.set(
            rw.resource,
            (rewardMap.get(rw.resource) ?? 0) + rw.amount,
          );
        }
      });
      r.parts.forEach((part) => {
        part.rewards.forEach((rw) => {
          if (rw.resource.startsWith("commander_")) {
            cmdMap.set(rw.resource, rw.name ?? rw.resource);
          } else {
            rewardMap.set(
              rw.resource,
              (rewardMap.get(rw.resource) ?? 0) + rw.amount,
            );
          }
        });
      });
    });

    return {
      obtainedAggregated: Array.from(rewardMap.entries()).map(
        ([resource, amount]) => ({ resource, amount }),
      ),
      obtainedCommanders: Array.from(cmdMap.entries()).map(
        ([resource, name]) => ({ resource, name }),
      ),
    };
  }, [completed]);

  const hasRewards = aggregated.length > 0 || commanders.length > 0;
  const hasObtainedRewards =
    obtainedAggregated.length > 0 || obtainedCommanders.length > 0;

  const showRewardTabs = completedCount > 0 && hasObtainedRewards;
  const [rewardTab, setRewardTab] = useState<"remaining" | "obtained">(
    "remaining",
  );

  // ── Stable ordered key list (union of both tabs) ──────────────────────────
  // Order: expansions → research_points → coins → food → others
  const PRIORITY_RESOURCES = ["research_points", "coins", "food"];

  const stableResourceKeys = useMemo(() => {
    const allKeys = Array.from(
      new Set([
        ...aggregated.map((r) => r.resource),
        ...obtainedAggregated.map((r) => r.resource),
      ]),
    );
    const expansions = allKeys.filter((k) => k.startsWith("expansion_")).sort();
    const priority = PRIORITY_RESOURCES.filter((k) => allKeys.includes(k));
    const others = allKeys
      .filter(
        (k) => !k.startsWith("expansion_") && !PRIORITY_RESOURCES.includes(k),
      )
      .sort();
    return [...expansions, ...priority, ...others];
  }, [aggregated, obtainedAggregated]);

  const stableCommanderKeys = useMemo(() => {
    return Array.from(
      new Set([
        ...commanders.map((c) => c.resource),
        ...obtainedCommanders.map((c) => c.resource),
      ]),
    );
  }, [commanders, obtainedCommanders]);

  return (
    <div
      className={
        hideHeader
          ? "flex flex-col"
          : "bg-background-300 border border-border rounded-lg shadow-lg flex flex-col overflow-hidden max-h-[560px]"
      }
    >
      {/* Header */}
      {!hideHeader && (
        <div className="border-b border-border bg-background-100 shrink-0">
          <div className="flex items-center justify-between h-12 px-4">
            <h2 className="text-sm font-semibold truncate flex-1">
              Campaign Info
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 h-8 w-8"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 min-h-[190px]">
        {/* Progress */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Progress
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Regions scouted</span>
              <span className="font-semibold tabular-nums">
                {completedCount}/{total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted-foreground/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <>
          {/* Scout cost OR all-scouted message */}
          {pct === 100 ? (
            <p className="text-sm text-green-500 font-medium text-center py-2">
              All regions scouted! 🎉
            </p>
          ) : (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Scout cost remaining · {remaining.length} region
                {remaining.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <ResourceBadge
                  icon={getItemIconLocal("coins")}
                  value={formatNumber(totalCoins)}
                  alt="coins"
                />
                <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0">
                  <Clock className="size-[22px] text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rewards — tabbed when obtained rewards exist, plain otherwise */}
          {(hasRewards ||
            showRewardTabs ||
            (pct === 100 && hasObtainedRewards)) && (
            <div>
              {pct === 100 ? (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Obtained rewards
                </p>
              ) : showRewardTabs ? (
                <div className="grid grid-cols-2 mb-2">
                  <button
                    onClick={() => setRewardTab("remaining")}
                    className={`text-xs font-medium uppercase tracking-wider text-center pb-1 transition-colors ${
                      rewardTab === "remaining"
                        ? "text-foreground border-b-2 border-foreground/90"
                        : "text-muted-foreground border-b-2 border-border hover:text-foreground"
                    }`}
                  >
                    Remaining
                  </button>
                  <button
                    onClick={() => setRewardTab("obtained")}
                    className={`text-xs font-medium uppercase tracking-wider text-center pb-1 transition-colors ${
                      rewardTab === "obtained"
                        ? "text-foreground border-b-2 border-foreground/90"
                        : "text-muted-foreground border-b-2 border-border hover:text-foreground"
                    }`}
                  >
                    Obtained
                  </button>
                </div>
              ) : (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Remaining rewards
                </p>
              )}

              {/* Remaining tab — hidden when all scouted */}
              {pct < 100 && (!showRewardTabs || rewardTab === "remaining") && (
                <>
                  {(() => {
                    const remainingMap = new Map(
                      aggregated.map((r) => [r.resource, r.amount]),
                    );
                    const orderedItems = stableResourceKeys.filter((k) =>
                      remainingMap.has(k),
                    );
                    return orderedItems.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        {orderedItems.map((key) => (
                          <ResourceBadge
                            key={key}
                            icon={getItemIconLocal(key)}
                            value={formatNumber(remainingMap.get(key)!)}
                            alt={key}
                          />
                        ))}
                      </div>
                    ) : null;
                  })()}
                  {(() => {
                    const remainingCmdMap = new Map(
                      commanders.map((c) => [c.resource, c.name]),
                    );
                    const orderedCmds = stableCommanderKeys.filter((k) =>
                      remainingCmdMap.has(k),
                    );
                    return orderedCmds.length > 0 ? (
                      <ul className="space-y-1.5 mt-1.5">
                        {orderedCmds.map((key) => (
                          <li
                            key={key}
                            className="flex items-center px-3 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 text-sm font-medium"
                          >
                            {remainingCmdMap.get(key)}
                          </li>
                        ))}
                      </ul>
                    ) : null;
                  })()}
                  {!hasRewards && (
                    <p className="text-xs text-muted-foreground italic">
                      No remaining rewards
                    </p>
                  )}
                </>
              )}

              {/* Obtained tab */}
              {(pct === 100 ||
                (showRewardTabs && rewardTab === "obtained")) && (
                <>
                  {(() => {
                    const obtainedMap = new Map(
                      obtainedAggregated.map((r) => [r.resource, r.amount]),
                    );
                    const orderedItems = stableResourceKeys.filter((k) =>
                      obtainedMap.has(k),
                    );
                    return orderedItems.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        {orderedItems.map((key) => (
                          <ResourceBadge
                            key={key}
                            icon={getItemIconLocal(key)}
                            value={formatNumber(obtainedMap.get(key)!)}
                            alt={key}
                          />
                        ))}
                      </div>
                    ) : null;
                  })()}
                  {(() => {
                    const obtainedCmdMap = new Map(
                      obtainedCommanders.map((c) => [c.resource, c.name]),
                    );
                    const orderedCmds = stableCommanderKeys.filter((k) =>
                      obtainedCmdMap.has(k),
                    );
                    return orderedCmds.length > 0 ? (
                      <ul className="space-y-1.5 mt-1.5">
                        {orderedCmds.map((key) => (
                          <li
                            key={key}
                            className="flex items-center px-3 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 text-sm font-medium"
                          >
                            {obtainedCmdMap.get(key)}
                          </li>
                        ))}
                      </ul>
                    ) : null;
                  })()}
                </>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
}
