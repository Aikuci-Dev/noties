<template>
  <UContainer class="tw:h-screen">
    <UPage class="tw:size-full" :ui='{ center: "tw:size-full" }'>
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
const gridSize = 20;
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

registration({ nodePersonDimension });

const peopleByRank: PeopleByRank = {
  0: [
    { id: 0, subtitle: "ROOT", title: "0", isDead: true, children: [9, 8, 7, 6, 5, 4, 3] },
  ],
  1: [
    { id: 3, subtitle: "FIRST", title: "1", gender: "M", isDead: true, children: [39, 38, 37, 36, 35, 34, 33, 32] },
    { id: 4, subtitle: "SECOND", title: "2" },
    { id: 5, subtitle: "THIRD", title: "3", children: [59, 58, 57, 56, 55, 54, 53, 52] },
    { id: 6, subtitle: "FORTH", title: "4" },
    { id: 7, subtitle: "FIFTH", title: "5", children: [79, 78, 77, 76, 75, 74, 73, 72] },
    { id: 8, subtitle: "SIXTH", title: "6" },
  ],
  2: [
    { id: 33, subtitle: "FIRST SECOND", title: "1-2", children: [339, 338, 337, 336, 335, 334, 333, 332] },
    { id: 52, subtitle: "THIRD FIRST", title: "3-1" },
    { id: 53, subtitle: "THIRD SECOND", title: "3-2", children: [539, 538, 537, 536, 535, 534, 533, 532] },
    { id: 54, subtitle: "THIRD THIRD", title: "3-3" },
    { id: 72, subtitle: "FIFTH FIRST", title: "5-1", children: [729, 728, 727, 726, 725, 724, 723, 722] },
  ],
  3: [
    {
      id: 532,
      subtitle: "THIRD FIRST FIRST",
      title: "3-1-1",
      children: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322],
    },
    {
      id: 722,
      subtitle: "FIFTH FIRST FIRST",
      title: "5-1-1",
      children: [7229, 7228, 7227, 7226, 7225, 7224, 7223, 7222],
    },
  ],
};

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphRef = useTemplateRef("graph");
watch(graphRef, () => {
  const graph = graphInstance({
    container: graphRef.value!, // The watch will be triggered when the component is available
    gridSize,
  });
  if (!graph) return;

  simpleLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({ peopleByRank });
  animation({ graph });
  graph.positionContent("top");
}, { once: true });
</script>
