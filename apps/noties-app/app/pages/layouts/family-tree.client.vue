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
        <AppFABAddPerson />
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
        <UButton label="Reset" color="warning" variant="outline" @click="personForm.reset" />
        <UButton label="Submit" color="success" @click="personForm.submit" :disabled="isDisabled" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts">
import type { People, PersonWithMeta } from "@noties/shared-type";
import type { DagreRankdir } from "@noties/x6";

const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

const initialPeople: People<PersonWithMeta> = [
  // { id: 0, name: "0",  partnerIds: [1, 2], childrenIds: [9, 8, 7, 6], meta: { partnerId: 1,generationOrder: 0 } } as PersonWithMeta,
  // { id: 0, name: "0", childrenIds: [9, 8, 7, 6, 5, 4, 3], meta: { generationOrder: 0 } } as PersonWithMeta,
  {
    id: 0,
    name: "0",
    partnerIds: [1, 2],
    childrenIds: [8, 7, 6, 5, 4, 3],
    meta: { partnerId: 1, generationOrder: 0 },
  } as PersonWithMeta,
  {
    id: 3,
    name: "1",
    gender: "M",
    partnerIds: [31],
    childrenIds: [33],
    meta: { partnerId: 31, generationOrder: 1 },
  } as PersonWithMeta,
  { id: 4, name: "2", meta: { generationOrder: 1 } } as PersonWithMeta,
  {
    id: 5,
    name: "3",
    partnerIds: [51],
    childrenIds: [54, 53, 52],
    meta: { partnerId: 51, generationOrder: 1 },
  } as PersonWithMeta,
  { id: 6, name: "4", meta: { generationOrder: 1 } } as PersonWithMeta,
  {
    id: 7,
    name: "5",
    partnerIds: [71],
    childrenIds: [72],
    meta: { partnerId: 71, generationOrder: 1 },
  } as PersonWithMeta,
  { id: 8, name: "6", meta: { generationOrder: 1 } } as PersonWithMeta,
  { id: 33, name: "1-2", partnerIds: [331], meta: { partnerId: 331, generationOrder: 2 } } as PersonWithMeta,
  { id: 52, name: "3-1", meta: { generationOrder: 2 } } as PersonWithMeta,
  {
    id: 53,
    name: "3-2",
    partnerIds: [531],
    childrenIds: [532],
    meta: { partnerId: 531, generationOrder: 2 },
  } as PersonWithMeta,
  { id: 54, name: "3-3", meta: { generationOrder: 2 } } as PersonWithMeta,
  {
    id: 72,
    name: "5-1",
    partnerIds: [721],
    childrenIds: [722],
    meta: { partnerId: 721, generationOrder: 2 },
  } as PersonWithMeta,
  { id: 532, name: "3-1-1", partnerIds: [5321], meta: { partnerId: 5321, generationOrder: 3 } } as PersonWithMeta,
  { id: 722, name: "5-1-1", partnerIds: [7221], meta: { partnerId: 7221, generationOrder: 3 } } as PersonWithMeta,
];
const initialPeoplePartner: People = [
  { id: 1, name: "Current 0'", childrenIds: [9, 8, 7, 6] } as PersonWithMeta,
  { id: 2, name: "0'", childrenIds: [5, 4, 3] } as PersonWithMeta,
  // { id: 1, name: "Current 0'", childrenIds: [8, 7, 6, 5, 4, 3]  } as PersonWithMeta,
  // { id: 1, name: "Current 0'", childrenIds: [9, 3, 6]  } as PersonWithMeta,
  // { id: 2, name: "0'", childrenIds: [5, 4, 3]  } as PersonWithMeta,

  { id: 31, name: "1'", gender: "F", childrenIds: [33] } as PersonWithMeta,
  // { id: 51, name: "3'", childrenIds: [59, 58, 57, 56, 55, 54, 53, 52]  } as PersonWithMeta,
  { id: 71, name: "5'", childrenIds: [79, 78, 77, 76, 75, 74, 73, 72] } as PersonWithMeta,

  { id: 331, name: "1-2'", childrenIds: [339, 338, 337, 336, 335, 334, 333, 332] } as PersonWithMeta,
  { id: 531, name: "3-2'", childrenIds: [539, 538, 537, 536, 535, 534, 533, 532] } as PersonWithMeta,

  { id: 5321, name: "3-1-1'" } as PersonWithMeta,
  { id: 7221, name: "5-1-1'" } as PersonWithMeta,
];
</script>

<script setup lang="ts">
import type { Graph, NodePersonData } from "@noties/x6";
import { addAnimation, addInteraction, createGraphInstance, familyTreeLayout, registerCells } from "@noties/x6";

import type { FormSchemaInput, FormSchemaOutput } from "~/components/app/person/Form.vue";

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
const person = shallowRef();
watch(modalOpen, (val) => {
  if (!val) person.value = undefined;
});
function handleNodePersonClick(data: NodePersonData) {
  const { original } = data;
  person.value = original;
  modalOpen.value = true;
}

const appPersonFormEl = useTemplateRef<FormInstance<FormSchemaInput, FormSchemaOutput> | null>("appPersonFormEl");
const personForm = useFormAction<FormSchemaInput, FormSchemaOutput>(appPersonFormEl, {
  onSubmit: async (values) => {
    console.log(values, values.id);
    if (values.id) console.log("Update");
    else console.log("Add");
    // TODO: Store to DB
    // if(values.id) await updatePerson(id, values);
    // else await addPerson(values);
  },
  onSettled: () => {
    modalOpen.value = false;
  },
});
const isDisabled = computed(() => toValue(personForm.isSubmitting));
</script>
