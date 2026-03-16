"use client";

import React, { useMemo, useState, useCallback } from "react";
import { CampaignDetailsDrawer } from "./campaign-details-drawer";
import { CampaignPathPanel } from "./campaign-path-panel";
import {
  CampaignTreeDesktop,
  type CampaignTreeExternalControl,
} from "./campaign-tree-desktop";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import type { CampaignRegion } from "@/types/campaign-types";
import { Check, Clock, List, GitBranch } from "lucide-react";
import {
  cn,
  getItemIconLocal,
  formatNumber,
  formatDuration,
} from "@/lib/utils";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import Image from "next/image";
import { getOrderedTechs } from "@/lib/path-utils";

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
      <button
        onClick={() => onShowDetails(region)}
        className={cn(
          "size-full flex items-center rounded-lg border bg-card transition-all text-left",
          isCompleted
            ? "border-green-600/50 bg-green-600/10 dark:border-green-500/40 dark:bg-green-500/5"
            : "border-border hover:border-primary/50",
        )}
      >
        <div className="flex-1 min-w-0 flex flex-col justify-center px-3 py-2 max-md:font-sans!">
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
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(region.id);
          }}
          className={cn(
            "shrink-0 mr-2.5 size-6 rounded border-2 flex items-center justify-center transition-all",
            isCompleted
              ? "bg-green-500 border-green-500"
              : "border-muted-foreground/30 hover:border-green-600/70 dark:hover:border-green-400/70",
          )}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
        >
          {isCompleted && <Check className="size-[18px] text-white stroke-4" />}
        </div>
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

export function CampaignTreeMobile({
  regions,
  eraId,
}: CampaignTreeMobileProps) {
  const [activeTab, setActiveTab] = useState<"list" | "graph">("list");

  // Shared externalControl state (mirrors tech-tree-mobile)
  const [selectedRegion, setSelectedRegion] = useState<CampaignRegion | null>(
    null,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("select");
  const [pathFromId, setPathFromId] = useState<string | null>(null);
  const [pathToId, setPathToId] = useState<string | null>(null);
  const [pathRawNodeIds, setPathRawNodeIds] = useState(new Set<string>());
  const [pathRawEdgeIds, setPathRawEdgeIds] = useState(new Set<string>());
  const [pathFound, setPathFound] = useState(true);
  const [excludeCompleted, setExcludeCompleted] = useState(true);

  // Drawers
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isPathDrawerOpen, setIsPathDrawerOpen] = useState(false);

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

  const pathRegions = useMemo(
    () =>
      getOrderedTechs(
        pathNodeIds,
        regions as any,
      ) as unknown as CampaignRegion[],
    [pathNodeIds, regions],
  );

  const pathToRegion = regions.find((r) => r.id === pathToId) ?? null;
  const pathFromRegion = regions.find((r) => r.id === pathFromId) ?? null;
  const isPathMode = mode === "path-result" || mode === "ancestors-result";

  const groupedByColumn = useMemo(() => {
    const groups = new Map<number, CampaignRegion[]>();
    regions.forEach((r) => {
      if (!groups.has(r.column)) groups.set(r.column, []);
      groups.get(r.column)!.push(r);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [regions]);

  const handleToggleComplete = useCallback(async (id: string) => {
    const db = getWikiDB();
    const entity = await db.campaigns.get(id);
    if (!entity) return;
    await db.campaigns.update(id, { cp: entity.cp ? 0 : 1 });
  }, []);

  const handleShowDetails = useCallback((region: CampaignRegion) => {
    setSelectedRegion(region);
    setIsDetailsDrawerOpen(true);
  }, []);

  // Open details drawer when a region is selected from the graph
  React.useEffect(() => {
    if (selectedRegion) setIsDetailsDrawerOpen(true);
  }, [selectedRegion]);

  const externalControl: CampaignTreeExternalControl = {
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
  };

  return (
    <>
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-30 bg-background border-y border-border -mx-2 sm:-mx-4">
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
      </div>

      {/* Region List tab */}
      {activeTab === "list" && (
        <div className="space-y-7 pt-5 pb-24">
          {groupedByColumn.map(([columnIndex, colRegions]) => (
            <div key={columnIndex} className="space-y-1.5">
              <div className="text-xs font-semibold text-muted-foreground/60 px-0.5">
                Column {columnIndex + 1}
              </div>
              <div className="space-y-1">
                {colRegions.map((region) => (
                  <CampaignCard
                    key={region.id}
                    region={region}
                    isCompleted={completedIds.has(region.id)}
                    onToggleComplete={handleToggleComplete}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Graph tab — uses externalControl to share state with drawers */}
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

      {/* Details drawer — standalone, no panel inside */}
      <CampaignDetailsDrawer
        region={selectedRegion}
        open={isDetailsDrawerOpen}
        onOpenChange={(open) => {
          setIsDetailsDrawerOpen(open);
          if (!open) setSelectedRegion(null);
        }}
      />

      {/* Path drawer */}
      <Drawer open={isPathDrawerOpen} onOpenChange={setIsPathDrawerOpen}>
        <DrawerContent className="p-0 gap-0 flex flex-col overflow-hidden max-h-[80vh]">
          <div className="flex-1 overflow-y-auto p-4">
            {pathToRegion && (
              <CampaignPathPanel
                fromRegion={mode === "ancestors-result" ? null : pathFromRegion}
                toRegion={pathToRegion}
                pathRegions={pathRegions}
                onClose={() => setIsPathDrawerOpen(false)}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
