import type { PresetSection } from "./index";

export const sections_ER: PresetSection[] = [
  {
    id: "capital_homes_ER",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "ER", level: 13, qty: 2  },
      { buildingId: "small_home",   type: "upgrade",      era: "ER", level: 13, qty: 18 },
      { buildingId: "small_home",   type: "upgrade",      era: "ER", level: 14, qty: 20 },
      { buildingId: "small_home",   type: "upgrade",      era: "ER", level: 15, qty: 20 },
      { buildingId: "average_home", type: "construction", era: "ER", level: 13, qty: 1  },
      { buildingId: "average_home", type: "upgrade",      era: "ER", level: 13, qty: 5  },
      { buildingId: "average_home", type: "upgrade",      era: "ER", level: 14, qty: 6  },
      { buildingId: "average_home", type: "upgrade",      era: "ER", level: 15, qty: 6  },
    ],
  },
  {
    id: "capital_farms_ER",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "construction", era: "ER", level: 13, qty: 1 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "ER", level: 13, qty: 7 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "ER", level: 14, qty: 8 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "ER", level: 15, qty: 8 },
      { buildingId: "domestic_farm", type: "construction", era: "ER", level: 13, qty: 1 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "ER", level: 13, qty: 5 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "ER", level: 14, qty: 6 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "ER", level: 15, qty: 6 },
    ],
  },
  {
    id: "capital_culture_sites_ER",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "construction", era: "ER", level: 5, qty: 1 },
      { buildingId: "little_culture_site",   type: "upgrade",      era: "ER", level: 5, qty: 4 },
      { buildingId: "compact_culture_site",  type: "construction", era: "ER", level: 5, qty: 1 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "ER", level: 5, qty: 7 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "ER", level: 5, qty: 3 },
      { buildingId: "large_culture_site",    type: "upgrade",      era: "ER", level: 5, qty: 1 },
    ],
  },
  {
    id: "capital_barracks_ER",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks",       type: "upgrade", era: "ER", level: 5, qty: 2 },
      { buildingId: "ranged_barracks",         type: "upgrade", era: "ER", level: 5, qty: 1 },
      { buildingId: "cavalry_barracks",        type: "upgrade", era: "ER", level: 5, qty: 1 },
      { buildingId: "heavy_infantry_barracks", type: "upgrade", era: "ER", level: 5, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_ER",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "primary_workshop",   type: "construction", era: "ER", level: 4, qty: 1 },
      { buildingId: "primary_workshop",   type: "upgrade",      era: "ER", level: 4, qty: 3 },
      { buildingId: "secondary_workshop", type: "upgrade",      era: "ER", level: 4, qty: 1 },
      { buildingId: "tertiary_workshop",  type: "upgrade",      era: "ER", level: 4, qty: 1 },
    ],
  },
  {
    id: "china_homes_ER",
    label: "Homes",
    category: "china",
    entries: [
      { buildingId: "small_home", type: "construction", era: "ER", level: 1, qty: 15 },
      { buildingId: "small_home", type: "upgrade",      era: "ER", level: 2, qty: 15 },
      { buildingId: "small_home", type: "upgrade",      era: "ER", level: 3, qty: 15 },
      { buildingId: "average_home", type: "construction", era: "ER", level: 1, qty: 5 },
      { buildingId: "average_home", type: "upgrade",      era: "ER", level: 2, qty: 5 },
      { buildingId: "average_home", type: "upgrade",      era: "ER", level: 3, qty: 5 },
    ],
  },
  {
    id: "china_farms_ER",
    label: "Rice Farms",
    category: "china",
    entries: [
      { buildingId: "rice_farm", type: "construction", era: "ER", level: 1, qty: 6 },
      { buildingId: "rice_farm", type: "upgrade",      era: "ER", level: 2, qty: 6 },
      { buildingId: "rice_farm", type: "upgrade",      era: "ER", level: 3, qty: 6 },
    ],
  },
  {
    id: "china_workshops_ER",
    label: "Workshops",
    category: "china",
    entries: [
      { buildingId: "silk_workshop", type: "construction", era: "ER", level: 1, qty: 4 },
      { buildingId: "thread_processor", type: "construction", era: "ER", level: 1, qty: 4 },
    ],
  },

];
