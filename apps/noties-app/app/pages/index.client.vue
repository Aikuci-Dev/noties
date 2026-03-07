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
const nodePersonDimension = { height: 80, width: 280 };
Graph.registerNode(NODE_PERSON, nodePerson(nodePersonDimension), true);
Graph.registerEdge(EDGE_LINE, line, true);

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

    const nodes = [
        createNodePerson({
            graph,
            options: { rank: "Founder & Chairman", name: "Pierre Omidyar", dimension: nodePersonDimension },
        }),
        createNodePerson({
            graph,
            options: { rank: "President & CEO", name: "Margaret C. Whitman", dimension: nodePersonDimension },
        }),
        createNodePerson({
            graph,
            options: { rank: "President, PayPal", name: "Scott Thompson", dimension: nodePersonDimension },
        }),
        createNodePerson({
            graph,
            options: { rank: "President, Ebay Global Marketplaces", name: "Devin Wenig", dimension: nodePersonDimension },
        }),
        createNodePerson({
            graph,
            options: { rank: "Senior Vice President Human Resources", name: "Jeffrey S. Skoll", dimension: nodePersonDimension },
        }),
        createNodePerson({
            graph,
            options: { rank: "Senior Vice President Controller", name: "Steven P. Westly", dimension: nodePersonDimension },
        }),
    ];
    const edges = [
        createEdgeLine({ graph, options: { source: nodes[0], target: nodes[1] } }),
        createEdgeLine({ graph, options: { source: nodes[1], target: nodes[2] } }),
        createEdgeLine({ graph, options: { source: nodes[1], target: nodes[3] } }),
        createEdgeLine({ graph, options: { source: nodes[1], target: nodes[4] } }),
        createEdgeLine({ graph, options: { source: nodes[1], target: nodes[5] } }),
    ];

    graph.resetCells([...nodes, ...removeFalsy(edges)]);
    layout({ graph, rankdir: dagreRankdir, gap: graphGap, node: { dimension: nodePersonDimension } });
    graph.centerContent();
}, { once: true });
</script>