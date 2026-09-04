import { BuildingImage } from "@/components/heritage/building-image";
import { getHeritageBuildingImageUrl } from "@/lib/heritage-images";
import type { HeritageEligibleBuilding } from "@/resolvers/heritage";

/**
 * Les évolutifs sacrifiables du thème.
 *
 * Deux gabarits, une seule donnée : sur mobile la vignette de 96 px de haut ne
 * sert à rien — c'est le NOM qui identifie le bâtiment, l'image ne fait que
 * l'illustrer — et quatre d'entre elles poussaient le reste de la page hors
 * écran. Elle y est réduite à une pastille de 32 px devant le nom. À partir de
 * md, la grille de vignettes d'origine reprend : la place existe.
 */
export function EligibleBuildingsList({
  buildings,
}: {
  buildings: HeritageEligibleBuilding[];
}) {
  if (buildings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No eligible evolving building for this theme.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-1.5 md:hidden">
        {buildings.map((building) => (
          <span
            key={building.buildingId}
            className="flex min-w-0 items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 shadow-sm"
          >
            <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/40">
              <BuildingImage
                src={getHeritageBuildingImageUrl(building.buildingId)}
                alt=""
              />
            </span>
            <span className="truncate text-[12px] font-semibold text-foreground">
              {building.name}
            </span>
          </span>
        ))}
      </div>

      <div className="hidden grid-cols-2 gap-2 md:grid lg:grid-cols-3">
        {buildings.map((building) => (
          <div
            key={building.buildingId}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm"
          >
            <div className="flex h-24 items-center justify-center bg-card p-1.5">
              <BuildingImage
                src={getHeritageBuildingImageUrl(building.buildingId)}
                alt={building.name}
              />
            </div>
            <p className="truncate px-2 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-foreground">
              {building.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
