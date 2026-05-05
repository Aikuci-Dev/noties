<template>
  <div class="tw:d-dock">
    <button
      v-for="item in items"
      :key="item.label"
      @click="onClick($event, item)"
      :class="{ 'tw:d-dock-active': item.isActive }"
    >
      <Icon v-if="item.icon" :name="item.icon" />
      <span class="tw:d-dock-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { BaseMenuItem } from "./menu";

import { setActive } from "./menu";

export type DockItem = Omit<BaseMenuItem, "children">;
</script>

<script setup lang="ts">
const { dockItems } = defineProps<{ dockItems: DockItem[] }>();
const items = ref(dockItems);

const onClick: DockItem["onClick"] = (originalEvent, value) => {
  setActive(items.value, value);
  value.onClick?.(originalEvent, value);
};
</script>
