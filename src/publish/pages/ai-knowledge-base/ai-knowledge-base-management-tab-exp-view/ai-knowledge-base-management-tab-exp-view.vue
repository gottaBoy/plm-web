<template>
  <i-biz-view
    :context="props.context"
    :params="props.params"
    :modal="props.modal"
    :model-data="viewModel"
  >
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
  .ibiz-view--ai_knowledge_base_management_tab_exp_view {
    .ibiz-panel-container--view_header > .ibiz-row {
      flex-wrap: wrap;

      > .ibiz-col {
        flex: 1 1 100%;
        min-width: 0;
      }
    }

    .ibiz-panel-container--view_tabexppanel,
    .ibiz-panel-container--container2 {
      width: 100%;
      margin-right: 0 !important;
    }
  }
}
</style>
