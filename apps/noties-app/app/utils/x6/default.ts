import type { Cell, Graph } from "@antv/x6";

export function createEdgeLine(
  { graph, data, meta, type = "LINE" }: {
    graph: Graph;
    data: { source: Cell; target: Cell };
    meta?: EdgeLineMeta;
    type?: EdgeType;
  },
) {
  const { source, target } = data;

  return graph.createEdge({
    shape: meta?.isDash ? EDGE_LINE_DASH : EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
    data: { cellType: "EDGE", type, value: data, meta } satisfies CellData<EdgeLineMeta>,
  });
}
