import type { Node as X6Node } from "@antv/x6";

import type { BaseGraphDep as GraphDep, BaseNodeDep } from "@/utils/x6/index";

type NodePersonDep = { data: Person; meta?: NodePersonMeta };
type NodePersonPlaceholderDep = { type: NodeType; data: { nodes: [X6Node] } };
type NodePersonRelationshipDep = { data: { nodes: [X6Node, X6Node] } };

type AnimationNodePersonDep = BaseNodeDep & { options?: { fill?: boolean } };

export const createNodePerson = ({ graph }: GraphDep) => ({ data, meta }: NodePersonDep) => {
  return graph.createNode({
    shape: meta?.isStack ? NODE_PERSON_STACK : NODE_PERSON,
    data: { cellType: "NODE", type: "PERSON", value: data, meta } satisfies CellData,
  });
};

export const createNodePersonPlaceholder = ({ graph }: GraphDep) => ({ type, data }: NodePersonPlaceholderDep) => {
  return graph.createNode({
    shape: NODE_PERSON_PLACEHOLDER,
    data: { cellType: "NODE", type, value: data } satisfies CellData,
  });
};

export const createNodePersonRelationship = ({ graph }: GraphDep) => ({ data }: NodePersonRelationshipDep) => {
  return graph.createNode({
    shape: NODE_PERSON_INTERMEDIARY,
    data: { cellType: "NODE", type: "PERSON_RELATIONSHIP", value: data } satisfies CellData,
  });
};

export const animateNodePerson = ({ node, options = {} }: AnimationNodePersonDep) => {
  const targetWidth = options.fill ? "100%" : "0%";

  node.animate({ "attrs/.content-t/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-t/refWidth", targetWidth));
  node.animate({ "attrs/.content-b/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-b/refWidth", targetWidth));
};
