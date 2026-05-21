import { registerEditorProvider } from '@ibiz-template/runtime';
import { IBizAICode } from './monaco-editor/monaco-editor.mjs';
import { CodeEditorProvider } from './code-editor.provider.mjs';

"use strict";
var index = {
  install(app) {
    app.component("IBizAICode", IBizAICode);
    registerEditorProvider(
      "EDITOR_CUSTOMSTYLE_AI_CODE",
      () => new CodeEditorProvider()
    );
    registerEditorProvider(
      "EDITOR_CUSTOMSTYLE_AI_CODE_TEST",
      () => new CodeEditorProvider()
    );
  }
};

export { index as default };
