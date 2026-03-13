import type { Cell } from "@antv/x6";

import type { BaseGraphDep as GraphDep } from "@/utils/x6/index";

type EdgeLineDep = { data: { source: Cell; target: Cell }; meta?: EdgeLineMeta; type?: EdgeType };

export const createEdgeLine = ({ graph }: GraphDep) => ({ data, meta, type = "LINE" }: EdgeLineDep) => {
  const { source, target } = data;

  return graph.createEdge({
    shape: meta?.isDash ? EDGE_LINE_DASH : EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
    data: { cellType: "EDGE", type, value: data, meta } satisfies CellData<EdgeLineMeta>,
  });
};
