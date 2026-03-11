// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import { Graph } from "@antv/x6";
import dagre from "@dagrejs/dagre";

import edgeLine from "~/components/x6/default/edge-line";
import nodePlaceholder from "~/components/x6/default/node-placeholder";
import nodePerson from "~/components/x6/person/node-person";

export function registration({ nodePersonDimension }: { nodePersonDimension: Dimension }) {
  Graph.registerNode(NODE_PERSON, nodePerson({ dimension: nodePersonDimension }), true);
  Graph.registerNode(NODE_PERSON_PLACEHOLDER, nodePlaceholder({ radius: 0 }), true);
  Graph.registerNode(NODE_PERSON_INTERMEDIARY, nodePlaceholder({ radius: 2 }), true);
  Graph.registerEdge(EDGE_LINE, edgeLine, true);
}

export function graphInstance({ container, gridSize }: { gridSize: number; container?: HTMLElement }) {
  if (!container) return;

  // https://x6.antv.antgroup.com/en/api/graph/graph
  return new Graph({
    container,
    virtual: true,
    interacting: false,
    autoResize: true,
    background: { color: "#eee" },
    grid: {
      visible: true,
      type: "dot",
      size: gridSize,
      args: [{ color: "#bbb", thickness: 2 }],
    },
  });
}

export function getCells({ graph, data: { peopleByGeneration, nodeEntityMap } }: {
  graph: Graph;
  data: {
    peopleByGeneration: PeopleByGeneration;
    nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
  };
}) {
  const personPartnerMap: PersonPartnerMap = new Map();

  const nodes = getNodes({ graph, data: { peopleByGeneration, nodeEntityMap, personPartnerMap } });
  const edges = getEdges({ graph, data: { peopleByGeneration, nodeEntityMap, personPartnerMap } });

  return [...nodes, ...edges];
}
type GetCellsInheritanceArgs = {
  graph: Graph;
  data: {
    peopleByGeneration: PeopleByGeneration;
    nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
    personPartnerMap: PersonPartnerMap;
  };
};
function getNodes({ graph, data: { peopleByGeneration, nodeEntityMap, personPartnerMap } }: GetCellsInheritanceArgs) {
  const nodes: X6Node[] = [];

  Object.values(peopleByGeneration).forEach((people) => {
    people.forEach((person) => {
      if (person.partner) {
        const key = createPairKey<Person>(person.id, person.partner);
        personPartnerMap.set(key, { id: key, person: person.id, partner: person.partner });
      }

      const node = createNodePerson({ graph, data: person });

      nodeEntityMap.set("PERSON", node, person);
      nodes.push(node);
    });
  });

  personPartnerMap.values().forEach((personPartner) => {
    const node = nodeEntityMap.getNodeByEntityId(personPartner.person);
    if (!node) return;

    const nodePartner = nodeEntityMap.getNodeByEntityId(personPartner.partner);
    const nodeRelationship = nodePartner
      ? createNodePersonRelationship({ graph, data: { nodes: [node, nodePartner] } })
      : createNodePersonPlaceholder({ graph, type: "PERSON_RELATIONSHIP", data: { nodes: [node] } });

    nodeEntityMap.set("PERSON_RELATIONSHIP", nodeRelationship, personPartner);
    nodes.push(nodeRelationship);
  });

  return nodes;
}
function getEdges({ graph, data: { peopleByGeneration, nodeEntityMap, personPartnerMap } }: GetCellsInheritanceArgs) {
  const edges: Edge[] = [];
  const personPartnerChildrenMap: PersonPartnerChildrenMap = new Map();

  Object.values(peopleByGeneration).forEach((people) => {
    people.forEach((person) => {
      const nodePerson = nodeEntityMap.getNodeByEntityId(person.id);
      if (!nodePerson) return;

      if (person.partner) {
        const nodePersonPartner = nodeEntityMap.getNodeByEntityId(person.partner);
        const key = createPairKey<Person>(person.id, person.partner);
        const relationshipPartner = personPartnerMap.get(key);
        if (!relationshipPartner) return;

        const nodePersonRelationship = nodeEntityMap.getNodeByEntityId(relationshipPartner.id);
        if (!nodePersonRelationship) return;

        const areChildrenRegistered = personPartnerChildrenMap.get(key);
        if (!areChildrenRegistered) {
          personPartnerChildrenMap.set(key, { id: key, children: person.children ?? [] });

          [nodePerson, nodePersonPartner].forEach((node) => {
            if (node) {
              edges.push(
                createEdgeLine({ graph, data: { source: node, target: nodePersonRelationship }, type: "PARTNER" }),
              );
            }
          });

          getEdgesChildren({
            graph,
            data: {
              nodeEntityMap,
              node: { parent: nodePersonRelationship, partner: nodePersonPartner },
              childrenId: person.children,
            },
          }).forEach((edge) => edges.push(edge));
        }
        return;
      }

      getEdgesChildren({
        graph,
        data: { nodeEntityMap, node: { parent: nodePerson }, childrenId: person.children },
      }).forEach((edge) => edges.push(edge));
    });
  });

  return edges;
}
function getEdgesChildren(
  { graph, data: { nodeEntityMap, node: { parent, partner }, childrenId } }: {
    graph: Graph;
    data: {
      nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
      node: { parent: X6Node; partner?: X6Node };
      childrenId?: Person["id"][];
    };
  },
) {
  if (!childrenId) return [];
  return childrenId.flatMap((id) => {
    const children = nodeEntityMap.getNodeByEntityId(id);
    if (!children) return [];
    return [createEdgeLine({ graph, data: { source: parent, target: children }, meta: { isPlaceholder: !partner } })];
  });
}

export function layout({ graph, data: { gap, rankdir = "TB" } }: {
  graph: Graph;
  data: { gap: number; rankdir?: DagreRankdir };
}) {
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
    if (nodes.length === 1) { // No Partner
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

export function animation({ graph, data: { nodeEntityMap } }: {
  graph: Graph;
  data: { nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner> };
}) {
  graph.on("node:mouseenter", ({ node }) => {
    const entityType = nodeEntityMap.getEntityTypeByNodeId(node.id);

    if (entityType === "PERSON") animateNodePerson(node, { fill: true });
  });
  graph.on("node:mouseleave", ({ node }) => {
    const entityType = nodeEntityMap.getEntityTypeByNodeId(node.id);

    if (entityType === "PERSON") animateNodePerson(node);
  });
}
