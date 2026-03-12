// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import { Graph } from "@antv/x6";
import dagre from "@dagrejs/dagre";

function getCells({ graph, data: { peopleByRank } }: { graph: Graph; data: { peopleByRank: PeopleByRank } }) {
  const nodeEntityMap = new BidirectionalNodeEntityMap<Person | PersonPartner>();

  const nodes = getNodes({ graph, data: { peopleByRank, nodeEntityMap } });
  const edges = getEdges({ graph, data: { peopleByRank, nodeEntityMap } });

  return [...nodes, ...edges];
}
type GetCellsInheritanceArgs = {
  graph: Graph;
  data: {
    peopleByRank: PeopleByRank;
    nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
  };
};
function getNodes({ graph, data: { peopleByRank, nodeEntityMap } }: GetCellsInheritanceArgs) {
  const nodes: X6Node[] = [];

  Object.values(peopleByRank).forEach((people) => {
    people.forEach((person) => {
      const node = createNodePerson({ graph, data: person });
      nodeEntityMap.set("PERSON", node, person);
      nodes.push(node);
    });
  });

  return nodes;
}
function getEdges({ graph, data: { peopleByRank, nodeEntityMap } }: GetCellsInheritanceArgs) {
  const edges: Edge[] = [];

  Object.values(peopleByRank).forEach((people) => {
    people.forEach((person) => {
      const nodePerson = nodeEntityMap.getNodeByEntityId("PERSON", person.id);
      if (!nodePerson) return;

      if (person.children) {
        person.children.forEach((id) => {
          const children = nodeEntityMap.getNodeByEntityId("PERSON", id);
          if (!children) return;
          edges.push(createEdgeLine({ graph, data: { source: nodePerson, target: children } }));
        });
      }
    });
  });

  return edges;
}

function layout({ graph, data: { gap, rankdir = "TB" } }: {
  graph: Graph;
  data: { gap: number; rankdir?: DagreRankdir };
}) {
  const isVertical = rankdir === "TB" || rankdir === "BT";
  // const isHorizontal = rankdir === "LR" || rankdir === "RL";

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
    node.position(dagreNode.x, dagreNode.y);
  });
  edges.forEach((edge) => {
    const source = edge.getSourceNode();
    const target = edge.getTargetNode();

    const sourceBBox = source.getBBox();
    const targetBBox = target.getBBox();

    if (isVertical) {
      const y = targetBBox.y - gap / 2;
      edge.setVertices([{ x: sourceBBox.center.x, y }, { x: targetBBox.center.x, y }]);
    } else {
      const x = sourceBBox.x - gap / 2;
      edge.setVertices([{ x, y: sourceBBox.center.y }, { x, y: targetBBox.center.y }]);
    }
  });
}

export default function main(
  { graph, data, options }: {
    graph: Graph;
    data: { peopleByRank: PeopleByRank };
    options: { gap: number; rankdir?: DagreRankdir };
  },
) {
  const cells = getCells({ graph, data });
  graph.resetCells(cells);
  layout({ graph, data: options });
}
