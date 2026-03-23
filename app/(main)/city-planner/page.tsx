"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { useCityPlannerStore } from "@/planner/state/cityPlannerStore";
import {
  listLayouts,
  deleteLayout,
  type CityLayout,
} from "@/planner/utils/layoutDB";
import type { CityId } from "@/planner/data/cityGridDefinitions";

// ─────────────────────────────────────────────────────────────────────────────
// Config villes
// ─────────────────────────────────────────────────────────────────────────────

const CITIES: { id: CityId; name: string; color: string; flag: string }[] = [
  { id: "City_Capital", name: "Capital", color: "#4A7C59", flag: "🏰" },
  { id: "City_Egypt", name: "Egypt", color: "#C8973A", flag: "🏺" },
  { id: "City_China", name: "China", color: "#C0392B", flag: "🐉" },
  { id: "City_Arabia", name: "Arabia", color: "#8E44AD", flag: "🌙" },
  { id: "City_Vikings", name: "Vikings", color: "#2980B9", flag: "⚔️" },
  { id: "City_Mayas", name: "Mayas", color: "#27AE60", flag: "🌿" },
];

export const CITY_CONFIG = CITIES;

// ─────────────────────────────────────────────────────────────────────────────
// Page listing
// ─────────────────────────────────────────────────────────────────────────────

export default function CityPlannerListPage() {
  const router = useRouter();
  const [layouts, setLayouts] = useState<CityLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    listLayouts().then((l) => {
      setLayouts(l);
      setLoading(false);
    });
  }, []);

  const setActiveLayoutId = useCityPlannerStore((s) => s.setActiveLayoutId);
  const setActiveCityId = useCityPlannerStore((s) => s.setActiveCityId);

  const handleCreate = (cityId: CityId) => {
    setModalOpen(false);
    setActiveLayoutId(null);
    setActiveCityId(cityId);
    router.push("/city-planner/editor");
  };

  const handleOpen = (id: string) => {
    setActiveLayoutId(id);
    setActiveCityId(null);
    router.push("/city-planner/editor");
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce layout ?")) return;
    setDeleting(id);
    await deleteLayout(id);
    setLayouts((prev) => prev.filter((l) => l.id !== id));
    setDeleting(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">City Planner</h1>
        <ResponsiveModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          trigger={
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <span className="text-lg leading-none">+</span>
              Nouveau layout
            </button>
          }
        >
          <NewLayoutModal
            onSelect={handleCreate}
            onClose={() => setModalOpen(false)}
          />
        </ResponsiveModal>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full">
        {/* Récents */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Récents
          </h2>

          {loading ? (
            <SkeletonGrid />
          ) : layouts.length === 0 ? (
            <EmptyState onNew={() => setModalOpen(true)} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Case + */}
              <NewCard onClick={() => setModalOpen(true)} />
              {layouts.map((layout) => (
                <LayoutCard
                  key={layout.id}
                  layout={layout}
                  onOpen={() => handleOpen(layout.id)}
                  onDelete={(e) => handleDelete(e, layout.id)}
                  isDeleting={deleting === layout.id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section future : Importés */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Importés depuis le jeu
          </h2>
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Les villes importées via l&apos;extension apparaîtront ici.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Bientôt disponible
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout Card
// ─────────────────────────────────────────────────────────────────────────────

function LayoutCard({
  layout,
  onOpen,
  onDelete,
  isDeleting,
}: {
  layout: CityLayout;
  onOpen: () => void;
  onDelete: (e: React.MouseEvent) => void;
  isDeleting: boolean;
}) {
  const city = CITIES.find((c) => c.id === layout.cityId);
  const date = new Date(layout.updatedAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div
      onClick={onOpen}
      className={`group relative rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Miniature */}
      <div className="aspect-video bg-muted overflow-hidden">
        {layout.thumbnail ? (
          <img
            src={layout.thumbnail}
            alt={layout.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: city ? `${city.color}22` : undefined }}
          >
            {city?.flag ?? "🏙️"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-medium truncate">{layout.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {city && (
            <span className="text-xs" style={{ color: city.color }}>
              {city.flag} {city.name}
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{date}</span>
        </div>
      </div>

      {/* Supprimer au hover */}
      <button
        onClick={onDelete}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 border border-border text-muted-foreground hover:text-destructive hover:border-destructive opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs"
        title="Supprimer"
      >
        ✕
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function NewCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/60 hover:bg-accent/40 transition-colors flex flex-col items-center justify-center gap-1.5 group"
    >
      <span className="text-2xl text-muted-foreground group-hover:text-primary transition-colors">
        +
      </span>
      <span className="text-xs text-muted-foreground group-hover:text-primary">
        Nouveau
      </span>
    </button>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <span className="text-5xl">🏙️</span>
      <p className="text-muted-foreground text-sm">
        Aucun layout pour l&apos;instant.
      </p>
      <button
        onClick={onNew}
        className="mt-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
      >
        Créer mon premier layout
      </button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden border">
          <div className="aspect-video bg-muted animate-pulse" />
          <div className="p-2 flex flex-col gap-1.5">
            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-2.5 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal nouvelle ville
// ─────────────────────────────────────────────────────────────────────────────

function NewLayoutModal({
  onSelect,
  onClose,
}: {
  onSelect: (cityId: CityId) => void;
  onClose: () => void;
}) {
  return (
    <div className="p-5 flex flex-col gap-4 min-w-72">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Nouvelle ville</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choisir la ville à planifier
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelect(city.id)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-transparent hover:border-border hover:bg-accent transition-colors text-left group"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: city.color }}
            />
            <span className="text-base">{city.flag}</span>
            <span className="text-sm font-medium">{city.name}</span>
            <span className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-xs">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
