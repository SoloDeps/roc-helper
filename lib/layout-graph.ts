import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

export interface TechNode {
  id: string;
  name: string;
  column: number;
  costs: {
    research_points?: number;
    coins?: number;
    food?: number;
    goods?: Array<{ resource: string; amount: number }>;
  };
  allied?: string;
  hidden?: boolean;
}

/**
 * Convert TechnoData to React Flow nodes and edges
 */
export function buildGraphData(technos: TechNode[]): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = technos.map((techno) => ({
    id: techno.id,
    type: "custom",
    position: { x: 0, y: 0 }, // Will be calculated by dagre
    data: {
      name: techno.name,
      costs: techno.costs,
      allied: techno.allied,
      hidden: techno.hidden,
    },
  }));

  // Build edges based on column relationships
  const edges: Edge[] = [];
  const technosByColumn = new Map<number, TechNode[]>();

  // Group by column
  technos.forEach((techno) => {
    if (!technosByColumn.has(techno.column)) {
      technosByColumn.set(techno.column, []);
    }
    technosByColumn.get(techno.column)!.push(techno);
  });

  // Create edges from column N to column N+1
  technos.forEach((techno) => {
    const nextColumn = technosByColumn.get(techno.column + 1);
    if (nextColumn) {
      nextColumn.forEach((nextTechno) => {
        edges.push({
          id: `${techno.id}-${nextTechno.id}`,
          source: techno.id,
          target: nextTechno.id,
          type: "smoothstep",
          animated: false,
        });
      });
    }
  });

  return { nodes, edges };
}

/**
 * Apply Dagre layout to nodes
 */
export function layoutGraph(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" = "LR"
): Node[] {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure graph layout
  dagreGraph.setGraph({
    rankdir: direction, // Left to Right
    nodesep: 80, // Vertical spacing between nodes
    ranksep: 200, // Horizontal spacing between columns
    edgesep: 50,
  });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: 200,
      height: 120,
    });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  return nodes.map((node) => {
    const position = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: position.x - 100, // Center the node (width / 2)
        y: position.y - 60, // Center the node (height / 2)
      },
    };
  });
}
