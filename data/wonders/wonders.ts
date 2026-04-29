export const data = [

  // ─── ANCIENT WORLD ────────────────────────────────────────────────────────

  {
    meta: {
      code: "SH",
      name: "Stonehenge",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Temple", "Temple"],
      rarity: "Rare",
      synergy: { raw: "Temple" },
    },
    bonuses: [
      {
        type: "coins_production",
        icons: ["coin", null],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
      {
        type: "rp_per_day",
        icons: ["research", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
      },
    ],
  },

  {
    meta: {
      code: "HG",
      name: "Hanging Gardens",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Nature", "Palace"],
      rarity: "Rare",
      synergy: { raw: "Palace" },
    },
    bonuses: [
      {
        type: "food_production",
        icons: ["food", null],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
      {
        type: "worker_slots",
        icons: ["worker", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
      },
    ],
  },

  {
    meta: {
      code: "SoZ",
      name: "Statue of Zeus",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Statue", "Statue"],
      rarity: "Rare",
      synergy: { raw: "Statue" },
    },
    bonuses: [
      {
        type: "infantry_damage",
        icons: ["unit_infantry", "stat_damage"],
        values: [5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8, 13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5, 16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3],
      },
    ],
  },

  {
    meta: {
      code: "ToA",
      name: "Temple of Artemis",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Temple", "Temple"],
      rarity: "Rare",
      synergy: { raw: "Statue" },
    },
    bonuses: [
      {
        type: "ranged_damage",
        icons: ["unit_range", "stat_damage"],
        values: [5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8, 13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5, 16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3],
      },
      {
        type: "worker_slots",
        icons: ["worker", null],
        values: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
      },
    ],
  },

  {
    meta: {
      code: "CP",
      name: "Cheops Pyramid",
      group: "Ancient World",
      slot: "Egypt",
      materials: ["Temple", "Temple"],
      rarity: "Rare",
      synergy: { raw: "Temple" },
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["egypt_crest", "goods"],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
      {
        type: "previous_era_goods",
        icons: ["goods_chest", null],
        values: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
      },
    ],
  },

  {
    meta: {
      code: "GS",
      name: "Great Sphinx",
      group: "Ancient World",
      slot: "Egypt",
      materials: ["Statue", "Statue"],
      rarity: "Rare",
      synergy: { raw: "Statue" },
    },
    bonuses: [
      {
        type: "cavalry_damage",
        icons: ["unit_cavalry", "stat_damage"],
        values: [5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8, 13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5, 16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5, 35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5],
      },
    ],
  },

  {
    meta: {
      code: "AS",
      name: "Abu Simbel",
      group: "Ancient World",
      slot: "Egypt",
      materials: ["Palace", "Palace"],
      rarity: "Legendary",
      synergy: { raw: "Statue" },
    },
    bonuses: [
      {
        type: "army_damage",
        icons: ["stat_damage", null],
        values: [5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8, 13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5, 16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3],
      },
      {
        type: "rp_per_day",
        icons: ["research", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
      },
    ],
  },

  {
    meta: {
      code: "ToM",
      name: "Tomb of Mausolus",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Temple", "Temple"],
      rarity: "Rare",
      synergy: { raw: "Temple" },
    },
    bonuses: [
      {
        type: "goods_quantity",
        icons: ["goods", null],
        values: [300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170],
      },
    ],
  },

  {
    meta: {
      code: "LoA",
      name: "Lighthouse of Alexandria",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Naval", "Temple"],
      rarity: "Rare",
      synergy: { raw: "Naval" },
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["goods", null],
        values: [5.0, 7.0, 8.3, 9.4, 10.3, 11.1, 11.8, 12.4, 12.9, 13.5, 14.0, 14.4, 14.8, 15.2, 15.6, 16.0, 16.4, 16.7, 17.0, 17.3, 17.6, 17.9, 18.2, 18.5, 18.7, 19.0, 19.3, 19.5, 19.7, 20.0],
      },
      {
        type: "trade_worker_slots",
        icons: ["trade_worker", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
      },
    ],
  },

  {
    meta: {
      code: "CoR",
      name: "Colossus of Rhodes",
      group: "Ancient World",
      slot: "Capital City",
      materials: ["Naval", "Statue"],
      synergy: { raw: "Naval" },
    },
    bonuses: [
      {
        type: "donation_gears",
        icons: ["gears", null],
        values: [5, 9, 12, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
      },
      {
        type: "compass_slots",
        icons: ["compass", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
      },
    ],
  },

  // {
  //   meta: {
  //     code: "C",
  //     name: "Carcassonne",
  //     group: "Ancient World",
  //     slot: "Capital City",
  //     materials: ["Palace", "Fortress"],
  //     synergy: null,
  //   },
  //   bonuses: [
  //     {
  //       type: "heavy_infantry_critical_hit_boost",
  //       icons: ["unit_heavy_infantry", "stat_crit_boost"],
  //       values: [30, 44, 55, 65, 74, 82, 89, 96, 102, 108, 114, 120, 126, 131, 136, 141, 146, 150, 155, 160, 164, 168, 173, 177, 181, 185, 189, 193, 196, 200],
  //     },
  //     {
  //       type: "heavy_infantry_recruitment_time_reduction",
  //       icons: ["unit_heavy_infantry", null],
  //       values: [5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8, 30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4, 41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5],
  //     },
  //   ],
  // },

  // ─── GREAT EMPIRES ────────────────────────────────────────────────────────

  {
    meta: {
      code: "HS",
      name: "Hagia Sophia",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["Temple", "Temple"],
      rarity: "Rare",
      synergy: null,
    },
    bonuses: [
      {
        type: "goods_quantity",
        icons: ["goods", null],
        values: [250, 270, 290, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510, 530, 550, 570, 590, 610, 630, 650, 670, 690, 710, 730, 750, 770, 790, 810, 830],
      },
      {
        type: "previous_era_goods_quantity",
        icons: ["previous_goods", null],
        values: [300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880],
      },
    ],
  },

  {
    meta: {
      code: "C",
      name: "Colosseum",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["Arena", "Fortress"],
      rarity: "Rare",
      synergy: { raw: "Statue" },
    },
    bonuses: [
      {
        type: "heavy_infantry_damage",
        icons: ["unit_heavy_infantry", "stat_damage"],
        values: [5.0, 6.4, 7.5, 8.4, 9.1, 9.8, 10.4, 10.9, 11.4, 11.9, 12.3, 12.8, 13.2, 13.5, 13.9, 14.3, 14.6, 14.9, 15.3, 15.6, 15.9, 16.2, 16.5, 16.7, 17.0, 17.3, 17.5, 17.8, 18.0, 18.3],
      },
      {
        type: "worker_slots",
        icons: ["worker", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
      },
    ],
  },

  {
    meta: {
      code: "PoA",
      name: "Palace of Aachen",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["Palace", "Fortress"],
      rarity: "Rare",
      synergy: { raw: "Fortress" },
    },
    bonuses: [
      {
        type: "infantry_hp",
        icons: ["unit_infantry", "stat_hit_points"],
        values: [2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1],
      },
      {
        type: "recruitment_time_reduction",
        icons: ["unit_aachen_boost", null],
        values: [5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8, 30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4, 41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5],
      },
    ],
  },

  {
    meta: {
      code: "SF",
      name: "Sherwood Forest",
      group: "Great Empires",
      slot: "Capital City",
      materials: ["Nature", "Fortress"],
      rarity: "Legendary",
      synergy: { raw: "Fortress" },
    },
    bonuses: [
      {
        type: "ranged_hp",
        icons: ["unit_range", "stat_hit_points"],
        values: [2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1],
      },
    ],
  },

  {
    meta: {
      code: "TA",
      name: "Terracotta Army",
      group: "Great Empires",
      slot: "China",
      materials: ["Statue", "Fortress"],
      synergy: { raw: "Fortress" },
    },
    bonuses: [
      {
        type: "heavy_infantry_hp",
        icons: ["unit_heavy_infantry", "stat_hit_points"],
        values: [2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5, 35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5],
      },
    ],
  },

  {
    meta: {
      code: "FC",
      name: "Forbidden City",
      group: "Great Empires",
      slot: "China",
      materials: ["Temple", "Palace"],
      synergy: { raw: "Temple" },
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["china_crest", "goods"],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
      {
        type: "goods_quantity",
        icons: ["goods_chest2", null],
        values: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
      },
    ],
  },

  {
    meta: {
      code: "GW",
      name: "Great Wall",
      group: "Great Empires",
      slot: "China",
      materials: ["Fortress", "Fortress"],
      rarity: "Legendary",
      synergy: { raw: "Fortress" },
    },
    bonuses: [
      {
        type: "army_hp",
        icons: ["stat_hit_points", null],
        values: [2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1],
      },
      {
        type: "rp_per_day",
        icons: ["research", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
      },
    ],
  },

  {
    meta: {
      code: "SP",
      name: "Sayil Palace",
      group: "Great Empires",
      slot: "Maya Empire",
      materials: ["Palace", "Fortress"],
      rarity: "Rare",
      synergy: { raw: "Fortress" },
    },
    bonuses: [
      {
        type: "bastion_hp",
        icons: ["unit_bastion", "stat_hit_points"],
        values: [2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5, 35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5],
      },
    ],
  },

  {
    meta: {
      code: "T",
      name: "Tikal",
      group: "Great Empires",
      slot: "Maya Empire",
      materials: ["Arena", "Arena"],
      synergy: { raw: "Arena" },
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["maya_crest", "goods"],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
      {
        type: "goods_production_secondary",
        icons: ["goods", null],
        values: [5.0, 6.5, 7.5, 8.2, 9.0, 9.7, 10.2, 11.0, 11.5, 12.0, 12.2, 12.7, 13.2, 13.5, 14.0, 14.2, 14.5, 15.0, 15.3, 15.5, 15.7, 16.2, 16.5, 16.7, 17.0, 17.2, 17.5, 17.7, 18.0, 18.2],
      },
    ],
  },

  {
    meta: {
      code: "CI",
      name: "Chichen Itza",
      group: "Great Empires",
      slot: "Maya Empire",
      materials: ["Temple", "Arena"],
      rarity: "Legendary",
      synergy: { raw: "Arena" },
    },
    bonuses: [
      {
        type: "ranged_critical_hit_boost",
        icons: ["unit_range", "stat_crit_boost"],
        values: [25, 35, 43, 49, 54, 59, 64, 68, 72, 75, 79, 82, 85, 88, 91, 94, 96, 99, 101, 104, 106, 108, 111, 113, 115, 117, 119, 121, 123, 125],
      },
      {
        type: "recruitment_time_reduction",
        icons: ["unit_maya_archer", null],
        values: [5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8, 30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4, 41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5],
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
      materials: ["Palace", "Fortress"],
      rarity: "Rare",
      synergy: null,
    },
    bonuses: [
      {
        type: "heavy_infantry_critical_hit_chance",
        icons: ["unit_heavy_infantry", "stat_crit_chance"],
        values: [30, 44, 55, 65, 74, 82, 89, 96, 102, 108, 114, 120, 126, 131, 136, 141, 146, 150, 155, 160, 164, 168, 173, 177, 181, 185, 189, 193, 196, 200],
      },
      {
        type: "heavy_infantry_recruitment_time_reduction",
        icons: ["unit_heavy_infantry", null],
        values: [5.0, 11.2, 14.8, 17.4, 19.3, 21.0, 22.3, 23.6, 24.9, 26.2, 27.5, 28.8, 30.1, 31.4, 32.7, 34.0, 35.3, 36.6, 37.9, 39.2, 40.5, 40.9, 41.4, 41.8, 42.3, 42.7, 43.2, 43.6, 44.1, 44.5],
      },
    ],
  },

  {
    meta: {
      code: "LToP",
      name: "Leaning Tower of Pisa",
      group: "Stories and Myths",
      slot: "Capital City",
      materials: ["Nature", "Temple"],
      synergy: { raw: "Nature" },
    },
    bonuses: [
      {
        type: "research_point_cap",
        icons: ["research", "boost"],
        values: [15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 52],
      },
      {
        type: "research_regen_boost",
        icons: ["research", "time_boost"],
        values: [10, 12, 14, 15, 20, 21, 22, 22, 23, 24, 24, 25, 25, 26, 30, 30, 31, 31, 32, 32, 32, 33, 33, 33, 34, 34, 34, 35, 35, 40],
      },
    ],
  },

  {
    meta: {
      code: "A",
      name: "Alhambra",
      group: "Stories and Myths",
      slot: "Capital City",
      materials: ["Nature", "Fortress"],
      synergy: null,
    },
    bonuses: [
      {
        type: "worker_slots",
        icons: ["worker", null],
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
      },
      {
        type: "infantry_critical_hit_chance",
        icons: ["unit_infantry", "stat_crit_chance"],
        values: [40, 60, 77, 91, 104, 116, 127, 137, 147, 157, 166, 174, 183, 191, 199, 207, 214, 222, 229, 236, 243, 250, 256, 263, 269, 276, 282, 288, 294, 300],
      },
    ],
  },

  {
    meta: {
      code: "DE",
      name: "Dragonship Ellida",
      group: "Stories and Myths",
      slot: "Viking Kingdom",
      materials: ["Naval", "Naval"],
      rarity: "Rare",
      synergy: null,
    },
    bonuses: [
      {
        type: "cavalry_hp",
        icons: ["unit_cavalry", "stat_hit_points"],
        values: [2.5, 3.2, 3.7, 4.2, 4.5, 4.9, 5.2, 5.4, 5.7, 5.9, 6.2, 6.4, 6.6, 6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1],
      },
      {
        type: "trade_slot_cooldown_reduction",
        icons: ["trade_slot_cooldown_boost", null],
        values: [10.0, 14.0, 16.9, 19.3, 25.0, 26.8, 28.4, 29.9, 31.3, 35.0, 36.2, 37.4, 38.5, 39.5, 45.0, 46.0, 46.9, 47.8, 48.7, 55.0, 55.8, 56.6, 57.4, 58.2, 65.0, 65.7, 66.4, 67.1, 67.8, 75.0],
      },
    ],
  },

  {
    meta: {
      code: "V",
      name: "Valhalla",
      group: "Stories and Myths",
      slot: "Viking Kingdom",
      materials: ["Arena", "Arena"],
      rarity: "Legendary",
      synergy: { raw: "Palace" },
    },
    bonuses: [
      {
        type: "army_damage",
        icons: ["stat_damage", null],
        values: [5.00, 5.55, 6.00, 6.36, 6.64, 6.92, 7.16, 7.36, 7.56, 7.76, 7.92, 8.12, 8.28, 8.40, 8.56, 8.72, 8.84, 8.96, 9.12, 9.24, 9.36, 9.48, 9.60, 9.68, 9.80, 9.92, 10.00, 10.12, 10.20, 10.32],
      },
      {
        type: "chest_drop_chance",
        icons: ["mystery_chest", null],
        values: [20.0, 23.0, 25.0, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 34.5, 35.5, 36.5, 37.0, 38.0, 38.5, 39.0, 40.0, 40.5, 41.0, 41.5, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5],
      },
    ],
  },

  {
    meta: {
      code: "Y",
      name: "Yggdrasil",
      group: "Stories and Myths",
      slot: "Viking Kingdom",
      materials: ["Nature", "Statue"],
      rarity: "Rare",
      synergy: null,
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["mead", null],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
    ],
  },

  {
    meta: {
      code: "P",
      name: "Petra",
      group: "Stories and Myths",
      slot: "Arabia",
      materials: ["Temple", "Fortress"],
      rarity: "Rare",
      synergy: { raw: "Temple" },
    },
    bonuses: [
      {
        type: "goods_production",
        icons: ["arabia_crest", "goods"],
        values: [10.0, 13.0, 15.0, 16.5, 18.0, 19.5, 20.5, 22.0, 23.0, 24.0, 24.5, 25.5, 26.5, 27.0, 28.0, 28.5, 29.0, 30.0, 30.5, 31.0, 31.5, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5],
      },
      {
        type: "goods_production_secondary",
        icons: ["goods", null],
        values: [5.0, 6.5, 7.5, 8.2, 9.0, 9.7, 10.2, 11.0, 11.5, 12.0, 12.2, 12.7, 13.2, 13.5, 14.0, 14.2, 14.5, 15.0, 15.3, 15.5, 15.7, 16.2, 16.5, 16.7, 17.0, 17.2, 17.5, 17.7, 18.0, 18.2],
      },
      {
        type: "arabia_worker_slots",
        icons: ["arabia_worker", null],
        values: [1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7],
      },
    ],
  },

  {
    meta: {
      code: "CoB",
      name: "City of Brass",
      group: "Stories and Myths",
      slot: "Arabia",
      materials: ["Palace", "Palace"],
      rarity: "Legendary",
      synergy: { raw: "Palace" },
    },
    bonuses: [
      {
        type: "cavalry_hit_rate",
        icons: ["unit_cavalry", "stat_hit_rate"],
        values: [25, 35, 43, 49, 54, 59, 64, 68, 72, 75, 79, 82, 85, 88, 91, 94, 96, 99, 101, 104, 106, 108, 111, 113, 115, 117, 119, 121, 123, 125],
      },
      {
        type: "bazaar_offer_boost",
        icons: ["bazaar_boost", null],
        values: [15, 21, 25, 29, 31, 34, 36, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 60],
      },
    ],
  },

];
