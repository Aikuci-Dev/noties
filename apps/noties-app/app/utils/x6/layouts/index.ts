import type { BaseGraphDep } from "@/utils/x6/index";

export type GraphLayoutDep = { gap: number; rankdir?: DagreRankdir };
export type GraphDep = BaseGraphDep & { options: GraphLayoutDep };
