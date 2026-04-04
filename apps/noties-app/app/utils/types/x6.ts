import type { Cell, Node as X6Node } from "@antv/x6";

import type { Id } from "@noties/shared-type";

// Cell
export type AllowedCellData = PersonCellData;

// Node
export const NODE_PLACEHOLDER = "node-placeholder";
export const NODE_INTERMEDIARY = "node-intermediary";

export type NodePersonMap = Map<Person["id"], X6Node>;
export type NodePersonRelationshipMap = Map<string, X6Node>; // `relationship-${T['id']}`
export type NodeWithChildrenNodeMap<T extends Id> = Map<T, { node: X6Node; nodeChildren: X6Node[] }>;

// Edge
export const EDGE_LINE = "edge-line";
export const EDGE_LINE_DASH = "edge-line-dash";

export type BaseEdgeValue = { source: Cell; target: Cell };
export type BaseEdgeMeta = { type: "default" | "dash" };
