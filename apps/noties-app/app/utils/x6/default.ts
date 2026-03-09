import type { Cell, Graph, Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

export function createEdgeLine({ graph, options }: { graph: Graph; options: { source: Cell; target: Cell } }) {
  const { source, target } = options;

  return graph.createEdge({
    shape: EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
  });
}

type LayoutArgs = {
  graph: Graph;
  rankdir: DagreRankdir;
  gap: number;
  node: { dimension: Dimension };
};
export function layout({ graph, rankdir, gap, node: { dimension: nodeDimension } }: LayoutArgs) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir, nodesep: gap, ranksep: gap });
  g.setDefaultEdgeLabel(() => ({}));

  const { height, width } = nodeDimension;
  const nodes = graph.getNodes();
  const edges = graph.getEdges();
  nodes.forEach((node) => {
    g.setNode(node.id, { height, width });
  });
  edges.forEach((edge) => {
    g.setEdge(edge.getSourceCellId(), edge.getTargetCellId());
  });

  dagre.layout(g);

  g.nodes().forEach((id) => {
    const node = graph.getCellById(id) as Node;
    if (node) {
      const pos = g.node(id);
      node.position(pos.x, pos.y);
    }
  });
  edges.forEach((edge) => {
    const source = edge.getSourceNode();
    const target = edge.getTargetNode();
    if (!source || !target) return;

    const isHorizontal = rankdir === "LR" || rankdir === "RL";
    const isVertical = rankdir === "TB" || rankdir === "BT";
    const sourceBBox = source.getBBox();
    const targetBBox = target.getBBox();

    if (isHorizontal && sourceBBox.y !== targetBBox.y) {
      const gap = rankdir === "LR"
        ? targetBBox.x - sourceBBox.width - sourceBBox.x
        : targetBBox.x + targetBBox.width - sourceBBox.x;
      const fix = rankdir === "LR" ? sourceBBox.width : 0;
      const x = sourceBBox.x + fix + gap / 2;

      edge.setVertices([{ x, y: sourceBBox.center.y }, { x, y: targetBBox.center.y }]);
    } else if (isVertical && sourceBBox.x !== targetBBox.x) {
      const gap = rankdir === "TB"
        ? targetBBox.y - sourceBBox.height - sourceBBox.y
        : targetBBox.y + targetBBox.height - sourceBBox.y;
      const fix = rankdir === "TB" ? sourceBBox.height : 0;
      const y = sourceBBox.y + fix + gap / 2;

      edge.setVertices([{ x: sourceBBox.center.x, y }, { x: targetBBox.center.x, y }]);
    } else edge.setVertices([]);
  });
}
