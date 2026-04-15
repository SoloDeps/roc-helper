"use client";

import { useState, useMemo } from "react";
import { Plus, Search, X, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
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
import { useMediaQuery } from "@/hooks/use-media-query";

import { WONDERS, WONDER_CODES } from "@/data/wonders/index";
import { WONDER_PRESETS } from "@/data/wonders/presets";
import type { Wonder, WonderGroup } from "@/data/wonders/types";

import {
  useUserWondersMap,
  addOrUpdateUserWonder,
  removeUserWonder,
  updateWonderLevel,
} from "@/lib/stores/wonders-store";

// ─── Types ────────────────────────────────────────────────────────────────────

type GroupFilter = "All" | WonderGroup;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  "All": "All",
  "Ancient World": "AW",
  "Great Empires": "GE",
  "Stories and Myths": "SM",
};

const GROUP_COLORS: Record<string, string> = {
  "Ancient World": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  "Great Empires": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  "Stories and Myths": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
};

const SLOT_COLORS: Record<string, string> = {
  "Capital City": "bg-muted text-muted-foreground",
  "Egypt": "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  "China": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "Maya Empire": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  "Viking Kingdom": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "Arabia": "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
};

function formatLevel(level: number): string {
  return `Lv ${level}`;
}

// ─── Wonder avatar placeholder (letter-based until images are added) ──────────

function WonderAvatar({
  wonder,
  size = "md",
}: {
  wonder: Wonder;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-base",
  };
  const colorMap: Record<string, string> = {
    "Ancient World": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Great Empires": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "Stories and Myths": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  };
  const initials = wonder.meta.name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      className={cn(
        "rounded-lg font-semibold flex items-center justify-center shrink-0 select-none",
        sizeClasses[size],
        colorMap[wonder.meta.group] ?? "bg-muted text-muted-foreground"
      )}
    >
      {initials || wonder.meta.code.slice(0, 2)}
    </div>
  );
}

// ─── Level Slider ─────────────────────────────────────────────────────────────

function LevelSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon-xs"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
      >
        <ChevronDown className="size-3" />
      </Button>
      <input
        type="range"
        min={0}
        max={30}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-amber-500 h-1.5 cursor-pointer"
      />
      <Button
        variant="outline"
        size="icon-xs"
        onClick={() => onChange(Math.min(30, value + 1))}
        disabled={value >= 30}
      >
        <ChevronUp className="size-3" />
      </Button>
      <span className="text-sm font-semibold w-8 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}

// ─── Wonder Row (in selection modal) ─────────────────────────────────────────

function WonderSelectRow({
  wonder,
  isOwned,
  ownedLevel,
  expandedCode,
  onExpand,
}: {
  wonder: Wonder;
  isOwned: boolean;
  ownedLevel: number | undefined;
  expandedCode: string | null;
  onExpand: (code: string | null) => void;
}) {
  const isExpanded = expandedCode === wonder.meta.code;
  const [draftLevel, setDraftLevel] = useState<number>(ownedLevel ?? 1);

  const handleRowClick = () => {
    if (isExpanded) {
      onExpand(null);
    } else {
      setDraftLevel(ownedLevel ?? 1);
      onExpand(wonder.meta.code);
    }
  };

  const handleConfirm = async () => {
    try {
      await addOrUpdateUserWonder(wonder.meta.code, draftLevel);
      toast.success(
        isOwned
          ? `${wonder.meta.name} updated to level ${draftLevel}`
          : `${wonder.meta.name} added to your collection`
      );
      onExpand(null);
    } catch {
      toast.error("Failed to save wonder");
    }
  };

  const handleRemove = async () => {
    try {
      await removeUserWonder(wonder.meta.code);
      toast.success(`${wonder.meta.name} removed`);
      onExpand(null);
    } catch {
      toast.error("Failed to remove wonder");
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-150",
        isOwned && !isExpanded
          ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50"
          : isExpanded
          ? "bg-background border-amber-400 shadow-sm dark:border-amber-500"
          : "bg-background border-border hover:border-border/80 hover:bg-muted/30"
      )}
    >
      {/* Main row */}
      <button
        onClick={handleRowClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <WonderAvatar wonder={wonder} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{wonder.meta.name}</p>
          <p className="text-xs text-muted-foreground">
            {wonder.meta.groupCode} ·{" "}
            <span className="capitalize">{wonder.meta.slot === "Capital City" ? "Capital" : wonder.meta.slot.replace(" Kingdom", "").replace(" Empire", "")}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOwned && !isExpanded && (
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Lv {ownedLevel}
            </span>
          )}
          <Badge
            variant="outline"
            className={cn("text-[10px] h-5", GROUP_COLORS[wonder.meta.group])}
          >
            {wonder.meta.rarity === "Legendary" ? "★" : "◆"}
          </Badge>
        </div>
      </button>

      {/* Expanded level picker */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-border/50 mt-0.5 pt-3 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">
            Current level
          </p>
          <LevelSlider value={draftLevel} onChange={setDraftLevel} />
          <div className="flex gap-2 justify-end">
            {isOwned && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onExpand(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              {isOwned ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Selection Modal Content ──────────────────────────────────────────────────

function SelectionModalContent({
  ownedMap,
}: {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("All");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const groups: GroupFilter[] = [
    "All",
    "Ancient World",
    "Great Empires",
    "Stories and Myths",
  ];

  const filtered = useMemo(() => {
    return WONDER_CODES.map((code) => WONDERS[code]).filter((w) => {
      const matchGroup =
        groupFilter === "All" || w.meta.group === groupFilter;
      const matchSearch =
        search.trim() === "" ||
        w.meta.name.toLowerCase().includes(search.toLowerCase()) ||
        w.meta.code.toLowerCase().includes(search.toLowerCase());
      return matchGroup && matchSearch;
    });
  }, [search, groupFilter]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="px-4 pt-2 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wonders…"
            className="w-full h-8 pl-8 pr-8 text-sm bg-muted rounded-md border-0 outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="size-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Group filter pills */}
      <div className="flex gap-1.5 px-4 pb-2 flex-wrap">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setGroupFilter(g)}
            className={cn(
              "h-6 px-2.5 rounded-full text-xs font-medium border transition-all",
              groupFilter === g
                ? "bg-amber-400 text-amber-950 border-amber-400"
                : "bg-transparent border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      {/* Wonder list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No wonders found
          </p>
        )}
        {filtered.map((wonder) => (
          <WonderSelectRow
            key={wonder.meta.code}
            wonder={wonder}
            isOwned={wonder.meta.code in ownedMap}
            ownedLevel={ownedMap[wonder.meta.code]?.currentLevel}
            expandedCode={expandedCode}
            onExpand={setExpandedCode}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Add Wonder Trigger (responsive: Dialog on desktop, Drawer on mobile) ─────

function AddWonderModal({
  ownedMap,
}: {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const triggerButton = (
    <Button size="sm" className="gap-1.5 h-8">
      <Plus className="size-4" />
      Add Wonder
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-md h-[75vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2 shrink-0">
            <DialogTitle>Select a Wonder</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <SelectionModalContent ownedMap={ownedMap} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DrawerHeader className="px-4 pt-4 pb-2 shrink-0">
          <DrawerTitle>Select a Wonder</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <SelectionModalContent ownedMap={ownedMap} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Owned Wonder Card ────────────────────────────────────────────────────────

function OwnedWonderCard({
  wonder,
  currentLevel,
}: {
  wonder: Wonder;
  currentLevel: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draftLevel, setDraftLevel] = useState(currentLevel);

  const handleSave = async () => {
    try {
      await updateWonderLevel(wonder.meta.code, draftLevel);
      toast.success(`${wonder.meta.name} updated to level ${draftLevel}`);
      setEditing(false);
    } catch {
      toast.error("Failed to update level");
    }
  };

  const handleRemove = async () => {
    try {
      await removeUserWonder(wonder.meta.code);
      toast.success(`${wonder.meta.name} removed`);
    } catch {
      toast.error("Failed to remove wonder");
    }
  };

  const bonusAtLevel = wonder.levels[currentLevel]?.bonuses ?? [];
  const progressPct = Math.round((currentLevel / 30) * 100);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 pb-2">
        <WonderAvatar wonder={wonder} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-semibold truncate">{wonder.meta.name}</h3>
            <Badge
              variant="outline"
              className={cn("text-[10px] h-4 px-1.5 shrink-0", GROUP_COLORS[wonder.meta.group])}
            >
              {wonder.meta.groupCode}
            </Badge>
            {wonder.meta.rarity === "Legendary" && (
              <span className="text-[10px] text-amber-500 font-bold">★ Legendary</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", SLOT_COLORS[wonder.meta.slot])}>
              {wonder.meta.slot === "Capital City" ? "Capital" : wonder.meta.slotLabel}
            </span>
            {" · "}
            {wonder.meta.material1}
            {wonder.meta.material1 !== wonder.meta.material2 && ` + ${wonder.meta.material2}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold tabular-nums leading-none">{currentLevel}</p>
          <p className="text-[10px] text-muted-foreground">/ 30</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-3 pb-2">
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Bonuses (at current level) */}
      {bonusAtLevel.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {bonusAtLevel.slice(0, 2).map((bonus, i) => (
            <span
              key={i}
              className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-foreground/70"
            >
              {bonus.label}
            </span>
          ))}
        </div>
      )}

      {/* Edit inline */}
      {editing ? (
        <div className="px-3 pb-3 border-t border-border/50 pt-2.5 space-y-2.5">
          <p className="text-xs font-medium text-muted-foreground">Edit level</p>
          <LevelSlider value={draftLevel} onChange={setDraftLevel} />
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDraftLevel(currentLevel);
              setEditing(true);
            }}
            className="w-full h-7 text-xs"
          >
            Edit level
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── My Wonders Tab ───────────────────────────────────────────────────────────

function MyWondersTab({
  ownedMap,
}: {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}) {
  const ownedEntries = Object.values(ownedMap);

  if (ownedEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
          <span className="text-2xl">🏛️</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">No wonders yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first Wonder to start tracking your progress.
          </p>
        </div>
        <AddWonderModal ownedMap={ownedMap} />
      </div>
    );
  }

  // Group by slot type: Capital City first, then allied cultures
  const capitalWonders = ownedEntries
    .map((e) => ({ entry: e, wonder: WONDERS[e.code] }))
    .filter((x) => x.wonder?.meta.slot === "Capital City")
    .sort((a, b) => a.wonder.meta.name.localeCompare(b.wonder.meta.name));

  const alliedWonders = ownedEntries
    .map((e) => ({ entry: e, wonder: WONDERS[e.code] }))
    .filter((x) => x.wonder?.meta.slot !== "Capital City")
    .sort((a, b) => a.wonder.meta.slot.localeCompare(b.wonder.meta.slot));

  const renderSection = (
    title: string,
    items: typeof capitalWonders
  ) =>
    items.length > 0 ? (
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-0.5">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {items.map(({ entry, wonder }) =>
            wonder ? (
              <OwnedWonderCard
                key={entry.code}
                wonder={wonder}
                currentLevel={entry.currentLevel}
              />
            ) : null
          )}
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-5">
      {renderSection("Capital City", capitalWonders)}
      {renderSection("Allied Cultures", alliedWonders)}
    </div>
  );
}

// ─── Presets Tab ──────────────────────────────────────────────────────────────

function PresetsTab({
  ownedMap,
}: {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center">
        <p className="text-sm font-medium">Presets & Comparison</p>
        <p className="text-xs text-muted-foreground mt-1">
          Coming soon — compare wonder combinations and explore strategic presets.
        </p>
      </div>

      {/* Presets preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WONDER_PRESETS.map((preset) => {
          const wondersInPreset = preset.wonderCodes
            .map((code) => WONDERS[code])
            .filter(Boolean);
          const ownedCount = preset.wonderCodes.filter(
            (code) => code in ownedMap
          ).length;

          return (
            <div
              key={preset.id}
              className="bg-card border border-border rounded-xl p-3.5 space-y-2.5 opacity-75"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{preset.label}</p>
                <span className="text-xs text-muted-foreground">
                  {ownedCount}/{preset.wonderCodes.length} owned
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {wondersInPreset.slice(0, 6).map((w) => (
                  <span
                    key={w.meta.code}
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium border",
                      w.meta.code in ownedMap
                        ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                        : "bg-muted text-muted-foreground border-transparent"
                    )}
                  >
                    {w.meta.name}
                  </span>
                ))}
                {wondersInPreset.length > 6 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                    +{wondersInPreset.length - 6}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WondersPage() {
  const ownedMap = useUserWondersMap();
  const ownedCount = Object.keys(ownedMap).length;

  return (
    <div className="flex min-h-0 flex-1 container-wrapper">
      <div className="w-full max-w-4xl mx-auto py-4 md:py-6 space-y-4">
        {/* Page header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">World Wonders</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ownedCount > 0
                ? `${ownedCount} wonder${ownedCount > 1 ? "s" : ""} in your collection`
                : "Track and manage your Wonders"}
            </p>
          </div>
          <AddWonderModal ownedMap={ownedMap} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-wonders">
          <div className="flex items-center gap-3">
            <TabsList>
              <TabsTrigger value="my-wonders">
                My Wonders
                {ownedCount > 0 && (
                  <span className="ml-1.5 text-[10px] bg-amber-400 text-amber-950 rounded-full px-1.5 py-0.5 font-bold leading-none">
                    {ownedCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-wonders" className="mt-4">
            <MyWondersTab ownedMap={ownedMap} />
          </TabsContent>

          <TabsContent value="presets" className="mt-4">
            <PresetsTab ownedMap={ownedMap} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
