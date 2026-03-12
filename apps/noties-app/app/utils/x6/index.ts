// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import { Graph } from "@antv/x6";

import edgeLine from "~/components/x6/default/edge-line";
import nodePlaceholder from "~/components/x6/default/node-placeholder";
import nodePerson from "~/components/x6/person/node-person";

export function registration({ nodePersonDimension }: { nodePersonDimension: Dimension }) {
  Graph.registerNode(NODE_PERSON, nodePerson({ dimension: nodePersonDimension }), true);
  Graph.registerNode(NODE_PERSON_STACK, nodePerson({ dimension: nodePersonDimension, isStack: true }), true);
  Graph.registerNode(NODE_PERSON_PLACEHOLDER, nodePlaceholder(), true);
  Graph.registerNode(NODE_PERSON_INTERMEDIARY, nodePlaceholder({ radius: 2 }), true);

  Graph.registerEdge(EDGE_LINE, edgeLine(), true);
  Graph.registerEdge(EDGE_LINE_DASH, edgeLine({ isDash: true }), true);
}

export function graphInstance({ container, gridSize }: { gridSize: number; container?: HTMLElement }) {
  if (!container) return;

  // https://x6.antv.antgroup.com/en/api/graph/graph
  return new Graph({
    container,
    virtual: true,
    interacting: false,
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

export function animation({ graph }: { graph: Graph }) {
  graph.on("node:mouseenter", ({ node }) => {
    const { type } = node.data as CellData;
    if (type === "PERSON") animateNodePerson(node, { fill: true });
  });
  graph.on("node:mouseleave", ({ node }) => {
    const { type } = node.data as CellData;
    if (type === "PERSON") animateNodePerson(node);
  });
}
