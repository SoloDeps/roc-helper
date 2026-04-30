export const data = [
  // ─── ANCIENT WORLD ────────────────────────────────────────────────────────

  {
    meta: {
      code: "SH",
      name: "Stonehenge",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["temple", "temple"],
      rarity: "Rare",
      synergies: [{ raw: "temple", icons: ["coin", null], bonus: "+1/day" }],
    },
    bonuses: [
      {
        type: "coins_production",
        icons: ["coin", null],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
      {
        type: "rp_per_day",
        icons: ["research", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
          3, 3, 3, 3, 3, 3, 4,
        ],
      },
    ],
  },

  {
    meta: {
      code: "HG",
      name: "Hanging Gardens",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["nature", "palace"],
      rarity: "Rare",
      synergies: [{ raw: "palace", icons: ["food", null], bonus: "+8%" }],
    },
    bonuses: [
      {
        type: "food_production",
        icons: ["food", null],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
      {
        type: "worker_slots",
        icons: ["capital_worker", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 3,
        ],
      },
    ],
  },

  {
    meta: {
      code: "SoZ",
      name: "Statue of Zeus",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["statue", "statue"],
      rarity: "Rare",
      synergies: [
        {
          raw: "statue",
          icons: ["icon_unit_infantry", "icon_unitstat_damage"],
          bonus: "+4%",
        },
      ],
    },
    bonuses: [
      {
        type: "infantry_damage",
        icons: ["icon_unit_infantry", "icon_unitstat_damage"],
        values: [
          5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8,
          13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5,
          16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3,
        ],
      },
    ],
  },

  {
    meta: {
      code: "ToA",
      name: "Temple of Artemis",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["temple", "temple"],
      rarity: "Rare",
      synergies: [
        {
          raw: "statue",
          icons: ["icon_unit_ranged", "icon_unitstat_damage"],
          bonus: "+4%",
        },
      ],
    },
    bonuses: [
      {
        type: "ranged_damage",
        icons: ["icon_unit_ranged", "icon_unitstat_damage"],
        values: [
          5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8,
          13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5,
          16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3,
        ],
      },
      {
        type: "worker_slots",
        icons: ["capital_worker", null],
        values: [
          2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3,
          3, 3, 3, 3, 3, 3, 4,
        ],
      },
    ],
  },

  {
    meta: {
      code: "CP",
      name: "Cheops Pyramid",
      group: "Ancient World",
      slot: "Egypt",
      materials: ["temple", "temple"],
      rarity: "Rare",
      synergies: [
        { raw: "temple", icons: ["chest_good", null], bonus: "+60" },
      ],
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["good", "egypt"],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
      {
        type: "previous_era_goods",
        icons: ["chest_good", null],
        values: [
          100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230,
          240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370,
          380, 390,
        ],
      },
    ],
  },

  {
    meta: {
      code: "GS",
      name: "Great Sphinx",
      group: "Ancient World",
      slot: "Egypt",
      materials: ["statue", "statue"],
      rarity: "Rare",
      synergies: [
        {
          raw: "statue",
          icons: ["icon_unit_cavalry", "icon_unitstat_damage"],
          bonus: "+4%",
        },
      ],
    },
    bonuses: [
      {
        type: "cavalry_damage",
        icons: ["icon_unit_cavalry", "icon_unitstat_damage"],
        values: [
          5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8,
          13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5,
          16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3,
        ],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [
          20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5,
          35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5,
          43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "AS",
      name: "Abu Simbel",
      group: "Ancient World",
      slot: "Egypt",
      materials: ["palace", "palace"],
      rarity: "Legendary",
      synergies: [{ raw: "statue", icons: ["research", null], bonus: "+1" }],
    },
    bonuses: [
      {
        type: "army_damage",
        icons: ["icon_unitstat_damage", null],
        values: [
          5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8,
          13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5,
          16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3,
        ],
      },
      {
        type: "rp_per_day",
        icons: ["research", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
          3, 3, 3, 3, 3, 3, 4,
        ],
      },
    ],
  },

  {
    meta: {
      code: "ToM",
      name: "Tomb of Mausolus",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["temple", "temple"],
      rarity: "Rare",
      synergies: [{ raw: "temple", icons: ["good", null], bonus: "+100" }],
    },
    bonuses: [
      {
        type: "goods_quantity",
        icons: ["good", null],
        values: [
          300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690,
          720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080,
          1110, 1140, 1170,
        ],
      },
    ],
  },

  {
    meta: {
      code: "LoA",
      name: "Lighthouse of Alexandria",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["naval", "temple"],
      rarity: "Rare",
      synergies: [{ raw: "naval", icons: ["icon_trading", null], bonus: "+5%" }],
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["icon_trading", null],
        values: [
          5.0, 7.0, 8.3, 9.4, 10.3, 11.1, 11.8, 12.4, 12.9, 13.5, 14.0, 14.4,
          14.8, 15.2, 15.6, 16.0, 16.4, 16.7, 17.0, 17.3, 17.6, 17.9, 18.2,
          18.5, 18.7, 19.0, 19.3, 19.5, 19.7, 20.0,
        ],
      },
      {
        type: "trade_worker_slots",
        icons: ["trade_worker", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 3,
        ],
      },
    ],
  },

  {
    meta: {
      code: "CoR",
      name: "Colossus of Rhodes",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["naval", "statue"],
      synergies: [{ raw: "naval", icons: ["gears", null], bonus: "+5%" }],
    },
    bonuses: [
      {
        type: "donation_gears",
        icons: ["gears", "icon_arrow_boost"],
        values: [
          5, 9, 12, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
          31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
        ],
      },
      {
        type: "compass_slots",
        icons: ["icon_compass", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
          3, 3, 3, 3, 3, 3, 4,
        ],
      },
    ],
  },

  // ─── GREAT EMPIRES ────────────────────────────────────────────────────────

  {
    meta: {
      code: "HS",
      name: "Hagia Sophia",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["temple", "temple"],
      rarity: "Rare",
      synergies: [],
    },
    bonuses: [
      {
        type: "goods_quantity",
        icons: ["good", null],
        values: [
          250, 270, 290, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510,
          530, 550, 570, 590, 610, 630, 650, 670, 690, 710, 730, 750, 770, 790,
          810, 830,
        ],
      },
      {
        type: "previous_era_goods_quantity",
        icons: ["icon_previous_goods", null],
        values: [
          300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560,
          580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840,
          860, 880,
        ],
      },
    ],
  },

  {
    meta: {
      code: "C",
      name: "Colosseum",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["arena", "fortress"],
      rarity: "Rare",
      synergies: [
        {
          raw: "statue",
          icons: ["icon_unit_heavyinfantry", "icon_unitstat_damage"],
          bonus: "+4%",
        },
      ],
    },
    bonuses: [
      {
        type: "heavy_infantry_damage",
        icons: ["icon_unit_heavyinfantry", "icon_unitstat_damage"],
        values: [
          5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8,
          13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5,
          16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3,
        ],
      },
      {
        type: "worker_slots",
        icons: ["capital_worker", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 3,
        ],
      },
    ],
  },

  {
    meta: {
      code: "PoA",
      name: "Palace of Aachen",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["palace", "fortress"],
      rarity: "Rare",
      synergies: [
        {
          raw: "fortress",
          icons: ["icon_unit_infantry", "icon_unitstat_hitpoints"],
          bonus: "+2%",
        },
      ],
    },
    bonuses: [
      {
        type: "infantry_hp",
        icons: ["icon_unit_infantry", "icon_unitstat_hitpoints"],
        values: [
          2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8,
          7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9,
          9.0, 9.1,
        ],
      },
      {
        type: "recruitment_time_reduction",
        icons: ["icon_unit_aachen", "icon_time_boost"],
        values: [
          5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8,
          30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4,
          41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "SF",
      name: "Sherwood Forest",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["nature", "fortress"],
      rarity: "Legendary",
      synergies: [
        {
          raw: "fortress",
          icons: ["icon_unit_ranged", "icon_unitstat_hitpoints"],
          bonus: "+2%",
        },
      ],
    },
    bonuses: [
      {
        type: "ranged_hp",
        icons: ["icon_unit_ranged", "icon_unitstat_hitpoints"],
        values: [
          2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8,
          7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9,
          9.0, 9.1,
        ],
      },
    ],
  },

  {
    meta: {
      code: "TA",
      name: "Terracotta Army",
      group: "Great Empires",
      slot: "China",
      materials: ["statue", "fortress"],
      synergies: [
        {
          raw: "fortress",
          icons: ["icon_unit_heavyinfantry", "icon_unitstat_hitpoints"],
          bonus: "+2%",
        },
      ],
    },
    bonuses: [
      {
        type: "heavy_infantry_hp",
        icons: ["icon_unit_heavyinfantry", "icon_unitstat_hitpoints"],
        values: [
          2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8,
          7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9,
          9.0, 9.1,
        ],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [
          20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5,
          35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5,
          43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "FC",
      name: "Forbidden City",
      group: "Great Empires",
      slot: "China",
      materials: ["temple", "palace"],
      synergies: [
        { raw: "temple", icons: ["chest_good", null], bonus: "+60" },
      ],
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["good", "china"],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
      {
        type: "goods_quantity",
        icons: ["chest_good", null],
        values: [
          100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230,
          240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370,
          380, 390,
        ],
      },
    ],
  },

  {
    meta: {
      code: "GW",
      name: "Great Wall",
      group: "Great Empires",
      slot: "China",
      materials: ["fortress", "fortress"],
      rarity: "Legendary",
      synergies: [{ raw: "fortress", icons: ["research", null], bonus: "+1" }],
    },
    bonuses: [
      {
        type: "army_hp",
        icons: ["icon_unitstat_hitpoints", null],
        values: [
          2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8,
          7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9,
          9.0, 9.1,
        ],
      },
      {
        type: "rp_per_day",
        icons: ["research", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
          3, 3, 3, 3, 3, 3, 4,
        ],
      },
    ],
  },

  {
    meta: {
      code: "SP",
      name: "Sayil palace",
      group: "Great Empires",
      slot: "Maya Empire",
      materials: ["palace", "fortress"],
      rarity: "Rare",
      synergies: [
        {
          raw: "fortress",
          icons: ["icon_unit_bastion", "icon_unitstat_hitpoints"],
          bonus: "+2%",
        },
      ],
    },
    bonuses: [
      {
        type: "bastion_hp",
        icons: ["icon_unit_bastion", "icon_unitstat_hitpoints"],
        values: [
          2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8,
          7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9,
          9.0, 9.1,
        ],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [
          20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5,
          35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5,
          43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "T",
      name: "Tikal",
      group: "Great Empires",
      slot: "Maya Empire",
      materials: ["arena", "arena"],
      synergies: [{ raw: "arena", icons: ["good", null], bonus: "+5%" }],
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["good", "maya"],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
      {
        type: "goods_production_secondary",
        icons: ["good", null],
        values: [
          5.0, 6.5, 7.5, 8.2, 9.0, 9.7, 10.2, 11.0, 11.5, 12.0, 12.2, 12.7,
          13.2, 13.5, 14.0, 14.2, 14.5, 15.0, 15.3, 15.5, 15.7, 16.2, 16.5,
          16.7, 17.0, 17.2, 17.5, 17.7, 18.0, 18.2,
        ],
      },
    ],
  },

  {
    meta: {
      code: "CI",
      name: "Chichen Itza",
      group: "Great Empires",
      slot: "Maya Empire",
      materials: ["temple", "arena"],
      rarity: "Legendary",
      synergies: [
        {
          raw: "arena",
          icons: ["icon_unit_ranged", "icon_unitstat_criticalhitchance"],
          bonus: "+1%",
        },
      ],
    },
    bonuses: [
      {
        type: "ranged_critical_hit_boost",
        icons: ["icon_unit_ranged", "icon_unitstat_criticalhitchance"],
        values: [
          25, 35, 43, 49, 54, 59, 64, 68, 72, 75, 79, 82, 85, 88, 91, 94, 96,
          99, 101, 104, 106, 108, 111, 113, 115, 117, 119, 121, 123, 125,
        ],
      },
      {
        type: "recruitment_time_reduction",
        icons: ["icon_unit_maya_archer", "icon_time_boost"],
        values: [
          5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8,
          30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4,
          41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5,
        ],
      },
    ],
  },

  // ─── STORIES AND MYTHS ────────────────────────────────────────────────────

  {
    meta: {
      code: "CC",
      name: "Cité de Carcassonne",
      group: "Stories and Myths",
      slot: "Capital City",
      materials: ["palace", "fortress"],
      rarity: "Rare",
      synergies: [],
    },
    bonuses: [
      {
        type: "heavy_infantry_critical_hit_chance",
        icons: ["icon_unit_heavyinfantry", "icon_unitstat_criticalhitchance"],
        values: [
          30, 44, 55, 65, 74, 82, 89, 96, 102, 108, 114, 120, 126, 131, 136,
          141, 146, 150, 155, 160, 164, 168, 173, 177, 181, 185, 189, 193, 196,
          200,
        ],
      },
      {
        type: "heavy_infantry_recruitment_time_reduction",
        icons: ["icon_unit_heavyinfantry", "icon_time_boost"],
        values: [
          5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8,
          30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4,
          41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5,
        ],
      },
      {
        type: "carcassonne_recruitment_time_reduction",
        icons: ["icon_unit_carcassonne", "icon_time_boost"],
        values: [
          5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8,
          30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4,
          41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "LToP",
      name: "Leaning Tower of Pisa",
      group: "Stories and Myths",
      slot: "Capital City",
      materials: ["nature", "temple"],
      synergies: [
        { raw: "nature", icons: ["research", "icon_time_boost"], bonus: "×2.5%" },
      ],
    },
    bonuses: [
      {
        type: "research_point_cap",
        icons: ["research", "icon_arrow_boost"],
        values: [
          15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 34,
          35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 52,
        ],
      },
      {
        type: "research_regen_boost",
        icons: ["research", "icon_time_boost"],
        values: [
          10, 12, 14, 15, 20, 21, 22, 22, 23, 24, 24, 25, 25, 26, 30, 30, 31,
          31, 32, 32, 32, 33, 33, 33, 34, 34, 34, 35, 35, 40,
        ],
      },
    ],
  },

  {
    meta: {
      code: "A",
      name: "Alhambra",
      group: "Stories and Myths",
      slot: "Capital City",
      materials: ["nature", "fortress"],
      synergies: [],
    },
    bonuses: [
      {
        type: "worker_slots",
        icons: ["capital_worker", null],
        values: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
          3, 3, 3, 3, 3, 3, 4,
        ],
      },
      {
        type: "infantry_critical_hit_chance",
        icons: ["icon_unit_infantry", "icon_unitstat_criticalhitchance"],
        values: [
          40, 60, 77, 91, 104, 116, 127, 137, 147, 157, 166, 174, 183, 191, 199,
          207, 214, 222, 229, 236, 243, 250, 256, 263, 269, 276, 282, 288, 294,
          300,
        ],
      },
    ],
  },

  {
    meta: {
      code: "DE",
      name: "Dragonship Ellida",
      group: "Stories and Myths",
      slot: "Viking Kingdom",
      materials: ["naval", "naval"],
      rarity: "Rare",
      synergies: [],
    },
    bonuses: [
      {
        type: "cavalry_hp",
        icons: ["icon_unit_cavalry", "icon_unitstat_hitpoints"],
        values: [
          2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8,
          7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9,
          9.0, 9.1,
        ],
      },
      {
        type: "trade_slot_cooldown_reduction",
        icons: ["trade_slot_cooldown_boost", null],
        values: [
          10.0, 14.0, 16.9, 19.3, 25.0, 26.8, 28.4, 29.9, 31.3, 35.0, 36.2,
          37.4, 38.5, 39.5, 45.0, 46.0, 46.9, 47.8, 48.7, 55.0, 55.8, 56.6,
          57.4, 58.2, 65.0, 65.7, 66.4, 67.1, 67.8, 75.0,
        ],
      },
    ],
  },

  {
    meta: {
      code: "V",
      name: "Valhalla",
      group: "Stories and Myths",
      slot: "Viking Kingdom",
      materials: ["arena", "arena"],
      rarity: "Legendary",
      synergies: [
        {
          raw: "palace",
          icons: ["icon_unitstat_damage", null],
          bonus: "+1.5%",
        },
      ],
    },
    bonuses: [
      {
        type: "army_damage",
        icons: ["icon_unitstat_damage", null],
        values: [
          5.0, 5.55, 6.0, 6.36, 6.64, 6.92, 7.16, 7.36, 7.56, 7.76, 7.92, 8.12,
          8.28, 8.4, 8.56, 8.72, 8.84, 8.96, 9.12, 9.24, 9.36, 9.48, 9.6, 9.68,
          9.8, 9.92, 10.0, 10.12, 10.2, 10.32,
        ],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [
          20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5,
          35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5,
          43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "Y",
      name: "Yggdrasil",
      group: "Stories and Myths",
      slot: "Viking Kingdom",
      materials: ["nature", "statue"],
      rarity: "Rare",
      synergies: [],
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["mead", null],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
    ],
  },

  {
    meta: {
      code: "P",
      name: "Petra",
      group: "Stories and Myths",
      slot: "Arabia",
      materials: ["temple", "fortress"],
      rarity: "Rare",
      synergies: [{ raw: "temple", icons: ["good", null], bonus: "+5%" }],
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["good", "arabia"],
        values: [
          10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5,
          25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5,
          33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5,
        ],
      },
      {
        type: "goods_production_secondary",
        icons: ["good", null],
        values: [
          5.0, 6.5, 7.5, 8.2, 9.0, 9.7, 10.2, 11.0, 11.5, 12.0, 12.2, 12.7,
          13.2, 13.5, 14.0, 14.2, 14.5, 15.0, 15.3, 15.5, 15.7, 16.2, 16.5,
          16.7, 17.0, 17.2, 17.5, 17.7, 18.0, 18.2,
        ],
      },
      {
        type: "arabia_worker_slots",
        icons: ["arabia_worker", null],
        values: [
          1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5,
          5, 6, 6, 6, 6, 6, 7,
        ],
      },
    ],
  },

  {
    meta: {
      code: "CoB",
      name: "City of Brass",
      group: "Stories and Myths",
      slot: "Arabia",
      materials: ["palace", "palace"],
      rarity: "Legendary",
      // CoB has TWO distinct synergy bonuses activated by the same Palace material
      synergies: [
        {
          raw: "palace",
          icons: ["icon_unit_cavalry", "icon_unitstat_movementspeed"],
          bonus: "+10%",
        },
        { raw: "palace", icons: ["bazaar_boost", null], bonus: "+10%" },
      ],
    },
    bonuses: [
      {
        type: "cavalry_hit_rate",
        icons: ["icon_unit_cavalry", "icon_unitstat_hitrate"],
        values: [
          25, 35, 43, 49, 54, 59, 64, 68, 72, 75, 79, 82, 85, 88, 91, 94, 96,
          99, 101, 104, 106, 108, 111, 113, 115, 117, 119, 121, 123, 125,
        ],
      },
      {
        type: "bazaar_offer_boost",
        icons: ["bazaar_boost", null],
        values: [
          15, 21, 25, 29, 31, 34, 36, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48,
          49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 60,
        ],
      },
    ],
  },
];
