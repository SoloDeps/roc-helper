import type { PresetSection } from "./index";

export const sections_LG: PresetSection[] = [
  // ── Capital ──────────────────────────────────────────────────────────────
  {
    id: "capital_homes_LG",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "upgrade", era: "LG", level: 40, qty: 30 },
      { buildingId: "small_home",   type: "upgrade", era: "LG", level: 41, qty: 30 },
      { buildingId: "small_home",   type: "upgrade", era: "LG", level: 42, qty: 30 },
      { buildingId: "average_home", type: "upgrade", era: "LG", level: 40, qty: 14 },
      { buildingId: "average_home", type: "upgrade", era: "LG", level: 41, qty: 14 },
      { buildingId: "average_home", type: "upgrade", era: "LG", level: 42, qty: 14 },
    ],
  },
  {
    id: "capital_farms_LG",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "upgrade", era: "LG", level: 40, qty: 13 },
      { buildingId: "rural_farm",    type: "upgrade", era: "LG", level: 41, qty: 13 },
      { buildingId: "rural_farm",    type: "upgrade", era: "LG", level: 42, qty: 13 },
      { buildingId: "domestic_farm", type: "upgrade", era: "LG", level: 40, qty: 11 },
      { buildingId: "domestic_farm", type: "upgrade", era: "LG", level: 41, qty: 11 },
      { buildingId: "domestic_farm", type: "upgrade", era: "LG", level: 42, qty: 11 },
    ],
  },
  {
    id: "capital_culture_sites_LG",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "construction", era: "LG", level: 14, qty: 1 },
      { buildingId: "little_culture_site",   type: "upgrade",      era: "LG", level: 14, qty: 9 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "LG", level: 14, qty: 9 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "LG", level: 14, qty: 6 },
      { buildingId: "large_culture_site",    type: "upgrade",      era: "LG", level: 14, qty: 1 },
    ],
  },
  {
    id: "capital_barracks_LG",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks",       type: "upgrade", era: "LG", level: 14, qty: 2 },
      { buildingId: "ranged_barracks",         type: "upgrade", era: "LG", level: 14, qty: 1 },
      { buildingId: "cavalry_barracks",        type: "upgrade", era: "LG", level: 14, qty: 1 },
      { buildingId: "heavy_infantry_barracks", type: "upgrade", era: "LG", level: 14, qty: 1 },
      { buildingId: "siege_barracks",          type: "upgrade", era: "LG", level: 14, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_LG",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "alchemist",   type: "upgrade", era: "LG", level: 2, qty: 1 },
      { buildingId: "glassblower", type: "upgrade", era: "LG", level: 2, qty: 1 },
      { buildingId: "jeweler",     type: "upgrade", era: "LG", level: 2, qty: 3 },
    ],
  },
  {
    id: "capital_harbor_LG",
    label: "Harbor",
    category: "capital",
    entries: [
      { buildingId: "seafarer_house",   type: "construction", era: "LG", level: 3, qty: 4 },
      { buildingId: "seafarer_house",   type: "upgrade",      era: "LG", level: 3, qty: 14 },
      { buildingId: "seafarer_house",   type: "upgrade",      era: "LG", level: 4, qty: 14 },
      { buildingId: "shipyard",         type: "construction", era: "LG", level: 2, qty: 4 },
      { buildingId: "shipyard",         type: "upgrade",      era: "LG", level: 2, qty: 9 },
      { buildingId: "common_warehouse", type: "construction", era: "LG", level: 2, qty: 4 },
      { buildingId: "common_warehouse", type: "upgrade",      era: "LG", level: 2, qty: 8 },
      { buildingId: "common_warehouse", type: "upgrade",      era: "LG", level: 3, qty: 8 },
      { buildingId: "lighthouse",       type: "construction", era: "LG", level: 1, qty: 5 },
      { buildingId: "pier",             type: "construction", era: "LG", level: 1, qty: 5 },
    ],
  },
  // ── Ottoman (areas 12–18, trade posts otp_18–otp_31) ─────────────────────
  {
    id: "ottoman_areas_LG",
    label: "Areas",
    category: "ottoman",
    entries: [
      // area 11 n'a pas de données dans areas_table — on commence à 12
      { kind: "ottoman_area", areaId: "oa_12" },
      { kind: "ottoman_area", areaId: "oa_13" },
      { kind: "ottoman_area", areaId: "oa_14" },
      { kind: "ottoman_area", areaId: "oa_15" },
      { kind: "ottoman_area", areaId: "oa_16" },
      { kind: "ottoman_area", areaId: "oa_17" },
      { kind: "ottoman_area", areaId: "oa_18" },
    ],
  },
  {
    id: "ottoman_tradeposts_LG",
    label: "Trade Posts",
    category: "ottoman",
    entries: [
      { kind: "ottoman_tradepost", tradePostId: "otp_18" }, // area 11
      { kind: "ottoman_tradepost", tradePostId: "otp_19" }, // area 11
      // { kind: "ottoman_tradepost", tradePostId: "otp_20" }, // area 12
      { kind: "ottoman_tradepost", tradePostId: "otp_21" }, // area 12
      // { kind: "ottoman_tradepost", tradePostId: "otp_22" }, // area 13
      { kind: "ottoman_tradepost", tradePostId: "otp_23" }, // area 13
      { kind: "ottoman_tradepost", tradePostId: "otp_24" }, // area 14
      { kind: "ottoman_tradepost", tradePostId: "otp_25" }, // area 14
      { kind: "ottoman_tradepost", tradePostId: "otp_26" }, // area 15
      { kind: "ottoman_tradepost", tradePostId: "otp_27" }, // area 16
      { kind: "ottoman_tradepost", tradePostId: "otp_28" }, // area 16
      { kind: "ottoman_tradepost", tradePostId: "otp_29" }, // area 17
      { kind: "ottoman_tradepost", tradePostId: "otp_30" }, // area 17
      { kind: "ottoman_tradepost", tradePostId: "otp_31" }, // area 18
    ],
  },
];