import { BuildingData } from "@/types/shared";

export const mayaChronicler: BuildingData = {
  id: "chronicler",
  name: "Chronicler",
  category: "maya",
  subcategory: "workshops",
  imageName: "Maya_Chronicler",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 2,
      construction: {
        cocoa: 60000,
        goods: [
          {
            amount: 750,
            resource: "goblet",
          },
          {
            amount: 750,
            resource: "mosaic",
          },
          {
            amount: 750,
            resource: "cape",
          },
        ],
      },
    },
  ],
};

export const mayaMaskSculptor: BuildingData = {
  id: "mask_sculptor",
  name: "Mask Sculptor",
  category: "maya",
  subcategory: "workshops",
  imageName: "Maya_Mask_Sculptor",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 2,
      construction: {
        cocoa: 50000,
        goods: [
          {
            amount: 750,
            resource: "goblet",
          },
          {
            amount: 750,
            resource: "mosaic",
          },
          {
            amount: 750,
            resource: "cape",
          },
        ],
      },
    },
  ],
};

export const mayaCeremonyOutfitter: BuildingData = {
  id: "ceremony_outfitter",
  name: "Ceremony Outfitter",
  category: "maya",
  subcategory: "workshops",
  imageName: "Maya_Ceremony_Outfitter",
  levels: [
    {
      level: 1,
      era: "AF",
      max_qty: 2,
      construction: {
        cocoa: 100000,
        goods: [
          {
            amount: 3900,
            resource: "tertiary_be",
          },
          {
            amount: 2250,
            resource: "ancestor_mask",
          },
          {
            amount: 2750,
            resource: "calendar_stone",
          },
        ],
      },
    },
  ],
};

export const mayaRitualCarver: BuildingData = {
  id: "ritual_carver",
  name: "Ritual Carver",
  category: "maya",
  subcategory: "workshops",
  imageName: "Maya_Ritual_Carver",
  levels: [
    {
      level: 1,
      era: "AF",
      max_qty: 3,
      construction: {
        cocoa: 150000,
        goods: [
          {
            amount: 3900,
            resource: "tertiary_be",
          },
          {
            amount: 2925,
            resource: "ancestor_mask",
          },
          {
            amount: 3575,
            resource: "calendar_stone",
          },
        ],
      },
    },
  ],
};

export const mayaLuxuriousWorkshop: BuildingData = {
  id: "luxurious_workshop",
  name: "Luxurious Workshop",
  category: "maya",
  subcategory: "workshops",
  imageName: "Maya_Luxurious_Workshop_Lv",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 2,
      construction: {
        gems: 890,
      },
    },
    {
      level: 2,
      era: "AF",
      max_qty: 2,
      upgrade: {
        gems: 620,
      },
    },
  ],
};
