// ─────────────────────────────────────────────────────────────────────────────
// cityMapState.ts
// Registre des entités placées — port de CityMapStateCore.cs (fof-hoh)
// Zéro dépendance React/browser
// ─────────────────────────────────────────────────────────────────────────────

import { CityMapEntity, type SerializedEntity } from './cityMapEntity';
import type { GridPoint } from './mapGrid';

// ─────────────────────────────────────────────────────────────────────────────
// Types sérialisables
// ─────────────────────────────────────────────────────────────────────────────

export interface SerializedState {
  entities: SerializedEntity[];
  /** Version de sérialisation — pour migrations futures */
  version: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CityMapState
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registre mutable des entités placées sur la grille.
 *
 * SINGLETON hors React — instancié une seule fois dans cityPlannerStore.ts.
 * Le canvas y accède via stateRef.current.mapState, jamais via useState.
 *
 * Toutes les mutations passent par CommandManager pour être undo/redo-ables.
 * Exception : les mises à jour visuelles temporaires pendant le drag
 * (position du ghost) qui ne passent PAS par CommandManager.
 */
export class CityMapState {
  private _entities = new Map<number, CityMapEntity>();

  // ─── Lecture ──────────────────────────────────────────────────────────────

  get entities(): ReadonlyMap<number, CityMapEntity> {
    return this._entities;
  }

  get size(): number {
    return this._entities.size;
  }

  getById(id: number): CityMapEntity | undefined {
    return this._entities.get(id);
  }

  has(id: number): boolean {
    return this._entities.has(id);
  }

  // ─── Mutations (appelées par CommandManager) ──────────────────────────────

  /**
   * Ajoute une entité. Ne vérifie PAS la collision —
   * la validation est faite par placementValidator AVANT d'appeler cette méthode.
   */
  add(entity: CityMapEntity): void {
    this._entities.set(entity.id, entity);
  }

  /** Supprime une entité par ID. No-op si absente. */
  remove(id: number): void {
    this._entities.delete(id);
  }

  /**
   * Déplace une entité vers une nouvelle position.
   * Crée une nouvelle instance immutable via moveTo().
   */
  move(id: number, to: GridPoint): void {
    const entity = this._entities.get(id);
    if (!entity) return;
    this._entities.set(id, entity.moveTo(to));
  }

  /**
   * Remplace une entité par une autre (même ID).
   * Utilisé par createRotateCommand et pour les mises à jour de niveau.
   */
  replace(id: number, newEntity: CityMapEntity): void {
    if (!this._entities.has(id)) return;
    this._entities.set(id, newEntity);
  }

  /**
   * Vide complètement la grille.
   * Appeler avant loadLayout() (Phase 8).
   */
  clear(): void {
    this._entities.clear();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Compte les entités d'un buildingDataId donné.
   * Utilisé pour afficher "X/max" dans le BuildingSelector.
   */
  countByType(buildingDataId: string): number {
    let count = 0;
    for (const entity of this._entities.values()) {
      if (entity.buildingDataId === buildingDataId) count++;
    }
    return count;
  }

  /**
   * Retourne toutes les entités d'un type donné.
   */
  getByType(buildingDataId: string): CityMapEntity[] {
    return [...this._entities.values()].filter(
      e => e.buildingDataId === buildingDataId,
    );
  }

  // ─── Sérialisation (Dexie Phase 8) ────────────────────────────────────────

  serialize(): SerializedState {
    return {
      version: 1,
      entities: [...this._entities.values()].map(e => e.serialize()),
    };
  }

  /**
   * Charge un état sérialisé dans cette instance.
   * Vide d'abord le state existant.
   * Appeler commandManager.reset() juste après.
   */
  loadFromSerialized(data: SerializedState): void {
    this.clear();
    for (const serialized of data.entities) {
      const entity = CityMapEntity.deserialize(serialized);
      this._entities.set(entity.id, entity);
    }
  }

  /**
   * Crée une nouvelle instance depuis des données sérialisées.
   * Utilisé pour fromImport() en Phase 5+.
   */
  static deserialize(data: SerializedState): CityMapState {
    const state = new CityMapState();
    state.loadFromSerialized(data);
    return state;
  }

  /**
   * Point d'entrée pour l'import d'une ville joueur (Phase 5+).
   * Stub intentionnel — ne pas implémenter avant Phase 5.
   */
  static fromImport(_importedData: unknown): CityMapState {
    throw new Error(
      'CityMapState.fromImport() not implemented — see Phase 5 (gameImport.ts)',
    );
  }
}
