"use client";

import { getWikiDB } from "@/lib/db/schema";
import { getEraAbbr } from "@/lib/era-mappings";

export async function deleteAllBuildings(buildingIds: string[]): Promise<void> {
  const db = getWikiDB();
  await db.buildings.bulkDelete(buildingIds);
}

export async function deleteAllTechnosByEra(eraId: string): Promise<void> {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId); // "early_gothic_era" → "eg"

  const technos = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  if (technos.length > 0) {
    await db.technos.bulkDelete(technos.map((t) => t.id));
  }
}

export async function deleteAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  await db.ottomanAreas.clear();
}

export async function deleteAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  await db.ottomanTradePosts.clear();
}

export async function deleteAllTechnologies(): Promise<void> {
  const db = getWikiDB();
  await db.technos.clear();
}

export async function deleteAllCampaignsByEra(eraId: string): Promise<void> {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId);
  const regions = await db.campaigns
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  if (regions.length > 0) {
    await db.campaigns.bulkDelete(regions.map((r) => r.id));
  }
}

export async function deleteAllCampaigns(): Promise<void> {
  const db = getWikiDB();
  await db.campaigns.clear();
}
