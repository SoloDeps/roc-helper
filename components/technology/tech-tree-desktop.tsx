"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./tech-node";
import { buildGraphData, layoutGraph } from "@/lib/layout-graph";
import { TechDetailsPanel } from "./tech-details-panel";
import type { TechnoData } from "@/types/shared";
import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB } from "@/lib/db/schema";

interface TechTreeDesktopProps {
  technologies: TechnoData[];
}

export function TechTreeDesktop({ technologies }: TechTreeDesktopProps) {
  const [selectedTech, setSelectedTech] = useState<TechnoData | null>(null);

  // Fetch completion status from DB
  const technosInDB = useLiveQuery(async () => {
    const db = getWikiDB();
    const techIds = technologies.map((t) => t.id);
    return await db.technos.where("id").anyOf(techIds).toArray();
  }, [technologies]);

  // Build and layout graph with completion status
  const { initialNodes, initialEdges } = useMemo(() => {
    // Enrich technologies with completion status
    const enrichedTechnologies = technologies.map((tech) => {
      const dbTech = technosInDB?.find((t) => t.id === tech.id);
      return {
        ...tech,
        completed: dbTech?.hidden ?? false, // hidden = completed
      };
    });

    const { nodes, edges } = buildGraphData(enrichedTechnologies as any);
    const layoutedNodes = layoutGraph(nodes, edges, "LR");

    return {
      initialNodes: layoutedNodes,
      initialEdges: edges,
    };
  }, [technologies, technosInDB]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Fit view on mount
  const onInit = useCallback((instance: any) => {
    instance.fitView({ padding: 0.2 });
  }, []);

  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      const tech = technologies.find((t) => t.id === node.id);
      if (tech) {
        setSelectedTech(tech);
      }
    },
    [technologies],
  );

  // Handle node double-click to toggle completion
  const onNodeDoubleClick = useCallback(
    async (event: React.MouseEvent, node: any) => {
      const db = getWikiDB();
      const techno = await db.technos.get(node.id);

      if (techno) {
        await db.technos.update(node.id, {
          hidden: !techno.hidden,
          updatedAt: Date.now(),
        });
      }
    },
    [],
  );

  return (
    <>
      <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden bg-background-300/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          {/* <Background /> */}
          <Controls
            showInteractive={false}
            className="[&>button]:bg-background! dark:[&>button]:bg-background-200! dark:[&>button]:text-white! [&>button]:text-black! [&>button]:border-gray-400!"
          />

          {/* Tech Details Panel */}
          {selectedTech && (
            <Panel position="top-right" className="m-2 w-96 rounded-lg! overflow-hidden!">
              <TechDetailsPanel
                tech={selectedTech}
                onClose={() => setSelectedTech(null)}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>
    </>
  );
}
