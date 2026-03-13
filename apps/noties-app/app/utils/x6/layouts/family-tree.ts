// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import dagre from "@dagrejs/dagre";

import type { BaseGraphDep } from "@/utils/x6/index";
import type { GraphDep, GraphLayoutDep } from "./index";

export type CellDep = { peopleByGeneration: PeopleByGeneration; peoplePartner: People };
type CellInheritanceDep = Omit<CellDep, "peoplePartner"> & {
  nodeEntityMap: BidirectionalNodeEntityMapInstance<Person | PersonPartner>;
  personPartnerMap: PersonPartnerMap;
};
type CellNodeDep = CellInheritanceDep & { partnerMap: PersonMap };

const main = (graphDep: GraphDep) => (cellDep: CellDep) => {
  const { graph, options: graphOptions } = graphDep;

  const cells = getCells({ graph })(cellDep);
  graph.resetCells(cells);

  layout({ graph })(graphOptions);
};

const getCells = (graphDep: BaseGraphDep) => ({ peopleByGeneration, peoplePartner }: CellDep) => {
  const nodeEntityMap = new BidirectionalNodeEntityMap<Person | PersonPartner>();
  const personPartnerMap: PersonPartnerMap = new Map();
  const partnerMap = new Map(peoplePartner.map((person) => [person.id, person]));
  const cellInheritanceDep = { peopleByGeneration, nodeEntityMap, personPartnerMap };

  const nodes = getCellNodes(graphDep)({ ...cellInheritanceDep, partnerMap });
  const edges = getCellEdges(graphDep)(cellInheritanceDep);

  return [...nodes, ...edges];
};
const getCellNodes =
  (graphDep: BaseGraphDep) => ({ peopleByGeneration, nodeEntityMap, personPartnerMap, partnerMap }: CellNodeDep) => {
    const nodes: X6Node[] = [];

    // NODE-PERSON
    Object.values(peopleByGeneration).forEach((people) => {
      people.forEach((person) => {
        const node = createNodePerson(graphDep)({ data: person });
        nodeEntityMap.set("PERSON", node, person);
        nodes.push(node);

        if (person.partner) {
          const personPartner = partnerMap.get(person.partner);
          if (personPartner) { // Register node partner
            const node = createNodePerson(graphDep)({
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
            children: personPartner
              ? intersectionBy(person.children, personPartner.children, (x) => x)
              : person.children,
          });
        } else if (person.children) { // Register node relationship (without partner)
          const nodeRelationship = createNodePersonPlaceholder(graphDep)({
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
        nodeRelationship = createNodePersonRelationship(graphDep)({ data: { nodes: [node, nodePartner] } });
      } else {
        const hasChildrenNodes = (personPartner.children ?? []).some((child) =>
          nodeEntityMap.getNodeByEntityId("PERSON", child)
        );
        if (hasChildrenNodes) {
          nodeRelationship = createNodePersonPlaceholder(graphDep)({
            type: "PERSON_RELATIONSHIP",
            data: { nodes: [node] },
          });
        }
      }
      if (!nodeRelationship) return;

      nodeEntityMap.set("PERSON_RELATIONSHIP", nodeRelationship, personPartner);
      nodes.push(nodeRelationship);
    });

    return nodes;
  };
const getCellEdges =
  (graphDep: BaseGraphDep) => ({ peopleByGeneration, nodeEntityMap, personPartnerMap }: CellInheritanceDep) => {
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
              createEdgeLine(graphDep)({ data: { source: node, target: nodePersonRelationship }, type: "PARTNER" }),
            );
          }
        });

        if (!person.children) return;

        const currentMarriageChildren = relationshipPartner?.children ?? [];
        person.children.forEach((id) => {
          const children = nodeEntityMap.getNodeByEntityId("PERSON", id);
          if (!children) return;

          const isChildOfCurrentMarriage = currentMarriageChildren.includes(id);
          edges.push(
            createEdgeLine(graphDep)({
              data: { source: nodePersonRelationship, target: children },
              meta: {
                isDash: nodePersonPartner && !isChildOfCurrentMarriage,
                isPlaceholder: !nodePersonPartner,
                isChildOfCurrentMarriage,
              },
            }),
          );
        });
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
    const data: PersonCellData = node.data;

    if (!data) {
      node.position(dagreNode.x, dagreNode.y);
      return;
    }

    if (!data || data.cellType !== "NODE" || data.type !== "PERSON_RELATIONSHIP") {
      node.position(dagreNode.x, dagreNode.y);
      return;
    }

    const { nodes } = data.value as
      | Parameters<ReturnType<typeof createNodePersonRelationship>>[0]["data"]
      | Parameters<ReturnType<typeof createNodePersonPlaceholder>>[0]["data"];
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
    const data: PersonCellData<EdgeLineMeta> = edge.data;
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
};

export default main;
