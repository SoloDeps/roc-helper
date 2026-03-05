import { TechnoData } from "@/types/shared";

export const technos_ME: TechnoData[] = [
  {
    id: "me_0",
    name: "Township",
    column: 0,
    required: [],
    costs: {
      research_points: 6,
      coins: 69100,
      food: 51000,
      goods: [
        {
          amount: 210,
          resource: "primary_ba",
        },
        {
          amount: 90,
          resource: "secondary_ba",
        },
        {
          amount: 55,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 7 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks a Luxurious Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Luxurious_Home_Lv", level: 9 },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "me_1",
    name: "Primary Good",
    column: 1,
    required: ["me_0"],
    costs: {
      research_points: 7,
      coins: 84000,
      food: 62100,
      goods: [
        {
          amount: 300,
          resource: "secondary_ba",
        },
        {
          amount: 130,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      {
        title: "Primary Good",
        desc: "Unlocks a Primary Good upgrade",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "Primary Workshop",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "+1 Primary Workshop",
        desc: "Allows constructing 1 more Primary Good building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "me_2",
    name: "Trading",
    column: 2,
    required: ["me_1"],
    costs: {
      research_points: 6,
      coins: 63400,
      food: 46800,
      goods: [
        {
          amount: 225,
          resource: "primary_ba",
        },
        {
          amount: 95,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      {
        title: "Trading Unlocked",
        desc: "New Feature",
        img: { kind: "techno", techId: "me_2" },
      },
      {
        title: "Dock Workers",
        desc: "Increases dock worker amount",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_workers_trading.webp",
        },
      },
    ],
  },
  {
    id: "me_3",
    name: "Arenas",
    column: 2,
    required: ["me_1"],
    costs: {
      research_points: 9,
      coins: 101000,
      food: 74800,
      goods: [
        {
          amount: 70,
          resource: "secondary_ba",
        },
        {
          amount: 105,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Player Encounters Unlocked",
        desc: "New Feature",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_playerencounters.webp",
        },
      },
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Infantry_Barracks_Lv",
          level: 3,
        },
      },
    ],
  },
  {
    id: "me_4",
    name: "Oat Production",
    column: 3,
    required: ["me_2"],
    costs: {
      research_points: 6,
      coins: 66900,
      food: 49400,
      goods: [
        {
          amount: 205,
          resource: "primary_ba",
        },
        {
          amount: 50,
          resource: "tertiary_ba",
        },
        {
          amount: 55,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 7 },
      },
      {
        title: "Luxurious Farm",
        desc: "Unlocks a Luxurious Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Luxurious_Farm_Lv", level: 9 },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Unlocks a Luxurious Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Culture_Site_Lv",
          level: 3,
        },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_5",
    name: "Shepherding",
    column: 3,
    required: ["me_2"],
    costs: {
      research_points: 7,
      coins: 84500,
      food: 62400,
      goods: [
        {
          amount: 300,
          resource: "primary_ba",
        },
        {
          amount: 85,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 7 },
      },
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 3,
        },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_6",
    name: "Masonry",
    column: 3,
    required: ["me_3"],
    costs: {
      research_points: 10,
      coins: 110000,
      food: 81300,
      goods: [
        {
          amount: 200,
          resource: "secondary_ba",
        },
        {
          amount: 315,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 7 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 3,
        },
      },
    ],
  },
  {
    id: "me_7",
    name: "Basket Weaving",
    column: 4,
    required: ["me_4"],
    costs: {
      research_points: 10,
      coins: 110000,
      food: 81600,
      goods: [
        {
          amount: 225,
          resource: "primary_me",
        },
        {
          amount: 95,
          resource: "secondary_me",
        },
        {
          amount: 55,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 8 },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 3,
        },
      },
      {
        title: "Compact Culture Site",
        desc: "Allows constructing 1 more Compact Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "me_8",
    name: "Composite Bow",
    column: 4,
    required: ["me_5", "me_6"],
    costs: {
      research_points: 9,
      coins: 102000,
      food: 75400,
      goods: [
        {
          amount: 130,
          resource: "secondary_ba",
        },
        {
          amount: 80,
          resource: "tertiary_ba",
        },
        {
          amount: 210,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Ranged Barracks",
        desc: "Unlocks a Ranged Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Ranged_Barracks_Lv",
          level: 3,
        },
      },
    ],
  },
  {
    id: "me_9",
    name: "Rise of Egypt",
    column: 5,
    required: ["me_7", "me_8"],
    costs: {
      research_points: 15,
    },
    allied: "egypt",
    rewards: [
      {
        title: "Unlock City",
        desc: "Unlocks Allied Culture Egypt",
        img: { kind: "catalog", imgType: "egypt" },
      },
      {
        title: "Small Home",
        desc: "Unlocks the Small Home",
        img: { kind: "wiki", imageName: "Egypt_Small_Home_Lv", level: 1 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks the Luxurious Home",
        img: { kind: "wiki", imageName: "Egypt_Luxurious_Home_Lv", level: 3 },
      },
    ],
  },
  {
    id: "me_10",
    name: "Egyptian Diplomacy",
    column: 6,
    required: ["me_9"],
    costs: {
      research_points: 5,
      goods: [
        {
          amount: 250,
          resource: "deben",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Gold Mine",
        desc: "Unlocks the Gold Mine",
        img: { kind: "wiki", imageName: "Egypt_Gold_Mine_Lv", level: 1 },
      },
      {
        title: "Papyrus Field",
        desc: "Unlocks the Papyrus Field",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Field_Lv", level: 1 },
      },
      {
        title: "Luxurious Gold Mine",
        desc: "Unlocks the Luxurious Gold Mine",
        img: { kind: "wiki", imageName: "Egypt_Luxurious_Gold_Mine_Lv", level: 3 },
      },
      {
        title: "Luxurious Papyrus Field",
        desc: "Unlocks the Luxurious Papyrus Field",
        img: { kind: "wiki", imageName: "Egypt_Luxurious_Papyrus_Field_Lv", level: 3 },
      },
    ],
  },
  {
    id: "me_11",
    name: "Ankh",
    column: 7,
    required: ["me_10"],
    costs: {
      research_points: 6,
      coins: 66000,
      food: 48800,
      goods: [
        {
          amount: 210,
          resource: "primary_me",
        },
        {
          amount: 90,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Ankh",
        desc: "Unlocks the good Ankh for you, so that you can produce it in your city",
        img: { kind: "techno", techId: "me_11" },
      },
      {
        title: "Goldsmith",
        desc: "Unlocks the Goldsmith",
        img: { kind: "wiki", imageName: "Egypt_Goldsmith_Lv", level: 1 },
      },
    ],
  },
  {
    id: "me_12",
    name: "Papyrus Scroll",
    column: 7,
    required: ["me_10"],
    costs: {
      research_points: 5,
      coins: 110000,
      food: 81300,
      goods: [
        {
          amount: 265,
          resource: "secondary_me",
        },
        {
          amount: 115,
          resource: "tertiary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Papyrus Scroll",
        desc: "Unlocks the good Papyrus Scroll for you, so that you can produce it in your city",
        img: { kind: "techno", techId: "me_12" },
      },
      {
        title: "Papyrus Press",
        desc: "Unlocks the Papyrus Press",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Press_Lv", level: 1 },
      },
    ],
  },
  {
    id: "me_13",
    name: "Screws",
    column: 8,
    required: ["me_11", "me_12"],
    costs: {
      research_points: 4,
      coins: 88000,
      food: 81300,
      goods: [
        {
          amount: 290,
          resource: "primary_me",
        },
        {
          amount: 125,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 8 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Allows constructing 1 more Moderate Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "me_14",
    name: "Hieroglyphs",
    column: 8,
    required: ["me_11", "me_12"],
    costs: {
      research_points: 8,
      coins: 110000,
      food: 65000,
      goods: [
        {
          amount: 210,
          resource: "secondary_ba",
        },
        {
          amount: 325,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks the Average Home",
        img: { kind: "wiki", imageName: "Egypt_Average_Home_Lv", level: 1 },
      },
      {
        title: "Small Well",
        desc: "Unlocks the Small Well",
        img: { kind: "wiki", imageName: "Egypt_Small_Well" },
      },
      {
        title: "Oasis",
        desc: "Unlocks the Oasis",
        img: { kind: "wiki", imageName: "Egypt_Oasis"},
      },
    ],
  },
  {
    id: "me_15",
    name: "Animal Husbandry",
    column: 9,
    required: ["me_13"],
    costs: {
      research_points: 14,
      coins: 134000,
      food: 98800,
      goods: [
        {
          amount: 160,
          resource: "secondary_me",
        },
        {
          amount: 370,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 8 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "me_16",
    name: "Millstone",
    column: 9,
    required: ["me_13"],
    costs: {
      research_points: 15,
      coins: 147000,
      food: 108000,
      goods: [
        {
          amount: 110,
          resource: "primary_ba",
        },
        {
          amount: 185,
          resource: "tertiary_ba",
        },
        {
          amount: 300,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 8 },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "me_17",
    name: "Joists",
    column: 9,
    required: ["me_14"],
    costs: {
      research_points: 17,
      coins: 176000,
      food: 130000,
      goods: [
        {
          amount: 420,
          resource: "primary_me",
        },
        {
          amount: 180,
          resource: "tertiary_me",
        },
        {
          amount: 50,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Small_Home_Lv", level: 2 },
      },
      {
        title: "Gold Mine",
        desc: "Unlocks a Gold Mine upgrade",
        img: { kind: "wiki", imageName: "Egypt_Gold_Mine_Lv", level: 2 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_18",
    name: "Geometry",
    column: 9,
    required: ["me_14"],
    costs: {
      research_points: 11,
      coins: 110000,
      food: 81300,
      goods: [
        {
          amount: 265,
          resource: "primary_me",
        },
        {
          amount: 115,
          resource: "tertiary_me",
        },
        {
          amount: 100,
          resource: "ankh",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Average_Home_Lv", level: 2 },
      },
      {
        title: "Papyrus Field",
        desc: "Unlocks a Papyrus Field upgrade",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Field_Lv", level: 2 },
      },
    ],
  },
  {
    id: "me_19",
    name: "Stables",
    column: 10,
    required: ["me_15"],
    costs: {
      research_points: 12,
      coins: 132000,
      food: 97500,
      goods: [
        {
          amount: 315,
          resource: "primary_me",
        },
        {
          amount: 135,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Cavalry Barracks",
        desc: "Unlocks a Cavalry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Cavalry_Barracks_Lv",
          level: 3,
        },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_20",
    name: "Preservation",
    column: 10,
    required: ["me_15", "me_16", "me_17"],
    costs: {
      research_points: 20,
      coins: 207000,
      food: 153000,
      goods: [
        {
          amount: 210,
          resource: "secondary_me",
        },
        {
          amount: 495,
          resource: "tertiary_me",
        },
        {
          amount: 250,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Small Well",
        desc: "Allows constructing 2 more Small Well buildings in Egypt",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "me_21",
    name: "Fine Papyrus",
    column: 10,
    required: ["me_17"],
    costs: {
      research_points: 16,
      coins: 176000,
      food: 130000,
      goods: [
        {
          amount: 225,
          resource: "secondary_ba",
        },
        {
          amount: 135,
          resource: "tertiary_ba",
        },
        {
          amount: 360,
          resource: "tertiary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Papyrus Field",
        desc: "Allows constructing 1 more Papyrus Field building in Egypt",
        img: { kind: "catalog", imgType: "papyrusField", invert: true },
      },
      {
        title: "Papyrus Press",
        desc: "Allows constructing 1 more Papyrus Press building in Egypt",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_22",
    name: "Water Wheel",
    column: 10,
    required: ["me_18"],
    costs: {
      research_points: 14,
      coins: 186000,
      food: 137000,
      goods: [
        {
          amount: 190,
          resource: "primary_me",
        },
        {
          amount: 445,
          resource: "secondary_me",
        },
        {
          amount: 500,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Irrigation Station",
        desc: "Unlocks the Irrigation Station",
        img: {
          kind: "wiki",
          imageName: "Egypt_Irrigation_Station",
        },
      },
    ],
  },
  {
    id: "me_23",
    name: "Columns",
    column: 11,
    required: ["me_19"],
    costs: {
      research_points: 15,
      coins: 167000,
      food: 124000,
      goods: [
        {
          amount: 255,
          resource: "tertiary_ba",
        },
        {
          amount: 400,
          resource: "tertiary_me",
        },
        {
          amount: 500,
          resource: "ankh",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 9 },
      },
      {
        title: "Little Culture Site",
        desc: "Allows constructing 1 more Little Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "me_24",
    name: "Winch",
    column: 11,
    required: ["me_20", "me_21"],
    costs: {
      research_points: 16,
      coins: 185000,
      food: 137000,
      goods: [
        {
          amount: 150,
          resource: "primary_ba",
        },
        {
          amount: 170,
          resource: "primary_me",
        },
        {
          amount: 405,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 9 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 9 },
      },
    ],
  },
  {
    id: "me_25",
    name: "Extraction Methods",
    column: 11,
    required: ["me_22"],
    costs: {
      research_points: 27,
      coins: 308000,
      food: 228000,
      goods: [
        {
          amount: 660,
          resource: "primary_me",
        },
        {
          amount: 285,
          resource: "secondary_me",
        },
        {
          amount: 1000,
          resource: "ankh",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Gold Mine",
        desc: "Allows constructing 1 more Gold Mine building in Egypt",
        img: { kind: "catalog", imgType: "goldMine", invert: true },
      },
      {
        title: "Goldsmith",
        desc: "Allows constructing 1 more Goldsmith building in Egypt",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 2 more Average Home buildings in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_26",
    name: "Secondary Good",
    column: 12,
    required: ["me_23"],
    costs: {
      research_points: 23,
      coins: 264000,
      food: 195000,
      goods: [
        {
          amount: 200,
          resource: "secondary_ba",
        },
        {
          amount: 340,
          resource: "tertiary_ba",
        },
        {
          amount: 540,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Secondary Good",
        desc: "Unlocks a Secondary Good upgrade",
        img: { kind: "good", priority: "secondary" },
      },
      {
        title: "Secondary Workshop",
        desc: "Unlocks the good Secondary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "me_27",
    name: "Administration",
    column: 12,
    required: ["me_23", "me_24"],
    costs: {
      research_points: 25,
      coins: 282000,
      food: 208000,
      goods: [
        {
          amount: 430,
          resource: "tertiary_ba",
        },
        {
          amount: 670,
          resource: "tertiary_me",
        },
        {
          amount: 700,
          resource: "papyrus_scroll",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 9 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "me_28",
    name: "Burial Rites",
    column: 12,
    required: ["me_24", "me_25"],
    costs: {
      research_points: 16,
      coins: 264000,
      food: 195000,
      goods: [
        {
          amount: 405,
          resource: "secondary_ba",
        },
        {
          amount: 630,
          resource: "secondary_me",
        },
        {
          amount: 1500,
          resource: "ankh",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Average_Home_Lv", level: 3 },
      },
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Small_Home_Lv", level: 3 },
      },
      {
        title: "Irrigation Station",
        desc: "Allows constructing 2 more Irrigation Station buildings in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "me_29",
    name: "Geography",
    column: 12,
    required: ["me_24", "me_25"],
    costs: {
      research_points: 21,
      coins: 220000,
      food: 163000,
      goods: [
        {
          amount: 600,
          resource: "primary_me",
        },
        {
          amount: 255,
          resource: "secondary_me",
        },
        {
          amount: 1250,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Gold Mine",
        desc: "Unlocks a Gold Mine upgrade",
        img: { kind: "wiki", imageName: "Egypt_Gold_Mine_Lv", level: 3 },
      },
      {
        title: "Papyrus Field",
        desc: "Unlocks a Papyrus Field upgrade",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Field_Lv", level: 3 },
      },
    ],
  },
  {
    id: "me_30",
    name: "Tertiary Good",
    column: 13,
    required: ["me_26", "me_27", "me_28", "me_29"],
    costs: {
      research_points: 18,
      coins: 277000,
      food: 205000,
      goods: [
        {
          amount: 475,
          resource: "secondary_me",
        },
        {
          amount: 205,
          resource: "tertiary_me",
        },
        {
          amount: 1750,
          resource: "papyrus_scroll",
        },
      ],
    },
    rewards: [
      {
        title: "Tertiary Good",
        desc: "Unlocks a Tertiary Good upgrade",
        img: { kind: "good", priority: "tertiary" },
      },
      {
        title: "Tertiary Workshop",
        desc: "Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
];
