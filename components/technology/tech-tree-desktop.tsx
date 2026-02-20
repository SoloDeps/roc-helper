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
import { getWikiDB, techIdToDbId, dbIdToTechId } from "@/lib/db/schema";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { GitFork, X, Target, Check } from "lucide-react";
import {
  getAllAncestors,
  getSubgraphBetween,
  getOrderedTechs,
} from "@/lib/path-utils";

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
  // Build children map: id -> list of techs that require it
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
  completedIds: new Set(),
  onToggleComplete: () => {},
});

// ============================================================
// TechNode — fixed width, checkbox, green when completed
// ============================================================
function TechNodeWithContext({ id, data, selected }: any) {
  const {
    selectedNodeId,
    connectedNodeIds,
    mode,
    pathFromId,
    pathToId,
    pathNodeIds,
    completedIds,
    onToggleComplete,
  } = useContext(SelectionContext);
  const { name, allied } = data;

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
    (mode === "path-result" || mode === "ancestors-result") &&
    !pathNodeIds.has(id);
  const isPicking =
    mode === "path-pick-from" ||
    mode === "path-pick-to" ||
    mode === "ancestors-pick";

  return (
    <div
      className={cn(
        // ✅ Fixed width
        "relative border rounded-sm px-2 py-2 w-[180px]",
        "flex items-center gap-2",
        "transition-all duration-200 cursor-pointer",
        // Completed = green
        isCompleted
          ? "bg-green-500/15 border-green-500/50"
          : "bg-card border-border",
        isSelected &&
          "border-primary shadow-xl scale-105 ring-2 ring-primary/40",
        isConnected &&
          "border-blue-400/70 ring-1 ring-blue-400/30 bg-blue-500/5",
        isDimmed && "opacity-25",
        !isCompleted &&
          !isSelected &&
          !isConnected &&
          !isDimmed &&
          isSelectMode &&
          "hover:border-primary/50",
        isPathFrom &&
          "border-orange-400 ring-2 ring-orange-400/50 bg-orange-500/10 scale-105",
        isPathTo &&
          "border-orange-400 ring-2 ring-orange-400/50 bg-orange-500/10 scale-105",
        isOnPath && "border-orange-300/70 bg-orange-500/5",
        isPathDimmed && "opacity-20",
        isPicking && "hover:border-orange-400/70 hover:bg-orange-500/5",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border !border-background"
      />

      {/* ✅ Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(id);
        }}
        className={cn(
          "shrink-0 size-4 rounded border-2 flex items-center justify-center transition-all",
          isCompleted
            ? "bg-green-500 border-green-500"
            : "border-muted-foreground/40 hover:border-green-400",
        )}
      >
        {isCompleted && <Check className="size-2.5 text-white stroke-[3]" />}
      </button>

      {/* Name */}
      <div
        className={cn(
          "font-semibold text-xs text-left leading-tight flex-1 truncate",
          isCompleted && "text-green-400",
        )}
      >
        {name}
      </div>

      {allied && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-md">
          {allied}
        </div>
      )}
      {isPathFrom && (
        <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow">
          A
        </div>
      )}
      {isPathTo && (
        <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow">
          B
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary !border-2 !border-background"
      />
    </div>
  );
}

const nodeTypes = { custom: TechNodeWithContext };

// ============================================================
// Main
// ============================================================
interface TechTreeDesktopProps {
  technologies: TechnoData[];
}

export function TechTreeDesktop({ technologies }: TechTreeDesktopProps) {
  const [selectedTech, setSelectedTech] = useState<TechnoData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("select");
  const [pathFromId, setPathFromId] = useState<string | null>(null);
  const [pathToId, setPathToId] = useState<string | null>(null);
  const [pathNodeIds, setPathNodeIds] = useState(new Set<string>());
  const [pathEdgeIds, setPathEdgeIds] = useState(new Set<string>());
  const [pathFound, setPathFound] = useState(true);
  const [pathTechs, setPathTechs] = useState<TechnoData[]>([]);

  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos
      .where("id")
      .anyOf(technologies.map((t) => techIdToDbId(t.id)))
      .toArray();
  }, [technologies]);

  // ✅ Completed IDs set
  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    technosInDB?.forEach((t) => {
      if (t.hidden) ids.add(dbIdToTechId(t.id));
    });
    return ids;
  }, [technosInDB]);

  // ✅ Toggle completion with ancestor cascade
  const onToggleComplete = useCallback(
    async (techId: string) => {
      const db = getWikiDB();
      const isCurrentlyCompleted = completedIds.has(techId);

      const now = Date.now();
      if (!isCurrentlyCompleted) {
        const idsToComplete = [
          techId,
          ...collectAncestorIds(techId, technologies),
        ];
        await db.technos.bulkPut(
          idsToComplete.map((id) => ({ id: techIdToDbId(id), hidden: 1 })),
        );
      } else {
        const idsToUncheck = [
          techId,
          ...collectDescendantIds(techId, technologies),
        ];
        await db.technos.bulkPut(
          idsToUncheck.map((id) => ({ id: techIdToDbId(id), hidden: 0 })),
        );
      }
    },
    [completedIds, technologies],
  );

  const { baseNodes, baseEdges } = useMemo(() => {
    const enriched = technologies.map((tech) => ({
      ...tech,
      completed:
        technosInDB?.find((t) => t.id === techIdToDbId(tech.id))?.hidden ??
        false,
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
        // Still show green for completed edges even when dimmed
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
    // Default: green if both nodes completed, grey otherwise
    return baseEdges.map((edge) => {
      const bothCompleted =
        completedIds.has(edge.source) && completedIds.has(edge.target);
      if (bothCompleted)
        return {
          ...edge,
          style: { stroke: "#22c55e", strokeWidth: 1.5 },
          markerEnd: { type: "arrowclosed" as const, color: "#22c55e" },
          animated: false,
        };
      return {
        ...edge,
        style: { stroke: "#6b7280", strokeWidth: 1.5 },
        markerEnd: { type: "arrowclosed" as const, color: "#6b7280" },
        animated: false,
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
    setPathNodeIds(new Set());
    setPathEdgeIds(new Set());
    setPathFound(true);
    setPathTechs([]);
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
    },
    [technologies],
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
    [mode, pathFromId, technologies, applyResult],
  );

  const onPaneClick = useCallback(() => {
    if (mode === "select") {
      setSelectedTech(null);
      setSelectedNodeId(null);
    }
  }, [mode]);

  const pathFromTech = technologies.find((t) => t.id === pathFromId) ?? null;
  const pathToTech = technologies.find((t) => t.id === pathToId) ?? null;

  const ctx = useMemo(
    () => ({
      selectedNodeId: mode === "select" ? selectedNodeId : null,
      connectedNodeIds,
      mode,
      pathFromId,
      pathToId,
      pathNodeIds,
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
      completedIds,
      onToggleComplete,
    ],
  );

  const isPathMode = mode === "path-result" || mode === "ancestors-result";

  return (
    <SelectionContext.Provider value={ctx}>
      <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden bg-background-300/20">
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
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Controls
            showInteractive={false}
            className="[&>button]:bg-background! dark:[&>button]:bg-background-200! dark:[&>button]:text-white! [&>button]:text-black! [&>button]:border-gray-400!"
          />

          <Panel position="top-left" className="m-2 flex flex-col gap-1.5">
            {mode === "select" ? (
              <>
                <button
                  onClick={() => setMode("ancestors-pick")}
                  className="flex items-center gap-1.5 text-xs bg-background/90 border border-border rounded-lg px-3 py-1.5 shadow hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <Target className="size-3.5" />
                  Prérequis d'une techno
                </button>
                <button
                  onClick={() => setMode("path-pick-from")}
                  className="flex items-center gap-1.5 text-xs bg-background/90 border border-border rounded-lg px-3 py-1.5 shadow hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                >
                  <GitFork className="size-3.5" />
                  Chemin A → B
                </button>
              </>
            ) : (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs bg-background/90 border border-orange-400/50 text-orange-400 rounded-lg px-3 py-1.5 shadow hover:bg-orange-500/10 transition-colors"
              >
                <X className="size-3.5" />
                Annuler
              </button>
            )}
          </Panel>

          {mode !== "select" && !isPathMode && (
            <Panel position="bottom-center" className="mb-2">
              <div className="bg-background/95 border border-border rounded-lg px-4 py-2 text-xs shadow text-center">
                {mode === "ancestors-pick" && (
                  <p className="text-orange-400 font-medium">
                    Cliquez sur la techno{" "}
                    <span className="font-bold">cible</span>
                  </p>
                )}
                {mode === "path-pick-from" && (
                  <p className="text-orange-400 font-medium">
                    Cliquez sur le <span className="font-bold">départ</span> (A)
                  </p>
                )}
                {mode === "path-pick-to" && (
                  <p className="text-orange-400 font-medium">
                    <span className="text-muted-foreground font-normal">
                      De{" "}
                    </span>
                    {pathFromTech?.name}
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      →{" "}
                    </span>
                    <span className="font-bold">arrivée</span> (B)
                  </p>
                )}
              </div>
            </Panel>
          )}
          {isPathMode && !pathFound && (
            <Panel position="bottom-center" className="mb-2">
              <div className="bg-background/95 border border-border rounded-lg px-4 py-2 text-xs shadow">
                <p className="text-red-400 font-medium">Aucun chemin trouvé</p>
              </div>
            </Panel>
          )}
          {mode === "select" && selectedNodeId && (
            <Panel position="bottom-center" className="mb-2">
              <div className="flex items-center gap-4 bg-background/90 border border-border rounded-lg px-3 py-1.5 text-xs shadow">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-blue-500" />
                  <span className="text-muted-foreground">Prérequis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-green-500" />
                  <span className="text-muted-foreground">Débloque</span>
                </div>
              </div>
            </Panel>
          )}
          {selectedTech && mode === "select" && (
            <Panel
              position="top-right"
              className="m-2 w-[360px] rounded-lg! overflow-hidden!"
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
          {isPathMode && pathFound && pathToTech && (
            <Panel
              position="top-right"
              className="m-2 w-[360px] rounded-lg! overflow-hidden!"
            >
              <TechPathPanel
                fromTech={mode === "ancestors-result" ? null : pathFromTech}
                toTech={pathToTech}
                pathTechs={pathTechs}
                onClose={reset}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>
    </SelectionContext.Provider>
  );
}
