import { BuildingData } from "@/types/shared";

export const egyptPapyrusField: BuildingData = {
  id: "egypt-papyrus-field",
  name: "Papyrus Field",
  category: "egypt",
  subcategory: "papyrus_field",
  imageName: "Egypt_Papyrus_Field_Lv",
  levels: [
    {
      level: 1,
      era: "ME",
      max_qty: 4,
      construction: {
        deben: 1000,
      },
    },
    {
      level: 2,
      era: "ME",
      max_qty: 4,
      upgrade: {
        deben: 7400,
        goods: [
          {
            amount: 45,
            resource: "primary_me",
          },
          {
            amount: 22,
            resource: "secondary_me",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 4,
      upgrade: {
        deben: 21000,
        goods: [
          {
            amount: 80,
            resource: "secondary_me",
          },
          {
            amount: 40,
            resource: "tertiary_me",
          },
          {
            amount: 60,
            resource: "papyrus_scroll",
          },
          {
            amount: 60,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 4,
      upgrade: {
        deben: 33000,
        goods: [
          {
            amount: 235,
            resource: "tertiary_me",
          },
          {
            amount: 120,
            resource: "papyrus_scroll",
          },
          {
            amount: 120,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 5,
      era: "CG",
      max_qty: 4,
      upgrade: {
        deben: 42000,
        goods: [
          {
            amount: 54,
            resource: "papyrus_scroll",
          },
          {
            amount: 54,
            resource: "ankh",
          },
          {
            amount: 225,
            resource: "primary_cg",
          },
          {
            amount: 125,
            resource: "ceremonial_dress",
          },
          {
            amount: 125,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 4,
      upgrade: {
        deben: 57000,
        goods: [
          {
            amount: 24,
            resource: "papyrus_scroll",
          },
          {
            amount: 24,
            resource: "ankh",
          },
          {
            amount: 325,
            resource: "secondary_cg",
          },
          {
            amount: 210,
            resource: "ceremonial_dress",
          },
          {
            amount: 210,
            resource: "golden_mask",
          },
        ],
      },
    },
  ],
};

export const egyptLuxuriousPapyrusField: BuildingData = {
  id: "egypt-luxurious-papyrus-field",
  name: "Luxurious Papyrus Field",
  category: "egypt",
  subcategory: "papyrus_field",
  imageName: "Egypt_Luxurious_Papyrus_Field_Lv",
  levels: [
    {
      level: 3,
      era: "ME",
      max_qty: 3,
      construction: {
        gems: 490,
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 3,
      upgrade: {
        gems: 290,
      },
    },
  ],
};
