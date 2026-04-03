// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

import type { BaseGraphDep } from "@/utils/x6/index";
import type { CellDep, GraphDep, GraphLayoutDep, NodeEntityDep } from "./index";
import { getNodesWithChildren, setNodesRelationship } from "./index";

export type FamilyTreeCellDep = CellDep & { peoplePartner: People };
type CellNodeDep = { partnerMap: PersonMap };
type CellEdgeDep =
  & NodeEntityDep<Person | PersonRelationship | PersonRelationshipPartner>
  & {
    personRelationshipMap: PersonRelationshipMap;
    personRelationshipPartnerMap: PersonRelationshipPartnerMap;
  };

const main = (graphDep: GraphDep) => (cellDep: FamilyTreeCellDep) => {
  const { graph, options: graphOptions } = graphDep;

  const cells = getCells({ graph })(cellDep);
  graph.resetCells(cells);

  layout({ graph })(graphOptions);
};

const getCells = (graphDep: BaseGraphDep) => ({ people, peoplePartner }: FamilyTreeCellDep) => {
  const partnerMap = new Map(peoplePartner.map((person) => [person.id, person]));
  const {
    nodes,
    nodeEntityMap,
    personRelationshipMap,
    personRelationshipPartnerMap,
  } = registerCellNodes(graphDep)({ partnerMap })({ people });

  setNodesRelationship({ nodesWithChildrenMap: getNodesWithChildren({ nodeEntityMap })({ people }) });
  setNodesRelationship({ nodesWithChildrenMap: getNodesWithChildren({ nodeEntityMap })({ people: peoplePartner }) });

  const edges = registerCellEdges(graphDep)({
    nodeEntityMap,
    personRelationshipMap,
    personRelationshipPartnerMap,
  });

  return [...nodes, ...edges];
};
const registerCellNodes = (graphDep: BaseGraphDep) => ({ partnerMap }: CellNodeDep) => ({ people }: CellDep) => {
  const nodeEntityMap = new BidirectionalNodeEntityMap<Person | PersonRelationship | PersonRelationshipPartner>();
  const personRelationshipMap: PersonRelationshipMap = new Map();
  const personRelationshipPartnerMap: PersonRelationshipPartnerMap = new Map();
  const nodes: X6Node[] = [];

  // NODE-PERSON
  people.forEach((person) => {
    const entity = convertPersonToNodePerson(person);
    const nodePerson = createNodePerson(graphDep)({ value: entity, original: person });
    nodeEntityMap.set("PERSON", nodePerson, person);
    nodes.push(nodePerson);

    const partnerId = person.partnerId ?? 0;
    const partnerIds = person.partnerIds ?? [];
    const childrenIds = person.childrenIds ?? [];

    personRelationshipMap.set(person.id, { id: person.id, partnerId, partnerIds, childrenIds });

    if (partnerId) {
      const personPartner = partnerMap.get(partnerId);
      if (personPartner) { // Register node partner
        const entityPartner = convertPersonToNodePerson(personPartner);
        const nodePartner = createNodePerson(graphDep)({
          value: entityPartner,
          original: personPartner,
          meta: { isStack: partnerIds.length > 1 },
        });
        nodeEntityMap.set("PERSON", nodePartner, personPartner);
        nodes.push(nodePartner);
      }
    }
  });

  // NODE-PERSON-RELATIONSHIP
  personRelationshipMap.values().forEach((personRelationship) => {
    const { id, partnerId, childrenIds } = personRelationship;

    const nodePerson = nodeEntityMap.getNode("PERSON", id);
    if (!nodePerson) return;

    let nodeRelationship;
    if (partnerId) {
      const nodePartner = nodeEntityMap.getNode("PERSON", partnerId);
      if (nodePartner) {
        nodeRelationship = createNodePersonRelationship(graphDep)({ value: { nodes: [nodePerson, nodePartner] } });

        const key: EntityPairKey<Person> = `${id}-${partnerId}`;
        const personPartner = partnerMap.get(partnerId);
        const personRelationshipPartner = {
          id: key,
          personId: id,
          partnerId,
          childrenIds: personPartner?.childrenIds
            ? intersectionBy(childrenIds, personPartner.childrenIds, (x) => x)
            : childrenIds,
        };
        personRelationshipPartnerMap.set(key, personRelationshipPartner);

        nodeEntityMap.set("PERSON_RELATIONSHIP", nodeRelationship, personRelationshipPartner);
      }
    }
    if (!nodeRelationship) {
      const hasChildrenNodes = childrenIds.some((id) => nodeEntityMap.getNode("PERSON", id));
      if (hasChildrenNodes) {
        nodeRelationship = createNodePersonPlaceholder(graphDep)({
          personType: "PERSON_RELATIONSHIP",
          value: { nodes: [nodePerson] },
        });
        nodeEntityMap.set("PERSON_RELATIONSHIP", nodeRelationship, personRelationship);
      }
    }

    if (nodeRelationship) nodes.push(nodeRelationship);
  });

  return { nodes, nodeEntityMap, personRelationshipPartnerMap, personRelationshipMap };
};
const registerCellEdges =
  (graphDep: BaseGraphDep) => ({ nodeEntityMap, personRelationshipMap, personRelationshipPartnerMap }: CellEdgeDep) => {
    const edges: Edge[] = [];

    personRelationshipMap.values().forEach((personRelationship) => {
      const { id, partnerId, childrenIds } = personRelationship;

      const nodePerson = nodeEntityMap.getNode("PERSON", id);
      if (!nodePerson) return;

      let nodePartner: X6Node | undefined;
      let relationshipPartner: PersonRelationshipPartner | undefined;
      if (partnerId) {
        nodePartner = nodeEntityMap.getNode("PERSON", partnerId);
        relationshipPartner = personRelationshipPartnerMap.get(`${id}-${partnerId}`);
      }

      const nodePersonRelationship = nodeEntityMap.getNode(
        "PERSON_RELATIONSHIP",
        relationshipPartner ? relationshipPartner.id : id,
      );
      if (!nodePersonRelationship) return;

      [nodePerson, nodePartner].forEach((node) => {
        if (node) {
          edges.push(
            createEdgePerson(graphDep)({
              personType: "PARTNER",
              value: { source: node, target: nodePersonRelationship },
            }),
          );
        }
      });

      childrenIds.forEach((id) => {
        const nodeChild = nodeEntityMap.getNode("PERSON", id);
        if (!nodeChild) return;

        const hasPartner = !!nodePartner;
        const isChildOfCurrentMarriage = relationshipPartner ? relationshipPartner.childrenIds.includes(id) : false;
        edges.push(
          createEdgePerson(graphDep)({
            value: { source: nodePersonRelationship, target: nodeChild },
            meta: {
              type: (hasPartner && !isChildOfCurrentMarriage) ? "dash" : "default",
              isPlaceholder: !hasPartner,
              hasPartner,
              isChildOfCurrentMarriage,
            },
          }),
        );
      });
    });

    return edges;
  };

const layout = ({ graph }: BaseGraphDep) => ({ gap, rankdir = "TB" }: GraphLayoutDep) => {
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
    const data: PersonNodeData = node.data;
    const nodeType = data.type;

    switch (nodeType) {
      case "NODE_PERSON":
        node.position(dagreNode.x, dagreNode.y);
        break;
      case "NODE_PERSON_PLACEHOLDER": {
        const { nodes } = data.value;
        const nodePerson = graph.getCellById(nodes[0].id);
        const personBBox = nodePerson.getBBox();
        const x = isVertical ? personBBox.center.x : rankdir === "LR" ? personBBox.width + personBBox.x : personBBox.x;
        const y = isHorizontal
          ? personBBox.center.y
          : rankdir === "TB"
          ? personBBox.height + personBBox.y
          : personBBox.y;
        node.position(x, y);
        break;
      }
      case "NODE_PERSON_RELATIONSHIP": {
        const { nodes } = data.value;
        const nodePerson = graph.getCellById(nodes[0].id);
        const nodePersonPartner = graph.getCellById(nodes[1].id);
        const personBBox = nodePerson.getBBox();
        const personPartnerBBox = nodePersonPartner.getBBox();

        const [minX, maxX] = minMax(personBBox.x, personPartnerBBox.x);
        const [minY, maxY] = minMax(personBBox.y, personPartnerBBox.y);
        const x = isVertical ? (maxX + (minX + personBBox.width)) / 2 : personBBox.x + personBBox.width / 2;
        const y = isVertical ? personBBox.y + personBBox.height / 2 : (maxY + (minY + personBBox.height)) / 2;
        node.position(x, y);
        break;
      }

      default:
        throw new Error(`Invalid person type: ${nodeType satisfies never}`);
    }
  });
  edges.forEach((edge) => {
    const data: PersonEdgeData = edge.data;
    if (data.personType === "PARTNER") return;

    const source = edge.getSourceNode();
    const target = edge.getTargetNode();

    const sourceBBox = source.getBBox();
    const targetBBox = target.getBBox();

    const isDash = data.meta?.type === "dash";
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
};

export default main;
