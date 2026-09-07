"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Download, Info, Plus, TrendingUp, X } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";
import {
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  computeTargetKeeperLevel,
  getKeeperReputationCost,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import {
  KEEPER_OFFER_CATALOG,
  KEEPER_SLOTS,
  cumulativeKeeperOfferCost,
  keeperExchangeForecast,
  keeperOfferCost,
  keeperOfferGrowthRatePercent,
  keeperOfferSlot,
  keeperOffersForSlot,
  type KeeperExchangeForecast,
  type KeeperOffer,
  type KeeperSlot,
  type WeeklyKeeperForecastPoint,
} from "@/resolvers/heritage-keeper-offers";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { ResponsiveSelect, SELECT_TEN_OPTIONS } from "@/components/modals/responsive-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EffectIcon } from "@/components/heritage/effect-icon";
import { XpProgressBar } from "@/components/heritage/xp-progress-bar";
import BuildingCounter from "@/components/items/building-counter";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import {
  ALLIED_CIVILIZATION_LABEL_ORDER,
  alliedGoodCivilization,
  baseOfferLabel,
  describeKeeperOffer,
} from "./offer-display";

// ============================================================
// Onglet « Keeper Offers ».
//
// Répond à la question posée par la communauté (Discord, 31/08/2026) : « selon
// ma production hebdomadaire, combien de fois je peux échanger contre de la
// réputation avant la fin de la semaine, sachant que chaque échange coûte plus
// cher que le précédent ? »
//
// ⚠️ LE SENS DE SAISIE EST INVERSÉ PAR RAPPORT À LA V1. On n'entre plus un
// budget hebdomadaire pour en déduire un nombre d'échanges : le joueur ajuste
// directement le NOMBRE D'ÉCHANGES qu'il prévoit de faire (le stepper +/-, le
// même composant que partout ailleurs dans le projet), et le coût / la
// réputation s'affichent en direct. C'est la question réelle du joueur —
// « si j'en fais N, qu'est-ce que ça me coûte et me rapporte ? » — pas un
// problème inverse (« combien puis-je me permettre ? ») qui demandait de
// deviner sa propre production à l'avance.
//
// ⚠️ IL N'Y A PAS DE CATALOGUE PAR VAULT À AFFICHER — LE JOUEUR CHOISIT
// LUI-MÊME, MAIS DANS LE THÈME DE SA CASE. Ce qui est tiré au hasard, c'est
// l'OFFRE, pas l'EMPLACEMENT : chaque case du gardien a un thème fixe, vérifié
// sur 25 vaults (voir `KEEPER_SLOT_BY_CATEGORY`, `resolvers/
// heritage-keeper-offers.ts`) — 1 capital, 2 biens alliés, 3 plans et orbes,
// 4 objets. Le sélecteur n'a donc PLUS d'onglets Capital/Allied/Inventory à
// parcourir : ouvert depuis la case N, il ne montre que les offres de la case
// N, avec le coût du PREMIER échange à l'ère courante — au joueur de
// reconnaître celle qui correspond à son écran, dans une liste 4 fois plus
// courte et où une saisie impossible n'est plus proposée.
//
// ⚠️ LE PANNEAU GARDIEN EST UN BAC À SABLE DISTINCT DE CELUI DE LA COMBINATION
// (clé `localStorage` propre) : rien n'empêche de vouloir simuler un rang de
// départ différent ici. Le bouton d'import copie le rang RÉEL (Dexie), dans un
// seul sens, comme partout ailleurs dans ce module.
//
// ⚠️ UN SEUL JEU DE 4 CASES, DEUX FAÇONS DE LE REMPLIR — PAS DEUX OUTILS.
// La v2 posait un « calculateur avancé » sous les 4 cases, avec son propre
// sélecteur d'offre : le joueur choisissait donc ses offres DEUX fois, pour
// deux totaux et deux barres de gardien qui ne se parlaient pas. Or les deux
// écrans répondent à la même question, seule l'ENTRÉE change :
//
//   • « Manual »          → je saisis le nombre d'échanges, l'app en déduit
//                           le coût et la réputation (le stepper).
//   • « From production » → je saisis mon stock et ma production/jour, l'app
//                           en déduit le NOMBRE d'échanges (le sens budget →
//                           échanges redemandé sur Discord le 04/09/2026).
//
// D'où un `InputMode` global : mêmes 4 cases, même panneau Gardien, même
// barre de projection ; seul le corps des cartes change. Le panneau du bas ne
// garde plus que ce que les cases ne peuvent pas montrer — LE TEMPS : la
// projection semaine par semaine (`keeperExchangeForecast`, reliquat compris)
// des 4 offres menées en parallèle, comme en jeu.
// ============================================================

interface SlotState {
  offerId: string | null;
  /**
   * Le bien allié CHOISI par le joueur — une carte par candidat dans le
   * sélecteur (voir `KeeperOffer.goodCandidates`). `null` pour toute offre
   * qui n'en a qu'un seul possible (tout sauf « Allied culture »).
   */
  good: string | null;
  /** Mode « Manual » : le nombre d'échanges prévus cette semaine. */
  count: number;
  /** Mode « From production » : ce qui est DÉJÀ en réserve pour cette offre. */
  stock: number;
  /** Mode « From production » : production estimée par JOUR (×7 par semaine). */
  dailyProduction: number;
}

/** Voir l'en-tête du fichier : la même case, remplie par le nombre d'échanges ou par la production. */
type InputMode = "manual" | "production";

interface KeeperState {
  level: number;
  points: number;
}

const EMPTY_SLOT: SlotState = {
  offerId: null,
  good: null,
  count: 0,
  stock: 0,
  dailyProduction: 0,
};
const SLOT_COUNT = 4;
const EMPTY_KEEPER: KeeperState = { level: 1, points: 0 };
const DEFAULT_WEEKS = 1;

function emptySlots(): SlotState[] {
  return Array.from({ length: SLOT_COUNT }, () => ({ ...EMPTY_SLOT }));
}

/**
 * Une case relue de `localStorage` d'avant le mode « From production » n'a
 * ni `stock` ni `dailyProduction` : on les remet à 0 à la lecture plutôt que
 * de laisser un `undefined` traverser `keeperExchangeForecast`.
 *
 * ⚠️ ELLE PURGE AUSSI UNE OFFRE HORS THÈME. Les sessions ouvertes avant que
 * les emplacements ne soient thématiques ont pu ranger n'importe quelle offre
 * dans n'importe quelle case (un plan en case 1, par exemple) — une
 * combinaison qui n'existe pas en jeu. On rend la case à son état vide plutôt
 * que d'afficher un choix que le sélecteur ne saurait plus proposer.
 */
function normalizeSlot(slot: SlotState, index: number): SlotState {
  const normalized = { ...EMPTY_SLOT, ...slot };
  if (normalized.offerId !== null && keeperOfferSlot(normalized.offerId) !== slotNumber(index)) {
    return { ...EMPTY_SLOT };
  }
  return normalized;
}

/**
 * Ce que le joueur lit d'un emplacement : son nom et, en une ligne, ce qu'il
 * accepte. Le contenu réel vient de `keeperOffersForSlot` (données) ; cette
 * table ne porte que les mots, comme partout ailleurs dans ce fichier.
 */
const SLOT_META: Record<KeeperSlot, { title: string; hint: string }> = {
  1: { title: "Capital", hint: "Coins, food, research points and your own goods." },
  2: { title: "Allied culture", hint: "Goods from an allied culture." },
  3: { title: "Blueprints & orbs", hint: "Wonder blueprints and wonder orbs." },
  4: { title: "Inventory", hint: "Items from your inventory." },
};

/** L'emplacement (1-4) d'une case, depuis son index dans la grille (0-3). */
function slotNumber(index: number): KeeperSlot {
  return (KEEPER_SLOTS[index] ?? 1) as KeeperSlot;
}

/**
 * La barre « avant/après » du rang de gardien — réponse directe à la demande
 * du joueur : pas juste un « 5/25 » textuel, une barre qui se remplit pour
 * montrer OÙ on se situe et OÙ les échanges de la semaine nous amènent.
 *
 * Deux calques sur une même piste : la position ACTUELLE en clair, la
 * projection APRÈS échanges par-dessus, dans la couleur « gain » utilisée
 * partout ailleurs dans l'app (vert émeraude). Si les points de la semaine
 * font franchir un ou plusieurs paliers, la projection se lit dans le rang
 * D'ARRIVÉE (son propre plafond), avec un badge « Lv X → Y » au-dessus : une
 * barre à cheval sur deux plafonds différents n'aurait aucun sens à lire.
 */
function ReputationForecastBar({
  level,
  points,
  targetLevel,
  remaining,
  currentMax,
  targetMax,
}: {
  level: number;
  points: number;
  targetLevel: number;
  remaining: number;
  currentMax: number | null;
  targetMax: number | null;
}) {
  const leveledUp = targetLevel > level;
  const max = leveledUp ? targetMax : currentMax;
  const before = leveledUp ? 0 : points;
  const after = leveledUp ? remaining : remaining;

  if (max === null || max <= 0) return null;

  const beforePct = Math.min(100, Math.max(0, (before / max) * 100));
  const afterPct = Math.min(100, Math.max(0, (after / max) * 100));

  return (
    <div className="flex flex-col gap-1.5">
      {leveledUp && (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          Level {level}
          <ArrowRight size={10} aria-hidden="true" />
          Level {targetLevel}
        </span>
      )}
      <div className="flex items-center gap-2">
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/40 transition-[width]"
            style={{ width: `${beforePct}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-[width] dark:bg-emerald-400"
            style={{ width: `${afterPct}%` }}
          />
        </div>
        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
          {formatNumber(after)}/{formatNumber(max)}
        </span>
      </div>
    </div>
  );
}

// ─── Panneau Gardien ────────────────────────────────────────────────────────

function KeeperPanel({
  vault,
  keeperState,
  totalReputation,
  horizonLabel,
  onLevelChange,
  onPointsChange,
  onImport,
  children,
}: {
  vault: ResolvedHeritageVault;
  keeperState: KeeperState;
  totalReputation: number;
  /** « THIS WEEK » en mode Manual, « OVER N WEEKS » en mode production. */
  horizonLabel: string;
  onLevelChange: (level: number) => void;
  onPointsChange: (points: number) => void;
  onImport: () => void;
  /** La projection dans le temps, en mode production uniquement — voir `KeeperProjection`. */
  children?: ReactNode;
}) {
  const pointsToNextLevel = getKeeperReputationCost(vault.key, keeperState.level);
  const gain = computeTargetKeeperLevel(vault.key, keeperState.level, keeperState.points + totalReputation);
  const targetLevel = gain?.targetLevel ?? keeperState.level;
  const pointsToLevelAfterTarget = getKeeperReputationCost(vault.key, targetLevel);

  // ⚠️ PAS DE BLOC VAULT EN TÊTE — RETIRÉ SUR DEMANDE. Il n'apporte rien ici :
  // rien dans ce calculateur ne dépend du niveau du vault, seulement de l'ère
  // et du rang de gardien. Le panneau commence donc par ce qu'on vient y
  // régler, le gardien, plutôt que par un rappel décoratif qui repoussait le
  // sélecteur d'un demi-écran vers le bas.
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm min-h-[287px]">
      <div>
        <h3 className="text-sm font-bold text-foreground">Keeper</h3>
        <p className="text-[12px] text-muted-foreground">
          Your rank, and where this plan takes it.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Le rang et son import sur UNE ligne : le bouton est un vrai bouton
            bordé, à hauteur du sélecteur — en lien souligné sous le titre, il
            se lisait comme une note de bas de page plutôt que comme l'action
            « reprendre mes vraies valeurs ». */}
        <div className="flex items-center gap-2">
          <ResponsiveSelect
            contentClassName={SELECT_TEN_OPTIONS}
            value={String(keeperState.level)}
            onValueChange={(value) => onLevelChange(Number(value))}
            options={Array.from({ length: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL }, (_, i) => ({
              value: String(i + 1),
              label: `Level ${i + 1}`,
            }))}
            placeholder="Keeper level"
            className="min-w-0 flex-1"
            selectClassName="h-8 rounded-lg"
            drawerBtnClassName="h-8"
          />
          <button
            onClick={onImport}
            title="Copy your real keeper rank from the Infos tab"
            className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background-100 px-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Download size={13} aria-hidden="true" />
            Import your Keeper level
          </button>
        </div>
        {pointsToNextLevel !== null && (
          <XpProgressBar value={keeperState.points} max={pointsToNextLevel} onValueChange={onPointsChange} />
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {horizonLabel}
        </p>
        <ReputationForecastBar
          level={keeperState.level}
          points={keeperState.points}
          targetLevel={targetLevel}
          remaining={gain?.remaining ?? keeperState.points}
          currentMax={pointsToNextLevel}
          targetMax={pointsToLevelAfterTarget}
        />
        <div className="flex items-center justify-between gap-2 text-[13px] font-medium">
          <span className="text-foreground">Reputation gained</span>
          <span className="tabular-nums text-primary">+{formatNumber(totalReputation)}</span>
        </div>
      </div>

      {children}
    </div>
  );
}

// ─── Sélecteur d'offre ──────────────────────────────────────────────────────

/** Le petit sous-titre d'une section — même style que « THIS WEEK » au panneau Gardien. */
function OfferSectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * Le pourcentage d'augmentation du prix à CHAQUE achat de la semaine — un
 * chip compact, dans le genre des indicateurs de tendance des dashboards
 * financiers (Stripe, Robinhood) : icône + valeur en gras sur un fond
 * ambré, pour qu'il se distingue du badge de réputation (vert/primaire, un
 * GAIN) sans lui faire concurrence — ici c'est un COÛT qui grimpe, la
 * couleur le dit avant même de lire le chiffre.
 */
function GrowthRateChip({ growthRate }: { growthRate: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-xs font-bold tabular-nums text-amber-600 dark:text-amber-300"
      title={`Price rises by ${growthRate}% with every purchase this week`}
    >
      <TrendingUp size={13} aria-hidden="true" strokeWidth={2.5} />+{growthRate}%
    </span>
  );
}

/**
 * Le badge « +N rep », et — quand la formule le permet — le chip de
 * croissance juste à côté. Répond à la demande de la communauté (07/09/2026) :
 * la réputation seule ne dit rien de ce qui change d'un échange à l'autre,
 * une donnée qui n'apparaît nulle part ailleurs à l'écran.
 */
function ReputationBadge({ offer }: { offer: KeeperOffer }) {
  const growthRate = keeperOfferGrowthRatePercent(offer.id);
  return (
    <span className="flex flex-wrap items-center justify-center gap-1">
      <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-xs font-bold tabular-nums text-primary">
        + {offer.reputation} rep
      </span>
      {growthRate !== null && <GrowthRateChip growthRate={growthRate} />}
    </span>
  );
}

/** Une carte d'offre — un bien précis (`good`) pour les offres à candidats, l'offre seule sinon. */
function OfferCard({
  offer,
  good,
  vault,
  selections,
  onPick,
}: {
  offer: KeeperOffer;
  good: string | null;
  vault: ResolvedHeritageVault;
  selections: string[][];
  onPick: (offerId: string, good: string | null) => void;
}) {
  const display = describeKeeperOffer(offer, vault.era, selections, good ?? undefined);
  const firstCost = keeperOfferCost(offer.id, 0, vault.era);
  return (
    <button
      onClick={() => onPick(offer.id, good)}
      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:bg-muted/50"
    >
      <EffectIcon src={display.src} alt={display.label} size={36} />
      <span className="truncate text-[13px] font-medium text-foreground">
        {baseOfferLabel(display.label)}
      </span>
      <span className="text-[14px] font-bold tabular-nums text-foreground">
        {firstCost === null ? "—" : formatNumber(firstCost)}
      </span>
      <ReputationBadge offer={offer} />
    </button>
  );
}

/**
 * Une carte par OFFRE, sauf pour celles à candidats (Allied culture) — une
 * carte par BIEN allié dans ce cas, voir la doc de `KeeperOffer.goodCandidates`.
 * Partagé par les sections Capital/Goods/Inventory ; Allied culture construit
 * sa propre liste `{offer, good}` pour grouper par civilisation avant rendu.
 */
function offerCards(
  offers: KeeperOffer[],
  vault: ResolvedHeritageVault,
  selections: string[][],
  onPick: (offerId: string, good: string | null) => void,
) {
  return offers.flatMap((offer) => {
    const candidates = offer.goodCandidates ?? [null];
    return candidates.map((good) => (
      <OfferCard
        key={good === null ? offer.id : `${offer.id}:${good}`}
        offer={offer}
        good={good}
        vault={vault}
        selections={selections}
        onPick={onPick}
      />
    ));
  });
}

function OfferPicker({
  slot,
  vault,
  selections,
  onPick,
}: {
  /** L'emplacement d'où le sélecteur a été ouvert — il décide de ce qu'on voit. */
  slot: KeeperSlot;
  vault: ResolvedHeritageVault;
  selections: string[][];
  onPick: (offerId: string, good: string | null) => void;
}) {
  // ⚠️ PLUS D'ONGLETS — le thème de la case remplace le filtre manuel. Une
  // case ne peut recevoir que les offres de son emplacement (voir l'en-tête du
  // fichier), donc les onglets Capital/Allied/Inventory ne faisaient que
  // proposer trois écrans dont deux menaient à un choix impossible en jeu.
  const offers = keeperOffersForSlot(slot);

  // Case 1 : deux sections sous-titrées (le capital brut, puis les biens
  // d'atelier) — c'est la seule case dont le contenu recouvre deux catégories
  // de données, et la distinction reste utile à l'œil.
  const capitalOffers = offers.filter((offer) => offer.category === "capital");
  const goodsOffers = offers.filter((offer) => offer.category === "goods");

  // Case 2 : une entrée par BIEN, pas par palier de prix — voir `OfferCard` /
  // la doc de `goodCandidates`. Aplati d'abord pour pouvoir grouper par
  // civilisation ensuite, indépendamment du palier dont chaque bien provient.
  const alliedItems = offers.flatMap((offer) =>
    (offer.goodCandidates ?? []).map((good) => ({ offer, good })),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-3 mb-14">
        {slot === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <OfferSectionTitle>Capital</OfferSectionTitle>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {offerCards(capitalOffers, vault, selections, onPick)}
              </div>
            </div>
            <div>
              <OfferSectionTitle>Goods</OfferSectionTitle>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {offerCards(goodsOffers, vault, selections, onPick)}
              </div>
            </div>
          </div>
        )}

        {slot === 2 && (
          <div className="flex flex-col gap-5">
            {ALLIED_CIVILIZATION_LABEL_ORDER.map((civilization) => {
              const items = alliedItems.filter(
                (item) => alliedGoodCivilization(item.good) === civilization,
              );
              if (items.length === 0) return null;
              return (
                <div key={civilization}>
                  <OfferSectionTitle>{civilization}</OfferSectionTitle>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {items.map(({ offer, good }) => (
                      <OfferCard
                        key={`${offer.id}:${good}`}
                        offer={offer}
                        good={good}
                        vault={vault}
                        selections={selections}
                        onPick={onPick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(slot === 3 || slot === 4) && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {offerCards(offers, vault, selections, onPick)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Une case du gardien ────────────────────────────────────────────────────

function OfferSlotCard({
  slot,
  slotIndex,
  vault,
  selections,
  mode,
  weeks,
  forecast,
  onPickerOpen,
  onClear,
  onCountChange,
  onStockChange,
  onProductionChange,
}: {
  slot: SlotState;
  /** L'emplacement du gardien (1-4) — décide de ce que la case accepte. */
  slotIndex: KeeperSlot;
  vault: ResolvedHeritageVault;
  selections: string[][];
  mode: InputMode;
  /** L'horizon global — sert à libeller le récapitulatif en mode production. */
  weeks: number;
  /** La projection de CETTE case sur l'horizon, `null` en mode Manual. */
  forecast: KeeperExchangeForecast | null;
  onPickerOpen: () => void;
  onClear: () => void;
  onCountChange: (count: number) => void;
  onStockChange: (stock: number) => void;
  onProductionChange: (dailyProduction: number) => void;
}) {
  const offer: KeeperOffer | undefined = KEEPER_OFFER_CATALOG.find(
    (candidate) => candidate.id === slot.offerId,
  );

  // ⚠️ LA CASE VIDE ANNONCE SON THÈME, pas un « Add offer » interchangeable :
  // c'est l'information qui manquait au joueur devant son écran de jeu, et
  // elle évite d'ouvrir une modale pour découvrir ce qu'elle contient.
  if (offer === undefined) {
    return (
      <button
        onClick={onPickerOpen}
        className="flex min-h-[287px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border px-2 text-center text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="size-4" aria-hidden="true" />
        <span className="text-[12px] font-semibold">{SLOT_META[slotIndex].title}</span>
        <span className="text-[11px] text-muted-foreground">Slot {slotIndex}</span>
      </button>
    );
  }

  const display = describeKeeperOffer(offer, vault.era, selections, slot.good ?? undefined);
  // ⚠️ LE MONTANT EN TÊTE DE CARTE N'A PAS LE MÊME SENS SELON LE MODE. En
  // « Manual », c'est le coût du PROCHAIN échange, qui monte au fil du stepper
  // (le joueur suit la courbe qu'il gravit). En « production », le nombre
  // d'échanges est une SORTIE : le seul montant qui a du sens à afficher est
  // celui du premier échange de la semaine, exactement ce qu'affiche le jeu.
  const nextCost = keeperOfferCost(offer.id, mode === "manual" ? slot.count : 0, vault.era);
  const growthRate = keeperOfferGrowthRatePercent(offer.id);

  const manualCost = cumulativeKeeperOfferCost(offer.id, vault.era, slot.count);
  const manualReputation = slot.count * offer.reputation;

  const count = mode === "manual" ? slot.count : (forecast?.totalCount ?? 0);
  const spent = mode === "manual" ? manualCost : (forecast?.totalSpent ?? 0);
  const reputation = mode === "manual" ? manualReputation : (forecast?.totalReputation ?? 0);

  // ⚠️ MISE EN PAGE CALQUÉE SUR LA CARTE D'ÉCHANGE DU JEU : « You give » en
  // tête, icône + montant EXACT au centre (jamais un mot comme « small » /
  // « medium »), badge de réputation, puis — à la place du bouton orange
  // « Exchange » — l'entrée du mode courant : le stepper, ou le couple
  // stock / production dont l'app déduit le nombre d'échanges.
  return (
    <div className="group/case relative flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <button
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
        className="absolute right-2 top-2 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white/80 opacity-0 transition-opacity hover:bg-black/80 hover:text-white group-hover/case:opacity-100"
        title="Remove"
      >
        <X className="size-3" aria-hidden="true" />
      </button>

      <button
        onClick={onPickerOpen}
        className="flex cursor-pointer flex-col items-center gap-1.5 text-center"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          You give
        </span>
        <EffectIcon src={display.src} alt={display.label} size={44} />
        <span className="truncate text-[12px] font-medium text-muted-foreground hover:underline">
          {baseOfferLabel(display.label)}
        </span>
        <span className="text-lg font-bold tabular-nums text-foreground">
          {nextCost === null ? "—" : formatNumber(nextCost)}
        </span>
        <span className="flex flex-wrap items-center justify-center gap-1">
          <span className="rounded-sm bg-primary/15 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
            + {offer.reputation} rep
          </span>
          {growthRate !== null && <GrowthRateChip growthRate={growthRate} />}
        </span>
      </button>

      {mode === "manual" ? (
        <div className="flex justify-center">
          <BuildingCounter
            value={slot.count}
            onChange={onCountChange}
            min={0}
            max={100}
            allowTypedInput
            ariaLabel={`${baseOfferLabel(display.label)} exchanges`}
            triggerLabel="Exchanges"
          />
        </div>
      ) : (
        // Empilés, pas côte à côte : dans une grille de 4 cartes, une case fait
        // ~130 px de large — deux champs sur une ligne y seraient illisibles.
        <div className="flex flex-col gap-2">
          <ForecastNumberField
            label="Current stock"
            placeholder="0"
            value={slot.stock}
            onChange={onStockChange}
          />
          <ForecastNumberField
            label="Production / day"
            placeholder="0"
            value={slot.dailyProduction}
            onChange={onProductionChange}
          />
        </div>
      )}

      {count === 0 ? (
        <p className="text-center text-[12px] text-muted-foreground">
          {mode === "manual"
            ? "Exchanges planned this week."
            : slot.stock === 0 && slot.dailyProduction === 0
              ? "Enter stock and output."
              : "Not enough for one exchange."}
        </p>
      ) : (
        // ⚠️ « Next » RETIRÉ SUR DEMANDE — seul ce qui est déjà engagé compte
        // ici, pas le prochain palier de la courbe. Mini-tableau 2 colonnes
        // (légende / valeur) plutôt qu'une phrase : Lost cumule la ressource
        // cédée (rouge, en négatif — c'est une perte), Gain la réputation
        // obtenue (vert, en positif) — même code couleur que le reste de
        // l'app pour un « avant/après ». En mode production les deux portent
        // sur TOUT l'horizon, d'où la ligne « exchanges » qui le rappelle :
        // c'est une sortie du calcul, pas une valeur saisie.
        <div className="flex flex-col gap-1 rounded-md bg-background-100 px-2.5 py-1.5 text-[12px]">
          {mode === "production" && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">
                {weeks === 1 ? "1 week" : `${weeks} weeks`}
              </span>
              <span className="font-semibold tabular-nums text-foreground">{count} ×</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Lost</span>
            <span className="font-semibold tabular-nums text-red-600 dark:text-red-400">
              {spent === null ? "—" : `-${formatNumber(spent)}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Gain</span>
            <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              +{formatNumber(reputation)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panneau de prévision avancé ────────────────────────────────────────────

/**
 * Un champ numérique LIBRE (pas un stepper) : le stock ou la production
 * journalière peuvent monter dans les centaines de milliers, où cliquer sur
 * +/- n'a aucun sens. `inputMode="numeric"`, pas `type="number"` — même choix
 * que `BuildingCounter` (`components/items/building-counter.tsx`) : pas de
 * flèches natives ni de défilement à la molette qui change la valeur par
 * accident.
 *
 * ⚠️ DEUX AFFICHAGES POUR UNE SEULE VALEUR — demandé nommément : « 2000000 »
 * ne se lit pas, il se compte. Le champ montre donc les CHIFFRES BRUTS tant
 * qu'on est dedans (on ne peut pas éditer « 2,00 M » au clavier), avec un
 * aperçu abrégé en gris collé à droite dès que le nombre mérite d'être
 * abrégé ; à la sortie du champ, la valeur elle-même passe en abrégé
 * (`formatNumber`, le même « 1,50 B » / « 2,00 M » que partout ailleurs dans
 * l'app). Rien n'est perdu au passage : c'est le nombre exact qui reste en
 * état, seul son rendu change.
 */
function ForecastNumberField({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
}) {
  // `null` = champ au repos (valeur abrégée) ; une chaîne = en cours de
  // saisie, et c'est elle qui s'affiche, y compris vide sous les doigts de
  // qui efface tout — sans se rétablir en « 0 ».
  const [draft, setDraft] = useState<string | null>(null);
  const editing = draft !== null;

  const abbreviated = formatNumber(value);
  // En dessous de 10 000, le nombre brut se lit déjà d'un coup d'œil : un
  // aperçu n'apporterait rien et ne ferait que voler de la place au champ.
  const preview = editing && value >= 10_000 ? abbreviated : null;

  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          placeholder={placeholder}
          value={editing ? draft : value === 0 ? "" : abbreviated}
          onFocus={() => setDraft(value === 0 ? "" : String(value))}
          onChange={(event) => {
            const digits = event.target.value.replace(/[^0-9]/g, "");
            setDraft(digits);
            onChange(digits === "" ? 0 : Number(digits));
          }}
          onBlur={() => setDraft(null)}
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-background-100 px-2.5 text-[13px] font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
            preview !== null && "pr-14",
          )}
        />
        {preview !== null && (
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] font-semibold tabular-nums text-muted-foreground">
            {preview}
          </span>
        )}
      </div>
    </label>
  );
}

const FORECAST_WEEK_OPTIONS = [1, 2, 4, 8, 13];

/** Une case renseignée, avec sa projection — l'entrée du tableau de projection. */
interface SlotForecast {
  index: number;
  offer: KeeperOffer;
  label: string;
  src: string;
  forecast: KeeperExchangeForecast;
}

/** Le détail d'une semaine, offre par offre — même charpente que
 * `ContributionsTable` (onglet Combination) : un en-tête en petites capitales
 * et des colonnes alignées, pas une liste à puces. C'est le SEUL endroit où
 * la ressource dépensée apparaît (voir la doc de `KeeperProjection`). */
function WeekBreakdown({
  lines,
}: {
  lines: { entry: SlotForecast; point: WeeklyKeeperForecastPoint }[];
}) {
  return (
    <div className="mx-2 mb-1.5 overflow-hidden rounded-lg border border-border/60">
      <div className="grid grid-cols-[1fr_46px_84px] bg-muted/20 py-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground/75">
        <div className="px-3">Offer</div>
        <div className="text-center">×</div>
        <div className="text-center">Spent</div>
      </div>
      {lines.map(({ entry, point }) => (
        <div
          key={entry.index}
          className="grid grid-cols-[1fr_46px_84px] items-center border-t border-border/60 py-1.5"
        >
          <div className="flex min-w-0 items-center gap-1.5 px-3">
            <EffectIcon src={entry.src} alt="" size={18} />
            <span className="truncate text-[12px] text-foreground">{entry.label}</span>
          </div>
          <span className="text-center text-[12px] font-semibold tabular-nums text-foreground">
            {point.count}
          </span>
          <span className="text-center text-[12px] font-semibold tabular-nums text-red-600 dark:text-red-400">
            -{formatNumber(point.spent)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * LA PROJECTION DANS LE TEMPS — la seule chose que les 4 cases ne peuvent pas
 * montrer, et donc la seule raison d'être de cette section (voir l'en-tête du
 * fichier : plus de second sélecteur d'offre, plus de second total).
 *
 * ⚠️ SECTION DU PANNEAU GARDIEN, PLUS UNE CARTE À PART — demandé nommément :
 * une projection de réputation qui vit loin de la barre de réputation qu'elle
 * fait bouger obligeait à lire deux endroits pour une seule idée. D'où le
 * `border-t` plutôt qu'un second cadre, et le rendu en `children` de
 * `KeeperPanel`.
 *
 * Une ligne par SEMAINE, agrégée sur les 4 offres menées en parallèle comme en
 * jeu. Le détail par offre est dépliable et non pas déplié : à 13 semaines ×
 * 4 offres, tout afficher donnerait 52 lignes illisibles.
 *
 * ⚠️ LA RESSOURCE DÉPENSÉE NE S'ADDITIONNE PAS ENTRE OFFRES — des pièces, des
 * points de recherche et un bien allié ne sont pas la même unité. Elle
 * n'apparaît donc QUE dans le détail par offre ; les colonnes agrégées se
 * limitent aux échanges et à la réputation, qui, eux, sont commensurables.
 */
function KeeperProjection({
  entries,
  weeks,
  onWeeksChange,
}: {
  entries: SlotForecast[];
  weeks: number;
  onWeeksChange: (weeks: number) => void;
}) {
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  // Le cumul se construit par `reduce` plutôt qu'avec un compteur mutable :
  // une variable réassignée pendant le rendu est refusée par la règle
  // `react-hooks` du projet (et casserait au moindre rendu concurrent).
  const rows = Array.from({ length: weeks }, (_, i) => i).reduce<
    {
      week: number;
      lines: { entry: SlotForecast; point: WeeklyKeeperForecastPoint }[];
      count: number;
      reputation: number;
      cumulative: number;
    }[]
  >((acc, i) => {
    const lines = entries.flatMap((entry) => {
      const point = entry.forecast.weeks[i];
      return point === undefined ? [] : [{ entry, point }];
    });
    const count = lines.reduce((sum, line) => sum + line.point.count, 0);
    const reputation = lines.reduce((sum, line) => sum + line.point.reputation, 0);
    const cumulative = (acc[acc.length - 1]?.cumulative ?? 0) + reputation;
    acc.push({ week: i + 1, lines, count, reputation, cumulative });
    return acc;
  }, []);

  const totalCount = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Projection
        </p>
        <div className="flex gap-1">
          {FORECAST_WEEK_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onWeeksChange(option)}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
                weeks === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-background-100 text-muted-foreground hover:text-foreground",
              )}
            >
              {option}w
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border p-4 text-center text-muted-foreground">
          <span className="text-[13px] font-medium">Nothing to project yet</span>
          <span className="text-[12px]">Pick an offer, then fill in a card.</span>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <div className="grid grid-cols-[1fr_46px_74px_64px] bg-muted/20 py-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground/75">
              <div className="px-2">Week</div>
              <div className="text-center">×</div>
              <div className="text-center">Rep.</div>
              <div className="text-center">Total</div>
            </div>

            {rows.map((row) => {
              const open = openWeek === row.week;
              return (
                <div key={row.week} className="border-t border-border/60">
                  <button
                    onClick={() => setOpenWeek(open ? null : row.week)}
                    aria-expanded={open}
                    className="grid w-full cursor-pointer grid-cols-[1fr_46px_74px_64px] items-center py-1.5 text-left transition-colors hover:bg-muted/40"
                  >
                    <span className="flex items-center gap-1 px-2 text-[13px] font-medium text-foreground">
                      <ChevronDown
                        size={13}
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180",
                        )}
                      />
                      Week {row.week}
                    </span>
                    <span className="text-center text-[13px] font-semibold tabular-nums text-foreground">
                      {row.count}
                    </span>
                    <span className="text-center text-[13px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      +{formatNumber(row.reputation)}
                    </span>
                    <span className="text-center text-[13px] tabular-nums text-muted-foreground">
                      {formatNumber(row.cumulative)}
                    </span>
                  </button>
                  {open && <WeekBreakdown lines={row.lines} />}
                </div>
              );
            })}
          </div>

          <p className="text-center text-[12px] text-muted-foreground">
            {totalCount} exchange{totalCount === 1 ? "" : "s"} over {weeks}{" "}
            {weeks === 1 ? "week" : "weeks"} — leftovers roll over.
          </p>
        </>
      )}
    </div>
  );
}

/** Le sélecteur de mode — voir l'en-tête du fichier : une lentille sur le même état, pas un second outil. */
function ModeSwitch({
  mode,
  onChange,
}: {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
}) {
  const options: { value: InputMode; label: string }[] = [
    { value: "manual", label: "Manual" },
    { value: "production", label: "From my production" },
  ];

  return (
    // ⚠️ MÊME HABILLAGE QUE LE SEGMENTÉ DE LEVEL TABLE (`AXIS_OPTIONS`,
    // `progression-tab.tsx`) — repris à l'identique sur demande : cadre
    // `border border-border p-0.5`, pastille active `bg-background
    // shadow-sm`, `text-[13px] font-medium`. Et même traitement pour le
    // texte d'accompagnement : une icône `Info` + popover au clic, pas une
    // phrase permanente à côté — elle suffit à dire qu'il y a plus à lire
    // sans pousser les 4 cases plus bas sur mobile.
    <div className="flex items-center gap-2">
      <div className="inline-flex rounded-lg border border-border p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={mode === option.value}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              mode === option.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="More details about this mode"
            className="cursor-pointer rounded-full p-0.5 text-muted-foreground/90 hover:text-foreground"
          >
            <Info size={18} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-3 text-sm text-muted-foreground">
          {mode === "manual"
            ? "You set the number of exchanges."
            : "You set your stock and daily output."}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function KeeperOffersTab({
  vault,
  selections,
}: {
  vault: ResolvedHeritageVault;
  selections: string[][];
}) {
  const [storedSlots, setSlots] = useLocalStorageState<SlotState[]>(
    `heritage-keeper-offers:${vault.themeId}`,
    emptySlots(),
  );
  const [keeperState, setKeeperState] = useLocalStorageState<KeeperState>(
    `heritage-keeper-offers-keeper:${vault.themeId}`,
    EMPTY_KEEPER,
  );
  const [mode, setMode] = useLocalStorageState<InputMode>(
    `heritage-keeper-offers-mode:${vault.themeId}`,
    "manual",
  );
  const [weeks, setWeeks] = useLocalStorageState<number>(
    `heritage-keeper-offers-weeks:${vault.themeId}`,
    DEFAULT_WEEKS,
  );
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const pickerSlot = pickerIndex === null ? null : slotNumber(pickerIndex);

  const slots = storedSlots.map(normalizeSlot);

  const updateSlot = (index: number, updates: Partial<SlotState>) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...normalizeSlot(slot, i), ...updates } : slot)),
    );
  };

  // Une projection par case — calculée dans les DEUX modes serait du travail
  // perdu : en « Manual » le nombre d'échanges est saisi, pas projeté.
  const slotForecasts = slots.map((slot) => {
    if (mode !== "production" || slot.offerId === null) return null;
    return keeperExchangeForecast(slot.offerId, vault.era, slot.stock, slot.dailyProduction, weeks);
  });

  // ⚠️ UN SEUL TOTAL, CELUI DU MODE COURANT — c'est lui qui alimente la barre
  // de projection du gardien, qu'on soit en saisie manuelle ou en projection.
  const totalReputation =
    mode === "manual"
      ? slots.reduce((sum, slot) => {
          const offer = KEEPER_OFFER_CATALOG.find((candidate) => candidate.id === slot.offerId);
          return offer === undefined ? sum : sum + slot.count * offer.reputation;
        }, 0)
      : slotForecasts.reduce((sum, forecast) => sum + (forecast?.totalReputation ?? 0), 0);

  const projectionEntries: SlotForecast[] = slots.flatMap((slot, index) => {
    const offer = KEEPER_OFFER_CATALOG.find((candidate) => candidate.id === slot.offerId);
    const forecast = slotForecasts[index];
    if (offer === undefined || forecast === null || forecast === undefined) return [];
    const display = describeKeeperOffer(offer, vault.era, selections, slot.good ?? undefined);
    return [
      { index, offer, label: baseOfferLabel(display.label), src: display.src, forecast },
    ];
  });

  return (
    <div className="flex flex-col gap-6">
      <ModeSwitch mode={mode} onChange={setMode} />

      {/* ⚠️ PALIER EN PIXELS, PAS `lg:` — CORRIGÉ SUR SIGNALEMENT. Le passage
          en deux colonnes à `lg` (1024 px) ouvrait une plage catastrophique
          jusqu'à `xl` : la colonne de gauche y tombait à ~540 px, largeur à
          laquelle 4 cartes portant chacune deux champs de saisie sont
          écrasées. Le palier est donc posé à la largeur où les deux colonnes
          tiennent VRAIMENT (1200 px), mesurée sur le contenu et pas héritée de
          l'échelle Tailwind. Proportions inchangées, celles de l'onglet
          Overview (`heritage-vault-view.tsx`). */}
      <div className="grid grid-cols-1 gap-6 min-[1200px]:grid-cols-[1.3fr_1fr] min-[1200px]:items-start">
        {/* ⚠️ REQUÊTE DE CONTENEUR, PAS DE FENÊTRE — même correctif que
            `TotalSummary` (`total-summary.tsx`). Cette colonne vit tantôt en
            pleine largeur (mobile), tantôt dans les ~57 % gauche de la grille
            `lg` : entre `lg` et `xl`, cette portion tombe sous la largeur dont
            4 cartes (chacune avec son stepper +/-) ont besoin, et un palier en
            `lg:`/`xl:` — qui lit la FENÊTRE, pas la colonne — les laissait
            déborder avec les boutons +/- inaccessibles. Le palier porte donc
            sur la largeur réelle du conteneur : 2 colonnes tant qu'il n'y a pas
            la place pour 4, quatre dès qu'il y en a de nouveau — que l'écran
            soit étroit (mobile) OU large mais avec le panneau gardien à côté. */}
        {/* ⚠️ LES 4 CASES RESTENT À L'ÉCRAN — demandé nommément : le panneau de
            droite grandit avec l'horizon de projection (13 semaines = 13
            lignes), et sans `sticky` les cartes qu'on est en train de régler
            sortaient par le haut dès qu'on descendait lire le tableau. Même
            convention que Combination et Sacrifice (`sticky top-16`), au même
            palier que la grille ci-dessus : en dessous, les deux colonnes sont
            empilées et coller la première n'aurait aucun sens. */}
        <div className="@container min-[1200px]:sticky min-[1200px]:top-16">
          {/* 660 px, pas 560 : c'est la largeur en dessous de laquelle une
              carte du mode production (deux champs + récapitulatif) passe sous
              ~155 px et devient illisible. Requête de CONTENEUR, pas de
              fenêtre — cette colonne vit tantôt en pleine largeur, tantôt dans
              les ~57 % gauche de la grille. */}
          <div className="grid grid-cols-2 gap-3 @min-[660px]:grid-cols-4">
            {slots.map((slot, index) => (
              <OfferSlotCard
                key={index}
                slot={slot}
                slotIndex={slotNumber(index)}
                vault={vault}
                selections={selections}
                mode={mode}
                weeks={weeks}
                forecast={slotForecasts[index]}
                onPickerOpen={() => setPickerIndex(index)}
                onClear={() => updateSlot(index, { ...EMPTY_SLOT })}
                onCountChange={(count) => updateSlot(index, { count })}
                onStockChange={(stock) => updateSlot(index, { stock })}
                onProductionChange={(dailyProduction) => updateSlot(index, { dailyProduction })}
              />
            ))}
          </div>
        </div>

        <KeeperPanel
          vault={vault}
          keeperState={keeperState}
          totalReputation={totalReputation}
          horizonLabel={
            mode === "manual" ? "This week" : `Over ${weeks} ${weeks === 1 ? "week" : "weeks"}`
          }
          onLevelChange={(level) => setKeeperState((prev) => ({ ...prev, level }))}
          onPointsChange={(points) => setKeeperState((prev) => ({ ...prev, points }))}
          onImport={() =>
            setKeeperState({
              level: vault.keeper.reputationLevel,
              points: vault.keeper.reputationPoints,
            })
          }
        >
          {/* La projection n'existe qu'en mode production : en « Manual », il
              n'y a qu'une semaine, déjà entièrement lue dans les cases et
              dans la barre de réputation juste au-dessus. */}
          {mode === "production" && (
            <KeeperProjection entries={projectionEntries} weeks={weeks} onWeeksChange={setWeeks} />
          )}
        </KeeperPanel>
      </div>

      {/* ⚠️ UNE SEULE MODALE, DONT LE CONTENU DÉPEND DE LA CASE OUVERTE — plus
          d'onglets à parcourir. Le titre porte donc le numéro et le thème de
          l'emplacement : c'est la seule chose qui distingue une ouverture
          d'une autre, et elle doit être lisible avant de choisir. */}
      <ResponsiveModal
        title={pickerSlot === null ? "Choose an offer" : SLOT_META[pickerSlot].title}
        trigger={<span className="hidden" aria-hidden="true" />}
        open={pickerIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPickerIndex(null);
        }}
        className="flex h-[80vh] flex-col gap-0 overflow-hidden p-0 md:h-[min(640px,75vh)] md:max-w-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold">
              {pickerSlot === null
                ? "Choose an offer"
                : `Slot ${pickerSlot} — ${SLOT_META[pickerSlot].title}`}
            </h3>
            {pickerSlot !== null && (
              <p className="text-[12px] text-muted-foreground">{SLOT_META[pickerSlot].hint}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setPickerIndex(null)}
            className="shrink-0 cursor-pointer text-[14px] text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        {pickerIndex !== null && pickerSlot !== null && (
          <OfferPicker
            slot={pickerSlot}
            vault={vault}
            selections={selections}
            onPick={(offerId, good) => {
              updateSlot(pickerIndex, { offerId, good, count: 0 });
              setPickerIndex(null);
            }}
          />
        )}
      </ResponsiveModal>
    </div>
  );
}
