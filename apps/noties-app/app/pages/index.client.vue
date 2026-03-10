<template>
    <UContainer class="tw:h-screen">
        <UPage class="tw:size-full" :ui="{ center: 'tw:size-full' }">
            <!-- <template #left>
                Left
            </template> -->

            <div ref="graph" class="tw:size-full"></div>

            <!-- <template #right>
                Right
            </template> -->
        </UPage>
    </UContainer>
</template>

<script setup lang="ts">
// Reference: https://x6.antv.antgroup.com/en/examples/showcase/practices/#orgchart
import type { Edge, Node as X6Node } from "@antv/x6";
import { Graph } from "@antv/x6";
import edgeLine from "~/components/x6/default/edge-line";
import { nodePerson, nodePersonRelationship } from "~/components/x6/person/node-person";

const gridSize = 20;
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 };
const dagreRankdir: DagreRankdir = "TB";
// const dagreRankdir: DagreRankdir = "LR";

Graph.registerNode(NODE_PERSON_RELATIONSHIP, nodePersonRelationship({ radius: 2 }), true);
Graph.registerNode(NODE_PERSON, nodePerson({ dimension: nodePersonDimension }), true);
Graph.registerEdge(EDGE_LINE, edgeLine, true);

// NOTE:
// Previous assumption:
// Data must be sorted hierarchically: rank/level first, then sibling order (side-by-side).
// Current assumption:
// data is sorted by registration order.
// The layout logic loops through children props, so the first child ends up being positioned last.

const people: Person[] = []

// const people: Person[] = [
//     { id: 1, rank: "ROOT", name: "0", partner: 2, children: [6, 4, 5, 3] },
//     { id: 2, rank: "ROOT PARTNER", name: "0'", partner: 1, children: [6, 4, 5, 3] },
//     { id: 3, rank: "FIRST", name: "1" },
//     { id: 4, rank: "SECOND", name: "2" },
//     { id: 5, rank: "THIRD", name: "3" },
//     { id: 6, rank: "FORTH", name: "4" },
// ];
// const people: Person[] = [
//     { id: 1, rank: "ROOT", name: "0", partner: 2, children: [6, 5, 4, 3] },
//     { id: 2, rank: "ROOT PARTNER", name: "0'", partner: 1, children: [6, 5, 4, 3] },
//     { id: 3, rank: "FIRST", name: "1" },
//     { id: 5, rank: "THIRD", name: "3" },
//     { id: 4, rank: "SECOND", name: "2" },
//     { id: 6, rank: "FORTH", name: "4" },
// ];

// BUG: Incorrect sibling order when the current node has children but the next sibling does not.
// // BROKEN (per ?)
// const people: Person[] = [
//     { id: 1, rank: "ROOT", name: "0", isDead: true, partner: 2, children: [9, 8, 7, 6, 5, 4, 3] },
//     { id: 2, rank: "ROOT PARTNER", name: "0'", isDead: true, partner: 1, children: [9, 8, 7, 6, 5, 4, 3] },
//     { id: 3, rank: "FIRST", name: "1", gender: 'M', isDead: true, partner: 31, children: [39, 38, 37, 36, 35, 34, 33, 32] },
//     { id: 31, rank: "FIRST PARTNER", name: "1'", gender: 'F', isDead: true, partner: 3, children: [39, 38, 37, 36, 35, 34, 33, 32] },
//     { id: 33, rank: "FIRST FIRST", name: "1-1", partner: 331, children: [339, 338, 337, 336, 335, 334, 333, 332] },
//     { id: 331, rank: "FIRST FIRST PARTNER", name: "1-1'", partner: 33, children: [339, 338, 337, 336, 335, 334, 333, 332] },
//     { id: 4, rank: "SECOND", name: "2" },
//     { id: 5, rank: "THIRD", name: "3", partner: 51, children: [59, 58, 57, 56, 55, 54, 53, 52] },
//     { id: 51, rank: "THIRD PARTNER", name: "3'", partner: 5, children: [59, 58, 57, 56, 55, 54, 53, 52] },
//     { id: 52, rank: "THIRD THIRD", name: "3-1" },
//     { id: 53, rank: "THIRD SECOND", name: "3-2", partner: 531, children: [539, 538, 537, 536, 535, 534, 533, 532] },
//     { id: 531, rank: "THIRD SECOND PARTNER", name: "3-2'", partner: 53, children: [539, 538, 537, 536, 535, 534, 533, 532] },
//     { id: 532, rank: "THIRD FIRST FIRST", name: "3-1-1", partner: 5321, children: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322] },
//     { id: 5321, rank: "THIRD FIRST FIRST PARTNER", name: "3-1-1'", partner: 532, children: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322] },
//     { id: 54, rank: "THIRD THIRD", name: "3-3" },
//     { id: 6, rank: "FORTH", name: "4" },
//     { id: 7, rank: "FIFTH", name: "5", partner: 71, children: [79, 78, 77, 76, 75, 74, 73, 72] },
//     { id: 71, rank: "FIFTH PARTNER", name: "5'", partner: 7, children: [79, 78, 77, 76, 75, 74, 73, 72] },
//     { id: 8, rank: "SIXTH", name: "6" },

//     { id: 9, rank: "SEVENTH", name: "7", gender: 'M', partner: 32, children: [99, 98, 97, 96, 95, 94, 93, 92] },
//     { id: 32, rank: "SEVENTH PARTNER / FIRST FIRST", name: "7' OR 1-1", gender: 'F', partner: 9, children: [99, 98, 97, 96, 95, 94, 93, 92] }, // NOTE: Sample: child → treated as partner of grandchildren.
// ];
// // BROKEN (per level)
// const people: Person[] = [
//     { id: 1, rank: "ROOT", name: "0", isDead: true, partner: 2, children: [9, 8, 7, 6, 5, 4, 3] },
//     { id: 2, rank: "ROOT PARTNER", name: "0'", isDead: true, partner: 1, children: [9, 8, 7, 6, 5, 4, 3] },
//     { id: 3, rank: "FIRST", name: "1", gender: 'M', isDead: true, partner: 31, children: [39, 38, 37, 36, 35, 34, 33, 32] },
//     { id: 31, rank: "FIRST PARTNER", name: "1'", gender: 'F', isDead: true, partner: 3, children: [39, 38, 37, 36, 35, 34, 33, 32] },
//     { id: 4, rank: "SECOND", name: "2" },
//     { id: 5, rank: "THIRD", name: "3", partner: 51, children: [59, 58, 57, 56, 55, 54, 53, 52] },
//     { id: 51, rank: "THIRD PARTNER", name: "3'", partner: 5, children: [59, 58, 57, 56, 55, 54, 53, 52] },
//     { id: 6, rank: "FORTH", name: "4" },
//     { id: 7, rank: "FIFTH", name: "5", partner: 71, children: [79, 78, 77, 76, 75, 74, 73, 72] },
//     { id: 71, rank: "FIFTH PARTNER", name: "5'", partner: 7, children: [79, 78, 77, 76, 75, 74, 73, 72] },
//     { id: 8, rank: "SIXTH", name: "6" },

//     { id: 9, rank: "SEVENTH", name: "7", gender: 'M', partner: 32, children: [99, 98, 97, 96, 95, 94, 93, 92] },
//     { id: 32, rank: "SEVENTH PARTNER / FIRST FIRST", name: "7' OR 1-1", gender: 'F', partner: 9, children: [99, 98, 97, 96, 95, 94, 93, 92] }, // NOTE: Sample: child → treated as partner of grandchildren.

//     { id: 33, rank: "FIRST FIRST", name: "1-1", partner: 331, children: [339, 338, 337, 336, 335, 334, 333, 332] },
//     { id: 331, rank: "FIRST FIRST PARTNER", name: "1-1'", partner: 33, children: [339, 338, 337, 336, 335, 334, 333, 332] },

//     { id: 52, rank: "THIRD THIRD", name: "3-1" },
//     { id: 53, rank: "THIRD SECOND", name: "3-2", partner: 531, children: [539, 538, 537, 536, 535, 534, 533, 532] },
//     { id: 531, rank: "THIRD SECOND PARTNER", name: "3-2'", partner: 53, children: [539, 538, 537, 536, 535, 534, 533, 532] },
//     { id: 54, rank: "THIRD THIRD", name: "3-3" },

//     { id: 532, rank: "THIRD FIRST FIRST", name: "3-1-1", partner: 5321, children: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322] },
//     { id: 5321, rank: "THIRD FIRST FIRST PARTNER", name: "3-1-1'", partner: 532, children: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322] },
// ];

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphRef = useTemplateRef("graph");
watch(graphRef, () => {
    const graph = new Graph({
        container: graphRef.value!, // The watch will be triggered when the component is available
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

    const bidirectionalMap = new BidirectionalNodeEntityMap<Person | PersonPartner>();
    const personPartnerMap: Map<PersonPartner["id"], PersonPartner> = new Map();
    const personPartnerEdgeMap: Map<PersonPartnerChildren["id"], PersonPartnerChildren> = new Map();

    const nodes: X6Node[] = [];
    people.forEach((person) => {
        if (person.partner) {
            const { key, prefix, suffix } = createPairKeyWithParts<Person>(person.id, person.partner);
            personPartnerMap.set(key, { id: key, person: +prefix, partner: +suffix });
        }

        const node = createNodePerson({ graph, data: person });
        bidirectionalMap.set("PERSON", node, person);
        nodes.push(node);
    });
    personPartnerMap.values().forEach((personPartner) => {
        const nodePerson = bidirectionalMap.getNodeByEntityId(personPartner.person);
        const nodePersonPartner = bidirectionalMap.getNodeByEntityId(personPartner.partner);
        if (!nodePerson || !nodePersonPartner) return;

        const nodeRelationship = createNodePersonRelationship({ graph, data: { nodes: [nodePerson, nodePersonPartner] } });
        bidirectionalMap.set("PERSON_RELATIONSHIP", nodeRelationship, personPartner);
        nodes.push(nodeRelationship);
    });

    function getEdgesChildren(isDirectConnection: boolean, nodeParent: X6Node, children?: Person["id"][]) {
        if (!children) return [];
        return children.flatMap((id) => {
            const childrenNode = bidirectionalMap.getNodeByEntityId(id);
            if (childrenNode) return [createEdgeLine({ graph, data: { source: nodeParent, target: childrenNode }, meta: { isDirectConnection } })];
            return [];
        });
    }
    const edges: Edge[] = [];
    people.forEach((person) => {
        const nodePerson = bidirectionalMap.getNodeByEntityId(person.id);
        if (!nodePerson) return;

        if (person.partner) {
            const nodePersonPartner = bidirectionalMap.getNodeByEntityId(person.partner);
            if (nodePersonPartner) {
                const key = createPairKey<Person>(person.id, person.partner);
                const relationshipPartner = personPartnerMap.get(key);
                if (!relationshipPartner) return;
                const nodePersonRelationship = bidirectionalMap.getNodeByEntityId(relationshipPartner.id);
                if (!nodePersonRelationship) return;

                const hasEdges = personPartnerEdgeMap.get(key);
                if (!hasEdges) {
                    personPartnerEdgeMap.set(key, { id: key, children: person.children ?? [] });

                    [nodePerson, nodePersonPartner].forEach(node => {
                        edges.push(createEdgeLine({ graph, data: { source: node, target: nodePersonRelationship }, meta: { isDirectConnection: true }, type: "PARTNER" }));
                    })

                    getEdgesChildren(false, nodePersonRelationship, person.children).forEach((edge) => edges.push(edge));
                }
                return;
            }
        }

        getEdgesChildren(true, nodePerson, person.children).forEach((edge) => edges.push(edge));
    });

    graph.resetCells([...nodes, ...edges]);
    layout({ graph, rankdir: dagreRankdir, gap: gridSize });
    graph.positionContent("top");

    graph.on("node:mouseenter", ({ node }) => {
        const entityType = bidirectionalMap.getEntityTypeByNodeId(node.id);

        if (entityType === "PERSON") animateNodePerson(node, { fill: true });
    });
    graph.on("node:mouseleave", ({ node }) => {
        const entityType = bidirectionalMap.getEntityTypeByNodeId(node.id);

        if (entityType === "PERSON") animateNodePerson(node);
    });
}, { once: true });
</script>