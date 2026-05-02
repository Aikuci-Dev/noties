const DAGRE_RANKDIRS = ["LR", "RL", "TB", "BT"] as const;
export type DagreRankdir = (typeof DAGRE_RANKDIRS)[number];
