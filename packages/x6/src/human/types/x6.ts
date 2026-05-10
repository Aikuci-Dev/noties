import type { Node as X6Node } from "@antv/x6";

import type { Human } from "@noties/shared-schema";

import type { BaseEdgeValue } from "@/common/types";

import type {
  EdgeMeta,
  Node as PersonNode,
  NodeMeta,
  NodePersonMap,
  NodePersonWithChildrenNodeMap,
  PersonSchema,
} from "./person";

/**
 * =========================
 * NODE
 * =========================
 */
export type NodePersonData = { value: PersonNode; original: Human.PersonLike; meta?: NodeMeta };
export type NodePersonPlaceholderData = { value: { nodes: [X6Node] } };
export type NodePersonRelationshipData = { value: { nodes: [X6Node, X6Node] } };

// Animation
export type AnimationNodePersonOptions = { options?: { fill?: boolean } };

/**
 * =========================
 * EDGE
 * =========================
 */
export type EdgePersonData = { value: BaseEdgeValue; meta?: EdgeMeta };

/**
 * =========================
 * DEPENDENCY INJECTION
 * =========================
 */
// Cell
export type CellDep<T extends Human.PersonLike = PersonSchema> = { people: Human.People<T> };

// Node
export type NodeDep<T extends Human.PersonLike = PersonSchema> = { nodePersonMap: NodePersonMap<T> };
export type NodeWithChildrenNodeDep<T extends Human.PersonWithChildrenLike = Human.Simple.Schema> = {
  nodesWithChildrenMap: NodePersonWithChildrenNodeMap<T>;
};
