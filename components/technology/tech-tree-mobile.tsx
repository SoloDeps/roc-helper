"use client";

import React, { useMemo, useState, useCallback } from "react";
import { TechCard } from "./tech-card";
import { TechDetailsModal } from "./tech-details-modal";
import { TechPathDrawer } from "./tech-path-drawer";
import type { TechnoData } from "@/types/shared";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import { GitFork, X, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAllAncestors,
  getSubgraphBetween,
  getOrderedTechs,
} from "@/lib/path-utils";

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
  const [selectedTech, setSelectedTech] = useState<TechnoData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] = useState<Mode>("select");
  const [pathFromId, setPathFromId] = useState<string | null>(null);
  const [pathToId, setPathToId] = useState<string | null>(null);
  const [pathNodeIds, setPathNodeIds] = useState(new Set<string>());
  const [pathEdgeIds, setPathEdgeIds] = useState(new Set<string>());
  const [pathFound, setPathFound] = useState(true);
  const [pathTechs, setPathTechs] = useState<TechnoData[]>([]);
  const [isPathDrawerOpen, setIsPathDrawerOpen] = useState(false);

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

  const reset = useCallback(() => {
    setMode("select");
    setPathFromId(null);
    setPathToId(null);
    setPathNodeIds(new Set());
    setPathEdgeIds(new Set());
    setPathFound(true);
    setPathTechs([]);
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
      setPathNodeIds(nodeIds);
      setPathEdgeIds(edgeIds);
      setPathFound(found);
      setPathTechs(found ? getOrderedTechs(nodeIds, technologies) : []);
      setPathToId(toId);
      if (fromId) setPathFromId(fromId);
      if (found) setIsPathDrawerOpen(true);
    },
    [technologies],
  );

  // Completed IDs set
  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    technosInDB?.forEach((t) => {
      if (t.hidden) ids.add(t.id);
    });
    return ids;
  }, [technosInDB]);

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
      const now = Date.now();
      if (!isCurrentlyCompleted) {
        const idsToComplete = [techId, ...collectAncestorIds(techId)];
        await db.technos.bulkPut(
          idsToComplete.map((id) => ({ id, hidden: true, updatedAt: now })),
        );
      } else {
        const idsToUncheck = [techId, ...collectDescendantIds(techId)];
        await db.technos.bulkPut(
          idsToUncheck.map((id) => ({ id, hidden: false, updatedAt: now })),
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
      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-20 bg-background pb-2 pt-1 space-y-1.5">
        {mode === "select" ? (
          <div className="flex gap-2">
            <button
              onClick={() => setMode("ancestors-pick")}
              className="flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 hover:border-orange-400/70 hover:text-orange-400 transition-colors"
            >
              <Target className="size-3.5" />
              Prérequis
            </button>
            <button
              onClick={() => setMode("path-pick-from")}
              className="flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 hover:border-orange-400/70 hover:text-orange-400 transition-colors"
            >
              <GitFork className="size-3.5" />
              Chemin A → B
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs flex-1 min-w-0">
              {mode === "ancestors-pick" && (
                <span className="text-orange-400 font-medium">
                  Cliquez sur la techno cible
                </span>
              )}
              {mode === "path-pick-from" && (
                <span className="text-orange-400 font-medium">
                  Sélectionnez le départ (A)
                </span>
              )}
              {mode === "path-pick-to" && (
                <span className="text-orange-400 font-medium truncate block">
                  <span className="text-muted-foreground font-normal">De </span>
                  {pathFromTech?.name}
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    → arrivée (B)
                  </span>
                </span>
              )}
              {isResultMode && pathFound && (
                <button
                  onClick={() => setIsPathDrawerOpen(true)}
                  className="flex items-center gap-1.5 text-orange-400 font-medium hover:underline underline-offset-2 truncate"
                >
                  {mode === "ancestors-result" ? (
                    <span>
                      Prérequis de{" "}
                      <span className="font-bold">{pathToTech?.name}</span>
                    </span>
                  ) : (
                    <>
                      <span className="truncate max-w-[80px]">
                        {pathFromTech?.name}
                      </span>
                      <ArrowRight className="size-3 shrink-0" />
                      <span className="truncate max-w-[80px]">
                        {pathToTech?.name}
                      </span>
                    </>
                  )}
                  <span className="text-muted-foreground font-normal shrink-0">
                    · {pathTechs.filter((t) => t.id !== pathToId).length} étapes
                  </span>
                </button>
              )}
              {isResultMode && !pathFound && (
                <span className="text-red-400 font-medium">
                  Aucun chemin trouvé
                </span>
              )}
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs border border-orange-400/50 text-orange-400 rounded-lg px-2.5 py-1.5 hover:bg-orange-500/10 transition-colors shrink-0"
            >
              <X className="size-3.5" />
              Annuler
            </button>
          </div>
        )}
      </div>

      {/* ── Tech list ── */}
      <div className="space-y-6 pb-4">
        {groupedByColumn.map(([columnIndex, techs]) => (
          <div key={columnIndex} className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground px-0.5">
              Colonne {columnIndex + 1}
            </div>
            <div className="space-y-2">
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
                          {isPathFrom ? "Départ" : "Arrivée"}
                        </span>
                      </div>
                    )}
                    <TechCard
                      tech={tech}
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

      <TechDetailsModal
        tech={selectedTech}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <TechPathDrawer
        open={isPathDrawerOpen}
        onOpenChange={(open) => {
          setIsPathDrawerOpen(open);
          if (!open) reset();
        }}
        fromTech={mode === "ancestors-result" ? null : pathFromTech}
        toTech={pathToTech}
        pathTechs={pathTechs}
      />
    </>
  );
}
