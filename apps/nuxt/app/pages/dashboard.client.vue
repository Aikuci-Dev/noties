<template>
  <div>
    <UiThemeController />
    <UiMenuTree is-horizontal :tree-items />
    <UiMenuDock :dock-items />
  </div>
</template>

<script setup lang="ts">
import type { DockItem } from "~/components/ui/menu/Dock.vue";
import type { TreeItem } from "~/components/ui/menu/Tree.vue";

const treeItems: TreeItem[] = [
  {
    label: "Layouts",
    icon: "lucide:box",
    children: [
      {
        label: "Simple",
        icon: "lucide:share-2",
        onClick: () => navigateTo("/layouts/simple"),
      },
      {
        label: "Family Tree",
        icon: "lucide:git-fork",
        onClick: () => navigateTo("/layouts/family-tree"),
      },
    ],
  },
];

const dockItems: DockItem[] = [{ label: "Layouts", icon: "lucide:box", onClick: () => navigateTo("/layouts") }];
</script>
