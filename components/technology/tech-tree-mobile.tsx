"use client";

import React, { useMemo, useState, useCallback } from "react";
import { TechCard } from "./tech-card";
import { TechDetailsModal } from "./tech-details-modal";
import { TechPathDrawer } from "./tech-path-drawer";
import { TechTreeDesktop } from "./tech-tree-desktop";
import type { TechnoData } from "@/types/shared";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import { GitFork, X, Target, List, GitBranch, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAllAncestors,
  getSubgraphBetween,
  getOrderedTechs,
} from "@/lib/path-utils";
import { useSelectedEraId } from "@/lib/stores/technology-page-store";

type Mode =
  | "select"
  | "ancestors-pick"
  | "path-pick-from"
  | "path-pick-to"
  | "path-result"
  | "ancestors-result";

interface TechTreeMobileProps {
  technologies: TechnoData[];
}

export function TechTreeMobile({ technologies }: TechTreeMobileProps) {
  const selectedEraId = useSelectedEraId();
  const [activeTab, setActiveTab] = useState<"list" | "graph">("list");

  const [selectedTech, setSelectedTech] = useState<TechnoData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] = useState<Mode>("select");
  const [pathFromId, setPathFromId] = useState<string | null>(null);
  const [pathToId, setPathToId] = useState<string | null>(null);
  const [pathRawNodeIds, setPathRawNodeIds] = useState(new Set<string>());
  const [pathRawEdgeIds, setPathRawEdgeIds] = useState(new Set<string>());
  const [pathFound, setPathFound] = useState(true);
  const [isPathDrawerOpen, setIsPathDrawerOpen] = useState(false);
  const [excludeCompleted, setExcludeCompleted] = useState(true);

  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos
      .where("id")
      .anyOf(technologies.map((t) => t.id))
      .toArray();
  }, [technologies]);

  const groupedByColumn = useMemo(() => {
    const groups = new Map<number, TechnoData[]>();
    technologies.forEach((tech) => {
      if (!groups.has(tech.column)) groups.set(tech.column, []);
      groups.get(tech.column)!.push(tech);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [technologies]);

  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    technosInDB?.forEach((t) => {
      if (t.hidden) ids.add(t.id);
    });
    return ids;
  }, [technosInDB]);

  // Derived live from raw + excludeCompleted toggle
  const pathNodeIds = useMemo(() => {
    if (!excludeCompleted || !pathToId) return pathRawNodeIds;
    return new Set(
      [...pathRawNodeIds].filter(
        (id) => id === pathToId || !completedIds.has(id),
      ),
    );
  }, [pathRawNodeIds, pathToId, excludeCompleted, completedIds]);

  const pathEdgeIds = useMemo(() => {
    if (!excludeCompleted || !pathToId) return pathRawEdgeIds;
    return new Set(
      [...pathRawEdgeIds].filter((id) => {
        const [src, tgt] = id.split("-");
        return (
          !completedIds.has(src) ||
          src === pathToId ||
          !completedIds.has(tgt) ||
          tgt === pathToId
        );
      }),
    );
  }, [pathRawEdgeIds, pathToId, excludeCompleted, completedIds]);

  const pathTechs = useMemo(
    () => getOrderedTechs(pathNodeIds, technologies),
    [pathNodeIds, technologies],
  );

  const reset = useCallback(() => {
    setMode("select");
    setPathFromId(null);
    setPathToId(null);
    setPathRawNodeIds(new Set());
    setPathRawEdgeIds(new Set());
    setPathFound(true);
    setIsPathDrawerOpen(false);
  }, []);

  const applyResult = useCallback(
    (
      nodeIds: Set<string>,
      edgeIds: Set<string>,
      found: boolean,
      toId: string,
      fromId?: string,
    ) => {
      setPathRawNodeIds(nodeIds);
      setPathRawEdgeIds(edgeIds);
      setPathFound(found);
      setPathToId(toId);
      if (fromId) setPathFromId(fromId);
      // Don't auto-open drawer — user can browse the list first
    },
    [],
  );

  const getCompletionStatus = useCallback(
    (techId: string) => completedIds.has(techId),
    [completedIds],
  );

  const collectAncestorIds = useCallback(
    (targetId: string): string[] => {
      const techMap = new Map(technologies.map((t) => [t.id, t]));
      const result = new Set<string>();
      function dfs(id: string) {
        for (const reqId of techMap.get(id)?.required ?? []) {
          if (!result.has(reqId)) {
            result.add(reqId);
            dfs(reqId);
          }
        }
      }
      dfs(targetId);
      return Array.from(result);
    },
    [technologies],
  );

  const collectDescendantIds = useCallback(
    (targetId: string): string[] => {
      const children = new Map<string, string[]>();
      technologies.forEach((t) => {
        (t.required ?? []).forEach((reqId) => {
          if (!children.has(reqId)) children.set(reqId, []);
          children.get(reqId)!.push(t.id);
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
    [technologies],
  );

  const handleToggleComplete = useCallback(
    async (techId: string) => {
      if (mode !== "select") return;
      const db = getWikiDB();
      const isCurrentlyCompleted = completedIds.has(techId);
      if (!isCurrentlyCompleted) {
        const idsToComplete = [techId, ...collectAncestorIds(techId)];
        await db.technos.bulkPut(
          idsToComplete.map((id) => ({ id: id, hidden: 1 })),
        );
      } else {
        const idsToUncheck = [techId, ...collectDescendantIds(techId)];
        await db.technos.bulkPut(
          idsToUncheck.map((id) => ({ id: id, hidden: 0 })),
        );
      }
    },
    [mode, completedIds, collectAncestorIds, collectDescendantIds],
  );

  const handleShowDetails = useCallback(
    (tech: TechnoData) => {
      if (mode !== "select") return;
      setSelectedTech(tech);
      setIsModalOpen(true);
    },
    [mode],
  );

  const handleCardClick = useCallback(
    (tech: TechnoData) => {
      if (mode === "ancestors-pick") {
        const { nodeIds, edgeIds } = getAllAncestors(tech.id, technologies);
        applyResult(nodeIds, edgeIds, true, tech.id);
        setMode("ancestors-result");
        return;
      }
      if (mode === "path-pick-from") {
        setPathFromId(tech.id);
        setMode("path-pick-to");
        return;
      }
      if (mode === "path-pick-to") {
        if (tech.id === pathFromId) return;
        const { nodeIds, edgeIds, found } = getSubgraphBetween(
          pathFromId!,
          tech.id,
          technologies,
        );
        applyResult(nodeIds, edgeIds, found, tech.id, pathFromId!);
        setMode("path-result");
        return;
      }
      if (mode === "ancestors-result" || mode === "path-result") {
        if (pathNodeIds.has(tech.id)) setIsPathDrawerOpen(true);
      }
    },
    [mode, pathFromId, technologies, applyResult, pathNodeIds],
  );

  const pathFromTech = technologies.find((t) => t.id === pathFromId) ?? null;
  const pathToTech = technologies.find((t) => t.id === pathToId) ?? null;
  const isResultMode = mode === "path-result" || mode === "ancestors-result";

  return (
    <>
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-background border-y border-border">
        {/* Tabs — underline style */}
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
            <List className="size-3.5" />
            Techno List
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
            <GitBranch className="size-3.5" />
            Research Tree
          </button>
        </div>

        {/* Toolbar — only on list tab */}
        {activeTab === "list" && (
          <div className="px-3 py-2 border-t border-border">
            {mode === "select" ? (
              /* Normal mode: 2 full-width buttons side by side */
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("ancestors-pick")}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-border rounded-lg py-2 hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <Target className="size-3.5 shrink-0" />
                  Prerequisites
                </button>
                <button
                  onClick={() => setMode("path-pick-from")}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-border rounded-lg py-2 hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <GitFork className="size-3.5 shrink-0" />
                  Path A → B
                </button>
              </div>
            ) : (
              /* Active mode: instruction + skip + cancel */
              <div className="flex items-center gap-2">
                {/* Instruction pill */}
                <div className="flex-1 min-w-0">
                  {mode === "ancestors-pick" && (
                    <span className="text-xs text-orange-400 font-semibold">
                      Select target tech
                    </span>
                  )}
                  {mode === "path-pick-from" && (
                    <span className="text-xs text-orange-400 font-semibold">
                      Select A
                    </span>
                  )}
                  {mode === "path-pick-to" && (
                    <span className="text-xs text-orange-400 font-semibold truncate block">
                      <span className="text-muted-foreground font-normal">
                        A:{" "}
                      </span>
                      {pathFromTech?.name}
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        → Select B
                      </span>
                    </span>
                  )}
                  {isResultMode && pathFound && (
                    <span className="text-xs text-orange-400 font-semibold truncate block">
                      {mode === "ancestors-result"
                        ? `Prerequisites · ${pathToTech?.name}`
                        : `${pathFromTech?.name} → ${pathToTech?.name}`}
                    </span>
                  )}
                  {isResultMode && !pathFound && (
                    <span className="text-xs text-red-400 font-semibold">
                      No path found
                    </span>
                  )}
                </div>

                {/* Skip done toggle */}
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
                    {excludeCompleted && (
                      <Check className="size-2.5 text-white stroke-[3]" />
                    )}
                  </div>
                  Skip done
                </button>

                {/* Cancel */}
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

      {/* ── Techno List tab ── */}
      {activeTab === "list" && (
        <div className="space-y-7 pt-5 pb-10">
          {groupedByColumn.map(([columnIndex, techs]) => (
            <div key={columnIndex} className="space-y-1.5">
              <div className="text-xs font-semibold text-muted-foreground/60 px-0.5">
                Column {columnIndex + 1}
              </div>
              <div className="space-y-1">
                {techs.map((tech) => {
                  const isPathFrom = tech.id === pathFromId;
                  const isPathTo = tech.id === pathToId;
                  const isOnPath =
                    isResultMode &&
                    pathNodeIds.has(tech.id) &&
                    !isPathFrom &&
                    !isPathTo;
                  const isPathDimmed =
                    (mode === "path-pick-to" || isResultMode) &&
                    !pathNodeIds.has(tech.id) &&
                    !isPathFrom;

                  return (
                    <div
                      key={tech.id}
                      onClick={() => {
                        if (mode !== "select") handleCardClick(tech);
                      }}
                      className={cn(
                        "transition-all duration-150",
                        mode !== "select" && "cursor-pointer",
                        (isPathFrom || isPathTo) &&
                          "ring-2 ring-orange-400/60 rounded-lg",
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
                      <TechCard
                        tech={tech}
                        eraId={selectedEraId ?? ""}
                        isCompleted={getCompletionStatus(tech.id)}
                        onToggleComplete={handleToggleComplete}
                        onShowDetails={
                          mode === "select" ? handleShowDetails : () => {}
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Research Tree tab ── */}
      {activeTab === "graph" && (
        <div className="h-[calc(100vh-200px)] min-h-[400px]">
          <TechTreeDesktop technologies={technologies} />
        </div>
      )}

      <TechDetailsModal
        tech={selectedTech}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <TechPathDrawer
        open={isPathDrawerOpen}
        onOpenChange={setIsPathDrawerOpen}
        fromTech={mode === "ancestors-result" ? null : pathFromTech}
        toTech={pathToTech}
        pathTechs={pathTechs}
      />

      {/* FAB — visible only in result mode on list tab */}
      {activeTab === "list" && isResultMode && pathFound && pathToTech && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsPathDrawerOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold rounded-full px-5 py-3 shadow-lg shadow-orange-500/20 transition-all"
          >
            <span className="size-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
              {pathTechs.length}
            </span>
            View total cost
          </button>
        </div>
      )}
    </>
  );
}
