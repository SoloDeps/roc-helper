// ============================================================
// ROC Helper – Wonder Config
//
// Constantes UI partagées entre wonder-card.tsx et
// wonder-detail-modal.tsx (et tout autre composant wonder).
//
// ─ WONDER_IMAGE_MAP       : code → chemin image
// ─ WONDER_IMAGE_OFFSET_PX : code → décalage vertical (px)
// ─ MATERIAL_COLORS        : MaterialType → classes Tailwind
// ─ getCostTables          : helper sélecteur de tables de coûts
// ─ getGoodsTable          : helper sélecteur de table goods
// ─ fmtCost / fmtCompact   : formatage nombres
// ============================================================

import type { MaterialType, Wonder, WonderSlot } from "./types";

import {
  AW_COIN_COSTS,
  GE_COIN_COSTS,
  SM_COIN_COSTS,
  ARABIA_COIN_COSTS,
  AW_FOOD_COSTS,
  GE_FOOD_COSTS,
  SM_FOOD_COSTS,
  ARABIA_FOOD_COSTS,
} from "./coin-food-costs";

import {
  AW_RP_COSTS,
  GE_SM_RP_COSTS,
  BLUEPRINT_COSTS,
  getMaterialAmounts,
  AW_CAPITAL_WORKERS,
  GE_SM_CAPITAL_WORKERS,
} from "./shared-costs";

import {
  AW_CAPITAL_GOODS,
  GE_CAPITAL_GOODS,
  SM_CAPITAL_GOODS,
  EGYPT_GOODS,
  CHINA_GOODS,
  MAYA_GOODS,
  VIKING_GOODS,
  ARABIA_GOODS,
} from "./goods-costs";

// ─── Re-exports utiles pour les consumers ────────────────────────────────────
export {
  BLUEPRINT_COSTS,
  getMaterialAmounts,
  AW_CAPITAL_WORKERS,
  GE_SM_CAPITAL_WORKERS,
};

// ─── Images ──────────────────────────────────────────────────────────────────

export const WONDER_IMAGE_MAP: Record<string, string> = {
  SH:    "/images/wonders/banners/capital_stonehenge.webp",
  HG:    "/images/wonders/banners/capital_hanginggardens.webp",
  SoZ:   "/images/wonders/banners/capital_statueofzeus.webp",
  ToA:   "/images/wonders/banners/capital_templeofartemis.webp",
  ToM:   "/images/wonders/banners/capital_mausoleum.webp",
  LoA:   "/images/wonders/banners/capital_lighthouse.webp",
  CoR:   "/images/wonders/banners/capital_colossus.webp",
  CP:    "/images/wonders/banners/egypt_cheopspyramid.webp",
  GS:    "/images/wonders/banners/egypt_greatsphinx.webp",
  AS:    "/images/wonders/banners/egypt_abusimbel.webp",
  HS:    "/images/wonders/banners/capital_hagiasophia.webp",
  C:     "/images/wonders/banners/capital_colosseum.webp",
  PoA:   "/images/wonders/banners/capital_palaceofaachen.webp",
  SF:    "/images/wonders/banners/capital_sherwoodforest.webp",
  TA:    "/images/wonders/banners/china_terracottaarmy.webp",
  FC:    "/images/wonders/banners/china_forbiddencity.webp",
  GW:    "/images/wonders/banners/china_greatwall.webp",
  SP:    "/images/wonders/banners/mayas_sayilpalace.webp",
  T: "/images/wonders/banners/mayas_tikal.webp",
  CI:    "/images/wonders/banners/mayas_chichenitza.webp",
  A:     "/images/wonders/banners/capital_alhambra.webp",
  CC:    "/images/wonders/banners/capital_carcassonne.webp",
  LToP:  "/images/wonders/banners/capital_towerofpisa.webp",
  Y:     "/images/wonders/banners/vikings_yggdrasil.webp",
  DE:    "/images/wonders/banners/vikings_dragonshipellida.webp",
  V:     "/images/wonders/banners/vikings_valhalla.webp",
  P:     "/images/wonders/banners/arabia_petra.webp",
  CoB:   "/images/wonders/banners/arabia_cityofbrass.webp",
};

export const WONDER_IMAGE_OFFSET_PX: Record<string, number> = {
  SH: -2,  HG: -4,  SoZ: -15, ToA: -16, ToM: -16, LoA: -16, CoR: -16,
  CP: -8,  GS: -17, AS: -2,   HS: -5,   C: -16,   PoA: -12, SF: -16,
  TA: -1,  FC: -14, GW: -14,  SP: -1,   T: -15, CI: -7,
  A: -8,   CC: -1,  LToP: -12, Y: -7,   DE: -1,   V: -11,  P: -16, CoB: -13,
};

// ─── Material colors ──────────────────────────────────────────────────────────

export const MATERIAL_COLORS: Record<MaterialType, string> = {
  Statue:   "bg-[#f36e3d] text-white",
  Temple:   "bg-[#f9931e] text-white",
  Nature:   "bg-[#51a963] text-white",
  Palace:   "bg-[#c37be4] text-white",
  Naval:    "bg-[#3f8ddb] text-white",
  Arena:    "bg-[#990b0b] text-white",
  Fortress: "bg-[#414cea] text-white",
};

// ─── Cost table selector ──────────────────────────────────────────────────────

export function getCostTables(wonder: Wonder) {
  const { groupCode, slot } = wonder.meta;

  if (slot === "Arabia") {
    return {
      coinTable:   ARABIA_COIN_COSTS,
      foodTable:   ARABIA_FOOD_COSTS,
      rpTable:     GE_SM_RP_COSTS,
      workerTable: GE_SM_CAPITAL_WORKERS,
    };
  }

  if (groupCode === "AW") {
    return {
      coinTable:   AW_COIN_COSTS,
      foodTable:   AW_FOOD_COSTS,
      rpTable:     AW_RP_COSTS,
      workerTable: AW_CAPITAL_WORKERS,
    };
  }

  if (groupCode === "GE") {
    return {
      coinTable:   GE_COIN_COSTS,
      foodTable:   GE_FOOD_COSTS,
      rpTable:     GE_SM_RP_COSTS,
      workerTable: GE_SM_CAPITAL_WORKERS,
    };
  }

  // SM – Capital City → SM tables ; autres slots (Viking…) → GE tables
  if (groupCode === "SM") {
    if (slot === "Capital City") {
      return {
        coinTable:   SM_COIN_COSTS,
        foodTable:   SM_FOOD_COSTS,
        rpTable:     GE_SM_RP_COSTS,
        workerTable: GE_SM_CAPITAL_WORKERS,
      };
    }
    return {
      coinTable:   GE_COIN_COSTS,
      foodTable:   GE_FOOD_COSTS,
      rpTable:     GE_SM_RP_COSTS,
      workerTable: GE_SM_CAPITAL_WORKERS,
    };
  }

  // Fallback
  return {
    coinTable:   AW_COIN_COSTS,
    foodTable:   AW_FOOD_COSTS,
    rpTable:     AW_RP_COSTS,
    workerTable: AW_CAPITAL_WORKERS,
  };
}

// ─── Goods table selector ─────────────────────────────────────────────────────

export function getGoodsTable(wonder: Wonder) {
  const { groupCode, slot } = wonder.meta;

  if (slot === "Arabia")        return ARABIA_GOODS;
  if (slot === "Egypt")         return EGYPT_GOODS;
  if (slot === "China")         return CHINA_GOODS;
  if (slot === "Maya Empire")   return MAYA_GOODS;
  if (slot === "Viking Kingdom") return VIKING_GOODS;

  // Capital City
  if (groupCode === "AW") return AW_CAPITAL_GOODS;
  if (groupCode === "GE") return GE_CAPITAL_GOODS;
  if (groupCode === "SM") return SM_CAPITAL_GOODS;

  return AW_CAPITAL_GOODS;
}

// ─── Formatage ────────────────────────────────────────────────────────────────

/** Format lisible niveau par niveau : 2 500 / 100 K / 1.5 M */
export function fmtCost(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K`;
  return n.toLocaleString("fr-FR");
}

/** Format compact pour les totaux : 4.2M / 850K */
export function fmtCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/** Somme des montants dans un tableau coin/food cost */
export function sumCostEntries(entries: { amount: number; gears: number }[]): number {
  return entries.reduce((acc, e) => acc + e.amount, 0);
}

/** Somme des amounts goods pour un niveau */
export function sumGoodsEntries(entries: { iconKey: string; amount: number; gears: number }[]): number {
  return entries.reduce((acc, e) => acc + e.amount, 0);
}
