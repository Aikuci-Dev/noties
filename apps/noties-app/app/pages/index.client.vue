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
import { Graph } from "@antv/x6";
import line from "~/components/x6/default/edge-line";
import nodePerson from "~/components/x6/person/node-person";

const dagreRankdir: DagreRankdir = "TB";

const graphGap = 20;
const nodePersonDimension = { height: 60, width: 240 };
Graph.registerNode(NODE_PERSON, nodePerson({ data: {}, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_DIE, nodePerson({ data: { isDead: true }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_MALE, nodePerson({ data: { gender: "M" }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_MALE_DIE, nodePerson({ data: { gender: "M", isDead: true }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_FEMALE, nodePerson({ data: { gender: "F" }, options: { dimension: nodePersonDimension } }), true);
Graph.registerNode(NODE_PERSON_FEMALE_DIE, nodePerson({ data: { gender: "F", isDead: true }, options: { dimension: nodePersonDimension } }), true);
Graph.registerEdge(EDGE_LINE, line, true);

const people: Person[] = [
    { id: 1, rank: "MALE ALIVE", name: "Male Alive", gender: "M" as Gender, parent: [], children: [2] },
    { id: 2, rank: "FEMALE ALIVE", name: "Female Alive", gender: "F" as Gender, parent: [1], children: [6, 5, 4, 3] },
    { id: 3, rank: "ALIVE", name: "ALIVE", parent: [2] },
    { id: 4, rank: "MALE DIE", name: "Male Die", gender: "M" as Gender, isDead: true, parent: [2] },
    { id: 5, rank: "FEMALE DIE", name: "Female Die", gender: "F" as Gender, isDead: true, parent: [2] },
    { id: 6, rank: "DIE", name: "Die", isDead: true, parent: [2] },
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
            size: graphGap,
            args: [{ color: "#bbb", thickness: 2 }],
        },
    });

    const bidirectionalMap = new BidirectionalNodeEntityMap<Person>();
    const nodes = people.map((person) => {
        const node = createNodePerson({ graph, options: { ...person, dimension: nodePersonDimension } });
        bidirectionalMap.add(node, person);
        return node;
    });
    const edges = people.flatMap((person) => {
        if (person.children) {
            const sourceNode = bidirectionalMap.getNodeByPersonId(person.id);
            if (sourceNode) {
                return person.children.map((id) => {
                    const targetNode = bidirectionalMap.getNodeByPersonId(id);
                    if (targetNode) return createEdgeLine({ graph, options: { source: sourceNode, target: targetNode } });
                });
            }
        }
    });

    graph.resetCells([...nodes, ...removeFalsy(edges)]);
    layout({ graph, rankdir: dagreRankdir, gap: graphGap, node: { dimension: nodePersonDimension } });
    graph.centerContent();

    graph.on("node:mouseenter", ({ node }) => {
        const person = bidirectionalMap.getPersonByNodeId(node.id);

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