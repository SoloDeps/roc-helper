// ─────────────────────────────────────────────────────────────────────────────
// commandManager.ts
// Pattern Command avec undo/redo — port de CommandManager.cs (fof-hoh)
// Zéro dépendance React/browser
// ─────────────────────────────────────────────────────────────────────────────

import type { CityMapEntity } from './cityMapEntity';
import type { GridPoint } from './mapGrid';
import type { CityMapState } from './cityMapState';

// ─────────────────────────────────────────────────────────────────────────────
// Interface Command
// ─────────────────────────────────────────────────────────────────────────────

export interface Command {
  execute(): void;
  undo(): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CommandManager
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gestionnaire de commandes avec historique undo/redo.
 *
 * SINGLETON hors React — instancié une seule fois dans cityPlannerStore.ts,
 * jamais recréé. Partagé via stateRef.
 *
 * Règles :
 * - execute() : ajoute à undoStack, vide redoStack
 * - undo()    : pop undoStack → undo → push redoStack
 * - redo()    : pop redoStack → execute → push undoStack
 * - onChanged : callback déclenché après chaque opération (pour Zustand sync)
 */
export class CommandManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  /** Appelé après execute(), undo(), redo(). Utilisé pour syncer Zustand. */
  onChanged?: () => void;

  // ─── Opérations ───────────────────────────────────────────────────────────

  execute(cmd: Command): void {
    cmd.execute();
    this.undoStack.push(cmd);
    this.redoStack = []; // vider le redo à chaque nouvelle action
    this.onChanged?.();
  }

  undo(): void {
    const cmd = this.undoStack.pop();
    if (!cmd) return;
    cmd.undo();
    this.redoStack.push(cmd);
    this.onChanged?.();
  }

  redo(): void {
    const cmd = this.redoStack.pop();
    if (!cmd) return;
    cmd.execute();
    this.undoStack.push(cmd);
    this.onChanged?.();
  }

  /** Vide les deux stacks — appeler après loadLayout() (Phase 8) */
  reset(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.onChanged?.();
  }

  // ─── État ─────────────────────────────────────────────────────────────────

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  get undoCount(): number {
    return this.undoStack.length;
  }

  get redoCount(): number {
    return this.redoStack.length;
  }

  // ─── Fabriques de commandes ───────────────────────────────────────────────
  //
  // Ces méthodes créent des commandes sans les exécuter.
  // Passer la commande à execute() pour l'appliquer.
  //
  // Pattern : fermeture sur state + entité capturée au moment de la création.

  /**
   * Place une nouvelle entité.
   * Undo : supprime l'entité.
   */
  createPlaceCommand(state: CityMapState, entity: CityMapEntity): Command {
    return {
      execute: () => state.add(entity),
      undo:    () => state.remove(entity.id),
    };
  }

  /**
   * Déplace une entité existante de `from` à `to`.
   * Undo : revient à `from`.
   *
   * ⚠️ Appeler UNIQUEMENT au pointerup, pas pendant le drag.
   * Pendant le drag : mettre à jour via stateRef directement (sans commander).
   */
  createMoveCommand(
    state: CityMapState,
    id: number,
    from: GridPoint,
    to: GridPoint,
  ): Command {
    return {
      execute: () => state.move(id, to),
      undo:    () => state.move(id, from),
    };
  }

  /**
   * Supprime une entité.
   * Undo : repose l'entité à sa position originale.
   *
   * L'entité est capturée au moment de la création de la commande.
   */
  createDeleteCommand(state: CityMapState, entity: CityMapEntity): Command {
    return {
      execute: () => state.remove(entity.id),
      undo:    () => state.add(entity),
    };
  }

  /**
   * Rotation d'une entité.
   * Undo : rotation inverse (= rotation à nouveau, car toggle).
   */
  createRotateCommand(state: CityMapState, entity: CityMapEntity): Command {
    const rotated = entity.rotate();
    return {
      execute: () => state.replace(entity.id, rotated),
      undo:    () => state.replace(entity.id, entity),
    };
  }
}
