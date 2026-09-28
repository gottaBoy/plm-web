import { defineComponent, h, resolveComponent, type PropType } from 'vue';
import type { IPanelItem } from '@ibiz/model-core';
import { useNamespace } from '@ibiz-template/vue3-util';
import { DataInfoTitleController } from './data-info-title.controller';

export const DataInfoTitle = defineComponent({
  name: 'IBizDataInfoTitle',
  props: {
    modelData: { type: Object as PropType<IPanelItem>, required: true },
    controller: { type: DataInfoTitleController, required: true },
  },
  setup() {
    return { ns: useNamespace('data-info-title') };
  },
  render() {
    const { model, state } = this.controller;
    return h('div', { class: this.ns.b() }, [
      h('div', {
        class: [this.ns.b('caption'), this.ns.is('show-icon', !!model.sysImage)],
      }, [
        model.sysImage && h(resolveComponent('iBizIcon'), {
          class: [this.ns.be('caption', 'icon')],
          icon: model.sysImage,
        }),
        h('span', null, [state.caption]),
      ]),
    ]);
  },
});
