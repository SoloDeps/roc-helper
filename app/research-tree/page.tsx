"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
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
import { AlertCircle, Plus } from "lucide-react";
import { useAddElementStore } from "@/lib/stores/add-element-store";
import { AddElementModal } from "@/components/modals/add-element/add-element-modal";

export default function ResearchTreePage() {
  const selectedEraId = useSelectedEraId();
  const selectEra = useSelectEra();
  const { openModal, selectCategory, setDirectTechnologyMode } =
    useAddElementStore();

  // Fetch all technologies from DB
  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos.toArray();
  }, []);

  // Get available eras (eras that have at least one techno in DB)
  const availableEras = useMemo(() => {
    if (!technosInDB || technosInDB.length === 0) return [];

    const eraIds = new Set(technosInDB.map((t) => t.eraId));
    return ERAS.filter((era) => eraIds.has(era.id));
  }, [technosInDB]);

  // Auto-select first available era if none selected
  useEffect(() => {
    if (!selectedEraId && availableEras.length > 0) {
      selectEra(availableEras[0].id);
    }
  }, [selectedEraId, availableEras, selectEra]);

  // Get technologies for selected era (from registry, not DB)
  const selectedEraTechnologies = useMemo(() => {
    if (!selectedEraId) return [];
    return getTechnologiesByEra(selectedEraId);
  }, [selectedEraId]);

  // Get techno entities from DB to check hidden status
  const technosWithStatus = useMemo(() => {
    if (!technosInDB || !selectedEraTechnologies.length) return [];

    return selectedEraTechnologies.map((tech) => {
      const dbTech = technosInDB.find((t) => t.id === tech.id);
      return {
        ...tech,
        hidden: dbTech?.hidden ?? false,
      };
    });
  }, [selectedEraTechnologies, technosInDB]);

  // ✅ FIX 1 & 2: Open modal in direct technology mode (skip category selection, hide back button)
  const handleAddNewEra = () => {
    setDirectTechnologyMode(true); // ✅ Enable direct mode
    selectCategory("technology");
    openModal();
  };

  // No technologies in DB - Empty state
  if (!technosInDB || technosInDB.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Research Tree</h1>
          <Link href="/calculator">
            <Button variant="ghost" size="sm">
              ← Calculator
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <AlertCircle className="size-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground text-center">
            No technologies added yet
          </p>
          <Button onClick={handleAddNewEra}>
            <Plus className="size-4 mr-2" />
            Add your first era
          </Button>
        </div>

        <div className="hidden">
          <AddElementModal variant="ghost" />
        </div>
      </div>
    );
  }

  // ✅ FIX 3: UX improved - "Saved Eras" dropdown + "Add New Era" button
  const eraOptions = availableEras.map((era) => ({
    value: era.id,
    label: era.name,
  }));

  return (
    <div className="size-full mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* <h1 className="text-2xl font-bold">Research Tree</h1> */}
        <Link href="/calculator">
          <Button variant="ghost" size="sm">
            ← Calculator
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        {/* ✅ NEW UX: Saved Eras + Add New Era */}
        <div className="space-y-3 mb-6">
          {/* Saved Eras Selector */}
          <div className="flex items-center gap-3">
            <div className="w-56">
              <ResponsiveSelect
                label="Saved Eras"
                value={selectedEraId || ""}
                onValueChange={(newEraId) => {
                  selectEra(newEraId);
                }}
                options={eraOptions}
                placeholder="Select an era"
              />
            </div>
          </div>

          {/* Add New Era Button */}
        </div>
        <Button
          variant="outline"
          onClick={handleAddNewEra}
          className="w-full md:w-52"
        >
          <Plus className="size-4 mr-2" />
          Add New Era
        </Button>
      </div>

      {/* Tech tree display */}
      {selectedEraId && technosWithStatus.length > 0 && (
        <>
          {/* Desktop: React Flow */}
          <div className="hidden md:block" key={`desktop-${selectedEraId}`}>
            <TechTreeDesktop technologies={technosWithStatus} />
          </div>

          {/* Mobile: Vertical list */}
          <div className="md:hidden" key={`mobile-${selectedEraId}`}>
            <TechTreeMobile technologies={technosWithStatus} />
          </div>
        </>
      )}

      {/* No technologies for selected era */}
      {selectedEraId && technosWithStatus.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 border border-dashed border-border rounded-lg">
          <AlertCircle className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            No technologies found for this era
          </p>
        </div>
      )}

      <div className="hidden">
        <AddElementModal variant="ghost" />
      </div>
    </div>
  );
}
