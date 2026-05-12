<template>
  <dialog ref="dialogEl" class="tw:d-modal" :class="isMobile ? 'tw:d-modal-bottom' : 'tw:d-modal-middle'">
    <div class="tw:d-modal-box">
      <div>
        <h3 class="tw:text-lg tw:font-bold">{{ title }}</h3>
        <p v-if="subtitle" class="tw:py-4 tw:text-muted">{{ subtitle }}</p>

        <button
          v-if="!isMobile"
          @click="dialogEl?.close()"
          class="tw:d-btn tw:absolute tw:inset-e-2 tw:inset-bs-2 tw:d-btn-circle tw:d-btn-ghost tw:d-btn-sm"
        >
          ✕
        </button>
      </div>

      <slot />

      <div class="tw:d-modal-action">
        <slot name="action-buttons">
          <div class="tw:flex tw:justify-end">
            <button @click="dialogEl?.close()" class="tw:d-btn tw:d-btn-outline tw:d-btn-neutral">Close</button>
          </div>
        </slot>
      </div>
    </div>

    <form v-if="shouldCloseOnOutsideClick" method="dialog" class="tw:d-modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smallerOrEqual("sm");

const {
  title,
  subtitle,
  shouldCloseOnOutsideClick = true,
} = defineProps<{
  title: string;
  subtitle?: string;
  shouldCloseOnOutsideClick?: true;
}>();

const dialogEl = useTemplateRef<HTMLDialogElement>("dialogEl");

// // Known BUG: https://github.com/vueuse/vueuse/issues/5355
// onClickOutside(dialogEl, () => dialogEl.value?.close());

defineExpose({ dialogEl });
</script>
