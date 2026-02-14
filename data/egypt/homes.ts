import { BuildingData } from "@/types/shared";

export const egyptSmallHome: BuildingData = {
  id: "egypt-homes-small-home",
  name: "Small Home",
  category: "egypt",
  subcategory: "homes",
  imageName: "Egypt_Small_Home_Lv",
  levels: [
    {
      level: 1,
      era: "ME",
      max_qty: 12,
      construction: {
        deben: 100,
      },
    },
    {
      level: 2,
      era: "ME",
      max_qty: 12,
      upgrade: {
        deben: 1900,
        goods: [
          {
            amount: 17,
            resource: "primary_me",
          },
          {
            amount: 8,
            resource: "secondary_me",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 12,
      upgrade: {
        deben: 5300,
        goods: [
          {
            amount: 30,
            resource: "secondary_me",
          },
          {
            amount: 15,
            resource: "tertiary_me",
          },
          {
            amount: 22,
            resource: "papyrus_scroll",
          },
          {
            amount: 22,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 12,
      upgrade: {
        deben: 8300,
        goods: [
          {
            amount: 88,
            resource: "tertiary_me",
          },
          {
            amount: 45,
            resource: "papyrus_scroll",
          },
          {
            amount: 45,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 5,
      era: "CG",
      max_qty: 12,
      upgrade: {
        deben: 11000,
        goods: [
          {
            amount: 20,
            resource: "papyrus_scroll",
          },
          {
            amount: 20,
            resource: "ankh",
          },
          {
            amount: 84,
            resource: "primary_cg",
          },
          {
            amount: 47,
            resource: "ceremonial_dress",
          },
          {
            amount: 47,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 12,
      upgrade: {
        deben: 14000,
        goods: [
          {
            amount: 9,
            resource: "papyrus_scroll",
          },
          {
            amount: 9,
            resource: "ankh",
          },
          {
            amount: 120,
            resource: "secondary_cg",
          },
          {
            amount: 79,
            resource: "ceremonial_dress",
          },
          {
            amount: 79,
            resource: "golden_mask",
          },
        ],
      },
    },
  ],
};

export const egyptAverageHome: BuildingData = {
  id: "egypt-homes-average-home",
  name: "Average Home",
  category: "egypt",
  subcategory: "homes",
  imageName: "Egypt_Average_Home_Lv",
  levels: [
    {
      level: 1,
      era: "ME",
      max_qty: 6,
      construction: {
        deben: 600,
      },
    },
    {
      level: 2,
      era: "ME",
      max_qty: 6,
      upgrade: {
        deben: 5600,
        goods: [
          {
            amount: 33,
            resource: "primary_me",
          },
          {
            amount: 17,
            resource: "secondary_me",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 6,
      upgrade: {
        deben: 16000,
        goods: [
          {
            amount: 61,
            resource: "secondary_me",
          },
          {
            amount: 30,
            resource: "tertiary_me",
          },
          {
            amount: 45,
            resource: "papyrus_scroll",
          },
          {
            amount: 45,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 6,
      upgrade: {
        deben: 25000,
        goods: [
          {
            amount: 180,
            resource: "tertiary_me",
          },
          {
            amount: 90,
            resource: "papyrus_scroll",
          },
          {
            amount: 90,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 5,
      era: "CG",
      max_qty: 6,
      upgrade: {
        deben: 32000,
        goods: [
          {
            amount: 40,
            resource: "papyrus_scroll",
          },
          {
            amount: 40,
            resource: "ankh",
          },
          {
            amount: 170,
            resource: "primary_cg",
          },
          {
            amount: 94,
            resource: "ceremonial_dress",
          },
          {
            amount: 94,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 6,
      upgrade: {
        deben: 43000,
        goods: [
          {
            amount: 18,
            resource: "papyrus_scroll",
          },
          {
            amount: 18,
            resource: "ankh",
          },
          {
            amount: 240,
            resource: "tertiary_cg",
          },
          {
            amount: 160,
            resource: "ceremonial_dress",
          },
          {
            amount: 160,
            resource: "golden_mask",
          },
        ],
      },
    },
  ],
};

export const egyptLuxuriousHome: BuildingData = {
  id: "egypt-homes-luxurious-home",
  name: "Luxurious Home",
  category: "egypt",
  subcategory: "homes",
  imageName: "Egypt_Luxurious_Home_Lv",
  levels: [
    {
      level: 3,
      era: "ME",
      max_qty: 8,
      construction: {
        gems: 750,
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 8,
      upgrade: {
        gems: 390,
      },
    },
  ],
};
