// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import { Graph } from "@antv/x6";
import dagre from "@dagrejs/dagre";

import edgeLine from "~/components/x6/default/edge-line";
import nodePlaceholder from "~/components/x6/default/node-placeholder";
import nodePerson from "~/components/x6/person/node-person";

export function registration({ nodePersonDimension }: { nodePersonDimension: Dimension }) {
  Graph.registerNode(NODE_PERSON, nodePerson({ dimension: nodePersonDimension }), true);
  Graph.registerNode(NODE_PERSON_STACK, nodePerson({ dimension: nodePersonDimension, isStack: true }), true);
  Graph.registerNode(NODE_PERSON_PLACEHOLDER, nodePlaceholder(), true);
  Graph.registerNode(NODE_PERSON_INTERMEDIARY, nodePlaceholder({ radius: 2 }), true);

  Graph.registerEdge(EDGE_LINE, edgeLine(), true);
  Graph.registerEdge(EDGE_LINE_DASH, edgeLine({ isDash: true }), true);
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

export function getCells({ graph, data: { peopleByGeneration, peoplePartnerByGeneration } }: {
  graph: Graph;
  data: {
    peopleByGeneration: PeopleByGeneration;
    peoplePartnerByGeneration: PeopleByGeneration;
  };
}) {
  const nodeEntityMap = new BidirectionalNodeEntityMap<Person | PersonPartner>();
  const personPartnerMap: PersonPartnerMap = new Map();

  const nodes = getNodes({
    graph,
    data: { peopleByGeneration, peoplePartnerByGeneration, nodeEntityMap, personPartnerMap },
  });
  const edges = getEdges({
    graph,
    data: { peopleByGeneration, peoplePartnerByGeneration, nodeEntityMap, personPartnerMap },
  });

  return [...nodes, ...edges];
}
type GetCellsInheritanceArgs = {
  graph: Graph;
  data: {
    peopleByGeneration: PeopleByGeneration;
    peoplePartnerByGeneration: PeopleByGeneration;
    nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
    personPartnerMap: PersonPartnerMap;
  };
};
function getNodes(
  { graph, data: { peopleByGeneration, peoplePartnerByGeneration, nodeEntityMap, personPartnerMap } }:
    GetCellsInheritanceArgs,
) {
  const nodes: X6Node[] = [];
  const partnerMap = new Map(
    Object.values(peoplePartnerByGeneration).flatMap((people) => people.map((person) => [person.id, person])),
  );

  // NODE-PERSON
  Object.values(peopleByGeneration).forEach((people) => {
    people.forEach((person) => {
      const node = createNodePerson({ graph, data: person });
      nodeEntityMap.set("PERSON", node, person);
      nodes.push(node);

      if (person.partner) {
        const personPartner = partnerMap.get(person.partner);
        if (personPartner) { // Register node partner
          const node = createNodePerson({
            graph,
            data: personPartner,
            meta: { isStack: person.partners && person.partners.length > 1 },
          });
          nodeEntityMap.set("PERSON", node, personPartner);
          nodes.push(node);
        }

        const personPartnerMapKey: EntityPairKey<Person> = `${person.id}-${person.partner!}`;
        personPartnerMap.set(personPartnerMapKey, {
          id: personPartnerMapKey,
          person: person.id,
          partner: person.partner,
          children: personPartner ? intersectionBy(person.children, personPartner.children, (x) => x) : person.children,
        });
      } else if (person.children) { // Register node relationship (without partner)
        const nodeRelationship = createNodePersonPlaceholder({
          graph,
          type: "PERSON_RELATIONSHIP",
          data: { nodes: [node] },
        });
        nodeEntityMap.set("PERSON_RELATIONSHIP", nodeRelationship, person);
        nodes.push(nodeRelationship);
      }
    });
  });

  // NODE-PERSON-RELATIONSHIP
  personPartnerMap.values().forEach((personPartner) => {
    const node = nodeEntityMap.getNodeByEntityId("PERSON", personPartner.person);
    if (!node) return;

    let nodeRelationship;
    const nodePartner = nodeEntityMap.getNodeByEntityId("PERSON", personPartner.partner);
    if (nodePartner) {
      nodeRelationship = createNodePersonRelationship({ graph, data: { nodes: [node, nodePartner] } });
    } else {
      const hasChildrenNodes = (personPartner.children ?? []).some((child) =>
        nodeEntityMap.getNodeByEntityId("PERSON", child)
      );
      if (hasChildrenNodes) {
        nodeRelationship = createNodePersonPlaceholder({ graph, type: "PERSON_RELATIONSHIP", data: { nodes: [node] } });
      }
    }
    if (!nodeRelationship) return;

    nodeEntityMap.set("PERSON_RELATIONSHIP", nodeRelationship, personPartner);
    nodes.push(nodeRelationship);
  });

  return nodes;
}
function getEdges({ graph, data: { peopleByGeneration, nodeEntityMap, personPartnerMap } }: GetCellsInheritanceArgs) {
  const edges: Edge[] = [];

  Object.values(peopleByGeneration).forEach((people) => {
    people.forEach((person) => {
      const nodePerson = nodeEntityMap.getNodeByEntityId("PERSON", person.id);
      if (!nodePerson) return;

      let relationshipPartner: PersonPartner | undefined;
      let nodePersonPartner: X6Node | undefined;
      if (person.partner) {
        nodePersonPartner = nodeEntityMap.getNodeByEntityId("PERSON", person.partner);
        const personPartnerMapKey: EntityPairKey<Person> = `${person.id}-${person.partner}`;
        relationshipPartner = personPartnerMap.get(personPartnerMapKey);
        if (!relationshipPartner) return;
      }
      const nodePersonRelationship = nodeEntityMap.getNodeByEntityId(
        "PERSON_RELATIONSHIP",
        relationshipPartner?.id ?? person.id,
      );
      if (!nodePersonRelationship) return;

      [nodePerson, nodePersonPartner].forEach((node) => {
        if (node) {
          edges.push(
            createEdgeLine({
              graph,
              data: { source: node, target: nodePersonRelationship },
              type: "PARTNER",
            }),
          );
        }
      });

      getEdgesChildren({
        graph,
        data: {
          nodeEntityMap,
          node: { parent: nodePersonRelationship, partner: nodePersonPartner },
          children: { person: person.children, currentMarriage: relationshipPartner?.children },
        },
      }).forEach((edge) => edges.push(edge));
    });
  });

  return edges;
}
function getEdgesChildren(
  { graph, data: { nodeEntityMap, node: { parent, partner }, children } }: {
    graph: Graph;
    data: {
      nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
      node: { parent: X6Node; partner?: X6Node };
      children: { person?: Person["id"][]; currentMarriage?: Person["id"][] };
    };
  },
) {
  const personChildren = children.person;
  if (!personChildren) return [];

  const currentMarriageChildren = children.currentMarriage;
  return personChildren.flatMap((id) => {
    const children = nodeEntityMap.getNodeByEntityId("PERSON", id);
    if (!children) return [];

    const isChildOfCurrentMarriage = (currentMarriageChildren ?? []).includes(id);
    return [createEdgeLine({
      graph,
      data: { source: parent, target: children },
      meta: { isDash: partner && !isChildOfCurrentMarriage, isPlaceholder: !partner, isChildOfCurrentMarriage },
    })];
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
    if (nodes.length === 1) { // No Partner (Placeholder Relationship)
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
    const data: CellData<EdgeLineMeta> = edge.data;
    if (data.cellType === "EDGE" && data.type === "PARTNER") return;

    const source = edge.getSourceNode();
    const target = edge.getTargetNode();

    const sourceBBox = source.getBBox();
    const targetBBox = target.getBBox();

    const isDash = data.meta?.isDash;
    const isPlaceholder = data.meta?.isPlaceholder;
    let x = (isDash ? gap / 2 : 0) + (isPlaceholder ? 0 : targetBBox.width / 2);
    let y = (isDash ? gap / 2 : 0) + (isPlaceholder ? 0 : targetBBox.height / 2);
    if (isVertical) {
      y += sourceBBox.y + gap;
      edge.setVertices([{ x: sourceBBox.x, y }, { x: targetBBox.center.x, y }]);
    } else {
      x += sourceBBox.x + gap;
      edge.setVertices([{ x, y: sourceBBox.y }, { x, y: targetBBox.center.y }]);
    }
  });
}

export function animation({ graph }: { graph: Graph }) {
  graph.on("node:mouseenter", ({ node }) => {
    const { type } = node.data as CellData;
    if (type === "PERSON") animateNodePerson(node, { fill: true });
  });
  graph.on("node:mouseleave", ({ node }) => {
    const { type } = node.data as CellData;
    if (type === "PERSON") animateNodePerson(node);
  });
}
