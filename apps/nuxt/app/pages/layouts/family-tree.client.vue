<template>
  <div class="tw:relative tw:h-screen">
    <div ref="graphEl"></div>

    <div class="tw:absolute tw:inset-e-4 tw:inset-be-4">
      <UiFAB is-relative>
        <PersonAdd @click="showDialog = true" />
      </UiFAB>
    </div>

    <UiDialog
      ref="dialogFormEl"
      title="Add Person"
      subtitle="Add new member to family tree"
      @close="showDialog = false"
    >
      <PersonFormFamilyTree v-if="showDialog" ref="personFormEl" :people="allPeople" :person>
        <template #action-buttons> &nbsp; </template>
      </PersonFormFamilyTree>

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
import { addAnimation, addInteraction, createGraphInstance, familyTreeLayout, registerCells } from "@noties/x6";

const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

const KIND = Human.KINDS.FamilyTree;

const initialPeople = [
  // { id: 0, name: "0",  partnerIds: [1, 2], childrenIds: [9, 8, 7, 6], meta: { kind: KIND, partnerId: 1 } },
  // { id: 0, name: "0", childrenIds: [9, 8, 7, 6, 5, 4, 3], meta: { kind: KIND } },
  { id: 0, name: "0", partnerIds: [1, 2], childrenIds: [8, 7, 6, 5, 4, 3], meta: { kind: KIND, partnerId: 1 } },
  {
    id: 3,
    name: "1",
    gender: "M",
    dateOfBirth: "2025-05-12",
    dateOfDeath: "2026-05-12",
    parentIds: [0, 2],
    partnerIds: [31],
    childrenIds: [33],
    meta: { kind: KIND, partnerId: 31 },
  },
  { id: 4, name: "2", parentIds: [0, 2], meta: { kind: KIND } },
  {
    id: 5,
    name: "3",
    dateOfDeath: "2024-05-12",
    parentIds: [0, 2],
    partnerIds: [51],
    childrenIds: [54, 53, 52],
    meta: { kind: KIND, partnerId: 51 },
  },
  { id: 6, name: "4", parentIds: [0, 1], meta: { kind: KIND } },
  { id: 7, name: "5", parentIds: [0, 1], partnerIds: [71], childrenIds: [72], meta: { kind: KIND, partnerId: 71 } },
  { id: 8, name: "6", parentIds: [0, 1], meta: { kind: KIND } },
  { id: 33, name: "1-2", parentIds: [3, 31], partnerIds: [331], meta: { kind: KIND, partnerId: 331 } },
  { id: 52, name: "3-1", parentIds: [5, 51], meta: { kind: KIND } },
  {
    id: 53,
    name: "3-2",
    dateOfBirth: "2023-05-12",
    parentIds: [5, 51],
    partnerIds: [531],
    childrenIds: [532],
    meta: { kind: KIND, partnerId: 531 },
  },
  { id: 54, name: "3-3", parentIds: [5, 51], meta: { kind: KIND } },
  {
    id: 72,
    name: "5-1",
    parentIds: [7, 71],
    partnerIds: [721],
    childrenIds: [722],
    meta: { kind: KIND, partnerId: 721 },
  },
  { id: 532, name: "3-1-1", parentIds: [53, 531], partnerIds: [5321], meta: { kind: KIND, partnerId: 5321 } },
  { id: 722, name: "5-1-1", parentIds: [72, 721], partnerIds: [7221], meta: { kind: KIND, partnerId: 7221 } },
];
const initialPeoplePartner = [
  { id: 1, name: "Current 0'", childrenIds: [9, 8, 7, 6], meta: { kind: KIND, partnerId: 5321 } },
  { id: 2, name: "0'", childrenIds: [5, 4, 3], meta: { kind: KIND, partnerId: 5321 } },
  // { id: 1, name: "Current 0'", childrenIds: [8, 7, 6, 5, 4, 3] , meta: { kind: KIND, partnerId: 5321,  } },
  // { id: 1, name: "Current 0'", childrenIds: [9, 3, 6] , meta: { kind: KIND, partnerId: 5321,  } },
  // { id: 2, name: "0'", childrenIds: [5, 4, 3] , meta: { kind: KIND, partnerId: 5321,  } },

  { id: 31, name: "1'", gender: "F", childrenIds: [33], meta: { kind: KIND, partnerId: 5321 } },
  // { id: 51, name: "3'", childrenIds: [59, 58, 57, 56, 55, 54, 53, 52] , meta: { kind: KIND, partnerId: 5321,  } },
  { id: 71, name: "5'", childrenIds: [79, 78, 77, 76, 75, 74, 73, 72], meta: { kind: KIND, partnerId: 5321 } },

  { id: 331, name: "1-2'", meta: { kind: KIND, partnerId: 5321 } },
  { id: 531, name: "3-2'", meta: { kind: KIND, partnerId: 5321 } },

  { id: 5321, name: "3-1-1'", meta: { kind: KIND, partnerId: 5321 } },
  { id: 7221, name: "5-1-1'", meta: { kind: KIND, partnerId: 5321 } },
];
const parsedPeople = Human.parsePeople(initialPeople, { kind: KIND });
const parsedPeoplePartner = Human.parsePeople(initialPeoplePartner, { kind: KIND });
</script>

<script setup lang="ts">
// TODO: Get from DB
const people = ref(parsedPeople);
const peoplePartner = ref(parsedPeoplePartner);
const allPeople = computed(() => [...people.value, ...peoplePartner.value]);

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

  familyTreeLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({
    people: people.value,
    peoplePartner: peoplePartner.value,
  });

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
