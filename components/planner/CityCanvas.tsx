"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { screenToGrid } from "@/planner/core/mapGrid";
import {
  createInitialViewport,
  applyPan,
  applyZoom,
  getVisibleTiles,
  type Viewport,
} from "@/planner/rendering/viewportManager";
import { drawGrid } from "@/planner/rendering/gridRenderer";
import {
  drawEntities,
  drawGhost,
  drawSelectionOutline,
} from "@/planner/rendering/buildingRenderer";
import {
  useCityPlannerStore,
  useCoreStateRef,
  useActiveTool,
  useSelectedEntity,
  useIsDraggingEntity,
} from "@/planner/state/cityPlannerStore";

const DRAG_THRESHOLD = 5;

export function CityCanvas({
  gridW = 52,
  gridH = 52,
}: {
  gridW?: number;
  gridH?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vpRef = useRef<Viewport>({ offset: { x: 0, y: 0 }, zoom: 1 });
  const rafRef = useRef<number>(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const downPosRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const isDragRef = useRef(false);
  const isDraggingEntityLocalRef = useRef(false);
  // true uniquement entre pointerdown et pointerup
  const isPointerDownRef = useRef(false);
  // cellule au moment du pointerdown (reset à null au pointerup)
  const downCellRef = useRef<{ x: number; y: number } | null>(null);
  // drag d'entité déjà tenté pour ce pointerdown (évite les tentatives répétées)
  const dragAttemptedRef = useRef(false);

  const stateRef = useCoreStateRef();
  const activeTool = useActiveTool();
  const selectedEntity = useSelectedEntity();
  const isDraggingEntity = useIsDraggingEntity();

  const updateHover = useCityPlannerStore((s) => s.updateHover);
  const placeAtCell = useCityPlannerStore((s) => s.placeAtCell);
  const deleteAtCell = useCityPlannerStore((s) => s.deleteAtCell);
  const selectEntityAt = useCityPlannerStore((s) => s.selectEntityAt);
  const deselectEntity = useCityPlannerStore((s) => s.deselectEntity);
  const startDrag = useCityPlannerStore((s) => s.startDrag);
  const updateDrag = useCityPlannerStore((s) => s.updateDrag);
  const endDrag = useCityPlannerStore((s) => s.endDrag);
  const toggleGhost = useCityPlannerStore((s) => s.toggleGhostRotation);
  const rotateDragging = useCityPlannerStore((s) => s.rotateDraggingEntity);
  const rotateSelected = useCityPlannerStore((s) => s.rotateSelectedEntity);
  const selectBuilding = useCityPlannerStore((s) => s.selectBuilding);
  const undo = useCityPlannerStore((s) => s.undo);
  const redo = useCityPlannerStore((s) => s.redo);
  const deleteEntity = useCityPlannerStore((s) => s.deleteEntity);

  const cursor =
    activeTool === "place"
      ? "cell"
      : activeTool === "delete"
        ? "not-allowed"
        : activeTool === "move" || activeTool === "select"
          ? isDraggingEntity
            ? "grabbing"
            : "grab"
          : "default";

  // ── RAF ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const vp = vpRef.current;
    const core = stateRef.current;
    const visible = getVisibleTiles(
      vp,
      canvas.width,
      canvas.height,
      gridW,
      gridH,
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, vp, visible);
    drawEntities(ctx, vp, core.mapState.entities, visible);
    if (selectedEntity) drawSelectionOutline(ctx, vp, selectedEntity);
    if (core.ghostEntity)
      drawGhost(ctx, vp, core.ghostEntity, core.ghostIsValid);
  }, [stateRef, gridW, gridH, selectedEntity]);

  useEffect(() => {
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let init = false;
    const ro = new ResizeObserver(([e]) => {
      canvas.width = Math.floor(e.contentRect.width);
      canvas.height = Math.floor(e.contentRect.height);
      if (!init) {
        vpRef.current = createInitialViewport(
          canvas.width,
          canvas.height,
          gridW,
          gridH,
          0.8,
        );
        init = true;
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [gridW, gridH]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (isDraggingEntityLocalRef.current) rotateDragging();
        else if (activeTool === "select") rotateSelected();
        else if (activeTool === "place") toggleGhost();
      }
      if (e.key === "Escape") {
        selectBuilding(null);
        deselectEntity();
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedEntity) {
        deleteEntity(selectedEntity.id);
        deselectEntity();
      }
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.key === "y" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey)
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    activeTool,
    toggleGhost,
    rotateDragging,
    rotateSelected,
    selectBuilding,
    deselectEntity,
    deleteEntity,
    selectedEntity,
    undo,
    redo,
  ]);

  const getCell = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const cell = screenToGrid(
        { x: clientX - rect.left, y: clientY - rect.top },
        vpRef.current.offset,
        vpRef.current.zoom,
      );
      return cell.x >= 0 && cell.x < gridW && cell.y >= 0 && cell.y < gridH
        ? cell
        : null;
    },
    [gridW, gridH],
  );

  // ── Pointer ───────────────────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      lastPointerRef.current = downPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      isDragRef.current = false;
      isDraggingEntityLocalRef.current = false;
      isPanningRef.current = true; // pan par défaut
      isPointerDownRef.current = true;
      dragAttemptedRef.current = false;
      downCellRef.current = getCell(e.clientX, e.clientY);
    },
    [getCell],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const totalDx = Math.abs(e.clientX - downPosRef.current.x);
      const totalDy = Math.abs(e.clientY - downPosRef.current.y);
      const crossedThreshold =
        totalDx > DRAG_THRESHOLD || totalDy > DRAG_THRESHOLD;
      if (crossedThreshold) isDragRef.current = true;

      // Tenter drag d'entité UNE SEULE FOIS par pointerdown, seulement si :
      // - bouton enfoncé
      // - seuil dépassé
      // - pas déjà tenté
      // - outil select ou move
      // - cellule du pointerdown connue
      if (
        isPointerDownRef.current &&
        crossedThreshold &&
        !dragAttemptedRef.current &&
        !isDraggingEntityLocalRef.current &&
        (activeTool === "select" || activeTool === "move") &&
        downCellRef.current
      ) {
        dragAttemptedRef.current = true; // ne jamais retenter
        if (startDrag(downCellRef.current)) {
          isDraggingEntityLocalRef.current = true;
          isPanningRef.current = false;
        }
      }

      if (isDraggingEntityLocalRef.current) {
        const cell = getCell(e.clientX, e.clientY);
        if (cell) updateDrag(cell);
        return;
      }

      if (isPanningRef.current && isDragRef.current) {
        vpRef.current = applyPan(vpRef.current, dx, dy);
      }

      // Hover uniquement en mode place
      if (activeTool === "place") {
        updateHover(getCell(e.clientX, e.clientY));
      }
    },
    [activeTool, getCell, startDrag, updateDrag, updateHover],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const wasEntityDrag = isDraggingEntityLocalRef.current;
      const wasDrag = isDragRef.current;

      // Reset complet de l'état pointer
      isDraggingEntityLocalRef.current = false;
      isDragRef.current = false;
      isPanningRef.current = false;
      isPointerDownRef.current = false;
      dragAttemptedRef.current = false;
      downCellRef.current = null; // ← CRUCIAL : reset ici

      if (wasEntityDrag) {
        endDrag();
        return;
      }
      if (wasDrag) return;

      const cell = getCell(e.clientX, e.clientY);
      if (!cell) return;
      if (activeTool === "place") placeAtCell(cell);
      if (activeTool === "delete") deleteAtCell(cell);
      if (activeTool === "select") selectEntityAt(cell);
    },
    [activeTool, getCell, placeAtCell, deleteAtCell, selectEntityAt, endDrag],
  );

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (activeTool === "place") {
        updateHover(getCell(e.clientX, e.clientY));
      }
    },
    [activeTool, getCell, updateHover],
  );

  const onPointerLeave = useCallback(() => {
    // Si le pointer quitte le canvas sans pointerup (rare), nettoyer
    if (!isDraggingEntityLocalRef.current && !isPointerDownRef.current) {
      updateHover(null);
    }
  }, [updateHover]);

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    vpRef.current = applyZoom(
      vpRef.current,
      -e.deltaY,
      e.clientX - rect.left,
      e.clientY - rect.top,
    );
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ cursor }}
      className="w-full h-full touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
    />
  );
}
