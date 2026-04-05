import type { BaseGraphDep, BaseNodeDep } from "@/common/types";
import { EDGE_LINE, EDGE_LINE_DASH } from "@/common/components";

import type {
  AnimationNodePersonOptions,
  EdgeData,
  EdgePersonData,
  EdgeType,
  NodeData,
  NodePersonData,
  NodePersonPlaceholderData,
  NodePersonRelationshipData,
  NodeType,
} from "../types";
import { NODE_PERSON, NODE_PERSON_INTERMEDIARY, NODE_PERSON_PLACEHOLDER, NODE_PERSON_STACK } from "../components";

/**
 * =========================
 * NODE
 * =========================
 */
export const createNodePerson = ({ graph }: BaseGraphDep) => ({ value, original, meta }: NodePersonData) => {
  return graph.createNode({
    shape: meta?.isStack ? NODE_PERSON_STACK : NODE_PERSON,
    data: { type: "NODE_PERSON", personType: "PERSON", value, original, meta } satisfies NodeData,
  });
};

export const createNodePersonPlaceholder =
  ({ graph }: BaseGraphDep) => ({ personType, value }: { personType: NodeType } & NodePersonPlaceholderData) => {
    return graph.createNode({
      shape: NODE_PERSON_PLACEHOLDER,
      data: { type: "NODE_PERSON_PLACEHOLDER", personType, value } satisfies NodeData,
    });
  };

export const createNodePersonRelationship = ({ graph }: BaseGraphDep) => ({ value }: NodePersonRelationshipData) => {
  return graph.createNode({
    shape: NODE_PERSON_INTERMEDIARY,
    data: { type: "NODE_PERSON_RELATIONSHIP", personType: "PERSON_RELATIONSHIP", value } satisfies NodeData,
  });
};

// NODE Animation
export const animateNodePerson = ({ node }: BaseNodeDep) => ({ options = {} }: AnimationNodePersonOptions) => {
  const targetWidth = options.fill ? "100%" : "0%";

  node.animate({ "attrs/.content-t/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-t/refWidth", targetWidth));
  node.animate({ "attrs/.content-b/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-b/refWidth", targetWidth));
};

/**
 * =========================
 * EDGE
 * =========================
 */
export const createEdgePerson =
  ({ graph }: BaseGraphDep) => ({ personType = "PERSON", value, meta }: { personType?: EdgeType } & EdgePersonData) => {
    const { source, target } = value;

    return graph.createEdge({
      shape: meta?.type === "dash" ? EDGE_LINE_DASH : EDGE_LINE,
      source: { cell: source.id },
      target: { cell: target.id },
      data: { type: "EDGE_LINE", personType, value, meta } satisfies EdgeData,
    });
  };
