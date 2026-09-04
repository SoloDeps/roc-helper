"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ERAS } from "@/data/config";
import type { EraCode } from "@/types/shared";
import {
  computeTargetVaultLevel,
  diffVaultLevels,
  getHeritageUpgradeCost,
  tokensFromBuildingLevels,
  type HeritageEligibleBuilding,
  type HeritageVaultBonusLine,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { bonusKey } from "@/resolvers/bonus";
import { resolveEvolvingBuilding } from "@/resolvers/evolving-buildings";
import {
  describeCultureEffect,
  describeHeritageBonus,
} from "@/components/heritage/effect-display";
import {
  getHeritageBuildingImageUrl,
  getHeritageTokenImageUrl,
} from "@/lib/heritage-images";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import {
  ResponsiveSelect,
  SELECT_TEN_OPTIONS,
} from "@/components/modals/responsive-select";
import { BuildingImage } from "@/components/heritage/building-image";
import { XpProgressBar } from "@/components/heritage/xp-progress-bar";
import BuildingCounter from "@/components/items/building-counter";
import { useSessionStorageState } from "@/hooks/use-session-storage-state";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BeforeAfterTable, buildBeforeAfterRows } from "./before-after-table";

// ============================================================
// Onglet « Sacrifice ».
//
// Deux colonnes : les cartes de bâtiments évolutifs à gauche, la carte du vault
// agrégée à droite. Dans chaque carte, `sacrificeLevel` est le niveau CIBLE
// après sacrifice, pas un compte de niveaux retirés — les jetons se déduisent
// du delta.
//
// Tout l'état de cet onglet vit en `sessionStorage`, par vault : c'est un bac à
// sable de simulation, distinct de la progression stockée en Dexie. Le niveau
// du vault y est donc lui aussi local.
// ============================================================

interface CardState {
  id: string;
  buildingId: string;
  currentLevel: number;
  /** Niveau visé après sacrifice, ≥ 1. */
  sacrificeLevel: number;
  era?: EraCode;
}

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

// ─── Inventaire de jetons ───────────────────────────────────────────────────

function TokenInventoryCard({
  building,
  qty,
  onQtyChange,
}: {
  building: HeritageEligibleBuilding;
  qty: number;
  onQtyChange: (value: number) => void;
}) {
  return (
    <div className="flex w-30 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex h-16 w-full items-center justify-center overflow-hidden bg-muted/30 p-1.5">
        <BuildingImage
          src={getHeritageTokenImageUrl(building.buildingId)}
          alt={building.name}
        />
      </div>
      <div className="flex flex-col items-center gap-1 px-1.5 py-1.5">
        <span className="w-full truncate text-center text-[11px] font-medium text-muted-foreground">
          {building.name}
        </span>
        <BuildingCounter value={qty} onChange={onQtyChange} min={0} max={9999} />
      </div>
    </div>
  );
}

/**
 * Le même jeton que `TokenInventoryCard`, réduit à une pilule.
 *
 * Rendu à la PLACE du panneau quand il est replié, et seulement pour les jetons
 * dont l'inventaire est > 0 : replier ne doit pas faire disparaître de vue ce
 * qui compte déjà dans le total. Composant à part plutôt qu'un mode de la
 * carte — les deux ne partagent ni la saisie, ni la mise en page, ni la taille
 * d'image ; les mêler produirait une carte pleine de conditions.
 */
function TokenInventoryBadge({
  building,
  qty,
}: {
  building: HeritageEligibleBuilding;
  qty: number;
}) {
  return (
    <div
      className="flex h-9 w-18 shrink-0 items-center justify-center gap-1.5 rounded-md border border-alpha-200 bg-background-100 px-0.5"
      title={building.name}
    >
      <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden">
        <BuildingImage
          src={getHeritageTokenImageUrl(building.buildingId)}
          alt={building.name}
        />
      </span>
      <span className="text-[12px] font-semibold tabular-nums">{qty}</span>
    </div>
  );
}

// ─── Carte d'un bâtiment sacrifié ───────────────────────────────────────────

function SacrificeCard({
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
  const era = card.era ?? LAST_ERA;
  const levelsRemoved = card.currentLevel - card.sacrificeLevel;
  const tokens = tokensFromBuildingLevels(
    building.tiers,
    card.currentLevel,
    levelsRemoved,
  );

  const bonusesAt = (level: number) => {
    const resolved = resolveEvolvingBuilding(building.key, level, era);
    if (resolved === null) return [];

    const describe = (bonuses: typeof resolved.production) =>
      bonuses.map((bonus) => ({
        key: bonusKey(bonus),
        ...describeHeritageBonus(bonus, selections),
      }));

    // Culture : `resolved.culture` isole déjà les deux bonus
    // (`culture_points` + `culture_range`) d'un même component — une seule
    // ligne combinée plutôt que deux, même règle que `overview-table.tsx`.
    // Clé fixe (`culture`, sans `#`) : stable entre le niveau courant et le
    // niveau sacrifié pour que `buildBeforeAfterRows` apparie correctement.
    const culture = describeCultureEffect(resolved.culture, selections);
    const cultureRows = culture === null
      ? describe(resolved.culture)
      : [{ key: "culture", ...culture }];

    return [...describe(resolved.production), ...cultureRows, ...describe(resolved.bonuses)];
  };

  // Baisser le niveau courant rabote les niveaux retirés : on ne descend jamais
  // sous le niveau 1.
  const handleCurrentLevelChange = (value: number) => {
    onUpdate({
      currentLevel: value,
      sacrificeLevel: value - Math.min(levelsRemoved, value - 1),
    });
  };

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
          {/* Le nom et le bouton de retrait SEULS sur la première ligne.
              L'ère y tenait une boîte de 176 px : avec la vignette, il ne
              restait pas 60 px pour le nom sur un écran de téléphone. Elle
              rejoint les deux autres sélecteurs, qui décrivent comme elle le
              bâtiment — la rangée passe à la ligne quand il le faut. */}
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {building.name}
            </p>
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
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Era
              </span>
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={era}
                onValueChange={(value) => onUpdate({ era: value as EraCode })}
                options={ERA_OPTIONS}
                placeholder="Era"
                className="w-44"
                selectClassName="h-9 rounded-lg"
                drawerBtnClassName="h-9"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Current level
              </span>
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={String(card.currentLevel)}
                onValueChange={(value) => handleCurrentLevelChange(Number(value))}
                options={levelOptions(building.maxLevel)}
                placeholder="Current level"
                className="w-28"
                selectClassName="h-9 rounded-lg"
                drawerBtnClassName="h-9"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Levels removed
              </span>
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={String(levelsRemoved)}
                onValueChange={(value) =>
                  onUpdate({ sacrificeLevel: card.currentLevel - Number(value) })
                }
                options={Array.from({ length: card.currentLevel }, (_, i) => ({
                  value: String(i),
                  label: String(i),
                }))}
                placeholder="0"
                className="w-28"
                selectClassName="h-9 rounded-lg"
                drawerBtnClassName="h-9"
                disabled={card.currentLevel === 1}
              />
            </div>
            <span
              className={cn(
                "rounded-md border px-2 py-1 text-[12px] font-semibold tabular-nums",
                tokens > 0
                  ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                  : "border-border bg-background-100 text-muted-foreground",
              )}
            >
              {tokens > 0 ? `-${tokens}` : tokens} token{tokens !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Bonus
        </p>
        <BeforeAfterTable
          rows={buildBeforeAfterRows(
            bonusesAt(card.currentLevel),
            bonusesAt(card.sacrificeLevel),
          )}
          compact
          levelRow={{
            before: `Lv. ${card.currentLevel}`,
            after: `Lv. ${card.sacrificeLevel}`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Carte du vault agrégée ─────────────────────────────────────────────────

function VaultAggregateCard({
  vault,
  vaultLevel,
  onVaultLevelChange,
  totalTokens,
  selections,
}: {
  vault: ResolvedHeritageVault;
  vaultLevel: number;
  onVaultLevelChange: (level: number) => void;
  totalTokens: number;
  selections: string[][];
}) {
  // La clé inclut le niveau : changer de niveau remet la progression à zéro
  // sans effet dédié, le palier suivant n'ayant pas le même coût.
  const [xpProgress, setXpProgress] = useSessionStorageState<number>(
    `heritage-sacrifice-xp:${vault.themeId}:${vaultLevel}`,
    0,
  );

  const xpMax = getHeritageUpgradeCost(vault.key, vaultLevel)?.xp ?? 0;
  const target = computeTargetVaultLevel(vault.key, vaultLevel, totalTokens + xpProgress);
  const targetLevel = target?.targetLevel ?? vaultLevel;
  const diff = diffVaultLevels(vault.key, vaultLevel, targetLevel, vault.era);
  // `diff.before`/`diff.after` aplatissent les bonus de TOUS les effets
  // débloqués du vault en une seule liste : grouper par `effectId` avant de
  // chercher la paire culture, sinon `describeCultureEffect` pourrait
  // combiner le `culture_points` d'un effet avec le `culture_range` d'un
  // autre effet débloqué au même palier.
  // Pas d'`amplified` ici : `diffVaultLevels` répond à « qu'est-ce que ce
  // niveau débloque », sur TOUS les effets débloqués — pas seulement ceux
  // équipés (voir sa doc). Amplifier reviendrait à prêter au rang de
  // gardien actuel un bonus qui n'est peut-être même pas posé dans un slot.
  const toRows = (lines: HeritageVaultBonusLine[]) => {
    const byEffect = new Map<string, HeritageVaultBonusLine[]>();
    for (const line of lines) {
      const group = byEffect.get(line.effectId) ?? [];
      group.push(line);
      byEffect.set(line.effectId, group);
    }
    return [...byEffect.entries()].flatMap(([effectId, group]) => {
      const culture = describeCultureEffect(group, selections);
      if (culture !== null) return [{ key: `${effectId}#culture`, ...culture }];
      return group.map((bonus) => ({
        key: bonus.key,
        ...describeHeritageBonus(bonus, selections),
      }));
    });
  };
  const rows = buildBeforeAfterRows(toRows(diff?.before ?? []), toRows(diff?.after ?? []));

  const nextCost = getHeritageUpgradeCost(vault.key, targetLevel)?.xp ?? 0;
  const remaining = target?.remaining ?? 0;

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Current vault level
          </span>
          <ResponsiveSelect
            contentClassName={SELECT_TEN_OPTIONS}
            value={String(vaultLevel)}
            onValueChange={(value) => onVaultLevelChange(Number(value))}
            options={levelOptions(vault.maxLevel)}
            placeholder="Current vault level"
            className="w-44"
            selectClassName="h-9 rounded-lg"
            drawerBtnClassName="h-9"
          />
        </div>
        {xpMax > 0 && (
          <div className="w-40">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Progression XP
            </p>
            <XpProgressBar value={xpProgress} max={xpMax} onValueChange={setXpProgress} />
          </div>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {totalTokens > 0 && (
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[12px] font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              +{totalTokens} tokens
            </span>
          )}
          {target !== null && target.levelsGained > 0 && (
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[12px] font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              +{target.levelsGained} level{target.levelsGained > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <BeforeAfterTable
          rows={rows}
          levelLabel="Vault building level"
          levelRow={{
            before:
              xpProgress > 0 && xpMax > 0
                ? `Lv. ${vaultLevel} (+${xpProgress}/${xpMax})`
                : `Lv. ${vaultLevel}`,
            after:
              remaining > 0 && nextCost > 0
                ? `Lv. ${targetLevel} (+${remaining}/${nextCost})`
                : `Lv. ${targetLevel}`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Onglet ─────────────────────────────────────────────────────────────────

export function SacrificeTab({
  vault,
  eligibleBuildings,
  selections,
}: {
  vault: ResolvedHeritageVault;
  eligibleBuildings: HeritageEligibleBuilding[];
  selections: string[][];
}) {
  const [cards, setCards] = useSessionStorageState<CardState[]>(
    `heritage-sacrifice-cards:${vault.themeId}`,
    [],
  );
  const [localVaultLevel, setLocalVaultLevel] = useSessionStorageState<number>(
    `heritage-sacrifice-level:${vault.themeId}`,
    vault.level,
  );
  const [inventory, setInventory] = useSessionStorageState<Record<string, number>>(
    `heritage-sacrifice-inventory:${vault.themeId}`,
    {},
  );
  const [picker, setPicker] = useState<BuildingPicker | null>(null);
  // Le panneau d'inventaire est une SAISIE, pas une lecture : sur un écran de
  // téléphone il occupait 150 px avant même qu'on ait ajouté un bâtiment.
  // Déplié d'office sur desktop où la place existe, replié en dessous — le
  // repli garde les jetons déjà saisis en pastilles, rien ne disparaît.
  // Motif « adjusting state when a prop changes » : le choix manuel du joueur
  // tient tant qu'il ne change pas de largeur d'écran.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [prevIsDesktop, setPrevIsDesktop] = useState(isDesktop);
  if (isDesktop !== prevIsDesktop) {
    setPrevIsDesktop(isDesktop);
    setInventoryOpen(isDesktop);
  }

  const buildingOf = (buildingId: string) =>
    eligibleBuildings.find((candidate) => candidate.buildingId === buildingId);

  const updateCard = (id: string, updates: Partial<CardState>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    );
  };

  const pickBuilding = (buildingId: string) => {
    if (picker?.mode === "edit") {
      updateCard(picker.cardId, {
        buildingId,
        currentLevel: 1,
        sacrificeLevel: 1,
        era: LAST_ERA,
      });
    } else {
      setCards((prev) => [
        ...prev,
        {
          id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          buildingId,
          currentLevel: 1,
          sacrificeLevel: 1,
          era: LAST_ERA,
        },
      ]);
    }
    setPicker(null);
  };

  // Jamais deux cartes pour le même bâtiment ; en édition, celui de la carte
  // courante reste sélectionnable.
  const pickerBuildings = eligibleBuildings.filter(
    (building) =>
      !cards.some(
        (card) =>
          card.buildingId === building.buildingId &&
          (picker?.mode !== "edit" || card.id !== picker.cardId),
      ),
  );

  const inventoryTotal = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);
  // L'aperçu du panneau replié : les jetons réellement possédés, dans l'ordre
  // du catalogue. Vide quand l'inventaire l'est — replier n'affiche alors rien
  // du tout, plutôt qu'une rangée de zéros.
  const ownedTokens = eligibleBuildings
    .map((building) => ({ building, qty: inventory[building.tokenDefinitionId] ?? 0 }))
    .filter(({ qty }) => qty > 0);
  const totalTokens =
    cards.reduce((sum, card) => {
      const building = buildingOf(card.buildingId);
      if (building === undefined) return sum;
      return (
        sum +
        tokensFromBuildingLevels(
          building.tiers,
          card.currentLevel,
          card.currentLevel - card.sacrificeLevel,
        )
      );
    }, 0) + inventoryTotal;

  if (eligibleBuildings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No eligible evolving building for this theme — nothing to sacrifice.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex w-full items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Tokens in inventory
              </p>
              {/* Le total vit à CÔTÉ DU TITRE, pas dans le panneau : il compte
                  dans le sacrifice que le panneau soit ouvert ou replié, et
                  posé à l'intérieur il disparaissait au repli — ou changeait de
                  place à chaque bascule. */}
              {inventoryTotal > 0 && (
                <span className="shrink-0 rounded-md border border-border bg-background-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {inventoryTotal} token{inventoryTotal !== 1 ? "s" : ""}
                </span>
              )}
              <div className="flex-1" />
              <button
                onClick={() => setInventoryOpen((open) => !open)}
                className="shrink-0 cursor-pointer rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/40"
              >
                {inventoryOpen ? "Hide panel" : "Show panel"}
              </button>
            </div>
            {!inventoryOpen && ownedTokens.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {ownedTokens.map(({ building, qty }) => (
                  <TokenInventoryBadge
                    key={building.tokenDefinitionId}
                    building={building}
                    qty={qty}
                  />
                ))}
              </div>
            )}
            {inventoryOpen && (
              <div className="mt-2 rounded-xl border border-border bg-card p-3 shadow-sm">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {eligibleBuildings.map((building) => (
                    <TokenInventoryCard
                      key={building.tokenDefinitionId}
                      building={building}
                      qty={inventory[building.tokenDefinitionId] ?? 0}
                      onQtyChange={(value) =>
                        setInventory((prev) => ({
                          ...prev,
                          [building.tokenDefinitionId]: value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Evolving buildings
          </p>
          {cards.map((card) => {
            const building = buildingOf(card.buildingId);
            if (building === undefined) return null;
            return (
              <SacrificeCard
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
          {cards.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Add an evolving building to simulate a sacrifice.
              </p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Vault comparison
          </p>
          <VaultAggregateCard
            vault={vault}
            vaultLevel={Math.min(localVaultLevel, vault.maxLevel)}
            onVaultLevelChange={setLocalVaultLevel}
            totalTokens={totalTokens}
            selections={selections}
          />
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
            <p className="p-4 text-sm text-muted-foreground">
              No more buildings available.
            </p>
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
                  <span className="w-full truncate px-1.5 py-1.5 text-center text-[11px] font-medium leading-tight">
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
