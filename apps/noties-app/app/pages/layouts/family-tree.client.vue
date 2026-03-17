<template>
  <div ref="graphEl"></div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "simple" });

import type { Graph } from "@antv/x6";

const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

registration({ nodePersonDimension });

const peopleByGeneration: PeopleByRank = {
  0: [
    // { id: 0, subtitle: "ROOT", title: "0", isDead: true, childrenIds: [9, 8, 7, 6, 5, 4, 3] },
    {
      id: 0,
      subtitle: "ROOT",
      title: "0",
      isDead: true,
      partnerId: 1,
      partnerIds: [1, 2],
      childrenIds: [9, 8, 7, 6, 5, 4, 3],
    },
  ],
  1: [
    {
      id: 3,
      subtitle: "FIRST",
      title: "1",
      gender: "M",
      isDead: true,
      partnerId: 31,
      childrenIds: [39, 38, 37, 36, 35, 34, 33, 32],
    },
    { id: 4, subtitle: "SECOND", title: "2" },
    { id: 5, subtitle: "THIRD", title: "3", partnerId: 51, childrenIds: [59, 58, 57, 56, 55, 54, 53, 52] },
    { id: 6, subtitle: "FORTH", title: "4" },
    { id: 7, subtitle: "FIFTH", title: "5", partnerId: 71, childrenIds: [79, 78, 77, 76, 75, 74, 73, 72] },
    { id: 8, subtitle: "SIXTH", title: "6" },
  ],
  2: [
    {
      id: 33,
      subtitle: "FIRST SECOND",
      title: "1-2",
      partnerId: 331,
      childrenIds: [339, 338, 337, 336, 335, 334, 333, 332],
    },
    { id: 52, subtitle: "THIRD FIRST", title: "3-1" },
    {
      id: 53,
      subtitle: "THIRD SECOND",
      title: "3-2",
      partnerId: 531,
      childrenIds: [539, 538, 537, 536, 535, 534, 533, 532],
    },
    { id: 54, subtitle: "THIRD THIRD", title: "3-3" },
    {
      id: 72,
      subtitle: "FIFTH FIRST",
      title: "5-1",
      partnerId: 721,
      childrenIds: [729, 728, 727, 726, 725, 724, 723, 722],
    },
  ],
  3: [
    {
      id: 532,
      subtitle: "THIRD FIRST FIRST",
      title: "3-1-1",
      partnerId: 5321,
      childrenIds: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322],
    },
    {
      id: 722,
      subtitle: "FIFTH FIRST FIRST",
      title: "5-1-1",
      partnerId: 7221,
      childrenIds: [7229, 7228, 7227, 7226, 7225, 7224, 7223, 7222],
    },
  ],
};
const peoplePartner: People = [
  { id: 1, subtitle: "ROOT PARTNER CURRENT", title: "Current 0'", isDead: true, childrenIds: [9, 8, 7, 6] },
  { id: 2, subtitle: "ROOT PARTNER", title: "0'", isDead: true, childrenIds: [5, 4, 3] },
  // { id: 1, subtitle: "ROOT PARTNER CURRENT", title: "Current 0'", isDead: true, childrenIds: [9, 3, 6] },
  // { id: 2, subtitle: "ROOT PARTNER", title: "0'", isDead: true, childrenIds: [5, 4, 3] },

  {
    id: 31,
    subtitle: "FIRST PARTNER",
    title: "1'",
    gender: "F",
    isDead: true,
    childrenIds: [39, 38, 37, 36, 35, 34, 33, 32],
  },
  // { id: 51, subtitle: "THIRD PARTNER", title: "3'", childrenIds: [59, 58, 57, 56, 55, 54, 53, 52] },
  { id: 71, subtitle: "FIFTH PARTNER", title: "5'", childrenIds: [79, 78, 77, 76, 75, 74, 73, 72] },

  { id: 331, subtitle: "FIRST SECOND PARTNER", title: "1-2'", childrenIds: [339, 338, 337, 336, 335, 334, 333, 332] },
  { id: 531, subtitle: "THIRD SECOND PARTNER", title: "3-2'", childrenIds: [539, 538, 537, 536, 535, 534, 533, 532] },

  {
    id: 5321,
    subtitle: "THIRD FIRST FIRST PARTNER",
    title: "3-1-1'",
    childrenIds: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322],
  },
  {
    id: 7221,
    subtitle: "FIFTH FIRST FIRST PARTNER",
    title: "5-1-1'",
    childrenIds: [7229, 7228, 7227, 7226, 7225, 7224, 7223, 7222],
  },
];

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphEl = useTemplateRef("graphEl");
const graphRef = ref<Graph>();
watch(graphEl, () => {
  if (!graphEl.value) return;
  graphRef.value = graphInstance({
    container: graphEl.value, // The watch will be triggered when the component is available
    gridSize,
  });
  const graph = graphRef.value;

  familyTreeLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({
    peopleByRank: peopleByGeneration,
    peoplePartner,
  });
  animation({ graph });
  graph.positionContent("top");
}, { once: true });
</script>
