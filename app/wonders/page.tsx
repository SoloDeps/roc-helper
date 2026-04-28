"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Landmark,
  LayoutGrid,
  ArrowRightLeft,
  Trophy,
  SlidersHorizontal,
} from "lucide-react";
import { ResponsiveSelect } from "@/components/modals/responsive-select";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

import { WONDERS, WONDER_CODES } from "@/data/wonders/index";
import type { WonderGroup, MaterialType } from "@/data/wonders/types";

import { useUserWondersMap } from "@/lib/stores/wonders-store";

import { WonderGameCard } from "@/components/wonders/wonder-card";
import { PresetTab } from "@/components/wonders/preset-tab";
import { CompareTab } from "@/components/wonders/compare-tab";

// ─── Constants ────────────────────────────────────────────────────────────────

const WONDER_GROUPS: WonderGroup[] = [
  "Ancient World",
  "Great Empires",
  "Stories and Myths",
];

const ALL_MATERIALS: MaterialType[] = [
  "Arena",
  "Fortress",
  "Nature",
  "Naval",
  "Palace",
  "Statue",
  "Temple",
];

const ALL_SLOTS = [
  "Capital City",
  "Egypt",
  "China",
  "Maya Empire",
  "Viking Kingdom",
  "Arabia",
] as const;

const MATERIAL_OPTIONS = [
  { value: "all", label: "All types" },
  ...ALL_MATERIALS.map((m) => ({ value: m, label: m })),
];

const SLOT_OPTIONS = [
  { value: "all", label: "All cities" },
  ...ALL_SLOTS.map((s) => ({ value: s, label: s })),
];

const GRID =
  "grid grid-cols-2 min-[680px]:grid-cols-3! min-[940px]:grid-cols-4! min-[1024px]:grid-cols-3! min-[1160px]:grid-cols-4! min-[1420px]:grid-cols-5! min-[1620px]:grid-cols-6! gap-x-2 2xl:gap-x-3 gap-y-6";

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  {
    value: "all",
    label: "Wonders",
    icon: Landmark,
    description: "Manage your wonders. Click to view details and progress.",
  },
  {
    value: "presets",
    label: "Presets",
    icon: LayoutGrid,
    description:
      "Browse and apply preset wonder configurations optimized for different strategies.",
  },
  {
    value: "compare",
    label: "Compare",
    icon: ArrowRightLeft,
    description:
      "Compare wonders side by side to make the best choice for your build.",
  },
];

// ─── Group section header ─────────────────────────────────────────────────────

function GroupHeader({ group }: { group: WonderGroup }) {
  return (
    <h2 className="text-[14px] font-semibold uppercase tracking-widest text-muted-foreground pt-4 pb-3">
      {group}
    </h2>
  );
}

// ─── Grouped wonder grid ──────────────────────────────────────────────────────

function GroupedGrid({
  wonders,
  ownedMap,
}: {
  wonders: ReturnType<(typeof WONDER_CODES)["map"]> extends Array<infer T>
    ? Array<NonNullable<T>>
    : never;
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}) {
  const grouped = useMemo(
    () =>
      WONDER_GROUPS.map((group) => ({
        group,
        items: (
          wonders as Array<{ meta: { group: WonderGroup; code: string } }>
        ).filter((w) => w.meta.group === group),
      })).filter((g) => g.items.length > 0),
    [wonders],
  );

  if (grouped.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No wonders match the selected filters.
      </p>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6 ">
      {grouped.map(({ group, items }) => (
        <div key={group}>
          <GroupHeader group={group} />
          <div className={GRID}>
            {items.map((wonder) => (
              <WonderGameCard
                key={wonder.meta.code}
                wonder={wonder as any}
                currentLevel={ownedMap[wonder.meta.code]?.currentLevel}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── All Wonders Tab content ──────────────────────────────────────────────────

function AllWondersTabContent({
  ownedMap,
  material,
  slot,
}: {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
  material: string;
  slot: string;
}) {
  const filtered = useMemo(
    () =>
      WONDER_CODES.map((code) => WONDERS[code]).filter((w) => {
        if (
          material !== "all" &&
          w.meta.material1 !== material &&
          w.meta.material2 !== material
        )
          return false;
        if (slot !== "all" && w.meta.slot !== slot) return false;
        return true;
      }),
    [material, slot],
  );

  return <GroupedGrid wonders={filtered as any} ownedMap={ownedMap} />;
}

// ─── Filter selects (partagés) ────────────────────────────────────────────────

function FilterSelects({
  material,
  onMaterial,
  slot,
  onSlot,
  className,
}: {
  material: string;
  onMaterial: (v: string) => void;
  slot: string;
  onSlot: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Material
        </p>
        <ResponsiveSelect
          value={material}
          onValueChange={onMaterial}
          options={MATERIAL_OPTIONS}
          placeholder="All types"
          className="w-full h-9"
          drawerBtnClassName="h-9"
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          City slot
        </p>
        <ResponsiveSelect
          value={slot}
          onValueChange={onSlot}
          options={SLOT_OPTIONS}
          placeholder="All cities"
          className="w-full h-9"
          drawerBtnClassName="h-9"
        />
      </div>
    </div>
  );
}

// ─── Mobile filter drawer ─────────────────────────────────────────────────────

function MobileFilterDrawer({
  material,
  onMaterial,
  slot,
  onSlot,
  hasActiveFilters,
}: {
  material: string;
  onMaterial: (v: string) => void;
  slot: string;
  onSlot: (v: string) => void;
  hasActiveFilters: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          "relative h-9 w-9 p-0 shrink-0",
          hasActiveFilters && "border-primary text-primary",
        )}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={16} />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
        )}
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader className="px-0 pt-4 pb-4">
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <FilterSelects
            material={material}
            onMaterial={(v) => {
              onMaterial(v);
            }}
            slot={slot}
            onSlot={(v) => {
              onSlot(v);
            }}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-muted-foreground"
              onClick={() => {
                onMaterial("all");
                onSlot("all");
                setOpen(false);
              }}
            >
              Reset filters
            </Button>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ─── Sidebar progress widget ──────────────────────────────────────────────────

function SidebarProgressWidget({
  ownedMap,
}: {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}) {
  const total = WONDER_CODES.length;
  const unlocked = WONDER_CODES.filter((c) => c in ownedMap).length;
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <div className="pt-4 border-t border-border">
      <div className="px-3 py-3 rounded-lg bg-muted/50 space-y-2">
        <div className="flex items-center gap-1.5">
          <Trophy size={12} className="text-amber-500 shrink-0" />
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Collection
          </p>
        </div>
        <div className="flex items-end justify-between gap-1">
          <span className="text-xl font-bold tabular-nums leading-none">
            {unlocked}
          </span>
          <span className="text-xs text-muted-foreground mb-0.5">
            / {total} wonders
          </span>
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">{pct}% unlocked</p>
      </div>
    </div>
  );
}

// ─── Vertical Sidebar Nav (LG+) ──────────────────────────────────────────────

function SidebarNav({
  activeTab,
  onTabChange,
  ownedMap,
  isAllTab,
  material,
  onMaterial,
  slot,
  onSlot,
}: {
  activeTab: string;
  onTabChange: (value: string) => void;
  ownedMap: Record<string, { code: string; currentLevel: number }>;
  isAllTab: boolean;
  material: string;
  onMaterial: (v: string) => void;
  slot: string;
  onSlot: (v: string) => void;
}) {
  return (
    <nav className="hidden lg:flex flex-col justify-between w-[190px] xl:w-[220px] shrink-0 sticky top-[72px] h-[calc(100vh-72px)] pr-4 pb-4">
      {/* Top: tabs + filtres conditionnels */}
      <div className="absolute top-0 right-0 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent via-border to-transparent lg:flex"></div>
      <div className="space-y-4">
        <div className="space-y-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 text-left w-full",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <Icon
                  aria-hidden="true"
                  size={19}
                  className="relative z-10 shrink-0 opacity-70"
                />
                <span className="relative z-10">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-border-left"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Filtres — uniquement sur l'onglet Wonders */}
        <AnimatePresence initial={false}>
          {isAllTab && (
            <motion.div
              key="sidebar-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border pt-4">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Filters
                </p>
                <FilterSelects
                  material={material}
                  onMaterial={onMaterial}
                  slot={slot}
                  onSlot={onSlot}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: widget collection */}
      <SidebarProgressWidget ownedMap={ownedMap} />
    </nav>
  );
}

// ─── Horizontal Tab Nav (MD only) ────────────────────────────────────────────

function HorizontalNav({
  activeTab,
  onTabChange,
  isAllTab,
  material,
  onMaterial,
  slot,
  onSlot,
}: {
  activeTab: string;
  onTabChange: (value: string) => void;
  isAllTab: boolean;
  material: string;
  onMaterial: (v: string) => void;
  slot: string;
  onSlot: (v: string) => void;
}) {
  return (
    <div className="hidden md:flex lg:hidden sticky top-0 z-30 bg-background border-b border-border mb-4 -mx-4 px-4 items-center justify-between">
      {/* Tabs à gauche */}
      <div className="flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                aria-hidden="true"
                size={15}
                className="opacity-70 shrink-0"
              />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="horizontal-nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Filtres à droite — uniquement onglet Wonders */}
      <AnimatePresence initial={false}>
        {isAllTab && (
          <motion.div
            key="md-filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 py-1.5"
          >
            <ResponsiveSelect
              value={material}
              onValueChange={onMaterial}
              options={MATERIAL_OPTIONS}
              placeholder="All types"
              className="w-32 h-8"
              drawerBtnClassName="h-8"
            />
            <ResponsiveSelect
              value={slot}
              onValueChange={onSlot}
              options={SLOT_OPTIONS}
              placeholder="All cities"
              className="w-36 h-8"
              drawerBtnClassName="h-8"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Bottom Navigation Bar (SM/XS) ───────────────────────────────────────────

function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (value: string) => void;
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm safe-area-inset-bottom">
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
              <Icon
                aria-hidden="true"
                size={18}
                className={cn(
                  "transition-transform duration-150",
                  isActive && "scale-110",
                )}
              />
              <span className="text-[10px] font-medium leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WondersPage() {
  const ownedMap = useUserWondersMap();
  const [activeTab, setActiveTab] = useState("all");
  const [material, setMaterial] = useState("all");
  const [slot, setSlot] = useState("all");

  const activeTabConfig = TABS.find((t) => t.value === activeTab);
  const isAllTab = activeTab === "all";
  const hasActiveFilters = material !== "all" || slot !== "all";

  return (
    <>
      {/* Bottom nav (mobile) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex min-h-0 flex-1 container-wrapper">
        <div className="w-full mx-auto py-2 md:pt-4">
          {/* ── Horizontal nav (MD only) — tabs + filtres ── */}
          <HorizontalNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isAllTab={isAllTab}
            material={material}
            onMaterial={setMaterial}
            slot={slot}
            onSlot={setSlot}
          />

          <div className="flex gap-4 xl:gap-5 items-start">
            {/* ── Sidebar (LG+) — tabs + filtres + widget ── */}
            <SidebarNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              ownedMap={ownedMap}
              isAllTab={isAllTab}
              material={material}
              onMaterial={setMaterial}
              slot={slot}
              onSlot={setSlot}
            />

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 pt-1">
              {/* ── Header: title + description + bouton filtre mobile ── */}
              {activeTabConfig && (
                <div className="mb-4">
                  {/* Mobile: titre + bouton filtre sur même ligne */}
                  <div className="flex items-start justify-between gap-3 md:block">
                    <div>
                      <h1 className="text-lg font-semibold leading-tight">
                        {activeTabConfig.label}
                      </h1>
                      <p className="text-[15px] text-muted-foreground mt-0.5 hidden sm:block">
                        {activeTabConfig.description}
                      </p>
                    </div>
                    {/* Bouton filtre — mobile seulement, onglet Wonders */}
                    {isAllTab && (
                      <div className="md:hidden shrink-0">
                        <MobileFilterDrawer
                          material={material}
                          onMaterial={setMaterial}
                          slot={slot}
                          onSlot={setSlot}
                          hasActiveFilters={hasActiveFilters}
                        />
                      </div>
                    )}
                  </div>
                  {/* MD+: description pleine largeur sous le titre (LG sidebar gère les filtres) */}
                  <p className="text-sm text-muted-foreground mt-0.5 sm:hidden">
                    {activeTabConfig.description}
                  </p>
                </div>
              )}

              {/* Tab contents */}
              <div className="min-h-dvh">
                {/* <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                  > */}
                {activeTab === "all" && (
                  <AllWondersTabContent
                    ownedMap={ownedMap}
                    material={material}
                    slot={slot}
                  />
                )}
                {activeTab === "presets" && <PresetTab ownedMap={ownedMap} />}
                {activeTab === "compare" && <CompareTab ownedMap={ownedMap} />}
                {/* </motion.div>
                </AnimatePresence> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
