import type { PresetSection } from "./index";

export const sections_ME: PresetSection[] = [
  {
    id: "capital_homes_ME",
    label: "Homes",
    category: "capital",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "ME", level: 7,  qty: 2  },
      { buildingId: "small_home",   type: "upgrade",      era: "ME", level: 7,  qty: 12 },
      { buildingId: "small_home",   type: "upgrade",      era: "ME", level: 8,  qty: 14 },
      { buildingId: "small_home",   type: "upgrade",      era: "ME", level: 9,  qty: 14 },
      { buildingId: "average_home", type: "construction", era: "ME", level: 7,  qty: 2  },
      { buildingId: "average_home", type: "upgrade",      era: "ME", level: 7,  qty: 2  },
      { buildingId: "average_home", type: "upgrade",      era: "ME", level: 8,  qty: 4  },
      { buildingId: "average_home", type: "upgrade",      era: "ME", level: 9,  qty: 4  },
    ],
  },
  {
    id: "capital_farms_ME",
    label: "Farms",
    category: "capital",
    entries: [
      { buildingId: "rural_farm",    type: "construction", era: "ME", level: 7, qty: 1 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "ME", level: 7, qty: 4 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "ME", level: 8, qty: 5 },
      { buildingId: "rural_farm",    type: "upgrade",      era: "ME", level: 9, qty: 5 },
      { buildingId: "domestic_farm", type: "construction", era: "ME", level: 7, qty: 1 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "ME", level: 7, qty: 3 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "ME", level: 8, qty: 4 },
      { buildingId: "domestic_farm", type: "upgrade",      era: "ME", level: 9, qty: 4 },
    ],
  },
  {
    id: "capital_culture_sites_ME",
    label: "Cultural Sites",
    category: "capital",
    entries: [
      { buildingId: "little_culture_site",   type: "construction", era: "ME", level: 3, qty: 1 },
      { buildingId: "little_culture_site",   type: "upgrade",      era: "ME", level: 3, qty: 3 },
      { buildingId: "compact_culture_site",  type: "construction", era: "ME", level: 3, qty: 1 },
      { buildingId: "compact_culture_site",  type: "upgrade",      era: "ME", level: 3, qty: 5 },
      { buildingId: "moderate_culture_site", type: "construction", era: "ME", level: 3, qty: 1 },
      { buildingId: "moderate_culture_site", type: "upgrade",      era: "ME", level: 3, qty: 2 },
    ],
  },
  {
    id: "capital_barracks_ME",
    label: "Barracks",
    category: "capital",
    entries: [
      { buildingId: "infantry_barracks", type: "upgrade",      era: "ME", level: 3, qty: 2 },
      { buildingId: "ranged_barracks",   type: "construction", era: "ME", level: 3, qty: 1 },
      { buildingId: "cavalry_barracks",  type: "construction", era: "ME", level: 3, qty: 1 },
    ],
  },
  {
    id: "capital_workshops_ME",
    label: "Workshops",
    category: "capital",
    entries: [
      { buildingId: "primary_workshop",   type: "construction", era: "ME", level: 2, qty: 1 },
      { buildingId: "primary_workshop",   type: "upgrade",      era: "ME", level: 2, qty: 1 },
      { buildingId: "secondary_workshop", type: "upgrade",      era: "ME", level: 2, qty: 1 },
      { buildingId: "tertiary_workshop",  type: "upgrade",      era: "ME", level: 2, qty: 1 },
    ],
  },
  {
    id: "egypt_homes_ME",
    label: "Homes",
    category: "egypt",
    entries: [
      { buildingId: "small_home",   type: "construction", era: "ME", level: 1, qty: 8 },
      { buildingId: "small_home",   type: "upgrade",      era: "ME", level: 2, qty: 8 },
      { buildingId: "small_home",   type: "upgrade",      era: "ME", level: 3, qty: 8 },
      { buildingId: "average_home", type: "construction", era: "ME", level: 1, qty: 4 },
      { buildingId: "average_home", type: "upgrade",      era: "ME", level: 2, qty: 4 },
      { buildingId: "average_home", type: "upgrade",      era: "ME", level: 3, qty: 4 },
    ],
  },
  {
    id: "egypt_gold_mine_ME",
    label: "Gold Mines",
    category: "egypt",
    entries: [
      { buildingId: "gold_mine",     type: "construction", era: "ME", level: 1, qty: 2 },
      { buildingId: "gold_mine",     type: "upgrade",      era: "ME", level: 2, qty: 2 },
      { buildingId: "gold_mine",     type: "upgrade",      era: "ME", level: 3, qty: 2 },
    ],
  },
  {
    id: "egypt_papyrus_field_ME",
    label: "Papyrus Fields",
    category: "egypt",
    entries: [
      { buildingId: "papyrus_field", type: "construction", era: "ME", level: 1, qty: 2 },
      { buildingId: "papyrus_field", type: "upgrade",      era: "ME", level: 2, qty: 2 },
      { buildingId: "papyrus_field", type: "upgrade",      era: "ME", level: 3, qty: 2 },
    ],
  },
  {
    id: "egypt_workshops_ME",
    label: "Workshops",
    category: "egypt",
    entries: [
      { buildingId: "goldsmith",     type: "construction", era: "ME", level: 1, qty: 2 },
      { buildingId: "papyrus_press", type: "construction", era: "ME", level: 1, qty: 2 },
    ],
  },
];
