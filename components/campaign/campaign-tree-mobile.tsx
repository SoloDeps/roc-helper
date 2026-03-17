"use client";

import React, { useMemo, useState, useCallback } from "react";
import { CampaignDetailsDrawer } from "./campaign-details-drawer";
import { CampaignPathDrawer } from "./campaign-path-drawer";
import {
  CampaignTreeDesktop,
  type CampaignTreeExternalControl,
} from "./campaign-tree-desktop";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import type { CampaignRegion } from "@/types/campaign-types";
import { Check, Clock, List, GitBranch, GitFork, X, Target } from "lucide-react";
import {
  cn,
  getItemIconLocal,
  formatNumber,
  formatDuration,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  getAllAncestors,
  getSubgraphBetween,
  getOrderedTechs,
} from "@/lib/path-utils";

// ── CampaignCard ───────────────────────────────────────────────────────────────
interface CampaignCardProps {
  region: CampaignRegion;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onShowDetails: (region: CampaignRegion) => void;
}

function CampaignCard({
  region,
  isCompleted,
  onToggleComplete,
  onShowDetails,
}: CampaignCardProps) {
  return (
    <div className="h-16 relative">
      {/* Main clickable area → opens details */}
      <button
        onClick={() => onShowDetails(region)}
        className={cn(
          "absolute inset-0 flex items-center rounded-lg border bg-card transition-all text-left",
          isCompleted
            ? "border-green-600/50 bg-green-600/10 dark:border-green-500/40 dark:bg-green-500/5"
            : "border-border hover:border-primary/50",
        )}
      >
        <div className="flex-1 min-w-0 flex flex-col justify-center px-3 py-2 pr-12 max-md:font-sans!">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-semibold text-sm leading-tight truncate flex-1",
                isCompleted && "text-green-700 dark:text-green-400",
              )}
            >
              {region.name}
            </span>
            {region.boss && (
              <span className="shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 dark:bg-red-900/40 dark:text-red-400 border border-red-500/30 leading-none">
                Boss
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="relative size-3.5 shrink-0">
              <Image
                src={getItemIconLocal("coins")}
                alt="coins"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[13px] font-semibold text-muted-foreground">
              {formatNumber(region.scout.coins)}
            </span>
            <span className="text-[11px] text-muted-foreground/50">·</span>
            <Clock className="size-3 text-muted-foreground/70 shrink-0" />
            <span className="text-[13px] font-semibold text-muted-foreground">
              {formatDuration(region.scout.duration)}
            </span>
          </div>
        </div>
      </button>

      {/* Checkbox — independent button, never nested inside <button> */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(region.id);
        }}
        className={cn(
          "absolute right-2.5 top-1/2 -translate-y-1/2 shrink-0 size-6 rounded border-2 flex items-center justify-center transition-all z-10",
          isCompleted
            ? "bg-green-500 border-green-500"
            : "border-muted-foreground/30 hover:border-green-600/70 dark:hover:border-green-400/70",
        )}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
      >
        {isCompleted && <Check className="size-[18px] text-white stroke-4" />}
      </button>
    </div>
  );
}

// ── CampaignTreeMobile ─────────────────────────────────────────────────────────
interface CampaignTreeMobileProps {
  regions: CampaignRegion[];
  eraId: string;
}

type Mode =
  | "select"
  | "path-pick-from"
  | "path-pick-to"
  | "path-result"
  | "ancestors-pick"
  | "ancestors-result";

export function CampaignTreeMobile({ regions, eraId }: CampaignTreeMobileProps) {
  const [activeTab, setActiveTab] = useState<"list" | "graph">("list");

  // ── Shared selection state ────────────────────────────────────────────────
  const [selectedRegion, setSelectedRegion] = useState<CampaignRegion | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  // ── Shared path/prereq state ──────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>("select");
  const [pathFromId, setPathFromId] = useState<string | null>(null);
  const [pathToId, setPathToId] = useState<string | null>(null);
  const [pathRawNodeIds, setPathRawNodeIds] = useState(new Set<string>());
  const [pathRawEdgeIds, setPathRawEdgeIds] = useState(new Set<string>());
  const [pathFound, setPathFound] = useState(true);
  const [isPathDrawerOpen, setIsPathDrawerOpen] = useState(false);
  const [excludeCompleted, setExcludeCompleted] = useState(true);

  // ── DB ────────────────────────────────────────────────────────────────────
  const campaignEntities = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.campaigns
      .where("id")
      .anyOf(regions.map((r) => r.id))
      .toArray();
  }, [regions]);

  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    campaignEntities?.forEach((r) => {
      if (r.cp) ids.add(r.id);
    });
    return ids;
  }, [campaignEntities]);

  // ── Path derived state ────────────────────────────────────────────────────
  const pathNodeIds = useMemo(() => {
    if (!excludeCompleted || !pathToId) return pathRawNodeIds;
    return new Set(
      [...pathRawNodeIds].filter(
        (id) => id === pathToId || !completedIds.has(id),
      ),
    );
  }, [pathRawNodeIds, pathToId, excludeCompleted, completedIds]);

  const pathRegions = useMemo(
    () => getOrderedTechs(pathNodeIds, regions as any) as unknown as CampaignRegion[],
    [pathNodeIds, regions],
  );

  const pathFromRegion = regions.find((r) => r.id === pathFromId) ?? null;
  const pathToRegion = regions.find((r) => r.id === pathToId) ?? null;
  const isResultMode = mode === "path-result" || mode === "ancestors-result";

  // ── Ancestor/descendant helpers ───────────────────────────────────────────
  const collectAncestorIds = useCallback(
    (targetId: string): string[] => {
      const regionMap = new Map(regions.map((r) => [r.id, r]));
      const result = new Set<string>();
      function dfs(id: string) {
        for (const reqId of regionMap.get(id)?.required ?? []) {
          if (!result.has(reqId)) {
            result.add(reqId);
            dfs(reqId);
          }
        }
      }
      dfs(targetId);
      return Array.from(result);
    },
    [regions],
  );

  const collectDescendantIds = useCallback(
    (targetId: string): string[] => {
      const children = new Map<string, string[]>();
      regions.forEach((r) => {
        (r.required ?? []).forEach((reqId) => {
          if (!children.has(reqId)) children.set(reqId, []);
          children.get(reqId)!.push(r.id);
        });
      });
      const result = new Set<string>();
      function dfs(id: string) {
        for (const childId of children.get(id) ?? []) {
          if (!result.has(childId)) {
            result.add(childId);
            dfs(childId);
          }
        }
      }
      dfs(targetId);
      return Array.from(result);
    },
    [regions],
  );

  // Ancestors of A — dimmed during pick-to
  const ancestorsOfFrom = useMemo(() => {
    if (!pathFromId || mode !== "path-pick-to") return new Set<string>();
    return new Set(collectAncestorIds(pathFromId));
  }, [pathFromId, mode, collectAncestorIds]);

  // ── List grouped by column ────────────────────────────────────────────────
  const groupedByColumn = useMemo(() => {
    const groups = new Map<number, CampaignRegion[]>();
    regions.forEach((r) => {
      if (!groups.has(r.column)) groups.set(r.column, []);
      groups.get(r.column)!.push(r);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [regions]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  // Toggle complete with ancestors/descendants — mirrors desktop + tech-tree-mobile
  const handleToggleComplete = useCallback(
    async (id: string) => {
      if (mode !== "select") return;
      const db = getWikiDB();
      const isCurrentlyCompleted = completedIds.has(id);
      if (!isCurrentlyCompleted) {
        const idsToComplete = [id, ...collectAncestorIds(id)];
        const existing = await db.campaigns.bulkGet(idsToComplete);
        await db.campaigns.bulkPut(
          idsToComplete.map((rid, i) => ({
            ...(existing[i] ?? { id: rid, hidden: 0 }),
            id: rid,
            cp: 1,
          })),
        );
      } else {
        const idsToUncheck = [id, ...collectDescendantIds(id)];
        const existing = await db.campaigns.bulkGet(idsToUncheck);
        await db.campaigns.bulkPut(
          idsToUncheck.map((rid, i) => ({
            ...(existing[i] ?? { id: rid, hidden: 0 }),
            id: rid,
            cp: 0,
          })),
        );
      }
    },
    [mode, completedIds, collectAncestorIds, collectDescendantIds],
  );

  // Open details drawer — list only, not from graph
  const handleShowDetails = useCallback(
    (region: CampaignRegion) => {
      if (mode !== "select") return;
      setSelectedRegion(region);
      setIsDetailsDrawerOpen(true);
    },
    [mode],
  );

  // Card click in path/prereq modes
  const handleCardClick = useCallback(
    (region: CampaignRegion) => {
      if (mode === "ancestors-pick") {
        const { nodeIds, edgeIds } = getAllAncestors(region.id, regions as any);
        setPathRawNodeIds(nodeIds);
        setPathRawEdgeIds(edgeIds);
        setPathFound(true);
        setPathToId(region.id);
        setMode("ancestors-result");
        return;
      }
      if (mode === "path-pick-from") {
        setPathFromId(region.id);
        setMode("path-pick-to");
        return;
      }
      if (mode === "path-pick-to") {
        if (region.id === pathFromId) return;
        const { nodeIds, edgeIds, found } = getSubgraphBetween(
          pathFromId!,
          region.id,
          regions as any,
        );
        setPathRawNodeIds(nodeIds);
        setPathRawEdgeIds(edgeIds);
        setPathFound(found);
        setPathToId(region.id);
        setMode("path-result");
        return;
      }
      if (isResultMode && pathNodeIds.has(region.id)) {
        setIsPathDrawerOpen(true);
      }
    },
    [mode, pathFromId, regions, pathNodeIds, isResultMode],
  );

  const reset = useCallback(() => {
    setMode("select");
    setPathFromId(null);
    setPathToId(null);
    setPathRawNodeIds(new Set());
    setPathRawEdgeIds(new Set());
    setPathFound(true);
    setIsPathDrawerOpen(false);
    setSelectedRegion(null);
    setSelectedNodeId(null);
  }, []);

  // ── External control for graph tab ───────────────────────────────────────
  const externalControl: CampaignTreeExternalControl = useMemo(
    () => ({
      mode,
      setMode,
      pathFromId,
      setPathFromId,
      pathToId,
      setPathToId,
      pathRawNodeIds,
      setPathRawNodeIds,
      pathRawEdgeIds,
      setPathRawEdgeIds,
      pathFound,
      setPathFound,
      excludeCompleted,
      setExcludeCompleted,
      selectedRegion,
      setSelectedRegion,
      selectedNodeId,
      setSelectedNodeId,
      onOpenPathDrawer: () => setIsPathDrawerOpen(true),
    }),
    [
      mode,
      pathFromId,
      pathToId,
      pathRawNodeIds,
      pathRawEdgeIds,
      pathFound,
      excludeCompleted,
      selectedRegion,
      selectedNodeId,
    ],
  );

  // FAB visible on both tabs when prereq/path result is active
  const showFAB = isResultMode && pathFound && pathToRegion;

  return (
    <>
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-background border-y border-border -mx-2 sm:-mx-4">
        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px",
              activeTab === "list"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="size-3.5" /> Region List
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px",
              activeTab === "graph"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <GitBranch className="size-3.5" /> Campaign Tree
          </button>
        </div>

        {/* Toolbar — list tab only */}
        {activeTab === "list" && (
          <div className="p-2 border-t border-border">
            {mode === "select" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("ancestors-pick")}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-border rounded-md py-2 hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <Target className="size-3.5 shrink-0" />
                  Prerequisites
                </button>
                <button
                  onClick={() => setMode("path-pick-from")}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-border rounded-md py-2 hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <GitFork className="size-3.5 shrink-0" />
                  Path A → B
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  {mode === "ancestors-pick" && (
                    <span className="text-xs text-orange-400 font-semibold">
                      Select target region
                    </span>
                  )}
                  {mode === "path-pick-from" && (
                    <span className="text-xs text-orange-400 font-semibold">
                      Select A
                    </span>
                  )}
                  {mode === "path-pick-to" && (
                    <span className="text-xs text-orange-400 font-semibold truncate block">
                      <span className="text-muted-foreground font-normal">A: </span>
                      {pathFromRegion?.name}
                      <span className="text-muted-foreground font-normal"> → Select B</span>
                    </span>
                  )}
                  {isResultMode && pathFound && (
                    <span className="text-xs text-orange-400 font-semibold truncate block">
                      {mode === "ancestors-result"
                        ? `Prerequisites · ${pathToRegion?.name}`
                        : `${pathFromRegion?.name} → ${pathToRegion?.name}`}
                    </span>
                  )}
                  {isResultMode && !pathFound && (
                    <span className="text-xs text-red-400 font-semibold">No path found</span>
                  )}
                </div>

                <button
                  onClick={() => setExcludeCompleted((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs border rounded-lg px-2.5 py-1.5 shrink-0 transition-colors",
                    excludeCompleted
                      ? "border-emerald-600 text-emerald-700 dark:border-emerald-500/60 dark:text-emerald-400 hover:bg-emerald-500/10"
                      : "border-border text-muted-foreground hover:border-primary/50",
                  )}
                >
                  <div
                    className={cn(
                      "size-3.5 rounded border-2 flex items-center justify-center shrink-0",
                      excludeCompleted
                        ? "bg-emerald-600 border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                        : "border-muted-foreground/50",
                    )}
                  >
                    {excludeCompleted && <Check className="size-2.5 text-white stroke-[3]" />}
                  </div>
                  Skip done
                </button>

                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-xs border border-orange-400/50 text-orange-400 rounded-lg px-2.5 py-1.5 shrink-0 hover:bg-orange-500/10 transition-colors"
                >
                  <X className="size-3.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Region List tab ── */}
      {activeTab === "list" && (
        <div className="space-y-7 pt-5 pb-24">
          {groupedByColumn.map(([columnIndex, colRegions]) => (
            <div key={columnIndex} className="space-y-1.5">
              <div className="text-xs font-semibold text-muted-foreground/60 px-0.5">
                Column {columnIndex + 1}
              </div>
              <div className="space-y-1">
                {colRegions.map((region) => {
                  const isPathFrom = region.id === pathFromId;
                  const isPathTo = region.id === pathToId;
                  const isOnPath =
                    isResultMode &&
                    pathNodeIds.has(region.id) &&
                    !isPathFrom &&
                    !isPathTo;
                  const isPathDimmed =
                    (mode === "path-pick-to" && ancestorsOfFrom.has(region.id)) ||
                    (isResultMode && !pathNodeIds.has(region.id) && !isPathFrom);

                  return (
                    <div
                      key={region.id}
                      onClick={() => {
                        if (mode !== "select") handleCardClick(region);
                      }}
                      className={cn(
                        "transition-all duration-150",
                        mode !== "select" && "cursor-pointer",
                        (isPathFrom || isPathTo) && "ring-2 ring-orange-400/60 rounded-lg",
                        isOnPath && "ring-1 ring-orange-300/40 rounded-lg",
                        isPathDimmed && "opacity-30",
                      )}
                    >
                      {(isPathFrom || isPathTo) && (
                        <div className="flex items-center gap-1.5 px-1 mb-0.5">
                          <span className="size-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                            {isPathFrom ? "A" : "B"}
                          </span>
                          <span className="text-[10px] text-orange-400 font-medium">
                            {isPathFrom ? "Start" : "Destination"}
                          </span>
                        </div>
                      )}
                      <CampaignCard
                        region={region}
                        isCompleted={completedIds.has(region.id)}
                        onToggleComplete={handleToggleComplete}
                        onShowDetails={mode === "select" ? handleShowDetails : () => {}}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Graph tab ── */}
      {activeTab === "graph" && (
        <div className="h-[calc(100vh-200px)] min-h-[400px]">
          <CampaignTreeDesktop
            regions={regions}
            eraId={eraId}
            externalControl={externalControl}
            hideControls={false}
          />
        </div>
      )}

      {/* ── Details drawer — list only ── */}
      <CampaignDetailsDrawer
        region={selectedRegion}
        open={isDetailsDrawerOpen}
        onOpenChange={(open) => {
          setIsDetailsDrawerOpen(open);
          if (!open) setTimeout(() => setSelectedRegion(null), 300);
        }}
      />

      {/* ── Path drawer ── */}
      <CampaignPathDrawer
        open={isPathDrawerOpen}
        onOpenChange={setIsPathDrawerOpen}
        fromRegion={mode === "ancestors-result" ? null : pathFromRegion}
        toRegion={pathToRegion}
        pathRegions={pathRegions}
      />

      {/* ── FAB — both tabs when result is active ── */}
      {showFAB && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <Button
            variant="default"
            onClick={() => setIsPathDrawerOpen(true)}
            className="bg-orange-400 shadow-xs shadow-orange-500/20"
          >
            <span className="size-5 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold shrink-0">
              {pathRegions.length}
            </span>
            View total cost
          </Button>
        </div>
      )}
    </>
  );
}
