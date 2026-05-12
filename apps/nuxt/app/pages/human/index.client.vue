<template>
  <div>
    <UiMenuTree :tree-items />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from "~/components/ui/menu/Tree.vue";

const treeItems: TreeItem[] = [
  {
    label: "Layouts",
    icon: "lucide:box",
    isOpen: true,
    children: [
      {
        label: "Simple",
        icon: "lucide:share-2",
        onClick: () => navigateTo("/layouts/simple", { open: { target: "_blank" } }),
      },
      {
        label: "Family Tree",
        icon: "lucide:git-fork",
        onClick: () => navigateTo("/layouts/family-tree", { open: { target: "_blank" } }),
      },
    ],
  },
];
</script>
