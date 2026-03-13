import type { Graph } from "@antv/x6";

export type GraphArgs = { graph: Graph };
export type GraphLayoutArgs = { gap: number; rankdir?: DagreRankdir };
export type GraphDep = GraphArgs & { options: GraphLayoutArgs };
