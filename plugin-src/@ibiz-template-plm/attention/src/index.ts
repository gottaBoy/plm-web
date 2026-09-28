import './style.css';

import { withInstall } from '@ibiz-template/vue3-util';

import { registerEditorProvider } from '@ibiz-template/runtime';
import type { App } from 'vue';

import { Attention } from './attention';

import { AttentionProvider } from './provider';

const IBizAttention = withInstall(Attention, function (o) {
  o.component(Attention.name, Attention),
    registerEditorProvider(
      'EDITOR_CUSTOMSTYLE_ATTENTION',
      () => new AttentionProvider(),
    );
});

const AttentionPlugin = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(o: App) {
    o.use(IBizAttention);
  },
};

export { IBizAttention as IBizAttention, AttentionPlugin as default };
