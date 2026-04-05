<template>
  <div class="tw:relative tw:h-screen">
    <div ref="graphEl"></div>

    <UModal
      v-model:open="modalOpen"
      title="Add Person"
      description="Add new member to chart"
      :ui='{ footer: "tw:justify-end" }'
    >
      <div class="tw:right-4 tw:bottom-4 tw:absolute">
        <AppFABAddPerson />
      </div>

      <template #body>
        <AppPersonForm ref="appPersonFormEl" :people :person>
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
import { parsePeopleWithMeta } from "@noties/shared-schema";
import type { DagreRankdir } from "@noties/x6";

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
  { id: 33, name: "1-2", childrenIds: [339, 338, 337, 336, 335, 334, 333, 332], meta: { generationOrder: 2 } },
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
import type { Graph, NodePersonData } from "@noties/x6";
import { addAnimation, addInteraction, createGraphInstance, registerCells, simpleLayout } from "@noties/x6";

import type { PersonFormSchemaInput, PersonFormSchemaOutput } from "@noties/shared-schema";

// TODO: Get from DB
const people = ref(parsedPeople);

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

  simpleLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({ people: people.value });

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

const appPersonFormEl = useTemplateRef<FormInstance<PersonFormSchemaInput, PersonFormSchemaOutput> | null>(
  "appPersonFormEl",
);
const personForm = useFormAction<PersonFormSchemaInput, PersonFormSchemaOutput>(appPersonFormEl, {
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
