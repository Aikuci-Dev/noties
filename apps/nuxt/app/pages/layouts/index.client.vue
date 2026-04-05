<template>
  <UTree :items="items" />
</template>

<script setup lang="ts">
import type { TreeItem } from "@nuxt/ui";

const items: TreeItem[] = [
  {
    label: "Layouts",
    defaultExpanded: true,
    children: [
      {
        label: "Simple",
        icon: "i-lucide-share-2",
        onSelect: () => navigateTo("/layouts/simple", { open: { target: "_blank" } }),
      },
      {
        label: "Family Tree",
        icon: "i-lucide-git-fork",
        onSelect: () => navigateTo("/layouts/family-tree", { open: { target: "_blank" } }),
      },
    ],
  },
];
</script>
