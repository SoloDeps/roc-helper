import type { PresetSection } from "./index";

export const sections_BE: PresetSection[] = [
  {
    id: "capital_homes_BE",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "BE", level: 19, qty: 2  },
      { buildingId: "small_home",   type: "upgrade",      era: "BE", level: 19, qty: 22 },
      { buildingId: "small_home",   type: "upgrade",      era: "BE", level: 20, qty: 24 },
      { buildingId: "small_home",   type: "upgrade",      era: "BE", level: 21, qty: 24 },
      { buildingId: "average_home", type: "construction", era: "BE", level: 19, qty: 1  },
      { buildingId: "average_home", type: "upgrade",      era: "BE", level: 19, qty: 7  },
      { buildingId: "average_home", type: "upgrade",      era: "BE", level: 20, qty: 8  },
      { buildingId: "average_home", type: "upgrade",      era: "BE", level: 21, qty: 8  },
    ],
  },
  {
    id: "capital_farms_BE",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "upgrade",      era: "BE", level: 19, qty: 9 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "BE", level: 20, qty: 9 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "BE", level: 21, qty: 9 },
      { buildingId: "domestic_farm", type: "construction", era: "BE", level: 19, qty: 1 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "BE", level: 19, qty: 7 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "BE", level: 20, qty: 8 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "BE", level: 21, qty: 8 },
    ],
  },
  {
    id: "capital_culture_sites_BE",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "construction", era: "BE", level: 7, qty: 1 },
      { buildingId: "little_culture_site",   type: "upgrade",      era: "BE", level: 7, qty: 6 },
      { buildingId: "compact_culture_site",  type: "construction", era: "BE", level: 7, qty: 1 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "BE", level: 7, qty: 8 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "BE", level: 7, qty: 4 },
      { buildingId: "large_culture_site",    type: "upgrade",      era: "BE", level: 7, qty: 1 },
    ],
  },
  {
    id: "capital_barracks_BE",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks",       type: "upgrade", era: "BE", level: 7, qty: 2 },
      { buildingId: "ranged_barracks",         type: "upgrade", era: "BE", level: 7, qty: 1 },
      { buildingId: "cavalry_barracks",        type: "upgrade", era: "BE", level: 7, qty: 1 },
      { buildingId: "heavy_infantry_barracks", type: "upgrade", era: "BE", level: 7, qty: 1 },
      { buildingId: "siege_barracks",          type: "upgrade", era: "BE", level: 7, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_BE",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "secondary_workshop", type: "construction", era: "BE", level: 1, qty: 1 },
      { buildingId: "primary_workshop",   type: "construction", era: "BE", level: 1, qty: 3 },
      { buildingId: "tertiary_workshop",  type: "construction", era: "BE", level: 1, qty: 1 },
    ],
  },
  {
    id: "maya_homes_BE",
    label: "Homes",
    category: "maya",
    entries: [
      { buildingId: "worker_home", type: "construction", era: "BE", level: 1, qty: 15 },
      { buildingId: "worker_home", type: "upgrade",      era: "BE", level: 2, qty: 15 },
      { buildingId: "worker_home", type: "upgrade",      era: "BE", level: 3, qty: 15 },
      { buildingId: "priest_home", type: "construction", era: "BE", level: 1, qty: 6  },
      { buildingId: "priest_home", type: "upgrade",      era: "BE", level: 2, qty: 6  },
      { buildingId: "priest_home", type: "upgrade",      era: "BE", level: 3, qty: 6  },
    ],
  },
  {
    id: "maya_quarries_BE",
    label: "Quarries",
    category: "maya",
    entries: [
      { buildingId: "jade_quarry",     type: "construction", era: "BE", level: 1, qty: 3 },
      { buildingId: "jade_quarry",     type: "upgrade",      era: "BE", level: 2, qty: 3 },
      { buildingId: "jade_quarry",     type: "upgrade",      era: "BE", level: 3, qty: 3 },
      { buildingId: "obsidian_quarry", type: "construction", era: "BE", level: 1, qty: 3 },
      { buildingId: "obsidian_quarry", type: "upgrade",      era: "BE", level: 2, qty: 3 },
      { buildingId: "obsidian_quarry", type: "upgrade",      era: "BE", level: 3, qty: 3 },
    ],
  },
  {
    id: "maya_workshops_BE",
    label: "Workshops",
    category: "maya",
    entries: [
      { buildingId: "chronicler",    type: "construction", era: "BE", level: 1, qty: 2 },
      { buildingId: "mask_sculptor", type: "construction", era: "BE", level: 1, qty: 2 },
    ],
  },
  {
    id: "maya_ritual_sites_BE",
    label: "Ritual Sites",
    category: "maya",
    entries: [
      { buildingId: "small_ritual_site",  type: "construction", era: "BE", level: 1, qty: 3 },
      { buildingId: "average_ritual_site",  type: "construction", era: "BE", level: 1, qty: 4 },
    ],
  },
];
