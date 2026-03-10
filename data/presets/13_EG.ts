import type { PresetSection } from "./index";

export const sections_EG: PresetSection[] = [
  // ── Capital ──────────────────────────────────────────────────────────────
  {
    id: "capital_homes_EG",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "EG", level: 37, qty: 1  },
      { buildingId: "small_home",   type: "upgrade",      era: "EG", level: 37, qty: 29 },
      { buildingId: "small_home",   type: "upgrade",      era: "EG", level: 38, qty: 30 },
      { buildingId: "small_home",   type: "upgrade",      era: "EG", level: 39, qty: 30 },
      { buildingId: "average_home", type: "construction", era: "EG", level: 37, qty: 1  },
      { buildingId: "average_home", type: "upgrade",      era: "EG", level: 37, qty: 13 },
      { buildingId: "average_home", type: "upgrade",      era: "EG", level: 38, qty: 14 },
      { buildingId: "average_home", type: "upgrade",      era: "EG", level: 39, qty: 14 },
    ],
  },
  {
    id: "capital_farms_EG",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "construction", era: "EG", level: 37, qty: 1  },
      { buildingId: "rural_farm",    type: "upgrade",      era: "EG", level: 37, qty: 12 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "EG", level: 38, qty: 13 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "EG", level: 39, qty: 13 },
      { buildingId: "domestic_farm", type: "construction", era: "EG", level: 37, qty: 1  },
      { buildingId: "domestic_farm", type: "upgrade",      era: "EG", level: 37, qty: 10 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "EG", level: 38, qty: 11 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "EG", level: 39, qty: 11 },
    ],
  },
  {
    id: "capital_culture_sites_EG",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "construction", era: "EG", level: 13, qty: 1 },
      { buildingId: "little_culture_site",   type: "upgrade",      era: "EG", level: 13, qty: 9 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "EG", level: 13, qty: 9 },
      { buildingId: "moderate_culture_site", type: "construction", era: "EG", level: 13, qty: 1 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "EG", level: 13, qty: 5 },
      { buildingId: "large_culture_site",    type: "upgrade",      era: "EG", level: 13, qty: 1 },
    ],
  },
  {
    id: "capital_barracks_EG",
    label: "Barracks",
    category: "capital",
    entries: [
      // Les barracks EG utilisent le niveau LG|14 (partagé entre EG et LG)
      { buildingId: "infantry_barracks",       type: "upgrade", era: "EG", level: 13, qty: 2 },
      { buildingId: "ranged_barracks",         type: "upgrade", era: "EG", level: 13, qty: 1 },
      { buildingId: "cavalry_barracks",        type: "upgrade", era: "EG", level: 13, qty: 1 },
      { buildingId: "heavy_infantry_barracks", type: "upgrade", era: "EG", level: 13, qty: 1 },
      { buildingId: "siege_barracks",          type: "upgrade", era: "EG", level: 13, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_EG",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "alchemist",   type: "construction", era: "EG", level: 1, qty: 1 },
      { buildingId: "glassblower", type: "construction", era: "EG", level: 1, qty: 1 },
      { buildingId: "jeweler",     type: "construction", era: "EG", level: 1, qty: 3 },
    ],
  },
  {
    id: "capital_harbor_EG",
    label: "Harbor",
    category: "capital",
    entries: [
      { buildingId: "seafarer_house",   type: "construction", era: "EG", level: 1, qty: 14 },
      { buildingId: "seafarer_house",   type: "upgrade",      era: "EG", level: 2, qty: 14 },
      { buildingId: "shipyard",         type: "construction", era: "EG", level: 1, qty: 9  },
      { buildingId: "common_warehouse", type: "construction", era: "EG", level: 1, qty: 8  },
    ],
  },
  // ── Ottoman (areas 1–10, trade posts otp_0–otp_17) ───────────────────────
  {
    id: "ottoman_areas_EG",
    label: "Areas",
    category: "ottoman",
    entries: [
      { kind: "ottoman_area", areaId: "oa_1"  },
      { kind: "ottoman_area", areaId: "oa_2"  },
      { kind: "ottoman_area", areaId: "oa_3"  },
      { kind: "ottoman_area", areaId: "oa_4"  },
      { kind: "ottoman_area", areaId: "oa_5"  },
      { kind: "ottoman_area", areaId: "oa_6"  },
      { kind: "ottoman_area", areaId: "oa_7"  },
      { kind: "ottoman_area", areaId: "oa_8"  },
      { kind: "ottoman_area", areaId: "oa_9"  },
      { kind: "ottoman_area", areaId: "oa_10" },
    ],
  },
  {
    id: "ottoman_tradeposts_EG",
    label: "Trade Posts",
    category: "ottoman",
    entries: [
      { kind: "ottoman_tradepost", tradePostId: "otp_0"  }, // area 0
      { kind: "ottoman_tradepost", tradePostId: "otp_1"  }, // area 0
      { kind: "ottoman_tradepost", tradePostId: "otp_2"  }, // area 1
      { kind: "ottoman_tradepost", tradePostId: "otp_3"  }, // area 1
      // { kind: "ottoman_tradepost", tradePostId: "otp_4"  }, // area 2
      { kind: "ottoman_tradepost", tradePostId: "otp_5"  }, // area 2
      // { kind: "ottoman_tradepost", tradePostId: "otp_6"  }, // area 3
      { kind: "ottoman_tradepost", tradePostId: "otp_7"  }, // area 3
      { kind: "ottoman_tradepost", tradePostId: "otp_8"  }, // area 4
      { kind: "ottoman_tradepost", tradePostId: "otp_9"  }, // area 5
      // { kind: "ottoman_tradepost", tradePostId: "otp_10" }, // area 6
      { kind: "ottoman_tradepost", tradePostId: "otp_11" }, // area 6
      { kind: "ottoman_tradepost", tradePostId: "otp_12" }, // area 7
      { kind: "ottoman_tradepost", tradePostId: "otp_13" }, // area 8
      // { kind: "ottoman_tradepost", tradePostId: "otp_14" }, // area 9
      { kind: "ottoman_tradepost", tradePostId: "otp_15" }, // area 9
      { kind: "ottoman_tradepost", tradePostId: "otp_16" }, // area 10
      { kind: "ottoman_tradepost", tradePostId: "otp_17" }, // area 10
    ],
  },
];