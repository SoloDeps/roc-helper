"use client";

import React, {
  useCallback,
  useContext,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  buildGraphData,
  layoutGraph,
  layoutGraphVertical,
} from "@/lib/layout-graph";
import { CampaignDetailsPanel } from "./campaign-details-panel";
import { CampaignPathPanel } from "./campaign-path-panel";
import { CampaignInfoPanel } from "./campaign-info-panel";
import type { CampaignRegion } from "@/types/campaign-types";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import { Handle, Position } from "@xyflow/react";
import {
  cn,
  getItemIconLocal,
  formatNumber,
  formatDuration,
} from "@/lib/utils";
import { Check, Clock, GitFork, X, Target } from "lucide-react";
import Image from "next/image";
import {
  getAllAncestors,
  getSubgraphBetween,
  getOrderedTechs,
} from "@/lib/path-utils";

function collectAncestorIds(
  targetId: string,
  regions: CampaignRegion[],
): string[] {
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
}

function collectDescendantIds(
  targetId: string,
  regions: CampaignRegion[],
): string[] {
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
// CampaignNode — mirrors TechNodeWithContext exactly
// ============================================================
function CampaignNodeWithContext({ id, data, selected }: any) {
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

  const { name, scout, boss } = data;

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

  return (
    <div
      className={cn(
        "relative",
        isDimmed && "opacity-20",
        isPathDimmed && "opacity-15",
      )}
    >
      <div
        className={cn(
          "relative border rounded-md overflow-visible w-[200px] h-13 flex items-center transition-all duration-200 cursor-pointer",
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
          id="bottom"
          type="target"
          position={Position.Bottom}
          className="opacity-0! pointer-events-none!"
        />

        <div className="flex flex-col justify-center gap-0.5 size-full min-w-0 w-full py-1 px-2.5 max-md:font-sans!">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "font-semibold text-[11px] leading-tight line-clamp-1",
                isCompleted && "text-green-700 dark:text-green-400",
                (isPathFrom || isPathTo) &&
                  "text-orange-600 dark:text-orange-300",
              )}
            >
              {name}
            </span>
            {boss && (
              <span className="shrink-0 text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-red-500/20 text-red-500 dark:bg-red-900/40 dark:text-red-400 border border-red-500/30 leading-none">
                Boss
              </span>
            )}
          </div>
          {scout && (
            <div className="flex items-center gap-1">
              <div className="relative size-3 shrink-0">
                <Image
                  src={getItemIconLocal("coins")}
                  alt="coins"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-[9px] text-muted-foreground">
                {formatNumber(scout.coins)}
              </span>
              <span className="text-[9px] text-muted-foreground/50">·</span>
              <Clock className="size-2.5 text-muted-foreground/70 shrink-0" />
              <span className="font-semibold text-[9px] text-muted-foreground">
                {formatDuration(scout.duration)}
              </span>
            </div>
          )}
        </div>

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
          id="top"
          type="source"
          position={Position.Top}
          className="!opacity-0 !pointer-events-none"
        />
      </div>
    </div>
  );
}

const nodeTypes = { custom: CampaignNodeWithContext };

// ============================================================
// External control interface
// ============================================================
export interface CampaignTreeExternalControl {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  pathFromId: string | null;
  setPathFromId: React.Dispatch<React.SetStateAction<string | null>>;
  pathToId: string | null;
  setPathToId: React.Dispatch<React.SetStateAction<string | null>>;
  pathRawNodeIds: Set<string>;
  setPathRawNodeIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  pathRawEdgeIds: Set<string>;
  setPathRawEdgeIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  pathFound: boolean;
  setPathFound: React.Dispatch<React.SetStateAction<boolean>>;
  excludeCompleted: boolean;
  setExcludeCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRegion: CampaignRegion | null;
  setSelectedRegion: React.Dispatch<
    React.SetStateAction<CampaignRegion | null>
  >;
  selectedNodeId: string | null;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  onOpenPathDrawer: () => void;
}

// ============================================================
// Main
// ============================================================
interface CampaignTreeDesktopProps {
  regions: CampaignRegion[];
  eraId: string;
  externalControl?: CampaignTreeExternalControl;
  hideControls?: boolean;
  infoPanelOpen?: boolean;
  onInfoPanelOpenChange?: (open: boolean) => void;
}

export function CampaignTreeDesktop({
  regions,
  eraId,
  externalControl,
  hideControls = false,
  infoPanelOpen: externalInfoOpen,
  onInfoPanelOpenChange,
}: CampaignTreeDesktopProps) {
  const isExternal = !!externalControl;

  const [_selectedRegion, _setSelectedRegion] = useState<CampaignRegion | null>(
    null,
  );
  const [_selectedNodeId, _setSelectedNodeId] = useState<string | null>(null);
  const [_mode, _setMode] = useState<Mode>("select");
  const [_pathFromId, _setPathFromId] = useState<string | null>(null);
  const [_pathToId, _setPathToId] = useState<string | null>(null);
  const [_pathRawNodeIds, _setPathRawNodeIds] = useState(new Set<string>());
  const [_pathRawEdgeIds, _setPathRawEdgeIds] = useState(new Set<string>());
  const [_pathFound, _setPathFound] = useState(true);
  const [_excludeCompleted, _setExcludeCompleted] = useState(true);

  const selectedRegion = isExternal
    ? externalControl.selectedRegion
    : _selectedRegion;
  const setSelectedRegion = isExternal
    ? externalControl.setSelectedRegion
    : _setSelectedRegion;
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

  const pathRegions = useMemo(
    () =>
      getOrderedTechs(
        pathNodeIds,
        regions as any,
      ) as unknown as CampaignRegion[],
    [pathNodeIds, regions],
  );

  const onToggleComplete = useCallback(
    async (regionId: string) => {
      const db = getWikiDB();
      const isCurrentlyCompleted = completedIds.has(regionId);
      if (!isCurrentlyCompleted) {
        const ids = [regionId, ...collectAncestorIds(regionId, regions)];
        const existing = await db.campaigns.bulkGet(ids);
        await db.campaigns.bulkPut(
          ids.map((id, i) => ({
            ...(existing[i] ?? { id, hidden: 0 }),
            id,
            cp: 1,
          })),
        );
      } else {
        const ids = [regionId, ...collectDescendantIds(regionId, regions)];
        const existing = await db.campaigns.bulkGet(ids);
        await db.campaigns.bulkPut(
          ids.map((id, i) => ({
            ...(existing[i] ?? { id, hidden: 0 }),
            id,
            cp: 0,
          })),
        );
      }
    },
    [completedIds, regions],
  );

  const { baseNodes, baseEdges } = useMemo(() => {
    const techNodes = regions.map((r) => ({
      id: r.id,
      name: r.name,
      column: r.column,
      required: r.required,
      costs: {},
    }));
    const graphNodes = techNodes.map((n) => ({
      id: n.id,
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        name: n.name,
        scout: regions.find((r) => r.id === n.id)?.scout,
        boss: regions.find((r) => r.id === n.id)?.boss,
        parts: regions.find((r) => r.id === n.id)?.parts ?? [],
      },
    }));
    const { edges: rawEdges } = buildGraphData(techNodes as any);
    // Deduplicate edges — buildGraphData may produce duplicate IDs when multiple
    // regions share the same source-target pair (e.g. "sa_9-sa_11" appearing twice)
    const seenEdgeIds = new Set<string>();
    const uniqueEdges = rawEdges.filter((e) => {
      if (seenEdgeIds.has(e.id)) return false;
      seenEdgeIds.add(e.id);
      return true;
    });
    return {
      baseNodes: layoutGraphVertical(graphNodes, uniqueEdges, techNodes as any),
      baseEdges: uniqueEdges.map((e) => ({
        ...e,
        sourceHandle: "top",
        targetHandle: "bottom",
      })),
    };
  }, [regions]);

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
        const bothDone =
          completedIds.has(edge.source) && completedIds.has(edge.target);
        if (bothDone)
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
      const bothDone =
        completedIds.has(edge.source) && completedIds.has(edge.target);
      if (bothDone)
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
  const [edges, setEdges, onEdgesChange] = useEdgesState(styledEdges as Edge[]);
  useEffect(() => {
    setNodes(baseNodes);
  }, [baseNodes, setNodes]);
  useEffect(() => {
    setEdges(styledEdges as Edge[]);
  }, [styledEdges, setEdges]);

  const reset = useCallback(() => {
    setMode("select");
    setPathFromId(null);
    setPathToId(null);
    setPathRawNodeIds(new Set());
    setPathRawEdgeIds(new Set());
    setPathFound(true);
  }, [
    setMode,
    setPathFromId,
    setPathToId,
    setPathRawNodeIds,
    setPathRawEdgeIds,
    setPathFound,
  ]);

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
    [
      setPathRawNodeIds,
      setPathRawEdgeIds,
      setPathFound,
      setPathToId,
      setPathFromId,
    ],
  );

  const NODE_W = 200;
  const NODE_H = 52;
  const rfInstanceRef = useRef<ReactFlowInstance<Node, Edge> | null>(null);
  const initialZoomDone = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [_isRewardsPanelOpen, _setIsRewardsPanelOpen] = useState(true);
  const isRewardsPanelOpen = externalInfoOpen ?? _isRewardsPanelOpen;
  const setIsRewardsPanelOpen = useCallback(
    (v: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof v === "function" ? v(isRewardsPanelOpen) : v;
      onInfoPanelOpenChange
        ? onInfoPanelOpenChange(next)
        : _setIsRewardsPanelOpen(next);
    },
    [isRewardsPanelOpen, onInfoPanelOpenChange],
  );

  const onInit = useCallback((instance: ReactFlowInstance<Node, Edge>) => {
    rfInstanceRef.current = instance;
  }, []);

  useEffect(() => {
    if (campaignEntities === undefined) return;
    if (initialZoomDone.current) return;
    if (!rfInstanceRef.current) return;
    initialZoomDone.current = true;
    const firstUncompleted = [...baseNodes]
      .filter((n) => !completedIds.has(n.id))
      .sort((a, b) => (b.position?.y ?? 0) - (a.position?.y ?? 0))[0];
    if (firstUncompleted) {
      rfInstanceRef.current.setCenter(
        0,
        firstUncompleted.position.y + NODE_H / 2,
        { zoom: 1.2, duration: 0 },
      );
    } else {
      rfInstanceRef.current.fitView({ padding: 0.2, duration: 0 });
    }
    requestAnimationFrame(() => setIsReady(true));
  }, [campaignEntities, baseNodes, completedIds]);

  const onNodeClick = useCallback(
    (_e: React.MouseEvent, node: any) => {
      if (mode === "ancestors-pick") {
        const { nodeIds, edgeIds } = getAllAncestors(node.id, regions as any);
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
          regions as any,
        );
        applyResult(nodeIds, edgeIds, found, node.id, pathFromId!);
        setMode("path-result");
        return;
      }
      const region = regions.find((r) => r.id === node.id);
      if (region) {
        setSelectedRegion((prev) => (prev?.id === region.id ? null : region));
        setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
      }
    },
    [
      mode,
      pathFromId,
      regions,
      applyResult,
      setMode,
      setPathFromId,
      setSelectedNodeId,
      setSelectedRegion,
    ],
  );

  const onPaneClick = useCallback(() => {
    if (mode === "select") {
      setSelectedRegion(null);
      setSelectedNodeId(null);
    }
  }, [mode, setSelectedRegion, setSelectedNodeId]);

  const pathFromRegion = regions.find((r) => r.id === pathFromId) ?? null;
  const pathToRegion = regions.find((r) => r.id === pathToId) ?? null;

  const ancestorsOfFrom = useMemo(() => {
    if (!pathFromId || mode !== "path-pick-to") return new Set<string>();
    return new Set(collectAncestorIds(pathFromId, regions));
  }, [pathFromId, mode, regions]);

  const isPathMode = mode === "path-result" || mode === "ancestors-result";

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

  return (
    <SelectionContext.Provider value={ctx}>
      <div
        className={cn(
          "w-full h-[calc(100vh-200px)] min-h-[500px] border border-border md:rounded-lg overflow-hidden bg-background-300/20 transition-opacity duration-200",
          isReady ? "opacity-100" : "opacity-0",
        )}
      >
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            minZoom={0.4}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
          >
            {!hideControls && (
              <Controls
                showInteractive={false}
                className="shadow! border! border-border! rounded-md! overflow-hidden! [&>button]:bg-background/90! [&>button]:text-foreground! [&>button]:border-0! [&>button]:border-b! [&>button]:border-border! [&>button:last-child]:border-b-0! [&>button:hover]:bg-accent!"
              />
            )}

            <Panel position="top-left" className="m-2 flex flex-col gap-1.5">
              {mode === "select" ? (
                <>
                  <button
                    onClick={() => setMode("ancestors-pick")}
                    className="flex items-center gap-1.5 text-[13px] bg-background/90 border border-border rounded-md px-3 py-1.5 shadow hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                  >
                    <Target className="size-3.5" /> Prerequisites
                  </button>
                  <button
                    onClick={() => setMode("path-pick-from")}
                    className="flex items-center gap-1.5 text-[13px] bg-background/90 border border-border rounded-md px-3 py-1.5 shadow hover:border-orange-400/70 hover:text-orange-400 transition-colors"
                  >
                    <GitFork className="size-3.5" /> Path A → B
                  </button>
                </>
              ) : (
                <div className="flex flex-row gap-1.5">
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-[13px] bg-background/90 border border-orange-400/50 text-orange-400 rounded-lg px-2.5 py-1.5 shadow hover:bg-orange-500/10 transition-colors"
                  >
                    <X className="size-3.5" /> Cancel
                  </button>
                  <button
                    onClick={() => setExcludeCompleted((v) => !v)}
                    className={cn(
                      "flex items-center gap-1.5 text-[13px] bg-background/90 border rounded-lg px-3 py-1.5 shadow transition-colors",
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
                <div className="bg-background/95 border border-border rounded-lg px-4 py-2 text-[13px] shadow text-center">
                  {mode === "ancestors-pick" && (
                    <p className="text-orange-400 font-medium">
                      Click the <span className="font-bold">target</span> region
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
                      {pathFromRegion?.name}
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
                <div className="bg-background/95 border border-border rounded-lg px-4 py-2 text-[13px] shadow">
                  <p className="text-red-400 font-medium">No path found</p>
                </div>
              </Panel>
            )}

            {mode === "select" && selectedNodeId && (
              <Panel position="bottom-center" className="mb-2">
                <div className="flex items-center gap-4 bg-background/90 border border-border rounded-lg px-3 py-1.5 text-[13px] shadow">
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

            {!isExternal && selectedRegion && mode === "select" && (
              <Panel
                position="top-right"
                className="m-2 w-[330px] md:w-[360px] rounded-lg! overflow-hidden!"
              >
                <CampaignDetailsPanel
                  region={selectedRegion}
                  eraId={eraId}
                  onClose={() => {
                    setSelectedRegion(null);
                    setSelectedNodeId(null);
                  }}
                />
              </Panel>
            )}

            {!isExternal &&
              !selectedRegion &&
              mode === "select" &&
              isRewardsPanelOpen && (
                <Panel
                  position="top-right"
                  className="m-2 w-[330px] md:w-[360px] rounded-lg! overflow-hidden!"
                >
                  <CampaignInfoPanel
                    regions={regions}
                    completedIds={completedIds}
                    onClose={() => setIsRewardsPanelOpen(false)}
                  />
                </Panel>
              )}

            {!isExternal && isPathMode && pathFound && pathToRegion && (
              <Panel
                position="top-right"
                className="m-2 w-[330px] md:w-[360px] rounded-lg! overflow-hidden!"
              >
                <CampaignPathPanel
                  fromRegion={
                    mode === "ancestors-result" ? null : pathFromRegion
                  }
                  toRegion={pathToRegion}
                  pathRegions={pathRegions}
                  onClose={reset}
                />
              </Panel>
            )}

            {isExternal && isPathMode && pathFound && pathToRegion && (
              <Panel position="bottom-center" className="mb-16">
                <button
                  onClick={() => externalControl.onOpenPathDrawer()}
                  className="flex items-center gap-2 text-[13px] bg-background/90 border border-orange-400/50 text-orange-400 rounded-lg px-3 py-1.5 shadow hover:bg-orange-500/10 transition-colors"
                >
                  View path details
                </button>
              </Panel>
            )}
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </SelectionContext.Provider>
  );
}
