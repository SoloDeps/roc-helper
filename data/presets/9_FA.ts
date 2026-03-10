import type { PresetSection } from "./index";

export const sections_FA: PresetSection[] = [
  {
    id: "capital_homes_FA",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "FA", level: 25, qty: 1  },
      { buildingId: "small_home",   type: "upgrade",      era: "FA", level: 25, qty: 25 },
      { buildingId: "small_home",   type: "upgrade",      era: "FA", level: 26, qty: 26 },
      { buildingId: "small_home",   type: "upgrade",      era: "FA", level: 27, qty: 26 },
      { buildingId: "average_home", type: "construction", era: "FA", level: 25, qty: 1  },
      { buildingId: "average_home", type: "upgrade",      era: "FA", level: 25, qty: 9  },
      { buildingId: "average_home", type: "upgrade",      era: "FA", level: 26, qty: 10 },
      { buildingId: "average_home", type: "upgrade",      era: "FA", level: 27, qty: 10 },
    ],
  },
  {
    id: "capital_farms_FA",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "upgrade",      era: "FA", level: 25, qty: 10 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "FA", level: 26, qty: 10 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "FA", level: 27, qty: 10 },
      { buildingId: "domestic_farm", type: "construction", era: "FA", level: 25, qty: 1  },
      { buildingId: "domestic_farm", type: "upgrade",      era: "FA", level: 25, qty: 8  },
      { buildingId: "domestic_farm", type: "upgrade",      era: "FA", level: 26, qty: 9  },
      { buildingId: "domestic_farm", type: "upgrade",      era: "FA", level: 27, qty: 9  },
    ],
  },
  {
    id: "capital_culture_sites_FA",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "upgrade", era: "FA", level: 9, qty: 7 },
      { buildingId: "compact_culture_site",  type: "upgrade", era: "FA", level: 9, qty: 9 },
      { buildingId: "moderate_culture_site", type: "upgrade", era: "FA", level: 9, qty: 4 },
      { buildingId: "large_culture_site",    type: "upgrade", era: "FA", level: 9, qty: 1 },
    ],
  },
  {
    id: "capital_barracks_FA",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks",       type: "upgrade", era: "FA", level: 9, qty: 2 },
      { buildingId: "ranged_barracks",         type: "upgrade", era: "FA", level: 9, qty: 1 },
      { buildingId: "cavalry_barracks",        type: "upgrade", era: "FA", level: 9, qty: 1 },
      { buildingId: "heavy_infantry_barracks", type: "upgrade", era: "FA", level: 9, qty: 1 },
      { buildingId: "siege_barracks",          type: "upgrade", era: "FA", level: 9, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_FA",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "carpenter",      type: "upgrade", era: "FA", level: 3, qty: 1 },
      { buildingId: "scribe",         type: "upgrade", era: "FA", level: 3, qty: 4 },
      { buildingId: "spice_merchant", type: "upgrade", era: "FA", level: 3, qty: 1 },
    ],
  },
  {
    id: "vikings_homes_FA",
    label: "Homes",
    category: "vikings",
    entries: [
      { buildingId: "worker_home", type: "construction", era: "FA", level: 1, qty: 15 },
      { buildingId: "worker_home", type: "upgrade",      era: "FA", level: 2, qty: 15 },
      { buildingId: "worker_home", type: "upgrade",      era: "FA", level: 3, qty: 15 },
      { buildingId: "sailor_home", type: "construction", era: "FA", level: 1, qty: 10 },
      { buildingId: "sailor_home", type: "upgrade",      era: "FA", level: 2, qty: 10 },
      { buildingId: "sailor_home", type: "upgrade",      era: "FA", level: 3, qty: 10 },
    ],
  },
  {
    id: "vikings_beehives_FA",
    label: "Beehives",
    category: "vikings",
    entries: [
      { buildingId: "beehive",      type: "construction", era: "FA", level: 1, qty: 11 },
      { buildingId: "beehive",      type: "upgrade",      era: "FA", level: 2, qty: 11 },
      { buildingId: "beehive",      type: "upgrade",      era: "FA", level: 3, qty: 11 },
    ],
  },
  {
    id: "vikings_fishing_FA",
    label: "Fishing Piers",
    category: "vikings",
    entries: [
      { buildingId: "fishing_pier", type: "construction", era: "FA", level: 1, qty: 6  },
      { buildingId: "fishing_pier", type: "upgrade",      era: "FA", level: 2, qty: 6  },
      { buildingId: "fishing_pier", type: "upgrade",      era: "FA", level: 3, qty: 6  },
    ],
  },
  {
    id: "vikings_tavern_FA",
    label: "Taverns",
    category: "vikings",
    entries: [
      { buildingId: "tavern",          type: "construction", era: "FA", level: 1, qty: 5 },
    ],
  },
  {
    id: "vikings_expedition_pier_FA",
    label: "Expedition Piers",
    category: "vikings",
    entries: [
      { buildingId: "expedition_pier", type: "construction", era: "FA", level: 1, qty: 3 },
    ],
  },
];
