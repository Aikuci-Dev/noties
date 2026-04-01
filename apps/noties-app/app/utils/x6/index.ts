import type { Node as X6Node } from "@antv/x6";

import { Graph } from "@antv/x6";

import edgeLine from "~/components/x6/default/edge-line";
import nodePlaceholder from "~/components/x6/default/node-placeholder";
import buttonNodeEditPerson from "~/components/x6/person/button-node-edit-person";
import nodePerson from "~/components/x6/person/node-person";

export type BaseGraphDep = { graph: Graph };
export type BaseNodeDep = { node: X6Node };

export function registerCells(
  { nodePersonDimension, nodePersonRadius, handleNodePersonClick }: {
    nodePersonDimension: Dimension;
    nodePersonRadius?: { default?: number; placeholder?: number; intermediary?: number };
    handleNodePersonClick?: (data: Person) => void;
  },
) {
  const nodePersonOptions = { dimension: nodePersonDimension, radius: nodePersonRadius?.default ?? 8 };
  Graph.registerNode(NODE_PERSON, nodePerson(nodePersonOptions), true);
  Graph.registerNode(NODE_PERSON_STACK, nodePerson({ ...nodePersonOptions, isStack: true }), true);
  Graph.registerNode(NODE_PERSON_PLACEHOLDER, nodePlaceholder({ radius: nodePersonRadius?.placeholder }), true);
  Graph.registerNode(NODE_PERSON_INTERMEDIARY, nodePlaceholder({ radius: nodePersonRadius?.intermediary ?? 2 }), true);
  Graph.registerNodeTool(BUTTON_NODE_EDIT_PERSON, buttonNodeEditPerson({ handleClick: handleNodePersonClick }), true);

  Graph.registerEdge(EDGE_LINE, edgeLine(), true);
  Graph.registerEdge(EDGE_LINE_DASH, edgeLine({ isDash: true }), true);
}

export function createGraphInstance({ container, gridSize }: { gridSize: number; container: HTMLElement }) {
  // https://x6.antv.antgroup.com/en/api/graph/graph
  return new Graph({
    container,
    virtual: true,
    interacting: {
      // // general
      // toolsAddable: false,

      // edge
      edgeMovable: false,
      edgeLabelMovable: false,
      arrowheadMovable: false,
      vertexMovable: false,
      vertexAddable: false,
      vertexDeletable: false,
      useEdgeTools: false,

      // node
      nodeMovable: false,
      magnetConnectable: false,
      stopDelegateOnDragging: false,
    },
    autoResize: true,
    background: { color: "#eee" },
    grid: {
      visible: true,
      type: "dot",
      size: gridSize,
      args: [{ color: "#bbb", thickness: 2 }],
    },
  });
}

export function addAnimation({ graph }: { graph: Graph }) {
  graph.on("node:mouseenter", ({ node }) => {
    const { type } = node.data as AllowedCellData;
    if (type === "PERSON") animateNodePerson({ node, options: { fill: true } });
  });
  graph.on("node:mouseleave", ({ node }) => {
    const { type } = node.data as AllowedCellData;
    if (type === "PERSON") animateNodePerson({ node, options: { fill: false } });
  });
}

export function addInteraction({ graph }: { graph: Graph }) {
  graph.on("node:mouseenter", ({ node }) => {
    const { type } = node.data as AllowedCellData;
    if (type === "PERSON") {
      node.addTools(BUTTON_NODE_EDIT_PERSON);
    }
  });
  graph.on("node:mouseleave", ({ node }) => {
    const { type } = node.data as AllowedCellData;
    if (type === "PERSON") node.removeTools();
  });
}
