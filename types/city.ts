// ============================================================
// types/city.ts — Source de vérité unique pour le city planner
// ============================================================

// Les 8 layouts disponibles (Capital et Harbor séparés)
export type CityKey =
  | 'City_Capital'
  | 'City_Harbor'
  | 'City_Egypt'
  | 'City_China'
  | 'City_Vikings'
  | 'City_Mayas'
  | 'City_Arabia'

// Type de cellule dans la grille normalisée
export const enum CellType {
  VOID    = 0,  // hors carte — pas de tile dessinée (eau, vide, jungle)
  EMPTY   = 1,  // jouable, rien dessus
  LOCKED  = 2,  // bloc débloquable (premium ou progression)
  RIVER   = 3,  // overlay manuel — rivière/fjord/mer (fond visible différent)
  FIXED   = 4,  // bâtiment fixe non déplaçable (city hall, etc.)
}

// Source des données
export type CitySource = 'manual' | 'game-api'

// Bloc d'expansion brut depuis l'API
export interface ApiExpansionBlock {
  key: string
  x: number
  y: number
  width: number
  height: number
  unlocked: boolean
}

// Bâtiment brut depuis l'API
export interface ApiBuilding {
  uuid: string
  key: string       // ex: "Building_Egypt_City_CityHall_1"
  x: number
  y: number
  era: string
  level: number | null
  isLocked: boolean
}

// Format JSON de chaque fichier City_*.json
export interface CityApiFile {
  cityId: number
  cityKey: string
  buildings: ApiBuilding[]
  expansions: ApiExpansionBlock[]
  buildingCounters?: Record<string, number>
}

// Grille normalisée — coordonnées internes (0,0) = coin supérieur gauche
export interface GridData {
  cells: number[]     // flat: index = row * cols + col (number[] = freeze-safe pour immer)
  cols: number        // nombre de cellules (pas de blocs)
  rows: number
  blockSize: number   // taille des blocs en tuiles (3 ou 4)
  originX: number     // coord API du col 0
  originY: number     // coord API du row 0
}

// Bâtiment placé sur la carte (coordonnées internes normalisées)
export interface PlacedBuilding {
  instanceId: string        // uuid depuis l'API, ou généré localement
  buildingKey: string       // clé du catalogue ex: "Building_Egypt_Home_Small_6"
  col: number               // colonne dans la grille normalisée
  row: number               // ligne dans la grille normalisée
  rotation?: 0 | 90 | 180 | 270
  level?: number | null
  era?: string
  isLocked?: boolean
  source: 'api' | 'manual'  // traçabilité
}

// Layout complet d'une ville — format interne unique
export interface CityLayout {
  cityKey: CityKey
  source: CitySource
  grid: GridData
  placedBuildings: PlacedBuilding[]
  loadedAt: number          // timestamp pour cache/invalidation
}

// ============================================================
// Catalogue de bâtiments — stats statiques (depuis wiki)
// ============================================================

export type BuildingCategory =
  | 'home'
  | 'farm'
  | 'workshop'
  | 'culture'
  | 'barracks'
  | 'harbor'
  | 'decoration'
  | 'special'
  | 'irrigation'
  | 'mine'
  | 'city_hall'

export interface BuildingDef {
  key: string
  name: string
  tileW: number             // largeur en tuiles
  tileH: number             // hauteur en tuiles
  category: BuildingCategory
  happinessBonus?: number   // bonus bonheur fixe
  motivationRadius?: number // rayon d'influence en tuiles (sites culturels)
  baseProduction?: number   // production de base par heure
  maxLevel?: number
}

// ============================================================
// Helpers de grille
// ============================================================

export function getCellType(grid: GridData, col: number, row: number): CellType {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return CellType.VOID
  return grid.cells[row * grid.cols + col] as CellType
}

export function setCellType(grid: GridData, col: number, row: number, type: CellType): void {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return
  grid.cells[row * grid.cols + col] = type
}

// Convertir coordonnées API → coordonnées grille interne
export function apiToGrid(apiX: number, apiY: number, grid: GridData): { col: number; row: number } {
  return {
    col: apiX - grid.originX,
    row: apiY - grid.originY,
  }
}

// Convertir coordonnées grille → pixel canvas (top-down)
export function gridToCanvas(col: number, row: number, cellSize: number): { x: number; y: number } {
  return {
    x: col * cellSize,
    y: row * cellSize,
  }
}

// Convertir pixel canvas → coordonnées grille
export function canvasToGrid(
  canvasX: number,
  canvasY: number,
  tx: number,
  ty: number,
  scale: number,
  cellSize: number
): { col: number; row: number } {
  const worldX = (canvasX - tx) / scale
  const worldY = (canvasY - ty) / scale
  return {
    col: Math.floor(worldX / cellSize),
    row: Math.floor(worldY / cellSize),
  }
}