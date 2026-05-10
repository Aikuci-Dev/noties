import type { Node as X6Node } from "@antv/x6";

import dagre from "@dagrejs/dagre";

import type { Human } from "@noties/shared-schema";

import type { BaseGraphDep, GraphDep, GraphLayoutDep } from "@/common/types";

import type { CellDep, NodePersonMap, NodeWithChildrenNodeDep } from "../types";

import { convertPersonToNodePerson, createEdgePerson, createNodePerson } from "../utils";
import { getNodesWithChildren, setNodesRelationship } from "./layouts";

export type SimpleCellDep = CellDep<Human.Simple.Schema>;

const main = (graphDep: GraphDep) => (cellDep: SimpleCellDep) => {
  const { graph, options: graphOptions } = graphDep;

  const cells = getCells({ graph })(cellDep);
  graph.resetCells(cells);

  layout({ graph })(graphOptions);
};

const getCells = (graphDep: BaseGraphDep) => (cellDep: SimpleCellDep) => {
  const { nodes, nodePersonMap } = registerCellNodes(graphDep)(cellDep);

  const nodesWithChildrenMap = getNodesWithChildren({ nodePersonMap })(cellDep);
  setNodesRelationship({ nodesWithChildrenMap });

  const edges = registerCellEdges(graphDep)({ nodesWithChildrenMap });

  return [...nodes, ...edges];
};
const registerCellNodes =
  (graphDep: BaseGraphDep) =>
  ({ people }: SimpleCellDep) => {
    const nodePersonMap: NodePersonMap = new Map();
    const nodes: X6Node[] = [];

    people.forEach((person) => {
      const entity = convertPersonToNodePerson(person);
      const node = createNodePerson(graphDep)({ value: entity, original: person });
      nodePersonMap.set(person.id, node);
      nodes.push(node);
    });

    return { nodes, nodePersonMap };
  };
const registerCellEdges =
  (graphDep: BaseGraphDep) =>
  ({ nodesWithChildrenMap }: NodeWithChildrenNodeDep) => {
    return Array.from(nodesWithChildrenMap.values()).flatMap(({ node, nodeChildren }) =>
      nodeChildren.map((nodeChild) => createEdgePerson(graphDep)({ value: { source: node, target: nodeChild } })),
    );
  };

const layout =
  ({ graph }: BaseGraphDep) =>
  ({ gap, rankdir = "TB" }: GraphLayoutDep) => {
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
        edge.setVertices([
          { x: sourceBBox.center.x, y },
          { x: targetBBox.center.x, y },
        ]);
      } else {
        const x = sourceBBox.x - gap / 2;
        edge.setVertices([
          { x, y: sourceBBox.center.y },
          { x, y: targetBBox.center.y },
        ]);
      }
    });
  };

export default main;
