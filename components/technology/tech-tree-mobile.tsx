"use client";

import React, { useMemo, useState, useCallback } from "react";
import { TechCard } from "./tech-card";
import { TechDetailsModal } from "./tech-details-modal";
import type { TechnoData } from "@/types/shared";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";

interface TechTreeMobileProps {
  technologies: TechnoData[];
}

export function TechTreeMobile({ technologies }: TechTreeMobileProps) {
  const [selectedTech, setSelectedTech] = useState<TechnoData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch completion status from DB
  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    const techIds = technologies.map((t) => t.id);
    return await db.technos.where("id").anyOf(techIds).toArray();
  }, [technologies]);

  // Group technologies by column
  const groupedByColumn = useMemo(() => {
    const groups = new Map<number, TechnoData[]>();

    technologies.forEach((tech) => {
      if (!groups.has(tech.column)) {
        groups.set(tech.column, []);
      }
      groups.get(tech.column)!.push(tech);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [technologies]);

  // Handle toggle completion
  const handleToggleComplete = useCallback(async (techId: string) => {
    const db = getWikiDB();
    const techno = await db.technos.get(techId);

    if (techno) {
      // Toggle hidden status to track completion
      await db.technos.update(techId, {
        hidden: !techno.hidden,
        updatedAt: Date.now(),
      });
    }
  }, []);

  // Handle show details
  const handleShowDetails = useCallback((tech: TechnoData) => {
    setSelectedTech(tech);
    setIsModalOpen(true);
  }, []);

  // Get completion status
  const getCompletionStatus = useCallback(
    (techId: string) => {
      if (!technosInDB) return false;
      const techno = technosInDB.find((t) => t.id === techId);
      return techno?.hidden ?? false; // hidden = completed
    },
    [technosInDB],
  );

  return (
    <>
      <div className="space-y-6 pb-4">
        {groupedByColumn.map(([columnIndex, techs]) => (
          <div key={columnIndex} className="space-y-3">
            {/* Column header */}
            <div className="sticky top-0 z-10 bg-background py-2">
              <div className="text-sm font-semibold text-muted-foreground">
                Column {columnIndex + 1}
              </div>
            </div>

            {/* Technologies cards */}
            <div className="space-y-2">
              {techs.map((tech) => (
                <TechCard
                  key={tech.id}
                  tech={tech}
                  isCompleted={getCompletionStatus(tech.id)}
                  onToggleComplete={handleToggleComplete}
                  onShowDetails={handleShowDetails}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      <TechDetailsModal
        tech={selectedTech}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
