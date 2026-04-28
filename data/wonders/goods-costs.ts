// ============================================================
// ROC Helper – World Wonders: Goods Cost Tables
//
// Each Wonder slot type has its own goods costs.
// Capital City uses generic era-progression goods;
// allied slots use culture-specific goods icons.
//
// Source: Capital_Goods[], Egypt_Goods[], China_Goods[],
//         Maya_Goods[], Viking_Goods[], Arabia_Goods[]
//         in the three Lua module files.
//
// NOTE: Era codes (BA, ME, CG…) used in Capital_Goods map to
//       game eras. They are stored as icon keys here so the UI
//       can render the correct icon without needing a runtime
//       era-resolver (which depends on the player's current era).
//       The UI layer is responsible for resolving era-generic
//       icons to actual goods icons when the player's era is known.
// ============================================================

import type { GoodsEntry } from './types';

// --------------- Helper ---------------

/** Convenience builder for a GoodsEntry. */
function g(iconKey: string, amount: number, gears: number): GoodsEntry {
  return { iconKey, amount, gears };
}

// ============================================================
// CAPITAL CITY – generic era goods
// (Ancient World module – used by: Stonehenge, Hanging Gardens,
//  Statue of Zeus, Temple of Artemis, Tomb of Mausolus,
//  Lighthouse of Alexandria, Colossus of Rhodes, Carcassonne)
//
// Era progression: BA → ME → CG (levels 1–30)
// Icon keys: `primary|secondary|tertiary_<era_lowercase>` — UI resolves to actual goods names/icons.
// ============================================================

/**
 * Capital City goods costs from the Ancient World module.
 * The icon keys follow the pattern `rank_era` (e.g. "primary_ba").
 * The UI must translate these to actual goods names / icons for the
 * player's current era context.
 */
export const AW_CAPITAL_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('primary_ba', 100, 8)],
  3:  [g('primary_ba', 100, 8)],
  4:  [g('primary_ba', 200, 15)],
  5:  [g('primary_ba', 200, 15), g('secondary_ba', 100, 8)],
  6:  [g('primary_ba', 200, 15), g('secondary_ba', 200, 15), g('tertiary_ba', 100, 8)],
  7:  [g('primary_ba', 200, 15), g('secondary_ba', 200, 15), g('tertiary_ba', 200, 15)],
  8:  [g('primary_ba', 500, 20), g('secondary_ba', 200, 15), g('tertiary_ba', 200, 15)],
  9:  [g('primary_ba', 500, 20), g('secondary_ba', 500, 20), g('tertiary_ba', 200, 15)],
  10: [g('primary_ba', 500, 20), g('secondary_ba', 500, 20), g('tertiary_ba', 500, 20)],
  11: [g('primary_ba', 1000, 25), g('secondary_ba', 500, 20), g('tertiary_ba', 500, 20)],
  12: [g('primary_me', 1000, 25), g('secondary_me', 500, 20), g('tertiary_me', 500, 20)],
  13: [g('primary_me', 1000, 25), g('secondary_me', 1000, 25), g('tertiary_me', 500, 20)],
  14: [g('primary_me', 1000, 25), g('secondary_me', 1000, 25), g('tertiary_me', 500, 20)],
  15: [g('primary_me', 1000, 25), g('secondary_me', 1000, 25), g('tertiary_me', 1000, 25)],
  16: [g('primary_me', 1000, 25), g('secondary_me', 1000, 25), g('tertiary_me', 1000, 25)],
  17: [g('primary_me', 2000, 30), g('secondary_me', 1000, 25), g('tertiary_me', 1000, 25)],
  18: [g('primary_me', 2000, 30), g('secondary_me', 1000, 25), g('tertiary_me', 1000, 25)],
  19: [g('primary_me', 2000, 30), g('secondary_me', 1000, 25), g('tertiary_me', 1000, 25)],
  20: [g('primary_me', 2000, 30), g('secondary_me', 2000, 30), g('tertiary_me', 1000, 25)],
  21: [g('primary_me', 2000, 30), g('secondary_me', 2000, 30), g('tertiary_me', 1000, 25)],
  22: [g('primary_cg', 2000, 30), g('secondary_cg', 2000, 30), g('tertiary_cg', 1000, 25)],
  23: [g('primary_cg', 2000, 30), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  24: [g('primary_cg', 2000, 30), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  25: [g('primary_cg', 2000, 30), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  26: [g('primary_cg', 2000, 30), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  27: [g('primary_cg', 3000, 40), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  28: [g('primary_cg', 3000, 40), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  29: [g('primary_cg', 3000, 40), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
  30: [g('primary_cg', 3000, 40), g('secondary_cg', 2000, 30), g('tertiary_cg', 2000, 30)],
};

// ============================================================
// CAPITAL CITY – Great Empires module
// (Used by: Hagia Sophia, Colosseum, Palace of Aachen,
//  Sherwood Forest – eras ER → RE → BE)
// ============================================================

export const GE_CAPITAL_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('primary_er', 100, 8), g('secondary_er', 100, 8)],
  3:  [g('primary_er', 200, 15), g('secondary_er', 100, 8)],
  4:  [g('primary_er', 200, 15), g('secondary_er', 100, 8), g('tertiary_er', 100, 8)],
  5:  [g('primary_er', 200, 15), g('secondary_er', 200, 15), g('tertiary_er', 100, 8)],
  6:  [g('primary_er', 500, 20), g('secondary_er', 200, 15), g('tertiary_er', 100, 8)],
  7:  [g('primary_er', 500, 20), g('secondary_er', 200, 15), g('tertiary_er', 200, 15)],
  8:  [g('primary_er', 500, 20), g('secondary_er', 500, 20), g('tertiary_er', 200, 15)],
  9:  [g('primary_er', 500, 20), g('secondary_er', 500, 20), g('tertiary_er', 200, 15)],
  10: [g('primary_er', 500, 20), g('secondary_er', 500, 20), g('tertiary_er', 500, 20)],
  11: [g('primary_er', 1000, 25), g('secondary_er', 500, 20), g('tertiary_er', 500, 20)],
  12: [g('primary_re', 1000, 25), g('secondary_re', 500, 20), g('tertiary_re', 500, 20)],
  13: [g('primary_re', 1000, 25), g('secondary_re', 1000, 25), g('tertiary_re', 500, 20)],
  14: [g('primary_re', 1000, 25), g('secondary_re', 1000, 25), g('tertiary_re', 500, 20)],
  15: [g('primary_re', 1000, 25), g('secondary_re', 1000, 25), g('tertiary_re', 1000, 25)],
  16: [g('primary_re', 1000, 25), g('secondary_re', 1000, 25), g('tertiary_re', 1000, 25)],
  17: [g('primary_re', 2000, 30), g('secondary_re', 1000, 25), g('tertiary_re', 1000, 25)],
  18: [g('primary_re', 2000, 30), g('secondary_re', 1000, 25), g('tertiary_re', 1000, 25)],
  19: [g('primary_re', 2000, 30), g('secondary_re', 1000, 25), g('tertiary_re', 1000, 25)],
  20: [g('primary_re', 2000, 30), g('secondary_re', 2000, 30), g('tertiary_re', 1000, 25)],
  21: [g('primary_re', 2000, 30), g('secondary_re', 2000, 30), g('tertiary_re', 1000, 25)],
  22: [g('primary_be', 2000, 30), g('secondary_be', 2000, 30), g('tertiary_be', 2000, 30)],
  23: [g('primary_be', 2000, 30), g('secondary_be', 2000, 30), g('tertiary_be', 2000, 30)],
  24: [g('primary_be', 2000, 30), g('secondary_be', 2000, 30), g('tertiary_be', 2000, 30)],
  25: [g('primary_be', 3000, 40), g('secondary_be', 2000, 30), g('tertiary_be', 2000, 30)],
  26: [g('primary_be', 3000, 40), g('secondary_be', 2000, 30), g('tertiary_be', 2000, 30)],
  27: [g('primary_be', 3000, 40), g('secondary_be', 3000, 40), g('tertiary_be', 2000, 30)],
  28: [g('primary_be', 3000, 40), g('secondary_be', 3000, 40), g('tertiary_be', 2000, 30)],
  29: [g('primary_be', 3000, 40), g('secondary_be', 3000, 40), g('tertiary_be', 3000, 40)],
  30: [g('primary_be', 3000, 40), g('secondary_be', 3000, 40), g('tertiary_be', 3000, 40)],
};

// ============================================================
// EGYPT slot goods
// (Used by: Cheops Pyramid, Great Sphinx, Abu Simbel)
// ============================================================

export const EGYPT_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('papyrus_scroll', 50, 5), g('ankh', 50, 5)],
  3:  [g('papyrus_scroll', 100, 8), g('ankh', 50, 5)],
  4:  [g('papyrus_scroll', 100, 8), g('ankh', 100, 8)],
  5:  [g('papyrus_scroll', 200, 15), g('ankh', 100, 8)],
  6:  [g('papyrus_scroll', 200, 15), g('ankh', 200, 15)],
  7:  [g('papyrus_scroll', 200, 15), g('ankh', 200, 15)],
  8:  [g('papyrus_scroll', 500, 20), g('ankh', 200, 15)],
  9:  [g('papyrus_scroll', 500, 20), g('ankh', 500, 20)],
  10: [g('papyrus_scroll', 500, 20), g('ankh', 500, 20)],
  11: [g('papyrus_scroll', 500, 20), g('ankh', 500, 20)],
  12: [g('papyrus_scroll', 1000, 25), g('ankh', 500, 20)],
  13: [g('papyrus_scroll', 1000, 25), g('ankh', 1000, 25)],
  14: [g('papyrus_scroll', 1000, 25), g('ankh', 1000, 25)],
  15: [g('papyrus_scroll', 1000, 25), g('ankh', 1000, 25)],
  16: [g('papyrus_scroll', 1000, 25), g('ankh', 1000, 25), g('ceremonial_dress', 50, 0), g('golden_mask', 50, 5)],
  17: [g('papyrus_scroll', 1000, 25), g('ankh', 1000, 25), g('ceremonial_dress', 100, 8), g('golden_mask', 50, 5)],
  18: [g('papyrus_scroll', 2000, 30), g('ankh', 1000, 25), g('ceremonial_dress', 100, 8), g('golden_mask', 100, 8)],
  19: [g('papyrus_scroll', 2000, 30), g('ankh', 2000, 30), g('ceremonial_dress', 200, 15), g('golden_mask', 100, 8)],
  20: [g('papyrus_scroll', 2000, 30), g('ankh', 2000, 30), g('ceremonial_dress', 200, 15), g('golden_mask', 200, 15)],
  21: [g('papyrus_scroll', 2000, 30), g('ankh', 2000, 30), g('ceremonial_dress', 500, 20), g('golden_mask', 200, 15)],
  22: [g('papyrus_scroll', 2000, 30), g('ankh', 2000, 30), g('ceremonial_dress', 500, 20), g('golden_mask', 500, 20)],
  23: [g('papyrus_scroll', 2000, 30), g('ankh', 2000, 30), g('ceremonial_dress', 500, 20), g('golden_mask', 500, 20)],
  24: [g('papyrus_scroll', 2000, 30), g('ankh', 2000, 30), g('ceremonial_dress', 1000, 25), g('golden_mask', 500, 20)],
  25: [g('papyrus_scroll', 3000, 40), g('ankh', 2000, 30), g('ceremonial_dress', 1000, 25), g('golden_mask', 1000, 25)],
  26: [g('papyrus_scroll', 3000, 40), g('ankh', 3000, 40), g('ceremonial_dress', 1000, 25), g('golden_mask', 1000, 25)],
  27: [g('papyrus_scroll', 3000, 40), g('ankh', 3000, 40), g('ceremonial_dress', 2000, 30), g('golden_mask', 1000, 25)],
  28: [g('papyrus_scroll', 3000, 40), g('ankh', 3000, 40), g('ceremonial_dress', 2000, 30), g('golden_mask', 2000, 30)],
  29: [g('papyrus_scroll', 3000, 40), g('ankh', 3000, 40), g('ceremonial_dress', 3000, 40), g('golden_mask', 2000, 30)],
  30: [g('papyrus_scroll', 3000, 40), g('ankh', 3000, 40), g('ceremonial_dress', 3000, 40), g('golden_mask', 3000, 40)],
};

// ============================================================
// CHINA slot goods
// (Used by: Terracotta Army, Forbidden City, Great Wall)
// NOTE: The Lua source has a data entry bug at levels 8–9 and
// 21–22 ("50 (5)0 (20)" string concatenation error).
// The values below are corrected to 500 (which is the intended
// amount based on the progression pattern).
// ============================================================

export const CHINA_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('silk_threads', 50, 5), g('silk', 50, 5)],
  3:  [g('silk_threads', 100, 8), g('silk', 50, 5)],
  4:  [g('silk_threads', 100, 8), g('silk', 100, 8)],
  5:  [g('silk_threads', 200, 15), g('silk', 100, 8)],
  6:  [g('silk_threads', 200, 15), g('silk', 200, 15)],
  7:  [g('silk_threads', 200, 15), g('silk', 200, 15)],
  8:  [g('silk_threads', 500, 20), g('silk', 200, 15)],   // corrected from Lua bug
  9:  [g('silk_threads', 500, 20), g('silk', 500, 20)],   // corrected from Lua bug
  10: [g('silk_threads', 500, 20), g('silk', 500, 20)],
  11: [g('silk_threads', 1000, 25), g('silk', 500, 20)],
  12: [g('silk_threads', 1000, 25), g('silk', 1000, 25)],
  13: [g('silk_threads', 1000, 25), g('silk', 1000, 25), g('clay', 50, 5)],
  14: [g('silk_threads', 2000, 30), g('silk', 1000, 25)],
  15: [g('silk_threads', 2000, 30), g('silk', 1000, 25), g('clay', 50, 5)],
  16: [g('silk_threads', 2000, 30), g('silk', 1000, 25), g('clay', 50, 5), g('porcelain', 50, 5)],
  17: [g('silk_threads', 2000, 30), g('silk', 1000, 25), g('clay', 100, 8), g('porcelain', 50, 5)],
  18: [g('silk_threads', 2000, 30), g('silk', 1000, 25), g('clay', 100, 8), g('porcelain', 100, 8)],
  19: [g('silk_threads', 2000, 30), g('silk', 2000, 30), g('clay', 200, 15), g('porcelain', 100, 8)],
  20: [g('silk_threads', 2000, 30), g('silk', 2000, 30), g('clay', 200, 15), g('porcelain', 200, 15)],
  21: [g('silk_threads', 2000, 30), g('silk', 2000, 30), g('clay', 500, 20), g('porcelain', 200, 15)], // corrected
  22: [g('silk_threads', 2000, 30), g('silk', 2000, 30), g('clay', 500, 20), g('porcelain', 500, 20)], // corrected
  23: [g('silk_threads', 2000, 30), g('silk', 2000, 30), g('clay', 1000, 25), g('porcelain', 500, 20)],
  24: [g('silk_threads', 2000, 30), g('silk', 2000, 30), g('clay', 1000, 25), g('porcelain', 1000, 25)],
  25: [g('silk_threads', 3000, 40), g('silk', 2000, 30), g('clay', 1000, 25), g('porcelain', 1000, 25)],
  26: [g('silk_threads', 3000, 40), g('silk', 3000, 40), g('clay', 1000, 25), g('porcelain', 1000, 25)],
  27: [g('silk_threads', 3000, 40), g('silk', 3000, 40), g('clay', 2000, 30), g('porcelain', 1000, 25)],
  28: [g('silk_threads', 3000, 40), g('silk', 3000, 40), g('clay', 2000, 30), g('porcelain', 2000, 30)],
  29: [g('silk_threads', 3000, 40), g('silk', 3000, 40), g('clay', 3000, 40), g('porcelain', 2000, 30)],
  30: [g('silk_threads', 3000, 40), g('silk', 3000, 40), g('clay', 3000, 40), g('porcelain', 3000, 40)],
};

// ============================================================
// MAYA slot goods
// (Used by: Sayil Palace, Tikal, Chichen Itza)
// ============================================================

export const MAYA_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('Ancestor Mask', 200, 15), g('Calendar Stone', 200, 15)],
  3:  [g('Ancestor Mask', 200, 15), g('Calendar Stone', 200, 15)],
  4:  [g('Ancestor Mask', 500, 20), g('Calendar Stone', 200, 15)],
  5:  [g('Ancestor Mask', 500, 20), g('Calendar Stone', 500, 20)],
  6:  [g('Ancestor Mask', 500, 20), g('Calendar Stone', 500, 20)],
  7:  [g('Ancestor Mask', 500, 20), g('Calendar Stone', 500, 20)],
  8:  [g('Ancestor Mask', 1000, 25), g('Calendar Stone', 500, 20)],
  9:  [g('Ancestor Mask', 1000, 25), g('Calendar Stone', 1000, 25)],
  10: [g('Ancestor Mask', 1000, 25), g('Calendar Stone', 1000, 25)],
  11: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 1000, 25)],
  12: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 1000, 25)],
  13: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 1000, 25), g('Headdress', 200, 15)],
  14: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 200, 15)],
  15: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 500, 20)],
  16: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 500, 20), g('Ritual Dagger', 500, 20)],
  17: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 500, 20), g('Ritual Dagger', 500, 20)],
  18: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 500, 20), g('Ritual Dagger', 500, 20)],
  19: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 1000, 25), g('Ritual Dagger', 500, 20)],
  20: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 1000, 25), g('Ritual Dagger', 500, 20)],
  21: [g('Ancestor Mask', 2000, 30), g('Calendar Stone', 2000, 30), g('Headdress', 1000, 25), g('Ritual Dagger', 1000, 25)],
  22: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 2000, 30), g('Headdress', 1000, 25), g('Ritual Dagger', 1000, 25)],
  23: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 2000, 30), g('Ritual Dagger', 1000, 25)],
  24: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 2000, 30), g('Ritual Dagger', 1000, 25)],
  25: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 3000, 40), g('Ritual Dagger', 2000, 30)],
  26: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 3000, 40), g('Ritual Dagger', 2000, 30)],
  27: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 3000, 40), g('Ritual Dagger', 3000, 40), g('Ancestor Mask', 1000, 25)],
  28: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 3000, 40), g('Ritual Dagger', 3000, 40), g('Calendar Stone', 2000, 30)],
  29: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 3000, 40), g('Ritual Dagger', 3000, 40), g('Headdress', 2000, 30)],
  30: [g('Ancestor Mask', 3000, 40), g('Calendar Stone', 3000, 40), g('Headdress', 3000, 40), g('Ritual Dagger', 3000, 40), g('Ritual Dagger', 3000, 40)],
};

// ============================================================
// VIKING KINGDOM slot goods
// (Used by: Yggdrasil, Dragonship Ellida, Valhalla)
// ============================================================

export const VIKING_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('Ceramic Treasure', 900, 6), g('Gold Treasure', 600, 8)],
  3:  [g('Ceramic Treasure', 950, 8), g('Gold Treasure', 700, 8)],
  4:  [g('Ceramic Treasure', 1000, 10), g('Gold Treasure', 750, 8)],
  5:  [g('Ceramic Treasure', 1200, 16), g('Gold Treasure', 800, 8)],
  6:  [g('Ceramic Treasure', 1300, 18), g('Gold Treasure', 850, 8)],
  7:  [g('Ceramic Treasure', 1400, 21), g('Gold Treasure', 900, 9)],
  8:  [g('Ceramic Treasure', 1500, 23), g('Gold Treasure', 950, 12)],
  9:  [g('Ceramic Treasure', 1600, 25), g('Gold Treasure', 1000, 14)],
  10: [g('Ceramic Treasure', 1700, 27), g('Gold Treasure', 1100, 19)],
  11: [g('Ceramic Treasure', 1850, 30), g('Gold Treasure', 1200, 23)],
  12: [g('Ceramic Treasure', 2000, 32), g('Gold Treasure', 1300, 27)],
  13: [g('Ceramic Treasure', 2150, 35), g('Gold Treasure', 1400, 31)],
  14: [g('Ceramic Treasure', 2300, 37), g('Gold Treasure', 1500, 34)],
  15: [g('Ceramic Treasure', 2450, 39), g('Gold Treasure', 1600, 37), g('Spice Treasure', 1500, 16), g('Jewel Treasure', 300, 15)],
  16: [g('Ceramic Treasure', 2650, 41), g('Gold Treasure', 1700, 40), g('Spice Treasure', 1400, 14), g('Jewel Treasure', 300, 15)],
  17: [g('Ceramic Treasure', 2850, 44), g('Gold Treasure', 1850, 44), g('Spice Treasure', 1600, 17), g('Jewel Treasure', 350, 15)],
  18: [g('Ceramic Treasure', 3050, 46), g('Gold Treasure', 2000, 48), g('Spice Treasure', 1850, 20), g('Jewel Treasure', 400, 15)],
  19: [g('Ceramic Treasure', 3300, 49), g('Gold Treasure', 2150, 52), g('Spice Treasure', 2150, 24), g('Jewel Treasure', 450, 15)],
  20: [g('Ceramic Treasure', 3550, 51), g('Gold Treasure', 2300, 55), g('Spice Treasure', 2500, 27), g('Jewel Treasure', 500, 15)],
  21: [g('Ceramic Treasure', 3800, 53), g('Gold Treasure', 2450, 58), g('Spice Treasure', 2800, 29), g('Jewel Treasure', 600, 15)],
  22: [g('Ceramic Treasure', 4100, 56), g('Gold Treasure', 2650, 62), g('Spice Treasure', 3200, 32), g('Jewel Treasure', 700, 15)],
  23: [g('Ceramic Treasure', 4400, 58), g('Gold Treasure', 2850, 66), g('Spice Treasure', 3700, 36), g('Jewel Treasure', 800, 15)],
  24: [g('Ceramic Treasure', 4750, 60), g('Gold Treasure', 3050, 69), g('Spice Treasure', 4250, 39), g('Jewel Treasure', 900, 18)],
  25: [g('Ceramic Treasure', 5100, 63), g('Gold Treasure', 3300, 73), g('Spice Treasure', 5000, 42), g('Jewel Treasure', 1100, 38)],
  26: [g('Ceramic Treasure', 5500, 65), g('Gold Treasure', 3550, 76), g('Spice Treasure', 5650, 45), g('Jewel Treasure', 1200, 47)],
  27: [g('Ceramic Treasure', 5900, 67), g('Gold Treasure', 3800, 80), g('Spice Treasure', 6500, 48), g('Jewel Treasure', 1400, 62)],
  28: [g('Ceramic Treasure', 6350, 70), g('Gold Treasure', 4100, 83), g('Spice Treasure', 7450, 51), g('Jewel Treasure', 1600, 75)],
  29: [g('Ceramic Treasure', 6850, 72), g('Gold Treasure', 4400, 87), g('Spice Treasure', 8550, 54), g('Jewel Treasure', 1850, 89)],
  30: [g('Ceramic Treasure', 7350, 75), g('Gold Treasure', 5100, 94), g('Spice Treasure', 10000, 58), g('Jewel Treasure', 2500, 118)],
};

// ============================================================
// ARABIA slot goods
// (Used by: Petra, City of Brass)
// ============================================================

export const ARABIA_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('Coffee', 200, 15), g('Incense', 200, 15)],
  3:  [g('Coffee', 200, 15), g('Incense', 200, 15)],
  4:  [g('Coffee', 500, 20), g('Incense', 200, 15)],
  5:  [g('Coffee', 500, 20), g('Incense', 500, 20)],
  6:  [g('Coffee', 500, 20), g('Incense', 500, 20)],
  7:  [g('Coffee', 500, 20), g('Incense', 500, 20)],
  8:  [g('Coffee', 1000, 25), g('Incense', 500, 20)],
  9:  [g('Coffee', 1000, 25), g('Incense', 1000, 25)],
  10: [g('Coffee', 1000, 25), g('Incense', 1000, 25)],
  11: [g('Coffee', 2000, 30), g('Incense', 1000, 25)],
  12: [g('Coffee', 2000, 30), g('Incense', 1000, 25)],
  13: [g('Coffee', 2000, 30), g('Incense', 1000, 25), g('Oil Lamp', 200, 15)],
  14: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 200, 15)],
  15: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 500, 20)],
  16: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 500, 20), g('Carpet', 500, 20)],
  17: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 500, 20), g('Carpet', 500, 20)],
  18: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 500, 20), g('Carpet', 500, 20)],
  19: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 1000, 25), g('Carpet', 500, 20)],
  20: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 1000, 25), g('Carpet', 500, 20)],
  21: [g('Coffee', 2000, 30), g('Incense', 2000, 30), g('Oil Lamp', 1000, 25), g('Carpet', 1000, 25)],
  22: [g('Coffee', 3000, 40), g('Incense', 2000, 30), g('Oil Lamp', 1000, 25), g('Carpet', 1000, 25)],
  23: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 2000, 30), g('Carpet', 1000, 25)],
  24: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 2000, 30), g('Carpet', 1000, 25)],
  25: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 3000, 40), g('Carpet', 2000, 30)],
  26: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 3000, 40), g('Carpet', 2000, 30)],
  27: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 3000, 40), g('Carpet', 3000, 40)],
  28: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 3000, 40), g('Carpet', 3000, 40)],
  29: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 3000, 40), g('Carpet', 3000, 40)],
  30: [g('Coffee', 3000, 40), g('Incense', 3000, 40), g('Oil Lamp', 3000, 40), g('Carpet', 3000, 40)],
};

// ============================================================
// Stories & Myths – Capital City goods  (ER → RE → BE → AF → FA → IE → KS)
// Used by: Cité de Carcassonne, Leaning Tower of Pisa, Alhambra
// These are the "goods_requirements" from module-stories-and-myths.lua
// with quantity × count (the Lua has "1 x 400" style notation)
// Stored here as individual GoodsEntry items for summing support.
// ============================================================

export const SM_CAPITAL_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('primary_er', 400, 15), g('secondary_er', 300, 10)],
  3:  [g('primary_er', 800, 25), g('secondary_er', 550, 20)],
  4:  [g('primary_er', 900, 30), g('secondary_er', 650, 20), g('tertiary_er', 650, 20)],
  5:  [g('primary_re', 1250, 40), g('secondary_re', 850, 25), g('tertiary_re', 850, 25)],
  6:  [g('primary_re', 1600, 50), g('secondary_re', 1100, 35), g('tertiary_re', 1100, 35)],
  7:  [g('primary_re', 2000, 65), g('secondary_re', 1300, 40), g('tertiary_re', 1300, 40)],
  8:  [g('primary_re', 2400, 75), g('secondary_re', 1600, 50), g('tertiary_re', 1600, 50)],
  9:  [g('primary_re', 2700, 85), g('secondary_re', 1900, 60), g('tertiary_re', 1900, 60)],
  10: [g('primary_be', 3100, 100), g('secondary_be', 2100, 65), g('tertiary_be', 2100, 65)],
  11: [g('primary_be', 1700, 55), g('primary_be', 1700, 55), g('secondary_be', 1200, 40), g('secondary_be', 1200, 40), g('tertiary_be', 1200, 40), g('tertiary_be', 1200, 40)],
  12: [g('primary_be', 1900, 60), g('primary_be', 1900, 60), g('secondary_be', 1300, 40), g('secondary_be', 1300, 40), g('tertiary_be', 1300, 40), g('tertiary_be', 1300, 40)],
  13: [g('primary_be', 2200, 70), g('primary_be', 2200, 70), g('secondary_be', 4500, 145), g('secondary_be', 4500, 145), g('tertiary_be', 1400, 45), g('tertiary_be', 1400, 45)],
  14: [g('primary_be', 2300, 75), g('primary_be', 2300, 75), g('secondary_be', 1600, 50), g('secondary_be', 1600, 50), g('tertiary_be', 1600, 50), g('tertiary_be', 1600, 50)],
  15: [g('primary_af', 2500, 80), g('primary_af', 2500, 80), g('secondary_af', 1700, 55), g('secondary_af', 1700, 55), g('tertiary_af', 1800, 60), g('tertiary_af', 1800, 60)],
  16: [g('primary_af', 2800, 90), g('primary_af', 2800, 90), g('secondary_af', 1800, 60), g('secondary_af', 1800, 60), g('tertiary_af', 1900, 60), g('tertiary_af', 1900, 60)],
  17: [g('primary_af', 3000, 95), g('primary_af', 3000, 95), g('secondary_af', 2000, 65), g('secondary_af', 2000, 65), g('tertiary_af', 2000, 65), g('tertiary_af', 2000, 65)],
  18: [g('primary_af', 3000, 95), g('primary_af', 3000, 95), g('secondary_af', 2200, 70), g('secondary_af', 2200, 70), g('tertiary_af', 2200, 70), g('tertiary_af', 2200, 70)],
  19: [g('primary_af', 3250, 105), g('primary_af', 3250, 105), g('secondary_af', 2300, 75), g('secondary_af', 2300, 75), g('tertiary_af', 2300, 75), g('tertiary_af', 2300, 75)],
  20: [g('primary_fa', 3500, 110), g('primary_fa', 3500, 110), g('secondary_fa', 2500, 80), g('secondary_fa', 2500, 80), g('tertiary_fa', 2500, 80), g('tertiary_fa', 2500, 80)],
  21: [g('primary_fa', 3700, 120), g('primary_fa', 3700, 120), g('secondary_fa', 2500, 80), g('secondary_fa', 2500, 80), g('tertiary_fa', 2500, 80), g('tertiary_fa', 2500, 80)],
  22: [g('primary_fa', 4000, 130), g('primary_fa', 4000, 130), g('secondary_fa', 2800, 90), g('secondary_fa', 2800, 90), g('tertiary_fa', 2800, 90), g('tertiary_fa', 2800, 90)],
  23: [g('primary_fa', 4000, 130), g('primary_fa', 4000, 130), g('secondary_fa', 2900, 95), g('secondary_fa', 2900, 95), g('tertiary_fa', 2900, 95), g('tertiary_fa', 2900, 95)],
  24: [g('primary_fa', 4300, 140), g('primary_fa', 4300, 140), g('secondary_fa', 3000, 95), g('secondary_fa', 3000, 95), g('tertiary_fa', 3000, 95), g('tertiary_fa', 3000, 95)],
  25: [g('primary_ie', 4500, 145), g('primary_ie', 4500, 145), g('secondary_ie', 3200, 100), g('secondary_ie', 3200, 100), g('tertiary_ie', 3300, 105), g('tertiary_ie', 3300, 105)],
  26: [g('primary_ie', 4800, 155), g('primary_ie', 4800, 155), g('secondary_ie', 3200, 100), g('secondary_ie', 3200, 100), g('tertiary_ie', 3300, 105), g('tertiary_ie', 3300, 105)],
  27: [g('primary_ie', 5000, 160), g('primary_ie', 5000, 160), g('secondary_ie', 3500, 110), g('secondary_ie', 3500, 110), g('tertiary_ie', 3500, 110), g('tertiary_ie', 3500, 110)],
  28: [g('primary_ie', 5300, 170), g('primary_ie', 5300, 170), g('secondary_ie', 3500, 110), g('secondary_ie', 3500, 110), g('tertiary_ie', 3500, 110), g('tertiary_ie', 3500, 110)],
  29: [g('primary_ie', 5500, 175), g('primary_ie', 5500, 175), g('secondary_ie', 3800, 120), g('secondary_ie', 3800, 120), g('tertiary_ie', 3800, 120), g('tertiary_ie', 3800, 120)],
  30: [g('primary_ks', 6000, 190), g('primary_ks', 6000, 190), g('secondary_ks', 3800, 120), g('secondary_ks', 3800, 120), g('tertiary_ks', 3800, 120), g('tertiary_ks', 3800, 120)],
};