export type CellData<TNodeType, TEdgeType, TMeta = unknown> =
  | { cellType: "NODE"; type: TNodeType; value: unknown; meta?: TMeta }
  | { cellType: "EDGE"; type: TEdgeType; value: unknown; meta?: TMeta };

export type AllowedCellData<TMeta = unknown> = PersonCellData<TMeta>;
