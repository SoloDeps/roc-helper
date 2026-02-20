"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
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
  // ✅ New DB format: "eg_0" (sans préfixe "tech_")
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

  // Merge registry data with DB hidden status
  // ✅ DB id "eg_0" vs registry id "tech_eg_0" — strip prefix to match
  const technosWithStatus = useMemo(() => {
    if (!technosInDB || !selectedEraTechnologies.length) return [];

    return selectedEraTechnologies.map((tech) => {
      const dbId = tech.id.replace(/^tech_/, ""); // "tech_eg_0" → "eg_0"
      const dbTech = technosInDB.find((t) => t.id === dbId);
      return {
        ...tech,
        hidden: dbTech ? !!dbTech.hidden : false,
      };
    });
  }, [selectedEraTechnologies, technosInDB]);

  const handleAddNewEra = () => {
    setDirectTechnologyMode(true);
    selectCategory("technology");
    openModal();
  };

  // Empty state
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

  const eraOptions = availableEras.map((era) => ({
    value: era.id,
    label: era.name,
  }));

  return (
    <div className="size-full mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/calculator">
          <Button variant="ghost" size="sm">
            ← Calculator
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-56">
              <ResponsiveSelect
                label="Saved Eras"
                value={selectedEraId || ""}
                onValueChange={(newEraId) => selectEra(newEraId)}
                options={eraOptions}
                placeholder="Select an era"
              />
            </div>
          </div>
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

      {selectedEraId && technosWithStatus.length > 0 && (
        <>
          <div className="hidden md:block" key={`desktop-${selectedEraId}`}>
            <TechTreeDesktop technologies={technosWithStatus} />
          </div>
          <div className="md:hidden" key={`mobile-${selectedEraId}`}>
            <TechTreeMobile technologies={technosWithStatus} />
          </div>
        </>
      )}

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
