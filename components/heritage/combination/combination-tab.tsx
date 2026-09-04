"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { ERAS } from "@/data/config";
import type { EraCode } from "@/types/shared";
import {
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  amplifyBonusValue,
  getEquippedEffects,
  getKeeperReputationCost,
  getUpgradeCostTiers,
  keeperAmplifierMultiplier,
  resolveHeritageVault,
  tokensFromBuildingLevels,
  tokensToVaultLevel,
  type HeritageEligibleBuilding,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { resolveEvolvingBuilding } from "@/resolvers/evolving-buildings";
import {
  combinationKey,
  combineBonuses,
  regenerationReadouts,
  type CombinableBonus,
  type CombinationLine,
  type CombinationSource,
  type KeeperAxis,
  type OptimizerSource,
} from "@/resolvers/heritage-combination";
import { getHeritageBuildingImageUrl } from "@/lib/heritage-images";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { ResponsiveSelect, SELECT_TEN_OPTIONS } from "@/components/modals/responsive-select";
import { BuildingImage } from "@/components/heritage/building-image";
import { useSessionStorageState } from "@/hooks/use-session-storage-state";
import { VaultPanel } from "./vault-panel";
import { TotalsTable } from "./totals-table";
import { RegenerationReadouts } from "./regeneration-readout";
import { EvolvingCardStats } from "./card-stats";
import { OptimizerPanel } from "./optimizer-panel";

// ============================================================
// Onglet « Combination ».
//
// Répond à : « si j'ai mon bâtiment d'héritage ET mes évolutifs du même thème,
// qu'est-ce que ça donne au total ? » Deux colonnes, comme l'onglet Sacrifice :
// les porteurs à gauche, le cumul à droite.
//
// ⚠️ CE QUI LE DISTINGUE DU SACRIFICE. Le Sacrifice DÉMONTE des évolutifs pour
// nourrir le vault : ses cartes ont un niveau cible et un compte de jetons. Ici
// rien n'est démonté — tous les bâtiments sont posés en même temps, et la seule
// question est ce qu'ils rendent ENSEMBLE. D'où l'absence de « levels removed »
// et d'inventaire de jetons, remplacé en tête de colonne par le bâtiment
// d'héritage lui-même.
//
// ⚠️ TOUT L'ÉTAT EST LOCAL À L'ONGLET (`sessionStorage`, par thème) et VIDE au
// départ : c'est un bac à sable, distinct de la progression Dexie qu'il ne
// touche jamais. Le bouton d'import du panneau de vault est le seul pont, et il
// va dans un seul sens.
// ============================================================

interface CardState {
  id: string;
  buildingId: string;
  level: number;
  era?: EraCode;
}

/** L'état bac à sable du bâtiment d'héritage. */
interface VaultState {
  level: number;
  keeperReputationLevel: number;
  /** `slotId` → `effectId`. Vide au départ — le joueur pose ce qu'il veut. */
  equipped: Record<string, string>;
}

const EMPTY_VAULT: VaultState = { level: 1, keeperReputationLevel: 1, equipped: {} };

type BuildingPicker = { mode: "add" } | { mode: "edit"; cardId: string };

/**
 * Ordre décroissant (la plus récente d'abord) : c'est l'ère par défaut d'une
 * carte neuve, elle doit apparaître en tête du menu, pas tout en bas après un
 * défilement.
 */
const ERA_OPTIONS = [...ERAS].reverse().map((era) => ({ value: era.abbr, label: era.name }));

/**
 * Ère par défaut d'une carte neuve : la DERNIÈRE de `ERAS`, jamais "CG"
 * (Classical Greece, 4ᵉ sur ~15) qui traînait ici sans rapport avec l'ordre du
 * jeu. Dérivée de la liste pour rester juste si une ère est ajoutée derrière.
 */
const LAST_ERA: EraCode = ERAS[ERAS.length - 1].abbr;

function levelOptions(maxLevel: number) {
  return Array.from({ length: maxLevel }, (_, i) => ({
    value: String(i + 1),
    label: `Lv. ${i + 1}`,
  }));
}

// ─── Carte d'un bâtiment évolutif ───────────────────────────────────────────

function EvolvingCard({
  card,
  building,
  selections,
  onChangeBuilding,
  onUpdate,
  onRemove,
}: {
  card: CardState;
  building: HeritageEligibleBuilding;
  selections: string[][];
  onChangeBuilding: () => void;
  onUpdate: (updates: Partial<CardState>) => void;
  onRemove: () => void;
}) {
  // Ce que CE bâtiment porte au niveau et à l'ère choisis — le même détail que
  // la carte de l'onglet Sacrifice, sans l'avant/après : ici rien n'est démonté.
  const resolved = resolveEvolvingBuilding(building.key, card.level, card.era ?? LAST_ERA);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="relative min-h-24">
        <button
          onClick={onChangeBuilding}
          title="Change building"
          aria-label={`Change ${building.name}`}
          className="absolute left-0 top-0 flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-muted/30 transition-colors hover:bg-muted/50 md:inset-y-0 md:size-auto md:w-25"
        >
          <BuildingImage
            src={getHeritageBuildingImageUrl(building.buildingId)}
            alt={building.name}
          />
        </button>
        <div className="flex h-full flex-col justify-between gap-2 pl-19 md:pl-28">
          {/* Cf. `SacrificeCard` : l'ère descend dans la rangée de
              sélecteurs, la première ligne ne garde que le nom et le retrait. */}
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{building.name}</p>
            <button
              type="button"
              onClick={onRemove}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
              aria-label="Remove building"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                Era
              </span>
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={card.era ?? LAST_ERA}
                onValueChange={(value) => onUpdate({ era: value as EraCode })}
                options={ERA_OPTIONS}
                placeholder="Era"
                className="w-44"
                selectClassName="h-9 rounded-lg"
                drawerBtnClassName="h-9"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                Building level
              </span>
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={String(card.level)}
                onValueChange={(value) => onUpdate({ level: Number(value) })}
                options={levelOptions(building.maxLevel)}
                placeholder="Level"
                className="w-28"
                selectClassName="h-9 rounded-lg"
                drawerBtnClassName="h-9"
              />
            </div>
          </div>
        </div>
      </div>

      {resolved !== null && (
        <EvolvingCardStats resolved={resolved} selections={selections} />
      )}
    </div>
  );
}

// ─── Onglet ─────────────────────────────────────────────────────────────────

export function CombinationTab({
  vault,
  eligibleBuildings,
  selections,
}: {
  /** Le vault résolu sur la progression RÉELLE — sert de source à l'import. */
  vault: ResolvedHeritageVault;
  eligibleBuildings: HeritageEligibleBuilding[];
  selections: string[][];
}) {
  const [cards, setCards] = useSessionStorageState<CardState[]>(
    `heritage-combination-cards:${vault.themeId}`,
    [],
  );
  const [vaultState, setVaultState] = useSessionStorageState<VaultState>(
    `heritage-combination-vault:${vault.themeId}`,
    EMPTY_VAULT,
  );
  const [picker, setPicker] = useState<BuildingPicker | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  // ⚠️ Résolu sur l'état LOCAL, avec l'ère de la page : le bonus d'un vault
  // dépend de l'ère COURANTE du joueur, jamais d'une ère figée — c'est ce qui
  // le distingue d'un évolutif, dont chaque carte porte la sienne.
  const localVault = resolveHeritageVault(vault.key, vaultState.level, vault.era, {
    equipped: vaultState.equipped,
    keeperReputationLevel: vaultState.keeperReputationLevel,
    keeperReputationPoints: 0,
    xpProgress: 0,
  });

  const buildingOf = (buildingId: string) =>
    eligibleBuildings.find((candidate) => candidate.buildingId === buildingId);

  const updateCard = (id: string, updates: Partial<CardState>) => {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...updates } : card)));
  };

  const pickBuilding = (buildingId: string) => {
    if (picker?.mode === "edit") {
      updateCard(picker.cardId, { buildingId, level: 1, era: LAST_ERA });
    } else {
      setCards((prev) => [
        ...prev,
        {
          id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          buildingId,
          level: 1,
          era: LAST_ERA,
        },
      ]);
    }
    setPicker(null);
  };

  // Jamais deux cartes pour le même bâtiment : un évolutif est unique en ville.
  // En édition, celui de la carte courante reste sélectionnable.
  const pickerBuildings = eligibleBuildings.filter(
    (building) =>
      !cards.some(
        (card) =>
          card.buildingId === building.buildingId &&
          (picker?.mode !== "edit" || card.id !== picker.cardId),
      ),
  );

  /**
   * Recopie la configuration de l'onglet Infos : niveau, rang de gardien ET
   * effets posés, en un seul geste. Le sens inverse n'existe pas — le bac à
   * sable n'écrit jamais dans la progression.
   */
  const importFromInfos = () => {
    const equipped: Record<string, string> = {};
    for (const slot of vault.slots) {
      if (slot.effectId !== null) equipped[slot.id] = slot.effectId;
    }
    setVaultState({
      level: vault.level,
      keeperReputationLevel: vault.keeper.reputationLevel,
      equipped,
    });
  };

  /**
   * L'ordre des sources est l'ordre de lecture du tableau : le bâtiment
   * d'héritage d'abord, puis les évolutifs dans l'ordre où ils ont été ajoutés
   * (`combineBonuses` suit la première apparition de chaque stat).
   *
   * ⚠️ `getEquippedEffects` et NON `getUnlockedEffects` : seuls les effets
   * réellement posés dans un emplacement atteignable comptent. C'est la règle
   * du jeu — 8 emplacements pour 10 effets — et le cœur de cet onglet.
   */
  const sources: CombinationSource[] = [];
  if (localVault !== null) {
    const bonuses = getEquippedEffects(localVault).flatMap((effect) => effect.bonuses);
    if (bonuses.length > 0) {
      sources.push({
        // ⚠️ « Vault » et pas `buildingName` : dans le détail d'une ligne, le nom
        // du bâtiment-marqueur (« Pirate Tradition ») se lit comme un troisième
        // bâtiment posé à côté des évolutifs. « Vault » dit ce que la ligne
        // désigne vraiment — le porteur d'héritage, unique et non ajoutable.
        // Les évolutifs, eux, gardent leur nom : ce sont bien des bâtiments
        // distincts que le joueur reconnaît.
        id: "vault",
        name: "Vault",
        kind: "vault",
        bonuses,
      });
    }
  }
  for (const card of cards) {
    const building = buildingOf(card.buildingId);
    if (building === undefined) continue;
    const resolved = resolveEvolvingBuilding(building.key, card.level, card.era ?? LAST_ERA);
    if (resolved === null) continue;
    sources.push({
      id: card.id,
      name: building.name,
      kind: "evolving",
      bonuses: [...resolved.production, ...resolved.culture, ...resolved.bonuses],
    });
  }
  const lines = combineBonuses(sources);
  // La traduction en temps ne concerne que les jauges du jeu (boussole, points
  // de recherche, tentatives d'attaque) : rend un tableau vide si le thème n'en
  // touche aucune, et l'encart ne se rend alors pas du tout.
  const readouts = regenerationReadouts(lines);

  /**
   * Les mêmes porteurs, vus par l'optimiseur.
   *
   * ⚠️ CURRIFIÉ, ET CE N'EST PAS UN DÉTAIL DE STYLE. L'arbitrage avec le gardien
   * rejoue le calcul à 99 rangs : résoudre le vault à chaque (niveau, rang)
   * ferait ~6 000 résolutions à chaque frappe. Le premier appel résout les 60
   * niveaux UNE fois — le rang n'en change pas la valeur de base — et le second
   * ne fait qu'appliquer le multiplicateur. 60 résolutions au lieu de 6 000, et
   * le résultat est identique : l'amplificateur est un facteur, pas une courbe.
   *
   * ⚠️ Le multiplicateur passe par `amplifyBonusValue`, jamais par une
   * multiplication écrite ici : c'est cette fonction qui sait quels types sont
   * EXEMPTÉS d'amplification (les compteurs discrets, convention (b bis)).
   *
   * ⚠️ La configuration du vault (effets posés) est tenue FIXE : seul le NIVEAU
   * varie. Monter le vault peut rendre un slot atteignable, ce que la résolution
   * reflète toute seule, mais poser un effet de plus est un choix du joueur, pas
   * un coût en jetons.
   */
  const buildOptimizerSources = (line: CombinationLine) => {
    const matching = (bonuses: CombinableBonus[]) =>
      bonuses.find((bonus) => combinationKey(bonus) === line.key);

    // La contribution NUE du vault par niveau, résolue une fois pour toutes.
    const vaultBase = new Map<number, number | null>();
    const vaultBaseAt = (level: number) => {
      const cached = vaultBase.get(level);
      if (cached !== undefined) return cached;
      const resolved = resolveHeritageVault(vault.key, level, vault.era, {
        equipped: vaultState.equipped,
        // Rang 1 = multiplicateur nul : on lit la valeur de base, que
        // `amplifyBonusValue` amplifiera ensuite au rang voulu.
        keeperReputationLevel: 1,
        keeperReputationPoints: 0,
        xpProgress: 0,
      });
      const value =
        resolved === null
          ? null
          : (matching(getEquippedEffects(resolved).flatMap((effect) => effect.bonuses))
              ?.value ?? null);
      vaultBase.set(level, value);
      return value;
    };

    const evolvings = cards.flatMap((card) => {
      const building = buildingOf(card.buildingId);
      if (building === undefined) return [];
      const tiers = getUpgradeCostTiers(building.key);
      // ⚠️ MÉMOÏSÉ COMME LE VAULT, ET POUR LA MÊME RAISON — sauf qu'ici le cache
      // vaut pour TOUS les rangs de gardien : un évolutif n'est pas amplifié, sa
      // contribution ne dépend que de son niveau. Sans lui, l'arbitrage
      // re-résolvait chaque bâtiment à chacun de ses 60 niveaux, 99 fois de
      // suite — 5 940 résolutions par carte pour 60 valeurs distinctes.
      const contributions = new Map<number, number | null>();
      return [
        {
          id: card.id,
          name: building.name,
          kind: "evolving" as const,
          currentLevel: card.level,
          maxLevel: building.maxLevel,
          // Le coût d'une MONTÉE se lit sur le même barème que le remboursement
          // d'une descente : les jetons des niveaux `card.level` … `level - 1`.
          costTo: (level: number) =>
            tokensFromBuildingLevels(tiers, level, level - card.level),
          contributionAt: (level: number) => {
            const cached = contributions.get(level);
            if (cached !== undefined) return cached;
            const resolved = resolveEvolvingBuilding(building.key, level, card.era ?? LAST_ERA);
            const value =
              resolved === null
                ? null
                : (matching([
                    ...resolved.production,
                    ...resolved.culture,
                    ...resolved.bonuses,
                  ])?.value ?? null);
            contributions.set(level, value);
            return value;
          },
        },
      ];
    });

    return (multiplier: number): OptimizerSource[] => {
      const result: OptimizerSource[] = [];
      if (localVault !== null) {
        result.push({
          id: "vault",
          name: "Vault",
          kind: "vault",
          currentLevel: localVault.level,
          maxLevel: localVault.maxLevel,
          costTo: (level) => tokensToVaultLevel(vault.key, localVault.level, level),
          contributionAt: (level) =>
            amplifyBonusValue(line.sample.type, vaultBaseAt(level), multiplier),
        });
      }
      return [...result, ...evolvings];
    };
  };

  /**
   * L'axe gardien : une SECONDE monnaie, la réputation.
   *
   * Son coût cumulé se somme rang par rang — le barème (`5 × rang`) ne donne que
   * le prix de QUITTER un rang, jamais un total.
   */
  const keeperAxis: KeeperAxis = {
    currentLevel: vaultState.keeperReputationLevel,
    maxLevel: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
    costTo: (level) => {
      let total = 0;
      for (let rank = vaultState.keeperReputationLevel; rank < level; rank += 1) {
        total += getKeeperReputationCost(vault.key, rank) ?? 0;
      }
      return total;
    },
    multiplierAt: keeperAmplifierMultiplier,
  };

  const equippedCount = localVault === null ? 0 : getEquippedEffects(localVault).length;

  if (eligibleBuildings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No eligible evolving building for this theme — nothing to combine.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ⚠️ TROIS BLOCS, DEUX MISES EN PAGE — et l'ordre de lecture change avec
          la largeur, pas le contenu.
          · À partir de `lg`, la colonne de gauche empile le porteur d'héritage
            et les évolutifs, le cumul se cale à droite en `sticky` : tout est
            sous les yeux en même temps.
          · En dessous, une seule colonne, et le cumul se glisse ENTRE le
            panneau du vault et les cartes. Posé en dernier — l'ordre naturel du
            DOM — il atterrissait à ~2 400 px de défilement sur un téléphone :
            on réglait un niveau sans jamais voir ce qu'il changeait. Ici, le
            geste et son effet ne sont plus qu'à un écran l'un de l'autre.
          Le placement explicite (`col-start`/`row-start`) plutôt qu'un `order`
          isolé : c'est la grille de bureau qui a deux rangées, et les trois
          blocs doivent y retomber au bon endroit. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1">
          {localVault !== null && (
            <VaultPanel
              vault={localVault}
              selections={selections}
              open={panelOpen}
              onOpenChange={setPanelOpen}
              onLevelChange={(level) => setVaultState((prev) => ({ ...prev, level }))}
              onKeeperChange={(keeperReputationLevel) =>
                setVaultState((prev) => ({ ...prev, keeperReputationLevel }))
              }
              equip={(slotId, effectId) =>
                setVaultState((prev) => ({
                  ...prev,
                  // Le jeu n'autorise pas le même effet à deux endroits : le
                  // retirer d'abord de tout AUTRE slot, sinon son bonus
                  // compterait deux fois dans le total. Même règle que
                  // `equipHeritageEffect` côté Dexie.
                  equipped: {
                    ...Object.fromEntries(
                      Object.entries(prev.equipped).filter(([, id]) => id !== effectId),
                    ),
                    [slotId]: effectId,
                  },
                }))
              }
              unequip={(slotId) =>
                setVaultState((prev) => ({
                  ...prev,
                  equipped: Object.fromEntries(
                    Object.entries(prev.equipped).filter(([id]) => id !== slotId),
                  ),
                }))
              }
              onImport={importFromInfos}
              importLabel="Copy level, keeper rank and equipped effects from the Infos tab"
              equippedCount={equippedCount}
            />
          )}
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-16">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
            Combined stats
          </p>
          <div className="flex flex-col gap-4">
            {/* La lecture en temps AVANT le tableau de cumul : c'est la réponse,
                le tableau en est le détail. */}
            <RegenerationReadouts readouts={readouts} />
            <TotalsTable lines={lines} selections={selections} />
            <OptimizerPanel
              lines={lines}
              buildSources={buildOptimizerSources}
              keeper={keeperAxis}
              selections={selections}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-2">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
            Evolving buildings
          </p>
          {cards.map((card) => {
            const building = buildingOf(card.buildingId);
            if (building === undefined) return null;
            return (
              <EvolvingCard
                key={card.id}
                card={card}
                building={building}
                selections={selections}
                onChangeBuilding={() => setPicker({ mode: "edit", cardId: card.id })}
                onUpdate={(updates) => updateCard(card.id, updates)}
                onRemove={() =>
                  setCards((prev) => prev.filter((other) => other.id !== card.id))
                }
              />
            );
          })}
          {cards.length < eligibleBuildings.length && (
            <button
              type="button"
              onClick={() => setPicker({ mode: "add" })}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 bg-muted/10 px-6 py-8 text-muted-foreground md:py-12 transition-colors hover:bg-muted/30"
            >
              <Plus size={24} />
              <span className="text-sm font-medium">Add evolving building</span>
            </button>
          )}
        </div>
      </div>

      <ResponsiveModal
        title="Choose an evolving building"
        trigger={<span className="hidden" aria-hidden="true" />}
        open={picker !== null}
        onOpenChange={(open) => {
          if (!open) setPicker(null);
        }}
        className="flex h-[80vh] flex-col gap-0 overflow-hidden p-0 md:h-[min(600px,57vh)] md:max-w-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h3 className="text-sm font-bold">Choose an evolving building</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setPicker(null)}
            className="cursor-pointer text-[14px] text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {pickerBuildings.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No more buildings available.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {pickerBuildings.map((building) => (
                <button
                  key={building.buildingId}
                  className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50"
                  onClick={() => pickBuilding(building.buildingId)}
                >
                  <div className="flex h-20 w-full items-center justify-center overflow-hidden bg-muted/30 sm:h-28 md:h-36">
                    <BuildingImage
                      src={getHeritageBuildingImageUrl(building.buildingId)}
                      alt={building.name}
                    />
                  </div>
                  <span className="w-full truncate px-1.5 py-1.5 text-center text-[12px] font-medium leading-tight">
                    {building.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </ResponsiveModal>
    </div>
  );
}
