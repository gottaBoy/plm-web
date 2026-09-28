import './style.css';
import type { App } from 'vue';

import { registerEditorProvider } from '@ibiz-template/runtime';

import { AutoRules } from './auto-rules';

import { AutoRulesProvider } from './auto-rules.provider';

const AutoRulesPlugin = {
  install(app: App): void {
    app.component(AutoRules.name!, AutoRules);
    registerEditorProvider(
      'EDITOR_CUSTOMSTYLE_AUTO_RULES',
      () => new AutoRulesProvider(),
    );
  },
};

export { AutoRulesPlugin as default };
