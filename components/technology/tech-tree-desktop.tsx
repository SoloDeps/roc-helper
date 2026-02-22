"use client";

import React, {
  useCallback,
  useContext,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { buildGraphData, layoutGraph } from "@/lib/layout-graph";
import { TechDetailsPanel } from "./tech-details-panel";
import { TechPathPanel } from "./tech-path-panel";
import type { TechnoData } from "@/types/shared";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import { Handle, Position } from "@xyflow/react";
import { cn, getCityCrestIconLocal } from "@/lib/utils";
import { GitFork, X, Target, Check } from "lucide-react";
import {
  getAllAncestors,
  getSubgraphBetween,
  getOrderedTechs,
} from "@/lib/path-utils";
import Image from "next/image";
import { ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import { getGoodNameFromPriorityEra, getItemIconLocal } from "@/lib/utils";

// ============================================================
// Helper: collect all ancestor IDs (for cascade completion)
// ============================================================
function collectAncestorIds(
  targetId: string,
  technologies: TechnoData[],
): string[] {
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
}

function collectDescendantIds(
  targetId: string,
  technologies: TechnoData[],
): string[] {
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
}

// ============================================================
// Context
// ============================================================
type Mode =
  | "select"
  | "path-pick-from"
  | "path-pick-to"
  | "path-result"
  | "ancestors-pick"
  | "ancestors-result";

interface SelectionCtx {
  selectedNodeId: string | null;
  connectedNodeIds: Set<string>;
  mode: Mode;
  pathFromId: string | null;
  pathToId: string | null;
  pathNodeIds: Set<string>;
  ancestorsOfFrom: Set<string>;
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
}

const SelectionContext = createContext<SelectionCtx>({
  selectedNodeId: null,
  connectedNodeIds: new Set(),
  mode: "select",
  pathFromId: null,
  pathToId: null,
  pathNodeIds: new Set(),
  ancestorsOfFrom: new Set(),
  completedIds: new Set(),
  onToggleComplete: () => {},
});

// ============================================================
// TechNode — image-based game-style node
// ============================================================
function TechNodeWithContext({ id, data, selected }: any) {
  const {
    selectedNodeId,
    connectedNodeIds,
    mode,
    pathFromId,
    pathToId,
    pathNodeIds,
    ancestorsOfFrom,
    completedIds,
    onToggleComplete,
  } = useContext(SelectionContext);
  const userSelections = useBuildingSelections();
  const { name, allied, costs } = data;

  const isCompleted = completedIds.has(id);
  const isSelectMode = mode === "select";
  const hasSelection = isSelectMode && selectedNodeId !== null;
  const isSelected = isSelectMode && (selected || id === selectedNodeId);
  const isConnected = isSelectMode && connectedNodeIds.has(id) && !isSelected;
  const isDimmed = hasSelection && !isSelected && !isConnected;

  const isPathFrom = id === pathFromId;
  const isPathTo = id === pathToId;
  const isOnPath =
    (mode === "path-result" || mode === "ancestors-result") &&
    pathNodeIds.has(id) &&
    !isPathFrom &&
    !isPathTo;
  const isPathDimmed =
    ((mode === "path-result" || mode === "ancestors-result") &&
      !pathNodeIds.has(id)) ||
    (mode === "path-pick-to" && ancestorsOfFrom.has(id));
  const isPicking =
    mode === "path-pick-from" ||
    mode === "path-pick-to" ||
    mode === "ancestors-pick";

  // Derive era folder from tech id: "ba_1" -> "ba" -> "bronze_age"
  const abbr = id.split("_")[0];
  const eraFolder = ABBR_TO_ERA_ID[abbr] ?? abbr;

  // Resolve Primary/Secondary/Tertiary Good → actual good name (e.g. "gold_laurel")
  const workshopMatch = name.match(/^(Primary|Secondary|Tertiary)\s+Good$/i);
  const resolvedGoodName = workshopMatch
    ? getGoodNameFromPriorityEra(
        workshopMatch[1],
        abbr.toUpperCase(),
        userSelections,
      )
    : null;

  // "gold_laurel" → "Gold Laurel"
  const formatGoodName = (raw: string) =>
    raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const displayName = resolvedGoodName
    ? formatGoodName(resolvedGoodName)
    : name;
  // Large goods images will live in /images/goods-large/ once ready — falls back to badge icon for now
  const imgSrc = resolvedGoodName
    ? `/images/goods-large/${resolvedGoodName}.webp`
    : eraFolder
      ? `/images/technos/${eraFolder}/${id}.webp`
      : null;
  const imgFallback = resolvedGoodName
    ? getItemIconLocal(resolvedGoodName)
    : null;

  // mt-3 on wrapper to allow image overflow upward (handled by ReactFlow node wrapper via style)
  return (
    <div
      className={cn(
        "relative",
        isDimmed && "opacity-20",
        isPathDimmed && "opacity-15",
      )}
    >
      {/* Image absolute — déborde au-dessus du node */}
      {imgSrc && (
        <div className="absolute -top-1 left-2.5 size-11 z-10 pointer-events-none">
          <Image
            src={imgSrc}
            alt={displayName}
            fill
            className={cn("object-contain drop-shadow-lg")}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (imgFallback && target.src !== imgFallback) {
                target.src = imgFallback;
              } else {
                target.style.display = "none";
              }
            }}
          />
        </div>
      )}

      {/* Node card */}
      <div
        className={cn(
          "relative border rounded-md overflow-visible",
          "w-[200px] h-13",
          "flex items-center",
          "transition-all duration-200 cursor-pointer",
          isCompleted
            ? "bg-green-600/15 border-green-600/50 dark:bg-green-950/60 dark:border-green-500/50"
            : "bg-card border-border",
          isSelected &&
            "border-primary shadow-xl scale-105 ring-2 ring-primary/40",
          isConnected &&
            "border-blue-500/70 ring-1 ring-blue-500/30 bg-blue-500/10 dark:border-blue-400/70 dark:ring-blue-400/30 dark:bg-blue-950/30",
          !isCompleted &&
            !isSelected &&
            !isConnected &&
            !isDimmed &&
            isSelectMode &&
            "hover:border-primary/50",
          isPathFrom &&
            "border-orange-500 ring-2 ring-orange-500/50 bg-orange-500/15 dark:bg-orange-950/30 scale-105",
          isPathTo &&
            "border-orange-500 ring-2 ring-orange-500/50 bg-orange-500/15 dark:bg-orange-950/30 scale-105",
          isOnPath &&
            "border-orange-400/60 bg-orange-500/10 dark:bg-orange-950/20",
          isPicking &&
            "hover:border-orange-500/70 hover:bg-orange-500/10 dark:hover:border-orange-400/70 dark:hover:bg-orange-950/20",
        )}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!opacity-0 !pointer-events-none"
        />

        {/* Spacer pour laisser place à l'image absolute */}
        <div className="shrink-0 w-16" />

        {/* Nom & RP */}
        <div className="flex flex-col justify-center gap-0.5 size-full min-w-0 w-full py-1 pr-2">
          <span
            className={cn(
              "font-semibold text-[11px] leading-tight line-clamp-2 block max-sm:font-pro!",
              isCompleted && "text-green-700 dark:text-green-400",
              isPathFrom && "text-orange-600 dark:text-orange-300",
              isPathTo && "text-orange-600 dark:text-orange-300",
            )}
          >
            {displayName}
          </span>
          <span className="font-semibold text-[9px] text-muted-foreground">
            {costs.research_points} RP
          </span>
        </div>

        {/* Checkbox — div, pas button imbriqué dans un div cliquable ReactFlow */}
        <div
          role="checkbox"
          aria-checked={isCompleted}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(id);
          }}
          className={cn(
            "shrink-0 mr-2 size-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
            isCompleted
              ? "bg-green-500 border-green-500"
              : "border-muted-foreground/40 hover:border-green-600 dark:hover:border-green-400",
          )}
        >
          {isCompleted && <Check className="size-2.5 text-white stroke-[3]" />}
        </div>

        {/* Allied crest */}
        {allied && (
          <div className="absolute -top-2 -right-2 z-20 pointer-events-none">
            <Image
              src={getCityCrestIconLocal(allied)}
              alt={allied}
              width={100}
              height={100}
              className="object-contain size-6 select-none"
            />
          </div>
        )}

        {/* Path A/B badge */}
        {isPathFrom && (
          <div className="absolute -top-2 -left-2 z-20 bg-orange-500 text-white text-[10px] size-5 flex items-center justify-center rounded-full font-bold shadow">
            A
          </div>
        )}
        {isPathTo && (
          <div className="absolute -top-2 -left-2 z-20 bg-orange-500 text-white text-[10px] size-5 flex items-center justify-center rounded-full font-bold shadow">
            B
          </div>
        )}

        <Handle
          type="source"
          position={Position.Right}
          className="!opacity-0 !pointer-events-none"
        />
      </div>
    </div>
  );
}

const nodeTypes = { custom: TechNodeWithContext };

// ============================================================
// External control interface — used by TechTreeMobile to share state
// ============================================================
export interface TechTreeExternalControl {
  mode: Mode;
  setMode: (m: Mode) => void;
  pathFromId: string | null;
  setPathFromId: (id: string | null) => void;
  pathToId: string | null;
  setPathToId: (id: string | null) => void;
  pathRawNodeIds: Set<string>;
  setPathRawNodeIds: (s: Set<string>) => void;
  pathRawEdgeIds: Set<string>;
  setPathRawEdgeIds: (s: Set<string>) => void;
  pathFound: boolean;
  setPathFound: (f: boolean) => void;
  excludeCompleted: boolean;
  setExcludeCompleted: (v: boolean | ((prev: boolean) => boolean)) => void;
  selectedTech: TechnoData | null;
  setSelectedTech: (t: TechnoData | null) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  onOpenPathDrawer: () => void;
}

// ============================================================
// Main
// ============================================================
interface TechTreeDesktopProps {
  technologies: TechnoData[];
  externalControl?: TechTreeExternalControl;
  hideControls?: boolean;
}

export function TechTreeDesktop({
  technologies,
  externalControl,
  hideControls = false,
}: TechTreeDesktopProps) {
  const isExternal = !!externalControl;

  // Internal state — only used in standalone desktop mode
  const [_selectedTech, _setSelectedTech] = useState<TechnoData | null>(null);
  const [_selectedNodeId, _setSelectedNodeId] = useState<string | null>(null);
  const [_mode, _setMode] = useState<Mode>("select");
  const [_pathFromId, _setPathFromId] = useState<string | null>(null);
  const [_pathToId, _setPathToId] = useState<string | null>(null);
  const [_pathRawNodeIds, _setPathRawNodeIds] = useState(new Set<string>());
  const [_pathRawEdgeIds, _setPathRawEdgeIds] = useState(new Set<string>());
  const [_pathFound, _setPathFound] = useState(true);
  const [_excludeCompleted, _setExcludeCompleted] = useState(true);

  // Route to external or internal state
  const selectedTech = isExternal
    ? externalControl.selectedTech
    : _selectedTech;
  const setSelectedTech = isExternal
    ? externalControl.setSelectedTech
    : _setSelectedTech;
  const selectedNodeId = isExternal
    ? externalControl.selectedNodeId
    : _selectedNodeId;
  const setSelectedNodeId = isExternal
    ? externalControl.setSelectedNodeId
    : _setSelectedNodeId;
  const mode = isExternal ? externalControl.mode : _mode;
  const setMode = isExternal ? externalControl.setMode : _setMode;
  const pathFromId = isExternal ? externalControl.pathFromId : _pathFromId;
  const setPathFromId = isExternal
    ? externalControl.setPathFromId
    : _setPathFromId;
  const pathToId = isExternal ? externalControl.pathToId : _pathToId;
  const setPathToId = isExternal ? externalControl.setPathToId : _setPathToId;
  const pathRawNodeIds = isExternal
    ? externalControl.pathRawNodeIds
    : _pathRawNodeIds;
  const setPathRawNodeIds = isExternal
    ? externalControl.setPathRawNodeIds
    : _setPathRawNodeIds;
  const pathRawEdgeIds = isExternal
    ? externalControl.pathRawEdgeIds
    : _pathRawEdgeIds;
  const setPathRawEdgeIds = isExternal
    ? externalControl.setPathRawEdgeIds
    : _setPathRawEdgeIds;
  const pathFound = isExternal ? externalControl.pathFound : _pathFound;
  const setPathFound = isExternal
    ? externalControl.setPathFound
    : _setPathFound;
  const excludeCompleted = isExternal
    ? externalControl.excludeCompleted
    : _excludeCompleted;
  const setExcludeCompleted = isExternal
    ? externalControl.setExcludeCompleted
    : _setExcludeCompleted;

  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos
      .where("id")
      .anyOf(technologies.map((t) => t.id))
      .toArray();
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

  const onToggleComplete = useCallback(
    async (techId: string) => {
      const db = getWikiDB();
      const isCurrentlyCompleted = completedIds.has(techId);
      if (!isCurrentlyCompleted) {
        const idsToComplete = [
          techId,
          ...collectAncestorIds(techId, technologies),
        ];
        await db.technos.bulkPut(
          idsToComplete.map((id) => ({ id: id, hidden: 1 })),
        );
      } else {
        const idsToUncheck = [
          techId,
          ...collectDescendantIds(techId, technologies),
        ];
        await db.technos.bulkPut(
          idsToUncheck.map((id) => ({ id: id, hidden: 0 })),
        );
      }
    },
    [completedIds, technologies],
  );

  const { baseNodes, baseEdges } = useMemo(() => {
    const enriched = technologies.map((tech) => ({
      ...tech,
      completed: technosInDB?.find((t) => t.id === tech.id)?.hidden ?? false,
    }));
    const { nodes, edges } = buildGraphData(enriched as any);
    return {
      baseNodes: layoutGraph(nodes, edges, "LR", enriched as any),
      baseEdges: edges,
    };
  }, [technologies, technosInDB]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId || mode !== "select") return new Set<string>();
    const ids = new Set<string>();
    baseEdges.forEach((e) => {
      if (e.source === selectedNodeId || e.target === selectedNodeId) {
        ids.add(e.source);
        ids.add(e.target);
      }
    });
    ids.delete(selectedNodeId);
    return ids;
  }, [selectedNodeId, baseEdges, mode]);

  const styledEdges = useMemo(() => {
    const isPathMode = mode === "path-result" || mode === "ancestors-result";
    if (isPathMode) {
      return baseEdges.map((edge) => {
        if (pathEdgeIds.has(edge.id))
          return {
            ...edge,
            style: { stroke: "#f97316", strokeWidth: 2.5 },
            markerEnd: { type: "arrowclosed" as const, color: "#f97316" },
            animated: true,
            zIndex: 10,
          };
        return {
          ...edge,
          style: { stroke: "#374151", strokeWidth: 1, opacity: 0.15 },
          markerEnd: { type: "arrowclosed" as const, color: "#374151" },
          animated: false,
          zIndex: 0,
        };
      });
    }
    if (mode === "select" && selectedNodeId) {
      return baseEdges.map((edge) => {
        const isConn =
          edge.source === selectedNodeId || edge.target === selectedNodeId;
        const color = edge.target === selectedNodeId ? "#3b82f6" : "#22c55e";
        if (isConn)
          return {
            ...edge,
            style: { stroke: color, strokeWidth: 2.5 },
            markerEnd: { type: "arrowclosed" as const, color },
            animated: true,
            zIndex: 10,
          };
        const bothCompleted =
          completedIds.has(edge.source) && completedIds.has(edge.target);
        if (bothCompleted)
          return {
            ...edge,
            style: { stroke: "#22c55e", strokeWidth: 1.5, opacity: 0.4 },
            markerEnd: { type: "arrowclosed" as const, color: "#22c55e" },
            animated: false,
            zIndex: 0,
          };
        return {
          ...edge,
          style: { stroke: "#374151", strokeWidth: 1, opacity: 0.2 },
          markerEnd: { type: "arrowclosed" as const, color: "#374151" },
          animated: false,
          zIndex: 0,
        };
      });
    }
    return baseEdges.map((edge) => {
      const bothCompleted =
        completedIds.has(edge.source) && completedIds.has(edge.target);
      if (bothCompleted)
        return {
          ...edge,
          style: { stroke: "#22c55e", strokeWidth: 1.5 },
          markerEnd: { type: "arrowclosed" as const, color: "#22c55e" },
          animated: false,
          zIndex: 5,
        };
      return {
        ...edge,
        style: { stroke: "var(--edge-color)", strokeWidth: 1.5 },
        markerEnd: { type: "arrowclosed" as const, color: "var(--edge-color)" },
        animated: false,
        zIndex: 0,
      };
    });
  }, [mode, pathEdgeIds, selectedNodeId, baseEdges, completedIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(styledEdges);
  useEffect(() => {
    setNodes(baseNodes);
  }, [baseNodes, setNodes]);
  useEffect(() => {
    setEdges(styledEdges);
  }, [styledEdges, setEdges]);

  const reset = useCallback(() => {
    setMode("select");
    setPathFromId(null);
    setPathToId(null);
    setPathRawNodeIds(new Set());
    setPathRawEdgeIds(new Set());
    setPathFound(true);
  }, [setMode, setPathFromId, setPathToId, setPathRawNodeIds, setPathRawEdgeIds, setPathFound]);

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
    },
    [setPathRawNodeIds, setPathRawEdgeIds, setPathFound, setPathToId, setPathFromId],
  );

  const onInit = useCallback((instance: any) => {
    instance.fitView({ padding: 0.2 });
  }, []);

  const onNodeClick = useCallback(
    (_e: React.MouseEvent, node: any) => {
      if (mode === "ancestors-pick") {
        const { nodeIds, edgeIds } = getAllAncestors(node.id, technologies);
        applyResult(nodeIds, edgeIds, true, node.id);
        setMode("ancestors-result");
        return;
      }
      if (mode === "path-pick-from") {
        setPathFromId(node.id);
        setMode("path-pick-to");
        return;
      }
      if (mode === "path-pick-to") {
        if (node.id === pathFromId) return;
        const { nodeIds, edgeIds, found } = getSubgraphBetween(
          pathFromId!,
          node.id,
          technologies,
        );
        applyResult(nodeIds, edgeIds, found, node.id, pathFromId!);
        setMode("path-result");
        return;
      }
      const tech = technologies.find((t) => t.id === node.id);
      if (tech) {
        setSelectedTech(tech);
        setSelectedNodeId(node.id);
      }
    },
    [mode, pathFromId, technologies, applyResult, setMode, setPathFromId, setSelectedNodeId, setSelectedTech],
  );

  const onPaneClick = useCallback(() => {
    if (mode === "select") {
      setSelectedTech(null);
      setSelectedNodeId(null);
    }
  }, [mode, setSelectedTech, setSelectedNodeId]);

  const pathFromTech = technologies.find((t) => t.id === pathFromId) ?? null;
  const pathToTech = technologies.find((t) => t.id === pathToId) ?? null;

  // Ancestors of A — dimmed during pick-to so user sees only forward candidates
  const ancestorsOfFrom = useMemo(() => {
    if (!pathFromId || mode !== "path-pick-to") return new Set<string>();
    return new Set(collectAncestorIds(pathFromId, technologies));
  }, [pathFromId, mode, technologies]);

  const ctx = useMemo(
    () => ({
      selectedNodeId: mode === "select" ? selectedNodeId : null,
      connectedNodeIds,
      mode,
      pathFromId,
      pathToId,
      pathNodeIds,
      ancestorsOfFrom,
      completedIds,
      onToggleComplete,
    }),
    [
      selectedNodeId,
      connectedNodeIds,
      mode,
      pathFromId,
      pathToId,
      pathNodeIds,
      ancestorsOfFrom,
      completedIds,
      onToggleComplete,
    ],
  );

  const isPathMode = mode === "path-result" || mode === "ancestors-result";

  return (
    <SelectionContext.Provider value={ctx}>
      <div className="w-full h-[calc(100vh-200px)] min-h-[500px] border border-border md:rounded-lg overflow-hidden bg-background-300/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          {!hideControls && (
            <Controls
              showInteractive={false}
              className="[&>button]:bg-background! dark:[&>button]:bg-background-200! dark:[&>button]:text-white! [&>button]:text-black! [&>button]:border-gray-400!"
            />
          )}

          <Panel position="top-left" className="m-2 flex flex-col gap-1.5">
            {mode === "select" ? (
              <>
                <button
                  onClick={() => setMode("ancestors-pick")}
                  className="flex items-center gap-1.5 text-xs bg-background/90 border border-border rounded-md px-3 py-1.5 shadow hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <Target className="size-3.5" />
                  Prerequisites
                </button>
                <button
                  onClick={() => setMode("path-pick-from")}
                  className="flex items-center gap-1.5 text-xs bg-background/90 border border-border rounded-md px-3 py-1.5 shadow hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <GitFork className="size-3.5" />
                  Path A → B
                </button>
              </>
            ) : (
              <div className="flex flex-row gap-1.5">
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 text-xs bg-background/90 border border-orange-400/50 text-orange-400 rounded-lg px-3 py-1.5 shadow hover:bg-orange-500/10 transition-colors"
                >
                  <X className="size-3.5" />
                  Cancel
                </button>
                <button
                  onClick={() => setExcludeCompleted((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs bg-background/90 border rounded-lg px-3 py-1.5 shadow transition-colors",
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
              </div>
            )}
          </Panel>

          {mode !== "select" && !isPathMode && (
            <Panel position="bottom-center" className="mb-2">
              <div className="bg-background/95 border border-border rounded-lg px-4 py-2 text-xs shadow text-center">
                {mode === "ancestors-pick" && (
                  <p className="text-orange-400 font-medium">
                    Click the <span className="font-bold">target</span> tech
                  </p>
                )}
                {mode === "path-pick-from" && (
                  <p className="text-orange-400 font-medium">
                    Click the <span className="font-bold">start</span> (A)
                  </p>
                )}
                {mode === "path-pick-to" && (
                  <p className="text-orange-400 font-medium">
                    <span className="text-muted-foreground font-normal">
                      From{" "}
                    </span>
                    {pathFromTech?.name}
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      →{" "}
                    </span>
                    <span className="font-bold">destination</span> (B)
                  </p>
                )}
              </div>
            </Panel>
          )}
          {isPathMode && !pathFound && (
            <Panel position="bottom-center" className="mb-2">
              <div className="bg-background/95 border border-border rounded-lg px-4 py-2 text-xs shadow">
                <p className="text-red-400 font-medium">No path found</p>
              </div>
            </Panel>
          )}
          {mode === "select" && selectedNodeId && (
            <Panel position="bottom-center" className="mb-2">
              <div className="flex items-center gap-4 bg-background/90 border border-border rounded-lg px-3 py-1.5 text-xs shadow">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-blue-500" />
                  <span className="text-muted-foreground">Prerequisites</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-green-500" />
                  <span className="text-muted-foreground">Unlocks</span>
                </div>
              </div>
            </Panel>
          )}
          {/* Side panels — hidden in mobile/external mode (FAB drawer is used instead) */}
          {!isExternal && selectedTech && mode === "select" && (
            <Panel
              position="top-right"
              className="m-2 w-[330px] md:w-[360px] rounded-lg! overflow-hidden!"
            >
              <TechDetailsPanel
                tech={selectedTech}
                onClose={() => {
                  setSelectedTech(null);
                  setSelectedNodeId(null);
                }}
              />
            </Panel>
          )}
          {!isExternal && isPathMode && pathFound && pathToTech && (
            <Panel
              position="top-right"
              className="m-2 w-[330px] md:w-[360px] rounded-lg! overflow-hidden!"
            >
              <TechPathPanel
                fromTech={mode === "ancestors-result" ? null : pathFromTech}
                toTech={pathToTech}
                pathTechs={pathTechs}
                onClose={reset}
              />
            </Panel>
          )}
          {/* In mobile/external mode: FAB trigger on result */}
          {isExternal && isPathMode && pathFound && pathToTech && (
            <Panel position="bottom-center" className="mb-16">
              <button
                onClick={() => externalControl.onOpenPathDrawer()}
                className="flex items-center gap-2 text-xs bg-background/90 border border-orange-400/50 text-orange-400 rounded-lg px-3 py-1.5 shadow hover:bg-orange-500/10 transition-colors"
              >
                View total cost
              </button>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </SelectionContext.Provider>
  );
}
