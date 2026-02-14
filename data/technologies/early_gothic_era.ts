import { TechnoData } from "@/types/shared";

export const technos_EG: TechnoData[] = [
  {
    id: "techno_early_gothic_era_0",
    name: "Flying Buttresses",
    column: 0,
    costs: {
      research_points: 100,
      coins: 2900000,
      food: 3500000,
      goods: [
        {
          resource: "tertiary_hm",
          amount: 13500,
        },
        {
          resource: "primary_hm",
          amount: 5700,
        },
      ],
    },
  },
  {
    id: "techno_early_gothic_era_1",
    name: "Carrucas",
    column: 1,
    costs: {
      research_points: 110,
      coins: 5900000,
      food: 3200000,
      goods: [
        {
          resource: "primary_hm",
          amount: 13000,
        },
        {
          resource: "secondary_hm",
          amount: 5350,
        },
        {
          resource: "primary_ks",
          amount: 4300,
        },
      ],
    },
  },
  {
    id: "techno_early_gothic_era_2",
    name: "Deep Sea Ports",
    allied: "ottoman",
    column: 1,
    costs: {
      research_points: 28,
      coins: 5900000,
      food: 4000000,
      goods: [
        {
          resource: "secondary_hm",
          amount: 10000,
        },
        {
          resource: "tertiary_hm",
          amount: 4250,
        },
        {
          resource: "primary_ie",
          amount: 4250,
        },
      ],
    },
  },
];
