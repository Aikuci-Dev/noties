<template>
  <div class="tw:relative tw:h-screen">
    <div ref="graphEl"></div>

    <div class="tw:absolute tw:inset-e-4 tw:inset-be-4">
      <UiFAB is-relative>
        <PersonAdd @click="showDialog = true" />
      </UiFAB>
    </div>

    <UiDialog ref="dialogFormEl" title="Add Person" subtitle="Add new member to chart" @close="showDialog = false">
      <PersonForm v-if="showDialog" ref="personFormEl" :people :person>
        <template #action-buttons> &nbsp; </template>
      </PersonForm>

      <template #action-buttons>
        <button @click="showDialog = false" class="tw:d-btn tw:d-btn-outline tw:d-btn-neutral">Cancel</button>
        <button @click="personFormEl?.resetForm" class="tw:d-btn tw:d-btn-dash tw:d-btn-outline tw:d-btn-warning">
          Reset
        </button>
        <button
          @click="personFormEl?.submitForm"
          :disabled="personFormEl?.isSubmitting"
          class="tw:d-btn tw:d-btn-soft tw:d-btn-success"
        >
          Submit
        </button>
      </template>
    </UiDialog>
  </div>
</template>

<script lang="ts">
import type { DagreRankdir, Graph, NodePersonData } from "@noties/x6";

import { parsePeopleWithMeta } from "@noties/shared-schema";
import { addAnimation, addInteraction, createGraphInstance, registerCells, simpleLayout } from "@noties/x6";

const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

const initialPeople = [
  { id: 0, name: "0", childrenIds: [9, 8, 7, 6, 5, 4, 3], meta: { generationOrder: 0 } },
  { id: 3, name: "1", gender: "M", childrenIds: [33], meta: { generationOrder: 1 } },
  { id: 4, name: "2", meta: { generationOrder: 1 } },
  { id: 5, name: "3", childrenIds: [59, 58, 57, 56, 55, 54, 53, 52], meta: { generationOrder: 1 } },
  { id: 6, name: "4", meta: { generationOrder: 1 } },
  { id: 7, name: "5", childrenIds: [79, 78, 77, 76, 75, 74, 73, 72], meta: { generationOrder: 1 } },
  { id: 8, name: "6", meta: { generationOrder: 1 } },
  {
    id: 33,
    name: "1-2",
    childrenIds: [339, 338, 337, 336, 335, 334, 333, 332],
    meta: { generationOrder: 2 },
  },
  { id: 52, name: "3-1", meta: { generationOrder: 2 } },
  { id: 53, name: "3-2", childrenIds: [532], meta: { generationOrder: 2 } },
  { id: 54, name: "3-3", meta: { generationOrder: 2 } },
  { id: 72, name: "5-1", childrenIds: [722], meta: { generationOrder: 2 } },
  { id: 532, name: "3-1-1", meta: { generationOrder: 3 } },
  { id: 722, name: "5-1-1", meta: { generationOrder: 3 } },
];
const parsedPeople = parsePeopleWithMeta(initialPeople);
</script>

<script setup lang="ts">
// TODO: Get from DB
const people = ref(parsedPeople);

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphEl = useTemplateRef("graphEl");
const graphRef = ref<Graph>();
let previousGraph: typeof graphRef.value;
watch(
  graphEl,
  () => {
    if (!graphEl.value) return;
    graphRef.value = createGraphInstance({
      container: graphEl.value, // The watch will be triggered when the component is available
      gridSize,
    });
  },
  { once: true },
);
watchEffect(() => {
  const graph = graphRef.value;
  if (!graph) return;

  simpleLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({ people: people.value });

  if (graph !== previousGraph) {
    previousGraph = graph;

    addAnimation({ graph });
    addInteraction({ graph });
    graph.positionContent("top");
  }
});
registerCells({ nodePersonDimension, handleNodePersonClick });

const person = shallowRef();

const showDialog = ref(false);
watch(showDialog, async (isOpened) => {
  if (isOpened) {
    dialogFormEl.value?.dialogEl?.showModal();
    await nextTick();
    personFormEl.value?.formWrapperEl?.focusTrap.activate();
  } else {
    personFormEl.value?.formWrapperEl?.focusTrap.deactivate();
    dialogFormEl.value?.dialogEl?.close();

    person.value = undefined;
  }
});
function handleNodePersonClick(data: NodePersonData) {
  const { original } = data;
  person.value = original;
  showDialog.value = true;
}

const dialogFormEl = useTemplateRef("dialogFormEl");
const personFormEl = useTemplateRef("personFormEl");
</script>
