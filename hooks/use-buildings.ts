"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";
import type { BuildingEntity } from "@/lib/db/schema";

export function useBuildings() {
  const buildings = useLiveQuery(
    async () => {
      const db = getWikiDB();
      return await db.buildings.toArray();
    },
    [], // Dependencies
    [] as BuildingEntity[], // Default value
  );

  return buildings;
}

export function useBuilding(id: string) {
  const building = useLiveQuery(
    async () => {
      const db = getWikiDB();
      return await db.buildings.get(id);
    },
    [id],
    undefined,
  );

  return building;
}
