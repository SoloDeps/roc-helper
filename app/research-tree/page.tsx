"use client";

import React, { useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import { ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import { ERAS } from "@/lib/catalog";
import { getTechnologiesByEra } from "@/data/technos-registry";
import {
  useSelectedEraId,
  useSelectEra,
} from "@/lib/stores/technology-page-store";
import { TechTreeDesktop } from "@/components/technology/tech-tree-desktop";
import { TechTreeMobile } from "@/components/technology/tech-tree-mobile";
import { Button } from "@/components/ui/button";
import { ResponsiveSelect } from "@/components/modals/responsive-select";
import {
  AlertCircle,
  Plus,
  BarChart2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useAddElementStore } from "@/lib/stores/add-element-store";
import { AddElementModal } from "@/components/modals/add-element/add-element-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceBadge } from "@/components/items/resource-badge";
import {
  formatNumber,
  getItemIconLocal,
  getGoodNameFromPriorityEra,
} from "@/lib/utils";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import type { TechnoData } from "@/types/shared";
import { useMediaQuery } from "@/hooks/use-media-query";

// ─── Stats helpers ────────────────────────────────────────────────────────────

function sumCosts(techs: TechnoData[]) {
  const resources: Record<string, number> = {};
  const goods = new Map<string, number>();
  techs.forEach((tech) => {
    Object.entries(tech.costs || {}).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        value.forEach((g) =>
          goods.set(g.resource, (goods.get(g.resource) ?? 0) + g.amount),
        );
      } else if (typeof value === "number") {
        resources[key] = (resources[key] ?? 0) + value;
      }
    });
  });
  return { resources, goods };
}

function CostGrid({
  techs,
  emptyLabel,
}: {
  techs: TechnoData[];
  emptyLabel: string;
}) {
  const userSelections = useBuildingSelections();
  const { resources, goods } = useMemo(() => sumCosts(techs), [techs]);
  const hasContent = Object.keys(resources).length > 0 || goods.size > 0;
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {techs.length} tech{techs.length !== 1 ? "s" : ""}
      </p>
      {!hasContent ? (
        <p className="text-xs text-muted-foreground italic py-2">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {Object.entries(resources).map(([type, value]) => (
            <ResourceBadge
              key={type}
              icon={getItemIconLocal(type)}
              value={formatNumber(value)}
              alt={type}
            />
          ))}
          {Array.from(goods.entries()).map(([resource, amount], i) => {
            const match = resource.match(
              /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i,
            );
            let goodName = resource;
            if (match) {
              const [, priority, era] = match;
              goodName =
                getGoodNameFromPriorityEra(priority, era, userSelections) ||
                "default";
            }
            return (
              <ResourceBadge
                key={`${resource}-${i}`}
                icon={getItemIconLocal(goodName)}
                value={formatNumber(amount)}
                alt={resource}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatsContent({ technologies }: { technologies: TechnoData[] }) {
  const completed = technologies.filter((t) => (t as any).hidden);
  const remaining = technologies.filter((t) => !(t as any).hidden);
  return (
    <Tabs defaultValue="remaining">
      <TabsList className="w-full">
        <TabsTrigger value="completed" className="flex-1 gap-1.5">
          <CheckCircle2 className="size-3.5 text-green-500" />
          Unlocked ({completed.length})
        </TabsTrigger>
        <TabsTrigger value="remaining" className="flex-1 gap-1.5">
          <Circle className="size-3.5 text-muted-foreground" />
          Remaining ({remaining.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="completed" className="mt-4">
        <CostGrid techs={completed} emptyLabel="No technos unlocked yet." />
      </TabsContent>
      <TabsContent value="remaining" className="mt-4">
        <CostGrid
          techs={remaining}
          emptyLabel="All technos already unlocked!"
        />
      </TabsContent>
    </Tabs>
  );
}

function EraStatsButton({ technologies }: { technologies: TechnoData[] }) {
  return (
    <>
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <BarChart2 className="size-4" />
              Era Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Era Research Overview</DialogTitle>
            </DialogHeader>
            <StatsContent technologies={technologies} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <BarChart2 className="size-4" />
              Era Stats
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4 pb-8 space-y-4">
            <DrawerHeader className="p-0">
              <DrawerTitle>Era Research Overview</DrawerTitle>
            </DrawerHeader>
            <StatsContent technologies={technologies} />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

// ─── Empty state skeleton (même hauteur que le ReactFlow) ────────────────────

function TechTreeSkeleton({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] border border-dashed border-border rounded-lg overflow-hidden bg-muted/5 mt-2">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-[1px]">
        <AlertCircle className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Your research tree will appear here
        </p>
        <Button onClick={onAdd}>
          <Plus className="size-4 mr-2" />
          Add your first era
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchTreePage() {
  const selectedEraId = useSelectedEraId();
  const selectEra = useSelectEra();
  const { openModal, selectCategory, setDirectTechnologyMode } =
    useAddElementStore();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos.toArray();
  }, []);

  const availableEras = useMemo(() => {
    if (!technosInDB || technosInDB.length === 0) return [];
    const eraAbbrs = new Set<string>();
    technosInDB.forEach((t) => {
      const match = t.id.match(/^([a-z]{2})_\d+$/);
      if (match) eraAbbrs.add(match[1]);
    });
    const eraIds = new Set<string>();
    eraAbbrs.forEach((abbr) => {
      const eraId = ABBR_TO_ERA_ID[abbr];
      if (eraId) eraIds.add(eraId);
    });
    return ERAS.filter((era) => eraIds.has(era.id));
  }, [technosInDB]);

  useEffect(() => {
    if (!selectedEraId && availableEras.length > 0) {
      selectEra(availableEras[0].id);
    }
  }, [selectedEraId, availableEras, selectEra]);

  const selectedEraTechnologies = useMemo(() => {
    if (!selectedEraId) return [];
    return getTechnologiesByEra(selectedEraId);
  }, [selectedEraId]);

  const technosWithStatus = useMemo(() => {
    if (!technosInDB || !selectedEraTechnologies.length) return [];
    return selectedEraTechnologies.map((tech) => {
      const dbTech = technosInDB.find((t) => t.id === tech.id);
      return { ...tech, hidden: dbTech ? !!dbTech.hidden : false };
    });
  }, [selectedEraTechnologies, technosInDB]);

  const handleAddNewEra = () => {
    setDirectTechnologyMode(true);
    selectCategory("technology");
    openModal();
  };

  const eraOptions = availableEras.map((era) => ({
    value: era.id,
    label: era.name,
  }));
  const isEmpty = !technosInDB || technosInDB.length === 0;

  return (
    <div className="flex flex-col min-h-0 flex-1 container-wrapper">
      {isEmpty ? (
        <>
          {/* Header identique pour cohérence visuelle avec/sans contenu */}
          <div className="py-2 md:pt-4 flex gap-1.5 items-end w-full">
            <div className="flex gap-1.5 items-end w-full">
              <div className="w-full sm:w-60">
                <ResponsiveSelect
                  label={isMobile ? "" : "Saved Eras"}
                  value=""
                  onValueChange={() => {}}
                  options={[]}
                  placeholder="Select an era"
                  drawerBtnClassName="h-9"
                  disabled
                />
              </div>
              <Button
                variant="outline"
                onClick={handleAddNewEra}
                className="w-auto"
              >
                <Plus className="size-4" /> Add
                <span className="hidden md:inline-block">New Era</span>
              </Button>
            </div>

            <Button variant="outline" className="gap-1.5" disabled>
              <BarChart2 className="size-4" />
              Era Stats
            </Button>
          </div>
          <TechTreeSkeleton onAdd={handleAddNewEra} />
        </>
      ) : (
        <>
          {/* ── Row : Era select + Add New Era + [spacer] + Era Stats ── */}
          <div className="py-2 md:pt-4 flex gap-1.5 items-end w-full">
            <div className="flex gap-1.5 items-end w-full">
              <div className="w-full sm:w-60">
                <ResponsiveSelect
                  label={isMobile ? "" : "Saved Eras"}
                  value={selectedEraId || ""}
                  onValueChange={(newEraId) => selectEra(newEraId)}
                  options={eraOptions}
                  drawerBtnClassName="h-9"
                  placeholder="Select an era"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleAddNewEra}
                className="w-auto"
              >
                <Plus className="size-4" /> Add
                <span className="hidden md:inline-block">New Era</span>
              </Button>
            </div>
            {technosWithStatus.length > 0 && (
              <div className="ml-auto">
                <EraStatsButton technologies={technosWithStatus} />
              </div>
            )}
          </div>

          {selectedEraId && technosWithStatus.length > 0 && (
            <>
              <div className="hidden md:block mt-2">
                <TechTreeDesktop technologies={technosWithStatus} />
              </div>
              <div className="md:hidden">
                <TechTreeMobile technologies={technosWithStatus} />
              </div>
            </>
          )}

          {/* {selectedEraId && technosWithStatus.length === 0 && (
            <TechTreeSkeleton onAdd={handleAddNewEra} />
          )} */}
        </>
      )}

      {/* Modal partagée — trigger caché, piloté uniquement via le store */}
      <AddElementModal hideTrigger />
    </div>
  );
}
