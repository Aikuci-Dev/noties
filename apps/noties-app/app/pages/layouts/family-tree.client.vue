<template>
  <div class="tw:relative tw:h-screen">
    <div ref="graphEl"></div>

    <UModal
      v-model:open="modalOpen"
      fullscreen
      title="Add Person"
      description="Add new member to family tree"
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

<script setup lang="ts">
definePageMeta({ layout: "simple" });

import type { Graph } from "@antv/x6";

const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation

registration({ nodePersonDimension });

const initialPeopleByGeneration: PeopleByRank = {
  0: [
    // { id: 0, subtitle: "ROOT", title: "0", isDead: true, childrenIds: [9, 8, 7, 6, 5, 4, 3] },
    {
      id: 0,
      generationOrder: 0,
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
      generationOrder: 1,
      subtitle: "FIRST",
      title: "1",
      gender: "M",
      isDead: true,
      partnerId: 31,
      childrenIds: [39, 38, 37, 36, 35, 34, 33, 32],
    },
    { id: 4, generationOrder: 1, subtitle: "SECOND", title: "2" },
    {
      id: 5,
      generationOrder: 1,
      subtitle: "THIRD",
      title: "3",
      partnerId: 51,
      childrenIds: [59, 58, 57, 56, 55, 54, 53, 52],
    },
    { id: 6, generationOrder: 1, subtitle: "FORTH", title: "4" },
    {
      id: 7,
      generationOrder: 1,
      subtitle: "FIFTH",
      title: "5",
      partnerId: 71,
      childrenIds: [79, 78, 77, 76, 75, 74, 73, 72],
    },
    { id: 8, generationOrder: 1, subtitle: "SIXTH", title: "6" },
  ],
  2: [
    {
      id: 33,
      generationOrder: 2,
      subtitle: "FIRST SECOND",
      title: "1-2",
      partnerId: 331,
      childrenIds: [339, 338, 337, 336, 335, 334, 333, 332],
    },
    { id: 52, generationOrder: 2, subtitle: "THIRD FIRST", title: "3-1" },
    {
      id: 53,
      generationOrder: 2,
      subtitle: "THIRD SECOND",
      title: "3-2",
      partnerId: 531,
      childrenIds: [539, 538, 537, 536, 535, 534, 533, 532],
    },
    { id: 54, generationOrder: 2, subtitle: "THIRD THIRD", title: "3-3" },
    {
      id: 72,
      generationOrder: 2,
      subtitle: "FIFTH FIRST",
      title: "5-1",
      partnerId: 721,
      childrenIds: [729, 728, 727, 726, 725, 724, 723, 722],
    },
  ],
  3: [
    {
      id: 532,
      generationOrder: 3,
      subtitle: "THIRD FIRST FIRST",
      title: "3-1-1",
      partnerId: 5321,
      childrenIds: [5329, 5328, 5327, 5326, 5325, 5324, 5323, 5322],
    },
    {
      id: 722,
      generationOrder: 3,
      subtitle: "FIFTH FIRST FIRST",
      title: "5-1-1",
      partnerId: 7221,
      childrenIds: [7229, 7228, 7227, 7226, 7225, 7224, 7223, 7222],
    },
  ],
};
const initialPeoplePartner: People = [
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
const peopleByGeneration$ = ref<PeopleByRank>(initialPeopleByGeneration);
const peoplePartner$ = ref<People>(initialPeoplePartner);
const allPeople = computed(() => [...Object.values(peopleByGeneration$.value).flat(), ...peoplePartner$.value]);

const modalOpen = ref(false);

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
    peopleByRank: initialPeopleByGeneration,
    peoplePartner: initialPeoplePartner,
  });
  animation({ graph });
  graph.positionContent("top");
}, { once: true });

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const appPersonFormEl = useTemplateRef("appPersonFormEl");

async function handleAddPerson() {
  const validateFormResult = await appPersonFormEl.value?.validateForm();
  if (validateFormResult === false) return;

  function addPersonToGeneration(generation: number, person: Person) {
    peopleByGeneration$.value[generation]?.push(person);
  }
  function addPersonToParent(generation: number, parentId: number, id: number) {
    peopleByGeneration$.value[generation] = peopleByGeneration$.value[generation]?.map((person) => {
      if (person.id !== parentId) return person;

      person.childrenIds?.unshift(id);
      return person;
    }) ?? [];
  }
  const child: Person = {
    generationOrder: 1,
    id: getRandomInt(Number.MAX_SAFE_INTEGER),
    title: "Child",
    subtitle: "2026",
    parentIds: [0],
  };
  if (child.generationOrder) {
    const generation = child.generationOrder;
    addPersonToGeneration(generation, child);
    if (child.parentIds) {
      child.parentIds.forEach((parentId) => addPersonToParent(generation - 1, parentId, child.id));
    }
  }

  function getGenerationByPersonId(id: number) {
    const entry = Object.entries(peopleByGeneration$.value).find(([key, people]) =>
      people.some((person) => person.id === id)
    );

    return entry ? Number(entry[0]) : null;
  }
  function addPersonPartner(partner: Person) {
    if (!partner.partnerId) return;
    const generation = getGenerationByPersonId(partner.partnerId);
    if (generation === null) return;

    peopleByGeneration$.value[generation] = peopleByGeneration$.value[generation]?.map((person) => {
      if (person.id !== partner.partnerId) return person;

      person.partnerIds?.push(partner.id);
      if (!person.partnerId) person.partnerId = partner.id;
      return person;
    }) ?? [];

    peoplePartner$.value.push(partner);
  }
  const partner: Person = {
    generationOrder: 1,
    id: getRandomInt(Number.MAX_SAFE_INTEGER),
    title: "Partner",
    subtitle: "2026",
    partnerId: 8,
  };
  addPersonPartner(partner);
}

watch([peopleByGeneration$, peoplePartner$], ([peopleByGeneration, peoplePartner]) => {
  if (!graphRef.value) return;
  familyTreeLayout({ graph: graphRef.value, options: { rankdir: dagreRankdir, gap: gridSize } })({
    peopleByRank: peopleByGeneration,
    peoplePartner,
  });
  modalOpen.value = false;
}, { deep: true });
</script>
