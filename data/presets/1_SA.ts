import type { PresetSection } from "./index";

export const sections_SA: PresetSection[] = [
  {
    id: "capital_homes_SA",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home", type: "construction", era: "SA", level: 1, qty: 7 },
      { buildingId: "small_home", type: "upgrade",      era: "SA", level: 2, qty: 7 },
      { buildingId: "small_home", type: "upgrade",      era: "SA", level: 3, qty: 7 },
    ],
  },
  {
    id: "capital_farms_SA",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "construction", era: "SA", level: 1, qty: 3 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "SA", level: 2, qty: 3 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "SA", level: 3, qty: 3 },
      { buildingId: "domestic_farm", type: "construction", era: "SA", level: 1, qty: 2 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "SA", level: 2, qty: 2 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "SA", level: 3, qty: 2 },
    ],
  },
  {
    id: "capital_culture_sites_SA",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "compact_culture_site",  type: "construction", era: "SA", level: 1, qty: 4 },
      { buildingId: "moderate_culture_site", type: "construction", era: "SA", level: 1, qty: 2 },
    ],
  },
  {
    id: "capital_barracks_SA",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks", type: "construction", era: "SA", level: 1, qty: 2 },
      { buildingId: "ranged_barracks",   type: "construction", era: "SA", level: 1, qty: 1 },
    ],
  },
];
