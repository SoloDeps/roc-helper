"use client";

// ============================================================
// ROC Helper – Heritage Vault Database (roc_heritage_db)
//
// Base isolée, comme `roc_wonders_db` : réinitialiser le Calculator ou une
// autre section ne doit jamais effacer la progression d'un Heritage Vault.
//
// UNE LIGNE PAR VAULT, clé primaire = `themeId` (`heritage_vault.Heritage_Celtic`).
// C'est l'identité du game design, et la seule stable : le
// `HeritageVaultDefinitionDTO` n'a pas de champ `id`, et la clé de registre
// (`heritage_celtic`) est une commodité de présentation dérivée du `themeId` —
// la stocker exposerait les données du joueur à un simple renommage de clé.
// ============================================================

import Dexie, { type Table } from "dexie";

// ─── Entities ────────────────────────────────────────────────────────────────

/**
 * Un Heritage Vault possédé par le joueur.
 *
 * ⚠️ AUCUN CHAMP `era` — et c'est délibéré.
 *
 * Un bâtiment évolutif stocke son ère (`UserEvolvingBuilding.era`) parce qu'elle
 * est FIGÉE à l'obtention : deux joueurs au même niveau produisent des biens
 * différents. Un vault, lui, n'a pas d'ère d'instance : son bâtiment-marqueur
 * est déclaré `age: "StoneAge"`, `level: 1` sur les 13, et ses tables à deux axes
 * sont des `PlayerAgeDynamicChangeDTO` — l'ère COURANTE du joueur. La stocker ici
 * figerait une valeur que le jeu recalcule à chaque montée d'ère, et rendrait la
 * donnée fausse dès le prochain passage d'ère.
 *
 * L'ère est donc lue au runtime et passée à `resolveOwnedHeritageVault(owned, era)`.
 */
export interface UserHeritageVaultEntity {
  /** `heritage_vault.Heritage_Celtic` — clé primaire. */
  themeId: string;
  /** Niveau atteint, 1 … 60. */
  level: number;
  /**
   * Rang de réputation du gardien de CE thème. 1 = rang de départ.
   *
   * Par vault, pas global : la loca donne à chaque héritage son propre gardien
   * et son propre classement. Le classement « combiné » du jeu est une somme
   * calculée, pas un état à stocker.
   */
  keeperReputationLevel: number;
  /** Points accumulés vers le rang suivant. */
  keeperReputationPoints: number;
  /**
   * `slotId` → `effectId`. Un slot vide n'a pas d'entrée.
   *
   * Objet plutôt que tableau : le jeu autorise à déplacer un effet d'un slot à
   * l'autre, et un index par slot rend l'écriture idempotente. Non indexé par
   * Dexie — on ne requête jamais par contenu de slot.
   */
  equipped: Record<string, string>;
  /**
   * `offerId` (`Coins_S`, `CEGood1`…) → nombre d'achats déjà faits.
   *
   * ⚠️ La PORTÉE de ce compteur est une convention, pas une donnée : voir
   * `KEEPER_PURCHASE_COUNT_SCOPE` dans `resolvers/heritage.ts`. Le stocker par
   * vault et par offre est ce que cette convention impose ; changer d'avis
   * demandera une migration de version Dexie, pas une réinterprétation.
   */
  keeperPurchases: Record<string, number>;
  /**
   * Xp accumulée vers le PROCHAIN niveau du vault — suivi manuel, comme
   * `keeperReputationPoints`. Non indexé, comme `equipped`/`keeperPurchases` :
   * un champ scalaire simple qu'IndexedDB stocke sans qu'il figure dans
   * `stores()`, donc sans migration de version pour les lignes existantes
   * (Dexie les rend avec `xpProgress: undefined` ; le resolver le traite
   * comme 0, voir `emptyOwnedHeritageVault`).
   */
  xpProgress: number;
}

// ─── Database class ──────────────────────────────────────────────────────────

export class RocHeritageDB extends Dexie {
  userHeritageVaults!: Table<UserHeritageVaultEntity, string>;

  constructor() {
    super("roc_heritage_db");

    // v1 — table initiale.
    // Clé primaire = themeId. Seuls les scalaires sont indexés : `equipped` et
    // `keeperPurchases` sont des objets, stockés mais jamais requêtés.
    this.version(1).stores({
      userHeritageVaults: "themeId,level,keeperReputationLevel",
    });
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let heritageDbInstance: RocHeritageDB | null = null;

export function getHeritageDB(): RocHeritageDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on client side");
  }
  if (!heritageDbInstance) {
    heritageDbInstance = new RocHeritageDB();
    heritageDbInstance.open().catch((err) => {
      console.error("Failed to open roc_heritage_db:", err);
    });
  }
  return heritageDbInstance;
}

export async function resetHeritageDB(): Promise<void> {
  if (heritageDbInstance) {
    heritageDbInstance.close();
    await heritageDbInstance.delete();
    heritageDbInstance = null;
  }
  getHeritageDB();
}
