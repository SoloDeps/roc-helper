"use client";

import Dexie, { type Table } from "dexie";

export type GoodsEntry = {
  type: string;
  amount: number;
};

// ✅ Interface pour les métadonnées parsées
export interface ParsedBuildingMetadata {
  section1: string;
  section2: string;
  section3: string;
  buildingName: string;
  tableType: "construction" | "upgrade";
  era: string;
  level: string;
  location?: string; // Ville/location du building
}

export interface ParsedTechnoMetadata {
  mainSection: string;
  subSection: string;
  thirdSection: string;
  era: string;
  index: string;
}

export interface BuildingEntity {
  id: string;
  name: string; // ✅ Ajouté : nom du building
  image: string; // ✅ Ajouté : chemin de l'image
  costs: {
    [key: string]: number | Array<{ type: string; amount: number }>;
  };
  maxQty: number;
  quantity: number;
  hidden: boolean;
  parsed: ParsedBuildingMetadata; // ✅ Ajouté
  updatedAt: number;
}

export interface TechnoEntity {
  id: string;
  costs: {
    [key: string]: number | Array<{ type: string; amount: number }>;
  };
  hidden: boolean;
  parsed?: ParsedTechnoMetadata; // ✅ Ajouté (optionnel pour rétrocompatibilité)
  updatedAt: number;
}

export interface UserResourceEntity {
  id: string;
  amount: number;
  type: string;
  lastUpdated: string;
  updatedAt: number;
}

export interface OttomanAreaEntity {
  id: string;
  areaIndex: number;
  costs: {
    [key: string]: number | Array<{ type: string; amount: number }>;
  };
  hidden: boolean;
  updatedAt: number;
}

export interface OttomanTradePostEntity {
  id: string;
  name: string;
  area: number;
  resource: string;
  levels: {
    unlock: boolean;
    lvl2: boolean;
    lvl3: boolean;
    lvl4: boolean;
    lvl5: boolean;
  };
  costs: {
    [key: string]: number | Array<{ type: string; amount: number }>;
  };
  sourceData?: {
    levels: {
      [key: number]: Array<{ resource: string; amount: number }>;
    };
  };
  hidden: boolean;
  updatedAt: number;
}

// Wiki DB - buildings, technologies, and Ottoman
export class RocWikiDB extends Dexie {
  buildings!: Table<BuildingEntity, string>;
  technos!: Table<TechnoEntity, string>;
  ottomanAreas!: Table<OttomanAreaEntity, string>;
  ottomanTradePosts!: Table<OttomanTradePostEntity, string>;

  constructor() {
    super("roc_wiki_db");

    // Version 1: Original tables
    this.version(1).stores({
      buildings: "id,updatedAt",
      technos: "id,updatedAt",
    });

    // Version 2: Add Ottoman tables
    this.version(2).stores({
      buildings: "id,updatedAt",
      technos: "id,updatedAt",
      ottomanAreas: "id,areaIndex,updatedAt",
      ottomanTradePosts: "id,name,updatedAt",
    });

    // ✅ Version 3: Add parsed metadata
    this.version(3)
      .stores({
        buildings: "id,updatedAt,parsed.tableType,parsed.location",
        technos: "id,updatedAt,parsed.era",
        ottomanAreas: "id,areaIndex,updatedAt",
        ottomanTradePosts: "id,name,updatedAt",
      })
      .upgrade((trans) => {
        // Migration: parser les IDs existants pour ajouter parsed
        return trans
          .table("buildings")
          .toCollection()
          .modify((building) => {
            if (!building.parsed) {
              building.parsed = parseBuildingIdFromEntity(building.id);
            }
            if (!building.name) {
              building.name = building.parsed.buildingName;
            }
            if (!building.image) {
              building.image = `/buildings/${building.parsed.section3.toLowerCase()}.webp`;
            }
          });
      });
  }
}

// Game DB - user resources
export class RocGameDB extends Dexie {
  userResources!: Table<UserResourceEntity, string>;

  constructor() {
    super("roc_game_db");

    this.version(1).stores({
      userResources: "id,type,updatedAt",
    });
  }
}

// ✅ Helper pour parser l'ID (migration)
function parseBuildingIdFromEntity(id: string): ParsedBuildingMetadata {
  const [rawPath, tableType, era, level] = id.split("|");
  const pathParts = rawPath.replace(/^\/+/, "").split("/");
  const [, section1, section2, section3] = pathParts;

  return {
    section1: section1 || "",
    section2: section2 || "",
    section3: section3 || "",
    buildingName: section3?.replace(/_/g, " ") || "",
    tableType: (tableType as "construction" | "upgrade") || "construction",
    era: era || "",
    level: level || "",
    location: section1 || "",
  };
}

// ✅ Singleton instances
let wikiDbInstance: RocWikiDB | null = null;
let gameDbInstance: RocGameDB | null = null;

export function getWikiDB(): RocWikiDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on client side");
  }

  if (!wikiDbInstance) {
    wikiDbInstance = new RocWikiDB();
    wikiDbInstance.open().catch((err) => {
      console.error("Failed to open roc_wiki_db:", err);
    });
  }

  return wikiDbInstance;
}

export function getGameDB(): RocGameDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on client side");
  }

  if (!gameDbInstance) {
    gameDbInstance = new RocGameDB();
    gameDbInstance.open().catch((err) => {
      console.error("Failed to open roc_game_db:", err);
    });
  }

  return gameDbInstance;
}

export const db = typeof window !== "undefined" ? getWikiDB() : null;
export const gameDb = typeof window !== "undefined" ? getGameDB() : null;
