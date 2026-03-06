// X6
export const NODE_PERSON = "node-person";
export const EDGE_LINE = "edge-line";
export type Dimension = { width: number; height: number };

// Dagre
export const DAGRE_RANKDIRS = ["LR", "RL", "TB", "BT"] as const;
export type DagreRankdir = typeof DAGRE_RANKDIRS[number];
