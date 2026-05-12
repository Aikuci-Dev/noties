<template>
  <DefineTreeItemTemplate v-slot="{ item }">
    <template v-if="item.children">
      <Icon v-if="item.icon !== false" :name="item.icon ?? (item.isOpen ? 'lucide:folder-open' : 'lucide:folder')" />
      {{ item.label }}
    </template>
    <template v-else>
      <button @click="onClick($event, item)" class="tw:d-btn tw:justify-start tw:d-btn-ghost">
        <Icon v-if="item.icon !== false" :name="item.icon ?? 'lucide:file'" />
        {{ item.label }}
      </button>
    </template>
  </DefineTreeItemTemplate>

  <DefineTreeTemplate v-slot="{ items }">
    <li v-for="(item, index) in items" :key="item.label" :item :class="{ 'tw:d-menu-active': item.isActive }">
      <details
        v-if="item.children?.length"
        :open="item.isOpen"
        @toggle="onToggle($event, item)"
        @mouseenter="onMouseEnter($event, item)"
        @mouseleave="onMouseLeave($event, item)"
      >
        <summary>
          <ReuseTreeItemTemplate :item :index />
        </summary>

        <ul>
          <ReuseTreeTemplate :items="item.children" />
        </ul>
      </details>
      <template v-else>
        <ReuseTreeItemTemplate :item :index />
      </template>
    </li>
  </DefineTreeTemplate>

  <ul
    class="tw:d-menu tw:z-10 tw:w-full tw:rounded-box tw:bg-base-200"
    :class="{ 'tw:d-menu-horizontal': isHorizontal }"
  >
    <ReuseTreeTemplate :items />
  </ul>
</template>

<script lang="ts">
import type { BaseMenuItem } from "./menu";

import { setActive } from "./menu";

type ParentItem = {
  children: TreeItem[];
  isOpen?: boolean;
  onClick?: never;
  isActive?: never;
};
type LeafItem = {
  children?: never;
  isOpen?: never;
  onClick?: (originalEvent: MouseEvent, value: TreeItem) => void;
};

export type TreeItem = BaseMenuItem & (ParentItem | LeafItem);
</script>

<script setup lang="ts">
const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<{ items?: TreeItem[] }>();
const [DefineTreeItemTemplate, ReuseTreeItemTemplate] = createReusableTemplate<{
  item: TreeItem;
  index: number;
}>();

const { treeItems, isHorizontal, openOnHover } = defineProps<{
  treeItems: TreeItem[];
  isHorizontal?: boolean;
  openOnHover?: boolean;
}>();

const items = ref(treeItems);

const onClick: LeafItem["onClick"] = (originalEvent, value) => {
  setActive(items.value, value);
  value.onClick?.(originalEvent, value);
};

const onMouseEnter = (originalEvent: MouseEvent, value: TreeItem) => {
  if (openOnHover) value.isOpen = true;
};
const onMouseLeave = (originalEvent: MouseEvent, value: TreeItem) => {
  if (openOnHover) value.isOpen = false;
};
const onToggle = (originalEvent: ToggleEvent, value: TreeItem) => {
  value.isOpen = (originalEvent.target as HTMLDetailsElement).open;
};
</script>
