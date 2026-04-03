import type { Node as X6Node } from "@antv/x6";

import type { BaseGraphDep as GraphDep, BaseNodeDep as NodeDep } from "@/utils/x6/index";

// EDGE
export type EdgePersonData = { value: BaseEdgeValue; meta?: PersonEdgeMeta };
type EdgePersonDep = { personType?: AllowedPersonEdgeType } & EdgePersonData;
export const createEdgePerson = ({ graph }: GraphDep) => ({ personType = "PERSON", value, meta }: EdgePersonDep) => {
  const { source, target } = value;

  return graph.createEdge({
    shape: meta?.type === "dash" ? EDGE_LINE_DASH : EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
    data: { type: "EDGE_LINE", personType, value, meta } satisfies PersonEdgeData,
  });
};

// NODE
export type NodePersonData = { value: PersonNode; original: Person | PersonWithMeta; meta?: PersonNodeMeta };
type NodePersonDep = NodePersonData;
export const createNodePerson = ({ graph }: GraphDep) => ({ value, original, meta }: NodePersonDep) => {
  return graph.createNode({
    shape: meta?.isStack ? NODE_PERSON_STACK : NODE_PERSON,
    data: { type: "NODE_PERSON", personType: "PERSON", value, original, meta } satisfies PersonNodeData,
  });
};

export type NodePersonPlaceholderData = { value: { nodes: [X6Node] } };
type NodePersonPlaceholderDep = { personType: AllowedPersonNodeType } & NodePersonPlaceholderData;
export const createNodePersonPlaceholder =
  ({ graph }: GraphDep) => ({ personType, value }: NodePersonPlaceholderDep) => {
    return graph.createNode({
      shape: NODE_PERSON_PLACEHOLDER,
      data: { type: "NODE_PERSON_PLACEHOLDER", personType, value } satisfies PersonNodeData,
    });
  };

export type NodePersonRelationshipData = { value: { nodes: [X6Node, X6Node] } };
type NodePersonRelationshipDep = NodePersonRelationshipData;
export const createNodePersonRelationship = ({ graph }: GraphDep) => ({ value }: NodePersonRelationshipDep) => {
  return graph.createNode({
    shape: NODE_PERSON_INTERMEDIARY,
    data: { type: "NODE_PERSON_RELATIONSHIP", personType: "PERSON_RELATIONSHIP", value } satisfies PersonNodeData,
  });
};

export type AnimationNodePersonOptions = { options?: { fill?: boolean } };
type AnimationNodePersonDep = AnimationNodePersonOptions;
export const animateNodePerson = ({ node }: NodeDep) => ({ options = {} }: AnimationNodePersonDep) => {
  const targetWidth = options.fill ? "100%" : "0%";

  node.animate({ "attrs/.content-t/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-t/refWidth", targetWidth));
  node.animate({ "attrs/.content-b/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-b/refWidth", targetWidth));
};
