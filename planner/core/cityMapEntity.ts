// ─────────────────────────────────────────────────────────────────────────────
// cityMapEntity.ts
// Entité placeable sur la grille — immutable, port de CityMapEntity.cs
// Zéro dépendance React/browser
// ─────────────────────────────────────────────────────────────────────────────

import type { GridPoint, GridRect } from './mapGrid';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EntitySize {
  w: number;
  h: number;
}

/** Données sérialisables pour Dexie (Phase 8) */
export interface SerializedEntity {
  id: number;
  buildingDataId: string;
  location: GridPoint;
  size: EntitySize;
  isRotated: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ID counter — hors classe pour éviter les effets de bord
// ─────────────────────────────────────────────────────────────────────────────

let _nextId = 1;

export function nextEntityId(): number {
  return _nextId++;
}

/** Réinitialise le compteur — UNIQUEMENT pour les tests */
export function _resetEntityIdCounter(): void {
  _nextId = 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// CityMapEntity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Représente un bâtiment placé ou en cours de placement sur la grille.
 *
 * IMMUTABLE : moveTo() et rotate() retournent une NOUVELLE instance.
 * Ne jamais muter les propriétés directement.
 *
 * buildingDataId = clé courte roc-helper ('smallHome', 'ruralFarm'…)
 * PAS l'ID complet du jeu ('Building_EarlyGothicEra_Home_Small_1')
 */
export class CityMapEntity {
  readonly id: number;

  /**
   * Clé courte du catalogue roc-helper.
   * Exemples : 'smallHome', 'ruralFarm', 'compactCulture'
   * JAMAIS : 'Building_EarlyGothicEra_Home_Small_1'
   */
  readonly buildingDataId: string;

  /** Taille de base en tuiles (non rotationné) */
  readonly size: EntitySize;

  private readonly _location: GridPoint;
  private readonly _isRotated: boolean;

  constructor(
    id: number,
    buildingDataId: string,
    location: GridPoint,
    size: EntitySize,
    isRotated = false,
  ) {
    this.id = id;
    this.buildingDataId = buildingDataId;
    this._location = { x: location.x, y: location.y };
    this.size = { w: size.w, h: size.h };
    this._isRotated = isRotated;
  }

  // ─── Accesseurs ───────────────────────────────────────────────────────────

  get location(): GridPoint {
    return { x: this._location.x, y: this._location.y };
  }

  get isRotated(): boolean {
    return this._isRotated;
  }

  /**
   * Rectangle occupé sur la grille.
   * Si isRotated=true, w et h sont échangés.
   *
   * Exemple : taille (2×3) + isRotated=true → bounds (3×2)
   */
  get bounds(): GridRect {
    return this._isRotated
      ? { x: this._location.x, y: this._location.y, w: this.size.h, h: this.size.w }
      : { x: this._location.x, y: this._location.y, w: this.size.w, h: this.size.h };
  }

  /** Taille effective en tenant compte de la rotation */
  get effectiveSize(): EntitySize {
    return this._isRotated
      ? { w: this.size.h, h: this.size.w }
      : { w: this.size.w, h: this.size.h };
  }

  // ─── Mutations immutables ─────────────────────────────────────────────────

  /**
   * Retourne une nouvelle entité déplacée à la position donnée.
   * L'entité originale n'est PAS modifiée.
   */
  moveTo(location: GridPoint): CityMapEntity {
    return new CityMapEntity(
      this.id,
      this.buildingDataId,
      location,
      this.size,
      this._isRotated,
    );
  }

  /**
   * Retourne une nouvelle entité avec la rotation inversée.
   * L'entité originale n'est PAS modifiée.
   */
  rotate(): CityMapEntity {
    return new CityMapEntity(
      this.id,
      this.buildingDataId,
      this._location,
      this.size,
      !this._isRotated,
    );
  }

  // ─── Sérialisation (Dexie Phase 8) ────────────────────────────────────────

  serialize(): SerializedEntity {
    return {
      id: this.id,
      buildingDataId: this.buildingDataId,
      location: this.location,
      size: { ...this.size },
      isRotated: this._isRotated,
    };
  }

  static deserialize(data: SerializedEntity): CityMapEntity {
    return new CityMapEntity(
      data.id,
      data.buildingDataId,
      data.location,
      data.size,
      data.isRotated,
    );
  }
}
