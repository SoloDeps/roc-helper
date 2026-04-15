// ============================================================
// ROC Helper – World Wonders: Presets & Filter Utilities
//
// Strategic presets group Wonders by role.
// Filter utilities are consumed by the Wonder list UI.
// ============================================================

import type { Wonder, WonderPreset, WonderFilter } from './types';
import { WONDERS } from './index';

// ============================================================
// PRESETS
// Presets are curated groupings by strategic role.
// Add new presets here as the game evolves — no Wonder data
// files need to change.
// ============================================================

export const WONDER_PRESETS: WonderPreset[] = [
  {
    id: 'production',
    label: 'Production',
    wonderCodes: ['SH', 'HG', 'ToM', 'LoA', 'FC', 'T', 'Y', 'P', 'Tikal'],
  },
  {
    id: 'research',
    label: 'Research',
    wonderCodes: ['SH', 'AS', 'GW', 'LToP'],
  },
  {
    id: 'combat_damage',
    label: 'Combat – Damage',
    wonderCodes: ['SoZ', 'ToA', 'GS', 'AS', 'C', 'V', 'CoB'],
  },
  {
    id: 'combat_hp',
    label: 'Combat – HP',
    wonderCodes: ['PoA', 'SF', 'TA', 'SP', 'GW', 'DE'],
  },
  {
    id: 'crit_boost',
    label: 'Critical Hits',
    wonderCodes: ['CoR', 'CC', 'CI', 'A'],
  },
  {
    id: 'recruitment',
    label: 'Recruitment Speed',
    wonderCodes: ['CC', 'PoA', 'CI', 'DE'],
  },
  {
    id: 'goods',
    label: 'Goods / Trade',
    wonderCodes: ['CP', 'FC', 'T', 'Tikal', 'LoA', 'CoR', 'HS', 'P', 'CoB'],
  },
  {
    id: 'workers',
    label: 'Workers',
    wonderCodes: ['HG', 'ToA', 'C', 'A', 'P'],
  },
];

// ============================================================
// FILTER UTILITIES
// ============================================================

/**
 * Returns the list of all Wonders matching the given filter.
 * All filter fields are ANDed together.
 */
export function filterWonders(filter: WonderFilter): Wonder[] {
  return Object.values(WONDERS).filter(wonder => {
    const { meta } = wonder;

    if (filter.group && meta.group !== filter.group) return false;
    if (filter.slot && meta.slot !== filter.slot) return false;
    if (filter.rarity && meta.rarity !== filter.rarity) return false;
    if (filter.synergyTag !== undefined && filter.synergyTag !== '' && meta.synergyTag !== filter.synergyTag) return false;

    if (filter.material) {
      if (meta.material1 !== filter.material && meta.material2 !== filter.material) return false;
    }

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      if (!meta.name.toLowerCase().includes(q) && !meta.code.toLowerCase().includes(q)) return false;
    }

    return true;
  });
}

/**
 * Returns Wonders that share at least one material type with the given Wonder code.
 * Useful for showing "synergy candidates" in the UI.
 */
export function getSynergyPartners(code: string): Wonder[] {
  const source = WONDERS[code];
  if (!source) return [];

  const materials = new Set([source.meta.material1, source.meta.material2]);

  return Object.values(WONDERS).filter(w =>
    w.meta.code !== code &&
    (materials.has(w.meta.material1) || materials.has(w.meta.material2))
  );
}

/**
 * Groups a list of Wonders by their group name.
 */
export function groupWondersByGroup(wonders: Wonder[]): Record<string, Wonder[]> {
  const result: Record<string, Wonder[]> = {};
  for (const wonder of wonders) {
    const group = wonder.meta.group;
    if (!result[group]) result[group] = [];
    result[group].push(wonder);
  }
  return result;
}

/**
 * Returns all Wonders that belong to a specific preset id.
 */
export function getPresetWonders(presetId: string): Wonder[] {
  const preset = WONDER_PRESETS.find(p => p.id === presetId);
  if (!preset) return [];
  return preset.wonderCodes.map(code => WONDERS[code]).filter(Boolean) as Wonder[];
}
