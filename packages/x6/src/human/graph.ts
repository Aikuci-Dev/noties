import { Graph } from "@antv/x6";

import type { Dimension } from "@noties/shared-type";

import { EDGE_LINE, EDGE_LINE_DASH, edgeLine, nodePlaceholder } from "@/common/components";

import type { NodeData, NodePersonData } from "./types";
import {
  BUTTON_NODE_EDIT,
  buttonNodeEdit,
  node,
  NODE_PERSON,
  NODE_PERSON_INTERMEDIARY,
  NODE_PERSON_PLACEHOLDER,
  NODE_PERSON_STACK,
} from "./components";
import { animateNodePerson } from "./utils";
import type { BaseGraphDep } from "../common";

export function registerCells(options: {
  nodePersonDimension: Dimension;
  nodePersonRadius?: { default?: number; placeholder?: number; intermediary?: number };
  handleNodePersonClick?: (data: NodePersonData) => void;
}) {
  const { nodePersonDimension, nodePersonRadius, handleNodePersonClick } = options;

  const nodePersonOptions = { dimension: nodePersonDimension, radius: nodePersonRadius?.default ?? 8 };
  Graph.registerNode(NODE_PERSON, node(nodePersonOptions), true);
  Graph.registerNode(NODE_PERSON_STACK, node({ ...nodePersonOptions, isStack: true }), true);

  Graph.registerNode(NODE_PERSON_PLACEHOLDER, nodePlaceholder({ radius: nodePersonRadius?.placeholder }), true);
  Graph.registerNode(NODE_PERSON_INTERMEDIARY, nodePlaceholder({ radius: nodePersonRadius?.intermediary ?? 2 }), true);

  Graph.registerNodeTool(BUTTON_NODE_EDIT, buttonNodeEdit({ handleClick: handleNodePersonClick }), true);

  Graph.registerEdge(EDGE_LINE, edgeLine(), true);
  Graph.registerEdge(EDGE_LINE_DASH, edgeLine({ isDash: true }), true);
}

export function addAnimation({ graph }: BaseGraphDep) {
  graph.on("node:mouseenter", ({ node }) => {
    const { type } = node.data as NodeData;
    if (type === "NODE_PERSON") animateNodePerson({ node })({ options: { fill: true } });
  });
  graph.on("node:mouseleave", ({ node }) => {
    const { type } = node.data as NodeData;
    if (type === "NODE_PERSON") animateNodePerson({ node })({ options: { fill: false } });
  });
}

export function addInteraction({ graph }: BaseGraphDep) {
  graph.on("node:mouseenter", ({ node }) => {
    const { type } = node.data as NodeData;
    if (type === "NODE_PERSON") node.addTools(BUTTON_NODE_EDIT);
  });
  graph.on("node:mouseleave", ({ node }) => {
    const { type } = node.data as NodeData;
    if (type === "NODE_PERSON") node.removeTools();
  });
}
