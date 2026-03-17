import type { PresetSection } from "./index";

export const sections_KS: PresetSection[] = [
  {
    id: "capital_homes_KS",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "KS", level: 31, qty: 1  },
      { buildingId: "small_home",   type: "upgrade",      era: "KS", level: 31, qty: 27 },
      { buildingId: "small_home",   type: "upgrade",      era: "KS", level: 32, qty: 28 },
      { buildingId: "small_home",   type: "upgrade",      era: "KS", level: 33, qty: 28 },
      { buildingId: "average_home", type: "construction", era: "KS", level: 31, qty: 1  },
      { buildingId: "average_home", type: "upgrade",      era: "KS", level: 31, qty: 11 },
      { buildingId: "average_home", type: "upgrade",      era: "KS", level: 32, qty: 12 },
      { buildingId: "average_home", type: "upgrade",      era: "KS", level: 33, qty: 12 },
    ],
  },
  {
    id: "capital_farms_KS",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "upgrade",      era: "KS", level: 31, qty: 11 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "KS", level: 32, qty: 11 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "KS", level: 33, qty: 11 },
      { buildingId: "domestic_farm", type: "construction", era: "KS", level: 31, qty: 1  },
      { buildingId: "domestic_farm", type: "upgrade",      era: "KS", level: 31, qty: 9  },
      { buildingId: "domestic_farm", type: "upgrade",      era: "KS", level: 32, qty: 10 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "KS", level: 33, qty: 10 },
    ],
  },
  {
    id: "capital_culture_sites_KS",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "upgrade",      era: "KS", level: 11, qty: 7 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "KS", level: 11, qty: 9 },
      { buildingId: "moderate_culture_site", type: "construction", era: "KS", level: 11, qty: 1 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "KS", level: 11, qty: 4 },
      { buildingId: "large_culture_site",    type: "upgrade",      era: "KS", level: 11, qty: 1 },
    ],
  },
  {
    id: "capital_barracks_KS",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks",       type: "upgrade", era: "KS", level: 11, qty: 2 },
      { buildingId: "ranged_barracks",         type: "upgrade", era: "KS", level: 11, qty: 1 },
      { buildingId: "cavalry_barracks",        type: "upgrade", era: "KS", level: 11, qty: 1 },
      { buildingId: "heavy_infantry_barracks", type: "upgrade", era: "KS", level: 11, qty: 1 },
      { buildingId: "siege_barracks",          type: "upgrade", era: "KS", level: 11, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_KS",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "secondary_workshop", type: "upgrade", era: "KS", level: 5, qty: 1 },
      { buildingId: "primary_workshop",   type: "upgrade", era: "KS", level: 5, qty: 4 },
      { buildingId: "tertiary_workshop",  type: "upgrade", era: "KS", level: 5, qty: 1 },
    ],
  },
  {
    id: "arabia_homes_KS",
    label: "Homes",
    category: "arabia",
    entries: [
      { buildingId: "medium_home", type: "construction", era: "KS", level: 1, qty: 13 },
      { buildingId: "medium_home", type: "upgrade",      era: "KS", level: 2, qty: 13 },
      { buildingId: "medium_home", type: "upgrade",      era: "KS", level: 3, qty: 13 },
    ],
  },
  {
    id: "arabia_merchant_KS",
    label: "Merchants",
    category: "arabia",
    entries: [
      { buildingId: "camel_farm", type: "construction", era: "KS", level: 2, qty: 5 },
      { buildingId: "merchant",   type: "construction", era: "KS", level: 1, qty: 8 },
      { buildingId: "merchant",   type: "upgrade",      era: "KS", level: 2, qty: 8 },
      { buildingId: "merchant",   type: "upgrade",      era: "KS", level: 3, qty: 8 },
    ],
  },
  {
    id: "arabia_workshops_KS",
    label: "Workshops",
    category: "arabia",
    entries: [
      { buildingId: "coffee_brewer", type: "construction", era: "KS", level: 2, qty: 2 },
      { buildingId: "incense_maker", type: "construction", era: "KS", level: 2, qty: 2 },
    ],
  },
];
