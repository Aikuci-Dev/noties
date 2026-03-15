<template>
  <UNavigationMenu :items="items" />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "Layouts",
    icon: "i-lucide-box",
    to: "/layouts",
    active: true,
    children: [
      {
        label: "Simple",
        icon: "i-lucide-share-2",
        description: "Simple Layout.",
        to: "/layouts/simple",
      },
      {
        label: "Family Tree",
        icon: "i-lucide-git-fork",
        description: "Family Tree Layout.",
        to: "/layouts/family-tree",
      },
    ],
  },
]);
</script>
