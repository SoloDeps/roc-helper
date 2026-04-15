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
// Icon keys reference era + slot codes so UI can resolve them.
// ============================================================

/**
 * Capital City goods costs from the Ancient World module.
 * The icon keys follow the pattern `era_goodsSlot` (e.g. "BA_GOODS1").
 * The UI must translate these to actual goods names / icons for the
 * player's current era context.
 */
export const AW_CAPITAL_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('BA_GOODS1', 100, 8)],
  3:  [g('BA_GOODS1', 100, 8)],
  4:  [g('BA_GOODS1', 200, 15)],
  5:  [g('BA_GOODS1', 200, 15), g('BA_GOODS2', 100, 8)],
  6:  [g('BA_GOODS1', 200, 15), g('BA_GOODS2', 200, 15), g('BA_GOODS3', 100, 8)],
  7:  [g('BA_GOODS1', 200, 15), g('BA_GOODS2', 200, 15), g('BA_GOODS3', 200, 15)],
  8:  [g('BA_GOODS1', 500, 20), g('BA_GOODS2', 200, 15), g('BA_GOODS3', 200, 15)],
  9:  [g('BA_GOODS1', 500, 20), g('BA_GOODS2', 500, 20), g('BA_GOODS3', 200, 15)],
  10: [g('BA_GOODS1', 500, 20), g('BA_GOODS2', 500, 20), g('BA_GOODS3', 500, 20)],
  11: [g('BA_GOODS1', 1000, 25), g('BA_GOODS2', 500, 20), g('BA_GOODS3', 500, 20)],
  12: [g('ME_GOODS1', 1000, 25), g('ME_GOODS2', 500, 20), g('ME_GOODS3', 500, 20)],
  13: [g('ME_GOODS1', 1000, 25), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 500, 20)],
  14: [g('ME_GOODS1', 1000, 25), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 500, 20)],
  15: [g('ME_GOODS1', 1000, 25), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 1000, 25)],
  16: [g('ME_GOODS1', 1000, 25), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 1000, 25)],
  17: [g('ME_GOODS1', 2000, 30), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 1000, 25)],
  18: [g('ME_GOODS1', 2000, 30), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 1000, 25)],
  19: [g('ME_GOODS1', 2000, 30), g('ME_GOODS2', 1000, 25), g('ME_GOODS3', 1000, 25)],
  20: [g('ME_GOODS1', 2000, 30), g('ME_GOODS2', 2000, 30), g('ME_GOODS3', 1000, 25)],
  21: [g('ME_GOODS1', 2000, 30), g('ME_GOODS2', 2000, 30), g('ME_GOODS3', 1000, 25)],
  22: [g('CG_GOODS1', 2000, 30), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 1000, 25)],
  23: [g('CG_GOODS1', 2000, 30), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  24: [g('CG_GOODS1', 2000, 30), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  25: [g('CG_GOODS1', 2000, 30), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  26: [g('CG_GOODS1', 2000, 30), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  27: [g('CG_GOODS1', 3000, 40), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  28: [g('CG_GOODS1', 3000, 40), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  29: [g('CG_GOODS1', 3000, 40), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
  30: [g('CG_GOODS1', 3000, 40), g('CG_GOODS2', 2000, 30), g('CG_GOODS3', 2000, 30)],
};

// ============================================================
// CAPITAL CITY – Great Empires module
// (Used by: Hagia Sophia, Colosseum, Palace of Aachen,
//  Sherwood Forest – eras ER → RE → BE)
// ============================================================

export const GE_CAPITAL_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('ER_GOODS1', 100, 8), g('ER_GOODS2', 100, 8)],
  3:  [g('ER_GOODS1', 200, 15), g('ER_GOODS2', 100, 8)],
  4:  [g('ER_GOODS1', 200, 15), g('ER_GOODS2', 100, 8), g('ER_GOODS3', 100, 8)],
  5:  [g('ER_GOODS1', 200, 15), g('ER_GOODS2', 200, 15), g('ER_GOODS3', 100, 8)],
  6:  [g('ER_GOODS1', 500, 20), g('ER_GOODS2', 200, 15), g('ER_GOODS3', 100, 8)],
  7:  [g('ER_GOODS1', 500, 20), g('ER_GOODS2', 200, 15), g('ER_GOODS3', 200, 15)],
  8:  [g('ER_GOODS1', 500, 20), g('ER_GOODS2', 500, 20), g('ER_GOODS3', 200, 15)],
  9:  [g('ER_GOODS1', 500, 20), g('ER_GOODS2', 500, 20), g('ER_GOODS3', 200, 15)],
  10: [g('ER_GOODS1', 500, 20), g('ER_GOODS2', 500, 20), g('ER_GOODS3', 500, 20)],
  11: [g('ER_GOODS1', 1000, 25), g('ER_GOODS2', 500, 20), g('ER_GOODS3', 500, 20)],
  12: [g('RE_GOODS1', 1000, 25), g('RE_GOODS2', 500, 20), g('RE_GOODS3', 500, 20)],
  13: [g('RE_GOODS1', 1000, 25), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 500, 20)],
  14: [g('RE_GOODS1', 1000, 25), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 500, 20)],
  15: [g('RE_GOODS1', 1000, 25), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 1000, 25)],
  16: [g('RE_GOODS1', 1000, 25), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 1000, 25)],
  17: [g('RE_GOODS1', 2000, 30), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 1000, 25)],
  18: [g('RE_GOODS1', 2000, 30), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 1000, 25)],
  19: [g('RE_GOODS1', 2000, 30), g('RE_GOODS2', 1000, 25), g('RE_GOODS3', 1000, 25)],
  20: [g('RE_GOODS1', 2000, 30), g('RE_GOODS2', 2000, 30), g('RE_GOODS3', 1000, 25)],
  21: [g('RE_GOODS1', 2000, 30), g('RE_GOODS2', 2000, 30), g('RE_GOODS3', 1000, 25)],
  22: [g('BE_GOODS1', 2000, 30), g('BE_GOODS2', 2000, 30), g('BE_GOODS3', 2000, 30)],
  23: [g('BE_GOODS1', 2000, 30), g('BE_GOODS2', 2000, 30), g('BE_GOODS3', 2000, 30)],
  24: [g('BE_GOODS1', 2000, 30), g('BE_GOODS2', 2000, 30), g('BE_GOODS3', 2000, 30)],
  25: [g('BE_GOODS1', 3000, 40), g('BE_GOODS2', 2000, 30), g('BE_GOODS3', 2000, 30)],
  26: [g('BE_GOODS1', 3000, 40), g('BE_GOODS2', 2000, 30), g('BE_GOODS3', 2000, 30)],
  27: [g('BE_GOODS1', 3000, 40), g('BE_GOODS2', 3000, 40), g('BE_GOODS3', 2000, 30)],
  28: [g('BE_GOODS1', 3000, 40), g('BE_GOODS2', 3000, 40), g('BE_GOODS3', 2000, 30)],
  29: [g('BE_GOODS1', 3000, 40), g('BE_GOODS2', 3000, 40), g('BE_GOODS3', 3000, 40)],
  30: [g('BE_GOODS1', 3000, 40), g('BE_GOODS2', 3000, 40), g('BE_GOODS3', 3000, 40)],
};

// ============================================================
// EGYPT slot goods
// (Used by: Cheops Pyramid, Great Sphinx, Abu Simbel)
// ============================================================

export const EGYPT_GOODS: Record<number, GoodsEntry[]> = {
  0: [], 1: [],
  2:  [g('Papyrus Scroll', 50, 5), g('Ankh', 50, 5)],
  3:  [g('Papyrus Scroll', 100, 8), g('Ankh', 50, 5)],
  4:  [g('Papyrus Scroll', 100, 8), g('Ankh', 100, 8)],
  5:  [g('Papyrus Scroll', 200, 15), g('Ankh', 100, 8)],
  6:  [g('Papyrus Scroll', 200, 15), g('Ankh', 200, 15)],
  7:  [g('Papyrus Scroll', 200, 15), g('Ankh', 200, 15)],
  8:  [g('Papyrus Scroll', 500, 20), g('Ankh', 200, 15)],
  9:  [g('Papyrus Scroll', 500, 20), g('Ankh', 500, 20)],
  10: [g('Papyrus Scroll', 500, 20), g('Ankh', 500, 20)],
  11: [g('Papyrus Scroll', 500, 20), g('Ankh', 500, 20)],
  12: [g('Papyrus Scroll', 1000, 25), g('Ankh', 500, 20)],
  13: [g('Papyrus Scroll', 1000, 25), g('Ankh', 1000, 25)],
  14: [g('Papyrus Scroll', 1000, 25), g('Ankh', 1000, 25)],
  15: [g('Papyrus Scroll', 1000, 25), g('Ankh', 1000, 25)],
  16: [g('Papyrus Scroll', 1000, 25), g('Ankh', 1000, 25), g('Ceremonial Dress', 50, 0), g('Golden Mask', 50, 5)],
  17: [g('Papyrus Scroll', 1000, 25), g('Ankh', 1000, 25), g('Ceremonial Dress', 100, 8), g('Golden Mask', 50, 5)],
  18: [g('Papyrus Scroll', 2000, 30), g('Ankh', 1000, 25), g('Ceremonial Dress', 100, 8), g('Golden Mask', 100, 8)],
  19: [g('Papyrus Scroll', 2000, 30), g('Ankh', 2000, 30), g('Ceremonial Dress', 200, 15), g('Golden Mask', 100, 8)],
  20: [g('Papyrus Scroll', 2000, 30), g('Ankh', 2000, 30), g('Ceremonial Dress', 200, 15), g('Golden Mask', 200, 15)],
  21: [g('Papyrus Scroll', 2000, 30), g('Ankh', 2000, 30), g('Ceremonial Dress', 500, 20), g('Golden Mask', 200, 15)],
  22: [g('Papyrus Scroll', 2000, 30), g('Ankh', 2000, 30), g('Ceremonial Dress', 500, 20), g('Golden Mask', 500, 20)],
  23: [g('Papyrus Scroll', 2000, 30), g('Ankh', 2000, 30), g('Ceremonial Dress', 500, 20), g('Golden Mask', 500, 20)],
  24: [g('Papyrus Scroll', 2000, 30), g('Ankh', 2000, 30), g('Ceremonial Dress', 1000, 25), g('Golden Mask', 500, 20)],
  25: [g('Papyrus Scroll', 3000, 40), g('Ankh', 2000, 30), g('Ceremonial Dress', 1000, 25), g('Golden Mask', 1000, 25)],
  26: [g('Papyrus Scroll', 3000, 40), g('Ankh', 3000, 40), g('Ceremonial Dress', 1000, 25), g('Golden Mask', 1000, 25)],
  27: [g('Papyrus Scroll', 3000, 40), g('Ankh', 3000, 40), g('Ceremonial Dress', 2000, 30), g('Golden Mask', 1000, 25)],
  28: [g('Papyrus Scroll', 3000, 40), g('Ankh', 3000, 40), g('Ceremonial Dress', 2000, 30), g('Golden Mask', 2000, 30)],
  29: [g('Papyrus Scroll', 3000, 40), g('Ankh', 3000, 40), g('Ceremonial Dress', 3000, 40), g('Golden Mask', 2000, 30)],
  30: [g('Papyrus Scroll', 3000, 40), g('Ankh', 3000, 40), g('Ceremonial Dress', 3000, 40), g('Golden Mask', 3000, 40)],
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
  2:  [g('Silk Thread', 50, 5), g('Silk', 50, 5)],
  3:  [g('Silk Thread', 100, 8), g('Silk', 50, 5)],
  4:  [g('Silk Thread', 100, 8), g('Silk', 100, 8)],
  5:  [g('Silk Thread', 200, 15), g('Silk', 100, 8)],
  6:  [g('Silk Thread', 200, 15), g('Silk', 200, 15)],
  7:  [g('Silk Thread', 200, 15), g('Silk', 200, 15)],
  8:  [g('Silk Thread', 500, 20), g('Silk', 200, 15)],   // corrected from Lua bug
  9:  [g('Silk Thread', 500, 20), g('Silk', 500, 20)],   // corrected from Lua bug
  10: [g('Silk Thread', 500, 20), g('Silk', 500, 20)],
  11: [g('Silk Thread', 1000, 25), g('Silk', 500, 20)],
  12: [g('Silk Thread', 1000, 25), g('Silk', 1000, 25)],
  13: [g('Silk Thread', 1000, 25), g('Silk', 1000, 25), g('Clay', 50, 5)],
  14: [g('Silk Thread', 2000, 30), g('Silk', 1000, 25)],
  15: [g('Silk Thread', 2000, 30), g('Silk', 1000, 25), g('Clay', 50, 5)],
  16: [g('Silk Thread', 2000, 30), g('Silk', 1000, 25), g('Clay', 50, 5), g('Porcelain', 50, 5)],
  17: [g('Silk Thread', 2000, 30), g('Silk', 1000, 25), g('Clay', 100, 8), g('Porcelain', 50, 5)],
  18: [g('Silk Thread', 2000, 30), g('Silk', 1000, 25), g('Clay', 100, 8), g('Porcelain', 100, 8)],
  19: [g('Silk Thread', 2000, 30), g('Silk', 2000, 30), g('Clay', 200, 15), g('Porcelain', 100, 8)],
  20: [g('Silk Thread', 2000, 30), g('Silk', 2000, 30), g('Clay', 200, 15), g('Porcelain', 200, 15)],
  21: [g('Silk Thread', 2000, 30), g('Silk', 2000, 30), g('Clay', 500, 20), g('Porcelain', 200, 15)], // corrected
  22: [g('Silk Thread', 2000, 30), g('Silk', 2000, 30), g('Clay', 500, 20), g('Porcelain', 500, 20)], // corrected
  23: [g('Silk Thread', 2000, 30), g('Silk', 2000, 30), g('Clay', 1000, 25), g('Porcelain', 500, 20)],
  24: [g('Silk Thread', 2000, 30), g('Silk', 2000, 30), g('Clay', 1000, 25), g('Porcelain', 1000, 25)],
  25: [g('Silk Thread', 3000, 40), g('Silk', 2000, 30), g('Clay', 1000, 25), g('Porcelain', 1000, 25)],
  26: [g('Silk Thread', 3000, 40), g('Silk', 3000, 40), g('Clay', 1000, 25), g('Porcelain', 1000, 25)],
  27: [g('Silk Thread', 3000, 40), g('Silk', 3000, 40), g('Clay', 2000, 30), g('Porcelain', 1000, 25)],
  28: [g('Silk Thread', 3000, 40), g('Silk', 3000, 40), g('Clay', 2000, 30), g('Porcelain', 2000, 30)],
  29: [g('Silk Thread', 3000, 40), g('Silk', 3000, 40), g('Clay', 3000, 40), g('Porcelain', 2000, 30)],
  30: [g('Silk Thread', 3000, 40), g('Silk', 3000, 40), g('Clay', 3000, 40), g('Porcelain', 3000, 40)],
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
  2:  [g('ER_GOODS1', 400, 15), g('ER_GOODS2', 300, 10)],
  3:  [g('ER_GOODS1', 800, 25), g('ER_GOODS2', 550, 20)],
  4:  [g('ER_GOODS1', 900, 30), g('ER_GOODS2', 650, 20), g('ER_GOODS3', 650, 20)],
  5:  [g('RE_GOODS1', 1250, 40), g('RE_GOODS2', 850, 25), g('RE_GOODS3', 850, 25)],
  6:  [g('RE_GOODS1', 1600, 50), g('RE_GOODS2', 1100, 35), g('RE_GOODS3', 1100, 35)],
  7:  [g('RE_GOODS1', 2000, 65), g('RE_GOODS2', 1300, 40), g('RE_GOODS3', 1300, 40)],
  8:  [g('RE_GOODS1', 2400, 75), g('RE_GOODS2', 1600, 50), g('RE_GOODS3', 1600, 50)],
  9:  [g('RE_GOODS1', 2700, 85), g('RE_GOODS2', 1900, 60), g('RE_GOODS3', 1900, 60)],
  10: [g('BE_GOODS1', 3100, 100), g('BE_GOODS2', 2100, 65), g('BE_GOODS3', 2100, 65)],
  11: [g('BE_GOODS1', 1700, 55), g('BE_GOODS1', 1700, 55), g('BE_GOODS2', 1200, 40), g('BE_GOODS2', 1200, 40), g('BE_GOODS3', 1200, 40), g('BE_GOODS3', 1200, 40)],
  12: [g('BE_GOODS1', 1900, 60), g('BE_GOODS1', 1900, 60), g('BE_GOODS2', 1300, 40), g('BE_GOODS2', 1300, 40), g('BE_GOODS3', 1300, 40), g('BE_GOODS3', 1300, 40)],
  13: [g('BE_GOODS1', 2200, 70), g('BE_GOODS1', 2200, 70), g('BE_GOODS2', 4500, 145), g('BE_GOODS2', 4500, 145), g('BE_GOODS3', 1400, 45), g('BE_GOODS3', 1400, 45)],
  14: [g('BE_GOODS1', 2300, 75), g('BE_GOODS1', 2300, 75), g('BE_GOODS2', 1600, 50), g('BE_GOODS2', 1600, 50), g('BE_GOODS3', 1600, 50), g('BE_GOODS3', 1600, 50)],
  15: [g('AF_GOODS1', 2500, 80), g('AF_GOODS1', 2500, 80), g('AF_GOODS2', 1700, 55), g('AF_GOODS2', 1700, 55), g('AF_GOODS3', 1800, 60), g('AF_GOODS3', 1800, 60)],
  16: [g('AF_GOODS1', 2800, 90), g('AF_GOODS1', 2800, 90), g('AF_GOODS2', 1800, 60), g('AF_GOODS2', 1800, 60), g('AF_GOODS3', 1900, 60), g('AF_GOODS3', 1900, 60)],
  17: [g('AF_GOODS1', 3000, 95), g('AF_GOODS1', 3000, 95), g('AF_GOODS2', 2000, 65), g('AF_GOODS2', 2000, 65), g('AF_GOODS3', 2000, 65), g('AF_GOODS3', 2000, 65)],
  18: [g('AF_GOODS1', 3000, 95), g('AF_GOODS1', 3000, 95), g('AF_GOODS2', 2200, 70), g('AF_GOODS2', 2200, 70), g('AF_GOODS3', 2200, 70), g('AF_GOODS3', 2200, 70)],
  19: [g('AF_GOODS1', 3250, 105), g('AF_GOODS1', 3250, 105), g('AF_GOODS2', 2300, 75), g('AF_GOODS2', 2300, 75), g('AF_GOODS3', 2300, 75), g('AF_GOODS3', 2300, 75)],
  20: [g('FA_GOODS1', 3500, 110), g('FA_GOODS1', 3500, 110), g('FA_GOODS2', 2500, 80), g('FA_GOODS2', 2500, 80), g('FA_GOODS3', 2500, 80), g('FA_GOODS3', 2500, 80)],
  21: [g('FA_GOODS1', 3700, 120), g('FA_GOODS1', 3700, 120), g('FA_GOODS2', 2500, 80), g('FA_GOODS2', 2500, 80), g('FA_GOODS3', 2500, 80), g('FA_GOODS3', 2500, 80)],
  22: [g('FA_GOODS1', 4000, 130), g('FA_GOODS1', 4000, 130), g('FA_GOODS2', 2800, 90), g('FA_GOODS2', 2800, 90), g('FA_GOODS3', 2800, 90), g('FA_GOODS3', 2800, 90)],
  23: [g('FA_GOODS1', 4000, 130), g('FA_GOODS1', 4000, 130), g('FA_GOODS2', 2900, 95), g('FA_GOODS2', 2900, 95), g('FA_GOODS3', 2900, 95), g('FA_GOODS3', 2900, 95)],
  24: [g('FA_GOODS1', 4300, 140), g('FA_GOODS1', 4300, 140), g('FA_GOODS2', 3000, 95), g('FA_GOODS2', 3000, 95), g('FA_GOODS3', 3000, 95), g('FA_GOODS3', 3000, 95)],
  25: [g('IE_GOODS1', 4500, 145), g('IE_GOODS1', 4500, 145), g('IE_GOODS2', 3200, 100), g('IE_GOODS2', 3200, 100), g('IE_GOODS3', 3300, 105), g('IE_GOODS3', 3300, 105)],
  26: [g('IE_GOODS1', 4800, 155), g('IE_GOODS1', 4800, 155), g('IE_GOODS2', 3200, 100), g('IE_GOODS2', 3200, 100), g('IE_GOODS3', 3300, 105), g('IE_GOODS3', 3300, 105)],
  27: [g('IE_GOODS1', 5000, 160), g('IE_GOODS1', 5000, 160), g('IE_GOODS2', 3500, 110), g('IE_GOODS2', 3500, 110), g('IE_GOODS3', 3500, 110), g('IE_GOODS3', 3500, 110)],
  28: [g('IE_GOODS1', 5300, 170), g('IE_GOODS1', 5300, 170), g('IE_GOODS2', 3500, 110), g('IE_GOODS2', 3500, 110), g('IE_GOODS3', 3500, 110), g('IE_GOODS3', 3500, 110)],
  29: [g('IE_GOODS1', 5500, 175), g('IE_GOODS1', 5500, 175), g('IE_GOODS2', 3800, 120), g('IE_GOODS2', 3800, 120), g('IE_GOODS3', 3800, 120), g('IE_GOODS3', 3800, 120)],
  30: [g('KS_GOODS1', 6000, 190), g('KS_GOODS1', 6000, 190), g('KS_GOODS2', 3800, 120), g('KS_GOODS2', 3800, 120), g('KS_GOODS3', 3800, 120), g('KS_GOODS3', 3800, 120)],
};
