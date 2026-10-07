<template>
  <i-biz-view
    :context="props.context"
    :params="props.params"
    :modal="props.modal"
    :model-data="viewModel"
  >
    <template #pickupviewpanel="slotProps">
      <i-biz-pickup-view-panel-control v-bind="slotProps" />
    </template>
    <template #simplelist="slotProps">
      <i-biz-control-shell v-bind="slotProps" />
    </template>
    <template #treeexpbar="slotProps">
      <i-biz-tree-exp-bar-control v-bind="slotProps" />
    </template>
  </i-biz-view>
</template>
<script setup lang="ts">
import { IModal } from '@ibiz-template/runtime';
import { defineProps, withDefaults } from 'vue';

interface Props {
  model: IModel;
  context?: IContext;
  params?: IParams;
  modal?: IModal;
}
const props = withDefaults(defineProps<Props>(), {});

const viewModel = props.model;
</script>

<style lang="scss">
@media (max-width: 767px) {
  .ibiz-view--user_choose_mpick_up_view {
    .ibiz-panel-container--container3 {
      flex-direction: column;
      min-width: 0;

      > .ibiz-row {
        /* The model renders an inline row direction. */
        flex-direction: column !important;
        min-height: 0;

        > .ibiz-col {
          flex: 0 0 auto;
          width: 100% !important;
          min-width: 0;
          max-width: 100%;
        }

        > .ibiz-col:first-child {
          flex: 0 0 140px;
          min-height: 0;
        }

        > .ibiz-col:last-child {
          flex: 1 1 auto;
          min-height: 240px;
        }
      }
    }

    .ibiz-panel-container--container6 {
      height: 100%;
      width: 100% !important;
      max-height: 140px;
      overflow: auto;
    }

    .ibiz-panel-view-content--container7 {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      min-height: 240px;
    }
  }
}
</style>
