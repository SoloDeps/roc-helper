import type { TechnoData } from "@/types/shared";

/**
 * Collecte TOUS les ancêtres d'un node cible (toutes branches récursivement).
 * = "tout ce qu'il faut débloquer pour atteindre targetId"
 */
export function getAllAncestors(
  targetId: string,
  technologies: TechnoData[]
): { nodeIds: Set<string>; edgeIds: Set<string> } {
  // Build map id → required[]
  const techMap = new Map(technologies.map((t) => [t.id, t]));

  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  function dfs(id: string) {
    const tech = techMap.get(id);
    if (!tech) return;
    for (const reqId of tech.required ?? []) {
      edgeIds.add(`${reqId}-${id}`);
      if (!nodeIds.has(reqId)) {
        nodeIds.add(reqId);
        dfs(reqId);
      }
    }
  }

  nodeIds.add(targetId);
  dfs(targetId);

  return { nodeIds, edgeIds };
}

/**
 * Sous-graphe entre fromId et toId :
 * ancêtres de toId qui sont aussi descendants de fromId.
 * = "chemin(s) possible(s) entre deux technos"
 */
export function getSubgraphBetween(
  fromId: string,
  toId: string,
  technologies: TechnoData[]
): { nodeIds: Set<string>; edgeIds: Set<string>; found: boolean } {
  const techMap = new Map(technologies.map((t) => [t.id, t]));

  // 1. Descendants de fromId (forward DFS via reverse-required)
  // Build children map
  const children = new Map<string, string[]>();
  technologies.forEach((t) => {
    for (const reqId of t.required ?? []) {
      if (!children.has(reqId)) children.set(reqId, []);
      children.get(reqId)!.push(t.id);
    }
  });

  const descendants = new Set<string>();
  function dfsDown(id: string) {
    for (const child of children.get(id) ?? []) {
      if (!descendants.has(child)) {
        descendants.add(child);
        dfsDown(child);
      }
    }
  }
  descendants.add(fromId);
  dfsDown(fromId);

  // 2. Ancêtres de toId (backward DFS via required[])
  const ancestors = new Set<string>();
  function dfsUp(id: string) {
    const tech = techMap.get(id);
    for (const reqId of tech?.required ?? []) {
      if (!ancestors.has(reqId)) {
        ancestors.add(reqId);
        dfsUp(reqId);
      }
    }
  }
  ancestors.add(toId);
  dfsUp(toId);

  // 3. Intersection = nodes sur le(s) chemin(s)
  const nodeIds = new Set<string>();
  descendants.forEach((id) => {
    if (ancestors.has(id)) nodeIds.add(id);
  });

  if (!nodeIds.has(toId) || !nodeIds.has(fromId)) {
    return { nodeIds: new Set(), edgeIds: new Set(), found: false };
  }

  // 4. Edges dans ce sous-graphe
  const edgeIds = new Set<string>();
  nodeIds.forEach((id) => {
    const tech = techMap.get(id);
    for (const reqId of tech?.required ?? []) {
      if (nodeIds.has(reqId)) {
        edgeIds.add(`${reqId}-${id}`);
      }
    }
  });

  return { nodeIds, edgeIds, found: true };
}

/**
 * Retourne les technos ordonnées par colonne pour affichage
 */
export function getOrderedTechs(
  nodeIds: Set<string>,
  technologies: TechnoData[]
): TechnoData[] {
  return technologies
    .filter((t) => nodeIds.has(t.id))
    .sort((a, b) => a.column - b.column);
}
