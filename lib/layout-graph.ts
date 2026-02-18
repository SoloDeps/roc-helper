import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

export interface TechNode {
  id: string;
  name: string;
  column: number;
  required?: string[];
  costs: {
    research_points?: number;
    coins?: number;
    food?: number;
    goods?: Array<{ resource: string; amount: number }>;
  };
  allied?: string;
  hidden?: boolean;
}

export function buildGraphData(technos: TechNode[]): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = technos.map((techno) => ({
    id: techno.id,
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      name: techno.name,
      costs: techno.costs,
      allied: techno.allied,
      hidden: techno.hidden,
    },
  }));

  const edges: Edge[] = [];
  technos.forEach((techno) => {
    if (techno.required?.length) {
      techno.required.forEach((reqId) => {
        edges.push({
          id: `${reqId}-${techno.id}`,
          source: reqId,
          target: techno.id,
          type: "smoothstep",
          animated: false,
        });
      });
    }
  });

  return { nodes, edges };
}

export function layoutGraph(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" = "LR",
  technos?: TechNode[],
): Node[] {
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 50;
  const NODESEP = 30; // vertical gap between nodes in same column
  const RANKSEP = 100; // horizontal gap between columns

  // Build column map from techno data if available
  const columnMap = new Map<string, number>();
  if (technos) {
    technos.forEach((t) => columnMap.set(t.id, t.column));
  }

  // --- Group nodes by column ---
  const columnGroups = new Map<number, string[]>(); // column → node ids
  nodes.forEach((node) => {
    const col = columnMap.get(node.id) ?? 0;
    if (!columnGroups.has(col)) columnGroups.set(col, []);
    columnGroups.get(col)!.push(node.id);
  });

  // Sort columns
  const sortedColumns = Array.from(columnGroups.keys()).sort((a, b) => a - b);

  // Map column index → X position (use sorted index for clean spacing)
  const columnToX = new Map<number, number>();
  sortedColumns.forEach((col, i) => {
    columnToX.set(col, i * (NODE_WIDTH + RANKSEP));
  });

  // --- Use dagre only to get a good vertical ordering within each column ---
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: NODESEP,
    ranksep: RANKSEP,
    edgesep: 10,
  });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);

  // --- For each column, center nodes vertically, sorted by dagre Y order ---
  const positions = new Map<string, { x: number; y: number }>();

  sortedColumns.forEach((col) => {
    const ids = columnGroups.get(col)!;
    const x = columnToX.get(col)!;

    // Sort by dagre Y to preserve a clean top→bottom order within the column
    const sorted = [...ids].sort((a, b) => {
      return dagreGraph.node(a).y - dagreGraph.node(b).y;
    });

    const totalHeight =
      sorted.length * NODE_HEIGHT + (sorted.length - 1) * NODESEP;
    const startY = -totalHeight / 2;

    sorted.forEach((id, i) => {
      positions.set(id, {
        x,
        y: startY + i * (NODE_HEIGHT + NODESEP),
      });
    });
  });

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? { x: 0, y: 0 },
  }));
}
