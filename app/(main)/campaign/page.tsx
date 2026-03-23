"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { getWikiDB } from "@/lib/db/schema";
import { ERAS } from "@/lib/catalog";
import { getCampaignsByEra } from "@/data/campaigns/campaigns-registry";
import {
  useSelectedCampaignEraId,
  useSelectCampaignEra,
} from "@/lib/stores/campaign-page-store";
import { CampaignTreeDesktop } from "@/components/campaign/campaign-tree-desktop";
import { CampaignTreeMobile } from "@/components/campaign/campaign-tree-mobile";
import { CampaignInfoPanel } from "@/components/campaign/campaign-info-panel";
import type { CampaignRegion } from "@/types/campaign-types";
import { Button } from "@/components/ui/button";
import { ResponsiveSelect } from "@/components/modals/responsive-select";
import {
  AlertCircle,
  Plus,
  Trash2,
  LoaderCircle,
  Map as MapIcon,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddElementStore } from "@/lib/stores/add-element-store";
import { AddElementModal } from "@/components/modals/add-element/add-element-modal";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";

// ─── Campaign Info Button (mobile-only drawer) ────────────────────────────────

function CampaignInfoButton({
  regions,
  completedIds,
}: {
  regions: CampaignRegion[];
  completedIds: Set<string>;
}) {
  return (
    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="gap-1.5 h-9">
            <MapIcon className="size-4" />
            <span className="max-[420px]:hidden">Info</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-0 gap-0 flex flex-col overflow-hidden h-[70vh]">
          <DrawerHeader className="shrink-0 px-4 py-2 border-b border-border">
            <DrawerTitle>Campaign Info</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-2">
            <CampaignInfoPanel
              regions={regions}
              completedIds={completedIds}
              onClose={() => {}}
              hideHeader
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// ─── Delete Era Button — copie exacte de tech page.tsx DeleteEraButton ────────

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
      const abbr = ERAS.find((e) => e.id === selectedEraId)?.abbr.toLowerCase();
      if (!abbr) {
        toast.error("Could not identify era prefix");
        return;
      }
      const regions = await db.campaigns
        .where("id")
        .startsWith(`${abbr}_`)
        .toArray();
      await db.campaigns.bulkDelete(regions.map((r) => r.id));

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
                This will permanently delete all campaign regions saved for this
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
              <b>all campaign regions for this era</b>. This action cannot be{" "}
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

// ─── Empty State — copie exacte de TechTreeSkeleton ──────────────────────────

function CampaignTreeSkeleton({
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
              src="/images/game_icons/icon_flat_scout.webp"
              alt="scout"
              draggable={false}
              className="size-24 object-contain opacity-40 select-none invert-100 dark:invert-10"
              width={96}
              height={96}
            />
            <p className="text-sm text-muted-foreground mb-2">
              Your campaign map will appear here
            </p>
            <Button onClick={onAdd}>
              <Plus className="size-4 mr-2" />
              Add your first campaign
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignPage() {
  const selectedEraId = useSelectedCampaignEraId();
  const selectEra = useSelectCampaignEra();
  const { openModal, selectCategory } = useAddElementStore();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);

  const campaignsInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.campaigns.toArray();
  }, []);

  const availableEras = useMemo(() => {
    if (!campaignsInDB || campaignsInDB.length === 0) return [];
    const eraSet = new Set<string>();
    campaignsInDB.forEach((c) => {
      const abbr = c.id.match(/^([a-z]+)_/)?.[1];
      if (abbr) {
        const era = ERAS.find((e) => e.abbr.toLowerCase() === abbr);
        if (era) eraSet.add(era.id);
      }
    });
    return ERAS.filter((era) => eraSet.has(era.id));
  }, [campaignsInDB]);

  useEffect(() => {
    if (!selectedEraId && availableEras.length > 0) {
      selectEra(availableEras[0].id);
    }
  }, [selectedEraId, availableEras, selectEra]);

  const selectedEraRegions = useMemo(() => {
    if (!selectedEraId) return [];
    return getCampaignsByEra(selectedEraId);
  }, [selectedEraId]);

  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    campaignsInDB?.forEach((c) => {
      if (c.cp) ids.add(c.id);
    });
    return ids;
  }, [campaignsInDB]);

  const handleAddNewEra = () => {
    selectCategory("campaign");
    openModal();
  };

  const handleEraDeleted = (nextEraId: string | null) => {
    selectEra(nextEraId ?? "");
  };

  const eraOptions = availableEras.map((era) => ({
    value: era.id,
    label: era.name,
  }));

  const selectedEraName =
    availableEras.find((e) => e.id === selectedEraId)?.name ?? "";

  const isLoading = campaignsInDB === undefined;
  const isEmpty = !isLoading && campaignsInDB.length === 0;

  return (
    <div className="flex flex-col min-h-0 flex-1 container-wrapper">
      {isLoading || isEmpty ? (
        <>
          {/* Header — même layout que la page techno empty state */}
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
          </div>
          <CampaignTreeSkeleton onAdd={handleAddNewEra} loading={isLoading} />
        </>
      ) : (
        <>
          {/* ── Row: [Select Era ▼] [+ Add] [🗑️] ··· [ℹ️ Info] ── */}
          <div className="py-2 md:pt-4 flex justify-between gap-1.5 items-end w-full">
            <div className="flex gap-1.5 items-end">
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

              {/* Delete current era */}
              {selectedEraId && (
                <DeleteEraButton
                  selectedEraId={selectedEraId}
                  selectedEraName={selectedEraName}
                  availableEras={availableEras}
                  onDeleted={handleEraDeleted}
                />
              )}
            </div>

            {/* Info button — right side */}
            {selectedEraRegions.length > 0 && (
              <div className="flex items-end gap-1.5">
                {/* Desktop toggle button */}
                <Button
                  variant="outline"
                  onClick={() => setInfoPanelOpen((v) => !v)}
                  className={cn(
                    "hidden md:flex gap-2.5 px-3 h-9",
                    infoPanelOpen && "border-primary/60 text-primary",
                  )}
                >
                  <div
                    className={cn(
                      "size-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      infoPanelOpen
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/50",
                    )}
                  >
                    {infoPanelOpen && (
                      <Check className="size-3 text-primary-foreground stroke-3" />
                    )}
                  </div>
                  Campaign Info
                </Button>
                {/* Mobile drawer button */}
                <CampaignInfoButton
                  regions={selectedEraRegions}
                  completedIds={completedIds}
                />
              </div>
            )}
          </div>

          {selectedEraId && selectedEraRegions.length > 0 && (
            <>
              <div className="hidden md:block">
                <CampaignTreeDesktop
                  key={selectedEraId}
                  regions={selectedEraRegions}
                  eraId={selectedEraId}
                  infoPanelOpen={infoPanelOpen}
                  onInfoPanelOpenChange={setInfoPanelOpen}
                />
              </div>
              <div className="md:hidden">
                <CampaignTreeMobile
                  key={selectedEraId}
                  regions={selectedEraRegions}
                  eraId={selectedEraId}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Shared modal */}
      <AddElementModal hideTrigger />
    </div>
  );
}
