<template>
  <div>
    <UiThemeController />

    <PersonForm ref="personFormEl" :people />
  </div>
</template>

<script setup lang="ts">
import { parsePeopleWithMeta } from "@noties/shared-schema";

const initialPeople = [
  {
    id: 1,
    name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt iste nisi vero eligendi. Veniam consequatur sunt possimus animi nulla nesciunt porro aliquam? Hic placeat consequuntur, molestias tenetur commodi praesentium corporis.",
    dateOfBirth: new Date().toISOString().slice(0, 10),
    dateOfDeath: new Date().toISOString().slice(0, 10),
    meta: { generationOrder: 10 },
  },
  {
    id: 2,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptatem cumque aperiam earum dolorem, voluptatibus asperiores amet! Laborum voluptas dolorem cupiditate doloremque cum incidunt eum pariatur dolorum! Aspernatur, qui sit.",
    meta: { generationOrder: 10 },
  },
  {
    id: 12,
    name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt iste nisi vero eligendi. Veniam consequatur sunt possimus animi nulla nesciunt porro aliquam? Hic placeat consequuntur, molestias tenetur commodi praesentium corporis. - Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptatem cumque aperiam earum dolorem, voluptatibus asperiores amet! Laborum voluptas dolorem cupiditate doloremque cum incidunt eum pariatur dolorum! Aspernatur, qui sit.",
    meta: { generationOrder: 10 },
  },
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

  {
    id: 1,
    name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt iste nisi vero eligendi. Veniam consequatur sunt possimus animi nulla nesciunt porro aliquam? Hic placeat consequuntur, molestias tenetur commodi praesentium corporis.",
    meta: { generationOrder: 10 },
  },
  {
    id: 2,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptatem cumque aperiam earum dolorem, voluptatibus asperiores amet! Laborum voluptas dolorem cupiditate doloremque cum incidunt eum pariatur dolorum! Aspernatur, qui sit.",
    meta: { generationOrder: 10 },
  },
  {
    id: 12,
    name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt iste nisi vero eligendi. Veniam consequatur sunt possimus animi nulla nesciunt porro aliquam? Hic placeat consequuntur, molestias tenetur commodi praesentium corporis. - Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptatem cumque aperiam earum dolorem, voluptatibus asperiores amet! Laborum voluptas dolorem cupiditate doloremque cum incidunt eum pariatur dolorum! Aspernatur, qui sit.",
    meta: { generationOrder: 10 },
  },
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

  {
    id: 1,
    name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt iste nisi vero eligendi. Veniam consequatur sunt possimus animi nulla nesciunt porro aliquam? Hic placeat consequuntur, molestias tenetur commodi praesentium corporis.",
    meta: { generationOrder: 10 },
  },
  {
    id: 2,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptatem cumque aperiam earum dolorem, voluptatibus asperiores amet! Laborum voluptas dolorem cupiditate doloremque cum incidunt eum pariatur dolorum! Aspernatur, qui sit.",
    meta: { generationOrder: 10 },
  },
  {
    id: 12,
    name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt iste nisi vero eligendi. Veniam consequatur sunt possimus animi nulla nesciunt porro aliquam? Hic placeat consequuntur, molestias tenetur commodi praesentium corporis. - Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptatem cumque aperiam earum dolorem, voluptatibus asperiores amet! Laborum voluptas dolorem cupiditate doloremque cum incidunt eum pariatur dolorum! Aspernatur, qui sit.",
    meta: { generationOrder: 10 },
  },
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
const people = parsePeopleWithMeta(initialPeople);

const personFormEl = useTemplateRef("personFormEl");

onMounted(async () => {
  await nextTick();
  personFormEl.value?.formWrapperEl?.focusTrap.activate();
});
</script>
