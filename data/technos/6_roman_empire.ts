import { TechnoData } from "@/types/shared";

export const technos_RE: TechnoData[] = [
  {
    id: "re_0",
    name: "Urbs Aeterna",
    column: 0,
    required: [],
    costs: {
      research_points: 28,
      coins: 456000,
      food: 355000,
      goods: [
        {
          amount: 2590,
          resource: "tertiary_me",
        },
        {
          amount: 3620,
          resource: "primary_er",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 16 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks a Luxurious Home upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Home_Lv",
          level: 18,
        },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 16 },
      },
      {
        title: "Luxurious Farm",
        desc: "Unlocks a Luxurious Farm upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Farm_Lv",
          level: 18,
        },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "re_1",
    name: "Fountains",
    column: 1,
    required: ["re_0"],
    costs: {
      research_points: 34,
      coins: 570000,
      food: 444000,
      goods: [
        {
          amount: 1940,
          resource: "primary_ba",
        },
        {
          amount: 3880,
          resource: "secondary_er",
        },
        {
          amount: 1615,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 6,
        },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Unlocks a Luxurious Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Culture_Site_Lv",
          level: 6,
        },
      },
    ],
  },
  {
    id: "re_2",
    name: "Princeps",
    column: 1,
    required: ["re_0"],
    costs: {
      research_points: 48,
      coins: 798000,
      food: 622000,
      goods: [
        {
          amount: 2265,
          resource: "secondary_me",
        },
        {
          amount: 7245,
          resource: "tertiary_cg",
        },
        {
          amount: 2265,
          resource: "secondary_er",
        },
      ],
    },
    rewards: [
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Infantry_Barracks_Lv",
          level: 6,
        },
      },
    ],
  },
  {
    id: "re_3",
    name: "Dedicated Workforce",
    column: 1,
    required: ["re_0"],
    costs: {
      research_points: 32,
      coins: 524000,
      food: 409000,
      goods: [
        {
          amount: 1785,
          resource: "secondary_ba",
        },
        {
          amount: 1490,
          resource: "primary_er",
        },
        {
          amount: 3570,
          resource: "tertiary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "China_Small_Home_Lv", level: 4 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "China_Average_Home_Lv", level: 4 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 3 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks a Luxurious Home upgrade",
        img: { kind: "wiki", imageName: "China_Luxurious_Home_Lv", level: 6 },
      },
    ],
  },
  {
    id: "re_4",
    name: "Swinery",
    column: 2,
    required: ["re_1"],
    costs: {
      research_points: 21,
      coins: 342000,
      food: 267000,
      goods: [
        {
          amount: 970,
          resource: "primary_me",
        },
        {
          amount: 2330,
          resource: "secondary_er",
        },
        {
          amount: 970,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 16 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 16 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_5",
    name: "Primary Good",
    column: 2,
    required: ["re_2"],
    costs: {
      research_points: 36,
      coins: 593000,
      food: 462000,
      goods: [
        {
          amount: 2020,
          resource: "tertiary_ba",
        },
        {
          amount: 5380,
          resource: "secondary_cg",
        },
        {
          amount: 1680,
          resource: "primary_er",
        },
      ],
    },
    rewards: [
      {
        title: "Primary Workshop",
        desc: "Unlocks a Primary Workshop upgrade",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Primary Goods",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "primary" },
      },
    ],
  },
  {
    id: "re_6",
    name: "Kaolin Processing",
    column: 2,
    required: ["re_3"],
    costs: {
      research_points: 40,
      coins: 661000,
      food: 515000,
      goods: [
        {
          amount: 3000,
          resource: "secondary_cg",
        },
        {
          amount: 5255,
          resource: "primary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Clay Processor",
        desc: "Unlocks the Clay Processor",
        img: { kind: "wiki", imageName: "China_Clay_Processor" },
      },
      {
        title: "Clay",
        desc: "Unlocks the good Clay for you, so that you can produce it in China",
        img: { kind: "local", path: "/images/goods-large/clay.webp" },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_7",
    name: "Iron Plough",
    column: 2,
    required: ["re_3"],
    costs: {
      research_points: 34,
      coins: 570000,
      food: 444000,
      goods: [
        {
          amount: 1940,
          resource: "secondary_ba",
        },
        {
          amount: 5175,
          resource: "primary_cg",
        },
        {
          amount: 1615,
          resource: "secondary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Rice Farm",
        desc: "Unlocks a Rice Farm upgrade",
        img: { kind: "wiki", imageName: "China_Rice_Farm_Lv", level: 4 },
      },
      {
        title: "Luxurious Rice Farm",
        desc: "Unlocks a Luxurious Rice Farm upgrade",
        img: {
          kind: "wiki",
          imageName: "China_Luxurious_Rice_Farm_Lv",
          level: 6,
        },
      },
      {
        title: "Rice Farm",
        desc: "Allows constructing 2 more Rice Farm buildings in China",
        img: { kind: "catalog", imgType: "riceFarm", invert: true },
      },
    ],
  },
  {
    id: "re_8",
    name: "Forums",
    column: 3,
    required: ["re_4"],
    costs: {
      research_points: 49,
      coins: 821000,
      food: 640000,
      goods: [
        {
          amount: 2330,
          resource: "tertiary_me",
        },
        {
          amount: 2330,
          resource: "secondary_er",
        },
        {
          amount: 5590,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 17 },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 6,
        },
      },
    ],
  },
  {
    id: "re_9",
    name: "Tenant Farming",
    column: 3,
    required: ["re_4"],
    costs: {
      research_points: 43,
      coins: 707000,
      food: 551000,
      goods: [
        {
          amount: 2405,
          resource: "primary_er",
        },
        {
          amount: 3745,
          resource: "primary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 17 },
      },
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 6,
        },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "re_10",
    name: "Sagittarii",
    column: 3,
    required: ["re_5"],
    costs: {
      research_points: 54,
      coins: 889000,
      food: 693000,
      goods: [
        {
          amount: 3025,
          resource: "tertiary_ba",
        },
        {
          amount: 1680,
          resource: "primary_re",
        },
        {
          amount: 4035,
          resource: "tertiary_re",
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
          level: 6,
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
    id: "re_11",
    name: "Porcelain Production",
    column: 3,
    required: ["re_6", "re_7"],
    costs: {
      research_points: 52,
      coins: 866000,
      food: 675000,
      goods: [
        {
          amount: 1475,
          resource: "primary_er",
        },
        {
          amount: 2460,
          resource: "secondary_er",
        },
        {
          amount: 3935,
          resource: "secondary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Porcelain Workshop",
        desc: "Unlocks the Porcelain Workshop",
        img: { kind: "wiki", imageName: "China_Porcelain_Workshop" },
      },
      {
        title: "Porcelain",
        desc: "Unlocks the good Porcelain for you, so that you can produce it in China",
        img: { kind: "local", path: "/images/goods-large/porcelain.webp" },
      },
      {
        title: "Clay Processor",
        desc: "Allows constructing 1 more Clay Processor building in China",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "re_12",
    name: "Ballistas",
    column: 4,
    required: ["re_8", "re_9", "re_10"],
    costs: {
      research_points: 51,
      coins: 844000,
      food: 657000,
      goods: [
        {
          amount: 955,
          resource: "primary_re",
        },
        {
          amount: 1595,
          resource: "secondary_re",
        },
        {
          amount: 3830,
          resource: "tertiary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Siege Barracks",
        desc: "Unlocks the Siege Barracks",
        img: { kind: "wiki", imageName: "Capital_Siege_Barracks_Lv", level: 6 },
      },
    ],
  },
  {
    id: "re_13",
    name: "Deep Foundations",
    column: 4,
    required: ["re_11"],
    costs: {
      research_points: 55,
      coins: 912000,
      food: 711000,
      goods: [
        {
          amount: 3105,
          resource: "primary_ba",
        },
        {
          amount: 4140,
          resource: "primary_re",
        },
        {
          amount: 1725,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "China_Small_Home_Lv", level: 5 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "China_Average_Home_Lv", level: 5 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_14",
    name: "Labor Duties",
    column: 4,
    required: ["re_11"],
    costs: {
      research_points: 44,
      coins: 730000,
      food: 569000,
      goods: [
        {
          amount: 1240,
          resource: "secondary_er",
        },
        {
          amount: 2070,
          resource: "tertiary_er",
        },
        {
          amount: 3310,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Small Home",
        desc: "Allows constructing 3 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_15",
    name: "Villa Rustica",
    column: 5,
    required: ["re_12", "re_13"],
    costs: {
      research_points: 26,
      coins: 433000,
      food: 338000,
      goods: [
        {
          amount: 500,
          resource: "porcelain",
        },
        {
          amount: 985,
          resource: "primary_re",
        },
        {
          amount: 2295,
          resource: "secondary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 17 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 17 },
      },
    ],
  },
  {
    id: "re_16",
    name: "Terracing",
    column: 5,
    required: ["re_13"],
    costs: {
      research_points: 49,
      coins: 821000,
      food: 640000,
      goods: [
        {
          amount: 2330,
          resource: "primary_me",
        },
        {
          amount: 3725,
          resource: "primary_re",
        },
        {
          amount: 1550,
          resource: "secondary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Rice Farm",
        desc: "Unlocks a Rice Farm upgrade",
        img: { kind: "wiki", imageName: "China_Rice_Farm_Lv", level: 5 },
      },
      {
        title: "Rice Farm",
        desc: "Allows constructing 2 more Rice Farm buildings in China",
        img: { kind: "catalog", imgType: "riceFarm", invert: true },
      },
    ],
  },
  {
    id: "re_17",
    name: "Floor Plans",
    column: 5,
    required: ["re_14"],
    costs: {
      research_points: 55,
      coins: 912000,
      food: 711000,
      goods: [
        {
          amount: 4140,
          resource: "primary_cg",
        },
        {
          amount: 1000,
          resource: "porcelain",
        },
        {
          amount: 4830,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_18",
    name: "Public Gardens",
    column: 6,
    required: ["re_15"],
    costs: {
      research_points: 52,
      coins: 866000,
      food: 675000,
      goods: [
        {
          amount: 1475,
          resource: "tertiary_er",
        },
        {
          amount: 3935,
          resource: "secondary_re",
        },
        {
          amount: 1640,
          resource: "tertiary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 18 },
      },
      {
        title: "Little Culture Site",
        desc: "Allows constructing 1 more Little Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "re_19",
    name: "Villa Urbana",
    column: 6,
    required: ["re_15"],
    costs: {
      research_points: 30,
      coins: 502000,
      food: 391000,
      goods: [
        {
          amount: 1710,
          resource: "tertiary_er",
        },
        {
          amount: 2655,
          resource: "primary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 18 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Moderate Culture Site",
        desc: "Allows constructing 1 more Moderate Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "re_20",
    name: "Turmae",
    column: 6,
    required: ["re_15"],
    costs: {
      research_points: 60,
      coins: 1000000,
      food: 782000,
      goods: [
        {
          amount: 2845,
          resource: "secondary_me",
        },
        {
          amount: 1900,
          resource: "primary_re",
        },
        {
          amount: 4555,
          resource: "secondary_re",
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
          level: 6,
        },
      },
    ],
  },
  {
    id: "re_21",
    name: "Advanced Clayworks",
    column: 6,
    required: ["re_16", "re_17"],
    costs: {
      research_points: 30,
      coins: 502000,
      food: 391000,
      goods: [
        {
          amount: 855,
          resource: "primary_er",
        },
        {
          amount: 1425,
          resource: "secondary_er",
        },
        {
          amount: 2275,
          resource: "secondary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Clay Processor",
        desc: "Allows constructing 1 more Clay Processor building in China",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Porcelain Workshop",
        desc: "Allows constructing 1 more Porcelain Workshop building in China",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "re_22",
    name: "Underfloor Heating",
    column: 7,
    required: ["re_18", "re_19"],
    costs: {
      research_points: 62,
      coins: 1000000,
      food: 800000,
      goods: [
        {
          amount: 2330,
          resource: "tertiary_cg",
        },
        {
          amount: 4660,
          resource: "primary_re",
        },
        {
          amount: 1940,
          resource: "secondary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 18 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 18 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "re_23",
    name: "Circus Maximus",
    column: 7,
    required: ["re_20"],
    costs: {
      research_points: 29,
      coins: 479000,
      food: 373000,
      goods: [
        {
          amount: 3000,
          resource: "porcelain",
        },
        {
          amount: 1085,
          resource: "primary_re",
        },
        {
          amount: 2535,
          resource: "secondary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Large Culture Site",
        desc: "Unlocks a Large Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Large_Culture_Site_Lv",
          level: 6,
        },
      },
    ],
  },
  {
    id: "re_24",
    name: "Urban Management",
    column: 7,
    required: ["re_21"],
    costs: {
      research_points: 63,
      coins: 1000000,
      food: 817000,
      goods: [
        {
          amount: 3570,
          resource: "secondary_er",
        },
        {
          amount: 5555,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "China_Small_Home_Lv", level: 6 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "China_Average_Home_Lv", level: 6 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_25",
    name: "Dryland Farming",
    column: 7,
    required: ["re_21"],
    costs: {
      research_points: 70,
      coins: 1100000,
      food: 906000,
      goods: [
        {
          amount: 3300,
          resource: "primary_er",
        },
        {
          amount: 5280,
          resource: "primary_re",
        },
        {
          amount: 1320,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Rice Farm",
        desc: "Unlocks a Rice Farm upgrade",
        img: { kind: "wiki", imageName: "China_Rice_Farm_Lv", level: 6 },
      },
      {
        title: "Rice Farm",
        desc: "Allows constructing 2 more Rice Farm buildings in China",
        img: { kind: "catalog", imgType: "riceFarm", invert: true },
      },
    ],
  },
  {
    id: "re_26",
    name: "Secondary Good",
    column: 8,
    required: ["re_22"],
    costs: {
      research_points: 36,
      coins: 593000,
      food: 462000,
      goods: [
        {
          amount: 675,
          resource: "primary_re",
        },
        {
          amount: 1120,
          resource: "secondary_re",
        },
        {
          amount: 2690,
          resource: "tertiary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Secondary Workshop",
        desc: "Unlocks a Secondary Workshop upgrade",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Secondary Goods",
        desc: "Unlocks the good Secondary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "secondary" },
      },
    ],
  },
  {
    id: "re_27",
    name: "Legionary",
    column: 8,
    required: ["re_23"],
    costs: {
      research_points: 47,
      coins: 775000,
      food: 604000,
      goods: [
        {
          amount: 2640,
          resource: "tertiary_er",
        },
        {
          amount: 6000,
          resource: "porcelain",
        },
        {
          amount: 4105,
          resource: "secondary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Heavy Infantry Barracks",
        desc: "Unlocks a Heavy Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Heavy_Infantry_Barracks_Lv",
          level: 6,
        },
      },
    ],
  },
  {
    id: "re_28",
    name: "Porcelain Mastery",
    column: 8,
    required: ["re_24", "re_25"],
    costs: {
      research_points: 29,
      coins: 479000,
      food: 373000,
      goods: [
        {
          amount: 1085,
          resource: "tertiary_cg",
        },
        {
          amount: 2175,
          resource: "primary_re",
        },
        {
          amount: 905,
          resource: "secondary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "Clay Processor",
        desc: "Allows constructing 1 more Clay Processor building in China",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "re_29",
    name: "Tertiary Good",
    column: 9,
    required: ["re_26", "re_27", "re_28"],
    costs: {
      research_points: 78,
      coins: 1300000,
      food: 1000000,
      goods: [
        {
          amount: 9000,
          resource: "porcelain",
        },
        {
          amount: 2950,
          resource: "primary_re",
        },
        {
          amount: 6885,
          resource: "tertiary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Tertiary Workshop",
        desc: "Unlocks a Tertiary Workshop upgrade",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Tertiary Goods",
        desc: "Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "tertiary" },
      },
    ],
  },
  {
    id: "re_30",
    name: "Chinese Consensus",
    column: 30,
    required: ["re_29"],
    costs: {
      research_points: 37,
      coins: 616000,
      food: 480000,
      goods: [
        {
          amount: 1395,
          resource: "secondary_cg",
        },
        {
          amount: 2795,
          resource: "secondary_re",
        },
        {
          amount: 1165,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "china",
    rewards: [
      {
        title: "20 Gems",
        desc: "Gives you 20 Gems",
        img: { kind: "local", path: "/images/goods-large/gem.webp" },
      },
    ],
  },
];
