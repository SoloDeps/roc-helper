"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { screenToGrid } from "@/planner/core/mapGrid";
import {
  createInitialViewport,
  calcFitZoom,
  applyPan,
  applyZoom,
  getVisibleTiles,
  ZOOM_MIN,
  ZOOM_MAX,
  type Viewport,
} from "@/planner/rendering/viewportManager";
import {
  drawGrid,
  buildPlayableTileSet,
} from "@/planner/rendering/gridRenderer";
import {
  drawEntities,
  drawGhost,
  drawSelectionOutline,
  drawFixedBuildings,
} from "@/planner/rendering/buildingRenderer";
import {
  drawHappinessOverlays,
  drawHappinessOverlayGhost,
} from "@/planner/rendering/overlayRenderer";
import { drawExpansions } from "@/planner/rendering/expansionRenderer";
import {
  findExpansionAtCell,
  getPlayableGridBounds,
} from "@/planner/core/expansionManager";
import {
  useCityPlannerStore,
  useCoreStateRef,
  useActiveTool,
  useSelectedEntity,
  useIsDraggingEntity,
  useShowHappiness,
  useExpansionRects,
  useUnlockedExpansions,
  useCurrentCityId,
  useFixedBuildings,
} from "@/planner/state/cityPlannerStore";
import { isCultureSite } from "@/planner/core/happinessCalculator";

const DRAG_THRESHOLD = 5;

export function CityCanvas() {
  // ── Store ─────────────────────────────────────────────────────────────────
  const stateRef = useCoreStateRef();
  const activeTool = useActiveTool();
  const selectedEntity = useSelectedEntity();
  const isDraggingEntity = useIsDraggingEntity();
  const showHappiness = useShowHappiness();
  const expansionRects = useExpansionRects();
  const unlockedExpansions = useUnlockedExpansions();
  const currentCityId = useCurrentCityId();
  const fixedBuildings = useFixedBuildings();
  const { w: gridW, h: gridH } = getPlayableGridBounds(currentCityId);

  const playableTileSet = useMemo(
    () =>
      expansionRects.length > 0
        ? buildPlayableTileSet(expansionRects)
        : undefined,
    [expansionRects],
  );

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vpRef = useRef<Viewport>({ offset: { x: 0, y: 0 }, zoom: 1 });
  const rafRef = useRef<number>(0);
  const drawRef = useRef<() => void>(() => {});
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const downPosRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const isDragRef = useRef(false);
  const isDraggingEntityLocalRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const downCellRef = useRef<{ x: number; y: number } | null>(null);
  const dragAttemptedRef = useRef(false);
  const isDragUnlockingRef = useRef(false);
  const dragUnlockedSetRef = useRef<Set<string>>(new Set());
  const hoveredExpansionRef = useRef<string | null>(null);
  // Pinch-to-zoom mobile
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchZoomRef = useRef(1);
  const lastTouchCenterRef = useRef<{ x: number; y: number } | null>(null);

  // ── Actions ───────────────────────────────────────────────────────────────
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
  const toggleExpansion = useCityPlannerStore((s) => s.toggleExpansion);
  const undo = useCityPlannerStore((s) => s.undo);
  const redo = useCityPlannerStore((s) => s.redo);
  const deleteEntity = useCityPlannerStore((s) => s.deleteEntity);

  const cursor = (() => {
    if (activeTool === "place") return "cell";
    if (activeTool === "delete") return "not-allowed";
    if (activeTool === "move" || activeTool === "select") {
      if (isDraggingEntity) return "grabbing";
      return "grab";
    }
    return "default";
  })();

  const getCursor = useCallback(() => {
    if (activeTool === "place") return "cell";
    if (activeTool === "delete") return "not-allowed";
    if (activeTool === "move" || activeTool === "select") {
      if (isDraggingEntityLocalRef.current || isDragUnlockingRef.current)
        return "grabbing";
      if (hoveredExpansionRef.current) return "pointer";
      return "grab";
    }
    return "default";
  }, [activeTool]);

  // ── Resize — architecture isometric ──────────────────────────────────────
  //
  // RÈGLE FONDAMENTALE (identique à isometric-city) :
  //   canvas.style.width/height = taille d'affichage CSS  (suit le conteneur)
  //   canvas.width/height       = buffer mémoire = CSS * DPR
  //
  // On utilise window.resize (pas ResizeObserver sur le canvas) et on ne
  // réassigne canvas.width/height QUE si la valeur change vraiment.
  // Cela garantit que le bitmap n'est JAMAIS effacé pendant un resize.
  //
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let initialized = false;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const cssW = Math.floor(rect.width);
      const cssH = Math.floor(rect.height);
      if (cssW === 0 || cssH === 0) return;

      // Affichage CSS
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      // Buffer mémoire DPR — seulement si différent (sinon efface le bitmap)
      const bufW = Math.round(cssW * dpr);
      const bufH = Math.round(cssH * dpr);
      if (canvas.width !== bufW) canvas.width = bufW;
      if (canvas.height !== bufH) canvas.height = bufH;

      if (!initialized) {
        const fitZoom = calcFitZoom(cssW, cssH, gridW, gridH);
        vpRef.current = createInitialViewport(
          cssW,
          cssH,
          gridW,
          gridH,
          fitZoom,
        );
        initialized = true;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [gridW, gridH]);

  // ── RAF loop ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const vp = vpRef.current;
    const core = stateRef.current;
    const { w: gW, h: gH } = getPlayableGridBounds(currentCityId);

    // Tout le rendu se fait en CSS pixels — le scale DPR est appliqué une fois
    const cssW = canvas.width / dpr;
    const cssH = canvas.height / dpr;

    const visible = getVisibleTiles(vp, cssW, cssH, gW, gH);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    drawGrid(ctx, vp, visible, playableTileSet);

    if (expansionRects.length > 0) {
      drawExpansions(ctx, vp, expansionRects, unlockedExpansions, cssW, cssH);
    }

    if (showHappiness) drawHappinessOverlays(ctx, vp, core.mapState.entities);

    drawFixedBuildings(ctx, vp, fixedBuildings, cssW, cssH);
    drawEntities(ctx, vp, core.mapState.entities, visible);

    if (selectedEntity) drawSelectionOutline(ctx, vp, selectedEntity);

    if (core.ghostEntity) {
      if (showHappiness && isCultureSite(core.ghostEntity.buildingDataId)) {
        drawHappinessOverlayGhost(ctx, vp, core.ghostEntity);
      }
      drawGhost(ctx, vp, core.ghostEntity, core.ghostIsValid);
    }
  }, [
    stateRef,
    currentCityId,
    selectedEntity,
    showHappiness,
    expansionRects,
    unlockedExpansions,
    playableTileSet,
    fixedBuildings,
  ]);

  // drawRef est mis à jour à chaque render — le loop RAF lit toujours la version courante
  drawRef.current = draw;

  useEffect(() => {
    const loop = () => {
      drawRef.current();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ne démarre qu'une fois, ne s'arrête jamais au resize

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

  // ── getCell — coordonnées CSS (getBoundingClientRect = CSS pixels) ─────────
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

  // ── Pointer events ────────────────────────────────────────────────────────
  const onPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (activeTool === "place") updateHover(getCell(e.clientX, e.clientY));
    },
    [activeTool, getCell, updateHover],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      lastPointerRef.current = downPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      isDragRef.current = false;
      isDraggingEntityLocalRef.current = false;
      isPanningRef.current = true;
      isPointerDownRef.current = true;
      dragAttemptedRef.current = false;
      isDragUnlockingRef.current = false;
      dragUnlockedSetRef.current = new Set();
      downCellRef.current = getCell(e.clientX, e.clientY);

      if (activeTool === "select" && downCellRef.current) {
        const exp = findExpansionAtCell(
          expansionRects,
          downCellRef.current.x,
          downCellRef.current.y,
        );
        if (exp && exp.type === "standard" && !unlockedExpansions.has(exp.id)) {
          isDragUnlockingRef.current = true;
          isPanningRef.current = false;
          dragUnlockedSetRef.current.add(exp.id);
          toggleExpansion(exp.id);
        }
      }
    },
    [activeTool, getCell, expansionRects, unlockedExpansions, toggleExpansion],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const crossedThreshold =
        Math.abs(e.clientX - downPosRef.current.x) > DRAG_THRESHOLD ||
        Math.abs(e.clientY - downPosRef.current.y) > DRAG_THRESHOLD;
      if (crossedThreshold) isDragRef.current = true;

      if (isDragUnlockingRef.current) {
        const cell = getCell(e.clientX, e.clientY);
        if (cell) {
          const exp = findExpansionAtCell(expansionRects, cell.x, cell.y);
          if (
            exp &&
            exp.type === "standard" &&
            !unlockedExpansions.has(exp.id) &&
            !dragUnlockedSetRef.current.has(exp.id)
          ) {
            dragUnlockedSetRef.current.add(exp.id);
            toggleExpansion(exp.id);
          }
        }
        return;
      }

      if (
        isPointerDownRef.current &&
        crossedThreshold &&
        !dragAttemptedRef.current &&
        !isDraggingEntityLocalRef.current &&
        (activeTool === "select" || activeTool === "move") &&
        downCellRef.current
      ) {
        dragAttemptedRef.current = true;
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

      if (activeTool === "place") updateHover(getCell(e.clientX, e.clientY));

      if (activeTool === "select") {
        const cell = getCell(e.clientX, e.clientY);
        if (cell) {
          const exp = findExpansionAtCell(expansionRects, cell.x, cell.y);
          hoveredExpansionRef.current =
            exp && exp.type === "standard" && !unlockedExpansions.has(exp.id)
              ? exp.id
              : null;
        } else {
          hoveredExpansionRef.current = null;
        }
        if (canvasRef.current) canvasRef.current.style.cursor = getCursor();
      }
    },
    [
      activeTool,
      getCell,
      startDrag,
      updateDrag,
      updateHover,
      expansionRects,
      unlockedExpansions,
      toggleExpansion,
      getCursor,
    ],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const wasEntityDrag = isDraggingEntityLocalRef.current;
      const wasDrag = isDragRef.current;
      const wasDragUnlocking = isDragUnlockingRef.current;
      isDraggingEntityLocalRef.current = false;
      isDragRef.current = false;
      isPanningRef.current = false;
      isPointerDownRef.current = false;
      dragAttemptedRef.current = false;
      isDragUnlockingRef.current = false;
      downCellRef.current = null;

      if (wasEntityDrag) {
        endDrag();
        return;
      }
      if (wasDragUnlocking) {
        return;
      }
      if (wasDrag) {
        return;
      }

      const cell = getCell(e.clientX, e.clientY);
      if (!cell) return;

      if (activeTool === "place") {
        placeAtCell(cell);
        return;
      }
      if (activeTool === "delete") {
        deleteAtCell(cell);
        return;
      }

      if (activeTool === "select") {
        selectEntityAt(cell);
        const store = useCityPlannerStore.getState();
        if (!store.selectedEntity) {
          const exp = findExpansionAtCell(expansionRects, cell.x, cell.y);
          if (exp && exp.type === "standard") toggleExpansion(exp.id);
        }
      }
    },
    [
      activeTool,
      getCell,
      placeAtCell,
      deleteAtCell,
      selectEntityAt,
      endDrag,
      expansionRects,
      toggleExpansion,
    ],
  );

  const onPointerLeave = useCallback(() => {
    hoveredExpansionRef.current = null;
    if (!isDraggingEntityLocalRef.current && !isPointerDownRef.current)
      updateHover(null);
  }, [updateHover]);

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // getBoundingClientRect = CSS pixels, cohérent avec vpRef
    vpRef.current = applyZoom(
      vpRef.current,
      -e.deltaY,
      e.clientX - rect.left,
      e.clientY - rect.top,
    );
  }, []);

  // ── Touch — pinch-to-zoom mobile ──────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      initialPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
      initialPinchZoomRef.current = vpRef.current.zoom;
      lastTouchCenterRef.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
      isPanningRef.current = false;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length !== 2 || initialPinchDistRef.current === null) return;

    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = dist / initialPinchDistRef.current;
    const newZoom = Math.max(
      ZOOM_MIN,
      Math.min(ZOOM_MAX, initialPinchZoomRef.current * scale),
    );

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const center = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
    const pivotX = center.x - rect.left;
    const pivotY = center.y - rect.top;

    // Pan simultané au pinch
    const lastCenter = lastTouchCenterRef.current;
    if (lastCenter) {
      vpRef.current = applyPan(
        vpRef.current,
        center.x - lastCenter.x,
        center.y - lastCenter.y,
      );
    }
    lastTouchCenterRef.current = center;

    // Zoom centré sur le pivot (pivot en CSS pixels)
    const vp = vpRef.current;
    const worldX = (pivotX - vp.offset.x) / vp.zoom;
    const worldY = (pivotY - vp.offset.y) / vp.zoom;
    vpRef.current = {
      zoom: newZoom,
      offset: { x: pivotX - worldX * newZoom, y: pivotY - worldY * newZoom },
    };
  }, []);

  const onTouchEnd = useCallback((_e: React.TouchEvent<HTMLCanvasElement>) => {
    initialPinchDistRef.current = null;
    lastTouchCenterRef.current = null;
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      {/*
        Le canvas n'a PAS de classes w-full/h-full.
        Sa taille est entièrement contrôlée par style.width/height (CSS)
        et canvas.width/height (buffer DPR) dans le useEffect resize.
        Cela empêche le navigateur de modifier le buffer automatiquement.
      */}
      <canvas
        ref={canvasRef}
        style={{ cursor, display: "block" }}
        className="absolute top-0 left-0 touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
}
