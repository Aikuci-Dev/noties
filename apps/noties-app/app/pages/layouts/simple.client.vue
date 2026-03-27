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
        <AppX6FABAddPerson />
      </div>

      <template #body>
        <AppPersonForm ref="appPersonFormEl" :people="allPeople">
          <template #action-buttons>
            &nbsp;
          </template>
        </AppPersonForm>
      </template>
      <template #footer="{ close }">
        <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
        <UButton label="Submit" color="success" @click="handleAddPerson" />
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

registration({ nodePersonDimension });

const initialPeopleByRank: PeopleByRank = {
  0: [
    { id: 0, subtitle: "ROOT", title: "0", isDead: true, childrenIds: [9, 8, 7, 6, 5, 4, 3] },
  ],
  1: [
    { id: 3, subtitle: "FIRST", title: "1", gender: "M", isDead: true, childrenIds: [33] },
    { id: 4, subtitle: "SECOND", title: "2" },
    { id: 5, subtitle: "THIRD", title: "3", childrenIds: [59, 58, 57, 56, 55, 54, 53, 52] },
    { id: 6, subtitle: "FORTH", title: "4" },
    { id: 7, subtitle: "FIFTH", title: "5", childrenIds: [79, 78, 77, 76, 75, 74, 73, 72] },
    { id: 8, subtitle: "SIXTH", title: "6" },
  ],
  2: [
    { id: 33, subtitle: "FIRST SECOND", title: "1-2", childrenIds: [339, 338, 337, 336, 335, 334, 333, 332] },
    { id: 52, subtitle: "THIRD FIRST", title: "3-1" },
    { id: 53, subtitle: "THIRD SECOND", title: "3-2", childrenIds: [532] },
    { id: 54, subtitle: "THIRD THIRD", title: "3-3" },
    { id: 72, subtitle: "FIFTH FIRST", title: "5-1", childrenIds: [722] },
  ],
  3: [
    { id: 532, subtitle: "THIRD FIRST FIRST", title: "3-1-1" },
    { id: 722, subtitle: "FIFTH FIRST FIRST", title: "5-1-1" },
  ],
};
</script>

<script setup lang="ts">
import type { Graph } from "@antv/x6";
import type { FormSchemaOutput } from "~/components/app/person/Form.vue";

definePageMeta({ layout: "simple" });

// TODO: Get from DB
const peopleByRank$ = ref<PeopleByRank>(initialPeopleByRank);
const allPeople = computed(() => Object.values(peopleByRank$.value).flat());
const mapPersonGeneration = computed(() => {
  const map = new Map<Person["id"], number>();
  Object.entries(peopleByRank$.value).forEach(([key, people]) =>
    people.forEach((person) => {
      map.set(person.id, +key);
    })
  );
  return map;
});

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphEl = useTemplateRef("graphEl");
const graphRef = ref<Graph>();
let previousGraph: typeof graphRef.value;
watch(graphEl, () => {
  if (!graphEl.value) return;
  graphRef.value = graphInstance({
    container: graphEl.value, // The watch will be triggered when the component is available
    gridSize,
  });
}, { once: true });
watchEffect(() => {
  const graph = graphRef.value;
  if (!graph) return;

  simpleLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({
    peopleByRank: peopleByRank$.value,
  });

  if (graph !== previousGraph) {
    previousGraph = graph;

    animation({ graph });
    graph.positionContent("top");
  }
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const modalOpen = ref(false);
const appPersonFormEl = useTemplateRef("appPersonFormEl");

async function handleAddPerson() {
  const validateFormResult = await appPersonFormEl.value?.validateForm();
  if (!validateFormResult) return;
  const formValue = validateFormResult as FormSchemaOutput;

  // // TODO: Store to DB
  // DEPRECATED

  function getParentGenerationOrder(parent?: PersonParent) {
    if (!parent) return -1;

    let generationOrder = 0;
    parent.forEach((parentId) => {
      const order = mapPersonGeneration.value.get(parentId);
      if (order && order > generationOrder) generationOrder = order;
    });

    return generationOrder;
  }
  function addPersonToGeneration(generation: number, person: Person) {
    peopleByRank$.value[generation] ??= [];

    peopleByRank$.value[generation].push(person);
  }
  function addPersonToParent(generation: number, parentId: number, id: number) {
    peopleByRank$.value[generation] ??= [];

    peopleByRank$.value[generation] = peopleByRank$.value[generation].map((person) => {
      if (person.id !== parentId) return person;

      person.childrenIds ??= [];

      person.childrenIds.unshift(id);
      return person;
    }) ?? [];
  }
  function addChildrenToPerson(generation: number, parentId: number, id: number) {
  }

  const person: Person = {
    id: getRandomInt(Number.MAX_SAFE_INTEGER),
    title: formValue.title,
    subtitle: formValue.subtitle,
    parentIds: formValue.parent,
    partnerIds: formValue.partner,
    childrenIds: formValue.children,
  };

  const parentGeneration = getParentGenerationOrder(formValue.parent);
  const generation = parentGeneration + 1;
  if (generation > -1) {
    addPersonToGeneration(generation, person);
    if (person.parentIds) {
      person.parentIds.forEach((parentId) => addPersonToParent(generation - 1, parentId, person.id));
    }
  }

  modalOpen.value = false;
}
</script>
