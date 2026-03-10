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

Graph.registerNode(NODE_PERSON_RELATIONSHIP, nodePersonRelationship({ radius: 0 }), true);
Graph.registerNode(NODE_PERSON, nodePerson({ dimension: nodePersonDimension }), true);
Graph.registerEdge(EDGE_LINE, edgeLine, true);

// NOTE:
// Data must be sorted hierarchically: rank/level first, then sibling order (side-by-side).
// BUG: Incorrect sibling order when the current node has children but the next sibling does not.
const people: Person[] = [
    // Level 1
    { id: 1, rank: "DIE", name: "Die", isDead: true, partner: 2, children: [3, 12, 14, 10, 11, 55] },
    { id: 2, rank: "ALIVE", name: "ALIVE", partner: 1, children: [3, 12, 14, 10, 11, 55] },
    // Level 2
    { id: 10, rank: "First", name: "Pak Dhe", gender: "M" as Gender, parent: [1, 2] },
    { id: 11, rank: "Second", name: "Pak Dhe", gender: "M" as Gender, parent: [1, 2] },
    { id: 3, rank: "MALE DIE", name: "Male Die", gender: "M" as Gender, isDead: true, parent: [1, 2], partner: 4, children: [56, 6, 9], },
    { id: 4, rank: "FEMALE DIE", name: "Female Die", gender: "F" as Gender, isDead: true, partner: 3, children: [56, 6, 9], }, // Partner (follows immediately after the person)
    { id: 12, rank: "Fourth", name: "Pak Lik", gender: "M" as Gender, parent: [1, 2], partner: 13, children: [7, 8] },
    { id: 13, rank: "Fourth Partner", name: "Bu Lik", gender: "F" as Gender, partner: 12, children: [7, 8] }, // Partner
    { id: 14, rank: "Fifth", name: "Pak Lik", gender: "M" as Gender, parent: [1, 2], partner: 15 },
    { id: 15, rank: "Fifth Partner", name: "Bu Lik", gender: "F" as Gender, partner: 14 }, // Partner
    // { id: 56, rank: "MALE ALIVE", name: "Male Alive", gender: "M" as Gender, parent: [3, 4], partner: 55, children: [100] }, // NOTE: Sample: child → treated as partner of grandchildren.
    { id: 55, rank: "MALE ALIVE Partner", name: "Female Alive", gender: "F" as Gender, parent: [1, 2], partner: 56, children: [100], }, // NOTE: Sample: child → treated as partner of grandchildren.
    // Level 3
    // { id: 55, rank: "Sixth", name: "Female Alive", gender: "F" as Gender, parent: [1, 2], partner: 56, children: [100] }, // NOTE: Sample: child → treated as partner of grandchildren.
    { id: 56, rank: "MALE ALIVE", name: "Male Alive", gender: "M" as Gender, parent: [3, 4], partner: 55, children: [100], }, // NOTE: Sample: child → treated as partner of grandchildren.
    { id: 9, rank: "FEMALE ALIVE", name: "Female Alive", gender: "F" as Gender, parent: [3, 4] }, // children (ordering follows the parent’s sibling order.)
    { id: 6, rank: "FEMALE ALIVE", name: "Female Alive", gender: "F" as Gender, parent: [3, 4] }, // children
    // { id: 7, rank: "MALE Test", name: "Male Alive", gender: "M" as Gender, parent: [12, 13], }, // children
    // { id: 8, rank: "FEMALE Test", name: "Female Alive", gender: "F" as Gender, parent: [12, 13], }, // children
    // Level 4
    { id: 100, rank: "MALE ALIVE CHILDREN", name: "Male Alive Children", parent: [5, 55] },
];

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
    const personPartnerMap: Map<EntityPairKey<Person>, PersonPartner> = new Map();

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

    const edges: Edge[] = [];
    people.forEach((person) => {
        const nodePerson = bidirectionalMap.getNodeByEntityId(person.id);
        if (!nodePerson) return;

        let nodePersonRelationship: X6Node | undefined;
        if (person.partner) {
            const nodePersonPartner = bidirectionalMap.getNodeByEntityId(person.partner);
            if (!nodePersonPartner) return;

            const key = createPairKey<Person>(person.id, person.partner);
            const relationshipPartner = personPartnerMap.get(key);
            if (!relationshipPartner) return;
            nodePersonRelationship = bidirectionalMap.getNodeByEntityId(relationshipPartner.id);
            if (!nodePersonRelationship) return;

            edges.push(createEdgeLine({ graph, data: { source: nodePerson, target: nodePersonRelationship }, type: "PARTNER" }));
            edges.push(createEdgeLine({ graph, data: { source: nodePersonPartner, target: nodePersonRelationship }, type: "PARTNER" }));
        }

        if (!person.children) return;
        person.children.forEach((id) => {
            const childrenNode = bidirectionalMap.getNodeByEntityId(id);
            if (childrenNode) {
                edges.push(createEdgeLine({ graph, data: { source: nodePersonRelationship ?? nodePerson, target: childrenNode } }));
            }
        });
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