import type { Node as X6Node } from "@antv/x6";

import type { People, Person, PersonWithMeta } from "@noties/shared-type";

import type { BaseEdgeValue } from "@/common/types";

import type { EdgeMeta, Node as PersonNode, NodeMeta, NodePersonMap, NodePersonWithChildrenNodeMap } from "./person";

/**
 * =========================
 * NODE
 * =========================
 */
export type NodePersonData = { value: PersonNode; original: Person | PersonWithMeta; meta?: NodeMeta };
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
export type CellDep<T extends Person | PersonWithMeta = Person> = { people: People<T> };

// Node
export type NodeDep = { nodePersonMap: NodePersonMap };
export type NodeWithChildrenNodeDep = { nodesWithChildrenMap: NodePersonWithChildrenNodeMap };
