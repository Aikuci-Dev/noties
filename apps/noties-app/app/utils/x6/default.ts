import type { Cell, Graph } from "@antv/x6";

export function createEdgeLine(
  { graph, data, meta, type = "LINE" }: {
    graph: Graph;
    data: { source: Cell; target: Cell };
    meta?: EdgeMeta;
    type?: EdgeType;
  },
) {
  const { source, target } = data;

  return graph.createEdge({
    shape: EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
    data: { cellType: "EDGE", type, value: data, meta } satisfies CellData<EdgeMeta>,
  });
}
