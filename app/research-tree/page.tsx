"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
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
  Trash2,
  LoaderCircle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { WorkshopModal } from "@/components/modals/workshop-modal";

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
          Selected ({completed.length})
        </TabsTrigger>
        <TabsTrigger value="remaining" className="flex-1 gap-1.5">
          <Circle className="size-3.5 text-muted-foreground" />
          Remaining ({remaining.length})
        </TabsTrigger>
      </TabsList>
      {/* min-h fixe pour éviter le saut de hauteur quand un onglet est vide */}
      <div className="min-h-[200px]">
        <TabsContent value="completed" className="mt-4">
          <CostGrid techs={completed} emptyLabel="No technos unlocked yet." />
        </TabsContent>
        <TabsContent value="remaining" className="mt-4">
          <CostGrid
            techs={remaining}
            emptyLabel="All technos already unlocked!"
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function EraStatsButton({
  technologies,
  desktopOpen,
  onDesktopOpenChange,
}: {
  technologies: TechnoData[];
  desktopOpen?: boolean;
  onDesktopOpenChange?: (open: boolean) => void;
}) {
  return (
    <>
      {/* Desktop: Dialog driven by external state (button lives inside ReactFlow Panel) */}
      <div className="hidden md:block">
        <Dialog open={desktopOpen} onOpenChange={onDesktopOpenChange}>
          <DialogContent className="p-0 gap-0 flex flex-col overflow-hidden h-[500px] w-[500px] min-w-[500px] min-h-[500px]">
            <DialogHeader className="shrink-0 px-4 pt-4 pb-3 border-b border-border">
              <DialogTitle>Era Research Overview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4 size-full">
              <StatsContent technologies={technologies} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Mobile: self-contained button + Drawer */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <BarChart2 className="size-4" />
              <span className="max-[420px]:hidden">Calculate</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-0 gap-0 flex flex-col overflow-hidden h-[500px]">
            <DrawerHeader className="shrink-0 px-4 pt-4 pb-3 border-b border-border">
              <DrawerTitle>Era Research Overview</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <StatsContent technologies={technologies} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

// ─── Delete Era Button ────────────────────────────────────────────────────────

interface DeleteEraButtonProps {
  selectedEraId: string;
  selectedEraName: string;
  availableEras: { id: string; name: string }[];
  onDeleted: (nextEraId: string | null) => void;
}

function DeleteEraButton({
  selectedEraId,
  selectedEraName,
  availableEras,
  onDeleted,
}: DeleteEraButtonProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [desktopDialogOpen, setDesktopDialogOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      const db = getWikiDB();

      // Resolve era abbreviation from eraId — e.g. "bronze_age" → "ba"
      const abbr = Object.entries(ABBR_TO_ERA_ID).find(
        ([, id]) => id === selectedEraId,
      )?.[0];

      if (!abbr) {
        toast.error("Could not identify era prefix");
        return;
      }

      // Delete all technos belonging to this era
      await db.technos.filter((t) => t.id.startsWith(`${abbr}_`)).delete();

      // Pick next era to auto-select (first remaining)
      const remaining = availableEras.filter((e) => e.id !== selectedEraId);
      onDeleted(remaining[0]?.id ?? null);

      toast.success(`"${selectedEraName}" deleted`);
    } catch (err) {
      console.error("Failed to delete era:", err);
      toast.error("Failed to delete era");
    } finally {
      setDesktopDialogOpen(false);
      setMobileDrawerOpen(false);
    }
  };

  // ── Desktop : AlertDialog ─────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          onClick={() => setDesktopDialogOpen(true)}
          title={`Delete era "${selectedEraName}"`}
        >
          <Trash2 className="size-4" />
        </Button>

        <AlertDialog
          open={desktopDialogOpen}
          onOpenChange={setDesktopDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete &quot;{selectedEraName}&quot;?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all technologies saved for this
                era. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Delete Era
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // ── Mobile : nested Drawer (same pattern as button-group-building) ────────
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        onClick={() => setMobileDrawerOpen(true)}
        title={`Delete era "${selectedEraName}"`}
      >
        <Trash2 className="size-4" />
      </Button>

      <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen} nested>
        <DrawerContent className="max-h-[40vh]">
          <DrawerHeader className="border-b py-3 px-4">
            <DrawerTitle className="text-base text-destructive">
              Delete &quot;{selectedEraName}&quot;?
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete{" "}
              <b>all technologies saved for this era</b>. This action cannot be{" "}
              <b>undone</b>.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmDelete}
              >
                Delete Era
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ─── Empty state skeleton ─────────────────────────────────────────────────────

function TechTreeSkeleton({
  onAdd,
  loading = false,
}: {
  onAdd: () => void;
  loading?: boolean;
}) {
  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] border border-dashed border-border rounded-lg overflow-hidden bg-muted/5">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-[1px]">
        {loading ? (
          <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
        ) : (
          <>
            <AlertCircle className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your research tree will appear here
            </p>
            <Button onClick={onAdd}>
              <Plus className="size-4 mr-2" />
              Add your first era
            </Button>
          </>
        )}
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
  const [statsOpen, setStatsOpen] = useState(false);

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

  // After deletion, jump to the next available era (or null → empty state)
  const handleEraDeleted = (nextEraId: string | null) => {
    selectEra(nextEraId ?? "");
  };

  const eraOptions = availableEras.map((era) => ({
    value: era.id,
    label: era.name,
  }));

  const selectedEraName =
    availableEras.find((e) => e.id === selectedEraId)?.name ?? "";

  const isLoading = technosInDB === undefined;
  const isEmpty = !isLoading && technosInDB.length === 0;

  return (
    <div className="flex flex-col min-h-0 flex-1 container-wrapper">
      {isLoading || isEmpty ? (
        <>
          {/* Header — same layout as non-empty for visual consistency */}
          <div className="py-2 md:pt-4 flex justify-between gap-1.5 items-end w-full">
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

            <div className="flex gap-1.5">
              <div className="md:hidden">
                <Button variant="outline" className="gap-1.5" disabled>
                  <BarChart2 className="size-4" />
                  <span className="max-[410px]:hidden">Calculate</span>
                </Button>
              </div>
              <div className="hidden md:flex">
                <WorkshopModal btnClass="h-9" />
              </div>
            </div>
          </div>
          <TechTreeSkeleton onAdd={handleAddNewEra} loading={isLoading} />
        </>
      ) : (
        <>
          {/* ── Row: [Select Era ▼] [+ Add] [🗑️] ··· [📊 Stats] ── */}
          <div className="py-2 md:pt-4 flex justify-between gap-1.5 items-end w-full">
            <div className="flex gap-1.5 items-end w-full">
              {/* Era selector */}
              <div className="w-36 sm:w-60">
                <ResponsiveSelect
                  label={isMobile ? "" : "Saved Eras"}
                  value={selectedEraId || ""}
                  onValueChange={(newEraId) => selectEra(newEraId)}
                  options={eraOptions}
                  drawerBtnClassName="h-9"
                  placeholder="Select an era"
                />
              </div>

              {/* Add new era */}
              <Button
                variant="outline"
                onClick={handleAddNewEra}
                className="w-auto"
              >
                <Plus className="size-4" /> Add
                <span className="hidden md:inline-block">New Era</span>
              </Button>

              {/* Delete current era — only visible when an era is selected */}
              {selectedEraId && (
                <DeleteEraButton
                  selectedEraId={selectedEraId}
                  selectedEraName={selectedEraName}
                  availableEras={availableEras}
                  onDeleted={handleEraDeleted}
                />
              )}
            </div>

            {/* Era stats — pushed to the right */}

            <div className="flex gap-1.5">
              {technosWithStatus.length > 0 && (
                <div className="w-full sm:w-auto">
                  <EraStatsButton
                    technologies={technosWithStatus}
                    desktopOpen={statsOpen}
                    onDesktopOpenChange={setStatsOpen}
                  />
                </div>
              )}
              <div className="hidden md:flex">
                <WorkshopModal btnClass="h-9" />
              </div>
            </div>
          </div>

          {selectedEraId && technosWithStatus.length > 0 && (
            <>
              <div className="hidden md:block">
                <TechTreeDesktop
                  technologies={technosWithStatus}
                  onOpenStats={() => setStatsOpen(true)}
                />
              </div>
              <div className="md:hidden">
                <TechTreeMobile technologies={technosWithStatus} />
              </div>
            </>
          )}
        </>
      )}

      {/* Shared modal — trigger-less, driven by store */}
      <AddElementModal hideTrigger />
    </div>
  );
}
