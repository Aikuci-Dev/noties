<template>
  <UApp>
    <UHeader />

    <UContainer class="tw:p-0!">
      <UMain class="tw:relative">
        <div v-if="alert" class="tw:top-0 tw:z-50 tw:absolute tw:w-full">
          <UAlert
            v-if="openAlert"
            v-model:open="openAlert"
            :title="alertDetails.title"
            color="info"
            class="tw:p-2 tw:rounded-none"
            close
          />
        </div>

        <div class="tw:h-[calc(100vh-var(--ui-header-height))]">
          <slot />
        </div>

        <div class="tw:bottom-0 tw:absolute tw:w-full tw:h-16">
          Toolbar
        </div>

        <AppInfo />
      </UMain>
    </UContainer>
  </UApp>
</template>

<script setup lang="ts">
const props = defineProps<
  {
    alert?: false;
    alertDetails?: never;
  } | {
    alert: true;
    alertDetails: { title: string };
  }
>();

const openAlert = ref<boolean>(true);
</script>
