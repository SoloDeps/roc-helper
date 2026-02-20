// Goldsmith
import { BuildingData } from "@/types/shared";

export const egyptGoldsmith: BuildingData = {
  id: "egypt-goldsmith",
  name: "Goldsmith",
  category: "egypt",
  subcategory: "goldsmith",
  imageName: "Egypt_Goldsmith_Lv",
  levels: [
    {
      level: 1,
      era: "ME",
      max_qty: 3,
      construction: {
        deben: 2500,
      },
    },
    {
      level: 2,
      era: "CG",
      max_qty: 3,
      upgrade: {
        deben: 78.5,
        goods: [
          {
            amount: 320,
            resource: "secondary_me",
          },
          {
            amount: 320,
            resource: "tertiary_me",
          },
          {
            amount: 250,
            resource: "papyrus_scroll",
          },
          {
            amount: 250,
            resource: "ankh",
          },
        ],
      },
    },
  ],
};

// Papyrus Press
export const egyptPapyrusPress: BuildingData = {
  id: "egypt-papyrus-press",
  name: "Papyrus Press",
  category: "egypt",
  subcategory: "papyrus_press",
  imageName: "Egypt_Papyrus_Press_Lv",
  levels: [
    {
      level: 1,
      era: "ME",
      max_qty: 3,
      construction: {
        deben: 2000,
      },
    },
    {
      level: 2,
      era: "CG",
      max_qty: 3,
      upgrade: {
        deben: 64800,
        goods: [
          {
            amount: 320,
            resource: "secondary_me",
          },
          {
            amount: 320,
            resource: "tertiary_me",
          },
          {
            amount: 250,
            resource: "papyrus_scroll",
          },
          {
            amount: 250,
            resource: "ankh",
          },
        ],
      },
    },
  ],
};
