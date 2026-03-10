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

Graph.registerNode(NODE_PERSON_RELATIONSHIP, nodePersonRelationship(), true);
Graph.registerNode(NODE_PERSON, nodePerson({ data: {}, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_MALE, nodePerson({ data: { gender: "M" }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_FEMALE, nodePerson({ data: { gender: "F" }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_DIE, nodePerson({ data: { isDead: true }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_MALE_DIE, nodePerson({ data: { gender: "M", isDead: true }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_FEMALE_DIE, nodePerson({ data: { gender: "F", isDead: true }, options: { dimension: nodePersonDimension } }), true);
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
    { id: 3, rank: "MALE DIE", name: "Male Die", gender: "M" as Gender, isDead: true, parent: [1, 2], partner: 4, children: [56, 6, 9] },
    { id: 4, rank: "FEMALE DIE", name: "Female Die", gender: "F" as Gender, isDead: true, partner: 3, children: [56, 6, 9] }, // Partner (follows immediately after the person)
    { id: 12, rank: "Fourth", name: "Pak Lik", gender: "M" as Gender, parent: [1, 2], partner: 13, children: [7, 8] },
    { id: 13, rank: "Fourth Partner", name: "Bu Lik", gender: "F" as Gender, partner: 12, children: [7, 8] }, // Partner
    { id: 14, rank: "Fifth", name: "Pak Lik", gender: "M" as Gender, parent: [1, 2], partner: 15 },
    { id: 15, rank: "Fifth Partner", name: "Bu Lik", gender: "F" as Gender, partner: 14 }, // Partner
    // { id: 56, rank: "MALE ALIVE", name: "Male Alive", gender: "M" as Gender, parent: [3, 4], partner: 55, children: [100] }, // NOTE: Sample: child → treated as partner of grandchildren.
    { id: 55, rank: "MALE ALIVE Partner", name: "Female Alive", gender: "F" as Gender, parent: [1, 2], partner: 56, children: [100] }, // NOTE: Sample: child → treated as partner of grandchildren.
    // Level 3
    // { id: 55, rank: "Sixth", name: "Female Alive", gender: "F" as Gender, parent: [1, 2], partner: 56, children: [100] }, // NOTE: Sample: child → treated as partner of grandchildren.
    { id: 56, rank: "MALE ALIVE", name: "Male Alive", gender: "M" as Gender, parent: [3, 4], partner: 55, children: [100] }, // NOTE: Sample: child → treated as partner of grandchildren.
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

    const bidirectionalMap = new BidirectionalNodeEntityMap<Person | PeopleRelationship>();
    const peopleRelationshipMap: Map<EntityPairKey<Person>, PeopleRelationship> = new Map();
    const nodesPeople = people.map((person) => {
        const node = createNodePerson({ graph, options: { ...person, dimension: nodePersonDimension } });
        bidirectionalMap.set("PERSON", node, person);
        if (person.partner) {
            const { key, prefix, suffix } = createPairKeyWithParts<Person>(person.id, person.partner);
            peopleRelationshipMap.set(key, { id: key, people: [+prefix, +suffix], type: "partner" });
        }
        return node;
    });
    const nodesPeopleRelationship = [...peopleRelationshipMap.values()].map((relationship) => {
        const nodesPeople = relationship.people.flatMap((id) => {
            const node = bidirectionalMap.getNodeByEntityId(id);
            if (node) return [node];
            return [];
        });
        const nodeRelationship = createNodePersonRelationship({ graph, data: { nodes: nodesPeople } });
        bidirectionalMap.set("PERSON_RELATIONSHIP", nodeRelationship, relationship);

        return nodeRelationship;
    });

    const edges: Edge[] = [];
    people.forEach((person) => {
        const node = bidirectionalMap.getNodeByEntityId(person.id);
        if (!node) return;

        let nodeRelationship: X6Node | undefined;
        if (person.partner) {
            const key = createPairKey<Person>(person.id, person.partner);
            const relationship = peopleRelationshipMap.get(key);
            if (!relationship) return;

            const nodePartner = bidirectionalMap.getNodeByEntityId(person.partner);
            if (!nodePartner) return;

            nodeRelationship = bidirectionalMap.getNodeByEntityId(relationship.id);
            if (!nodeRelationship) return;

            edges.push(createEdgeLine({ graph, options: { source: node, target: nodeRelationship }, data: { type: "partner" } }));
            edges.push(createEdgeLine({ graph, options: { source: nodePartner, target: nodeRelationship }, data: { type: "partner" } }));
        }

        if (!person.children) return;
        person.children.forEach((id) => {
            const childrenNode = bidirectionalMap.getNodeByEntityId(id);
            if (childrenNode) {
                edges.push(createEdgeLine({ graph, options: { source: nodeRelationship ?? node, target: childrenNode } }));
            }
        });
    });

    graph.resetCells([...nodesPeople, ...nodesPeopleRelationship, ...edges]);
    layout({ graph, rankdir: dagreRankdir, gap: gridSize });
    graph.positionContent("top");

    graph.on("node:mouseenter", ({ node }) => {
        const person = bidirectionalMap.getEntityByNodeId(node.id);

        if (person) {
            node.animate({ "attrs/.content-animation-top/refWidth": "100%" }, { duration: 1000, iterations: 1 });
            node.on("animation:finish", () => node.attr(".content-animation-top/refWidth", "100%"));
            node.animate({ "attrs/.content-animation-bottom/refWidth": "100%" }, { duration: 1000, iterations: 1 });
            node.on("animation:finish", () => node.attr(".content-animation-bottom/refWidth", "100%"));
        }
    });
    graph.on("node:mouseleave", ({ node }) => {
        node.animate({ "attrs/.content-animation-top/refWidth": "0%" }, { duration: 1000, iterations: 1 });
        node.on("animation:finish", () => node.attr(".content-animation-top/refWidth", "0%"));
        node.animate({ "attrs/.content-animation-bottom/refWidth": "0%" }, { duration: 1000, iterations: 1 });
        node.on("animation:finish", () => node.attr(".content-animation-bottom/refWidth", "0%"));
    });
}, { once: true });
</script>