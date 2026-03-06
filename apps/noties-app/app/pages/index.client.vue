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
import type { Cell, Node } from "@antv/x6";
import { Dom, Graph } from "@antv/x6";
import dagre from "@dagrejs/dagre";

Graph.registerNode(
    "org-node",
    {
        width: 260,
        height: 88,
        markup: [
            {
                tagName: "rect",
                attrs: { class: "card" },
            },
            {
                tagName: "image",
                attrs: { class: "image" },
            },
            {
                tagName: "text",
                attrs: { class: "rank" },
            },
            {
                tagName: "text",
                attrs: { class: "name" },
            },
        ],
        attrs: {
            ".card": {
                rx: 10,
                ry: 10,
                refWidth: "100%",
                refHeight: "100%",
                fill: "#5F95FF",
                stroke: "#5F95FF",
                strokeWidth: 1,
                pointerEvents: "visiblePainted",
            },
            ".image": {
                x: 16,
                y: 16,
                width: 56,
                height: 56,
                opacity: 0.7,
            },
            ".rank": {
                refX: 0.95,
                refY: 0.5,
                fill: "#fff",
                fontFamily: "Courier New",
                fontSize: 13,
                textAnchor: "end",
                textVerticalAnchor: "middle",
            },
            ".name": {
                refX: 0.95,
                refY: 0.7,
                fill: "#fff",
                fontFamily: "Arial",
                fontSize: 14,
                fontWeight: "600",
                textAnchor: "end",
            },
        },
    },
    true,
);
Graph.registerEdge(
    "org-edge",
    {
        zIndex: -1,
        attrs: {
            line: {
                strokeWidth: 2,
                stroke: "#A2B1C3",
                sourceMarker: null,
                targetMarker: null,
            },
        },
    },
    true,
);

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphRef = useTemplateRef("graph");
watch(graphRef, () => {
    const graph = new Graph({
        container: graphRef.value!, // The watch will be triggered when the component is available
        virtual: true,
        interacting: false,
        autoResize: true,
        grid: {
            visible: true,
            type: "dot",
            size: 20,
            args: [{ color: "#cde", thickness: 2 }],
        },
    });

    const male = "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ";
    const female = "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ";
    const dir: "LR" | "RL" | "TB" | "BT" = "TB";

    function createNode(rank: string, name: string, image: string) {
        return graph.createNode({
            shape: "org-node",
            attrs: {
                ".image": { xlinkHref: image },
                ".rank": { text: Dom.breakText(rank, { width: 160, height: 45 }) },
                ".name": { text: Dom.breakText(name, { width: 160, height: 45 }) },
            },
        });
    }

    function createEdge(source: Cell, target: Cell) {
        return graph.createEdge({ shape: "org-edge", source: { cell: source.id }, target: { cell: target.id } });
    }

    function layout() {
        const g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 });
        g.setDefaultEdgeLabel(() => ({}));

        const height = 90;
        const width = 260;
        const nodes = graph.getNodes();
        const edges = graph.getEdges();
        nodes.forEach((node) => {
            g.setNode(node.id, { height, width });
        });
        edges.forEach((edge) => {
            g.setEdge(edge.getSourceCellId(), edge.getTargetCellId());
        });

        dagre.layout(g);

        g.nodes().forEach((id) => {
            const node = graph.getCellById(id) as Node;
            if (node) {
                const pos = g.node(id);
                node.position(pos.x, pos.y);
            }
        });
        edges.forEach((edge) => {
            const source = edge.getSourceNode();
            const target = edge.getTargetNode();
            if (!source || !target) return;

            const sourceBBox = source.getBBox();
            const targetBBox = target.getBBox();
            if ((dir === "LR" || dir === "RL") && sourceBBox.y !== targetBBox.y) {
                const gap = dir === "LR"
                    ? targetBBox.x - sourceBBox.width - sourceBBox.x
                    : targetBBox.x + targetBBox.width - sourceBBox.x;
                const fix = dir === "LR" ? sourceBBox.width : 0;
                const x = sourceBBox.x + fix + gap / 2;
                edge.setVertices([{ x, y: sourceBBox.center.y }, { x, y: targetBBox.center.y }]);
            } else if ((dir === "TB" || dir === "BT") && sourceBBox.x !== targetBBox.x) {
                const gap = dir === "TB"
                    ? targetBBox.y - sourceBBox.height - sourceBBox.y
                    : targetBBox.y + targetBBox.height - sourceBBox.y;
                const fix = dir === "TB" ? sourceBBox.height : 0;
                const y = sourceBBox.y + fix + gap / 2;
                edge.setVertices([{ x: sourceBBox.center.x, y }, { x: targetBBox.center.x, y }]);
            } else edge.setVertices([]);
        });
    }

    const nodes = [
        createNode("Founder & Chairman", "Pierre Omidyar", male),
        createNode("President & CEO", "Margaret C. Whitman", female),
        createNode("President, PayPal", "Scott Thompson", male),
        createNode("President, Ebay Global Marketplaces", "Devin Wenig", male),
        createNode("Senior Vice President Human Resources", "Jeffrey S. Skoll", male),
        createNode("Senior Vice President Controller", "Steven P. Westly", male),
    ];
    const edges = [
        createEdge(nodes[0]!, nodes[1]!),
        createEdge(nodes[1]!, nodes[2]!),
        createEdge(nodes[1]!, nodes[3]!),
        createEdge(nodes[1]!, nodes[4]!),
        createEdge(nodes[1]!, nodes[5]!),
    ];
    graph.resetCells([...nodes, ...edges]);
    layout();
    graph.centerContent();
}, { once: true });
</script>