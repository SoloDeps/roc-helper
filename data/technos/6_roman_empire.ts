import { TechnoData } from "@/types/shared";

export const technos_RE: TechnoData[] = [
  {
    id: "tech_re_0",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Luxurious Home: Unlocks a Luxurious Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Luxurious Farm: Unlocks a Luxurious Farm upgrade",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "tech_re_1",
    name: "Fountains",
    column: 1,
    required: ["tech_re_"],
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
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
      "Luxurious Culture Site: Unlocks a Luxurious Culture Site upgrade",
    ],
  },
  {
    id: "tech_re_2",
    name: "Princeps",
    column: 2,
    required: ["tech_re_"],
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
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
  },
  {
    id: "tech_re_3",
    name: "Dedicated Workforce",
    column: 3,
    required: ["tech_re_"],
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Allows constructing 3 more Small Home buildings in your city",
      "Luxurious Home: Unlocks a Luxurious Home upgrade",
    ],
  },
  {
    id: "tech_re_4",
    name: "Swinery",
    column: 4,
    required: ["tech_re_"],
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
      "Average Home: Unlocks a Average Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_re_5",
    name: "Primary Workshop",
    column: 5,
    required: ["tech_re_"],
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
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_re_6",
    name: "Kaolin Processing",
    column: 6,
    required: ["tech_re_"],
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
      "Clay Processor: Unlocks the Clay Processor",
      "Clay: Unlocks the good Clay for you, so that you can produce it in your city",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_re_7",
    name: "Iron Plough",
    column: 7,
    required: ["tech_re_"],
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
      "Rice Farm: Unlocks a Rice Farm upgrade",
      "Luxurious Rice Farm: Unlocks a Luxurious Rice Farm upgrade",
      "Rice Farm: Allows constructing 2 more Rice Farm buildings in your city",
    ],
  },
  {
    id: "tech_re_8",
    name: "Forums",
    column: 8,
    required: ["tech_re_"],
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
      "Small Home: Unlocks a Small Home upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
    ],
  },
  {
    id: "tech_re_9",
    name: "Tenant Farming",
    column: 9,
    required: ["tech_re_"],
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
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
    ],
  },
  {
    id: "tech_re_10",
    name: "Sagittarii",
    column: 10,
    required: ["tech_re_"],
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
      "Ranged Barracks: Unlocks a Ranged Barracks upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_re_11",
    name: "Porcelain Production",
    column: 11,
    required: ["tech_re_"],
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
      "Porcelain Workshop: Unlocks the Porcelain Workshop",
      "Porcelain: Unlocks the good Porcelain for you, so that you can produce it in your city",
      "Clay Processor: Allows constructing 1 more Clay Processor building in your city",
    ],
  },
  {
    id: "tech_re_12",
    name: "Ballistas",
    column: 12,
    required: ["tech_re_"],
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
    rewards: ["Siege Barracks: Unlocks the Siege Barracks"],
  },
  {
    id: "tech_re_13",
    name: "Deep Foundations",
    column: 13,
    required: ["tech_re_"],
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_re_14",
    name: "Labor Duties",
    column: 14,
    required: ["tech_re_"],
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
      "Small Home: Allows constructing 3 more Small Home buildings in your city",
    ],
  },
  {
    id: "tech_re_15",
    name: "Villa Rustica",
    column: 15,
    required: ["tech_re_"],
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
      "Average Home: Unlocks a Average Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
    ],
  },
  {
    id: "tech_re_16",
    name: "Terracing",
    column: 16,
    required: ["tech_re_"],
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
      "Rice Farm: Unlocks a Rice Farm upgrade",
      "Rice Farm: Allows constructing 2 more Rice Farm buildings in your city",
    ],
  },
  {
    id: "tech_re_17",
    name: "Floor Plans",
    column: 17,
    required: ["tech_re_"],
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
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_re_18",
    name: "Public Gardens",
    column: 18,
    required: ["tech_re_"],
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
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in your city",
    ],
  },
  {
    id: "tech_re_19",
    name: "Villa Urbana",
    column: 19,
    required: ["tech_re_"],
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
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
      "Moderate Culture Site: Allows constructing 1 more Moderate Culture Site building in your city",
    ],
  },
  {
    id: "tech_re_20",
    name: "Turmae",
    column: 20,
    required: ["tech_re_"],
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
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "tech_re_21",
    name: "Advanced Clayworks",
    column: 21,
    required: ["tech_re_"],
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
      "Clay Processor: Allows constructing 1 more Clay Processor building in your city",
      "Porcelain Workshop: Allows constructing 1 more Porcelain Workshop building in your city",
    ],
  },
  {
    id: "tech_re_22",
    name: "Underfloor Heating",
    column: 22,
    required: ["tech_re_"],
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
      "Average Home: Unlocks a Average Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
    ],
  },
  {
    id: "tech_re_23",
    name: "Circus Maximus",
    column: 23,
    required: ["tech_re_"],
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
    rewards: ["Large Culture Site: Unlocks a Large Culture Site upgrade"],
  },
  {
    id: "tech_re_24",
    name: "Urban Management",
    column: 24,
    required: ["tech_re_"],
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
    ],
  },
  {
    id: "tech_re_25",
    name: "Dryland Farming",
    column: 25,
    required: ["tech_re_"],
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
      "Rice Farm: Unlocks a Rice Farm upgrade",
      "Rice Farm: Allows constructing 2 more Rice Farm buildings in your city",
    ],
  },
  {
    id: "tech_re_26",
    name: "Secondary Workshop",
    column: 26,
    required: ["tech_re_"],
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
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_re_27",
    name: "Legionary",
    column: 27,
    required: ["tech_re_"],
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
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "tech_re_28",
    name: "Porcelain Mastery",
    column: 28,
    required: ["tech_re_"],
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
      "Clay Processor: Allows constructing 1 more Clay Processor building in your city",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
    ],
  },
  {
    id: "tech_re_29",
    name: "Tertiary Workshop",
    column: 29,
    required: ["tech_re_"],
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
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_re_30",
    name: "Chinese Consensus",
    column: 30,
    required: ["tech_re_"],
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
    rewards: ["20: Gives you 20 Gems"],
  },
];
