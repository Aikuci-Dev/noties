<template>
  <div class="tw:relative tw:h-screen">
    <div ref="graphEl"></div>

    <UModal
      v-model:open="modalOpen"
      title="Add Person"
      description="Add new member to family tree"
      :ui='{ footer: "tw:justify-end" }'
    >
      <div class="tw:right-4 tw:bottom-4 tw:absolute">
        <AppX6FABAddPerson />
      </div>

      <template #body>
        <AppPersonForm ref="appPersonFormEl" :people="allPeople" :person>
          <template #action-buttons>
            &nbsp;
          </template>
        </AppPersonForm>
      </template>
      <template #footer="{ close }">
        <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts">
const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

const initialPeople: PeopleWithMeta = [
  // { id: 0, name: "0", partnerId: 1, partnerIds: [1, 2], childrenIds: [9, 8, 7, 6], meta: { generationOrder: 0 } },
  // { id: 0, name: "0", childrenIds: [9, 8, 7, 6, 5, 4, 3], meta: { generationOrder: 0 } },
  { id: 0, name: "0", partnerId: 1, partnerIds: [1, 2], childrenIds: [8, 7, 6, 5, 4, 3], meta: { generationOrder: 0 } },
  { id: 3, name: "1", gender: "M", partnerId: 31, partnerIds: [31], childrenIds: [33], meta: { generationOrder: 1 } },
  { id: 4, name: "2", meta: { generationOrder: 1 } },
  { id: 5, name: "3", partnerId: 51, partnerIds: [51], childrenIds: [54, 53, 52], meta: { generationOrder: 1 } },
  { id: 6, name: "4", meta: { generationOrder: 1 } },
  { id: 7, name: "5", partnerId: 71, partnerIds: [71], childrenIds: [72], meta: { generationOrder: 1 } },
  { id: 8, name: "6", meta: { generationOrder: 1 } },
  { id: 33, name: "1-2", partnerId: 331, partnerIds: [331], meta: { generationOrder: 2 } },
  { id: 52, name: "3-1", meta: { generationOrder: 2 } },
  { id: 53, name: "3-2", partnerId: 531, partnerIds: [531], childrenIds: [532], meta: { generationOrder: 2 } },
  { id: 54, name: "3-3", meta: { generationOrder: 2 } },
  { id: 72, name: "5-1", partnerId: 721, partnerIds: [721], childrenIds: [722], meta: { generationOrder: 2 } },
  { id: 532, name: "3-1-1", partnerId: 5321, partnerIds: [5321], meta: { generationOrder: 3 } },
  { id: 722, name: "5-1-1", partnerId: 7221, partnerIds: [7221], meta: { generationOrder: 3 } },
];

const initialPeoplePartner: People = [
  { id: 1, name: "Current 0'", childrenIds: [9, 8, 7, 6] },
  { id: 2, name: "0'", childrenIds: [5, 4, 3] },
  // { id: 1, name: "Current 0'", childrenIds: [8, 7, 6, 5, 4, 3] },
  // { id: 1, name: "Current 0'", childrenIds: [9, 3, 6] },
  // { id: 2, name: "0'", childrenIds: [5, 4, 3] },

  { id: 31, name: "1'", gender: "F", childrenIds: [33] },
  // { id: 51, name: "3'", childrenIds: [59, 58, 57, 56, 55, 54, 53, 52] },
  { id: 71, name: "5'", childrenIds: [79, 78, 77, 76, 75, 74, 73, 72] },

  { id: 331, name: "1-2'", childrenIds: [339, 338, 337, 336, 335, 334, 333, 332] },
  { id: 531, name: "3-2'", childrenIds: [539, 538, 537, 536, 535, 534, 533, 532] },

  { id: 5321, name: "3-1-1'" },
  { id: 7221, name: "5-1-1'" },
];
</script>

<script setup lang="ts">
import type { Graph } from "@antv/x6";

definePageMeta({ layout: "simple" });

// TODO: Get from DB
const people = ref(initialPeople);
const peoplePartner = ref(initialPeoplePartner);
const allPeople = computed(() => [...people.value, ...peoplePartner.value]);

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphEl = useTemplateRef("graphEl");
const graphRef = ref<Graph>();
let previousGraph: typeof graphRef.value;
watch(graphEl, () => {
  if (!graphEl.value) return;
  graphRef.value = createGraphInstance({
    container: graphEl.value, // The watch will be triggered when the component is available
    gridSize,
  });
}, { once: true });
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

const modalOpen = ref(false);
// const appPersonFormEl = useTemplateRef("appPersonFormEl");

const person = shallowRef();
function handleNodePersonClick(data: NodePersonData) {
  person.value = data;
  modalOpen.value = true;
}
watch(modalOpen, (val) => {
  if (!val) person.value = undefined;
});
</script>
