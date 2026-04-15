// ============================================================
// ROC Helper – World Wonders: Bonus Arrays
//
// Per-level bonus values for all 28 Wonders.
// Indexed 1–30 (level 0 header is omitted; UI renders it
// from WonderMeta bonus type labels).
//
// Bonus types (snake_case) are used for filtering/comparison.
// Label strings match the wiki display values.
//
// Sources:
//   module-ancient-world.lua (Bonus[1][], Bonus[2][], Static_Bonus)
//   module-great-empires.lua  (Bonus[], Static_Bonus)
//   module-stories-and-myths.lua (Static_Bonus)
// ============================================================

import type { BonusValue } from './types';

/** Single bonus array: 30 entries indexed 1–30. */
type BonusArray = Record<number, BonusValue[]>;

// --------------- Shared bonus scale tables ---------------
// These correspond to Bonus[1][] and Bonus[2][] in the AW Lua module,
// and Bonus[] in the GE module.

/** Coin/Food/Goods production scale (+10% → +36.5%), used by many AW Wonders. */
const PROD_BONUS_1: string[] = [
  '', // padding for 1-based indexing
  '10.0%','13.0%','15.0%','16.5%','18.0%','19.5%','20.5%','22.0%','23.0%','24.0%',
  '24.5%','25.5%','26.5%','27.0%','28.0%','28.5%','29.0%','30.0%','30.5%','31.0%',
  '31.5%','32.5%','33.0%','33.5%','34.0%','34.5%','35.0%','35.5%','36.0%','36.5%',
];

/** Infantry/Cavalry/Ranged damage scale (5% → 18.3%), used by combat Wonders. */
const COMBAT_BONUS_2: string[] = [
  '',
  '5.0%','6.4%','7.5%','8.4%','9.1%','9.8%','10.4%','10.9%','11.4%','11.9%',
  '12.3%','12.8%','13.2%','13.5%','13.9%','14.3%','14.6%','14.9%','15.3%','15.6%',
  '15.9%','16.2%','16.5%','16.7%','17.0%','17.3%','17.5%','17.8%','18.0%','18.3%',
];

/** Small HP/unit stat scale (2.5% → 9.1%), used by GE Wonders. */
const SMALL_STAT_BONUS: string[] = [
  '',
  '2.5%','3.2%','3.7%','4.2%','4.5%','4.9%','5.2%','5.4%','5.7%','5.9%',
  '6.2%','6.4%','6.6%','6.8%','7.0%','7.1%','7.3%','7.5%','7.6%','7.8%',
  '7.9%','8.1%','8.2%','8.4%','8.5%','8.6%','8.8%','8.9%','9.0%','9.1%',
];

/** Recruitment time reduction scale used by Carcassonne / Chichen Itza / Aachen / Dragonship. */
const RECRUIT_TIME_REDUCTION: string[] = [
  '',
  '5.0%','11.2%','14.8%','17.4%','19.3%','21.0%','22.3%','23.6%','24.9%','26.2%',
  '27.5%','28.8%','30.1%','31.4%','32.7%','34.0%','35.3%','36.6%','37.9%','39.2%',
  '40.5%','40.9%','41.4%','41.8%','42.3%','42.7%','43.2%','43.6%','44.1%','44.5%',
];

// Derived time label from 120 min base (Carcassonne heavy infantry recruits in 2h)
function recruitTimeLabel(reductionPercent: number): string {
  const pct = parseFloat(reductionPercent.toString()) / 100;
  const mins = Math.floor(120 * (1 - pct));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

// Helper to build a BonusArray from a string array
function fromStrings(type: string, values: string[]): BonusArray {
  const result: BonusArray = {};
  for (let i = 1; i <= 30; i++) {
    result[i] = [{ type, label: values[i] ?? '' }];
  }
  return result;
}

// ============================================================
// ANCIENT WORLD
// ============================================================

// --- Stonehenge ---
export const STONEHENGE_BONUSES: BonusArray = {};
{
  const coinProd = PROD_BONUS_1;
  const rpSlots  = ['','1','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','2','2','3','3','3','3','3','3','3','3','3','3','4'];
  for (let i = 1; i <= 30; i++) {
    STONEHENGE_BONUSES[i] = [
      { type: 'coin_production',   label: coinProd[i] },
      { type: 'research_slot',     label: rpSlots[i] },
    ];
  }
}

// --- Hanging Gardens ---
export const HANGING_GARDENS_BONUSES: BonusArray = {};
{
  const foodProd = PROD_BONUS_1;
  const workers  = ['','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+3'];
  for (let i = 1; i <= 30; i++) {
    HANGING_GARDENS_BONUSES[i] = [
      { type: 'food_production',   label: foodProd[i] },
      { type: 'worker',            label: workers[i] },
    ];
  }
}

// --- Statue of Zeus ---
export const STATUE_OF_ZEUS_BONUSES: BonusArray = fromStrings('infantry_damage', COMBAT_BONUS_2);

// --- Temple of Artemis ---
export const TEMPLE_OF_ARTEMIS_BONUSES: BonusArray = {};
{
  const rangedDmg = COMBAT_BONUS_2;
  const workers   = ['','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+4'];
  for (let i = 1; i <= 30; i++) {
    TEMPLE_OF_ARTEMIS_BONUSES[i] = [
      { type: 'ranged_damage',   label: rangedDmg[i] },
      { type: 'worker',          label: workers[i] },
    ];
  }
}

// --- Cheops Pyramid ---
export const CHEOPS_PYRAMID_BONUSES: BonusArray = {};
{
  const goodsProd = PROD_BONUS_1;
  for (let i = 1; i <= 30; i++) {
    CHEOPS_PYRAMID_BONUSES[i] = [
      { type: 'egypt_goods_production', label: goodsProd[i] },
      { type: 'prev_era_goods',         label: `${90 + i * 10}` },  // 100 → 390
    ];
  }
}

// --- Great Sphinx ---
export const GREAT_SPHINX_BONUSES: BonusArray = {};
{
  const cavDmg = COMBAT_BONUS_2;
  // Chest probabilities: Menes%, Chest%
  const menesPct = [
    '','20.0%','23.0%','25.0%','26.5%','28.0%','29.5%','30.5%','32.0%','33.0%','34.0%',
    '34.5%','35.5%','36.5%','37.0%','38.0%','38.5%','39.0%','40.0%','40.5%','41.0%',
    '41.5%','42.5%','43.0%','43.5%','44.0%','44.5%','45.0%','45.5%','46.0%','46.5%',
  ];
  for (let i = 1; i <= 30; i++) {
    const chestPct = (100 - parseFloat(menesPct[i])).toFixed(1) + '%';
    GREAT_SPHINX_BONUSES[i] = [
      { type: 'cavalry_damage',  label: cavDmg[i] },
      { type: 'menes_chest',     label: `${menesPct[i]} Menes / ${chestPct} Chest` },
    ];
  }
}

// --- Abu Simbel ---
export const ABU_SIMBEL_BONUSES: BonusArray = {};
{
  const allDmg = COMBAT_BONUS_2;
  const rpSlots = ['','1','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','2','2','3','3','3','3','3','3','3','3','3','3','4'];
  for (let i = 1; i <= 30; i++) {
    ABU_SIMBEL_BONUSES[i] = [
      { type: 'all_damage',      label: allDmg[i] },
      { type: 'research_slot',   label: rpSlots[i] },
    ];
  }
}

// --- Tomb of Mausolus ---
export const TOMB_OF_MAUSOLUS_BONUSES: BonusArray = {};
{
  // Current era goods: 300 + (level-1)*30 → 300..1170
  for (let i = 1; i <= 30; i++) {
    TOMB_OF_MAUSOLUS_BONUSES[i] = [
      { type: 'current_era_goods',  label: `${270 + i * 30}` },
      { type: 'mystery_chest',      label: 'Research/Food chest' },
    ];
  }
}

// --- Lighthouse of Alexandria ---
export const LIGHTHOUSE_BONUSES: BonusArray = {};
{
  const goodsBonus = [
    '','5.0%','7.0%','8.3%','9.4%','10.3%','11.1%','11.8%','12.4%','12.9%','13.5%',
    '14.0%','14.4%','14.8%','15.2%','15.6%','16.0%','16.4%','16.7%','17.0%','17.3%',
    '17.6%','17.9%','18.2%','18.5%','18.7%','19.0%','19.3%','19.5%','19.7%','20.0%',
  ];
  const tradeWorkers = ['','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+3'];
  for (let i = 1; i <= 30; i++) {
    LIGHTHOUSE_BONUSES[i] = [
      { type: 'goods_production',   label: goodsBonus[i] },
      { type: 'trade_worker',       label: tradeWorkers[i] },
    ];
  }
}

// --- Colossus of Rhodes ---
export const COLOSSUS_BONUSES: BonusArray = {};
{
  const gearsBonus = [
    '','5%','9%','12%','15%','17%','18%','19%','20%','21%','22%',
    '23%','24%','25%','26%','27%','28%','29%','30%','31%','32%',
    '33%','34%','35%','36%','37%','38%','39%','40%','41%','42%',
  ];
  const compass = ['','1','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','2','2','3','3','3','3','3','3','3','3','3','3','4'];
  for (let i = 1; i <= 30; i++) {
    COLOSSUS_BONUSES[i] = [
      { type: 'gears_bonus',   label: gearsBonus[i] },
      { type: 'compass',       label: compass[i] },
    ];
  }
}

// ============================================================
// GREAT EMPIRES
// ============================================================

// --- Hagia Sophia ---
export const HAGIA_SOPHIA_BONUSES: BonusArray = {};
{
  const goodsCurrent  = [250,270,290,310,330,350,370,390,410,430,450,470,490,510,530,550,570,590,610,630,650,670,690,710,730,750,770,790,810,830];
  const goodsPrev     = [300,320,340,360,380,400,420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720,740,760,780,800,820,840,860,880];
  for (let i = 1; i <= 30; i++) {
    HAGIA_SOPHIA_BONUSES[i] = [
      { type: 'mystery_chest',        label: 'Research/Coin chest' },
      { type: 'goods_current_prev',   label: `${goodsCurrent[i-1]} current / ${goodsPrev[i-1]} prev` },
    ];
  }
}

// --- Colosseum ---
export const COLOSSEUM_BONUSES: BonusArray = {};
{
  const heavyDmg = COMBAT_BONUS_2;
  const workers  = ['','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+1','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+3'];
  for (let i = 1; i <= 30; i++) {
    COLOSSEUM_BONUSES[i] = [
      { type: 'heavy_infantry_damage', label: heavyDmg[i] },
      { type: 'worker',                label: workers[i] },
    ];
  }
}

// --- Palace of Aachen ---
export const PALACE_OF_AACHEN_BONUSES: BonusArray = {};
{
  const infHP = SMALL_STAT_BONUS;
  for (let i = 1; i <= 30; i++) {
    const pct = parseFloat(RECRUIT_TIME_REDUCTION[i]);
    PALACE_OF_AACHEN_BONUSES[i] = [
      { type: 'infantry_hp',              label: infHP[i] },
      { type: 'infantry_recruit_time',    label: `${RECRUIT_TIME_REDUCTION[i]} (${recruitTimeLabel(pct)})` },
    ];
  }
}

// --- Sherwood Forest ---
export const SHERWOOD_FOREST_BONUSES: BonusArray = {};
{
  const rangedHP = SMALL_STAT_BONUS;
  for (let i = 1; i <= 30; i++) {
    SHERWOOD_FOREST_BONUSES[i] = [
      { type: 'ranged_hp',        label: rangedHP[i] },
      { type: 'mystery_chest',    label: 'Research/Chest' },
    ];
  }
}

// --- Terracotta Army ---
export const TERRACOTTA_ARMY_BONUSES: BonusArray = {};
{
  const heavyHP = SMALL_STAT_BONUS;
  const qinPct  = ['','20.0%','23.0%','25.0%','26.5%','28.0%','29.5%','30.5%','32.0%','33.0%','34.0%','34.5%','35.5%','36.5%','37.0%','38.0%','38.5%','39.0%','40.0%','40.5%','41.0%','41.5%','42.5%','43.0%','43.5%','44.0%','44.5%','45.0%','45.5%','46.0%','46.5%'];
  for (let i = 1; i <= 30; i++) {
    const chestPct = (100 - parseFloat(qinPct[i])).toFixed(1) + '%';
    TERRACOTTA_ARMY_BONUSES[i] = [
      { type: 'heavy_infantry_hp', label: heavyHP[i] },
      { type: 'qin_chest',         label: `${qinPct[i]} Qin / ${chestPct} Chest` },
    ];
  }
}

// --- Forbidden City ---
export const FORBIDDEN_CITY_BONUSES: BonusArray = {};
{
  const chinaGoods = PROD_BONUS_1;
  // Chest: 100 + (level-1)*10 goods
  for (let i = 1; i <= 30; i++) {
    FORBIDDEN_CITY_BONUSES[i] = [
      { type: 'china_goods_production', label: chinaGoods[i] },
      { type: 'goods_chest',            label: `${90 + i * 10}` },
    ];
  }
}

// --- Great Wall ---
export const GREAT_WALL_BONUSES: BonusArray = {};
{
  const allHP   = SMALL_STAT_BONUS;
  const rpSlots = ['','1','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','2','2','3','3','3','3','3','3','3','3','3','3','4'];
  for (let i = 1; i <= 30; i++) {
    GREAT_WALL_BONUSES[i] = [
      { type: 'all_unit_hp',     label: allHP[i] },
      { type: 'research_slot',   label: rpSlots[i] },
    ];
  }
}

// --- Sayil Palace ---
export const SAYIL_PALACE_BONUSES: BonusArray = {};
{
  const bastionHP = SMALL_STAT_BONUS;
  const pakalPct  = ['','20.0%','23.0%','25.0%','26.5%','28.0%','29.5%','30.5%','32.0%','33.0%','34.0%','34.5%','35.5%','36.5%','37.0%','38.0%','38.5%','39.0%','40.0%','40.5%','41.0%','41.5%','42.5%','43.0%','43.5%','44.0%','44.5%','45.0%','45.5%','46.0%','46.5%'];
  for (let i = 1; i <= 30; i++) {
    const chestPct = (100 - parseFloat(pakalPct[i])).toFixed(1) + '%';
    SAYIL_PALACE_BONUSES[i] = [
      { type: 'bastion_hp',    label: bastionHP[i] },
      { type: 'pakal_chest',   label: `${pakalPct[i]} Pakal / ${chestPct} Chest` },
    ];
  }
}

// --- Tikal ---
export const TIKAL_BONUSES: BonusArray = {};
{
  const mayaGoods = PROD_BONUS_1;
  const goodsBonus2 = [
    '','5.0%','6.5%','7.5%','8.2%','9.0%','9.7%','10.2%','11.0%','11.5%','12.0%',
    '12.2%','12.7%','13.2%','13.5%','14.0%','14.2%','14.5%','15.0%','15.3%','15.5%',
    '15.7%','16.2%','16.5%','16.7%','17.0%','17.2%','17.5%','17.7%','18.0%','18.2%',
  ];
  for (let i = 1; i <= 30; i++) {
    TIKAL_BONUSES[i] = [
      { type: 'maya_goods_production',   label: mayaGoods[i] },
      { type: 'goods_production_boost',  label: goodsBonus2[i] },
    ];
  }
}

// --- Chichen Itza ---
export const CHICHEN_ITZA_BONUSES: BonusArray = {};
{
  const critBoost = [
    '','25%','35%','43%','49%','54%','59%','64%','68%','72%','75%',
    '79%','82%','85%','88%','91%','94%','96%','99%','101%','104%',
    '106%','108%','111%','113%','115%','117%','119%','121%','123%','125%',
  ];
  for (let i = 1; i <= 30; i++) {
    const pct = parseFloat(RECRUIT_TIME_REDUCTION[i]);
    CHICHEN_ITZA_BONUSES[i] = [
      { type: 'ranged_crit_boost',   label: critBoost[i] },
      { type: 'maya_recruit_time',   label: `${RECRUIT_TIME_REDUCTION[i]} (${recruitTimeLabel(pct)})` },
    ];
  }
}

// ============================================================
// STORIES AND MYTHS
// ============================================================

// --- Cité de Carcassonne ---
export const CITE_DE_CARCASSONNE_BONUSES: BonusArray = {};
{
  const critBoost = [
    '','30','44','55','65','74','82','89','96','102','108',
    '114','120','126','131','136','141','146','150','155','160',
    '164','168','173','177','181','185','189','193','196','200',
  ];
  for (let i = 1; i <= 30; i++) {
    const pct = parseFloat(RECRUIT_TIME_REDUCTION[i]);
    CITE_DE_CARCASSONNE_BONUSES[i] = [
      { type: 'heavy_infantry_crit_boost',  label: critBoost[i] },
      { type: 'heavy_infantry_recruit',     label: `${RECRUIT_TIME_REDUCTION[i]} (${recruitTimeLabel(pct)})` },
    ];
  }
}

// --- Leaning Tower of Pisa ---
export const LEANING_TOWER_BONUSES: BonusArray = {};
{
  const rpCap = ['','15','16','17','18','20','21','22','23','24','25','26','27','28','29','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','52'];
  // RP regen speed reduction; base 60min cycle
  const regenReductions = [0.10,0.123,0.139,0.152,0.20,0.209,0.217,0.225,0.231,0.238,0.243,0.249,0.254,0.259,0.30,0.305,0.309,0.313,0.317,0.321,0.324,0.328,0.331,0.334,0.338,0.341,0.344,0.347,0.35,0.40];
  for (let i = 1; i <= 30; i++) {
    const pct = regenReductions[i - 1];
    const mins = Math.floor(60 * (1 - pct));
    LEANING_TOWER_BONUSES[i] = [
      { type: 'rp_cap',         label: rpCap[i] },
      { type: 'rp_regen_speed', label: `${Math.floor((1 - pct) * 100 - 100) * -1}% (${mins}m)` },
    ];
  }
}

// --- Alhambra ---
export const ALHAMBRA_BONUSES: BonusArray = {};
{
  const workers = ['','+1','+1','+1','+1','+1','+1','+1','+1','+1','+2','+2','+2','+2','+2','+2','+2','+2','+2','+2','+3','+3','+3','+3','+3','+3','+3','+3','+3','+3','+4'];
  const infCrit = [
    '','40%','60%','77%','91%','104%','116%','127%','137%','147%','157%',
    '166%','174%','183%','191%','199%','207%','214%','222%','229%','236%',
    '243%','250%','256%','263%','269%','276%','282%','288%','294%','300%',
  ];
  for (let i = 1; i <= 30; i++) {
    ALHAMBRA_BONUSES[i] = [
      { type: 'worker',             label: workers[i] },
      { type: 'infantry_crit_hit',  label: infCrit[i] },
    ];
  }
}

// --- Dragonship Ellida ---
export const DRAGONSHIP_ELLIDA_BONUSES: BonusArray = {};
{
  const cavHP = SMALL_STAT_BONUS;
  const tradeCooldowns = [10.0,14.0,16.9,19.3,25.0,26.8,28.4,29.9,31.3,35.0,36.2,37.4,38.5,39.5,45.0,46.0,46.9,47.8,48.7,55.0,55.8,56.6,57.4,58.2,65.0,65.7,66.4,67.1,67.8,75.0];
  for (let i = 1; i <= 30; i++) {
    const pct = tradeCooldowns[i - 1];
    const mins = Math.floor(60 * (1 - pct / 100));
    DRAGONSHIP_ELLIDA_BONUSES[i] = [
      { type: 'cavalry_hp',              label: cavHP[i] },
      { type: 'trade_slot_cooldown',     label: `${pct}% (${mins}m)` },
    ];
  }
}

// --- Valhalla ---
export const VALHALLA_BONUSES: BonusArray = {};
{
  const allDmg = [
    '','5.00%','5.55%','6.00%','6.36%','6.64%','6.92%','7.16%','7.36%','7.56%','7.76%',
    '7.92%','8.12%','8.28%','8.40%','8.56%','8.72%','8.84%','8.96%','9.12%','9.24%',
    '9.36%','9.48%','9.60%','9.68%','9.80%','9.92%','10.00%','10.12%','10.20%','10.32%',
  ];
  const ragnarPct = ['','20%','23%','25%','26.5%','28%','29.5%','30.5%','32%','33%','34%','34.5%','35.5%','36.5%','37%','38%','38.5%','39%','40%','40.5%','41%','41.5%','42.5%','43%','43.5%','44%','44.5%','45%','45.5%','46%','46.5%'];
  for (let i = 1; i <= 30; i++) {
    const chestPct = (100 - parseFloat(ragnarPct[i])).toFixed(1) + '%';
    VALHALLA_BONUSES[i] = [
      { type: 'all_unit_damage',   label: allDmg[i] },
      { type: 'ragnar_chest',      label: `${ragnarPct[i]} Ragnar / ${chestPct} Chest` },
    ];
  }
}

// --- Yggdrasil ---
export const YGGDRASIL_BONUSES: BonusArray = {};
{
  const meadGoods = PROD_BONUS_1;
  // Food chest: 20%→50% customisation chest, remainder food (15k per level step)
  const customPct = [20,20,20,20,25,25,25,25,25,30,30,30,30,30,35,35,35,35,35,40,40,40,40,40,45,45,45,45,45,50];
  for (let i = 1; i <= 30; i++) {
    const foodAmt = i * 15000;
    YGGDRASIL_BONUSES[i] = [
      { type: 'food_customisation_chest', label: `${customPct[i-1]}% custom / ${100-customPct[i-1]}% food (${foodAmt.toLocaleString()})` },
      { type: 'mead_goods_production',    label: meadGoods[i] },
    ];
  }
}

// --- Petra ---
export const PETRA_BONUSES: BonusArray = {};
{
  const arabiaGoods = PROD_BONUS_1;
  const goodsBonus2 = [
    '','5.0%','6.5%','7.5%','8.2%','9.0%','9.7%','10.2%','11.0%','11.5%','12.0%',
    '12.2%','12.7%','13.2%','13.5%','14.0%','14.2%','14.5%','15.0%','15.3%','15.5%',
    '15.7%','16.2%','16.5%','16.7%','17.0%','17.2%','17.5%','17.7%','18.0%','18.2%',
  ];
  const arabiaWorkers = ['','+1','+1','+1','+1','+2','+2','+2','+2','+2','+3','+3','+3','+3','+3','+4','+4','+4','+4','+4','+5','+5','+5','+5','+5','+6','+6','+6','+6','+6','+7'];
  for (let i = 1; i <= 30; i++) {
    PETRA_BONUSES[i] = [
      { type: 'arabia_goods_production', label: arabiaGoods[i] },
      { type: 'goods_boost',             label: goodsBonus2[i] },
      { type: 'arabia_worker',           label: arabiaWorkers[i] },
    ];
  }
}

// --- City of Brass ---
export const CITY_OF_BRASS_BONUSES: BonusArray = {};
{
  const cavHitRate = [
    '','25%','35%','43%','49%','54%','59%','64%','68%','72%','75%',
    '79%','82%','85%','88%','91%','94%','96%','99%','101%','104%',
    '106%','108%','111%','113%','115%','117%','119%','121%','123%','125%',
  ];
  const bazaarBoost = [
    '','15%','21%','25%','29%','31%','34%','36%','38%','39%','41%',
    '42%','43%','44%','45%','46%','47%','48%','49%','50%','51%',
    '52%','53%','54%','55%','56%','57%','58%','59%','60%','60%',
  ];
  for (let i = 1; i <= 30; i++) {
    CITY_OF_BRASS_BONUSES[i] = [
      { type: 'cavalry_hit_rate',  label: cavHitRate[i] },
      { type: 'bazaar_offer_boost', label: bazaarBoost[i] },
    ];
  }
}
