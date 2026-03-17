import type { Node as X6Node } from "@antv/x6";

export type CellData<TNodeType, TEdgeType, TMeta = unknown> =
  | { cellType: "NODE"; type: TNodeType; value: unknown; meta?: TMeta }
  | { cellType: "EDGE"; type: TEdgeType; value: unknown; meta?: TMeta };

export type AllowedCellData<TMeta = unknown> = PersonCellData<TMeta>;

export type NodeWithChildrenNodeMap<T extends Id> = Map<T, { node: X6Node; nodeChildren: X6Node[] }>;
