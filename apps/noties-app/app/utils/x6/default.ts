import type { Cell, Graph, Node as X6Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

type EdgeMeta = { isPlaceholder?: boolean };
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

type LayoutArgs = {
  graph: Graph;
  gap: number;
  rankdir?: DagreRankdir;
};
export function layout({ graph, gap, rankdir = "TB" }: LayoutArgs) {
  const isVertical = rankdir === "TB" || rankdir === "BT";
  const isHorizontal = rankdir === "LR" || rankdir === "RL";

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

    const { nodes } = data.value as
      | Parameters<typeof createNodePersonRelationship>[0]["data"]
      | Parameters<typeof createNodePersonPlaceholder>[0]["data"];
    if (nodes.length === 1) {
      const nodePerson = graph.getCellById(nodes[0].id);
      const personBBox = nodePerson.getBBox();
      const x = isVertical ? personBBox.center.x : rankdir === "LR" ? personBBox.width + personBBox.x : personBBox.x;
      const y = isHorizontal ? personBBox.center.y : rankdir === "TB" ? personBBox.height + personBBox.y : personBBox.y;
      node.position(x, y);
    } else {
      const nodePerson = graph.getCellById(nodes[0].id);
      const nodePersonPartner = graph.getCellById(nodes[1].id);
      const personBBox = nodePerson.getBBox();
      const personPartnerBBox = nodePersonPartner.getBBox();

      const [minX, maxX] = minMax(personBBox.x, personPartnerBBox.x);
      const [minY, maxY] = minMax(personBBox.y, personPartnerBBox.y);
      const x = isVertical ? (maxX + (minX + personBBox.width)) / 2 : personBBox.x + personBBox.width / 2;
      const y = isVertical ? personBBox.y + personBBox.height / 2 : (maxY + (minY + personBBox.height)) / 2;
      node.position(x, y);
    }
  });
  edges.forEach((edge) => {
    const data: CellData<EdgeMeta> = edge.data;
    if (data.cellType === "EDGE" && data.type === "PARTNER") return;

    const source = edge.getSourceNode();
    const target = edge.getTargetNode();

    const sourceBBox = source.getBBox();
    const targetBBox = target.getBBox();

    if (isVertical) {
      const y = data.meta?.isPlaceholder ? sourceBBox.y + gap : sourceBBox.y + gap + targetBBox.height / 2;
      edge.setVertices([{ x: sourceBBox.x, y }, { x: targetBBox.center.x, y }]);
    } else {
      const x = data.meta?.isPlaceholder ? sourceBBox.x + gap : sourceBBox.x + gap + targetBBox.width / 2;
      edge.setVertices([{ x, y: sourceBBox.y }, { x, y: targetBBox.center.y }]);
    }
  });
}
