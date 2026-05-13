<template>
  <div class="tw:relative tw:min-h-svh">
    <div ref="graphEl"></div>

    <div class="tw:absolute tw:inset-e-4 tw:inset-be-4">
      <UiFAB is-relative>
        <PersonAdd @click="showDialog = true" />
      </UiFAB>
    </div>

    <UiDialog ref="dialogFormEl" title="Add Person" subtitle="Add new member to chart" @close="showDialog = false">
      <PersonFormSimple
        v-if="showDialog"
        ref="personFormEl"
        :people="data"
        :person
        :fallback-id="fallbackId"
        @error="console.error"
        @success="handleSuccess"
      >
        <template #action-buttons> &nbsp; </template>
      </PersonFormSimple>

      <template #action-buttons>
        <button @click="showDialog = false" class="tw:d-btn tw:d-btn-outline tw:d-btn-neutral">Cancel</button>
        <button @click="personFormEl?.resetForm" class="tw:d-btn tw:d-btn-dash tw:d-btn-outline tw:d-btn-warning">
          Reset
        </button>
        <button
          @click="personFormEl?.submitForm"
          :disabled="isActionDisabled"
          class="tw:d-btn tw:d-btn-soft tw:d-btn-success"
        >
          Submit
        </button>
      </template>
    </UiDialog>
  </div>
</template>

<script lang="ts">
const gridSize = 20;
// const nodePersonDimension = { height: gridSize * 3, width: gridSize * 12 }; // ratio (1:4)
const nodePersonDimension = { height: gridSize * 3, width: gridSize * 9 }; // ratio (1:3)
const dagreRankdir: DagreRankdir = "TB"; // vertical orientation
// const dagreRankdir: DagreRankdir = "LR"; // horizontal orientation
</script>

<script setup lang="ts">
import { useLiveQuery } from "@tanstack/vue-db";

import type { DagreRankdir, Graph, NodePersonData } from "@relaverse/x6";

import { Human } from "@relaverse/shared-schema";
import { isEmpty } from "@relaverse/shared-util";
import { addAnimation, addInteraction, createGraphInstance, registerCells, simpleLayout } from "@relaverse/x6";

const { data } = useLiveQuery(useHumanSimpleQuery);

const fallbackId = ref<Human.IdSchema>((1 + (data.value[data.value.length - 1]?.id ?? 0)) as Human.IdSchema);

const people = computed(() => {
  if (isEmpty(data.value)) return [];
  return Human.parsePeople(Human.KINDS.Simple, collectTree(data.value));
});

// https://nuxt.com/docs/4.x/api/components/client-only#accessing-html-elements
const graphEl = useTemplateRef("graphEl");
const graphRef = ref<Graph>();
let previousGraph: typeof graphRef.value;
watch(
  graphEl,
  () => {
    if (!graphEl.value) return;
    graphRef.value = createGraphInstance({
      container: graphEl.value, // The watch will be triggered when the component is available
      gridSize,
    });
  },
  { once: true },
);
watchEffect(() => {
  const graph = graphRef.value;
  if (!graph) return;

  simpleLayout({ graph, options: { rankdir: dagreRankdir, gap: gridSize } })({ people: people.value });

  if (graph !== previousGraph) {
    previousGraph = graph;

    addAnimation({ graph });
    addInteraction({ graph });
    graph.positionContent("top");
  }
});
registerCells({ nodePersonDimension, handleNodePersonClick });

const person = shallowRef();

const showDialog = ref(false);
watch(showDialog, async (isOpened) => {
  if (isOpened) {
    dialogFormEl.value?.dialogEl?.showModal();
    await nextTick();
    personFormEl.value?.formWrapperEl?.focusTrap.activate();
  } else {
    personFormEl.value?.formWrapperEl?.focusTrap.deactivate();
    dialogFormEl.value?.dialogEl?.close();

    person.value = undefined;
  }
});
function handleNodePersonClick(data: NodePersonData) {
  const { original } = data;
  person.value = original;
  showDialog.value = true;
}

const dialogFormEl = useTemplateRef("dialogFormEl");
const personFormEl = useTemplateRef("personFormEl");

const isActionDisabled = computed(() => personFormEl.value?.isSubmitting);

const handleSuccess = () => {
  fallbackId.value++;
  showDialog.value = false;
};
</script>
