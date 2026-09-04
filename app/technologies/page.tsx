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
  getPriorityKeyFromGoodName,
  hasCompleteWorkshopRanking,
} from "@/lib/utils";
import { sumCosts } from "@/resolvers/costs";
import { PRIORITY_TYPES, makePriorityKey, type EraAbbr } from "@/lib/constants";
import { ERA_ORDER, GOOD_ERA_POSITION } from "@/data/config";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import type { TechnoData } from "@/types/shared";
import { useMediaQuery } from "@/hooks/use-media-query";
import { WorkshopModal } from "@/components/modals/workshop-modal";
import Image from "next/image";
import { parseRankGoodKey } from "@/resolvers/goods-keys";

/**
 * Les biens d'une ère, rangés par SLOT du joueur.
 *
 * Les coûts sont désormais écrits en biens concrets (`mosaic`), plus en rangs
 * (`primary_re`). Le classement d'ateliers du joueur sert donc à RANGER les
 * lignes, plus à identifier le bien : `getPriorityKeyFromGoodName` dit dans
 * quel slot ce joueur a mis l'atelier producteur, et c'est cet ordre qui est
 * affiché — celui d'avant la conversion.
 */
type GoodsByPriority = {
  primary?: { amount: number; resource: string };
  secondary?: { amount: number; resource: string };
  tertiary?: { amount: number; resource: string };
};

function CostGrid({
  techs,
  emptyLabel,
}: {
  techs: TechnoData[];
  emptyLabel: string;
}) {
  const userSelections = useBuildingSelections();
  const { main: resources, goods } = useMemo(
    () => sumCosts(techs.map((t) => ({ costs: t.costs }))),
    [techs],
  );
  const hasContent = Object.keys(resources).length > 0 || goods.size > 0;

  // ── Categorise goods ────────────────────────────────────────────────────────
  const { eraGoodsMap, otherGoods } = useMemo(() => {
    const eraMap = new Map<string, GoodsByPriority>();
    const other: [string, number][] = [];

    goods.forEach((amount, resource) => {
      // Une ère se range ENTIÈREMENT selon le joueur, ou entièrement selon le
      // jeu — jamais un mélange, qui ferait fusionner deux biens dans le même
      // emplacement (voir `hasCompleteWorkshopRanking`).
      const fallback = GOOD_ERA_POSITION[resource];
      // 1. Le classement du joueur, quand il est complet : les lignes sortent
      //    dans l'ordre de SES ateliers, comme avant la conversion.
      const slot =
        !fallback || hasCompleteWorkshopRanking(fallback.era, userSelections)
          ? getPriorityKeyFromGoodName(resource, userSelections)
          : null;
      // 2. Sinon, l'ordre du jeu — sans quoi un joueur qui n'a pas encore
      //    renseigné ses ateliers perdrait le regroupement par ère.

      if (slot) {
        const [priority, era] = slot.split("_") as [keyof GoodsByPriority, string];
        const current = eraMap.get(era.toUpperCase()) ?? {};
        eraMap.set(era.toUpperCase(), {
          ...current,
          [priority]: { amount, resource },
        });
      } else if (fallback) {
        const priority = PRIORITY_TYPES[fallback.index] as keyof GoodsByPriority;
        const current = eraMap.get(fallback.era) ?? {};
        eraMap.set(fallback.era, { ...current, [priority]: { amount, resource } });
      } else {
        // Ni bien de la capitale, ni atelier classé : bien de cité alliée.
        other.push([resource, amount]);
      }
    });

    return { eraGoodsMap: eraMap, otherGoods: other };
  }, [goods, userSelections]);

  // Sort eras chronologically
  const sortedEras = useMemo(
    () =>
      Array.from(eraGoodsMap.keys()).sort(
        (a, b) =>
          ERA_ORDER.indexOf(a as EraAbbr) - ERA_ORDER.indexOf(b as EraAbbr),
      ),
    [eraGoodsMap],
  );

  // Build a flat ordered list of badge props
  const badges = useMemo(() => {
    const result: { key: string; icon: string; value: string; alt: string }[] =
      [];

    // 1. research_points | coins | food (empty slot if absent)
    const FIXED_KEYS = ["research_points", "coins", "food"] as const;
    FIXED_KEYS.forEach((k) => {
      if (resources[k] != null) {
        result.push({
          key: k,
          icon: getItemIconLocal(k),
          value: formatNumber(resources[k]),
          alt: k,
        });
      }
    });

    // 2. Era goods: one row per era, always pri / sec / ter
    sortedEras.forEach((eraAbbr) => {
      const eraGoods = eraGoodsMap.get(eraAbbr)!;
      (["primary", "secondary", "tertiary"] as const).forEach((priority) => {
        const entry = eraGoods[priority];
        if (entry != null) {
          // Une ligne ne nomme un bien que si le joueur a nommé l'atelier QUI
          // LE PRODUIT. Sinon on garde le placeholder d'origine (caisse
          // générique + `priority_era`).
          //
          // Le sens de résolution est rang → bien : `priority` et `eraAbbr` sont
          // déjà là, inutile de les redériver de `entry.resource` — qui porte un
          // RANG (`primary_be`), pas un nom de bien. Même appel que le bloc
          // « Unrecognised goods » plus bas.
          const slotGood = getGoodNameFromPriorityEra(
            priority,
            eraAbbr,
            userSelections,
          );
          // ⚠️ On ne nomme que si la ligne porte bien le rang de CE slot :
          // libellé et chiffre doivent toujours désigner le même bien.
          const named =
            slotGood !== null &&
            entry.resource === makePriorityKey(priority, eraAbbr as EraAbbr);
          result.push({
            key: `${priority}_${eraAbbr}`,
            icon: getItemIconLocal(named ? slotGood : "default"),
            value: formatNumber(entry.amount),
            alt: named ? slotGood : `${priority}_${eraAbbr}`,
          });
        }
      });
    });

    // 3. Other resources (not rp/coins/food)
    const FIXED_SET = new Set(["research_points", "coins", "food"]);
    Object.entries(resources)
      .filter(([k]) => !FIXED_SET.has(k))
      .forEach(([type, value]) => {
        result.push({
          key: type,
          icon: getItemIconLocal(type),
          value: formatNumber(value),
          alt: type,
        });
      });

    // 4. Unrecognised goods
    otherGoods.forEach(([resource, amount], i) => {
      const parsed = parseRankGoodKey(resource);
      let goodName = resource;
      if (parsed) {
        goodName =
          getGoodNameFromPriorityEra(
            parsed.priority,
            parsed.era,
            userSelections,
          ) ?? "default";
      }
      result.push({
        key: `${resource}-${i}`,
        icon: getItemIconLocal(goodName),
        value: formatNumber(amount),
        alt: resource,
      });
    });

    return result;
  }, [resources, sortedEras, eraGoodsMap, otherGoods, userSelections]);

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
          {badges.map((b) => (
            <ResourceBadge
              key={b.key}
              icon={b.icon}
              value={b.value}
              alt={b.alt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatsContent({ technologies }: { technologies: TechnoData[] }) {
  const completed = technologies.filter((t) => (t as any).cp);
  const remaining = technologies.filter((t) => !(t as any).cp);
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
            <Image
              src="/images/game_icons/icon_flat_research_points.webp"
              alt="research points"
              draggable={false}
              className="size-20 object-contain opacity-40 select-none invert-100 dark:invert-10"
              width={80}
              height={80}
            />
            <p className="text-sm text-muted-foreground my-2">
              Your technology tree will appear here
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

export default function TechnologiesPage() {
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
      return {
        ...tech,
        hidden: dbTech ? !!dbTech.hidden : false,
        cp: dbTech ? !!dbTech.cp : false,
      };
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
                  key={selectedEraId}
                  technologies={technosWithStatus}
                  onOpenStats={() => setStatsOpen(true)}
                />
              </div>
              <div className="md:hidden">
                <TechTreeMobile
                  key={selectedEraId}
                  technologies={technosWithStatus}
                />
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
