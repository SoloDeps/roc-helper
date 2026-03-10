import type { PresetSection } from "./index";

export const sections_BA: PresetSection[] = [
  {
    id: "capital_homes_BA",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "BA", level: 4, qty: 5  },
      { buildingId: "small_home",   type: "upgrade",      era: "BA", level: 4, qty: 7  },
      { buildingId: "small_home",   type: "upgrade",      era: "BA", level: 5, qty: 12 },
      { buildingId: "small_home",   type: "upgrade",      era: "BA", level: 6, qty: 12 },
      { buildingId: "average_home", type: "construction", era: "BA", level: 4, qty: 2  },
      { buildingId: "average_home", type: "upgrade",      era: "BA", level: 5, qty: 2  },
      { buildingId: "average_home", type: "upgrade",      era: "BA", level: 6, qty: 2  },
    ],
  },
  {
    id: "capital_farms_BA",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "construction", era: "BA", level: 4, qty: 1 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "BA", level: 4, qty: 3 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "BA", level: 5, qty: 4 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "BA", level: 6, qty: 4 },
      { buildingId: "domestic_farm", type: "construction", era: "BA", level: 4, qty: 1 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "BA", level: 4, qty: 2 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "BA", level: 5, qty: 3 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "BA", level: 6, qty: 3 },
    ],
  },
  {
    id: "capital_culture_sites_BA",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "construction", era: "BA", level: 2, qty: 3 },
      { buildingId: "compact_culture_site",  type: "construction", era: "BA", level: 2, qty: 1 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "BA", level: 2, qty: 4 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "BA", level: 2, qty: 2 },
    ],
  },
  {
    id: "capital_barracks_BA",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks",  type: "upgrade",      era: "BA", level: 2, qty: 2 },
      { buildingId: "ranged_barracks",    type: "upgrade",      era: "BA", level: 2, qty: 1 },
      { buildingId: "cavalry_barracks",   type: "construction", era: "BA", level: 2, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_BA",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "artisan",     type: "construction", era: "BA", level: 1, qty: 1 },
      { buildingId: "stone_mason", type: "construction", era: "BA", level: 1, qty: 1 },
      { buildingId: "tailor",      type: "construction", era: "BA", level: 1, qty: 1 },
    ],
  },
];
