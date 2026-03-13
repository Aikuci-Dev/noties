// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

import type { BaseGraphDep } from "@/utils/x6/index";
import type { GraphDep, GraphLayoutDep } from "./index";

export type CellDep = { peopleByRank: PeopleByRank };
type CellInheritanceDep = CellDep & { nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner> };

const main = (graphDep: GraphDep) => (cellDep: CellDep) => {
  const { graph, options: graphOptions } = graphDep;

  const cells = getCells({ graph })(cellDep);
  graph.resetCells(cells);

  layout({ graph })(graphOptions);
};

const getCells = (graphDep: BaseGraphDep) => (cellDep: CellDep) => {
  const nodeEntityMap = new BidirectionalNodeEntityMap<Person | PersonPartner>();
  const cellInheritanceDep = { ...cellDep, nodeEntityMap };

  const nodes = getCellNodes(graphDep)(cellInheritanceDep);
  const edges = getCellEdges(graphDep)(cellInheritanceDep);

  return [...nodes, ...edges];
};
const getCellNodes = (graphDep: BaseGraphDep) => ({ peopleByRank, nodeEntityMap }: CellInheritanceDep) => {
  const nodes: X6Node[] = [];

  Object.values(peopleByRank).forEach((people) => {
    people.forEach((person) => {
      const node = createNodePerson(graphDep)({ data: person });
      nodeEntityMap.set("PERSON", node, person);
      nodes.push(node);
    });
  });

  return nodes;
};
const getCellEdges = (graphDep: BaseGraphDep) => ({ peopleByRank, nodeEntityMap }: CellInheritanceDep) => {
  const edges: Edge[] = [];

  Object.values(peopleByRank).forEach((people) => {
    people.forEach((person) => {
      const nodePerson = nodeEntityMap.getNodeByEntityId("PERSON", person.id);
      if (!nodePerson) return;

      if (person.children) {
        person.children.forEach((id) => {
          const children = nodeEntityMap.getNodeByEntityId("PERSON", id);
          if (!children) return;
          edges.push(createEdgeLine(graphDep)({ data: { source: nodePerson, target: children } }));
        });
      }
    });
  });

  return edges;
};

const layout = ({ graph }: BaseGraphDep) => ({ gap, rankdir = "TB" }: GraphLayoutDep) => {
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
};

export default main;
