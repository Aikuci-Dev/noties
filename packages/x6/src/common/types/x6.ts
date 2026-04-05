import type { Cell, Graph, Node as X6Node } from "@antv/x6";

import type { Id } from "@noties/shared-type";

import type { DagreRankdir } from "./dagre";

/**
 * =========================
 * NODE
 * =========================
 */
// Collections
export type NodeWithChildrenNodeMap<T extends Id> = Map<T, { node: X6Node; nodeChildren: X6Node[] }>;

/**
 * =========================
 * EDGE
 * =========================
 */
// Entity
export type BaseEdgeValue = { source: Cell; target: Cell };
export type BaseEdgeMeta = { type: "default" | "dash" };

/**
 * =========================
 * DEPENDENCY INJECTION
 * =========================
 */
// Base
export type BaseGraphDep = { graph: Graph };
export type BaseNodeDep = { node: X6Node };

// Graph
export type GraphDep = BaseGraphDep & { options: GraphLayoutDep };
export type GraphLayoutDep = { gap: number; rankdir?: DagreRankdir };
