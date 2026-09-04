"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ERAS } from "@/data/config";
import type { EraCode } from "@/types/shared";
import {
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  HERITAGE_VAULTS,
  computeTargetVaultLevel,
  getEligibleEvolvingBuildings,
  getHeritageVaultBySlug,
  heritageVaultSlug,
  resolveHeritageVault,
} from "@/resolvers/heritage";
import {
  getHeritageVaultPortraitUrl,
  preloadHeritageVaultPortraits,
} from "@/resolvers/heritage-portraits";
import {
  equipHeritageEffect,
  unequipHeritageEffect,
  updateUserHeritageVault,
  useUserHeritageVault,
} from "@/lib/stores/heritage-store";
import {
  hydrateBuildingSelectionsStore,
  useBuildingSelectionsStore,
} from "@/lib/stores/building-selections-store";
import {
  useHeritageVaultEra,
  useSetHeritageVaultEra,
} from "@/lib/stores/heritage-vault-page-store";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { BuildingImage } from "@/components/heritage/building-image";
import { SacrificeTab } from "@/components/heritage/compare/sacrifice-tab";
import { CombinationTab } from "@/components/heritage/combination/combination-tab";
import { KeeperOffersTab } from "@/components/heritage/keeper-offers/keeper-offers-tab";
import { ProgressionTab } from "@/components/heritage/progression/progression-tab";
import { VaultHeader } from "@/components/heritage/vault-view/vault-header";
import {
  VaultTabs,
  heritageTabId,
  heritageTabPanelId,
} from "@/components/heritage/vault-view/vault-tabs";
import { EffectBlock } from "@/components/heritage/vault-view/effect-block";
import { ResetEffectGroupButton } from "@/components/heritage/vault-view/reset-effect-group-button";
import { ShowCostsToggle } from "@/components/heritage/vault-view/show-costs-toggle";
import { TotalSummary } from "@/components/heritage/vault-view/total-summary";
import { OverviewTable } from "@/components/heritage/vault-view/overview-table";
import { EligibleBuildingsList } from "@/components/heritage/vault-view/eligible-buildings-list";
import { HeritageVaultSkeleton } from "@/components/heritage/vault-view/vault-skeleton";
import {
  DEFAULT_HERITAGE_TAB,
  getHeritageTabBySlug,
  heritageTabSlug,
  type HeritageTab,
} from "@/components/heritage/vault-view/constants";

/**
 * Query string de `/vault` : `?b=<bâtiment>&tab=<onglet>` (ex. `?b=ath&tab=progression`).
 * Une seule route statique, jamais de segment dynamique — copier-coller l'URL
 * suffit à partager le même bâtiment/onglet SANS provoquer la moindre
 * navigation Next (voir `syncQueryString` : `history.replaceState` brut, pas
 * `router.replace`, pour ne jamais redéclencher le layout ni refetcher quoi
 * que ce soit en changeant simplement d'onglet).
 */
const BUILDING_QUERY_PARAM = "b";
const TAB_QUERY_PARAM = "tab";

function readVaultKeyFromLocation(): string | null {
  const slug = new URLSearchParams(window.location.search).get(BUILDING_QUERY_PARAM);
  return slug ? (getHeritageVaultBySlug(slug)?.key ?? null) : null;
}

function readTabFromLocation(): HeritageTab | null {
  const slug = new URLSearchParams(window.location.search).get(TAB_QUERY_PARAM);
  return slug ? getHeritageTabBySlug(slug) : null;
}

function syncQueryString(vaultKey: string, tab: HeritageTab) {
  const params = new URLSearchParams(window.location.search);
  params.set(BUILDING_QUERY_PARAM, heritageVaultSlug(vaultKey));
  params.set(TAB_QUERY_PARAM, heritageTabSlug(tab));
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

// ============================================================
// Page /vault : sélecteur de vault et de niveau en tête, puis les onglets.
//
// Ce fichier n'ORCHESTRE que : il lit l'état joueur (Dexie), l'ère et le
// classement d'ateliers, appelle `resolveHeritageVault` une fois, et distribue
// le résultat. Aucune formule ici — tout vient de `resolvers/heritage.ts`.
//
// L'ère et le rang de gardien ne sont PAS de la progression stockée par vault :
// l'ère est celle du joueur (lue au runtime, jamais figée sur le vault) et
// n'existe donc qu'en session, tandis que le rang de gardien vit bien en Dexie.
// ============================================================

/**
 * Le Heritage Vault ne se débloque qu'à partir de ByzantineEra en jeu. Aucun
 * champ dédié (« minAge » de vault/thème) n'existe dans l'extraction pour le
 * dériver : `HeritageVaultExtract` ne porte que des courbes d'effet indexées
 * par l'ère du JOUEUR (`playerAge`), qui couvrent StoneAge → LateGothicEra
 * par construction du game design (formule générique réutilisée par d'autres
 * features), pas l'ère de déblocage du vault lui-même. D'où la constante
 * explicite, plutôt qu'une dérivation qui donnerait une borne fausse.
 */
const HERITAGE_VAULT_MIN_ERA: EraCode = "BE";
const HERITAGE_VAULT_MIN_ERA_INDEX = ERAS.findIndex(
  (era) => era.abbr === HERITAGE_VAULT_MIN_ERA,
);

const ERA_OPTIONS = ERAS.filter((_, index) => index >= HERITAGE_VAULT_MIN_ERA_INDEX).map(
  (era) => ({ value: era.abbr, label: era.name }),
);

// Dernière ère du jeu par défaut : sans historique sauvegardé, un joueur qui
// débloque le Heritage Vault (dès Byzantine) est très probablement bien
// au-delà — remonter à Byzantine à chaque première visite n'a pas de sens.
const HERITAGE_VAULT_DEFAULT_ERA: EraCode = ERA_OPTIONS[ERA_OPTIONS.length - 1].value;

// `HERITAGE_KEEPER_MAX_REPUTATION_LEVEL` vit dans `resolvers/heritage.ts` —
// partagée avec l'onglet Keeper Offers, qui a son propre sélecteur de rang.

export function HeritageVaultView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  return mounted ? <HeritageVaultContent /> : <HeritageVaultSkeleton />;
}

function readStoredVaultKey(): string {
  try {
    const raw = localStorage.getItem("heritage-vault-key");
    if (raw !== null) {
      const parsed = JSON.parse(raw) as string;
      if (HERITAGE_VAULTS.some((entry) => entry.key === parsed)) return parsed;
    }
  } catch {
    // localStorage indisponible (navigation privée stricte) ou valeur corrompue.
  }
  return HERITAGE_VAULTS[0].key;
}

function HeritageVaultContent() {
  // Bâtiment : `?b=` s'il est présent (lien partagé), sinon le dernier
  // consulté par CE navigateur — seul le bâtiment a cette mémoire, l'onglet
  // repart toujours d'Overview sans `?tab=` explicite (comme avant l'URL).
  //
  // ⚠️ INITIALISÉS EN LECTURE PARESSEUSE (fonction passée à `useState`), PAS
  // PAR UN EFFET. `HeritageVaultContent` n'est monté qu'APRÈS le garde
  // `mounted` de `HeritageVaultView` — `window` existe donc déjà au premier
  // rendu. Un effet aurait introduit une course avec `useLocalStorageState`
  // (son hydratation passe par une microtask) : la valeur par défaut de CE
  // hook écrasait alors le `?b=` de l'URL, lu de façon synchrone juste après.
  const [vaultKey, setVaultKey] = useState<string>(
    () => readVaultKeyFromLocation() ?? readStoredVaultKey(),
  );
  const [activeTab, setActiveTab] = useState<HeritageTab>(
    () => readTabFromLocation() ?? DEFAULT_HERITAGE_TAB,
  );
  // Bâtiment persisté (localStorage) pour la prochaine visite de `/vault` sans
  // `?b=` — l'onglet, lui, ne l'est pas : il repart toujours d'Overview, comme
  // avant l'introduction de l'URL.
  useEffect(() => {
    try {
      localStorage.setItem("heritage-vault-key", JSON.stringify(vaultKey));
    } catch {
      // idem — pas fatal, seul le repli de la prochaine visite en pâtit.
    }
  }, [vaultKey]);
  // Répercuté sur l'URL à chaque changement — `history.replaceState` brut
  // (pas `router.replace`) : un simple changement d'onglet ne doit RIEN
  // recharger, ni layout ni page, juste réécrire la barre d'adresse.
  useEffect(() => {
    syncQueryString(vaultKey, activeTab);
  }, [vaultKey, activeTab]);
  // Persisté (localStorage), pas en session : voir `heritage-vault-page-store`.
  // `null` tant que rien n'a jamais été choisi (première visite, ou storage
  // vidé) — on retombe alors sur la dernière ère du jeu plutôt que Byzantine.
  const savedEra = useHeritageVaultEra();
  const setSavedEra = useSetHeritageVaultEra();
  const era = savedEra ?? HERITAGE_VAULT_DEFAULT_ERA;
  const setEra = setSavedEra;
  const [switchOpen, setSwitchOpen] = useState(false);
  const [showCosts, setShowCosts] = useState(false);

  // Précharge les 13 portraits une fois montés : sans ça, changer de vault
  // déclenche une requête réseau et le portrait (avec son offset x/y) n'
  // apparaît qu'après coup — perçu comme un décalage à chaque bascule.
  useEffect(() => {
    preloadHeritageVaultPortraits();
  }, []);

  const requested = HERITAGE_VAULTS.find((entry) => entry.key === vaultKey) ?? HERITAGE_VAULTS[0];
  const requestedOwned = useUserHeritageVault(requested.themeId);
  // ⚠️ ON NE BASCULE QU'UNE FOIS L'ÉTAT JOUEUR LU — vault et état joueur
  // changent ENSEMBLE, jamais l'un avant l'autre.
  //
  // Dexie répond en quelques millisecondes, mais pas dans la même frame que le
  // clic : afficher le nouveau vault immédiatement le peignait avec le niveau
  // du PRÉCÉDENT (cf. `useUserHeritageVault`), puis avec le sien. Tout ce qui
  // en dérive était donc rendu deux fois, à deux niveaux différents — les
  // nombres montaient puis redescendaient à chaque changement de vault.
  // Garder l'affichage courant le temps de la lecture supprime cet état
  // intermédiaire ; c'est le motif « adjusting state when a prop changes »,
  // sans effet ni délai artificiel.
  const [shown, setShown] = useState(() => ({
    catalogue: requested,
    owned: requestedOwned,
  }));
  if (
    requestedOwned !== null &&
    (shown.catalogue.key !== requested.key || shown.owned !== requestedOwned)
  ) {
    setShown({ catalogue: requested, owned: requestedOwned });
  }
  const catalogue = shown.catalogue;
  const owned = shown.owned;
  const selections = useBuildingSelectionsStore((state) => state.selections);
  // Lecture initiale, une fois — les mises à jour suivantes arrivent en
  // direct via `WorkshopModal.saveSelections` (store Zustand, pas un
  // événement `window` : voir lib/stores/building-selections-store.ts).
  useEffect(() => {
    hydrateBuildingSelectionsStore();
  }, []);

  const vault = useMemo(
    () =>
      owned === null ? null : resolveHeritageVault(catalogue.key, owned.level, era, owned),
    [catalogue.key, owned, era],
  );
  const eligibleBuildings = useMemo(
    () => getEligibleEvolvingBuildings(catalogue.key),
    [catalogue.key],
  );

  // Premier rendu seulement : la toute première lecture Dexie n'a pas encore
  // répondu, il n'y a aucun affichage précédent à garder. Les changements de
  // vault suivants ne passent jamais ici — `shown` conserve le vault courant.
  if (owned === null) return <HeritageVaultSkeleton />;

  if (vault === null) {
    return (
      <div className="container-wrapper flex min-h-0 flex-1">
        <div className="mx-auto w-full max-w-350 lg:pt-4">
          <p className="text-sm text-muted-foreground">Heritage not found.</p>
        </div>
      </div>
    );
  }

  const themeId = catalogue.themeId;
  const productionSlotIds = vault.slots
    .filter((slot) => slot.group === "production")
    .map((slot) => slot.id);
  const boostSlotIds = vault.slots
    .filter((slot) => slot.group === "boost")
    .map((slot) => slot.id);
  const xpToNext = vault.upgradeCost?.xp ?? 0;
  // Le game design ne plafonne pas le rang de gardien : le tableau extrait
  // s'arrête à `vault.maxLevel` (60), mais la formule Lua se prolonge au-delà
  // (cf. `keeperAmplifierMultiplier`/`getKeeperReputationCost`) et le rang
  // observable en jeu monte jusqu'à 99. On propose donc cette borne-là,
  // distincte de `vault.maxLevel` qui plafonne le niveau du vault lui-même.
  const keeperMaxLevel = HERITAGE_KEEPER_MAX_REPUTATION_LEVEL;

  const shiftVault = (delta: number) => {
    const index = HERITAGE_VAULTS.findIndex((entry) => entry.key === vault.key);
    const next =
      HERITAGE_VAULTS[
        (index + delta + HERITAGE_VAULTS.length) % HERITAGE_VAULTS.length
      ];
    setVaultKey(next.key);
  };

  return (
    <div className="container-wrapper flex min-h-0 flex-1">
      <div className="mx-auto w-full max-w-350 lg:pt-4">
        <VaultHeader
          vault={vault}
          era={era}
          eraOptions={ERA_OPTIONS}
          keeperMaxLevel={keeperMaxLevel}
          xpToNext={xpToNext}
          onEraChange={setEra}
          onLevelChange={(level) => updateUserHeritageVault(themeId, { level })}
          onXpChange={(value) => {
            // Une progression qui atteint le palier fait monter le vault et
            // reporte le reliquat — même mécanique que l'onglet Sacrifice
            // (`computeTargetVaultLevel`), pas une barre qui se contente de
            // plafonner en silence.
            const result = computeTargetVaultLevel(vault.key, vault.level, value);
            if (result === null) return;
            updateUserHeritageVault(themeId, {
              level: result.targetLevel,
              xpProgress: result.remaining,
            });
          }}
          onKeeperLevelChange={(keeperReputationLevel) =>
            updateUserHeritageVault(themeId, { keeperReputationLevel })
          }
          onKeeperPointsChange={(keeperReputationPoints) =>
            updateUserHeritageVault(themeId, { keeperReputationPoints })
          }
          onShiftVault={shiftVault}
          onOpenSwitch={() => setSwitchOpen(true)}
        />

        <VaultTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Un seul panneau est monté à la fois : ce conteneur EST le panneau de
            l'onglet courant, et porte donc son identité. Pas de `tabIndex` —
            il contient toujours de quoi tabuler, la règle ne vise que les
            panneaux sans aucun élément focalisable. */}
        <div
          className="pb-12"
          role="tabpanel"
          id={heritageTabPanelId(activeTab)}
          aria-labelledby={heritageTabId(activeTab)}
        >
          {activeTab === "infos" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="flex flex-col gap-6">
                <EffectBlock
                  title="Production"
                  group="production"
                  vault={vault}
                  selections={selections}
                  showCosts={showCosts}
                  equip={(slotId, effectId) =>
                    equipHeritageEffect(themeId, slotId, effectId)
                  }
                  unequip={(slotId) => unequipHeritageEffect(themeId, slotId)}
                  action={
                    <div className="flex items-center gap-2">
                      <ShowCostsToggle checked={showCosts} onCheckedChange={setShowCosts} />
                      <ResetEffectGroupButton
                        themeId={themeId}
                        groupLabel="Production"
                        slotIds={productionSlotIds}
                      />
                    </div>
                  }
                />
                <EffectBlock
                  title="Boost"
                  group="boost"
                  vault={vault}
                  selections={selections}
                  showCosts={showCosts}
                  equip={(slotId, effectId) =>
                    equipHeritageEffect(themeId, slotId, effectId)
                  }
                  unequip={(slotId) => unequipHeritageEffect(themeId, slotId)}
                  action={
                    <ResetEffectGroupButton
                      themeId={themeId}
                      groupLabel="Boost"
                      slotIds={boostSlotIds}
                    />
                  }
                />
                <TotalSummary vault={vault} selections={selections} />
              </div>

              {/* Colonne droite étirée par la grille : le tableau des paliers
                  absorbe la différence de hauteur par un scroll interne, la
                  liste des bâtiments reste calée en bas. */}
              <div className="flex flex-col gap-6 lg:h-full">
                <section className="flex flex-col">
                  <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    All tiers
                  </h2>
                  {/* Scroll interne réservé au desktop : c'est là que la
                      colonne est étirée par la grille. Sur mobile la page
                      défile déjà, un second ascenseur imbriqué y coupait la
                      liste en plein milieu. */}
                  <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                    <OverviewTable vault={vault} selections={selections} />
                  </div>
                </section>
                <section>
                  <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Eligible evolving buildings ({eligibleBuildings.length})
                  </h2>
                  <EligibleBuildingsList buildings={eligibleBuildings} />
                </section>
              </div>
            </div>
          )}

          {activeTab === "sacrifice" && (
            <SacrificeTab
              vault={vault}
              eligibleBuildings={eligibleBuildings}
              selections={selections}
            />
          )}

          {activeTab === "combination" && (
            <CombinationTab
              vault={vault}
              eligibleBuildings={eligibleBuildings}
              selections={selections}
            />
          )}

          {activeTab === "progression" && (
            <ProgressionTab vault={vault} selections={selections} />
          )}

          {activeTab === "keeperOffers" && (
            <KeeperOffersTab vault={vault} selections={selections} />
          )}
        </div>

        <ResponsiveModal
          title="Change heritage"
          trigger={<span className="hidden" aria-hidden="true" />}
          open={switchOpen}
          onOpenChange={setSwitchOpen}
          className="flex h-[80vh] flex-col gap-0 overflow-hidden p-0 md:h-[min(640px,85vh)] md:max-w-2xl"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold">Change heritage</h3>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSwitchOpen(false)}
              className="cursor-pointer text-[14px] text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {/* Sélecteur « in-game » : une tuile par vault, portrait au-dessus,
                nom en dessous — même gabarit que le sélecteur d'évolutif de
                l'onglet Sacrifice. */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4">
              {HERITAGE_VAULTS.map((entry) => (
                <button
                  key={entry.key}
                  className={cn(
                    "flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition-all duration-200",
                    entry.key === vault.key
                      ? "border-primary bg-primary/5 ring-2 ring-primary/40"
                      : "border-border hover:-translate-y-0.5 hover:bg-muted/50",
                  )}
                  onClick={() => {
                    setVaultKey(entry.key);
                    setSwitchOpen(false);
                  }}
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-muted/30">
                    <BuildingImage
                      src={getHeritageVaultPortraitUrl(entry.themeId)}
                      alt={entry.name}
                    />
                  </div>
                  <span className="w-full truncate px-1.5 py-1.5 text-center text-[11px] font-medium leading-tight">
                    {entry.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ResponsiveModal>
      </div>
    </div>
  );
}
