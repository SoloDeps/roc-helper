import { BuildingData } from "@/types/shared";

export const ottomanEmpireShip: BuildingData = {
  id: "ottoman-ship",
  name: "Ottoman Empire Ship",
  category: "ottoman",
  subcategory: "ships",
  imageName: "Ottoman_Empire_Ship_Lv",
  levels: [
    // Le niveau 1 ne coûte RIEN : `Building_Harbor_Ship_OttomanEmpire_1` ne porte
    // ni `ConstructionComponentDTO` ni upgrade entrant. Le navire est débloqué,
    // pas acheté. Sans construction ni upgrade, `getLevelsForEraAndType` ne le
    // montre dans aucune des deux listes — il est là pour que la chaîne parte
    // bien de 1, comme dans le jeu.
    {
      level: 1,
      era: "EG",
      max_qty: 1,
    },
    {
      level: 2,
      era: "EG",
      max_qty: 1,
      upgrade: {
        aspers: 30000,
        goods: [
          {
            amount: 1500,
            resource: "primary_eg",
          },
          {
            amount: 1200,
            resource: "secondary_eg",
          },
          {
            amount: 750,
            resource: "tertiary_eg",
          },
          {
            amount: 10000,
            resource: "wheat",
          },
          {
            amount: 10000,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 3,
      era: "LG",
      max_qty: 1,
      upgrade: {
        aspers: 50000,
        goods: [
          {
            amount: 2000,
            resource: "primary_eg",
          },
          {
            amount: 1500,
            resource: "secondary_eg",
          },
          {
            amount: 1200,
            resource: "tertiary_eg",
          },
          {
            amount: 10000,
            resource: "apricot",
          },
          {
            amount: 10000,
            resource: "mohair",
          },
        ],
      },
    },
    {
      level: 4,
      era: "LG",
      max_qty: 1,
      upgrade: {
        aspers: 120000,
        goods: [
          {
            amount: 1600,
            resource: "primary_lg",
          },
          {
            amount: 1000,
            resource: "secondary_lg",
          },
          {
            amount: 1000,
            resource: "tertiary_lg",
          },
          {
            amount: 6000,
            resource: "brocade",
          },
          {
            amount: 6000,
            resource: "tea",
          },
        ],
      },
    },
  ],
};
