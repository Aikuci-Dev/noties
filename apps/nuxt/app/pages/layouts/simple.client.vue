<template>
  <div class="tw:relative tw:h-screen">
    <div ref="graphEl"></div>

    <div class="tw:absolute tw:inset-e-4 tw:inset-be-4">
      <UiFAB is-relative>
        <PersonAdd @click="showDialog = true" />
      </UiFAB>
    </div>

    <UiDialog ref="dialogFormEl" title="Add Person" subtitle="Add new member to chart" @close="showDialog = false">
      <PersonFormSimple v-if="showDialog" ref="personFormEl" :people :person>
        <template #action-buttons> &nbsp; </template>
      </PersonFormSimple>

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

import { Human } from "@noties/shared-schema";
import { addAnimation, addInteraction, createGraphInstance, registerCells, simpleLayout } from "@noties/x6";

const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

const KIND = Human.KINDS.Simple;
const initialPeople = [
  { id: 0, name: "0", isAccent: true, childrenIds: [9, 8, 7, 6, 5, 4, 3], meta: { kind: KIND } },
  { id: 3, name: "1", isAccent: true, gender: "M", childrenIds: [33], meta: { kind: KIND } },
  { id: 4, name: "2", isAccent: true, gender: "F", meta: { kind: KIND } },
  { id: 5, name: "3", isAccent: false, childrenIds: [59, 58, 57, 56, 55, 54, 53, 52], meta: { kind: KIND } },
  { id: 6, name: "4", isAccent: false, gender: "M", meta: { kind: KIND } },
  { id: 7, name: "5", isAccent: false, gender: "F", meta: { kind: KIND } },
  { id: 8, name: "6", childrenIds: [89, 88, 87, 86, 85, 84, 83, 82], meta: { kind: KIND } },
  { id: 33, name: "1-2", childrenIds: [339, 338, 337, 336, 335, 334, 333, 332], meta: { kind: KIND } },
  { id: 52, name: "3-1", meta: { kind: KIND } },
  { id: 53, name: "3-2", childrenIds: [532], meta: { kind: KIND } },
  { id: 54, name: "3-3", meta: { kind: KIND } },
  { id: 82, name: "5-1", childrenIds: [822], meta: { kind: KIND } },
  { id: 532, name: "3-1-1", meta: { kind: KIND } },
  { id: 822, name: "5-1-1", meta: { kind: KIND } },
];
const parsedPeople = Human.parsePeople(initialPeople, { kind: KIND });
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
