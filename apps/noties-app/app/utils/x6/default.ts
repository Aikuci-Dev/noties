import type { Cell, Graph, Node as X6Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

export function createEdgeLine(
  { graph, options, data }: { graph: Graph; options: { source: Cell; target: Cell }; data?: unknown },
) {
  const { source, target } = options;

  return graph.createEdge({
    shape: EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
    data,
  });
}

type LayoutArgs = {
  graph: Graph;
  rankdir: DagreRankdir;
  gap: number;
};
export function layout({ graph, rankdir, gap }: LayoutArgs) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir, ranksep: gap, nodesep: gap });
  g.setDefaultEdgeLabel(() => ({}));

  const nodes = graph.getNodes();
  const edges = graph.getEdges();
  nodes.forEach((node) => {
    g.setNode(node.id, { height: node.size().height, width: node.size().width });
  });
  edges.forEach((edge) => {
    g.setEdge(edge.getSourceCellId(), edge.getTargetCellId());
  });

  dagre.layout(g);
  const isHorizontal = rankdir === "LR" || rankdir === "RL";
  const isVertical = rankdir === "TB" || rankdir === "BT";

  g.nodes().forEach((id) => {
    const node = graph.getCellById(id) as X6Node;
    if (node) {
      const dagreNode = g.node(id);
      if (node.data) {
        const nodePerson1 = graph.getCellById(node.data.nodes[0].id);
        const nodePerson2 = graph.getCellById(node.data.nodes[1].id);
        const sourceBBox = nodePerson1.getBBox();
        const targetBBox = nodePerson2.getBBox();

        const [minX, maxX] = minMax(sourceBBox.x, targetBBox.x);
        const [minY, maxY] = minMax(sourceBBox.y, targetBBox.y);
        const x = isHorizontal ? sourceBBox.x + sourceBBox.width / 2 : (maxX + (minX + sourceBBox.width)) / 2;
        const y = isHorizontal ? (maxY + (minY + sourceBBox.height)) / 2 : sourceBBox.y + sourceBBox.height / 2;
        node.position(x, y);
      } else {
        // // TODO: Override sibling order manually; keep Dagre’s level/rank.
        // // Level/rank: x if horizontal layout, y if vertical.
        // const x = isHorizontal ? dagreNode.x : 0;
        // const y = isHorizontal ? 0 : dagreNode.y;
        // node.position(x, y);
        node.position(dagreNode.x, dagreNode.y);
      }
    }
  });
  edges.forEach((edge) => {
    if (edge.data && edge.data.type === "partner") return;

    const source = edge.getSourceNode();
    const target = edge.getTargetNode();

    const sourceBBox = source.getBBox();
    const targetBBox = target.getBBox();

    if (isHorizontal && sourceBBox.y !== targetBBox.y) {
      const x = (targetBBox.x + sourceBBox.x + (targetBBox.width / 2)) / 2;
      edge.setVertices([{ x, y: sourceBBox.y }, { x, y: targetBBox.center.y }]);
    } else if (isVertical && sourceBBox.x !== targetBBox.x) {
      const y = (targetBBox.y + sourceBBox.y + (targetBBox.height / 2)) / 2;
      edge.setVertices([{ x: sourceBBox.x, y }, { x: targetBBox.center.x, y }]);
    }
  });
}
