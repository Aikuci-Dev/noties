import type { Cell, Graph, Node as X6Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

export function createEdgeLine(
  { graph, data, type = "LINE" }: { graph: Graph; data: { source: Cell; target: Cell }; type?: EdgeType },
) {
  const { source, target } = data;

  return graph.createEdge({
    shape: EDGE_LINE,
    source: { cell: source.id },
    target: { cell: target.id },
    data: { cellType: "EDGE", type, value: data } satisfies CellData,
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
    if (!node) return;

    const dagreNode = g.node(id);
    const data: CellData = node.data;

    if (!data) {
      node.position(dagreNode.x, dagreNode.y);
      return;
    }

    if (!data || data.cellType !== "NODE" || data.type !== "PERSON_RELATIONSHIP") {
      node.position(dagreNode.x, dagreNode.y);
      return;
    }

    const { nodes } = data.value as Parameters<typeof createNodePersonRelationship>[0]["data"];

    // Relationship Partner
    if (nodes[0] && nodes[1]) {
      const nodePerson = graph.getCellById(nodes[0].id);
      const nodePersonPartner = graph.getCellById(nodes[1].id);
      const personBBox = nodePerson.getBBox();
      const personPartnerBBox = nodePersonPartner.getBBox();

      const [minX, maxX] = minMax(personBBox.x, personPartnerBBox.x);
      const [minY, maxY] = minMax(personBBox.y, personPartnerBBox.y);
      const x = isHorizontal ? personBBox.x + personBBox.width / 2 : (maxX + (minX + personBBox.width)) / 2;
      const y = isHorizontal ? (maxY + (minY + personBBox.height)) / 2 : personBBox.y + personBBox.height / 2;
      node.position(x, y);
    }
  });
  edges.forEach((edge) => {
    const data: CellData = edge.data;
    if (data.cellType === "EDGE" && data.type === "PARTNER") return;

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
